// Dungeons & Debuggers — hands-on challenge player, Build tab and Workshop.
(function () {
'use strict';
var G = window.Game, CHD = window.CHD, SB = window.SB;
var $ = function (s, r) { return (r || document).querySelector(s); };
function X() { return window.UIX; }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function md(s) { // tiny markdown: `code`, **bold**, paragraphs
  return String(s || '').split(/\n\n+/).map(function (p) { return '<p>' + esc(p).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>') + '</p>'; }).join('');
}
var TRK = {}; CHD.tracks.forEach(function (t) { TRK[t.id] = t; }); TRK.bot = { id: 'bot', icon: '🤖', name: 'Your Bot', color: '#818cf8' };
var PRJ = {}; CHD.projects.forEach(function (p) { PRJ[p.id] = p; });
var SBNAME = { html: '🧱 Live page', js: '⚡ JavaScript', py: '🐍 Python', sql: '🗄️ SQLite', git: '🌿 Terminal', cmp: '⚙️ Compiler', ai: '🤖 AI assistant' };
var LANG = { cpp: { file: 'main.cpp', tool: 'clang++ (C++17)', run: './main' }, java: { file: 'Main.java', tool: 'javac + java 21', run: 'java Main' }, rust: { file: 'main.rs', tool: 'rustc 1.85', run: './main' }, go: { file: 'main.go', tool: 'go 1.27', run: 'go run' }, ts: { file: 'main.ts', tool: 'tsc 7 (strict)', run: 'node main.js' }, bash: { file: 'script.sh', tool: 'bash 5', run: 'bash script.sh' }, py: { file: 'main.py', tool: 'python 3.13', run: 'python3 main.py' }, js: { file: 'main.js', tool: 'node 24', run: 'node main.js' } };

// ---------------- state of the open challenge ----------------
var P = null;
function open(id, dopt) {
  var ch = typeof id === 'object' ? id : CHD.byId[id]; if (!ch) return;
  var st = ch.drill ? {} : (G.chState(ch.id) || {});
  P = { ch: ch, vals: Object.assign({}, st.draft || (st.solved && st.vals) || CHD.startVals(ch)), typed: false, text: '', runs: 0, hintLv: st.hintLv || 0, res: null, steps: null, step: 0, bp: {}, errLine: 0, won: !!st.solved, rewarded: false, chat: [], sel: {}, busy: false };
  if (ch.drill) P.drill = { o: dopt || {}, t0: Date.now(), missed: false, done: false, errs: 0 };
  if (ch.sb === 'git') { P.git = SB.newGit(ch); P.term = []; P.cmd = ''; P.tab = 'graph'; if (ch.git.intro) P.term.push({ o: ch.git.intro }); }
  if (ch.sb === 'ai') { (st.solved && st.sel || []).forEach(function (k) { P.sel[k] = 1; }); }
  var ov = $('#overlay'); ov.classList.remove('hidden');
  ov.innerHTML = '<div class="cp">' +
    '<div class="lhead"><button class="x" data-act="chquit">✕</button><div class="grow cpTitle" id="cpTitle"></div>' + (ch.drill ? '<button class="btn sm ghost" data-act="chdgive">🏳️ Show me</button>' : '<button class="btn sm ghost" data-act="chhint">💡</button>') + '</div>' +
    '<div class="cpBody" id="cpBody"><div id="cpStory"></div><div id="cpGoals"></div><div id="cpHint"></div>' +
    '<div class="cpPanel" id="cpPanel"><div class="cpOutHead" id="cpOutHead"></div><div id="cpOut" class="cpOut"></div><div id="cpCon" class="cpCon hidden"></div><canvas id="cpTurtle" class="cpTurtle hidden" width="320" height="240"></canvas><div id="cpStep"></div><div id="cpExtra"></div></div>' +
    '<div id="cpCode"></div><div id="cpLearn"></div></div>' +
    '<div class="cpFoot" id="cpFoot"></div><div id="cpHidden" class="cpHidden"></div><div id="cpSheet" class="cpSheet hidden"></div><div id="cpDone" class="cpDone hidden"></div></div>';
  X().audioInit(); X().SFX.select();
  drawAll();
  if (ch.sb === 'html') livePreview(); var me0 = P;
  if (ch.sb === 'py') SB.pyLoad(function (s) { if (P === me0) con('⏳ ' + s, 'sys'); }).then(function () { if (P !== me0) return; if (P.drill && Date.now() - P.drill.t0 > 1500) P.drill.t0 = Date.now(); con('🐍 Python ' + 'is ready.', 'sys'); }, function (e) { if (P !== me0) return; con('⚠️ ' + e.message, 'err'); });
  if (ch.sb === 'sql') SB.sqlLoad(function (s) { if (P === me0) setOut('<div class="muted">⏳ ' + esc(s) + '</div>'); }).then(function () { if (P !== me0) return; if (!P.res) setOut('<div class="muted">🗄️ SQLite is ready. Press ▶ Run to query the database.</div>'); }, function (e) { if (P !== me0) return; setOut('<div class="cpErr">⚠️ ' + esc(e.message) + '</div>'); });
}
function close() {
  if (P && P.drill) { var dq = P.drill; P = null; var ov0 = $('#overlay'); ov0.classList.add('hidden'); ov0.innerHTML = ''; if (dq.o.onQuit) dq.o.onQuit(dq.done); X().render(); return; }
  if (P && !P.won) { var st = G.chState(P.ch.id); if (st || P.runs) { G.S.ch[P.ch.id] = G.S.ch[P.ch.id] || { runs: 0, hintLv: 0 }; G.S.ch[P.ch.id].draft = P.vals; G.save(); } }
  P = null; var ov = $('#overlay'); ov.classList.add('hidden'); ov.innerHTML = ''; X().render();
}
function code() { return P.typed ? P.text : SB.fill(P.ch, P.vals); }
function drawAll() { drawTitle(); drawStory(); drawGoals(); drawHint(); drawCode(); drawFoot(); drawOutHead(); if (P.ch.sb === 'git') drawGit(); if (P.ch.sb === 'ai') drawAI(); if (P.ch.sb === 'cmp') drawCmpIdle(); }
function drawTitle() {
  if (P.drill) { var o = P.drill.o, tr = TRK[P.ch.t] || { icon: '🎯', name: '' }; $('#cpTitle').innerHTML = '<div class="tiny">' + (o.label || '🎯 Drill') + ' · ' + tr.icon + ' ' + esc(tr.name) + (SBNAME[P.ch.sb] !== tr.name ? ' · ' + SBNAME[P.ch.sb] : '') + (o.combo ? ' · 🔥' + o.combo : '') + ' · ⏱ <span id="drTimer">0s</span></div><b class="drTag">' + esc(P.ch.title) + '</b>'; return; }
  var ch = P.ch, t = ch.boss ? { icon: '⚔️', name: 'Boss' } : TRK[ch.t];
  $('#cpTitle').innerHTML = '<div class="tiny">' + t.icon + ' ' + esc(t.name) + ' · ' + SBNAME[ch.sb] + (ch.proj ? ' · ' + PRJ[ch.proj[0]].icon + ' ' + esc(PRJ[ch.proj[0]].name) + ' ' + ch.proj[1] + '/' + G.projSteps(ch.proj[0]).length : '') + '</div><b>' + (ch.icon || '') + ' ' + esc(ch.title) + '</b>';
}
function drawStory() {
  if (P.drill) { $('#cpStory').innerHTML = ''; return; }
  var ch = P.ch, h = '<div class="cpStory">' + md(ch.story) + '</div>';
  if (ch.explore) h += '<div class="cpExplore">🧪 <b>Experiment zone</b>: every different version you run earns XP. Try at least ' + ch.explore + '.</div>';
  if (ch.boss) h += '<div class="cpBossNote">⚔️ Boss rules: ' + (ch.sb === 'git' ? 'at most <b>' + ch.runs + '</b> commands.' : '<b>' + ch.runs + '</b> runs to get every goal green.') + ' Runs used: <b id="cpRunsUsed">' + P.runs + '</b></div>';
  $('#cpStory').innerHTML = h;
}
function goalsDone() { return P.res && P.res.length && P.res.every(Boolean) && exploreOk(); }
function exploreOk() { if (!P.ch.explore) return true; var st = G.chState(P.ch.id); return P.won || (st && st.ex && st.ex.length >= P.ch.explore); }
function drawGoals() {
  if (P.drill && !P.res) { $('#cpGoals').innerHTML = '<div class="tiny drNote">No hints. Tests check the result when you ' + (P.ch.sb === 'git' ? 'run commands' : P.ch.sb === 'ai' ? 'send' : 'run') + '.</div>'; return; }
  var ch = P.ch, h = '<div class="cpGoals"><div class="tiny">GOALS</div>';
  ch.goals.forEach(function (g, i) { var r = P.res ? P.res[i] : null; h += '<div class="goal ' + (r === true ? 'ok' : r === false ? 'no' : '') + '"><span>' + (r === true ? '✅' : r === false ? '❌' : '⬜') + '</span> ' + md(g[0]).replace(/^<p>|<\/p>$/g, '') + '</div>'; });
  if (ch.explore) { var st = G.chState(ch.id), n = st && st.ex ? st.ex.length : 0; h += '<div class="goal ' + (n >= ch.explore ? 'ok' : '') + '"><span>' + (n >= ch.explore ? '✅' : '🧪') + '</span> Run ' + ch.explore + ' different experiments (' + Math.min(n, ch.explore) + '/' + ch.explore + ')</div>'; }
  $('#cpGoals').innerHTML = h + '</div>';
}
function drawHint() {
  var ch = P.ch, h = '';
  if (P.hintLv >= 1 && ch.hints[0]) h += '<div class="cpHintBox">💡 ' + md(ch.hints[0]).replace(/^<p>|<\/p>$/g, '') + '</div>';
  if (P.hintLv >= 2 && ch.hints[1]) h += '<div class="cpHintBox">🔦 ' + md(ch.hints[1]).replace(/^<p>|<\/p>$/g, '') + '</div>';
  if (P.hintLv >= 3) h += '<div class="cpHintBox sol">🗝️ ' + solText() + '</div>';
  $('#cpHint').innerHTML = h;
}
function drillSol() {
  var ch = P.ch;
  if (ch.sb === 'git') return 'Answer: <code>' + ch.sol.map(esc).join('</code> → <code>') + '</code>';
  if (ch.sb === 'ai') return 'Answer: include ' + ch.sol.map(function (k) { var p = ch.ai.parts.filter(function (x) { return x.id === k; })[0]; return '<b>' + esc(p ? p.txt : k) + '</b>'; }).join(' + ') + '.';
  return 'Answer: ' + Object.keys(ch.sol || {}).map(function (k) { return '<code>' + esc(String(ch.sol[k])) + '</code>'; }).join(' and ') + '. Set it, then ▶ Run (counts as practice), or move on.';
}
function solText() {
  var ch = P.ch;
  if (ch.sb === 'git') return 'One way: <code>' + ch.sol.map(esc).join('</code> → <code>') + '</code>';
  if (ch.sb === 'ai') return 'Include: ' + ch.sol.map(function (k) { var p = ch.ai.parts.filter(function (x) { return x.id === k; })[0]; return '<b>' + esc(p.txt) + '</b>'; }).join(' + ') + '. The parts are now selected. Press Send.';
  return 'The solution is now filled in. Press ▶ Run and read why it works.';
}
function drawOutHead() {
  var ch = P.ch, h = '';
  if (ch.sb === 'html') h = '📱 Live preview';
  else if (ch.sb === 'js') h = viewMode() === 'console' ? '🖥️ Console' : '📱 Result';
  else if (ch.sb === 'py') h = '🖥️ Python console';
  else if (ch.sb === 'sql') h = '📋 Query results <button class="btn sm ghost" data-act="chpeek" style="float:right">👀 Peek at the tables</button>';
  else if (ch.sb === 'cmp') h = '🛠️ Build & run';
  else if (ch.sb === 'git') h = '';
  else if (ch.sb === 'ai') h = '💬 Conversation';
  $('#cpOutHead').innerHTML = h; $('#cpOutHead').classList.toggle('hidden', !h);
}
function viewMode() { var ch = P.ch; return ch.view || (ch.sb === 'html' ? 'page' : ch.html ? 'both' : 'console'); }
function setOut(h) { $('#cpOut').innerHTML = h; }
function con(s, k) { var c = $('#cpCon'); if (!c) return; c.classList.remove('hidden'); var d = document.createElement('div'); d.className = 'cl ' + (k || ''); d.textContent = s; c.appendChild(d); c.scrollTop = c.scrollHeight; }
function conClear() { var c = $('#cpCon'); if (c) c.innerHTML = ''; }

// ---------------- code view with tappable slots ----------------
function segs(ch) { var out = [], re = /\{\{(\w+)\}\}/g, last = 0, m; while ((m = re.exec(ch.code))) { if (m.index > last) out.push({ s: ch.code.slice(last, m.index) }); out.push({ k: m[1] }); last = re.lastIndex; } if (last < ch.code.length) out.push({ s: ch.code.slice(last) }); return out; }
function label(ch, k, v) { var s = ch.slots[k]; if (s.l) { var i = s.o.indexOf(v); if (i >= 0) return s.l[i]; } if (v === '' || v === undefined) return '▢'; return String(v) + (s.u || ''); }
function drawCode() {
  var ch = P.ch, box = $('#cpCode');
  if (ch.sb === 'git' || ch.sb === 'ai') { box.innerHTML = ''; return; }
  var lang = ch.sb === 'cmp' ? (ch.lang || 'cpp') : ch.sb;
  var file = ch.file || (ch.sb === 'html' ? 'index.html' : ch.sb === 'js' ? 'app.js' : ch.sb === 'py' ? 'main.py' : ch.sb === 'sql' ? 'query.sql' : LANG[lang].file);
  var h = '<div class="cpCodeHead"><span class="tiny">📄 ' + esc(file) + '</span>' + (ch.sb !== 'cmp' && !ch.noType ? '<button class="btn sm ghost" data-act="chtype">' + (P.typed ? '🧩 Blocks' : '✏️ Type') + '</button>' : '') + '</div>';
  if (P.typed) { h += '<textarea id="cpTa" class="cpTa" spellcheck="false" autocapitalize="off" autocorrect="off">' + esc(P.text) + '</textarea>'; box.innerHTML = h; var ta = $('#cpTa'); ta.addEventListener('input', function () { P.text = ta.value; if (ch.sb === 'html') livePreview(); }); return; }
  var html = segs(ch).map(function (sg) { if (sg.s !== undefined) return X().hl(sg.s); var v = P.vals[sg.k]; return '<button class="slot' + (P.flash === sg.k ? ' flash' : '') + '" data-act="chslot" data-v="' + sg.k + '">' + esc(label(ch, sg.k, v)) + '</button>'; }).join('');
  var n = code().split('\n').length, cur = P.steps && P.steps[P.step] ? P.steps[P.step].l : 0, gut = '';
  for (var i = 1; i <= n; i++) gut += '<span class="ln' + (P.bp[i] ? ' bp' : '') + (i === cur ? ' cur' : '') + (i === P.errLine ? ' err' : '') + '"' + (ch.trace ? ' data-act="chbp" data-v="' + i + '"' : '') + '>' + i + '</span>';
  var hi = cur ? '<div class="lnhi" style="top:' + ((cur - 1) * 20 + 8) + 'px"></div>' : P.errLine ? '<div class="lnhi err" style="top:' + ((P.errLine - 1) * 20 + 8) + 'px"></div>' : '';
  h += '<div class="cpCodeWrap"><div class="gut">' + gut + '</div><pre class="code cpcode">' + hi + html + '</pre></div>';
  h += '<div class="tiny cpTip">' + (Object.keys(ch.slots).length ? 'Tap a <span class="slot demo">highlighted</span> piece to change it.' : '') + (ch.trace ? ' Tap line numbers to set 🔴 breakpoints.' : '') + '</div>';
  box.innerHTML = h;
}
function openSlot(k) {
  var ch = P.ch, s = ch.slots[k], v = P.vals[k], h = '<div class="sheetIn"><div class="row"><b class="grow">Change this piece</b><button class="btn sm ghost" data-act="chsheetx">Done</button></div>';
  if (s.n) {
    h += '<div class="sliderBox"><div class="sliderVal" id="slVal">' + esc(v) + (s.u || '') + '</div><input type="range" id="slIn" min="' + s.n[0] + '" max="' + s.n[1] + '" step="' + (s.n[2] || 1) + '" value="' + v + '"><div class="row tiny"><span class="grow">' + s.n[0] + (s.u || '') + '</span><span>' + s.n[1] + (s.u || '') + '</span></div>' +
      '<div class="row" style="gap:6px;margin-top:8px"><button class="btn sm ghost grow" data-act="chstep" data-v="' + k + ':-1">−</button><button class="btn sm ghost grow" data-act="chstep" data-v="' + k + ':1">+</button></div></div>';
  } else {
    h += '<div class="optList">' + s.o.map(function (o, i) { return '<button class="opt' + (o === v ? ' on' : '') + '" data-act="chpick" data-v="' + k + ':' + i + '"><code>' + esc(s.l ? s.l[i] : o === '' ? '(nothing)' : String(o)) + '</code></button>'; }).join('') + '</div>';
  }
  var sh = $('#cpSheet'); sh.innerHTML = h + '</div>'; sh.classList.remove('hidden');
  var sl = $('#slIn'); if (sl) sl.addEventListener('input', function () { setVal(k, +sl.value); $('#slVal').textContent = sl.value + (s.u || ''); });
}
function setVal(k, v) { P.vals[k] = v; P.flash = k; P.steps = null; P.errLine = 0; drawCode(); drawStepper(); if (P.ch.sb === 'html') livePreview(); }
var lpT = null;
function livePreview() { clearTimeout(lpT); lpT = setTimeout(function () { if (!P || P.busy) return; SB.preview(P.ch, code(), $('#cpOut')); }, 120); }

// ---------------- footer / run ----------------
function drawFoot() {
  var ch = P.ch, h = '';
  if (ch.sb === 'git') h = '';
  else if (ch.sb === 'ai') h = '<button class="btn big" data-act="chrun" ' + (P.busy ? 'disabled' : '') + '>📨 Send to the AI</button>';
  else h = '<button class="btn big" data-act="chrun" ' + (P.busy ? 'disabled' : '') + '>' + (P.busy ? '⏳ Running…' : ch.sb === 'cmp' ? '🛠️ Compile & run' : '▶ Run') + '</button>';
  if (P.won && !h) h = '<button class="btn big green" data-act="chdone">🏁 Finish</button>';
  if (P.drill && P.drill.missed && !P.drill.done) h = (h ? h.replace('btn big', 'btn big ghost') : '') + '<button class="btn big" data-act="chdskip" style="margin-top:6px">Next ▶ (counts as a miss)</button>';
  $('#cpFoot').innerHTML = '<div class="in">' + h + '</div>';
  $('#cpFoot').classList.toggle('hidden', !h);
}
function bossOut() { return P.ch.boss && P.ch.runs && P.runs >= P.ch.runs && !goalsDone(); }
function run() {
  if (!P || P.busy) return; var ch = P.ch, me = P, alive = function () { return P === me; };
  if (ch.boss && P.runs >= ch.runs) return bossLost();
  P.busy = true; P.runs++; G.chRun(ch); X().SFX.tap(); drawFoot(); if (ch.boss) drawStory();
  var c = code(); P.errLine = 0; P.steps = null; P.step = 0;
  var done = function (res) { if (!alive()) return; P.busy = false; P.res = res; drawGoals(); drawCode(); drawStepper(); drawFoot(); after(); };
  if (ch.sb === 'html' || ch.sb === 'js') {
    conClear(); var vm = viewMode(), mount = vm === 'console' ? $('#cpHidden') : $('#cpOut');
    if (vm === 'console') setOut('');
    $('#cpOut').classList.toggle('hidden', vm === 'console');
    if (ch.sb === 'js') $('#cpCon').classList.remove('hidden');
    SB.runFrame(ch, c, mount, { onLog: function (m) { if (!alive()) return; con(m.s, m.k === 'error' ? 'err' : m.k === 'warn' ? 'warn' : ''); } }).then(function (r) {
      if (!alive()) return;
      if (r.timeout) con('⏱️ ' + r.errs[0].msg, 'err');
      if (ch.sb === 'js' && !r.logs.length && !r.errs.length && !r.timeout) con('(nothing was logged)', 'sys');
      if (r.errs && r.errs.length) P.errLine = r.errs[0].line > 0 ? r.errs[0].line : 0;
      if (ch.trace) P.steps = (r.steps || []).map(function (s) { return { l: s.l, v: s.v }; });
      if (ch.trace && P.steps.length) jumpBp(0, true);
      done(r.res);
    });
  } else if (ch.sb === 'py') {
    conClear(); con('$ python3 main.py', 'sys');
    SB.runPy(ch, c, function (s) { if (alive()) con('⏳ ' + s, 'sys'); }).then(function (r) {
      if (!alive()) return;
      (r.out || []).forEach(function (l) { con(l); });
      if (r.err) { con(r.err.tb || r.err.msg, 'err'); P.errLine = r.err.line || 0; }
      if (!r.err && !(r.out || []).length) con('(no output)', 'sys');
      drawTurtle(r.segs || []);
      if (ch.trace) { P.steps = (r.steps || []).map(function (s) { return { l: s[0], v: s[1] }; }); if (P.steps.length) jumpBp(0, true); }
      done(r.res);
    }, function (e) { if (!alive()) return; con('⚠️ ' + e.message, 'err'); P.busy = false; P.runs--; drawFoot(); });
  } else if (ch.sb === 'sql') {
    SB.runSql(ch, c, function (s) { if (alive()) setOut('<div class="muted">⏳ ' + esc(s) + '</div>'); }).then(function (r) {
      if (!alive()) return;
      var h = r.err ? '<div class="cpErr">❌ ' + esc(r.err.msg) + '</div>' : '';
      if (!r.results.length && !r.err) h += '<div class="muted">✔ Ran. (No rows returned.)</div>';
      r.results.forEach(function (t) { h += tableHTML(t.columns, t.values); });
      setOut(h); done(r.res);
    }, function (e) { if (!alive()) return; setOut('<div class="cpErr">⚠️ ' + esc(e.message) + '</div>'); P.busy = false; P.runs--; drawFoot(); });
  } else if (ch.sb === 'cmp') {
    drawCmp(null); setTimeout(function () { if (!alive()) return; var r = SB.runCompiled(ch, P.vals); drawCmp(r); done(r.res); }, 450);
  } else if (ch.sb === 'ai') aiSend(done);
}
function tableHTML(cols, rows) { return '<div class="tblWrap"><table class="tbl"><tr>' + cols.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr>' + rows.slice(0, 50).map(function (r) { return '<tr>' + r.map(function (v) { return '<td>' + (v === null ? '<i class="muted">NULL</i>' : esc(v)) + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>' + (rows.length > 50 ? '<div class="tiny">…' + (rows.length - 50) + ' more rows</div>' : '') + '<div class="tiny">' + rows.length + ' row' + (rows.length === 1 ? '' : 's') + '</div></div>'; }
function after() {
  var ch = P.ch, ok = P.res && P.res.every(Boolean), noErr = !P.errLine;
  if (ch.explore && P.res) { var key = P.typed ? 'T:' + P.text : JSON.stringify(P.vals); var e = G.chExplore(ch, key); if (e) { X().toast('🧪 New experiment! +' + e.xp + ' XP (' + e.n + ')'); X().header(); } drawGoals(); }
  if (P.drill) { if (goalsDone()) { X().SFX.good(); drillEnd(true); } else { X().SFX.bad(); drillMiss(); } return; }
  if (goalsDone()) { X().SFX.good(); if (!P.rewarded) win(); else X().toast('✅ Still works!'); }
  else { if (P.res && P.res.some(Boolean)) X().SFX.combo(P.res.filter(Boolean).length); else X().SFX.bad(); if (bossOut()) setTimeout(bossLost, 600); }
}
function bossLost() {
  if (!P) return;
  var d = $('#cpDone'); d.innerHTML = '<div class="discCard"><div class="bigic">💀</div><h2>Out of runs</h2><div class="muted">The boss wins this round. Your code is still here. Study the goals, then try again with a fresh set of ' + P.ch.runs + ' runs.</div><button class="btn big" data-act="chbossretry">Try again</button><button class="btn ghost" data-act="chquit" style="margin-top:8px">Leave</button></div>'; d.classList.remove('hidden');
}
function win() {
  if (!P) return;
  var ch = P.ch; P.rewarded = true;
  var info = { vals: P.vals, code: code(), hintLv: P.hintLv, typed: P.typed };
  var bs0 = ch.bot ? G.botStats() : null;
  var r = G.chRecord(ch, info), st = G.chState(ch.id);
  if (ch.sb === 'ai') st.sel = Object.keys(P.sel).filter(function (k) { return P.sel[k]; });
  if (ch.sb === 'git') { st.hist = P.git.history.slice(); var gr = P.git.gh.repos; for (var k in gr) if (gr[k].pages) { st.site = gr[k].pages; } }
  delete st.draft; G.save();
  P.won = true; drawFoot();
  X().confetti(r.first ? 140 : 40); X().SFX.done(); X().header();
  var L = ch.learn || {}, h = '<div class="discCard"><div class="tiny" style="color:var(--gold)">✨ WHAT YOU DISCOVERED</div><h2>' + esc(L.h || ch.title) + '</h2><div class="discTxt">' + md(L.x) + '</div>';
  if (r.newTerms.length) h += '<div class="terms">' + r.newTerms.map(function (t) { return '<span class="chip">📖 ' + esc(window.DD.glossary[t][0]) + '</span>'; }).join('') + '</div>';
  h += '<div class="stats3"><div class="stat"><small>XP</small><b style="color:var(--good)">+' + r.xp + '</b></div><div class="stat"><small>Insight</small><b style="color:#a78bfa">+' + r.insight + '</b></div><div class="stat"><small>' + (r.first ? 'Build combo' : 'Replay') + '</small><b>' + (r.first ? '🔥' + r.combo : '20%') + '</b></div></div>';
  if (r.firstRun) h += '<div class="tiny" style="text-align:center">🎯 First-run bonus!</div>';
  if (P.hintLv >= 3 && r.first) h += '<div class="tiny" style="text-align:center">🗝️ Solution shown: reduced XP, no relic roll.</div>';
  r.drops.forEach(function (dr) { h += '<div class="card" style="border-color:var(--gold);text-align:center"><div style="font-size:40px">' + dr.ic + '</div><b>RELIC: ' + esc(dr.name) + '</b><div class="muted">' + esc(dr.eff) + '</div></div>'; });
  if (ch.proj) { var pg = G.projProgress(ch.proj[0]); h += '<div class="card"><b>' + PRJ[ch.proj[0]].icon + ' ' + esc(PRJ[ch.proj[0]].name) + '</b> · step ' + pg.done + '/' + pg.n + (pg.done === pg.n ? ' <b style="color:var(--good)">COMPLETE!</b>' : '') + '<div class="tiny">See it any time in 🏗️ Workshop.</div></div>'; }
  if (ch.bot && r.first) { var bs1 = G.botStats(), pc = function (x) { return Math.round(x * 100) + '%'; }; h += '<div class="card botDelta"><b>🤖 Module installed: ' + esc(ch.title) + '</b><div class="tiny">' + esc(ch.bot.eff) + '</div><div class="stats3"><div class="stat"><small>Success</small><b>' + pc(bs0.success) + ' → ' + pc(bs1.success) + '</b></div><div class="stat"><small>Tasks/hr</small><b>' + bs0.tph + ' → ' + bs1.tph + '</b></div><div class="stat"><small>🪙/hr</small><b>' + bs0.coinsPerHr + ' → ' + bs1.coinsPerHr + '</b></div></div><div class="tiny">See it run in 🤖 Your Bot.</div></div>'; }
  if (ch.boss) h += '<div class="card"><b>⚔️ Boss challenge cleared!</b><div class="muted">Final step: the 🎯 mastery exam on the 🔨 Build home page.</div></div>';
  var nx = nextAfter(ch);
  h += '<div class="row" style="gap:8px;margin-top:12px"><button class="btn ghost grow" data-act="chkeep">🔬 Keep tinkering</button>' + (nx ? '<button class="btn grow" data-act="chnext" data-v="' + nx.id + '">Next ▶</button>' : '<button class="btn grow" data-act="chquit">Done</button>') + '</div>' + (nx ? '<div class="tiny" style="text-align:center;margin-top:6px">Next: ' + (nx.icon || '') + ' ' + esc(nx.title) + '</div>' : '') + '</div>';
  var d = $('#cpDone'); d.innerHTML = h; d.classList.remove('hidden'); d.scrollTop = 0;
}
// ---------------- drills (mastery) ----------------
function drillMiss() {
  if (!P || !P.drill || P.drill.done) return; var first = !P.drill.missed; P.drill.missed = true;
  var h = '<div class="cpHintBox drMiss"><b>❌ Not yet.</b> ' + md(P.ch.explain || '').replace(/^<p>|<\/p>$/g, '') + '</div>' + '<div class="cpHintBox sol">🗝️ ' + drillSol() + '</div>';
  $('#cpHint').innerHTML = h;
  if (first) drawFoot();
  var hb = $('#cpHint'); if (hb && hb.scrollIntoView) hb.scrollIntoView({ block: 'nearest' });
}
function drillEnd(ok) {
  if (!P || !P.drill || P.drill.done) return;
  var d = P.drill; d.done = true; var ms = Date.now() - d.t0;
  var unaided = ok && !d.missed && !(P.ch.sb === 'git' && P.runs > P.ch.sol.length + 2);
  var out = d.o.onResult ? d.o.onResult({ ok: ok, unaided: unaided, ms: ms }) : {};
  drawFoot();
  var h = '<div class="discCard drDone"><div class="bigic">' + (unaided ? (out.speed > 1 ? '⚡' : '✅') : ok ? '🔧' : '📘') + '</div><h2>' + (unaided ? 'Nailed it' : ok ? 'Fixed (counts as practice, not mastery)' : 'Study this one') + '</h2>' +
    (ok ? '' : '<div class="discTxt">' + md(P.ch.explain || '') + '</div>') +
    '<div class="stats3"><div class="stat"><small>XP</small><b style="color:var(--good)">+' + (out.xp || 0) + '</b></div><div class="stat"><small>Time</small><b>' + Math.round(ms / 1000) + 's' + (out.speed > 1 ? ' ⚡' : '') + '</b></div><div class="stat"><small>Combo</small><b>🔥' + (d.o.comboNow ? d.o.comboNow() : 0) + '</b></div></div>' +
    (out.levelUp ? '<div class="card" style="border-color:var(--gold);text-align:center"><b>' + out.levelUp.ic + ' ' + esc(d.o.conceptName || '') + ' is now ' + out.levelUp.n + '!</b>' + (out.insight ? ' +' + out.insight + ' 💠' : '') + '</div>' : '') +
    (out.drops || []).map(function (dr) { return '<div class="card" style="border-color:var(--gold);text-align:center"><div style="font-size:36px">' + dr.ic + '</div><b>RELIC: ' + esc(dr.name) + '</b><div class="muted">' + esc(dr.eff) + '</div></div>'; }).join('') +
    '<button class="btn big" data-act="chdnext" style="margin-top:10px">' + (d.o.last ? 'Finish ▶' : 'Next drill ▶') + '</button></div>';
  var dd = $('#cpDone'); dd.innerHTML = h; dd.classList.remove('hidden'); dd.scrollTop = 0;
  if (unaided) X().confetti(out.speed > 1 ? 60 : 30);
}
setInterval(function () { if (!P || !P.drill || P.drill.done) return; var e = $('#drTimer'); if (e) e.textContent = Math.round((Date.now() - P.drill.t0) / 1000) + 's'; }, 500);

function nextAfter(ch) { var l = G.CH_TRACK[ch.t] || [], i = l.indexOf(ch); for (var k = i + 1; k < l.length; k++) if (G.chOpen(l[k]) && !G.chSolved(l[k].id)) return l[k]; return G.chNext(); }

// ---------------- stepper (debugger) ----------------
function jumpBp(from, initial) { // go to first step at/after `from` that hits a breakpoint; else stay at 0
  var bps = Object.keys(P.bp).map(Number);
  if (!bps.length) { P.step = initial ? 0 : Math.min(P.steps.length - 1, from); return; }
  for (var i = from; i < P.steps.length; i++) if (P.bp[P.steps[i].l]) { P.step = i; return; }
  P.step = P.steps.length - 1;
}
function drawStepper() {
  var box = $('#cpStep'); if (!box) return;
  if (!P.ch.trace || !P.steps || !P.steps.length) { box.innerHTML = P.ch.trace ? '<div class="tiny cpTip">🐞 Run the code to record every step, then step through it like a debugger.</div>' : ''; return; }
  var s = P.steps[P.step], n = P.steps.length;
  box.innerHTML = '<div class="stepper"><div class="row"><b class="grow">🐞 Step ' + (P.step + 1) + '/' + n + ' · line ' + s.l + '</b><button class="btn sm ghost" data-act="chstepto" data-v="-1">◀</button><button class="btn sm ghost" data-act="chstepto" data-v="1">▶</button><button class="btn sm ghost" data-act="chstepto" data-v="bp" title="Continue to next breakpoint">⏭</button></div>' +
    '<input type="range" id="stIn" min="0" max="' + (n - 1) + '" value="' + P.step + '">' +
    '<table class="vars">' + P.ch.trace.map(function (v, i) { var prev = P.step > 0 ? P.steps[P.step - 1].v[i] : null, cur = s.v[i]; return '<tr class="' + (prev !== null && prev !== cur ? 'chg' : '') + '"><td><code>' + esc(v) + '</code></td><td><code>' + esc(cur) + '</code></td></tr>'; }).join('') + '</table>' + (n >= 600 ? '<div class="tiny">Recording stopped at 600 steps.</div>' : '') + '</div>';
  var sl = $('#stIn'); sl.addEventListener('input', function () { P.step = +sl.value; drawCode(); drawStepper(); });
}

// ---------------- python turtle ----------------
function drawTurtle(segs) {
  var cv = $('#cpTurtle'); if (!segs.length && !P.ch.turtle) { cv.classList.add('hidden'); return; }
  cv.classList.remove('hidden'); var cx = cv.getContext('2d'); cx.fillStyle = '#0b1020'; cx.fillRect(0, 0, cv.width, cv.height);
  var xs = [0], ys = [0]; segs.forEach(function (s) { xs.push(s[0], s[2]); ys.push(s[1], s[3]); });
  var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs), minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
  var sc = Math.min((cv.width - 40) / Math.max(1, maxX - minX), (cv.height - 40) / Math.max(1, maxY - minY), 1.5);
  var ox = cv.width / 2 - (minX + maxX) / 2 * sc, oy = cv.height / 2 + (minY + maxY) / 2 * sc;
  cx.lineCap = 'round';
  segs.forEach(function (s) { cx.strokeStyle = s[4]; cx.lineWidth = s[5]; cx.beginPath(); cx.moveTo(ox + s[0] * sc, oy - s[1] * sc); cx.lineTo(ox + s[2] * sc, oy - s[3] * sc); cx.stroke(); });
  cx.fillStyle = '#fbbf24'; cx.beginPath(); cx.arc(ox, oy, 4, 0, 7); cx.fill();
  cx.fillStyle = '#94a3b8'; cx.font = '11px sans-serif'; cx.fillText('🐢 start (0, 0)', 6, cv.height - 8);
}

// ---------------- compiled languages ----------------
function drawCmpIdle() { var L = LANG[P.ch.lang || 'cpp']; setOut('<div class="pipe"><span class="st">📄 ' + L.file + '</span>➜<span class="st">🛠️ ' + L.tool + '</span>➜<span class="st">▶ ' + L.run + '</span></div><div class="tiny">Outputs come from the real ' + L.tool + ', recorded for every combination of choices.</div>'); drawCompare(); }
function drawCmp(r) {
  var L = LANG[P.ch.lang || 'cpp'];
  if (!r) { setOut('<div class="pipe"><span class="st on">📄 ' + L.file + '</span>➜<span class="st busy">🛠️ ' + L.tool + '…</span>➜<span class="st">▶ ' + L.run + '</span></div>'); return; }
  if (r.compiled === undefined) { setOut('<div class="cpErr">' + esc(r.err) + '</div>'); return; }
  var c = r.compiled, ph = c.phase; // 'compile' | 'run' | 'ok'
  var h = '<div class="pipe"><span class="st on">📄 ' + L.file + '</span>➜<span class="st ' + (ph === 'compile' ? 'bad' : 'good') + '">🛠️ ' + L.tool + (ph === 'compile' ? ' ✗' : ' ✓') + '</span>➜<span class="st ' + (ph === 'compile' ? '' : ph === 'run' ? 'bad' : 'good') + '">▶ ' + L.run + (ph === 'run' ? ' ✗' : ph === 'ok' ? ' ✓' : '') + '</span></div>';
  if (ph === 'compile') h += '<div class="tiny">The compiler refused to build a program. Nothing ran.</div>';
  if (c.err) h += '<pre class="cpErrPre">' + esc(c.err) + '</pre>';
  if (ph !== 'compile') h += '<div class="tiny">Program output' + (c.code ? ' (exit code ' + c.code + ')' : '') + ':</div><pre class="cpOutPre">' + (c.out ? esc(c.out) : '<i class="muted">(no output)</i>') + '</pre>';
  setOut(h);
  var allOk = r.res.every(Boolean);
  if (P.ch.mem && allOk) drawMem(); else $('#cpExtra').innerHTML = '';
  drawCompare();
}
function drawCompare() {
  var ch = P.ch; if (!ch.compare) return;
  var cur = P.cmpTab || 0, cmp = ch.compare[cur], rec = (window.COMPILED || {})[ch.id + '#' + cur] || {};
  var h = '<div class="compare"><div class="tiny">🗺️ THE SAME IDEA IN OTHER LANGUAGES</div><div class="row" style="gap:4px;flex-wrap:wrap;margin:6px 0">' + ch.compare.map(function (c, i) { return '<button class="pill ' + (i === cur ? 'on' : '') + '" data-act="chcmp" data-v="' + i + '">' + esc(c.label || c.lang) + '</button>'; }).join('') + '</div>' +
    '<pre class="code">' + X().hl(cmp.code) + '</pre>' + (rec.out !== undefined || rec.err ? '<div class="tiny">Real output (' + esc((LANG[cmp.lang] || {}).tool || cmp.lang) + '):</div><pre class="' + (rec.ok ? 'cpOutPre' : 'cpErrPre') + '">' + esc(rec.ok ? rec.out : (rec.err || rec.out)) + '</pre>' : '') + (cmp.note ? '<div class="muted" style="margin-top:4px">' + md(cmp.note) + '</div>' : '') + '</div>';
  var ex = $('#cpExtra'), old = ex.querySelector('.compare'); if (old) old.outerHTML = h; else ex.insertAdjacentHTML('beforeend', h);
}
function drawMem() {
  var ch = P.ch, steps = ch.mem, k = Math.min(P.memStep || 0, steps.length - 1), s = steps[k];
  var box = function (v, area) { return '<div class="mbox2 ' + area + '" data-addr="' + esc(v[3]) + '"><div class="mname"><code>' + esc(v[1]) + ' ' + esc(v[0]) + '</code></div><div class="mval">' + esc(v[2]) + '</div><div class="maddr">' + esc(v[3]) + '</div></div>'; };
  var h = '<div class="memviz"><div class="row"><b class="grow">🧠 Memory, step ' + (k + 1) + '/' + steps.length + '</b><button class="btn sm ghost" data-act="chmem" data-v="-1">◀</button><button class="btn sm ghost" data-act="chmem" data-v="1">▶</button></div><div class="tiny">Line ' + s.l + ': ' + esc(s.note) + '</div>' +
    '<div class="memcols" id="memcols"><div class="memcol"><div class="tiny">STACK</div>' + (s.stack || []).map(function (v) { return box(v, 'stack'); }).join('') + '</div><div class="memcol"><div class="tiny">HEAP</div>' + ((s.heap || []).map(function (v) { return box(v, 'heap'); }).join('') || '<div class="tiny muted">(empty)</div>') + '</div><svg class="memsvg" id="memsvg"></svg></div>' +
    '<div class="tiny">Addresses are illustrative; real ones change every run. Arrows are pointers.</div></div>';
  var ex0 = $('#cpExtra'), oldm = ex0.querySelector('.memviz'); if (oldm) oldm.outerHTML = h; else ex0.insertAdjacentHTML('afterbegin', h);
  setTimeout(function () { // arrows: a box whose value starts with 0x points at the box with that address
    var wrap = $('#memcols'), svg = $('#memsvg'); if (!wrap) return; var R = wrap.getBoundingClientRect(), paths = '';
    wrap.querySelectorAll('.mbox2').forEach(function (b) { var val = b.querySelector('.mval').textContent.trim(); if (!/^0x/.test(val)) return; var t = wrap.querySelector('.mbox2[data-addr="' + val + '"]'); if (!t || t === b) return; var a = b.getBoundingClientRect(), c = t.getBoundingClientRect(); var x1 = a.right - R.left - 4, y1 = a.top - R.top + a.height / 2, x2 = (c.left > a.left ? c.left : c.right) - R.left + (c.left > a.left ? 0 : 0), y2 = c.top - R.top + c.height / 2; var mx = Math.max(x1, x2) + 30; paths += '<path d="M' + x1 + ' ' + y1 + ' C' + mx + ' ' + y1 + ',' + mx + ' ' + y2 + ',' + (c.left > a.left ? x2 : c.right - R.left) + ' ' + y2 + '" fill="none" stroke="#fbbf24" stroke-width="2" marker-end="url(#ah)"/>'; });
    svg.setAttribute('width', R.width); svg.setAttribute('height', R.height);
    svg.innerHTML = '<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#fbbf24"/></marker></defs>' + paths;
  }, 30);
}

// ---------------- git terminal ----------------
function prompt() { var g = P.git, cwd = g.cwd.replace(g.home, '~'), repo = g.repoFor(), br = repo ? (repo.head.ref || 'detached') : null; return 'noah@dd:' + cwd + (br ? ' (' + br + (repo.merging ? '|MERGING' : '') + ')' : '') + '$'; }
function drawGit() {
  var ch = P.ch, g = P.git;
  var term = P.term.map(function (t) { return t.c !== undefined ? '<div class="tc"><span class="tp">' + esc(t.p) + '</span> ' + esc(t.c) + '</div>' + (t.o ? '<div class="to' + (t.e ? ' te' : '') + '">' + esc(t.o) + '</div>' : '') : '<div class="to sys">' + esc(t.o) + '</div>'; }).join('');
  var chips = (ch.git.chips || []).map(function (c, i) { var nxt = P.hintLv >= 3 && ch.sol[g.history.length] === c; return '<button class="cchip' + (nxt ? ' next' : '') + '" data-act="chchip" data-v="' + i + '">' + esc(c) + '</button>'; }).join('');
  var h = '<div class="term" id="term">' + term + '<div class="tc"><span class="tp">' + esc(prompt()) + '</span> <span class="caret">▌</span></div></div>' +
    '<div class="cmdRow"><input id="cpCmd" class="cmdIn" placeholder="type a command or tap a chip" autocapitalize="off" autocorrect="off" spellcheck="false" value="' + esc(P.cmd) + '"><button class="btn sm" data-act="chcmd">⏎</button></div>' +
    '<div class="cchips">' + chips + '</div>' +
    '<div class="row" style="gap:4px;margin-top:10px">' + ['graph', 'files', 'github'].map(function (t) { return '<button class="pill ' + (P.tab === t ? 'on' : '') + '" data-act="chgtab" data-v="' + t + '">' + { graph: '🌳 Commit graph', files: '📁 Files', github: '🐙 GitHub' }[t] + '</button>'; }).join('') + '</div><div id="gitPane" class="gitPane">' + gitPane() + '</div>';
  setOut(h);
  var t = $('#term'); t.scrollTop = t.scrollHeight;
  var inp = $('#cpCmd'); inp.addEventListener('input', function () { P.cmd = inp.value; }); inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); gitRun(); } });
}
function gitPane() {
  var g = P.git;
  if (P.tab === 'graph') { var gr = g.graph(); return gr ? graphSVG(gr) : '<div class="muted">No repository here yet. (A repository starts with <code>git init</code>.)</div>'; }
  if (P.tab === 'files') {
    var repo = g.repoFor(), root = repo ? repo.root : g.cwd, h = '<div class="tiny">' + esc(root.replace(g.home, '~')) + '/</div>';
    var files = Object.keys(g.fs).filter(function (k) { return k.indexOf(root + '/') === 0 && !g.fs[k].d && k.indexOf('/.git/') < 0; }).sort();
    if (!files.length) return h + '<div class="muted">(no files)</div>';
    var ht = repo ? g.headTree(repo) : {};
    return h + files.map(function (f) { var r = f.slice(root.length + 1), stc = !repo ? '' : !(r in repo.index) ? (g.ignored(repo, r) ? 'ignored' : 'untracked') : repo.index[r] !== ht[r] ? 'staged' : g.fs[f].c !== repo.index[r] ? 'modified' : 'clean'; return '<details class="file"><summary><code>' + esc(r) + '</code> <span class="fst ' + stc + '">' + stc + '</span></summary><pre class="code">' + esc(g.fs[f].c || '(empty)') + '</pre></details>'; }).join('');
  }
  var repos = Object.keys(g.gh.repos); if (!repos.length) return '<div class="muted">No GitHub repositories yet.</div>';
  return repos.map(function (n) { var r = g.gh.repos[n]; return '<div class="card ghcard"><b>🐙 noah/' + esc(n) + '</b>' + '<div class="tiny">Branches: ' + (Object.keys(r.branches).map(function (b) { return '<code>' + esc(b) + '</code> ' + esc((r.branches[b] || '').slice(0, 7)); }).join(' · ') || '(empty)') + '</div>' +
    (r.prs.length ? '<div class="tiny">PRs: ' + r.prs.map(function (p) { return '#' + p.n + ' ' + esc(p.title) + ' <b>' + p.state + '</b>'; }).join(' · ') + '</div>' : '') +
    (r.runs.length ? '<div class="tiny">Actions: ' + r.runs.slice(-3).map(function (x) { return '#' + x.id + ' ' + (x.ok ? '✅' : '❌') + ' ' + esc(x.br); }).join(' · ') + '</div>' : '') +
    (r.pages ? '<div class="tiny">🚀 Live at <b>' + esc(r.pages.url) + '</b></div><button class="btn sm" data-act="chsite" data-v="' + esc(n) + '">Open the deployed site</button>' : '') + '</div>'; }).join('');
}
function graphSVG(gr) {
  var cs = gr.commits; if (!cs.length) return '<div class="muted">No commits yet. Your first <code>git commit</code> will appear here.</div>';
  var W = 340, rowH = 34, colW = 22, x0 = 16, y0 = 18, pos = {}, colors = ['#22d3ee', '#f472b6', '#a78bfa', '#4ade80', '#fbbf24', '#fb923c'];
  var rows = cs.slice().reverse(); rows.forEach(function (c, i) { pos[c.id] = { x: x0 + c.lane * colW, y: y0 + i * rowH, c: c }; });
  var H = y0 + rows.length * rowH, lines = '', dots = '', labels = '';
  rows.forEach(function (c) { c.parents.forEach(function (p) { if (!pos[p]) return; var a = pos[c.id], b = pos[p], col = colors[Math.max(a.c.lane, b.c.lane) % colors.length]; lines += a.x === b.x ? '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" stroke="' + col + '" stroke-width="2.5"/>' : '<path d="M' + a.x + ' ' + a.y + ' C' + a.x + ' ' + (a.y + rowH * 0.8) + ',' + b.x + ' ' + (b.y - rowH * 0.8) + ',' + b.x + ' ' + b.y + '" fill="none" stroke="' + col + '" stroke-width="2.5"/>'; }); });
  var maxLane = 0; rows.forEach(function (c) { maxLane = Math.max(maxLane, c.lane); });
  var tx = x0 + (maxLane + 1) * colW + 6;
  rows.forEach(function (c) { var p = pos[c.id], col = colors[c.lane % colors.length], isHead = c.id === gr.head; dots += '<circle cx="' + p.x + '" cy="' + p.y + '" r="' + (isHead ? 7 : 5.5) + '" fill="' + (c.parents.length > 1 ? '#0b1020' : col) + '" stroke="' + col + '" stroke-width="2.5"/>';
    var tags = (gr.heads[c.id] || []).map(function (b) { return '<tspan fill="' + (b === gr.headRef ? '#fbbf24' : '#4ade80') + '" font-weight="700">' + (b === gr.headRef ? 'HEAD → ' : '') + esc(b) + '</tspan>'; }).concat((gr.remote[c.id] || []).map(function (b) { return '<tspan fill="#f87171">' + esc(b) + '</tspan>'; }));
    if (isHead && !gr.headRef) tags.unshift('<tspan fill="#fbbf24" font-weight="700">HEAD (detached)</tspan>');
    labels += '<text x="' + tx + '" y="' + (p.y - 3) + '" font-size="11" fill="#cbd5e1" font-family="JetBrains Mono,monospace">' + esc(c.id.slice(0, 7)) + ' ' + esc(c.msg.length > 30 ? c.msg.slice(0, 29) + '…' : c.msg) + '</text>' + (tags.length ? '<text x="' + tx + '" y="' + (p.y + 11) + '" font-size="10" font-family="Inter,sans-serif">' + tags.join('<tspan fill="#64748b">, </tspan>') + '</text>' : ''); });
  return '<svg class="gitsvg" viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="' + H + '">' + lines + dots + labels + '</svg>' + (gr.merging ? '<div class="cpErr">⚠️ Merge in progress: fix the conflicted files, <code>git add</code> them, then <code>git commit</code>.</div>' : '');
}
function gitRun() {
  var ch = P.ch, g = P.git, line = (P.cmd || '').trim(); if (!line) return;
  if (ch.boss && P.runs >= ch.runs) return bossLost();
  if (!P.runs) G.chRun(ch); P.runs++;
  var pr = prompt(), out, err = false;
  try { out = g.run(line); } catch (e) { out = String(e.message || e); err = true; }
  if (out === '\u001bclear') { P.term = []; out = ''; }
  else { if (/^(fatal|error|bash|git: |usage|X |! \[rejected\]|CONFLICT|Automatic merge failed)/m.test(out) || /not a git repository/.test(out)) err = true; P.term.push({ p: pr, c: line, o: out, e: err }); }
  g.lastOut = out; P.cmd = '';
  P.res = SB.checkGit(ch, g); drawGoals(); if (ch.boss) drawStory();
  X().SFX[err ? 'bad' : 'tap']();
  drawGit();
  if (P.drill) { if (err) P.drill.errs++; if (goalsDone()) { X().SFX.good(); var me1 = P; setTimeout(function () { if (P === me1) drillEnd(true); }, 300); } else if (P.drill.errs >= 3 && !P.drill.missed) drillMiss(); return; }
  if (goalsDone() && !P.rewarded) { X().SFX.good(); setTimeout(win, 350); }
  else if (bossOut()) setTimeout(bossLost, 600);
}

