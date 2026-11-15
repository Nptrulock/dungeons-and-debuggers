// Question bank validator: node validate.js
const DD = require('./count.js');
const MC = ['mc','out','prompt','diff','git','err'];
let errs = [], ids = new Set(), n = 0;
const tracks = new Set(DD.tracks.map(t => t.id));
for (const u of DD.units) {
  const where = u.id;
  if (ids.has(u.id)) errs.push('dup unit ' + u.id); ids.add(u.id);
  if (!tracks.has(u.track)) errs.push(where + ' bad track');
  if (!(u.tier >= 1 && u.tier <= 5)) errs.push(where + ' bad tier');
  if (u.qs.length < 5) errs.push(where + ' too few questions ' + u.qs.length);
  u.terms.forEach(t => { if (!DD.glossary[t]) errs.push(where + ' missing glossary ' + t); });
  const seenQ = new Set();
  u.qs.forEach((q, i) => {
    n++; const w = where + '#' + i + ' (' + q[0] + ')';
    const [type, text] = q;
    if (typeof text !== 'string' || text.length < 5) errs.push(w + ' bad text');
    let expl;
    if (MC.includes(type)) {
      const o = q[2]; expl = q[3];
      if (!Array.isArray(o) || o.length < 2 || o.length > 5) errs.push(w + ' options');
      else if (new Set(o).size !== o.length) errs.push(w + ' dup options');
      if (q[4] !== undefined && typeof q[4] !== 'string') errs.push(w + ' code');
      if (q.length > 5) errs.push(w + ' extra fields');
    } else if (type === 'tf') {
      if (typeof q[2] !== 'boolean') errs.push(w + ' tf answer'); expl = q[3];
    } else if (type === 'order') {
      const o = q[2]; expl = q[3];
      if (!Array.isArray(o) || o.length < 3 || new Set(o).size !== o.length) errs.push(w + ' order items');
    } else if (type === 'fill') {
      const code = q[2], ans = q[3], dis = q[4]; expl = q[5];
      const blanks = (code.match(/___/g) || []).length;
      if (blanks < 1 || blanks !== ans.length) errs.push(w + ' blanks ' + blanks + ' vs ' + ans.length);
      if (!Array.isArray(dis) || dis.length < 2) errs.push(w + ' distractors');
      if (new Set([...ans, ...dis]).size !== ans.length + dis.length) errs.push(w + ' dup tokens');
    } else if (type === 'match') {
      const p = q[2]; expl = q[3];
      if (!Array.isArray(p) || p.length < 2 || p.length > 5) errs.push(w + ' pairs');
      else { if (new Set(p.map(x => x[0])).size !== p.length || new Set(p.map(x => x[1])).size !== p.length) errs.push(w + ' dup pair sides'); p.forEach(x => { if (x.length !== 2) errs.push(w + ' pair shape'); }); }
    } else if (type === 'bug') {
      const lines = q[2], a = q[3]; expl = q[4];
      if (!Array.isArray(lines) || lines.length < 2) errs.push(w + ' lines');
      if (!Number.isInteger(a) || a < 0 || a >= lines.length) errs.push(w + ' bug index');
    } else errs.push(w + ' unknown type');
    if (typeof expl !== 'string' || expl.length < 15) errs.push(w + ' missing/short explanation');
    if (seenQ.has(text + JSON.stringify(q[2]))) errs.push(w + ' duplicate question'); seenQ.add(text + JSON.stringify(q[2]));
  });
}
// each tier/track that exists should be reachable, every tier has content
for (let t = 1; t <= 5; t++) if (!DD.units.some(u => u.tier === t)) errs.push('tier ' + t + ' empty');
const byType = {}; DD.units.forEach(u => u.qs.forEach(q => byType[q[0]] = (byType[q[0]] || 0) + 1));
const byTier = {}; DD.units.forEach(u => byTier[u.tier] = (byTier[u.tier] || 0) + u.qs.length);
console.log('questions', n, 'units', DD.units.length, 'glossary', Object.keys(DD.glossary).length);
console.log('by type', byType); console.log('by tier', byTier);
if (errs.length) { console.log('ERRORS', errs.length); errs.forEach(e => console.log(' -', e)); process.exit(1); }
console.log('VALID ✔');
