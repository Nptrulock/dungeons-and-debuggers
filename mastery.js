// v3 Mastery: slam sessions of applied drills (no prompts, just a tag), spaced per concept.
(function () {
var G = window.Game, X = function () { return window.UIX; }, $ = function (s) { return document.querySelector(s); };
function esc(s) { return X().esc(s); }
var TRK = {}; G.CHD.tracks.forEach(function (t) { TRK[t.id] = t; });
var sess = null, lastSummary = null;

function start(s) {
  if (!s || !s.drills.length) { X().toast('Build a challenge first. Each one you solve unlocks drills for its concept.'); return; }
  sess = s; openCur();
}
function openCur() {
  var ch = sess.drills[sess.i], g = G.DRL.byId[ch.drill], s = sess;
  window.PLAY.open(ch, {
    label: (s.kind === 'mboss' ? '⚔️ Exam ' : '🎯 Slam ') + (s.i + 1) + '/' + s.drills.length, combo: s.combo, last: s.i === s.drills.length - 1, conceptName: g.name,
    comboNow: function () { return s.combo; },
    onResult: function (r) { return G.drillResult(s, ch, r); },
    onNext: next, onQuit: function () { quit(s); }
  });
}
function next() { if (!sess) return; sess.i++; if (sess.i >= sess.drills.length) return finish(); openCur(); }
function quit(s) { if (s !== sess) return; if (s.results.length || s.kind === 'mboss') finish(); else { sess = null; X().render(); } }
function finish() {
  var s = sess; sess = null; window.PLAY.release();
  var r = G.finishSlam(s); lastSummary = { s: s, r: r };
  var boss = s.kind === 'mboss', tier = boss ? window.DD.tiers[s.tierN - 1] : null;
  var trophy = boss ? (r.won ? '🏆' : '💀') : r.perfect ? '💯' : r.ok >= r.n * 0.7 ? '⚡' : '📘';
  var title = boss ? (r.won ? tier.boss + ' defeated!' : 'Defeated… for now') : r.perfect ? 'Perfect slam!' : 'Slam complete';
  var tot = s.results.reduce(function (a, x) { return a + x.ms; }, 0);
  var h = '<div class="lesson"><div class="lbody"><div class="discCard slamSum"><div class="bigic">' + trophy + '</div><h2>' + title + '</h2>' +
    '<div class="stats3"><div class="stat"><small>Unaided</small><b>' + r.ok + '/' + (boss ? s.drills.length : r.n) + '</b></div><div class="stat"><small>Best combo</small><b>🔥' + s.best + '</b></div><div class="stat"><small>Time</small><b>' + Math.round(tot / 1000) + 's</b></div></div>' +
    '<div class="stats3"><div class="stat"><small>XP</small><b style="color:var(--good)">+' + (s.xp + r.xp) + '</b></div><div class="stat"><small>Insight</small><b>+' + (s.insight + r.insight) + ' 💠</b></div><div class="stat"><small>Concepts</small><b>' + G.practicedCount() + ' 🛠️</b></div></div>' +
    (boss ? '<div class="card"><b>' + (r.won ? 'Promoted to ' + G.RANKS[s.tierN].name + '!' : 'You needed ' + r.need + ' unaided.') + '</b><div class="muted">' + (r.won ? (s.tierN < 5 ? window.DD.tiers[s.tierN].name + ' challenges are now open.' : 'You beat the final boss.') : 'Missed concepts are due again in 5 minutes. The exam reopens in 30 minutes.') + '</div></div>' : '') +
    s.ups.map(function (u) { var g = G.DRL.byId[u.g], L = G.M_LEVELS[u.lv]; return '<div class="card" style="border-color:var(--gold)"><b>' + L.ic + ' ' + esc(g.name) + ': ' + L.n + '</b></div>'; }).join('') +
    s.drops.concat(r.drops || []).map(function (d) { return '<div class="card" style="border-color:var(--gold);text-align:center"><div style="font-size:30px">' + d.ic + '</div><b>RELIC: ' + esc(d.name) + '</b><div class="muted">' + esc(d.eff) + '</div></div>'; }).join('') +
    '<div class="sectionTitle">Drills</div>' + s.results.map(function (x) { var g = G.DRL.byId[x.g]; return '<div class="req slamRow"><span>' + (x.unaided ? (x.speed > 1 ? '⚡' : '✅') : x.ok ? '🔧' : '❌') + '</span> ' + g.icon + ' ' + esc(g.name) + '<span class="grow"></span><span class="tiny">' + Math.round(x.ms / 1000) + 's · ' + G.mPct(g) + '%</span></div>'; }).join('') +
    '<div class="row" style="gap:8px;margin-top:12px">' + (boss ? '' : '<button class="btn grow" data-act="msslam" data-v="6">⚡ Slam again</button>') + '<button class="btn ghost grow" data-act="msclose">Done</button></div></div></div></div>';
  var ov = $('#overlay'); ov.innerHTML = h; ov.classList.remove('hidden');
  X().SFX.done(); X().confetti(boss && r.won ? 260 : r.perfect ? 160 : 60);
}
function closeSum() { var ov = $('#overlay'); ov.classList.add('hidden'); ov.innerHTML = ''; X().render(); }

function lvChip(g) { var L = G.M_LEVELS[G.mLevel(g)]; return '<span class="mLv lv' + G.mLevel(g) + '">' + L.ic + ' ' + L.n + '</span>'; }
function pageHTML() {
  var S = G.S, open = G.conceptsOpen(), due = G.conceptsDue(), all = G.DRL.gens, h = '';
  var mastered = all.filter(function (g) { return G.mLevel(g) === 4; }).length, fluent = all.filter(function (g) { return G.mLevel(g) === 3; }).length;
  h += '<div class="card trackHero" style="--tc:#22d3ee"><div class="row"><div class="bigIcon">🎯</div><div class="grow"><h2>Mastery drills</h2><div class="muted">Each drill is just a tag, like <i>“Center it with flexbox”</i>. No story, no hints. You fix real code, the tests decide, and you only see an explanation after a miss. New variants every time.</div></div></div>' +
    '<div class="stats3" style="margin-top:10px"><div class="stat"><small>Open</small><b>' + open.length + '/' + all.length + '</b></div><div class="stat"><small>Due now</small><b style="color:var(--gold)">' + due.length + '</b></div><div class="stat"><small>Practiced+</small><b>' + G.practicedCount() + '</b></div></div>' +
    (open.length ? '<button class="btn gold big" style="margin-top:10px" data-act="msslam" data-v="6">⚡ Slam 6' + (due.length ? ' · ' + Math.min(6, due.length) + ' due' : '') + '</button><button class="btn ghost" style="margin-top:6px;width:100%" data-act="msslam" data-v="10">🔥 Long slam (10)</button>' : '<div class="muted" style="margin-top:10px">Nothing to drill yet. Solve a challenge in 🔨 Build and its concept appears here.</div>') +
    '<div class="tiny" style="margin-top:8px;line-height:1.5">⚡ Fast answers pay a speed bonus and 🔥 combos stack XP. Levels: 🌱 Learned → 🛠️ Practiced (2 unaided, 2 variants) → ⚡ Fluent (box 4, 2 days, 4 variants) → 👑 Mastered (box 6, 3 days, 6 variants, 3 in a row). Spacing grows 10 min → 20 h → 3 d → 7 d → 16 d; a miss halves the box.</div></div>';
  var T = Math.min(S.tier + 1, 5);
  if (S.tier < 5) { var ts = G.tierStatus(T), tier = window.DD.tiers[T - 1]; h += '<div class="card bossCard"><div class="row"><div class="bossIc">' + tier.bossIcon + '</div><div class="grow"><div class="tiny">TIER ' + T + ' BOSS GATE</div><b>' + tier.boss + '</b><div class="muted">Practiced ' + ts.mPr + '/' + ts.mNeed + ' of ' + ts.mN + ' ' + tier.name + ' concepts' + (ts.mPr >= ts.mNeed ? ' ✅' : '') + '</div></div></div><div class="bar small" style="margin-top:6px"><i style="width:' + Math.min(100, ts.mNeed ? ts.mPr / ts.mNeed * 100 : 100) + '%;background:linear-gradient(90deg,#22d3ee,#a78bfa)"></i></div></div>'; }
  h += '<div class="sectionTitle">Concepts · ' + fluent + ' ⚡ fluent · ' + mastered + ' 👑 mastered</div>';
  G.CHD.tracks.forEach(function (t) {
    var gs = all.filter(function (g) { return g.t === t.id; }); if (!gs.length) return;
    h += '<div class="tierHead">' + t.icon + ' ' + esc(t.name) + ' · ' + gs.filter(G.conceptUnlocked).length + '/' + gs.length + '</div>';
    gs.forEach(function (g) {
      if (!G.conceptUnlocked(g)) { var c = G.CHD.byId[g.from[0]]; h += '<div class="concept locked"><span class="cIc">🔒</span><div class="grow"><b>' + esc(g.name) + '</b><div class="tiny">Build “' + esc(c ? c.title : g.from[0]) + '” to discover</div></div></div>'; return; }
      var m = G.mState(g.id), dueNow = G.mDue(g), p = G.mPct(g);
      h += '<div class="concept"><span class="cIc">' + g.icon + '</span><div class="grow"><div class="row" style="gap:6px"><b>' + esc(g.name) + '</b>' + lvChip(g) + (dueNow ? '<span class="dueTag">due</span>' : '') + '</div>' +
        '<div class="bar small"><i style="width:' + p + '%;background:' + t.color + '"></i></div><div class="tiny">' + p + '% · ' + (m ? m.ok + ' unaided · ' + (m.vars || []).length + ' variants · ' + (m.days || []).length + ' day' + ((m.days || []).length === 1 ? '' : 's') + (m.due > Date.now() ? ' · next in ' + X().dur(m.due - Date.now()) : '') : 'not drilled yet') + '</div></div>' +
        '<button class="btn sm" data-act="msone" data-v="' + g.id + '">Drill</button></div>';
    });
  });
  return h;
}
function bossStart(T) {
  var ts = G.tierStatus(T); if (!(ts.ready && ts.bossChDone && !ts.cooldown)) return X().toast('The exam is not open yet.');
  var pool = G.conceptsOpen().filter(function (g) { return G.DRL.tierOf(g) <= T; });
  start(G.pickSlam(8, { boss: T, pool: pool }));
}
function act(a, v) {
  if (a === 'msslam') { if (lastSummary) { lastSummary = null; } return start(G.pickSlam(+v || 6)); }
  if (a === 'msone') { var g = G.DRL.byId[v]; return start(G.pickSlam(3, { pool: [g] })); }
  if (a === 'msboss') return bossStart(+v);
  if (a === 'msclose') return closeSum();
}
window.MASTERY = { pageHTML: pageHTML, act: act, start: start, bossStart: bossStart, get sess() { return sess; } };
})();