// ---------------- AI assistant simulator ----------------
function drawAI() {
  var ch = P.ch, ai = ch.ai;
  var cats = {}; ai.parts.forEach(function (p) { (cats[p.cat] = cats[p.cat] || []).push(p); });
  var h = '<div class="aiBuild"><div class="tiny">🧩 BUILD YOUR PROMPT · tap parts to include them</div><div class="aiTask">🎯 ' + esc(ai.task) + '</div>' +
    Object.keys(cats).map(function (c) { return '<div class="tiny aiCat">' + esc(c) + '</div>' + cats[c].map(function (p) { return '<button class="aiPart ' + (P.sel[p.id] ? 'on' : '') + '" data-act="chpart" data-v="' + p.id + '">' + (P.sel[p.id] ? '☑️ ' : '⬜ ') + esc(p.txt) + '</button>'; }).join(''); }).join('') + '</div>';
  $('#cpCode').innerHTML = h;
  drawChat();
}
function promptText() { var ch = P.ch; return [ch.ai.task].concat(ch.ai.parts.filter(function (p) { return P.sel[p.id]; }).map(function (p) { return p.txt; })).join('\n• '); }
function drawChat() {
  var h = P.chat.length ? '' : '<div class="muted">Build a prompt below, then send it. The assistant answers, and its code is tested against the goals. The AI is simulated, but the code it writes really runs.</div>';
  P.chat.forEach(function (m, i) {
    if (m.who === 'you') h += '<div class="bub you"><div class="tiny">YOU</div>' + esc(m.txt).replace(/\n/g, '<br>') + '</div>';
    else {
      h += '<div class="bub ai"><div class="tiny">🤖 ASSISTANT</div>' + md(m.say) + (m.files ? '<div class="tiny">Files touched: ' + m.files.map(function (f) { return '<code>' + esc(f) + '</code>'; }).join(' ') + '</div>' : '') + '<pre class="code aiCode">' + m.code.split('\n').map(function (l, k) { return '<span class="aiLine' + (m.flag === k ? (m.flagOk ? ' flagOk' : ' flagNo') : '') + '" data-act="chflag" data-v="' + i + ':' + k + '">' + X().hl(l) + '</span>'; }).join('\n') + '</pre>';
      if (m.tests) h += '<div class="aiTests">' + m.tests + '</div>';
      if (m.bad !== undefined && m.flag === undefined && i === P.chat.length - 1) h += '<div class="tiny">🔎 Optional: tap the line you think is wrong for bonus XP.</div>';
      h += '</div>';
    }
  });
  setOut(h); var o = $('#cpOut'); o.scrollTop = o.scrollHeight;
}
function pickVariant() { var ch = P.ch, has = function (k) { return !!P.sel[k]; }; for (var i = 0; i < ch.ai.variants.length; i++) { var v = ch.ai.variants[i]; try { if (new Function('has', 'return (' + (v.when || 'true') + ')')(has)) return v; } catch (e) { } } return ch.ai.variants[ch.ai.variants.length - 1]; }
function aiSend(done) {
  var ch = P.ch, v = pickVariant(), me = P;
  P.chat.push({ who: 'you', txt: promptText() });
  var msg = { who: 'ai', say: '', code: '', files: v.files, bad: v.bad };
  P.chat.push(msg); drawChat();
  var full = v.say, i = 0;
  var typer = setInterval(function () { if (P !== me) { clearInterval(typer); return; } i += 6; msg.say = full.slice(0, i); if (i >= full.length) { clearInterval(typer); msg.say = full; msg.code = v.code; drawChat(); test(); } else drawChat(); }, 16);
  function test() {
    var sim = Object.assign({}, ch, { sb: 'js' });
    SB.runFrame(sim, v.code, $('#cpHidden'), {}).then(function (r) {
      if (P !== me) return;
      msg.tests = '<div class="tiny">🧪 TESTS</div>' + ch.goals.map(function (g, k) { return '<div class="goal ' + (r.res[k] ? 'ok' : 'no') + '">' + (r.res[k] ? '✅ ' : '❌ ') + md(g[0]).replace(/^<p>|<\/p>$/g, '') + '</div>'; }).join('') + (r.errs.length ? '<div class="cpErr">' + esc(r.errs[0].msg) + '</div>' : '') + (r.logs.length ? '<pre class="cpOutPre">' + esc(r.logs.slice(0, 8).join('\n')) + '</pre>' : '');
      drawChat(); done(r.res);
    });
  }
}

