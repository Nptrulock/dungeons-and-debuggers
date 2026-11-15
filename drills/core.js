// Mastery drills: procedurally generated, applied tasks. Each generator turns a seed into a small challenge
// (same format as CH(), same sandboxes) with only a terse task tag, a minimal starting state, and tests.
(function (root) {
'use strict';
var DR = root.DRILLS = { gens: [], byId: {}, list: [] };
function hash(s) { s = String(s); var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function RNG(seed) {
  var s = (seed >>> 0) || 1;
  function f() { s = (s + 0x6D2B79F5) | 0; var t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
  function int(a, b) { return a + Math.floor(f() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(f() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(f() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function sample(a, k) { return shuffle(a).slice(0, k); }
  function uniq(a) { var seen = {}; return a.filter(function (x) { var k = typeof x + ':' + x; if (seen[k]) return false; seen[k] = 1; return true; }); }
  // a tappable slot: the starting value is always one of the wrong options
  function opts(correct, wrongs, k) {
    var w = sample(uniq(wrongs).filter(function (x) { return x !== correct; }), k || 3);
    return { o: [w[0]].concat(shuffle(w.slice(1).concat([correct]))), s: 0 };
  }
  function distinct(n, a, b) { var out = []; var g = 0; while (out.length < n && g++ < 999) { var v = int(a, b); if (out.indexOf(v) < 0) out.push(v); } return out; }
  return { f: f, int: int, pick: pick, shuffle: shuffle, sample: sample, uniq: uniq, opts: opts, distinct: distinct };
}
DR.RNG = RNG; DR.hash = hash;
DR.J = function () { return [].slice.call(arguments).join('\n'); };
DR.Q = function (v) { return JSON.stringify(v); };
// D({ id, t, sb, from: [challenge ids], name, icon, k?: fixed variant count (recorded sandboxes), gen(R, seed) -> {tag, code, slots, sol, goals, explain, ...} })
DR.D = function (g) { if (DR.byId[g.id]) throw new Error('duplicate drill ' + g.id); DR.gens.push(g); DR.byId[g.id] = g; return g; };
DR.tierOf = function (g) { var CHD = root.CHD, t = 9; (g.from || []).forEach(function (id) { var c = CHD && CHD.byId[id]; if (c) t = Math.min(t, c.tier); }); return t === 9 ? 1 : t; };
DR.make = function (gid, seed) {
  var g = DR.byId[gid]; if (!g) return null;
  if (g.k) seed = ((seed % g.k) + g.k) % g.k;
  var R = RNG(hash(gid) ^ Math.imul(seed + 1, 2654435761)), o = g.gen(R, seed);
  var ch = { id: 'dr~' + gid + '~' + seed, t: g.t, sb: g.sb, tier: DR.tierOf(g), drill: gid, seed: seed, icon: g.icon || '🎯', title: o.tag, story: '', hints: [], goals: [], slots: {} };
  for (var k in o) ch[k] = o[k];
  Object.keys(ch.slots).forEach(function (k) { var s = ch.slots[k]; if (Array.isArray(s)) ch.slots[k] = { o: s, s: 0 }; else if (s.s === undefined) s.s = 0; });
  if (ch.sb === 'git') { ch.code = ''; ch.slots = {}; var ex = (o.extra || []); var all = R.uniq(ch.sol.concat(ex)); ch.git = ch.git || {}; ch.git.chips = R.shuffle(all); }
  if (ch.sb === 'ai') { ch.code = ''; ch.slots = {}; }
  ch.vkey = hash(ch.title + '|' + JSON.stringify(ch.sol) + '|' + JSON.stringify(ch.goals)).toString(36);
  return ch;
};
DR.randomSeed = function () { return Math.floor(Math.random() * 1e6); };
})(typeof window !== 'undefined' ? window : globalThis);
