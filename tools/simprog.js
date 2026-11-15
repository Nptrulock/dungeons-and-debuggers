// Simulates progression rules (track unlocks, tier gates, boss build + mastery requirement, bot module gates) to prove nothing deadlocks.
// Assumes the player practices every unlocked concept to Practiced before each boss.
const ctx = require('./loadch.js')(); const C = ctx.CHD, DR = ctx.DRILLS;
const builds = C.list.filter(c => !c.boss && !c.bot);
const TR = {}; builds.forEach(c => { (TR[c.t] = TR[c.t] || []).push(c); });
Object.keys(TR).forEach(t => { TR[t] = TR[t].map((c, i) => [c, i]).sort((a, b) => a[0].tier - b[0].tier || a[1] - b[1]).map(x => x[0]); });
const need = {}; C.tracks.forEach(t => need[t.id] = t.need);
let tier = 0; const solved = {}; let n = 0; const log = []; let ok = true;
const open = c => { const l = TR[c.t]; if (l[0].tier > tier + 1 || n < need[c.t] || c.tier > tier + 1) return false; const i = l.indexOf(c); return i === 0 || solved[l[i - 1].id]; };
const unlocked = g => g.from.some(id => solved[id]);
for (;;) {
  const o = builds.filter(c => !solved[c.id] && open(c));
  if (o.length) { solved[o[0].id] = 1; n++; continue; }
  const T = tier + 1; if (T > 5) break;
  const tc = builds.filter(c => c.tier === T), s = tc.filter(c => solved[c.id]).length, nd = Math.ceil(tc.length * 0.7);
  const cs = DR.gens.filter(g => DR.tierOf(g) === T), cu = cs.filter(unlocked).length, cn = Math.ceil(cs.length * 0.5);
  log.push(`Tier ${T} boss: ${s}/${tc.length} builds (need ${nd}); concepts unlocked ${cu}/${cs.length} (need ${cn} Practiced); total solved ${n}`);
  if (s >= nd && cu >= cn) tier = T; else { log.push('STUCK'); ok = false; break; }
}
console.log(log.join('\n')); console.log('final tier', tier, 'solved', n, 'of', builds.length);
const left = builds.filter(c => !solved[c.id]).map(c => c.id); if (left.length) { console.log('unreached', left); ok = false; }
const lockedC = DR.gens.filter(g => !unlocked(g)).map(g => g.id); if (lockedC.length) { console.log('concepts never unlocked', lockedC); ok = false; }
// bot modules: every need concept must be unlockable, every `after` must exist, no cycles
const mods = C.list.filter(c => c.bot), inst = {};
for (let pass = 0; pass < mods.length + 1; pass++) mods.forEach(m => { if (!inst[m.id] && m.bot.need.every(id => DR.byId[id] && unlocked(DR.byId[id])) && (m.bot.after || []).every(a => inst[a]) && m.tier <= tier + 1) inst[m.id] = pass + 1; });
const stuck = mods.filter(m => !inst[m.id]).map(m => m.id);
console.log('bot modules installable', Object.keys(inst).length, '/', mods.length, stuck.length ? 'STUCK ' + stuck : '');
if (stuck.length) ok = false;
console.log(ok ? 'OK: no deadlocks' : 'PROBLEM'); process.exit(ok ? 0 : 1);