// ---------------- hints ----------------
function hintSheet() {
  var ch = P.ch, L = P.hintLv, h = '<div class="sheetIn"><div class="row"><b class="grow">💡 Hints</b><button class="btn sm ghost" data-act="chsheetx">Close</button></div><div class="muted">Discovering it yourself is worth the most XP.</div>';
  var opts = [[1, '💡 Nudge', 'Free'], [2, '🔦 Bigger hint', '−25% XP'], [3, '🗝️ Show the solution', '−60% XP, no relic']];
  opts.forEach(function (o) { if ((o[0] === 1 && !ch.hints[0]) || (o[0] === 2 && !ch.hints[1])) return; h += '<button class="opt' + (L >= o[0] ? ' on' : '') + '" data-act="chhintlv" data-v="' + o[0] + '" ' + (L >= o[0] ? 'disabled' : '') + '><b>' + o[1] + '</b> <span class="tiny">' + (L >= o[0] ? 'used' : (P.won ? 'free (already solved)' : o[2])) + '</span></button>'; });
  var sh = $('#cpSheet'); sh.innerHTML = h + '</div>'; sh.classList.remove('hidden');
}
function useHint(l) {
  var ch = P.ch; if (l > P.hintLv + 1 && !(l === 3 && !ch.hints[1] && P.hintLv >= 1)) { l = P.hintLv + 1; }
  P.hintLv = Math.max(P.hintLv, l); if (!P.won) G.chHint(ch, P.hintLv);
  if (P.hintLv >= 3) {
    if (ch.sb === 'ai') { P.sel = {}; ch.sol.forEach(function (k) { P.sel[k] = 1; }); drawAI(); }
    else if (ch.sb === 'git') drawGit();
    else { P.typed = false; P.vals = CHD.solVals(ch); drawCode(); if (ch.sb === 'html') livePreview(); }
  }
  $('#cpSheet').classList.add('hidden'); drawHint(); var hb = $('#cpHint'); if (hb) hb.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ---------------- actions ----------------
function act(a, v, el) {
  if (!P && a !== 'chopen' && a !== 'chview' && a !== 'chviewx' && a !== 'chproj') return;
  if (a === 'chopen') return open(v);
  if (a === 'chquit') return close();
  if (a === 'chdgive') { if (P.drill && !P.drill.done) { if (!P.drill.missed) drillMiss(); else drillEnd(false); } return; }
  if (a === 'chdskip') return drillEnd(false);
  if (a === 'chdnext') { var o = P.drill && P.drill.o; if (o && o.onNext) return o.onNext(); return close(); }
  if (a === 'chrun') return run();
  if (a === 'chslot') { X().SFX.tap(); return openSlot(v); }
  if (a === 'chsheetx') { $('#cpSheet').classList.add('hidden'); return; }
  if (a === 'chpick') { var p = v.split(':'), s = P.ch.slots[p[0]]; setVal(p[0], s.o[+p[1]]); X().SFX.select(); $('#cpSheet').classList.add('hidden'); return; }
  if (a === 'chstep') { var q = v.split(':'), sl = P.ch.slots[q[0]], nv = Math.max(sl.n[0], Math.min(sl.n[1], +(P.vals[q[0]]) + (+q[1]) * (sl.n[2] || 1))); nv = Math.round(nv * 1000) / 1000; setVal(q[0], nv); $('#slVal').textContent = nv + (sl.u || ''); $('#slIn').value = nv; return; }
  if (a === 'chtype') { if (!P.typed) { P.text = code(); P.typed = true; } else { if (P.text !== SB.fill(P.ch, P.vals) && !confirm('Go back to blocks? Your typed edits will be replaced by the block version.')) return; P.typed = false; } drawCode(); return; }
  if (a === 'chhint') return hintSheet();
  if (a === 'chhintlv') return useHint(+v);
  if (a === 'chbp') { P.bp[+v] = !P.bp[+v]; if (!P.bp[+v]) delete P.bp[+v]; drawCode(); return; }
  if (a === 'chstepto') { if (!P.steps) return; if (v === 'bp') jumpBp(P.step + 1); else P.step = Math.max(0, Math.min(P.steps.length - 1, P.step + (+v))); drawCode(); drawStepper(); return; }
  if (a === 'chmem') { P.memStep = Math.max(0, Math.min(P.ch.mem.length - 1, (P.memStep || 0) + (+v))); drawMem(); return; }
  if (a === 'chcmp') { P.cmpTab = +v; drawCompare(); return; }
  if (a === 'chpeek') return peek();
  if (a === 'chchip') { P.cmd = P.ch.git.chips[+v]; var inp = $('#cpCmd'); if (inp) { inp.value = P.cmd; inp.classList.add('pulse'); setTimeout(function () { inp.classList.remove('pulse'); }, 400); } X().SFX.tap(); return; }
  if (a === 'chcmd') return gitRun();
  if (a === 'chgtab') { P.tab = v; drawGit(); return; }
  if (a === 'chsite') { var gr = P.git.gh.repos[v]; return siteModal(gr.pages); }
  if (a === 'chpart') { P.sel[v] = !P.sel[v]; X().SFX.tap(); drawAI(); return; }
  if (a === 'chflag') { var f = v.split(':'), m = P.chat[+f[0]]; if (!m || m.bad === undefined || m.flag !== undefined) return; m.flag = +f[1]; m.flagOk = m.flag === m.bad || (Array.isArray(m.bad) && m.bad.indexOf(m.flag) >= 0); if (m.flagOk) { var e = G.chExplore(P.ch, 'flag:' + P.chat.length); X().toast('🔎 Good eye! That is the bad line.' + (e ? ' +' + e.xp + ' XP' : '')); X().SFX.good(); } else { X().toast('Not that one. Look for something the code assumes exists.'); X().SFX.bad(); } drawChat(); return; }
  if (a === 'chkeep') { $('#cpDone').classList.add('hidden'); return; }
  if (a === 'chdone') return close();
  if (a === 'chnext') { var id = v; P = null; return open(id); }
  if (a === 'chbossretry') { P.runs = 0; P.res = null; $('#cpDone').classList.add('hidden'); if (P.ch.sb === 'git') { P.git = SB.newGit(P.ch); P.term = []; drawGit(); } drawStory(); drawGoals(); drawFoot(); return; }
  if (a === 'chview') return viewBuild(v);
  if (a === 'chviewx') { X().closeModal(); return; }
}
function peek() {
  var ch = P.ch; if (!ch.setup) return;
  var names = []; ch.setup.replace(/CREATE TABLE (\w+)/gi, function (_, n) { names.push(n); });
  SB.runSql({ setup: ch.setup, goals: [] }, names.map(function (n) { return 'SELECT * FROM ' + n + ';'; }).join('\n')).then(function (r) {
    setOut('<div class="tiny">👀 What is in the database (before your query runs):</div>' + r.results.map(function (t, i) { return '<div class="tiny" style="margin-top:6px"><b>' + esc(names[i]) + '</b></div>' + tableHTML(t.columns, t.values); }).join(''));
  });
}
function siteModal(pages) { X().modal('<div class="row"><b class="grow">🚀 ' + esc(pages.url) + '</b><button class="btn sm ghost" data-act="chviewx">✕</button></div><div class="tiny">Your deployed page (simulated GitHub Pages)</div><div id="siteMount" class="siteMount"></div>'); SB.preview({ sb: 'html' }, pages.html, $('#siteMount')); }

// ---------------- Build tab pages ----------------
function todayHTML() {
  var S = G.S, nx = G.chNext(), h = '', E = X();
  var T = Math.min(S.tier + 1, 5), ts = G.tierStatus(T), tier = window.DD.tiers[T - 1];
  h += '<div class="card trackHero" style="--tc:#7c5cff"><div class="row"><div class="bigIcon">🔨</div><div class="grow"><h2>Build something</h2><div class="muted">Every challenge is a small real program. Change it, run it, watch what happens, and discover the idea yourself. Daily goal: ' + G.DAILY_GOAL_XP + ' XP.</div></div></div>' +
    '<div class="bar" style="margin-top:10px"><i style="width:' + Math.min(100, S.daily.xp / G.DAILY_GOAL_XP * 100) + '%"></i><span>' + Math.min(S.daily.xp, G.DAILY_GOAL_XP) + ' / ' + G.DAILY_GOAL_XP + ' XP' + (S.daily.goal ? ' ✓' : '') + '</span></div>' +
    (nx ? '<button class="btn big" style="margin-top:12px" data-act="chopen" data-v="' + nx.id + '">▶ ' + (nx.icon || '') + ' ' + esc(nx.title) + '</button><div class="tiny" style="margin-top:6px;text-align:center">' + TRK[nx.t].icon + ' ' + esc(TRK[nx.t].name) + ' · ' + SBNAME[nx.sb] + ' · ' + window.DD.tiers[nx.tier - 1].name + (nx.proj ? ' · ' + PRJ[nx.proj[0]].icon + ' project' : '') + '</div>' : '<div class="muted" style="margin-top:10px">Every open challenge is solved. Beat the boss to open the next tier.</div>') + '</div>';
  var dueC = G.conceptsDue().length, openC = G.conceptsOpen().length;
  h += '<div class="card reviewCard"><div class="row"><div style="font-size:34px">🎯</div><div class="grow"><h3>Mastery slam</h3><div class="muted">' + (openC ? (dueC ? '<b style="color:var(--gold)">' + dueC + ' concept' + (dueC === 1 ? '' : 's') + ' due</b>. Tag-only drills with real tests. No hints.' : 'Nothing due. Slam anyway to push your weakest concepts.') : 'Solve a challenge to unlock its drills.') + '</div></div></div>' + (openC ? '<button class="btn gold big" style="margin-top:10px" data-act="msslam" data-v="6">⚡ Slam 6 drills</button>' : '') + '</div>';
  h += '<div class="sectionTitle">Daily deeds</div><div class="daily">' + G.DEEDS.map(function (d) { var ok = d.f(), cl = S.daily.claimed[d.id]; return '<div class="d ' + (cl ? 'done' : '') + '"><div style="font-size:20px">' + d.ic + '</div>' + d.txt + '<div style="margin-top:6px">' + (cl ? '✓ +' + d.r + ' 💠' : ok ? '<button class="btn sm green" data-act="deed" data-v="' + d.id + '">Claim ' + d.r + '💠</button>' : '<span class="tiny">+' + d.r + ' 💠</span>') + '</div></div>'; }).join('') + '</div>';
  if (S.tier < 5) {
    var bc = ts.bossCh, bcOpen = bc && G.chOpen(bc);
    h += '<div class="card bossCard" style="margin-top:12px"><div class="row"><div class="bossIc">' + tier.bossIcon + '</div><div class="grow"><div class="tiny">TIER ' + T + ' BOSS · ' + tier.icon + ' ' + tier.name.toUpperCase() + '</div><h3>' + tier.boss + '</h3><div class="muted">Two phases: <b>' + (bc ? esc(bc.title) : 'a build') + '</b> under pressure, then an 8-drill mastery exam (6 unaided to win). Winning promotes you to <b>' + G.RANKS[T].name + '</b>.</div></div></div>' +
      '<div class="req"><span>' + (ts.chSolved >= ts.chNeed ? '✅' : '⬜') + '</span> Solve ' + ts.chNeed + ' of ' + ts.chN + ' ' + tier.name + ' challenges (' + ts.chSolved + ')</div>' +
      '<div class="req"><span>' + (ts.mPr >= ts.mNeed ? '✅' : '⬜') + '</span> ' + ts.mNeed + ' of ' + ts.mN + ' ' + tier.name + ' concepts 🛠️ Practiced in 🎯 Mastery (' + ts.mPr + ')</div>' +
      '<div class="bar small" style="margin-top:6px"><i style="width:' + Math.min(100, (ts.chNeed ? Math.min(1, ts.chSolved / ts.chNeed) : 1) * 50 + (ts.mNeed ? Math.min(1, ts.mPr / ts.mNeed) : 1) * 50) + '%;background:linear-gradient(90deg,#ff3d7f,#fb923c)"></i></div>' +
      (ts.cooldown ? '<div class="tiny" style="margin-top:8px">Regrouping after a loss… exam opens again in ' + E.dur(ts.cooldown) + '</div>' : '') +
      (bc ? '<button class="btn red big" style="margin-top:10px" data-act="chopen" data-v="' + bc.id + '" ' + (bcOpen ? '' : 'disabled') + '>' + (G.chSolved(bc.id) ? '✅ Phase 1 cleared · replay' : '⚔️ Phase 1: ' + esc(bc.title)) + '</button>' : '') +
      '<button class="btn red big" style="margin-top:8px" data-act="msboss" data-v="' + T + '" ' + (ts.ready && ts.bossChDone && !ts.cooldown ? '' : 'disabled') + '>🎯 Phase 2: the mastery exam</button></div>';
  } else h += '<div class="card bossCard"><h3>🐉 Every boss defeated</h3><div class="muted">You are an AI-Native Lead. Finish every challenge and project, and keep reviewing.</div></div>';
  h += '<div class="sectionTitle">Build tracks · swipe ➜</div><div class="trackGrid">' + CHD.tracks.map(function (t, i) { var st = G.chTrackStats(t.id), un = G.chTrackUnlocked(t.id); return '<button class="tg" style="text-align:left;' + (un ? '' : 'opacity:.45') + '" data-act="sub" data-v="' + (i + 1) + '"><div class="row"><span style="font-size:22px">' + t.icon + '</span><div class="grow"><b style="font-size:13px">' + esc(t.name) + '</b><div class="tiny">' + (un ? st.solved + '/' + st.n + ' built' : '🔒 ' + lockTxt(t)) + '</div></div></div><div class="bar small"><i style="width:' + (st.n ? st.solved / st.n * 100 : 0) + '%;background:' + t.color + '"></i></div></button>'; }).join('') + '</div>';
  return h;
}
function lockTxt(t) { var first = (G.CH_TRACK[t.id] || [])[0]; if (first && first.tier > G.S.tier + 1) return 'Opens at ' + window.DD.tiers[first.tier - 1].name; var n = t.need - G.chSolvedCount(); return n > 0 ? 'Solve ' + n + ' more' : ''; }
function trackHTML(tid) {
  var t = TRK[tid], st = G.chTrackStats(tid), un = G.chTrackUnlocked(tid);
  var h = '<div class="card trackHero" style="--tc:' + t.color + '"><div class="row"><div class="bigIcon">' + t.icon + '</div><div class="grow"><h2>' + esc(t.name) + '</h2><div class="muted">' + esc(t.desc) + '</div></div></div><div class="bar" style="margin-top:10px"><i style="width:' + (st.n ? st.solved / st.n * 100 : 0) + '%;background:' + t.color + '"></i><span>' + st.solved + ' / ' + st.n + ' challenges</span></div>' + (un ? '' : '<div class="muted" style="margin-top:8px">🔒 ' + lockTxt(t) + '</div>') + '</div>';
  var lastTier = 0;
  (G.CH_TRACK[tid] || []).forEach(function (c) {
    if (c.tier !== lastTier) { lastTier = c.tier; var ti = window.DD.tiers[c.tier - 1]; h += '<div class="tierHead">' + ti.icon + ' ' + ti.name + (c.tier > G.S.tier + 1 ? ' · 🔒 beat ' + window.DD.tiers[c.tier - 2].boss : '') + '</div>'; }
    var open = G.chOpen(c), done = G.chSolved(c.id), s = G.chState(c.id);
    h += '<div class="unit ' + (open ? '' : 'locked ') + (done ? 'learned ' : '') + '"' + (open ? ' data-act="chopen" data-v="' + c.id + '"' : '') + '><div class="uic">' + (c.icon || '🔧') + '</div><div class="grow"><div style="font-weight:800">' + esc(c.title) + (done ? ' ✓' : '') + '</div><div class="tiny">' + SBNAME[c.sb] + (c.explore ? ' · 🧪 experiment' : '') + (c.proj ? ' · ' + PRJ[c.proj[0]].icon + ' ' + esc(PRJ[c.proj[0]].name) + ' ' + c.proj[1] : '') + (s && s.draft && !done ? ' · in progress' : '') + (!open ? ' · ' + esc(G.chWhyLocked(c)) : '') + '</div></div>' + (open ? '<span style="font-size:20px">' + (done ? '↻' : '▶') + '</span>' : '') + '</div>';
  });
  return h;
}
function workshopHTML() {
  var h = '<div class="card trackHero" style="--tc:#f59e0b"><div class="row"><div class="bigIcon">🏗️</div><div class="grow"><h2>Workshop</h2><div class="muted">Projects are built across several challenges. Every step adds to the same app, and finished builds stay here to open and run any time.</div></div></div></div>';
  CHD.projects.forEach(function (p) {
    var pg = G.projProgress(p.id), last = null; pg.steps.forEach(function (c) { if (G.chSolved(c.id)) last = c; });
    var nxt = pg.steps.filter(function (c) { return !G.chSolved(c.id); })[0];
    h += '<div class="card proj"><div class="row"><div style="font-size:34px">' + p.icon + '</div><div class="grow"><b>' + esc(p.name) + '</b>' + (pg.done === pg.n && pg.n ? ' <span class="chip" style="color:var(--good)">✓ complete</span>' : '') + '<div class="tiny">' + esc(p.desc) + '</div><div class="pips">' + pg.steps.map(function (c) { return '<i class="' + (G.chSolved(c.id) ? 'on' : '') + '" title="' + esc(c.title) + '"></i>'; }).join('') + '</div></div></div>' +
      '<div class="row" style="gap:8px;margin-top:8px">' + (last ? '<button class="btn sm grow" data-act="chview" data-v="' + last.id + '">👁 Open my build</button>' : '') + (nxt ? '<button class="btn sm ' + (last ? 'ghost ' : '') + 'grow" data-act="chopen" data-v="' + nxt.id + '" ' + (G.chOpen(nxt) ? '' : 'disabled') + '>' + (G.chOpen(nxt) ? '▶ Step ' + nxt.proj[1] + ': ' + esc(nxt.title) : '🔒 ' + esc(G.chWhyLocked(nxt))) + '</button>' : '') + '</div></div>';
  });
  var built = CHD.list.filter(function (c) { return G.chSolved(c.id) && !c.proj; });
  h += '<div class="sectionTitle">Everything you built (' + G.chSolvedCount() + ')</div>';
  if (!built.length) h += '<div class="muted" style="text-align:center">Solved challenges appear here.</div>';
  h += '<div class="gallery">' + built.map(function (c) { return '<button class="gal" data-act="chview" data-v="' + c.id + '"><span>' + (c.icon || '🔧') + '</span><b>' + esc(c.title) + '</b><small>' + SBNAME[c.sb] + '</small></button>'; }).join('') + '</div>';
  return h;
}
function viewBuild(id) { // replay a solved build live
  var ch = CHD.byId[id], st = G.chState(id); if (!ch || !st) return;
  var c = st.code || SB.fill(ch, st.vals || CHD.solVals(ch));
  var h = '<div class="row"><b class="grow">' + (ch.icon || '') + ' ' + esc(ch.title) + '</b><button class="btn sm ghost" data-act="chviewx">✕</button></div><div class="tiny">' + SBNAME[ch.sb] + ' · built ' + new Date(st.solved).toLocaleDateString() + '</div><div id="vbMount" class="siteMount"></div><details style="margin-top:8px"><summary class="tiny">Show the code</summary><pre class="code">' + X().hl(ch.sb === 'git' ? (st.hist || []).map(function (l) { return '$ ' + l; }).join('\n') : ch.sb === 'ai' ? '' : c) + '</pre></details><div class="row" style="gap:8px;margin-top:8px"><button class="btn sm grow" data-act="chopen" data-v="' + id + '">🔧 Open in the editor</button></div>';
  X().modal(h); var m = $('#vbMount');
  if (ch.sb === 'html' || ch.sb === 'js') SB.preview(ch, c, m);
  else if (ch.sb === 'py') { m.innerHTML = '<pre class="cpOutPre">⏳ Running in Python…</pre>'; SB.runPy(ch, c).then(function (r) { m.innerHTML = '<pre class="cpOutPre">' + esc((r.out || []).join('\n') + (r.err ? '\n' + r.err.msg : '')) + '</pre>'; }, function (e) { m.innerHTML = '<div class="cpErr">' + esc(e.message) + '</div>'; }); }
  else if (ch.sb === 'sql') SB.runSql(ch, c).then(function (r) { m.innerHTML = r.results.map(function (t) { return tableHTML(t.columns, t.values); }).join('') || '<div class="muted">(no rows)</div>'; }, function (e) { m.innerHTML = '<div class="cpErr">' + esc(e.message) + '</div>'; });
  else if (ch.sb === 'git') { if (st.site) SB.preview({ sb: 'html' }, st.site.html, m); else { var g = SB.newGit(ch); (st.hist || []).forEach(function (l) { try { g.run(l); } catch (e) { } }); var gr = g.graph(); m.innerHTML = gr ? graphSVG(gr) : ''; } }
  else if (ch.sb === 'cmp') { var r = SB.runCompiled(ch, st.vals || CHD.solVals(ch)); m.innerHTML = r.compiled ? '<pre class="cpOutPre">' + esc(r.compiled.out) + '</pre>' : ''; }
  else m.innerHTML = '<div class="muted">Prompt parts you used: ' + ((st.sel || []).map(function (k) { var p = ch.ai.parts.filter(function (x) { return x.id === k; })[0]; return p ? esc(p.txt) : ''; }).join(' · ')) + '</div>';
}

window.PLAY = { release: function () { P = null; }, open: open, close: close, act: act, todayHTML: todayHTML, trackHTML: trackHTML, workshopHTML: workshopHTML, get P() { return P; }, graphSVG: graphSVG };
})();
