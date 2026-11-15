// Dungeons & Debuggers — engine (no DOM). State lives in S; UI in ui.js.
(function (root) {
'use strict';
var DD = root.DD;
var MIN = 60e3, HOUR = 36e5, DAY = 864e5;
// Leitner boxes: 0 new, 1 missed, 2..6. Interval after reaching box b.
var BOX_INT = [0, 0, 10 * MIN, 20 * HOUR, 3 * DAY, 7 * DAY, 16 * DAY];
var BOX_POINTS = [0, 0, 1, 2, 3, 4, 6]; // knowledge power per item
var MASTER_BOX = 6;
var LESSON_LEN = 8, NEW_PER_LESSON = 4, REVIEW_LEN = 12, BOSS_LEN = 20, BOSS_FOCUS = 4;
var BOSS_MASTERY = 0.55; // average-box share needed across the tier before the boss opens
var BOSS_COOLDOWN = 30 * MIN;
var KIND = { mc: 'Quick check', out: 'Predict the output', prompt: 'Choose the better prompt', diff: 'Review the AI diff', git: 'Pick the git command', err: 'Triage the error', tf: 'True or false', order: 'Put in order', fill: 'Fill in the blank', match: 'Match the pairs', bug: 'Spot the bug' };
var KIND_IC = { mc: '❓', out: '🔮', prompt: '💬', diff: '🧾', git: '🌿', err: '🚩', tf: '⚖️', order: '🪜', fill: '🧩', match: '🔗', bug: '🐞' };
var RANKS = [ // by tier bosses beaten
  { t: 0, name: 'Intern', ic: '🧑‍💻' }, { t: 1, name: 'Junior Developer', ic: '🧑‍💻' }, { t: 2, name: 'Developer', ic: '🧙' },
  { t: 3, name: 'Senior Developer', ic: '🦸' }, { t: 4, name: 'Staff Architect', ic: '🧝' }, { t: 5, name: 'AI-Native Lead', ic: '🐉' }];
var TRACK_UNLOCK = { think: 0, code: 0, web: 2, tools: 3, debug: 5, ai: 6, data: 8, ship: 10, arch: 0, pro: 0 }; // learned units needed (arch/pro start at tier 2)

// ---------- upgrades ----------
var INSIGHT_UPG = [
  { id: 'xp', ic: '🌱', name: 'Growth Mindset', desc: '+5% XP per level', max: 20, base: 25, mult: 1.32 },
  { id: 'combo', ic: '🔥', name: 'Flow State', desc: '+10% max combo bonus per level', max: 5, base: 40, mult: 1.6 },
  { id: 'shield', ic: '🛡️', name: 'Steady Hands', desc: 'Your first miss each lesson keeps your combo', max: 1, base: 150, mult: 1 },
  { id: 'hintCap', ic: '🎒', name: 'Hint Satchel', desc: '+1 max hint token', max: 5, base: 35, mult: 1.7 },
  { id: 'hintRegen', ic: '🕯️', name: 'Curiosity', desc: 'Hints refill 12% faster per level', max: 5, base: 45, mult: 1.6 },
  { id: 'freeze', ic: '🧊', name: 'Streak Freeze', desc: 'Buy one freeze (holds max 3). Saves your streak on a missed day', max: 99, base: 60, mult: 1, consumable: true },
  { id: 'luck', ic: '🍀', name: 'Lucky Duck', desc: '+10% relic odds per level', max: 10, base: 60, mult: 1.45 },
  { id: 'apply', ic: '⚙️', name: 'Applied Knowledge', desc: '+10% idle work speed per level', max: 20, base: 30, mult: 1.3 },
  { id: 'offRate', ic: '🌙', name: 'Remote Work', desc: 'Offline work +5% of online rate (base 25%)', max: 7, base: 50, mult: 1.55 },
  { id: 'offCap', ic: '🛏️', name: 'Long Weekend', desc: '+2h offline cap (base 4h)', max: 10, base: 40, mult: 1.45 },
  { id: 'daily', ic: '🎯', name: 'Discipline', desc: '+15% daily-goal reward per level', max: 5, base: 50, mult: 1.5 }
];
var OFFICE_UPG = [
  { id: 'keyboard', ic: '⌨️', name: 'Better Keyboard', desc: '+15% work speed', max: 25, base: 25, mult: 1.45 },
  { id: 'chair', ic: '🪑', name: 'Ergonomic Chair', desc: '+10% work speed', max: 25, base: 60, mult: 1.5 },
  { id: 'coffee', ic: '☕', name: 'Coffee Subscription', desc: '+12% coins per ticket', max: 25, base: 40, mult: 1.48 },
  { id: 'monitor', ic: '🖥️', name: 'Extra Monitor', desc: 'Work one more ticket at the same time', max: 2, base: 400, mult: 6 },
  { id: 'queue', ic: '📥', name: 'Ticket Queue', desc: 'QoL: finished tickets auto-claim and the next one starts, even offline', max: 1, base: 120, mult: 1 },
  { id: 'intern', ic: '🧒', name: 'Hire an Intern', desc: '+20% work speed (they learn from you)', max: 10, base: 300, mult: 1.9 },
  { id: 'ci', ic: '🤖', name: 'CI Bot', desc: '+8% reputation per ticket', max: 15, base: 150, mult: 1.6 },
  { id: 'hat', ic: '🎩', name: 'Wizard Hat', desc: 'Cosmetic: a hat for your hero', max: 1, base: 500, mult: 1, cosmetic: '🎩' },
  { id: 'cat', ic: '🐈', name: 'Office Cat', desc: 'Cosmetic + 5% work speed (morale)', max: 1, base: 800, mult: 1, cosmetic: '🐈' },
  { id: 'plant', ic: '🪴', name: 'Desk Plant', desc: 'Cosmetic + 5% coins', max: 1, base: 250, mult: 1, cosmetic: '🪴' }
];
// ---------- relics (visible, exact odds) ----------
var RELICS = [
  { id: 'duck', ic: '🦆', name: 'Golden Rubber Duck', src: 'perfect', odds: 400, eff: '+25% XP from everything' },
  { id: 'scroll', ic: '📜', name: 'Stack Overflow Scroll', src: 'perfect', odds: 250, eff: '+2 max hints, hints refill twice as fast' },
  { id: 'lens', ic: '🔍', name: "The Linter's Lens", src: 'correct', odds: 1500, eff: 'Hints remove two wrong answers instead of one' },
  { id: 'cape', ic: '🦸', name: '10x Developer Cape', src: 'boss', odds: 6, eff: 'Dual skill gain: every correct answer also trains a second track' },
  { id: 'ouro', ic: '♾️', name: 'Ouroboros of Flow', src: 'combo25', odds: 60, eff: 'Your combo never drops below 5 after a miss' },
  { id: 'kbd', ic: '⌨️', name: 'Keyboard of Legend', src: 'ticket', odds: 5000, eff: 'Idle work speed x2' },
  { id: 'brew', ic: '☕', name: 'Coffee of Eternity', src: 'daily', odds: 120, eff: 'Offline work +25% of online rate, +6h offline cap' },
  { id: 'crown', ic: '👑', name: 'Merge Crown', src: 'lesson', odds: 2000, eff: 'Coins x1.5 and reputation x1.5' },
  { id: 'brain', ic: '🧠', name: "Senior's Second Brain", src: 'master', odds: 400, eff: 'Insight x2' },
  { id: 'phoenix', ic: '🔥', name: 'Phoenix Commit', src: 'streak', odds: 90, eff: 'Once a week a missed day is forgiven for free' },
  { id: 'semi', ic: '✨', name: 'The Golden Semicolon', src: 'correct', odds: 25000, eff: 'XP, coins and Insight all x2' },
  { id: 'shinybug', ic: '🐞', name: 'Shiny Bug', src: 'shiny', odds: 1, eff: 'Stacks to 10: +5% XP each. Shiny questions appear 1 in 300' }
];
var SRC_TXT = { perfect: 'per perfect lesson', correct: 'per correct answer', boss: 'per boss victory', combo25: 'each time a combo reaches 25', ticket: 'per ticket finished', daily: 'per daily goal met', lesson: 'per lesson completed', master: 'per question mastered', streak: 'per streak day (7+)', shiny: 'per shiny question answered right' };
var SHINY_ODDS = 300;

// ---------- achievements ----------
function A(id, ic, name, desc, f) { return { id: id, ic: ic, name: name, desc: desc, f: f }; }
var ACH = [
  A('l1', '🎓', 'Hello, World', 'Finish your first lesson', function (s) { return s.stats.lessons >= 1; }),
  A('l10', '📘', 'Study Habit', 'Finish 10 lessons', function (s) { return s.stats.lessons >= 10; }),
  A('l50', '📚', 'Bookworm', 'Finish 50 lessons', function (s) { return s.stats.lessons >= 50; }),
  A('l200', '🏫', 'Bootcamp Survivor', 'Finish 200 lessons', function (s) { return s.stats.lessons >= 200; }),
  A('l500', '🎖️', 'Lifelong Learner', 'Finish 500 lessons', function (s) { return s.stats.lessons >= 500; }),
  A('p1', '💯', 'Flawless', 'A perfect lesson', function (s) { return s.stats.perfect >= 1; }),
  A('p25', '🌟', 'Precision', '25 perfect lessons', function (s) { return s.stats.perfect >= 25; }),
  A('p100', '💎', 'Zero Defects', '100 perfect lessons', function (s) { return s.stats.perfect >= 100; }),
  A('c10', '🔥', 'On Fire', 'Combo of 10', function (s) { return s.stats.bestCombo >= 10; }),
  A('c25', '☄️', 'In the Zone', 'Combo of 25', function (s) { return s.stats.bestCombo >= 25; }),
  A('c50', '🌋', 'Unstoppable', 'Combo of 50', function (s) { return s.stats.bestCombo >= 50; }),
  A('a100', '✅', 'Hundred Answers', '100 correct answers', function (s) { return s.stats.correct >= 100; }),
  A('a1k', '🏅', 'Thousand Answers', '1,000 correct answers', function (s) { return s.stats.correct >= 1000; }),
  A('a5k', '🏆', 'Rote Master', '5,000 correct answers', function (s) { return s.stats.correct >= 5000; }),
  A('r100', '🔁', 'Spaced Out', '100 review answers', function (s) { return s.stats.reviews >= 100; }),
  A('m10', '🧠', 'It Sticks', 'Master 10 questions', function (s) { return countMastered() >= 10; }),
  A('m100', '🧱', 'Solid Foundations', 'Master 100 questions', function (s) { return countMastered() >= 100; }),
  A('m300', '🏯', 'Deep Knowledge', 'Master 300 questions', function (s) { return countMastered() >= 300; }),
  A('mAll', '🌌', 'Omniscient', 'Master every question', function (s) { return countMastered() >= ALLQ.length; }),
  A('s3', '📆', 'Three-Peat', '3-day streak', function (s) { return s.streak.best >= 3; }),
  A('s7', '🗓️', 'Week Warrior', '7-day streak', function (s) { return s.streak.best >= 7; }),
  A('s30', '📅', 'Month of Code', '30-day streak', function (s) { return s.streak.best >= 30; }),
  A('s100', '🏔️', 'Centurion', '100-day streak', function (s) { return s.streak.best >= 100; }),
  A('b1', '⬜', 'Not So Blank', 'Beat The Blank Screen', function (s) { return s.tier >= 1; }),
  A('b2', '🧐', 'Approved!', 'Beat The First Code Review', function (s) { return s.tier >= 2; }),
  A('b3', '🔥', 'Friday Survivor', 'Beat The Friday Deploy', function (s) { return s.tier >= 3; }),
  A('b4', '🚨', 'Night Shift', 'Beat The 3 AM Outage', function (s) { return s.tier >= 4; }),
  A('b5', '🤖', 'Agent Wrangler', 'Beat The Rogue Agent', function (s) { return s.tier >= 5; }),
  A('t10', '🎫', 'First Tickets', 'Finish 10 tickets', function (s) { return s.stats.tickets >= 10; }),
  A('t100', '🗂️', 'Ticket Machine', 'Finish 100 tickets', function (s) { return s.stats.tickets >= 100; }),
  A('t1k', '🏭', 'Software Factory', 'Finish 1,000 tickets', function (s) { return s.stats.tickets >= 1000; }),
  A('g50', '📖', 'Vocabulary', 'Learn 50 glossary terms', function (s) { return Object.keys(s.gloss).length >= 50; }),
  A('g150', '📕', 'Fluent', 'Learn 150 glossary terms', function (s) { return Object.keys(s.gloss).length >= 150; }),
  A('gAll', '📗', 'Walking Dictionary', 'Learn every glossary term', function (s) { return Object.keys(s.gloss).length >= Object.keys(DD.glossary).length; }),
  A('rel1', '🏺', 'Lucky Find', 'Find a relic', function (s) { return relicCount() >= 1; }),
  A('rel5', '👑', 'Collector', 'Find 5 different relics', function (s) { return relicCount() >= 5; }),
  A('trk', '🗺️', 'Explorer', 'Unlock every track', function (s) { return DD.tracks.every(function (t) { return trackUnlocked(t.id); }); }),
  A('lv10', '⭐', 'Level 10', 'Reach level 10', function (s) { return levelInfo().level >= 10; }),
  A('lv25', '🌠', 'Level 25', 'Reach level 25', function (s) { return levelInfo().level >= 25; })
];

// ---------- index ----------
var Q = {}, ALLQ = [], UNIT = {}, TRACK_UNITS = {};
DD.units.forEach(function (u) {
  UNIT[u.id] = u; u.qids = [];
  (TRACK_UNITS[u.track] = TRACK_UNITS[u.track] || []).push(u);
  u.qs.forEach(function (q, i) { var id = u.id + ':' + i; Q[id] = { id: id, unit: u, i: i, type: q[0], raw: q, track: u.track, tier: u.tier }; u.qids.push(id); ALLQ.push(id); });
});
Object.keys(TRACK_UNITS).forEach(function (t) { TRACK_UNITS[t].sort(function (a, b) { return a.tier - b.tier; }); TRACK_UNITS[t].forEach(function (u, k) { u.order = k; }); });

// ---------- state ----------
var KEY = 'dnd-dev-save-v1';
var S;
function fresh() {
  var t = Date.now();
  return { v: 1, created: t, xp: 0, txp: {}, coins: 0, insight: 0, rep: 0, items: {}, unitLessons: {}, tier: 0, bossCd: {},
    streak: { count: 0, best: 0, last: null, freezes: 0, phoenixUsed: 0 }, daily: { day: dayKey(t), xp: 0, lessons: 0, reviews: 0, combo: 0, claimed: {}, goal: false },
    upg: {}, relics: {}, ach: {}, gloss: {}, hints: 3, hintT: t, stats: { answered: 0, correct: 0, lessons: 0, perfect: 0, bestCombo: 0, reviews: 0, tickets: 0, bosses: 0, playMs: 0, coinsEarned: 0 },
    work: { tickets: [], seq: 100 }, settings: { sound: true }, last: t, seenIntro: false };
}
function load() {
  try { var raw = localStorage.getItem(KEY); if (raw) { S = merge(fresh(), JSON.parse(raw)); return true; } } catch (e) { console.warn('load failed', e); }
  S = fresh(); return false;
}
function merge(base, o) { for (var k in o) { if (o[k] && typeof o[k] === 'object' && !Array.isArray(o[k]) && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) base[k] = merge(base[k], o[k]); else base[k] = o[k]; } return base; }
function save() { try { S.last = Date.now(); localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
function exportSave() { save(); return btoa(unescape(encodeURIComponent(JSON.stringify(S)))); }
function importSave(str) { var o = JSON.parse(decodeURIComponent(escape(atob(str.trim())))); if (!o || o.v !== 1 || !o.items) throw new Error('Not a Dungeons & Debuggers save'); S = merge(fresh(), o); save(); }
function reset() { localStorage.removeItem(KEY); S = fresh(); save(); }

function dayKey(t) { var d = new Date(t); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
function dayDiff(a, b) { var pa = a.split('-').map(Number), pb = b.split('-').map(Number); return Math.round((new Date(pb[0], pb[1] - 1, pb[2]) - new Date(pa[0], pa[1] - 1, pa[2])) / DAY); }
function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function lv(id) { return S.upg[id] || 0; }
function hasRelic(id) { return (S.relics[id] || 0) > 0; }
function relicCount() { return Object.keys(S.relics).filter(function (k) { return S.relics[k] > 0; }).length; }

// ---------- levels ----------
function xpFor(L) { return Math.round(80 * Math.pow(L, 1.5)); } // XP to go from L to L+1
function levelFrom(xp, f) { var L = 1; while (xp >= f(L)) { xp -= f(L); L++; } return { level: L, into: xp, need: f(L) }; }
function levelInfo() { return levelFrom(S.xp, xpFor); }
function txpFor(L) { return Math.round(50 * Math.pow(L, 1.45)); }
function trackLevel(t) { return levelFrom(S.txp[t] || 0, txpFor); }
function rank() { return RANKS[Math.min(S.tier, 5)]; }

// ---------- items / units ----------
function item(id) { return S.items[id] || { b: 0, due: 0, n: 0, ok: 0, bad: 0 }; }
function isDue(id, t) { var it = S.items[id]; return it && it.b > 0 && (t || Date.now()) >= it.due; }
function unitMastery(u) { var s = 0; u.qids.forEach(function (id) { s += Math.min(item(id).b, MASTER_BOX); }); return s / (MASTER_BOX * u.qids.length); }
function unitLearned(u) { return (S.unitLessons[u.id] || 0) >= 2 && u.qids.every(function (id) { return item(id).b >= 2; }); }
function unitMasteredAll(u) { return u.qids.every(function (id) { return item(id).b >= MASTER_BOX; }); }
function learnedCount() { return DD.units.filter(unitLearned).length; }
function trackUnlocked(t) {
  var us = TRACK_UNITS[t]; if (!us || !us.length) return false;
  if (us[0].tier > S.tier + 1) return false;
  return learnedCount() >= TRACK_UNLOCK[t];
}
function unitOpen(u) {
  if (!trackUnlocked(u.track)) return false;
  if (u.tier > S.tier + 1) return false;
  if (u.order === 0) return true;
  return unitLearned(TRACK_UNITS[u.track][u.order - 1]);
}
function unitDue(u, t) { t = t || Date.now(); return u.qids.filter(function (id) { return isDue(id, t); }).length; }
function allDue() { var t = Date.now(); return DD.units.filter(unitOpen).reduce(function (a, u) { return a.concat(u.qids.filter(function (id) { return isDue(id, t); })); }, []); }
function countMastered() { var n = 0; for (var k in S.items) if (S.items[k].b >= MASTER_BOX) n++; return n; }
function knowledgePower() { var p = 0; for (var k in S.items) p += BOX_POINTS[Math.min(S.items[k].b, 6)]; return p; }
function trackStats(t) { var us = TRACK_UNITS[t] || [], n = 0, m = 0, seen = 0; us.forEach(function (u) { u.qids.forEach(function (id) { n++; var b = item(id).b; if (b >= MASTER_BOX) m++; if (b > 0) seen++; }); }); return { n: n, mastered: m, seen: seen, mastery: us.length ? us.reduce(function (a, u) { return a + unitMastery(u) * u.qids.length; }, 0) / n : 0 }; }
function tierUnits(T) { return DD.units.filter(function (u) { return u.tier === T; }); }
function tierStatus(T) {
  var us = tierUnits(T), learned = us.filter(unitLearned).length, n = 0, s = 0;
  us.forEach(function (u) { u.qids.forEach(function (id) { n++; s += Math.min(item(id).b, MASTER_BOX); }); });
  var mastery = n ? s / (n * MASTER_BOX) : 0, cd = (S.bossCd[T] || 0) - Date.now();
  return { units: us.length, learned: learned, mastery: mastery, need: BOSS_MASTERY, ready: learned === us.length && mastery >= BOSS_MASTERY && S.tier === T - 1, cooldown: cd > 0 ? cd : 0, beaten: S.tier >= T };
}

// ---------- sessions ----------
function pickLesson(uid) {
  var u = UNIT[uid], t = Date.now();
  var due = u.qids.filter(function (id) { return isDue(id, t); }).sort(function (a, b) { return item(a).due - item(b).due; });
  var fresh_ = u.qids.filter(function (id) { return item(id).b === 0; });
  var rest = u.qids.filter(function (id) { return item(id).b > 0 && !isDue(id, t); }).sort(function (a, b) { return item(a).b - item(b).b || item(a).due - item(b).due; });
  var len = Math.min(LESSON_LEN, u.qids.length);
  var out = due.slice(0, len);
  out = out.concat(fresh_.slice(0, Math.max(0, Math.min(NEW_PER_LESSON + (S.unitLessons[uid] ? 0 : 1), len - out.length))));
  out = out.concat(rest.slice(0, len - out.length));
  if (out.length < len) out = out.concat(fresh_.filter(function (id) { return out.indexOf(id) < 0; }).slice(0, len - out.length));
  // sprinkle up to 2 due reviews from earlier units in the same track
  var earlier = TRACK_UNITS[u.track].filter(function (x) { return x.order < u.order; });
  var extra = []; earlier.forEach(function (x) { x.qids.forEach(function (id) { if (isDue(id, t)) extra.push(id); }); });
  out = shuffle(out).concat(shuffle(extra).slice(0, 2));
  return { kind: 'lesson', unit: uid, track: u.track, queue: out, title: u.icon + ' ' + u.name };
}
function pickReview(track) {
  var t = Date.now(), pool = allDue().filter(function (id) { return !track || Q[id].track === track; }).sort(function (a, b) { return item(a).due - item(b).due; });
  var practice = false;
  if (!pool.length) { // nothing due: practice weakest seen items
    practice = true;
    pool = Object.keys(S.items).filter(function (id) { return Q[id] && unitOpen(Q[id].unit) && (!track || Q[id].track === track); }).sort(function (a, b) { return item(a).b - item(b).b || item(a).due - item(b).due; });
  }
  return { kind: 'review', practice: practice, track: track, queue: shuffle(pool.slice(0, REVIEW_LEN)), title: practice ? '🏋️ Practice: weakest skills' : '🔁 Spaced review' };
}
function pickBoss(T) {
  var ids = []; tierUnits(T).forEach(function (u) { ids = ids.concat(u.qids); });
  // weight weaker items
  ids = shuffle(ids).sort(function (a, b) { return item(a).b - item(b).b + (Math.random() - 0.5) * 3; });
  var tier = DD.tiers[T - 1];
  return { kind: 'boss', tierN: T, queue: shuffle(ids.slice(0, BOSS_LEN)), title: tier.bossIcon + ' ' + tier.boss, hp: BOSS_LEN - BOSS_FOCUS, maxHp: BOSS_LEN - BOSS_FOCUS, focus: BOSS_FOCUS };
}
function startSession(sess) {
  sess.i = 0; sess.right = 0; sess.wrong = 0; sess.xp = 0; sess.insight = 0; sess.combo = 0; sess.shieldUsed = false; sess.retry = {}; sess.retryAt = {}; sess.t0 = Date.now(); sess.newCount = 0; sess.drops = [];
  sess.shiny = sess.queue.map(function () { return Math.random() < 1 / SHINY_ODDS; });
  return sess;
}

// ---------- multipliers ----------
function xpMult() { var m = 1 + 0.05 * lv('xp'); if (hasRelic('duck')) m *= 1.25; if (hasRelic('semi')) m *= 2; m *= 1 + 0.05 * Math.min(S.relics.shinybug || 0, 10); return m; }
function insightMult() { var m = 1; if (hasRelic('brain')) m *= 2; if (hasRelic('semi')) m *= 2; return m; }
function comboMax() { return 0.5 + 0.1 * lv('combo'); }
function luck() { return 1 + 0.1 * lv('luck'); }
function hintCap() { return 3 + lv('hintCap') + (hasRelic('scroll') ? 2 : 0); }
function hintEvery() { return 3 * HOUR * Math.pow(0.88, lv('hintRegen')) / (hasRelic('scroll') ? 2 : 1); }
function relicOdds(r) { return Math.max(1, Math.round(r.odds / luck())); }
function rollRelic(src, sess) {
  var got = [];
  RELICS.forEach(function (r) { if (r.src !== src) return; if (r.id !== 'shinybug' && hasRelic(r.id)) return; if (r.id === 'shinybug' && (S.relics.shinybug || 0) >= 10) return; if (Math.random() < 1 / relicOdds(r)) { S.relics[r.id] = (S.relics[r.id] || 0) + 1; got.push(r); } });
  if (sess && got.length) sess.drops = sess.drops.concat(got);
  if (got.length && root.UI) got.forEach(function (r) { root.UI.relicFound(r); });
  return got;
}

// ---------- answering ----------
function answer(sess, qid, correct, usedHint) {
  var q = Q[qid], it = S.items[qid] || (S.items[qid] = { b: 0, due: 0, n: 0, ok: 0, bad: 0 }), t = Date.now();
  var isRetry = !!sess.retryAt[sess.i];
  var wasNew = it.b === 0, due = it.b <= 1 || t >= it.due, prevB = it.b;
  var res = { correct: correct, xp: 0, insight: 0, promoted: false, mastered: false, wasNew: wasNew, practice: !due };
  rollDay();
  S.stats.answered++; it.n++;
  if (sess.kind === 'review') S.stats.reviews++, S.daily.reviews++;
  if (correct) {
    S.stats.correct++; it.ok++;
    if (!isRetry) {
      if (due) { it.b = Math.min(MASTER_BOX, Math.max(2, it.b + 1)); it.due = t + BOX_INT[it.b]; res.promoted = it.b > prevB; if (it.b === MASTER_BOX && prevB < MASTER_BOX) { res.mastered = true; rollRelic('master', sess); } }
    }
    sess.combo++; if (sess.combo > S.stats.bestCombo) S.stats.bestCombo = sess.combo; if (sess.combo > S.daily.combo) S.daily.combo = sess.combo;
    if (sess.combo === 25) rollRelic('combo25', sess);
    var bonus = Math.min(comboMax(), Math.floor(sess.combo / 3) * 0.1);
    var base = 10 + (wasNew ? 5 : 0) + q.tier * 2;
    if (!due && !wasNew) base *= 0.5; if (isRetry) base *= 0.3; if (usedHint) base *= 0.5;
    res.xp = Math.max(1, Math.round(base * (1 + bonus) * xpMult()));
    res.insight = Math.max(1, Math.round((1 + (sess.combo >= 5 ? 1 : 0) + (wasNew ? 1 : 0)) * (usedHint ? 0.5 : 1) * insightMult()));
    sess.right++; rollRelic('correct', sess);
    if (sess.shiny[sess.i]) { rollRelic('shiny', sess); res.shiny = true; }
    if (hasRelic('cape')) { var others = DD.tracks.filter(function (x) { return x.id !== q.track && trackUnlocked(x.id); }); if (others.length) { var o = others[Math.floor(Math.random() * others.length)].id; S.txp[o] = (S.txp[o] || 0) + Math.round(res.xp / 2); res.dual = o; } }
    q.unit.terms.forEach(function (term) { if (!S.gloss[term] && it.b >= 2) { S.gloss[term] = t; res.newTerm = (res.newTerm || []).concat(term); } });
  } else {
    it.bad++; if (!isRetry) { it.b = 1; it.due = t; }
    if (!sess.shieldUsed && lv('shield')) { sess.shieldUsed = true; res.shielded = true; } else sess.combo = hasRelic('ouro') ? Math.min(sess.combo, 5) : 0;
    res.xp = Math.round(2 * xpMult()); sess.wrong++;
    if (sess.kind !== 'boss' && !sess.retry[qid]) { sess.retry[qid] = 'queued'; sess.queue.push(qid); sess.retryAt[sess.queue.length - 1] = true; sess.shiny.push(false); res.requeued = true; }
    if (sess.kind === 'boss') sess.focus--;
  }
  if (sess.kind === 'boss' && correct) sess.hp = Math.max(0, sess.hp - 1);
  S.xp += res.xp; S.txp[q.track] = (S.txp[q.track] || 0) + res.xp; S.insight += res.insight; S.daily.xp += res.xp;
  sess.xp += res.xp; sess.insight += res.insight;
  checkDailyGoal();
  return res;
}
function finishSession(sess) {
  var r = { xp: 0, insight: 0, perfect: false, coins: 0 };
  var firstTry = sess.queue.length - Object.keys(sess.retry).length;
  var acc = sess.right / Math.max(1, sess.right + sess.wrong);
  r.perfect = sess.wrong === 0 && sess.queue.length >= 5;
  if (sess.kind === 'boss') {
    r.won = sess.hp <= 0 || (sess.focus > 0 && sess.i >= sess.queue.length);
    if (r.won) { S.tier = Math.max(S.tier, sess.tierN); S.stats.bosses++; r.xp = 300 * sess.tierN; r.insight = 60 * sess.tierN; rollRelic('boss', sess); }
    else { S.bossCd[sess.tierN] = Date.now() + BOSS_COOLDOWN; r.xp = 20; }
  } else {
    S.stats.lessons++; S.daily.lessons++;
    if (sess.unit) S.unitLessons[sess.unit] = (S.unitLessons[sess.unit] || 0) + 1;
    r.xp = 20 + (r.perfect ? 30 : 0); r.insight = 3 + (r.perfect ? 5 : 0);
    rollRelic('lesson', sess); if (r.perfect) { S.stats.perfect++; rollRelic('perfect', sess); }
  }
  r.xp = Math.round(r.xp * xpMult()); r.insight = Math.round(r.insight * insightMult());
  S.xp += r.xp; S.insight += r.insight; S.daily.xp += r.xp; sess.xp += r.xp; sess.insight += r.insight;
  if (sess.track) S.txp[sess.track] = (S.txp[sess.track] || 0) + r.xp;
  S.stats.playMs += Date.now() - sess.t0;
  r.acc = acc; r.drops = sess.drops; r.firstTry = firstTry;
  checkDailyGoal(); var newAch = checkAch(); r.ach = newAch; save();
  return r;
}

// ---------- daily / streak ----------
var DAILY_GOAL_XP = 200;
var DEEDS = [
  { id: 'les', ic: '📘', txt: 'Finish 2 lessons', f: function () { return S.daily.lessons >= 2; }, r: 15 },
  { id: 'rev', ic: '🔁', txt: 'Answer 10 reviews', f: function () { return S.daily.reviews >= 10; }, r: 15 },
  { id: 'cmb', ic: '🔥', txt: 'Hit a 10 combo', f: function () { return S.daily.combo >= 10; }, r: 20 }
];
function rollDay() {
  var today = dayKey(Date.now());
  if (S.daily.day === today) return;
  S.daily = { day: today, xp: 0, lessons: 0, reviews: 0, combo: 0, claimed: {}, goal: false };
  // streak breaks if last goal day is older than yesterday
  if (S.streak.last && dayDiff(S.streak.last, today) > 1) {
    var missed = dayDiff(S.streak.last, today) - 1;
    while (missed > 0 && S.streak.count > 0) {
      if (hasRelic('phoenix') && Date.now() - (S.streak.phoenixUsed || 0) > 7 * DAY) { S.streak.phoenixUsed = Date.now(); missed--; continue; }
      if (S.streak.freezes > 0) { S.streak.freezes--; missed--; continue; }
      S.streak.count = 0; break;
    }
    if (S.streak.count > 0) S.streak.last = dayKey(Date.now() - DAY);
  }
}
function checkDailyGoal() {
  if (S.daily.goal || S.daily.xp < DAILY_GOAL_XP) return;
  S.daily.goal = true; var today = S.daily.day;
  if (S.streak.last !== today) { S.streak.count = (S.streak.last && dayDiff(S.streak.last, today) === 1) ? S.streak.count + 1 : 1; S.streak.last = today; S.streak.best = Math.max(S.streak.best, S.streak.count); }
  var rew = Math.round((25 + 2 * Math.min(S.streak.count, 50)) * (1 + 0.15 * lv('daily')) * insightMult());
  S.insight += rew; S.hints = Math.min(hintCap(), S.hints + 1);
  rollRelic('daily'); if (S.streak.count >= 7) rollRelic('streak');
  if (root.UI) root.UI.dailyGoal(rew);
}
function claimDeed(id) { var d = DEEDS.filter(function (x) { return x.id === id; })[0]; if (!d || S.daily.claimed[id] || !d.f()) return 0; S.daily.claimed[id] = 1; var r = Math.round(d.r * insightMult()); S.insight += r; save(); return r; }

// ---------- hints ----------
function tickHints() { var t = Date.now(), every = hintEvery(); if (S.hints >= hintCap()) { S.hintT = t; return; } var n = Math.floor((t - S.hintT) / every); if (n > 0) { S.hints = Math.min(hintCap(), S.hints + n); S.hintT += n * every; } }
function useHint() { if (S.hints <= 0) return false; S.hints--; if (S.hints === hintCap() - 1) S.hintT = Date.now(); return true; }

// ---------- upgrades ----------
function cost(def) { if (def.consumable) return def.base; return Math.round(def.base * Math.pow(def.mult, lv(def.id))); }
function canBuy(def, cur) { if (def.id === 'freeze') return S.streak.freezes < 3 && S[cur] >= cost(def); return lv(def.id) < def.max && S[cur] >= cost(def); }
function buy(def, cur) { if (!canBuy(def, cur)) return false; S[cur] -= cost(def); if (def.id === 'freeze') S.streak.freezes++; else S.upg[def.id] = lv(def.id) + 1; save(); return true; }

// ---------- idle work ----------
var TICKETS = {
  think: ['Break down the onboarding epic', 'Write steps for the reset flow', 'List edge cases for checkout', 'Clarify a vague feature request', 'Draft acceptance criteria'],
  code: ['Fix a typo in a variable name', 'Add an if/else for free shipping', 'Loop over the order list', 'Extract a helper function', 'Rename confusing variables'],
  web: ['Fix a broken link', 'Center the signup button', 'Add alt text to images', 'Handle a 404 page', 'Parse a JSON response'],
  tools: ['Resolve a merge conflict', 'Write a clear commit message', 'Update a dependency', 'Move a secret into .env', 'Clean up old branches'],
  data: ['Write a SELECT for the report', 'Add a WHERE to a risky UPDATE', 'Add an index to slow lookups', 'Design an orders table', 'Fix an N+1 query'],
  debug: ['Reproduce a login bug', 'Read a stack trace', 'Add a unit test', 'Fix a flaky test', 'Add useful logging'],
  ai: ['Write a spec for the agent', 'Review an AI-generated diff', 'Catch a hallucinated package', 'Break a task into AI-sized steps', 'Add guardrails to a prompt'],
  ship: ['Fix the CI pipeline', 'Roll back a bad deploy', 'Point a domain at hosting', 'Write release notes', 'Set up an uptime alert'],
  arch: ['Choose between two designs', 'Move pricing logic to the server', 'Add an authorization check', 'Write an ADR', 'Make a payment endpoint idempotent'],
  pro: ['Estimate the dashboard project', 'Review a teammate PR kindly', 'Update the README', 'Write a user story', 'Mentor the new intern']
};
function ticketLevelCap() { return 2 + 2 * S.tier; }
function repLevel() { return Math.min(ticketLevelCap(), 1 + Math.floor(Math.log2(1 + S.rep / 10))); }
function workSpeed() {
  var m = 1 + knowledgePower() * 0.01;
  m *= 1 + 0.10 * lv('apply'); m *= 1 + 0.15 * lv('keyboard'); m *= 1 + 0.10 * lv('chair'); m *= 1 + 0.20 * lv('intern'); if (lv('cat')) m *= 1.05; if (hasRelic('kbd')) m *= 2;
  return m;
}
function coinMult() { var m = 1 + 0.12 * lv('coffee'); if (lv('plant')) m *= 1.05; if (hasRelic('crown')) m *= 1.5; if (hasRelic('semi')) m *= 2; return m; }
function repMult() { var m = 1 + 0.08 * lv('ci'); if (hasRelic('crown')) m *= 1.5; return m; }
function slots() { return 1 + lv('monitor'); }
function offRate() { return Math.min(0.85, 0.25 + 0.05 * lv('offRate') + (hasRelic('brew') ? 0.25 : 0)); }
function offCap() { return (4 + 2 * lv('offCap') + (hasRelic('brew') ? 6 : 0)) * HOUR; }
function newTicket() {
  var tracks = DD.tracks.filter(function (t) { return trackUnlocked(t.id); }).map(function (t) { return t.id; }); if (!tracks.length) tracks = ['think'];
  var tr = tracks[Math.floor(Math.random() * tracks.length)], L = repLevel();
  var names = TICKETS[tr], work = Math.round(40 * Math.pow(1.7, L - 1) * (0.8 + Math.random() * 0.4));
  S.work.seq++;
  return { id: 'DEV-' + S.work.seq, track: tr, name: names[Math.floor(Math.random() * names.length)], L: L, work: work, done: 0, coins: Math.max(1, Math.round(work * 0.15 * Math.pow(1.08, L - 1))), rep: L, finished: false };
}
function ensureTickets() { while (S.work.tickets.length < slots()) S.work.tickets.push(newTicket()); }
function ticketSpeed(tk) { return workSpeed() * (1 + 0.05 * (trackLevel(tk.track).level - 1)); }
function claimTicket(tk) {
  if (!tk.finished) return null;
  var c = Math.round(tk.coins * coinMult()), r = Math.max(1, Math.round(tk.rep * repMult()));
  S.coins += c; S.rep += r; S.stats.tickets++; S.stats.coinsEarned += c; rollRelic('ticket');
  var i = S.work.tickets.indexOf(tk); S.work.tickets.splice(i, 1, newTicket());
  return { coins: c, rep: r };
}
function tick(dtMs, offline) {
  ensureTickets();
  var dt = dtMs / 1000 * (offline ? offRate() : 1), claimed = { coins: 0, rep: 0, n: 0 };
  var auto = lv('queue') > 0, guard = 0;
  for (var si = 0; si < S.work.tickets.length; si++) {
    var budget = dt;
    while (budget > 0 && guard++ < 20000) {
      var tk = S.work.tickets[si];
      if (tk.finished) { if (!auto) break; var r = claimTicket(tk); claimed.coins += r.coins; claimed.rep += r.rep; claimed.n++; continue; }
      var sp = ticketSpeed(tk), needT = (tk.work - tk.done) / sp;
      if (needT <= budget) { tk.done = tk.work; tk.finished = true; budget -= needT; }
      else { tk.done += sp * budget; budget = 0; }
    }
  }
  tickHints();
  return claimed;
}
function offlineCatchup() {
  var away = Date.now() - (S.last || Date.now());
  if (away < 60e3) return null;
  var capped = Math.min(away, offCap());
  rollDay();
  var res = tick(capped, true); res.away = away; res.capped = capped; res.rate = offRate();
  return res;
}

// ---------- achievements ----------
function checkAch() { var got = []; ACH.forEach(function (a) { if (!S.ach[a.id] && a.f(S)) { S.ach[a.id] = Date.now(); got.push(a); S.insight += 10; } }); if (got.length && root.UI) got.forEach(function (a) { root.UI.achievement(a); }); return got; }

// ---------- check answers ----------
function check(qid, resp) {
  var q = Q[qid].raw, type = q[0];
  if (['mc', 'out', 'prompt', 'diff', 'git', 'err'].indexOf(type) >= 0) return resp === q[2][0];
  if (type === 'tf') return resp === q[2];
  if (type === 'order') return JSON.stringify(resp) === JSON.stringify(q[2]);
  if (type === 'fill') return JSON.stringify(resp) === JSON.stringify(q[3]);
  if (type === 'match') return resp === 0; // number of mistakes
  if (type === 'bug') return resp === q[3];
  return false;
}
function correctText(qid) {
  var q = Q[qid].raw, type = q[0];
  if (['mc', 'out', 'prompt', 'diff', 'git', 'err'].indexOf(type) >= 0) return q[2][0];
  if (type === 'tf') return q[2] ? 'True' : 'False';
  if (type === 'order') return q[2].map(function (s, i) { return (i + 1) + '. ' + s; }).join('\n');
  if (type === 'fill') return q[3].join('  ·  ');
  if (type === 'match') return q[2].map(function (p) { return p[0] + ' → ' + p[1]; }).join('\n');
  if (type === 'bug') return 'Line ' + (q[3] + 1) + ': ' + q[2][q[3]].trim();
  return '';
}
function explanation(qid) { var q = Q[qid].raw; return q[0] === 'fill' ? q[5] : q[0] === 'bug' ? q[4] : q[3]; }

root.Game = {
  DD: DD, Q: Q, ALLQ: ALLQ, UNIT: UNIT, TRACK_UNITS: TRACK_UNITS, KIND: KIND, KIND_IC: KIND_IC, RANKS: RANKS, INSIGHT_UPG: INSIGHT_UPG, OFFICE_UPG: OFFICE_UPG, RELICS: RELICS, SRC_TXT: SRC_TXT, ACH: ACH, DEEDS: DEEDS, DAILY_GOAL_XP: DAILY_GOAL_XP, TRACK_UNLOCK: TRACK_UNLOCK, BOX_INT: BOX_INT, MASTER_BOX: MASTER_BOX, BOSS_MASTERY: BOSS_MASTERY, SHINY_ODDS: SHINY_ODDS,
  get S() { return S; }, load: load, save: save, exportSave: exportSave, importSave: importSave, reset: reset,
  levelInfo: levelInfo, trackLevel: trackLevel, rank: rank, item: item, unitMastery: unitMastery, unitLearned: unitLearned, unitMasteredAll: unitMasteredAll, unitOpen: unitOpen, unitDue: unitDue, allDue: allDue, trackUnlocked: trackUnlocked, trackStats: trackStats, tierStatus: tierStatus, learnedCount: learnedCount, countMastered: countMastered, knowledgePower: knowledgePower,
  pickLesson: pickLesson, pickReview: pickReview, pickBoss: pickBoss, startSession: startSession, answer: answer, finishSession: finishSession, check: check, correctText: correctText, explanation: explanation,
  rollDay: rollDay, claimDeed: claimDeed, useHint: useHint, tickHints: tickHints, hintCap: hintCap, hintEvery: hintEvery, cost: cost, canBuy: canBuy, buy: buy, lv: lv, hasRelic: hasRelic, relicOdds: relicOdds, relicCount: relicCount,
  tick: tick, ensureTickets: ensureTickets, claimTicket: claimTicket, ticketSpeed: ticketSpeed, workSpeed: workSpeed, coinMult: coinMult, slots: slots, offRate: offRate, offCap: offCap, repLevel: repLevel, ticketLevelCap: ticketLevelCap, offlineCatchup: offlineCatchup, checkAch: checkAch, xpMult: xpMult, xpFor: xpFor, txpFor: txpFor
};
})(typeof window !== 'undefined' ? window : globalThis);
