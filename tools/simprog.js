// Simulates challenge progression rules (track unlocks, tier gates, boss requirement) to prove nothing deadlocks.
const ctx = require('./loadch.js')(); const C = ctx.CHD;
const TR = {}; C.list.forEach(c => { if (!c.boss) (TR[c.t] = TR[c.t] || []).push(c); });
Object.keys(TR).forEach(t => { TR[t] = TR[t].map((c, i) => [c, i]).sort((a, b) => a[0].tier - b[0].tier || a[1] - b[1]).map(x => x[0]); });
const need = {}; C.tracks.forEach(t => need[t.id] = t.need);
let tier = 0; const solved = {}; let n = 0; const log = [];
const open = c => { const l = TR[c.t]; if (l[0].tier > tier + 1 || n < need[c.t] || c.tier > tier + 1) return false; const i = l.indexOf(c); return i === 0 || solved[l[i - 1].id]; };
for (;;) {
  const o = C.list.filter(c => !c.boss && !solved[c.id] && open(c));
  if (o.length) { solved[o[0].id] = 1; n++; continue; }
  const T = tier + 1; if (T > 5) break;
  const tc = C.list.filter(c => c.tier === T && !c.boss), s = tc.filter(c => solved[c.id]).length, nd = Math.ceil(tc.length * 0.7);
  log.push(`Tier ${T} boss: ${s}/${tc.length} tier-${T} solved (need ${nd}), total solved ${n}`);
  if (s >= nd) tier = T; else { log.push('STUCK'); break; }
}
console.log(log.join('\n')); console.log('final tier', tier, 'solved', n, 'of', C.list.filter(c => !c.boss).length);
const left = C.list.filter(c => !c.boss && !solved[c.id]).map(c => c.id); if (left.length) console.log('unreached', left);
