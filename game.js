// Dungeons & Debuggers — engine (no DOM). State lives in S; UI in ui.js.
(function (root) {
'use strict';
var DD = root.DD, CHD = root.CHD || { tracks: [], list: [], byId: {}, projects: [] };
var MIN = 60e3, HOUR = 36e5, DAY = 864e5;
// Leitner boxes: 0 new, 1 missed, 2..6. Interval after reaching box b.
var BOX_INT = [0, 0, 10 * MIN, 20 * HOUR, 3 * DAY, 7 * DAY, 16 * DAY];
var BOX_POINTS = [0, 0, 1, 2, 3, 4, 6]; // knowledge power per item
var MASTER_BOX = 6;
var LESSON_LEN = 8, NEW_PER_LESSON = 4, REVIEW_LEN = 12, BOSS_LEN = 10, BOSS_FOCUS = 3, BOSS_HP = 8;
var BOSS_MASTERY = 0.25; // quiz mastery share needed across the tier before the boss opens (plus BOSS_BUILD of the tier's challenges)
var BOSS_BUILD = 0.7;
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
  { id: 'apply', ic: '⚙️', name: 'Applied Knowledge', desc: '+10% bot tasks per hour per level', max: 20, base: 30, mult: 1.3 },
  { id: 'offRate', ic: '🌙', name: 'Remote Work', desc: 'Offline bot rate +5% of online (base 25%)', max: 7, base: 50, mult: 1.55 },
  { id: 'offCap', ic: '🛏️', name: 'Long Weekend', desc: '+2h offline cap (base 4h)', max: 10, base: 40, mult: 1.45 },
  { id: 'daily', ic: '🎯', name: 'Discipline', desc: '+15% daily-goal reward per level', max: 5, base: 50, mult: 1.5 }
];
var OFFICE_UPG = [
  { id: 'keyboard', ic: '⚡', name: 'Faster CPU', desc: '+15% bot tasks per hour', max: 25, base: 25, mult: 1.45 },
  { id: 'chair', ic: '💾', name: 'SSD Cache', desc: '+10% bot tasks per hour', max: 25, base: 60, mult: 1.5 },
  { id: 'coffee', ic: '💳', name: 'Premium Clients', desc: '+12% coins per finished task', max: 25, base: 40, mult: 1.48 },
  { id: 'monitor', ic: '🧵', name: 'Extra Worker Process', desc: '+1 worker running tasks in parallel', max: 2, base: 400, mult: 6 },
  { id: 'queue', ic: '📥', name: 'Dead-Letter Queue', desc: 'Failed tasks are parked and retried later: recovers ~15% of failures', max: 1, base: 120, mult: 1 },
  { id: 'intern', ic: '🖥️', name: 'GPU Box', desc: '+20% bot tasks per hour', max: 10, base: 300, mult: 1.9 },
  { id: 'ci', ic: '🧪', name: 'CI Runner', desc: '+8% reputation per task', max: 15, base: 150, mult: 1.6 },
  { id: 'hat', ic: '🎩', name: 'Wizard Hat', desc: 'Cosmetic: a hat for your hero (and your bot)', max: 1, base: 500, mult: 1, cosmetic: '🎩' },
  { id: 'cat', ic: '🐈', name: 'Office Cat', desc: 'Cosmetic + 5% bot speed (morale)', max: 1, base: 800, mult: 1, cosmetic: '🐈' },
  { id: 'plant', ic: '🪴', name: 'Desk Plant', desc: 'Cosmetic + 5% coins', max: 1, base: 250, mult: 1, cosmetic: '🪴' }
];
// ---------- relics (visible, exact odds) ----------
var RELICS = [
  { id: 'duck', ic: '🦆', name: 'Golden Rubber Duck', src: 'perfect', odds: 400, eff: '+25% XP from everything' },
  { id: 'scroll', ic: '📜', name: 'Stack Overflow Scroll', src: 'perfect', odds: 250, eff: '+2 max hints, hints refill twice as fast' },
  { id: 'lens', ic: '🔍', name: "The Linter's Lens", src: 'correct', odds: 1500, eff: 'Hints remove two wrong answers instead of one' },
  { id: 'cape', ic: '🦸', name: '10x Developer Cape', src: 'boss', odds: 6, eff: 'Dual skill gain: every correct answer also trains a second track' },
  { id: 'ouro', ic: '♾️', name: 'Ouroboros of Flow', src: 'combo25', odds: 60, eff: 'Your combo never drops below 5 after a miss' },
  { id: 'kbd', ic: '⌨️', name: 'Keyboard of Legend', src: 'ticket', odds: 5000, eff: 'Bot tasks per hour x2' },
  { id: 'brew', ic: '☕', name: 'Coffee of Eternity', src: 'daily', odds: 120, eff: 'Offline bot rate +25% of online, +6h offline cap' },
  { id: 'crown', ic: '👑', name: 'Merge Crown', src: 'lesson', odds: 2000, eff: 'Coins x1.5 and reputation x1.5' },
  { id: 'brain', ic: '🧠', name: "Senior's Second Brain", src: 'master', odds: 400, eff: 'Insight x2' },
  { id: 'phoenix', ic: '🔥', name: 'Phoenix Commit', src: 'streak', odds: 90, eff: 'Once a week a missed day is forgiven for free' },
  { id: 'semi', ic: '✨', name: 'The Golden Semicolon', src: 'correct', odds: 25000, eff: 'XP, coins and Insight all x2' },
  { id: 'anvil', ic: '⚒️', name: 'Anvil of Discovery', src: 'challenge', odds: 350, eff: '+30% XP from hands-on challenges' },
  { id: 'prism', ic: '🔮', name: 'Prism of Curiosity', src: 'explore', odds: 40, eff: '+1 max hint token, and experiments give double XP' },
  { id: 'forge', ic: '🔥', name: 'First-Try Forge', src: 'firstrun', odds: 150, eff: 'First-run solves give +50% XP instead of +25%' },
  { id: 'metro', ic: '⏱️', name: 'Slam Metronome', src: 'slam', odds: 40, eff: 'Speed bonuses in drills allow 50% more time' },
  { id: 'gear', ic: '⚙️', name: 'Self-Healing Gear', src: 'fluent', odds: 25, eff: 'Your bot earns +25% coins per task' },
  { id: 'shinybug', ic: '🐞', name: 'Shiny Bug', src: 'shiny', odds: 1, eff: 'Stacks to 10: +5% XP each. Shiny questions appear 1 in 300' }
];
var SRC_TXT = { perfect: 'per perfect lesson', correct: 'per correct answer', boss: 'per boss victory', combo25: 'each time a combo reaches 25', ticket: 'per ticket finished', daily: 'per daily goal met', lesson: 'per lesson completed', master: 'per question mastered', streak: 'per streak day (7+)', shiny: 'per shiny question answered right', challenge: 'per challenge solved', explore: 'per new experiment in an Experiment zone', firstrun: 'per challenge solved on the first run' };
var SHINY_ODDS = 300;

// ---------- v3: mastery drills ----------
var DRL = root.DRILLS || { gens: [], byId: {}, make: function () { return null; } };
var M_INT = [0, 0, 10 * MIN, 20 * HOUR, 3 * DAY, 7 * DAY, 16 * DAY];
var M_LEVELS = [{ n: 'Locked', ic: '🔒' }, { n: 'Learned', ic: '🌱' }, { n: 'Practiced', ic: '🛠️' }, { n: 'Fluent', ic: '⚡' }, { n: 'Mastered', ic: '👑' }];
var M_PRACTICED = 0.5; // share of a tier's drill concepts that must be Practiced before its boss
var PAR = { html: 25, js: 25, py: 30, sql: 25, git: 40, ai: 30, cmp: 20 };
function conceptUnlocked(g) { return (g.from || []).some(chSolved); }
function mState(id) { return S.mastery[id] || null; }
function mLevel(g) {
  if (!conceptUnlocked(g)) return 0; var m = S.mastery[g.id]; if (!m) return 1;
  var d = (m.days || []).length, v = (m.vars || []).length;
  if (m.b >= 6 && d >= 3 && v >= 6 && m.streak >= 3) return 4;
  if (m.b >= 4 && d >= 2 && v >= 4) return 3;
  if (m.ok >= 2 && v >= 2) return 2;
  return 1;
}
function mPct(g) { if (!conceptUnlocked(g)) return 0; var m = S.mastery[g.id]; if (!m) return 0; return Math.round(100 * (Math.min(1, m.b / 6) * 0.6 + Math.min(1, (m.vars || []).length / 6) * 0.2 + Math.min(1, (m.days || []).length / 3) * 0.2)); }
function mDue(g, t) { if (!conceptUnlocked(g)) return false; var m = S.mastery[g.id]; return !m || (t || Date.now()) >= m.due; }
function conceptsOpen() { return DRL.gens.filter(conceptUnlocked); }
function conceptsDue() { var t = Date.now(); return DRL.gens.filter(function (g) { return mDue(g, t); }); }
function practicedCount() { return DRL.gens.filter(function (g) { return mLevel(g) >= 2; }).length; }
function tierConcepts(T) { return DRL.gens.filter(function (g) { return DRL.tierOf(g) === T; }); }
function interleave(list) { // avoid two drills from the same track in a row
  var out = [], pool = list.slice();
  while (pool.length) { var last = out.length ? out[out.length - 1].t : null, i = pool.findIndex(function (g) { return g.t !== last; }); if (i < 0) i = 0; out.push(pool.splice(i, 1)[0]); }
  return out;
}
function pickSlam(n, opt) {
  opt = opt || {}; var open = opt.pool || conceptsOpen(); if (!open.length) return null;
  var t = Date.now(), due = shuffle(open.filter(function (g) { return mDue(g, t); })), rest = shuffle(open.filter(function (g) { return !mDue(g, t); })).sort(function (a, b) { return mPct(a) - mPct(b); });
  var order = due.concat(rest), pick = [];
  for (var i = 0; pick.length < n && i < n * 3; i++) pick.push(order[i % order.length]);
  pick = interleave(pick);
  var drills = pick.map(function (g) { return DRL.make(g.id, DRL.randomSeed()); });
  return { kind: opt.boss ? 'mboss' : 'slam', tierN: opt.boss || 0, drills: drills, i: 0, combo: 0, best: 0, results: [], xp: 0, insight: 0, t0: Date.now(), drops: [], ups: [] };
}
function drillResult(sess, ch, r) { // r: {ok, unaided, ms}
  var g = DRL.byId[ch.drill]; if (!g) return {};
  var m = S.mastery[g.id] || (S.mastery[g.id] = { b: 0, due: 0, ok: 0, miss: 0, n: 0, days: [], vars: [], streak: 0 });
  var before = mLevel(g), t = Date.now(), out = { xp: 0, insight: 0, speed: 1, levelUp: null, drops: [] };
  rollDay(); m.n++; m.last = t; S.stats.drills = (S.stats.drills || 0) + 1;
  if (r.ok && r.unaided) {
    m.ok++; m.streak++; var dk = dayKey(t); if (m.days.indexOf(dk) < 0) m.days.push(dk); if (m.vars.indexOf(ch.vkey) < 0) { m.vars.push(ch.vkey); if (m.vars.length > 40) m.vars.shift(); }
    if (t >= m.due || m.b < 2) m.b = Math.min(6, m.b + 1); m.due = t + M_INT[Math.max(2, m.b)];
    sess.combo++; sess.best = Math.max(sess.best, sess.combo); S.stats.drillOk = (S.stats.drillOk || 0) + 1; S.daily.drillOk = (S.daily.drillOk || 0) + 1; S.daily.combo = Math.max(S.daily.combo || 0, sess.combo);
    var par = (PAR[ch.sb] || 25) * 1000 * (hasRelic('metro') ? 1.5 : 1); out.speed = r.ms <= par ? 1.5 : r.ms <= par * 2 ? 1.2 : 1;
    out.xp = Math.round((8 + 3 * ch.tier) * (1 + 0.1 * Math.min(sess.combo - 1, 10)) * out.speed * xpMult());
  } else {
    m.miss++; m.streak = 0; m.b = Math.max(1, Math.floor(m.b / 2)); m.due = t + 5 * MIN; sess.combo = 0;
    if (r.ok) out.xp = Math.round(3 * xpMult()); // fixed after seeing the explanation: small credit, no mastery
  }
  var after = mLevel(g);
  if (after > before && before >= 1) {
    out.levelUp = M_LEVELS[after]; var ins = [0, 0, 3, 10, 25][after]; out.insight += Math.round(ins * insightMult());
    if (after === 3) out.drops = out.drops.concat(rollRelic('fluent')); if (after === 4) out.drops = out.drops.concat(rollRelic('master'));
    sess.ups.push({ g: g.id, lv: after });
  }
  S.xp += out.xp; S.insight += out.insight; S.daily.xp += out.xp; S.txp['c:' + g.t] = (S.txp['c:' + g.t] || 0) + out.xp;
  sess.xp += out.xp; sess.insight += out.insight; sess.drops = sess.drops.concat(out.drops);
  sess.results.push({ id: ch.id, g: g.id, ok: !!r.ok, unaided: !!(r.ok && r.unaided), ms: r.ms, xp: out.xp, speed: out.speed });
  checkDailyGoal(); save(); return out;
}
function finishSlam(sess) {
  var n = sess.results.length, ok = sess.results.filter(function (x) { return x.unaided; }).length, r = { n: n, ok: ok, xp: 0, insight: 0, drops: [], won: false };
  if (sess.kind === 'mboss') {
    var need = Math.ceil(sess.drills.length * 0.75); r.need = need; r.won = ok >= need;
    if (r.won) { S.tier = Math.max(S.tier, sess.tierN); S.stats.bosses++; r.xp = 300 * sess.tierN; r.insight = 60 * sess.tierN; r.drops = rollRelic('boss'); }
    else { S.bossCd[sess.tierN] = Date.now() + BOSS_COOLDOWN; r.xp = 20; }
  } else if (n) {
    S.stats.slams = (S.stats.slams || 0) + 1; S.daily.slams = (S.daily.slams || 0) + 1;
    r.insight = Math.round((2 + ok) * insightMult()); r.xp = ok === n ? Math.round(30 * xpMult()) : 0;
    if (ok === n) { S.stats.perfectSlams = (S.stats.perfectSlams || 0) + 1; r.drops = rollRelic('slam').concat(rollRelic('perfect')); r.perfect = true; }
    S.stats.bestSlamCombo = Math.max(S.stats.bestSlamCombo || 0, sess.best);
  }
  S.xp += r.xp; S.insight += r.insight; S.daily.xp += r.xp; r.ach = checkAch(); checkDailyGoal(); save(); return r;
}

// ---------- v3: Your Bot ----------
var TASK_TYPES = [
  { id: 'email', ic: '📧', name: 'Sort the support inbox', tier: 0, val: 0.75, inj: 1 },
  { id: 'report', ic: '📊', name: 'Generate the daily report', tier: 1, val: 1.25, sched: 1 },
  { id: 'bug', ic: '🐞', name: 'Triage new bug reports', tier: 2, val: 2 },
  { id: 'support', ic: '💬', name: 'Answer questions from the docs', tier: 3, val: 3, kb: 1, inj: 1 },
  { id: 'deploy', ic: '🚀', name: 'Deploy approved changes', tier: 4, val: 5, risky: 1 }];
var BOT_STAGES = [{ id: 'trigger', ic: '⏰', n: 'Trigger' }, { id: 'parse', ic: '🧾', n: 'Parse' }, { id: 'decide', ic: '🧠', n: 'Decide' }, { id: 'tool', ic: '🔧', n: 'Tool' }, { id: 'verify', ic: '🔍', n: 'Verify' }, { id: 'done', ic: '✅', n: 'Done' }];
function botMods() { return CHD.list.filter(function (c) { return c.bot; }); }
function hasMod(id) { return chSolved(id); }
function botTypes() { return TASK_TYPES.filter(function (t) { return S.tier >= t.tier; }); }
function botStats() {
  var h = hasMod, st = { mods: botMods().filter(function (c) { return h(c.id); }).length, modsN: botMods().length };
  var e = {}; // failure probabilities by error type
  e.parse = h('bm-parse') ? 0.02 : 0.28; e.context = h('bm-context') ? 0 : 0.05;
  var acc = 0.5 + (h('bm-route') ? 0.12 : 0) + (h('bm-sysprompt') ? 0.12 : 0) + (h('bm-fewshot') ? 0.07 : 0) + (h('bm-fail') ? 0.05 : 0) + (h('bm-temp') ? 0.03 : 0) + (h('bm-split') ? 0.03 : 0) + (h('bm-overfit') ? 0.04 : 0) + (h('bm-confusion') ? 0.02 : 0);
  st.acc = Math.min(0.97, acc); st.kbAcc = Math.min(0.97, st.acc + (h('bm-rag') ? 0.1 : -0.25));
  e.transient = h('bm-retry') ? 0.02 : h('bm-tool') ? 0.12 : 0.2; e.rate = h('bm-rate') ? 0 : h('bm-retry') ? 0.05 : 0.1; e.auth = h('bm-secrets') ? 0 : 0.07; e.args = h('bm-schema') ? 0.01 : 0.1; e.perm = h('bm-perms') ? 0 : 0.03;
  e.inject = h('bm-guard') ? 0.002 : 0.05; e.regress = h('bm-tests') ? 0.01 : 0.08; e.risky = h('bm-hitl') ? 0 : 0.1;
  st.err = e;
  st.uptime = Math.min(0.995, 0.85 + (h('bm-log') ? 0.06 : 0) + (h('bm-monitor') ? 0.07 : 0));
  st.workers = (h('bm-queue') ? 3 : 1) + lv('monitor');
  var hw = (1 + 0.15 * lv('keyboard')) * (1 + 0.10 * lv('chair')) * (1 + 0.20 * lv('intern')) * (lv('cat') ? 1.05 : 1) * (hasRelic('kbd') ? 2 : 1) * (1 + 0.10 * lv('apply'));
  st.mastery = 1 + 0.02 * practicedCount();
  st.tph = Math.round(1200 * st.workers * (h('bm-webhook') ? 1.3 : 1) * (h('bm-cron') ? 1.15 : 1) * (h('bm-hitl') ? 0.92 : 1) * hw * st.mastery * st.uptime);
  st.cost = Math.max(0.002, 0.02 * (h('bm-cost') ? 0.4 : 1) * (h('bm-context') ? 0.7 : 1) + (h('bm-fewshot') ? 0.002 : 0) + (h('bm-rag') ? 0.003 : 0) + (h('bm-retry') ? 0.001 : 0));
  st.dlq = lv('queue') ? 0.3 : 0; st.measured = h('bm-eval'); st.matrix = h('bm-confusion'); st.alerts = h('bm-monitor'); st.logs = h('bm-log');
  var types = botTypes(), sum = 0; st.byType = {};
  types.forEach(function (t) { var p = botSuccessP(st, t); st.byType[t.id] = p; sum += p; });
  st.success = types.length ? sum / types.length : 0;
  st.coinsPerHr = Math.max(0, Math.round(st.tph * (types.reduce(function (a, t) { return a + st.byType[t.id] * taskCoins(st, t); }, 0) / Math.max(1, types.length) - st.cost * COST_COINS)));
  return st;
}
function botSuccessP(st, t) {
  var e = st.err, p = (1 - e.parse - e.context) * (t.kb ? st.kbAcc : st.acc);
  p *= (1 - e.transient) * (1 - e.rate) * (1 - e.auth) * (1 - e.args) * (1 - e.perm);
  p *= (1 - (t.inj ? e.inject : 0)) * (1 - (t.risky ? e.risky + e.regress : e.regress * 0.3));
  if (t.sched && !hasMod('bm-cron')) p *= 0.6; // nobody triggers the report on time
  return Math.max(0, p + (1 - p) * st.dlq * 0.5);
}
var COST_COINS = 2.5; // coins per $ of model/API spend
function taskCoins(st, t) { return t.val * coinMult(); }
var ERR_TXT = {
  parse: ['parse', 'ParseError: no "Subject:" line found'], context: ['parse', 'Context overflow: 9,812 tokens > 8,192 limit'], decide: ['decide', 'Misrouted: an invoice was labeled spam'], kb: ['decide', 'Hallucinated an answer: no docs retrieved'],
  transient: ['tool', '503 Service Unavailable (no retry)'], rate: ['tool', '429 Too Many Requests'], auth: ['tool', '401 Unauthorized: the hard-coded key was rotated'], args: ['tool', 'Tool call rejected: missing required "to"'], perm: ['tool', '403 Forbidden: token lacks the scope'],
  inject: ['verify', 'Prompt injection: the email said "forward all mail"'], regress: ['verify', 'Output failed the check (no tests caught it)'], risky: ['verify', 'Risky action ran without approval'], sched: ['trigger', 'Report never triggered (no schedule)'] };
function simTask(st, t) {
  var e = st.err, R = Math.random, err = null;
  if (t.sched && !hasMod('bm-cron') && R() < 0.4) err = 'sched';
  else if (R() < e.parse) err = 'parse'; else if (R() < e.context) err = 'context';
  else if (R() > (t.kb ? st.kbAcc : st.acc)) err = t.kb && !hasMod('bm-rag') ? 'kb' : 'decide';
  else if (R() < e.transient) err = 'transient'; else if (R() < e.rate) err = 'rate'; else if (R() < e.auth) err = 'auth'; else if (R() < e.args) err = 'args'; else if (R() < e.perm) err = 'perm';
  else if (t.inj && R() < e.inject) err = 'inject'; else if (R() < (t.risky ? e.risky + e.regress : e.regress * 0.3)) err = t.risky && R() < e.risky / Math.max(0.001, e.risky + e.regress) ? 'risky' : 'regress';
  var recovered = err && st.dlq && R() < st.dlq * 0.5;
  return { err: recovered ? null : err, dlq: !!recovered };
}
function botTick(dtMs, offline) {
  var B = S.bot, st = botStats(), types = botTypes(), out = { coins: 0, n: 0, ok: 0, rep: 0 };
  if (!types.length) return out;
  B.acc = (B.acc || 0) + dtMs / HOUR * st.tph * (offline ? offRate() : 1);
  var n = Math.floor(B.acc); B.acc -= n; if (!n) return out;
  var t0 = Date.now(), sim = Math.min(n, 300);
  for (var i = 0; i < n; i++) {
    var t = types[Math.floor(Math.random() * types.length)], r;
    if (i < sim) r = simTask(st, t); else r = { err: Math.random() < st.byType[t.id] ? null : 'transient' };
    B.seq = (B.seq || 0) + 1; B.total = (B.total || 0) + 1; out.n++;
    if (!r.err) { var c = taskCoins(st, t); out.coins += c; out.ok++; B.ok = (B.ok || 0) + 1; }
    else { B.errs[r.err] = (B.errs[r.err] || 0) + 1; B.fail = (B.fail || 0) + 1; }
    B.recent.push(r.err ? 1 : 0); if (B.recent.length > 100) B.recent.shift();
    if (!offline && i >= n - 6) { B.feed.push({ id: 'T-' + B.seq, ty: t.id, err: r.err, dlq: r.dlq, t: t0 - (n - 1 - i) * 350 }); if (B.feed.length > 24) B.feed.shift(); }
    if (r.err && !offline) { B.log.unshift({ id: 'T-' + B.seq, ty: t.id, err: r.err, at: t0 }); if (B.log.length > 40) B.log.pop(); }
  }
  B.costSpent = (B.costSpent || 0) + n * st.cost;
  out.coins = Math.max(0, Math.round(out.coins - n * st.cost * COST_COINS)); out.rep = Math.round(out.ok * 0.2 * repMult());
  S.coins += out.coins; S.rep += out.rep; S.stats.tickets += out.ok; S.stats.coinsEarned += out.coins; B.coins = (B.coins || 0) + out.coins;
  if (out.ok && !offline) rollRelic('ticket');
  return out;
}

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
  A('lv25', '🌠', 'Level 25', 'Reach level 25', function (s) { return levelInfo().level >= 25; }),
  A('ch1', '🔨', 'It Works!', 'Solve your first hands-on challenge', function (s) { return chSolvedCount() >= 1; }),
  A('ch25', '🛠️', 'Tinkerer', 'Solve 25 challenges', function (s) { return chSolvedCount() >= 25; }),
  A('ch75', '🏗️', 'Builder', 'Solve 75 challenges', function (s) { return chSolvedCount() >= 75; }),
  A('ch150', '🏰', 'Master Builder', 'Solve 150 challenges', function (s) { return chSolvedCount() >= 150; }),
  A('chAll', '🌋', 'Full Stack', 'Solve every challenge', function (s) { return chSolvedCount() >= CHD.list.filter(function (c) { return !c.boss && !c.bot; }).length; }),
  A('fr10', '🎯', 'Measure Twice', 'Solve 10 challenges on the first run', function (s) { return (s.stats.firstRun || 0) >= 10; }),
  A('nohint', '🧗', 'No Spoilers', 'Solve 30 challenges without hints', function (s) { return (s.stats.noHint || 0) >= 30; }),
  A('exp20', '🧪', 'Mad Scientist', 'Try 20 experiments in Experiment zones', function (s) { return (s.stats.experiments || 0) >= 20; }),
  A('sb', '🧰', 'Polyglot', 'Solve a challenge in every kind of sandbox', function (s) { var k = {}; CHD.list.forEach(function (c) { if (chSolved(c.id)) k[c.sb] = 1; }); return ['html', 'js', 'py', 'sql', 'git', 'cmp', 'ai'].every(function (x) { return k[x]; }); }),
  A('pj1', '📦', 'Shipped', 'Finish your first project', function (s) { return projDoneCount() >= 1; }),
  A('pjAll', '🏆', 'Portfolio', 'Finish every project', function (s) { return projDoneCount() >= CHD.projects.length; }),
  A('slam1', '🥊', 'First Slam', 'Finish a mastery slam', function (s) { return (s.stats.slams || 0) >= 1; }),
  A('slamP', '💯', 'Clean Sweep', 'Finish a slam with every drill right, unaided', function (s) { return (s.stats.perfectSlams || 0) >= 1; }),
  A('slam10', '🌪️', 'Slam Combo 10', 'Get 10 drills right in a row', function (s) { return (s.stats.bestSlamCombo || 0) >= 10; }),
  A('fluent1', '⚡', 'Fluent', 'Get a concept to Fluent (correct across days and variants)', function (s) { return DRL.gens.some(function (g) { return mLevel(g) >= 3; }); }),
  A('mast1', '👑', 'True Mastery', 'Get a concept to Mastered', function (s) { return DRL.gens.some(function (g) { return mLevel(g) >= 4; }); }),
  A('prac20', '🛠️', 'Practiced Hands', 'Get 20 concepts to Practiced', function (s) { return practicedCount() >= 20; }),
  A('bot1', '🤖', 'It Lives', 'Install your first bot module', function (s) { return botMods().some(function (c) { return chSolved(c.id); }); }),
  A('bot10', '🦾', 'Automation Engineer', 'Install 10 bot modules', function (s) { return botMods().filter(function (c) { return chSolved(c.id); }).length >= 10; }),
  A('botAll', '🛰️', 'Lights-Out Operations', 'Install every bot module', function (s) { return botMods().every(function (c) { return chSolved(c.id); }); }),
  A('bot1k', '📈', 'Thousand Tasks', 'Your bot finishes 1,000 tasks', function (s) { return (s.bot && s.bot.ok || 0) >= 1000; })
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
  return { v: 3, ch: {}, chCombo: 0, seenV2: false, seenV3: false, mastery: {}, bot: { acc: 0, seq: 0, total: 0, ok: 0, fail: 0, coins: 0, errs: {}, recent: [], feed: [], log: [], costSpent: 0 }, created: t, xp: 0, txp: {}, coins: 0, insight: 0, rep: 0, items: {}, unitLessons: {}, tier: 0, bossCd: {},
    streak: { count: 0, best: 0, last: null, freezes: 0, phoenixUsed: 0 }, daily: { day: dayKey(t), xp: 0, lessons: 0, reviews: 0, combo: 0, claimed: {}, goal: false },
    upg: {}, relics: {}, ach: {}, gloss: {}, hints: 3, hintT: t, stats: { answered: 0, correct: 0, lessons: 0, perfect: 0, bestCombo: 0, reviews: 0, tickets: 0, bosses: 0, playMs: 0, coinsEarned: 0 },
    work: { tickets: [], seq: 100 }, settings: { sound: true }, last: t, seenIntro: false };
}
function load() {
  try { var raw = localStorage.getItem(KEY); if (raw) { var o = JSON.parse(raw); S = merge(fresh(), o); migrate(o); return true; } } catch (e) { console.warn('load failed', e); }
  S = fresh(); return false;
}
function merge(base, o) { for (var k in o) { if (o[k] && typeof o[k] === 'object' && !Array.isArray(o[k]) && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) base[k] = merge(base[k], o[k]); else base[k] = o[k]; } return base; }
function migrate(o) { var v = o.v || 1; if (v < 3) { S.v = 3; S.migratedFrom = v; if (v < 2) S.seenV2 = false; S.seenV3 = false; S.seenIntro = !!o.seenIntro; save(); } }
function save() { try { S.last = Date.now(); localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
function exportSave() { save(); return btoa(unescape(encodeURIComponent(JSON.stringify(S)))); }
function importSave(str) { var o = JSON.parse(decodeURIComponent(escape(atob(str.trim())))); if (!o || (o.v !== 1 && o.v !== 2 && o.v !== 3) || !o.items) throw new Error('Not a Dungeons & Debuggers save'); S = merge(fresh(), o); migrate(o); save(); }
function reset() { localStorage.removeItem(KEY); S = fresh(); S.seenV2 = true; S.seenV3 = true; save(); }

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
function knowledgePower() { var p = 0; for (var k in S.items) p += BOX_POINTS[Math.min(S.items[k].b, 6)]; return p + 5 * chSolvedCount(); }
function trackStats(t) { var us = TRACK_UNITS[t] || [], n = 0, m = 0, seen = 0; us.forEach(function (u) { u.qids.forEach(function (id) { n++; var b = item(id).b; if (b >= MASTER_BOX) m++; if (b > 0) seen++; }); }); return { n: n, mastered: m, seen: seen, mastery: us.length ? us.reduce(function (a, u) { return a + unitMastery(u) * u.qids.length; }, 0) / n : 0 }; }
function tierUnits(T) { return DD.units.filter(function (u) { return u.tier === T; }); }
function tierStatus(T) {
  var us = tierUnits(T), learned = us.filter(unitLearned).length, n = 0, s = 0;
  us.forEach(function (u) { u.qids.forEach(function (id) { n++; s += Math.min(item(id).b, MASTER_BOX); }); });
  var mastery = n ? s / (n * MASTER_BOX) : 0, cd = (S.bossCd[T] || 0) - Date.now();
  var cs = tierChallenges(T), cSolved = cs.filter(function (c) { return chSolved(c.id); }).length, cNeed = Math.ceil(cs.length * BOSS_BUILD);
  var bossCh = CHD.list.filter(function (c) { return c.boss === T; })[0];
  var tc = tierConcepts(T), mPr = tc.filter(function (g) { return mLevel(g) >= 2; }).length, mNeed = Math.ceil(tc.length * M_PRACTICED);
  return { mN: tc.length, mPr: mPr, mNeed: mNeed, units: us.length, learned: learned, mastery: mastery, need: BOSS_MASTERY, chN: cs.length, chSolved: cSolved, chNeed: cNeed, bossCh: bossCh, bossChDone: !bossCh || chSolved(bossCh.id),
    ready: cSolved >= cNeed && mPr >= mNeed && S.tier === T - 1, cooldown: cd > 0 ? cd : 0, beaten: S.tier >= T };
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
  return { kind: 'boss', tierN: T, queue: shuffle(ids.slice(0, BOSS_LEN)), title: tier.bossIcon + ' ' + tier.boss, hp: BOSS_HP, maxHp: BOSS_HP, focus: BOSS_FOCUS };
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
function hintCap() { return 3 + lv('hintCap') + (hasRelic('scroll') ? 2 : 0) + (hasRelic('prism') ? 1 : 0); }
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
  { id: 'bld', ic: '🔨', txt: 'Solve 2 hands-on challenges', f: function () { return (S.daily.builds || 0) >= 2; }, r: 20 },
  { id: 'les', ic: '🥊', txt: 'Finish a mastery slam', f: function () { return (S.daily.slams || 0) >= 1; }, r: 15 },
  { id: 'rev', ic: '🎯', txt: 'Get 10 drills right, unaided', f: function () { return (S.daily.drillOk || 0) >= 10; }, r: 15 },
  { id: 'cmb', ic: '🔥', txt: 'Hit a 10 combo', f: function () { return S.daily.combo >= 10; }, r: 20 }
];
function rollDay() {
  var today = dayKey(Date.now());
  if (S.daily.day === today) return;
  S.daily = { day: today, xp: 0, lessons: 0, reviews: 0, builds: 0, combo: 0, claimed: {}, goal: false };
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
function coinMult() { var m = (1 + 0.12 * lv('coffee')) * (hasRelic('gear') ? 1.25 : 1); if (lv('plant')) m *= 1.05; if (hasRelic('crown')) m *= 1.5; if (hasRelic('semi')) m *= 2; return m; }
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
function tick(dtMs, offline) { var r = botTick(dtMs, offline); tickHints(); return r; }
function tickOld(dtMs, offline) {
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

// ---------- hands-on challenges ----------
var CH_TRACK = {}; CHD.list.forEach(function (c) { if (c.boss) return; (CH_TRACK[c.t] = CH_TRACK[c.t] || []).push(c); });
Object.keys(CH_TRACK).forEach(function (t) { CH_TRACK[t] = CH_TRACK[t].map(function (c, i) { return [c, i]; }).sort(function (a, b) { return a[0].tier - b[0].tier || a[1] - b[1]; }).map(function (x) { return x[0]; }); CH_TRACK[t].forEach(function (c, i) { c.order = i; }); });
var CH_TRACK_BY_ID = {}; CHD.tracks.forEach(function (t) { CH_TRACK_BY_ID[t.id] = t; });
function chState(id) { return S.ch[id] || null; }
function chSolved(id) { var c = S.ch[id]; return !!(c && c.solved); }
function chSolvedCount() { var n = 0; for (var k in S.ch) if (S.ch[k].solved && CHD.byId[k] && !CHD.byId[k].boss && !CHD.byId[k].bot) n++; return n; }
function tierChallenges(T) { return CHD.list.filter(function (c) { return c.tier === T && !c.boss && !c.bot; }); }
function chTrackUnlocked(t) { var d = CH_TRACK_BY_ID[t]; if (!d) return false; var first = (CH_TRACK[t] || [])[0]; if (!first || first.tier > S.tier + 1) return false; return chSolvedCount() >= d.need; }
function chOpen(c) {
  if (c.boss) { var st = tierStatus(c.boss); return st.ready || st.beaten || chSolved(c.id); }
  if (chSolved(c.id)) return true;
  if (c.bot) return botModOpen(c);
  if (!chTrackUnlocked(c.t) || c.tier > S.tier + 1) return false;
  var list = CH_TRACK[c.t]; return c.order === 0 || chSolved(list[c.order - 1].id);
}
function botModNeeds(c) { var b = c.bot, out = []; (b.need || []).forEach(function (id) { var g = DRL.byId[id]; if (g && mLevel(g) < 2) out.push({ k: 'concept', id: id, g: g }); }); (b.after || []).forEach(function (id) { if (!chSolved(id)) out.push({ k: 'mod', id: id, c: CHD.byId[id] }); }); if (c.tier > S.tier + 1) out.push({ k: 'tier', t: c.tier }); return out; }
function botModOpen(c) { return !botModNeeds(c).length; }
function chWhyLocked(c) {
  if (c.bot) return botModNeeds(c).map(function (n) { return n.k === 'concept' ? 'Practice “' + n.g.name + '” in 🎯 Mastery' + (conceptUnlocked(n.g) ? '' : ' (build its challenge first)') : n.k === 'mod' ? 'Install ' + n.c.title + ' first' : 'Reach Tier ' + n.t; }).join(' · ');
  if (c.boss) return 'Solve ' + Math.round(BOSS_BUILD * 100) + '% of Tier ' + c.boss + ' challenges and get ' + Math.round(M_PRACTICED * 100) + '% of its concepts to Practiced in 🎯 Mastery.';
  if (c.tier > S.tier + 1) return 'Beat the Tier ' + (c.tier - 1) + ' boss first.';
  if (!chTrackUnlocked(c.t)) return 'Solve ' + CH_TRACK_BY_ID[c.t].need + ' challenges anywhere to unlock this track.';
  return 'Solve the previous challenge first.';
}
function chTrackStats(t) { var l = CH_TRACK[t] || []; return { n: l.length, solved: l.filter(function (c) { return chSolved(c.id); }).length }; }
function chNext() { // a good next challenge for "Today"
  var best = null;
  CHD.tracks.forEach(function (t) { (CH_TRACK[t.id] || []).forEach(function (c) { if (!best && chOpen(c) && !chSolved(c.id)) best = c; }); });
  return best;
}
function chXpBase(c) { return 40 + 20 * c.tier + (c.boss ? 200 * c.boss : 0); }
function chRecord(c, info) { // info: {vals, code, hintLv, runs, typed}
  var t = Date.now(), st = S.ch[c.id] || (S.ch[c.id] = { runs: 0, hintLv: 0 });
  rollDay();
  st.runs = (st.runs || 0) + 0; st.vals = info.vals; st.code = info.code; st.typed = !!info.typed;
  var first = !st.solved, r = { first: first, xp: 0, insight: 0, drops: [], newTerms: [] };
  var hl = Math.max(st.hintLv || 0, info.hintLv || 0);
  var mult = xpMult() * (hasRelic('anvil') ? 1.3 : 1);
  if (first) {
    st.solved = t; st.solvedRuns = st.runs;
    var x = chXpBase(c), firstRun = st.runs <= 1 && hl === 0;
    if (firstRun) x *= hasRelic('forge') ? 1.5 : 1.25;
    if (hl === 2) x *= 0.75; else if (hl >= 3) x *= 0.4;
    S.chCombo = hl >= 2 ? 0 : (S.chCombo || 0) + 1;
    x *= 1 + Math.min(0.5, 0.05 * Math.max(0, S.chCombo - 1));
    r.xp = Math.round(x * mult); r.insight = Math.round((5 + 2 * c.tier) * insightMult()); r.firstRun = firstRun; r.combo = S.chCombo;
    S.stats.challenges = (S.stats.challenges || 0) + 1; if (firstRun) S.stats.firstRun = (S.stats.firstRun || 0) + 1; if (!hl) S.stats.noHint = (S.stats.noHint || 0) + 1;
    S.daily.builds = (S.daily.builds || 0) + 1;
    if (hl < 3) { r.drops = r.drops.concat(rollRelic('challenge'), rollRelic('lesson')); if (firstRun) r.drops = r.drops.concat(rollRelic('firstrun')); if (!hl) r.drops = r.drops.concat(rollRelic('perfect')); }
    ((c.learn && c.learn.terms) || []).forEach(function (term) { if (DD.glossary[term] && !S.gloss[term]) { S.gloss[term] = t; r.newTerms.push(term); } });
  } else { r.xp = Math.round(chXpBase(c) * 0.2 * mult); r.insight = 1; }
  S.xp += r.xp; S.insight += r.insight; S.daily.xp += r.xp; S.txp['c:' + c.t] = (S.txp['c:' + c.t] || 0) + r.xp;
  checkDailyGoal(); r.ach = checkAch(); save();
  return r;
}
function chRun(c) { if (c.drill) return 0; var st = S.ch[c.id] || (S.ch[c.id] = { runs: 0, hintLv: 0 }); st.runs = (st.runs || 0) + 1; save(); return st.runs; }
function chHint(c, level) { if (c.drill) return 0; var st = S.ch[c.id] || (S.ch[c.id] = { runs: 0, hintLv: 0 }); if (!st.solved) st.hintLv = Math.max(st.hintLv || 0, level); save(); return st.hintLv; }
function chExplore(c, key) { // reward distinct experiments
  var st = S.ch[c.id] || (S.ch[c.id] = { runs: 0, hintLv: 0 }); st.ex = st.ex || [];
  if (st.ex.indexOf(key) >= 0 || st.ex.length >= Math.max(6, (c.explore || 0) * 2)) return null;
  st.ex.push(key); S.stats.experiments = (S.stats.experiments || 0) + 1;
  var xp = Math.round(4 * xpMult() * (hasRelic('prism') ? 2 : 1)); S.xp += xp; S.daily.xp += xp;
  var drops = rollRelic('explore'); checkDailyGoal(); checkAch(); save();
  return { xp: xp, n: st.ex.length, drops: drops };
}
function projSteps(pid) { return CHD.list.filter(function (c) { return c.proj && c.proj[0] === pid; }).sort(function (a, b) { return a.proj[1] - b.proj[1]; }); }
function projProgress(pid) { var st = projSteps(pid); return { n: st.length, done: st.filter(function (c) { return chSolved(c.id); }).length, steps: st }; }
function projDoneCount() { return CHD.projects.filter(function (p) { var g = projProgress(p.id); return g.n && g.done === g.n; }).length; }

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
  tick: tick, ensureTickets: ensureTickets, claimTicket: claimTicket, ticketSpeed: ticketSpeed, workSpeed: workSpeed, coinMult: coinMult, slots: slots, offRate: offRate, offCap: offCap, repLevel: repLevel, ticketLevelCap: ticketLevelCap, offlineCatchup: offlineCatchup, checkAch: checkAch, xpMult: xpMult, xpFor: xpFor, txpFor: txpFor,
  DRL: DRL, M_LEVELS: M_LEVELS, M_PRACTICED: M_PRACTICED, conceptUnlocked: conceptUnlocked, mState: mState, mLevel: mLevel, mPct: mPct, mDue: mDue, conceptsOpen: conceptsOpen, conceptsDue: conceptsDue, practicedCount: practicedCount, tierConcepts: tierConcepts, pickSlam: pickSlam, drillResult: drillResult, finishSlam: finishSlam,
  TASK_TYPES: TASK_TYPES, BOT_STAGES: BOT_STAGES, ERR_TXT: ERR_TXT, botMods: botMods, botStats: botStats, botTypes: botTypes, botModNeeds: botModNeeds, botModOpen: botModOpen, hasMod: hasMod, taskCoins: taskCoins,
  CHD: CHD, CH_TRACK: CH_TRACK, chState: chState, chSolved: chSolved, chSolvedCount: chSolvedCount, chOpen: chOpen, chWhyLocked: chWhyLocked, chTrackUnlocked: chTrackUnlocked, chTrackStats: chTrackStats, chNext: chNext, chRecord: chRecord, chRun: chRun, chHint: chHint, chExplore: chExplore, chXpBase: chXpBase, tierChallenges: tierChallenges, projSteps: projSteps, projProgress: projProgress, projDoneCount: projDoneCount, BOSS_BUILD: BOSS_BUILD
};
})(typeof window !== 'undefined' ? window : globalThis);
