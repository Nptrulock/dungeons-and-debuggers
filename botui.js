// v3 Your Bot: avatar, live pipeline, measured stats, and the modules you build to improve it.
(function () {
var G = window.Game, X = function () { return window.UIX; }, $ = function (s) { return document.querySelector(s); };
function esc(s) { return X().esc(s); }
function pc(x) { return Math.round(x * 100) + '%'; }
var STAGE_T = 380; // ms per pipeline stage in the animation
function failStage(err) { return err ? (G.ERR_TXT[err] || ['verify'])[0] : null; }
function typeOf(id) { return G.TASK_TYPES.filter(function (t) { return t.id === id; })[0] || G.TASK_TYPES[0]; }

function avatarHTML(st) {
  var mood = st.success >= 0.8 ? 'happy' : st.success >= 0.5 ? 'ok' : 'sad', h = G.hasMod;
  return '<div class="botAv ' + mood + '"><div class="botAnt">' + (h('bm-cron') ? '📡' : '·') + '</div>' + (G.lv('hat') ? '<div class="botHat">🎩</div>' : '') +
    '<div class="botHead"><span class="eye"></span><span class="eye"></span><div class="mouth"></div></div>' +
    '<div class="botBody">' + (h('bm-guard') ? '🛡️' : '') + (h('bm-sysprompt') ? '🧠' : '') + (h('bm-retry') ? '🔁' : '') + (h('bm-monitor') ? '📈' : '') + '</div>' +
    '<div class="botLv">v' + (1 + Math.floor(st.mods / 3)) + '.' + (st.mods % 3) + ' · ' + st.mods + '/' + st.modsN + ' modules</div></div>';
}
function pipeHTML() {
  return '<div class="pipe" id="botPipe">' + G.BOT_STAGES.map(function (s, i) { return '<div class="stg" data-s="' + s.id + '"><div class="sic">' + s.ic + '</div><div class="tiny">' + s.n + '</div></div>' + (i < G.BOT_STAGES.length - 1 ? '<div class="lnk"></div>' : ''); }).join('') + '</div><div class="pipeNow tiny" id="botNow">Waiting for the next task…</div>';
}
function feedHTML() {
  var f = G.S.bot.feed.slice(-8).reverse();
  if (!f.length) return '<div class="muted">No tasks yet. Your bot starts as soon as it has a task type for your tier.</div>';
  return f.map(function (x) { var t = typeOf(x.ty), e = x.err && G.ERR_TXT[x.err]; return '<div class="feedRow ' + (x.err ? 'bad' : 'ok') + '"><span>' + t.ic + '</span><span class="tid">' + x.id + '</span><span class="grow">' + (x.err ? '❌ ' + esc(e ? e[1] : x.err) : x.dlq ? '♻️ retried from the dead-letter queue' : '✅ ' + esc(t.name)) + '</span></div>'; }).join('');
}
function errBars() {
  var B = G.S.bot, keys = Object.keys(B.errs || {}).sort(function (a, b) { return B.errs[b] - B.errs[a]; }).slice(0, 6), tot = keys.reduce(function (a, k) { return a + B.errs[k]; }, 0);
  if (!tot) return '<div class="muted">No failures recorded yet.</div>';
  return keys.map(function (k) { var e = G.ERR_TXT[k] || [k, k]; return '<div class="errBar"><div class="row"><span class="grow tiny">' + esc(e[1]) + '</span><b class="tiny">' + X().fmt(B.errs[k]) + '</b></div><div class="bar small"><i style="width:' + (B.errs[k] / tot * 100) + '%;background:#f87171"></i></div></div>'; }).join('');
}
function matrixHTML(st) {
  var a = st.acc, labs = ['billing', 'tech', 'spam'], off = (1 - a) / 2, n = 100;
  var m = [[a, off * 1.4, off * 0.6], [off * 1.2, a, off * 0.8], [off * 0.3, off * 1.7, a]];
  return '<table class="cmx"><tr><th>true ↓ / pred →</th>' + labs.map(function (l) { return '<th>' + l + '</th>'; }).join('') + '</tr>' + m.map(function (r, i) { return '<tr><th>' + labs[i] + '</th>' + r.map(function (x, j) { return '<td class="' + (i === j ? 'diag' : x * n >= 6 ? 'hot' : '') + '">' + Math.round(x * n) + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
}
function statsHTML(st) {
  var B = G.S.bot, rec = B.recent || [], live = rec.length ? 1 - rec.reduce(function (a, x) { return a + x; }, 0) / rec.length : null;
  return '<div class="stats3"><div class="stat"><small>Success (last ' + rec.length + ')</small><b id="bsLive" style="color:' + ((live == null ? st.success : live) >= 0.8 ? 'var(--good)' : (live == null ? st.success : live) >= 0.5 ? 'var(--gold)' : '#f87171') + '">' + (live == null ? '—' : pc(live)) + '</b></div><div class="stat"><small>Tasks / hr</small><b>' + X().fmt(st.tph) + '</b></div><div class="stat"><small>🪙 / hr</small><b>' + X().fmt(st.coinsPerHr) + '</b></div></div>' +
    '<div class="stats3"><div class="stat"><small>Cost / task</small><b>$' + st.cost.toFixed(3) + '</b></div><div class="stat"><small>Uptime</small><b>' + (st.uptime * 100).toFixed(1) + '%</b></div><div class="stat"><small>Workers</small><b>' + st.workers + '</b></div></div>' +
    '<div class="stats3"><div class="stat"><small>Expected success</small><b>' + pc(st.success) + '</b></div><div class="stat"><small>Label accuracy</small><b>' + (st.measured ? pc(st.acc) : '❓') + '</b></div><div class="stat"><small>Tasks done</small><b id="bsTot">' + X().fmt(B.total || 0) + '</b></div></div>' +
    (st.measured ? '' : '<div class="tiny">You cannot see accuracy until you build an eval set (🧠 Train → Eval set). Without measurement you are guessing.</div>');
}
function homeHTML() {
  var st = G.botStats(), types = G.botTypes(), S = G.S, h = '';
  h += '<div class="card botHero"><div class="row" style="gap:12px">' + avatarHTML(st) + '<div class="grow"><h2>Your Bot</h2><div class="muted">An automation bot that works tasks for coins, online and offline (' + pc(G.offRate()) + ' speed while away). Everything it does well comes from modules <b>you</b> code, wire up and train.</div></div></div>' + pipeHTML() + '</div>';
  h += '<div class="card">' + statsHTML(st) + '</div>';
  h += '<div class="sectionTitle">Live task feed</div><div class="card" id="botFeed">' + feedHTML() + '</div>';
  h += '<div class="sectionTitle">Task types</div><div class="card">' + G.TASK_TYPES.map(function (t) { var on = S.tier >= t.tier; return '<div class="req"><span>' + (on ? t.ic : '🔒') + '</span> ' + esc(t.name) + '<span class="grow"></span><span class="tiny">' + (on ? pc(st.byType[t.id]) + ' · 🪙' + (Math.round(G.taskCoins(st, t) * 100) / 100) : 'Tier ' + (t.tier + 1)) + '</span></div>'; }).join('') + '</div>';
  var nx = G.botMods().filter(function (c) { return !G.chSolved(c.id) && G.chOpen(c); })[0];
  if (nx) h += '<button class="btn big" data-act="chopen" data-v="' + nx.id + '">🔧 Next upgrade: ' + nx.icon + ' ' + esc(nx.title) + '</button><div class="tiny" style="text-align:center;margin-top:4px">' + esc(nx.bot.eff) + '</div>';
  else h += '<div class="tiny" style="text-align:center">' + (G.botMods().every(function (c) { return G.chSolved(c.id); }) ? 'Every module is installed. Your bot is production-grade.' : 'Next modules unlock as you practice concepts in 🎯 Mastery.') + '</div>';
  return h;
}
function modsHTML() {
  var h = '<div class="card"><div class="muted">Each module is a real mini-challenge. Its effect on the bot is the thing you just built: a parser cuts parse errors, retries with backoff absorb 503s, an eval set lets you <i>measure</i> accuracy, a guardrail blocks injected instructions. Modules unlock once the concepts they use are 🛠️ Practiced.</div></div>';
  G.CHD.botCats.forEach(function (cat) {
    var ms = G.botMods().filter(function (c) { return c.bot.cat === cat.id; }), done = ms.filter(function (c) { return G.chSolved(c.id); }).length;
    h += '<div class="tierHead">' + cat.ic + ' ' + esc(cat.n) + ' · ' + done + '/' + ms.length + '</div>';
    ms.forEach(function (c) {
      var ok = G.chSolved(c.id), open = G.chOpen(c);
      h += '<div class="unit botMod ' + (ok ? 'learned ' : open ? '' : 'locked') + '"' + (open || ok ? ' data-act="chopen" data-v="' + c.id + '"' : '') + '><div class="uic">' + (ok ? '✅' : open ? c.icon : '🔒') + '</div><div class="grow"><b>' + esc(c.title) + '</b><div class="tiny">' + esc(c.bot.eff) + '</div>' + (open || ok ? '' : '<div class="tiny lockWhy">' + esc(G.chWhyLocked(c)) + '</div>') + '</div></div>';
    });
  });
  return h;
}
function logHTML() {
  var st = G.botStats(), B = G.S.bot, h = '';
  h += '<div class="card"><h3>🧯 Error types</h3>' + errBars() + '</div>';
  if (st.matrix) h += '<div class="card"><h3>🧮 Confusion matrix (eval set, per 100)</h3>' + matrixHTML(st) + '<div class="tiny">Off-diagonal cells are mistakes. The hottest cell tells you which few-shot example or label to fix next.</div></div>';
  h += '<div class="card"><h3>📜 Error log</h3>' + (st.logs ? (B.log.length ? '<pre class="code botLog">' + B.log.slice(0, 14).map(function (x) { var e = G.ERR_TXT[x.err] || [x.err, x.err]; return esc(JSON.stringify({ lvl: 'error', task: x.id, type: x.ty, stage: e[0], msg: e[1] })); }).join('\n') + '</pre>' : '<div class="muted">No errors logged yet.</div>') : '<div class="muted">Your bot prints nothing useful when it fails. Build <b>⌨️ Structured logging</b> to get one JSON line per failure.</div>' + (B.log.length ? '<div class="tiny">' + B.log.length + ' failures happened, but without logs you only see the count.</div>' : '')) + '</div>';
  h += '<div class="card"><h3>💡 How the bot works</h3><div class="muted" style="line-height:1.6">• Every task runs the pipeline <b>trigger → parse → decide → tool → verify → done</b>. A failure stops it at one stage, shown in red.<br>• The language model is simulated, but the code in each module really runs, and its effect on the numbers is modeled on what that technique does in real systems.<br>• <b>Prompting</b> (system prompt, few-shot, temperature) steers the model in context and does not change its weights. <b>Fine-tuning</b> changes weights using labeled data. <b>RAG</b> fetches documents into the prompt. <b>Rules</b> are plain code. Pick the cheapest one that passes your eval.<br>• Each task earns 🪙 for its value, minus model/API cost. Offline the bot runs at ' + pc(G.offRate()) + ' speed for up to ' + X().dur(G.offCap()) + '.<br>• Hardware (🪙 Upgrades) adds speed. 🛠️ Practiced concepts add +2% speed each.</div></div>';
  return h;
}
// live pipeline animation, driven by the real task feed
var animIdx = -1, animT0 = 0;
function live() {
  var pipe = $('#botPipe'); if (!pipe) return;
  var f = G.S.bot.feed, now = Date.now();
  if (!f.length) return;
  var cur = f[animIdx], total = G.BOT_STAGES.length * STAGE_T + 500;
  if (!cur || now - animT0 > total) { animIdx = f.length - 1; animT0 = now; cur = f[animIdx]; var fd = $('#botFeed'); if (fd) fd.innerHTML = feedHTML(); var lv = $('#bsTot'); if (lv) lv.textContent = X().fmt(G.S.bot.total || 0); }
  var k = Math.floor((now - animT0) / STAGE_T), fs = failStage(cur.err), fi = fs ? G.BOT_STAGES.map(function (s) { return s.id; }).indexOf(fs) : -1;
  pipe.querySelectorAll('.stg').forEach(function (el, i) {
    var cls = 'stg';
    if (fi >= 0 && i === fi && k >= i) cls += ' fail'; else if (fi >= 0 && i > fi) cls += ''; else if (i < k) cls += ' ok'; else if (i === k) cls += ' run';
    el.className = cls;
  });
  var t = typeOf(cur.ty), nw = $('#botNow');
  if (nw) nw.innerHTML = '<b>' + cur.id + '</b> ' + t.ic + ' ' + esc(t.name) + ' · ' + (fi >= 0 && k >= fi ? '<span style="color:#f87171">❌ ' + esc((G.ERR_TXT[cur.err] || [0, cur.err])[1]) + '</span>' : k >= G.BOT_STAGES.length - 1 ? '<span style="color:var(--good)">✅ done' + (cur.dlq ? ' (recovered from the dead-letter queue)' : '') + '</span>' : esc(G.BOT_STAGES[Math.min(k, 5)].n) + '…');
}
window.BOTUI = { homeHTML: homeHTML, modsHTML: modsHTML, logHTML: logHTML, live: live };
})();
