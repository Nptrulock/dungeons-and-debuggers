// Dungeons & Debuggers — UI
(function () {
'use strict';
var G = window.Game, DD = G.DD;
var $ = function (s, r) { return (r || document).querySelector(s); };
function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function fmt(n) { n = Math.floor(n); if (n < 1e4) return n.toLocaleString(); if (n < 1e6) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'k'; if (n < 1e9) return (n / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M'; return (n / 1e9).toFixed(2) + 'B'; }
function dur(ms) { var m = Math.round(ms / 6e4); if (m < 60) return m + 'm'; var h = Math.floor(m / 60); if (h < 48) return h + 'h ' + (m % 60) + 'm'; return Math.floor(h / 24) + 'd ' + (h % 24) + 'h'; }
function pct(x) { return Math.round(x * 100) + '%'; }
var TR = {}; DD.tracks.forEach(function (t) { TR[t.id] = t; });

// ---------------- sound (WebAudio, soft) ----------------
var AC = null, master = null;
function audioInit() {
  try {
    if (!AC) { AC = new (window.AudioContext || window.webkitAudioContext)(); master = AC.createGain(); master.gain.value = 0.5; master.connect(AC.destination); }
    if (AC.state === 'suspended') AC.resume();
    var b = AC.createBuffer(1, 1, 22050), s = AC.createBufferSource(); s.buffer = b; s.connect(master); s.start(0);
  } catch (e) { }
}
function tone(freq, t0, len, vol, type) {
  if (!AC || !G.S.settings.sound) return;
  var t = AC.currentTime + (t0 || 0), o = AC.createOscillator(), g = AC.createGain();
  o.type = type || 'sine'; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.12, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + (len || 0.25));
  o.connect(g); g.connect(master); o.start(t); o.stop(t + (len || 0.25) + 0.05);
}
var SFX = {
  tap: function () { tone(880, 0, 0.06, 0.03); },
  select: function () { tone(660, 0, 0.09, 0.05, 'triangle'); },
  good: function () { tone(523.25, 0, 0.18, 0.11); tone(783.99, 0.08, 0.3, 0.1); },
  bad: function () { tone(220, 0, 0.25, 0.07, 'triangle'); tone(196, 0.1, 0.3, 0.05, 'triangle'); },
  combo: function (n) { tone(523.25 * Math.pow(2, Math.min(n, 24) / 24), 0, 0.15, 0.06, 'triangle'); },
  level: function () { [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { tone(f, i * 0.09, 0.35, 0.09); }); },
  relic: function () { [1046.5, 1318.5, 1568, 2093].forEach(function (f, i) { tone(f, i * 0.07, 0.6, 0.05); tone(f / 2, i * 0.07, 0.6, 0.04, 'triangle'); }); },
  done: function () { [392, 523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { tone(f, i * 0.08, 0.4, 0.08); }); },
  coin: function () { tone(1318.5, 0, 0.08, 0.03); tone(1760, 0.05, 0.12, 0.03); },
  hit: function () { tone(330, 0, 0.12, 0.08, 'triangle'); tone(660, 0.04, 0.16, 0.05); }
};

// ---------------- confetti ----------------
var cv = $('#confetti'), cx = cv.getContext('2d'), parts = [], confRunning = false;
function confetti(n, colors) {
  cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio;
  colors = colors || ['#7c5cff', '#22d3ee', '#34d399', '#fbbf24', '#f472b6'];
  for (var i = 0; i < (n || 120); i++) parts.push({ x: innerWidth / 2 + (Math.random() - 0.5) * 120, y: innerHeight * 0.35, vx: (Math.random() - 0.5) * 12, vy: -Math.random() * 12 - 4, r: Math.random() * 6 + 3, c: colors[i % colors.length], a: Math.random() * 6, va: (Math.random() - 0.5) * 0.3, life: 120 + Math.random() * 60 });
  if (!confRunning) { confRunning = true; requestAnimationFrame(confStep); }
}
function confStep() {
  cx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); cx.clearRect(0, 0, innerWidth, innerHeight);
  parts = parts.filter(function (p) { return p.life-- > 0 && p.y < innerHeight + 20; });
  parts.forEach(function (p) { p.vy += 0.3; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.a += p.va; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.a); cx.fillStyle = p.c; cx.globalAlpha = Math.min(1, p.life / 40); cx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); cx.restore(); });
  if (parts.length) requestAnimationFrame(confStep); else { confRunning = false; cx.clearRect(0, 0, innerWidth, innerHeight); }
}
function toast(html, cls) { var box = $('#toasts'); while (box.children.length >= 3) box.firstChild.remove(); var d = document.createElement('div'); d.className = 'toast ' + (cls || ''); d.innerHTML = html; $('#toasts').appendChild(d); setTimeout(function () { d.remove(); }, 3300); }
function floatText(txt, x, y, color) { var d = document.createElement('div'); d.className = 'floatxp'; d.textContent = txt; d.style.left = (x - 30) + 'px'; d.style.top = (y - 20) + 'px'; if (color) d.style.color = color; document.body.appendChild(d); setTimeout(function () { d.remove(); }, 1000); }
function modal(html) { var m = $('#modal'); m.innerHTML = '<div class="mbox">' + html + '</div>'; m.classList.remove('hidden'); }
function closeModal() { $('#modal').classList.add('hidden'); $('#modal').innerHTML = ''; }

// ---------------- header ----------------
var lastLevel = 0;
function header() {
  var S = G.S, L = G.levelInfo(), rk = G.rank(), hat = G.lv('hat') ? '<span class="hat">🎩</span>' : '';
  var goal = Math.min(1, S.daily.xp / G.DAILY_GOAL_XP), C = 2 * Math.PI * 8;
  $('#top').innerHTML =
    '<div class="hrow"><div class="avatar">' + hat + rk.ic + '</div><div class="who"><div class="rank">Lv <b>' + L.level + '</b> · ' + rk.name + '</div>' +
    '<div class="bar"><i style="width:' + (L.into / L.need * 100) + '%"></i></div><div class="xpnum">' + fmt(L.into) + ' / ' + fmt(L.need) + ' XP · ' + fmt(S.xp) + ' total</div></div></div>' +
    '<div class="chips">' +
    '<span class="chip" title="Streak">🔥 ' + S.streak.count + (S.streak.freezes ? ' <small>🧊' + S.streak.freezes + '</small>' : '') + '</span>' +
    '<span class="chip ring" title="Daily goal"><svg class="ringSvg" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="none" stroke="#2e3558" stroke-width="3"/><circle cx="10" cy="10" r="8" fill="none" stroke="' + (goal >= 1 ? '#34d399' : '#22d3ee') + '" stroke-width="3" stroke-linecap="round" stroke-dasharray="' + (C * goal) + ' ' + C + '"/></svg>' + Math.min(S.daily.xp, G.DAILY_GOAL_XP) + '/' + G.DAILY_GOAL_XP + '</span>' +
    '<span class="chip" id="chipCoins" title="Coins">🪙 ' + fmt(S.coins) + '</span>' +
    '<span class="chip" title="Insight">💠 ' + fmt(S.insight) + '</span>' +
    '<span class="chip" title="Hint tokens">💡 ' + S.hints + '/' + G.hintCap() + '</span>' +
    '<span class="chip" title="Knowledge mastered">🧠 ' + G.countMastered() + '/' + G.ALLQ.length + '</span>' +
    '</div>';
  if (lastLevel && L.level > lastLevel) { SFX.level(); confetti(80); toast('⭐ Level up! You are now <b>level ' + L.level + '</b>', 'gold'); }
  lastLevel = L.level;
}

// ---------------- tabs & pages ----------------
var TABS = [
  { id: 'learn', ic: '📚', name: 'Learn' }, { id: 'work', ic: '💼', name: 'Work' }, { id: 'upg', ic: '⬆️', name: 'Upgrades' }, { id: 'codex', ic: '📖', name: 'Codex' }, { id: 'hero', ic: '🧙', name: 'Hero' }];
var tab = 'learn', subIdx = { learn: 0, work: 0, upg: 0, codex: 0, hero: 0 }, scrollMem = {};
function subpages() {
  if (tab === 'learn') return [{ id: 'today', name: '🏠 Today' }].concat(DD.tracks.map(function (t) { return { id: 't-' + t.id, name: t.icon + ' ' + t.short, lock: !G.trackUnlocked(t.id), dot: G.trackUnlocked(t.id) ? dueInTrack(t.id) : 0 }; }));
  if (tab === 'work') return [{ id: 'desk', name: '💻 Desk' }, { id: 'tickets', name: '🎫 How work pays' }];
  if (tab === 'upg') return [{ id: 'insight', name: '💠 Mastery' }, { id: 'office', name: '🪙 Office' }];
  if (tab === 'codex') return [{ id: 'relics', name: '🏺 Relics' }, { id: 'gloss', name: '📖 Glossary' }, { id: 'ach', name: '🏆 Achievements' }];
  return [{ id: 'profile', name: '🧙 Profile' }, { id: 'settings', name: '⚙️ Settings' }];
}
function dueInTrack(t) { var n = 0; (G.TRACK_UNITS[t] || []).forEach(function (u) { if (G.unitOpen(u)) n += G.unitDue(u); }); return n; }
function renderTabs() {
  var due = G.allDue().length;
  $('#tabs').innerHTML = '<div class="in">' + TABS.map(function (t) { return '<button class="tab ' + (t.id === tab ? 'on' : '') + '" data-act="tab" data-v="' + t.id + '"><span class="ic">' + t.ic + '</span>' + t.name + (t.id === 'learn' && due ? '<span class="badge">' + due + '</span>' : '') + '</button>'; }).join('') + '</div>';
}
function rememberScroll() { document.querySelectorAll('#pages .page').forEach(function (p) { scrollMem[p.dataset.id] = p.scrollTop; }); }
function render() {
  rememberScroll();
  header(); renderTabs();
  var subs = subpages(), idx = Math.min(subIdx[tab], subs.length - 1);
  $('#subnav').innerHTML = subs.map(function (s, i) { return '<button class="pill ' + (i === idx ? 'on' : '') + (s.lock ? ' lock' : '') + '" data-act="sub" data-v="' + i + '">' + s.name + (s.lock ? ' 🔒' : '') + (s.dot ? '<span class="dot">' + s.dot + '</span>' : '') + '</button>'; }).join('');
  var pages = $('#pages');
  pages.innerHTML = subs.map(function (s) { return '<section class="page" data-id="' + tab + ':' + s.id + '">' + pageHTML(s.id) + '</section>'; }).join('');
  document.querySelectorAll('#pages .page').forEach(function (p) { if (scrollMem[p.dataset.id]) p.scrollTop = scrollMem[p.dataset.id]; });
  pages.style.scrollSnapType = 'none'; pages.scrollLeft = idx * pages.clientWidth; pages.style.scrollSnapType = '';
  var pill = $('#subnav .pill.on'); if (pill) pill.scrollIntoView({ inline: 'center', block: 'nearest' });
}
var scrollT;
function onPagesScroll() {
  clearTimeout(scrollT);
  scrollT = setTimeout(function () {
    var p = $('#pages'), i = Math.round(p.scrollLeft / p.clientWidth);
    if (i !== subIdx[tab]) { subIdx[tab] = i; document.querySelectorAll('#subnav .pill').forEach(function (b, k) { b.classList.toggle('on', k === i); }); var pill = $('#subnav .pill.on'); if (pill) pill.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }); SFX.tap(); }
  }, 80);
}
function pageHTML(id) {
  if (id === 'today') return todayHTML();
  if (id.indexOf('t-') === 0) return trackHTML(id.slice(2));
  if (id === 'desk') return deskHTML();
  if (id === 'tickets') return workInfoHTML();
  if (id === 'insight') return upgHTML(G.INSIGHT_UPG, 'insight', '💠');
  if (id === 'office') return upgHTML(G.OFFICE_UPG, 'coins', '🪙');
  if (id === 'relics') return relicsHTML();
  if (id === 'gloss') return glossHTML();
  if (id === 'ach') return achHTML();
  if (id === 'profile') return profileHTML();
  if (id === 'settings') return settingsHTML();
  return '';
}

// ---------------- learn ----------------
function nextUnit() { // first open, not learned unit in track order (think, code, ...)
  var best = null;
  DD.tracks.forEach(function (t) { (G.TRACK_UNITS[t.id] || []).forEach(function (u) { if (!best && G.unitOpen(u) && !G.unitLearned(u)) best = u; }); });
  return best;
}
function todayHTML() {
  var S = G.S, due = G.allDue().length, nu = nextUnit(), h = '';
  var T = Math.min(S.tier + 1, 5), ts = G.tierStatus(T), tier = DD.tiers[T - 1];
  h += '<div class="card trackHero" style="--tc:#7c5cff"><div class="row"><div class="bigIcon">🐉</div><div class="grow"><h2>Your quest today</h2><div class="muted">Daily goal: earn ' + G.DAILY_GOAL_XP + ' XP to keep your 🔥 streak. Knowledge only grows when you answer. Your desk earns coins while you are away.</div></div></div>' +
    '<div class="bar" style="margin-top:10px"><i style="width:' + Math.min(100, S.daily.xp / G.DAILY_GOAL_XP * 100) + '%"></i><span>' + Math.min(S.daily.xp, G.DAILY_GOAL_XP) + ' / ' + G.DAILY_GOAL_XP + ' XP' + (S.daily.goal ? ' ✓' : '') + '</span></div>' +
    (nu ? '<button class="btn big" style="margin-top:12px" data-act="lesson" data-v="' + nu.id + '">▶ Continue: ' + nu.icon + ' ' + esc(nu.name) + '</button><div class="tiny" style="margin-top:6px;text-align:center">' + TR[nu.track].icon + ' ' + TR[nu.track].name + ' · ' + DD.tiers[nu.tier - 1].name + '</div>' : '<div class="muted" style="margin-top:10px">Every open unit is learned. Review to raise mastery and open the boss.</div>') + '</div>';
  h += '<div class="card reviewCard"><div class="row"><div style="font-size:38px">🔁</div><div class="grow"><h3>Spaced review</h3><div class="muted">' + (due ? '<b style="color:var(--gold)">' + due + ' due</b>. Missed questions come back sooner; known ones wait longer.' : 'Nothing due right now. Practice your weakest questions for half XP.') + '</div></div></div><button class="btn ' + (due ? 'gold' : 'ghost') + ' big" style="margin-top:10px" data-act="review">' + (due ? 'Review ' + Math.min(due, 12) + ' due' : 'Practice weakest') + '</button></div>';
  h += '<div class="sectionTitle">Daily deeds</div><div class="daily">' + G.DEEDS.map(function (d) { var ok = d.f(), cl = S.daily.claimed[d.id]; return '<div class="d ' + (cl ? 'done' : '') + '"><div style="font-size:20px">' + d.ic + '</div>' + d.txt + '<div style="margin-top:6px">' + (cl ? '✓ +' + d.r + ' 💠' : ok ? '<button class="btn sm green" data-act="deed" data-v="' + d.id + '">Claim ' + d.r + '💠</button>' : '<span class="tiny">+' + d.r + ' 💠</span>') + '</div></div>'; }).join('') + '</div>';
  if (S.tier < 5) {
    h += '<div class="card bossCard" style="margin-top:12px"><div class="row"><div class="bossIc">' + tier.bossIcon + '</div><div class="grow"><div class="tiny">TIER ' + T + ' BOSS · ' + tier.icon + ' ' + tier.name.toUpperCase() + '</div><h3>' + tier.boss + '</h3><div class="muted">A mixed exam of ' + 20 + ' questions from every ' + tier.name + ' unit. Land 16 hits before you lose 4 focus. Winning opens the next tier and promotes you to <b>' + G.RANKS[T].name + '</b>.</div></div></div>' +
      '<div class="req"><span class="' + (ts.learned === ts.units ? 'ok' : 'no') + '">' + (ts.learned === ts.units ? '✅' : '⬜') + '</span> Learn every ' + tier.name + ' unit (' + ts.learned + '/' + ts.units + ')</div>' +
      '<div class="req"><span class="' + (ts.mastery >= ts.need ? 'ok' : 'no') + '">' + (ts.mastery >= ts.need ? '✅' : '⬜') + '</span> Tier mastery ' + pct(ts.mastery) + ' / ' + pct(ts.need) + '</div>' +
      '<div class="bar small" style="margin-top:6px"><i style="width:' + Math.min(100, ts.mastery / ts.need * 100) + '%;background:linear-gradient(90deg,#ff3d7f,#fb923c)"></i></div>' +
      (ts.cooldown ? '<div class="tiny" style="margin-top:8px">Regrouping after a loss… try again in ' + dur(ts.cooldown) + '</div>' : '') +
      '<button class="btn red big" style="margin-top:10px" data-act="boss" data-v="' + T + '" ' + (ts.ready && !ts.cooldown ? '' : 'disabled') + '>⚔️ Fight ' + tier.boss + '</button></div>';
  } else h += '<div class="card bossCard"><h3>🐉 Every boss defeated</h3><div class="muted">You are an AI-Native Lead. Keep reviewing to master all ' + G.ALLQ.length + ' questions.</div></div>';
  h += '<div class="sectionTitle">Tracks · swipe ➜</div><div class="trackGrid">' + DD.tracks.map(function (t, i) { var st = G.trackStats(t.id), tl = G.trackLevel(t.id), un = G.trackUnlocked(t.id); return '<button class="tg" style="text-align:left;' + (un ? '' : 'opacity:.45') + '" data-act="sub" data-v="' + (i + 1) + '"><div class="row"><span style="font-size:22px">' + t.icon + '</span><div class="grow"><b style="font-size:13px">' + t.short + '</b><div class="tiny">' + (un ? t.cls + ' Lv ' + tl.level : '🔒 ' + lockText(t.id)) + '</div></div></div><div class="bar small"><i style="width:' + st.mastery * 100 + '%;background:' + t.color + '"></i></div></button>'; }).join('') + '</div>';
  return h;
}
function lockText(tid) { var us = G.TRACK_UNITS[tid]; if (us[0].tier > G.S.tier + 1) return 'Opens at ' + DD.tiers[us[0].tier - 1].name; var need = G.TRACK_UNLOCK[tid] - G.learnedCount(); return need > 0 ? 'Learn ' + need + ' more unit' + (need > 1 ? 's' : '') : ''; }
function trackHTML(tid) {
  var t = TR[tid], st = G.trackStats(tid), tl = G.trackLevel(tid), un = G.trackUnlocked(tid), due = dueInTrack(tid);
  var h = '<div class="card trackHero" style="--tc:' + t.color + '"><div class="row"><div class="bigIcon">' + t.icon + '</div><div class="grow"><h2>' + t.name + '</h2><div class="muted">' + t.cls + ' · Lv ' + tl.level + ' · ' + st.mastered + '/' + st.n + ' mastered</div></div></div>' +
    '<div class="bar" style="margin-top:10px"><i style="width:' + (tl.into / tl.need * 100) + '%;background:' + t.color + '"></i><span>Track XP ' + fmt(tl.into) + ' / ' + fmt(tl.need) + '</span></div>' +
    '<div class="bar small" style="margin-top:6px"><i style="width:' + st.mastery * 100 + '%;background:linear-gradient(90deg,#fbbf24,#f59e0b)"></i></div><div class="tiny" style="margin-top:3px">Mastery ' + pct(st.mastery) + ' · seen ' + st.seen + '/' + st.n + '</div>' +
    (un ? '<button class="btn ' + (due ? 'gold' : 'ghost') + ' sm" style="margin-top:10px" data-act="review" data-v="' + tid + '">' + (due ? '🔁 Review ' + due + ' due' : '🏋️ Practice this track') + '</button>' : '<div class="muted" style="margin-top:10px">🔒 ' + lockText(tid) + '</div>') + '</div>';
  var lastTier = 0;
  (G.TRACK_UNITS[tid] || []).forEach(function (u) {
    if (u.tier !== lastTier) { lastTier = u.tier; var ti = DD.tiers[u.tier - 1]; h += '<div class="tierHead">' + ti.icon + ' ' + ti.name + (u.tier > G.S.tier + 1 ? ' · 🔒 beat ' + DD.tiers[u.tier - 2].boss : '') + '</div>'; }
    var open = G.unitOpen(u), learned = G.unitLearned(u), m = G.unitMastery(u), all = G.unitMasteredAll(u), d = open ? G.unitDue(u) : 0, les = G.S.unitLessons[u.id] || 0;
    h += '<div class="unit ' + (open ? '' : 'locked ') + (all ? 'mastered ' : learned ? 'learned ' : '') + '"' + (open ? ' data-act="lesson" data-v="' + u.id + '"' : '') + '><div class="uic">' + u.icon + '</div><div class="grow"><div style="font-weight:800">' + esc(u.name) + (all ? ' <span class="crown">👑</span>' : '') + '</div>' +
      '<div class="tiny">' + u.qids.length + ' questions · ' + les + ' lesson' + (les === 1 ? '' : 's') + (learned ? ' · learned ✓' : '') + (d ? ' · <span class="due">' + d + ' due</span>' : '') + '</div>' +
      '<div class="bar small"><i style="width:' + m * 100 + '%;background:' + (all ? 'var(--gold)' : t.color) + '"></i></div></div>' + (open ? '<span style="font-size:20px">▶</span>' : '') + '</div>';
  });
  h += '<div class="tiny" style="text-align:center;margin-top:10px">A unit counts as learned after 2 lessons with every question answered right at least once. Mastery 👑 needs 5 correct answers spread over about a month.</div>';
  return h;
}

// ---------------- lesson player ----------------
var sess = null, cur = null;
function begin(s) {
  sess = G.startSession(s); audioInit(); SFX.select();
  $('#overlay').classList.remove('hidden'); showQ();
}
function lhead() {
  var total = sess.queue.length, p = sess.i / total * 100;
  var h = '<div class="lhead"><button class="x" data-act="quit">✕</button><div class="lprog"><i style="width:' + p + '%"></i></div><div class="combo ' + (sess.combo >= 3 ? 'hot' : '') + '">' + (sess.combo >= 2 ? '🔥' + sess.combo : '') + '</div></div>';
  if (sess.kind === 'boss') h += '<div class="bossBar"><div class="bi" id="bossIc">' + DD.tiers[sess.tierN - 1].bossIcon + '</div><div class="grow"><div class="tiny">' + esc(DD.tiers[sess.tierN - 1].boss) + ' · ' + sess.hp + ' HP</div><div class="hpbar"><i style="width:' + (sess.hp / sess.maxHp * 100) + '%"></i></div></div><div class="hearts">' + '💙'.repeat(Math.max(0, sess.focus)) + '🖤'.repeat(4 - Math.max(0, sess.focus)) + '</div></div>';
  return h;
}
function hl(code) {
  var re = /(\/\/.*$|#.*$|<!--.*?-->|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|\b\d+(?:\.\d+)?\b|\b(?:const|let|var|function|return|if|else|for|while|of|in|async|await|def|import|from|true|false|null|undefined|None|True|False|try|catch|except|new|class|break|continue|type|SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|JOIN|ON|ORDER|BY|LIMIT|DESC|ASC|COUNT)\b|\b[a-zA-Z_]\w*(?=\())/gm;
  return code.split('\n').map(function (line) {
    var diff = /^[+-] /.test(line) || line === '+' || line === '-' ? line[0] : '';
    var out = '', last = 0, m; re.lastIndex = 0;
    while ((m = re.exec(line))) {
      out += esc(line.slice(last, m.index)); var tk = m[0], c;
      if (/^(\/\/|#|<!--)/.test(tk)) c = 'c'; else if (/^["']/.test(tk)) c = 's'; else if (/^\d/.test(tk)) c = 'n'; else if (/^[a-zA-Z_]\w*$/.test(tk) && line.charAt(m.index + tk.length) === '(' && !/^(if|for|while|function|return)$/.test(tk)) c = 'f'; else c = 'k';
      if (c === 'c' && tk[0] === '#' && !/python|print|def /.test(code) && /[{;:]/.test(code)) c = 'k';
      out += '<span class="' + c + '">' + esc(tk) + '</span>'; last = m.index + tk.length;
    }
    out += esc(line.slice(last));
    return diff ? '<span class="' + (diff === '+' ? 'add' : 'del') + '">' + out + '</span>' : out;
  }).join('\n');
}
function isMonoish(s) { return /[(){}\[\];=<>"`]|^git |^npm |^SELECT|^\.|^#|^--|\.\w+\(/.test(s) && s.length < 70; }
function showQ() {
  if (sess.i >= sess.queue.length || (sess.kind === 'boss' && (sess.hp <= 0 || sess.focus <= 0))) return finish();
  var qid = sess.queue[sess.i], Qd = G.Q[qid], q = Qd.raw, type = q[0], it = G.item(qid);
  cur = { qid: qid, type: type, answered: false, usedHint: false, mistakes: 0 };
  var code = (['mc', 'out', 'prompt', 'diff', 'git', 'err', 'tf', 'order'].indexOf(type) >= 0) ? q[type === 'tf' ? 4 : 4] : null;
  var h = lhead() + '<div class="lbody"><div class="kind">' + G.KIND_IC[type] + ' ' + G.KIND[type] + (it.b === 0 ? ' <span class="new">NEW</span>' : '') + (sess.shiny[sess.i] ? ' <span class="shiny">✨ SHINY</span>' : '') + (sess.retryAt[sess.i] ? ' <span class="new" style="background:#9f1239">RETRY</span>' : '') + '</div>';
  h += '<div class="tiny">' + TR[Qd.track].icon + ' ' + esc(Qd.unit.name) + ' · ' + DD.tiers[Qd.tier - 1].name + '</div>';
  h += '<div class="qtext">' + esc(q[1]) + '</div>';
  if (code) h += '<pre class="code">' + hl(code) + '</pre>';
  if (['mc', 'out', 'prompt', 'diff', 'git', 'err'].indexOf(type) >= 0) {
    cur.opts = G.DD && shuffleArr(q[2].slice());
    var mono = type === 'out' || type === 'git' || cur.opts.every(isMonoish);
    h += '<div class="opts">' + cur.opts.map(function (o, i) { return '<button class="opt ' + (mono ? 'mono' : '') + '" data-act="pick" data-v="' + i + '">' + esc(o) + '</button>'; }).join('') + '</div>';
  } else if (type === 'tf') {
    cur.opts = [true, false];
    h += '<div class="tf"><button class="opt" data-act="pick" data-v="0">✔ True</button><button class="opt" data-act="pick" data-v="1">✘ False</button></div>';
  } else if (type === 'order') {
    cur.pool = shuffleDifferent(q[2]); cur.chosen = [];
    h += '<div class="muted" style="margin-bottom:6px">Tap in order. Tap a placed step to remove it.</div><div class="answerZone" id="az"></div><div class="pool" id="pool"></div>';
  } else if (type === 'fill') {
    cur.pool = shuffleArr(q[3].concat(q[4])); cur.fill = q[3].map(function () { return null; });
    h += '<pre class="code" id="fillCode"></pre><div class="pool wrap" id="pool"></div>';
  } else if (type === 'match') {
    cur.left = shuffleArr(q[2].map(function (p, i) { return i; })); cur.right = shuffleArr(q[2].map(function (p, i) { return i; })); cur.done = {}; cur.ls = null;
    h += '<div class="match" id="match"></div>';
  } else if (type === 'bug') {
    h += '<div class="lines">' + q[2].map(function (l, i) { return '<button class="line" data-act="pick" data-v="' + i + '"><span class="ln">' + (i + 1) + '</span><span>' + hl(l) + '</span></button>'; }).join('') + '</div>';
  }
  h += '</div><div class="lfoot" id="lfoot"><div class="in" id="lfootIn"></div></div>';
  $('#overlay').innerHTML = h;
  if (type === 'order') drawOrder(); if (type === 'fill') drawFill(); if (type === 'match') drawMatch();
  footer();
  $('.lbody').scrollTop = 0;
}
function shuffleArr(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function shuffleDifferent(a) { var b; var tries = 0; do { b = shuffleArr(a.slice()); } while (JSON.stringify(b) === JSON.stringify(a) && tries++ < 10); return b; }
function footer() {
  var t = cur.type, ready = isReady();
  var canHint = !cur.answered && t !== 'tf' && G.S.hints > 0 && sess.kind !== 'boss';
  $('#lfootIn').innerHTML = '<div class="row">' + (t !== 'tf' && sess.kind !== 'boss' ? '<button class="hintBtn" data-act="hint" ' + (canHint ? '' : 'disabled style="opacity:.4"') + '>💡 Hint (' + G.S.hints + ')</button>' : '') + '<button class="btn green big grow" data-act="check" ' + (ready ? '' : 'disabled') + '>Check</button></div>';
}
function isReady() {
  var t = cur.type;
  if (t === 'order') return cur.chosen.length === cur.pool.length;
  if (t === 'fill') return cur.fill.every(function (x) { return x !== null; });
  if (t === 'match') return Object.keys(cur.done).length === G.Q[cur.qid].raw[2].length;
  return cur.sel !== undefined;
}
function drawOrder() {
  $('#az').innerHTML = cur.chosen.length ? cur.chosen.map(function (pi, k) { return '<button class="tok" data-act="unorder" data-v="' + k + '"><span class="num">' + (k + 1) + '</span>' + esc(cur.pool[pi]) + '</button>'; }).join('') : '<div class="tiny" style="padding:10px;text-align:center">Your order appears here</div>';
  $('#pool').innerHTML = cur.pool.map(function (s, i) { var used = cur.chosen.indexOf(i) >= 0; return '<button class="tok ' + (isMonoish(s) ? 'mono ' : '') + (used ? 'used' : '') + '" data-act="order" data-v="' + i + '">' + esc(s) + '</button>'; }).join('');
}
function drawFill() {
  var q = G.Q[cur.qid].raw, parts = q[2].split('___'), h = '', next = cur.fill.indexOf(null);
  parts.forEach(function (p, i) { h += hl(p); if (i < parts.length - 1) { var v = cur.fill[i]; h += '<span class="blank ' + (v !== null ? 'filled' : '') + (i === next ? ' cur' : '') + '" data-act="unfill" data-v="' + i + '">' + (v !== null ? esc(cur.pool[v]) : '&nbsp;?&nbsp;') + '</span>'; } });
  $('#fillCode').innerHTML = h;
  $('#pool').innerHTML = cur.pool.map(function (s, i) { return '<button class="tok mono ' + (cur.fill.indexOf(i) >= 0 ? 'used' : '') + '" data-act="fill" data-v="' + i + '">' + esc(s) + '</button>'; }).join('');
}
function drawMatch() {
  var pairs = G.Q[cur.qid].raw[2], h = '';
  for (var r = 0; r < pairs.length; r++) {
    var li = cur.left[r], ri = cur.right[r];
    h += '<button class="tok ' + (cur.done[li] ? 'done ' : '') + (cur.ls === li ? 'sel' : '') + '" data-act="ml" data-v="' + li + '" id="ml' + li + '">' + esc(pairs[li][0]) + '</button>';
    h += '<button class="tok ' + (cur.done[ri] ? 'done' : '') + '" data-act="mr" data-v="' + ri + '" id="mr' + ri + '">' + esc(pairs[ri][1]) + '</button>';
  }
  $('#match').innerHTML = h;
}
function act(a, v, el, ev) {
  if (!cur || cur.answered) { if (a === 'continue') next(); else if (a === 'quit') quit(); else if (a === 'sumdone') closeLesson(); return; }
  var q = G.Q[cur.qid].raw;
  if (a === 'pick') { cur.sel = +v; document.querySelectorAll('.opt,.line').forEach(function (b) { b.classList.toggle('sel', +b.dataset.v === cur.sel); }); SFX.select(); footer(); }
  else if (a === 'order') { v = +v; if (cur.chosen.indexOf(v) < 0) { cur.chosen.push(v); SFX.select(); drawOrder(); footer(); } }
  else if (a === 'unorder') { cur.chosen.splice(+v, 1); SFX.tap(); drawOrder(); footer(); }
  else if (a === 'fill') { var k = cur.fill.indexOf(null); if (k >= 0 && cur.fill.indexOf(+v) < 0) { cur.fill[k] = +v; SFX.select(); drawFill(); footer(); } }
  else if (a === 'unfill') { cur.fill[+v] = null; SFX.tap(); drawFill(); footer(); }
  else if (a === 'ml') { if (cur.done[+v]) return; cur.ls = +v; SFX.select(); drawMatch(); }
  else if (a === 'mr') {
    if (cur.ls === null || cur.ls === undefined || cur.done[+v]) return;
    if (cur.ls === +v) { cur.done[+v] = true; cur.ls = null; SFX.good(); drawMatch(); footer(); if (isReady()) setTimeout(doCheck, 250); }
    else { cur.mistakes++; SFX.bad(); var e1 = $('#mr' + v), e2 = $('#ml' + cur.ls); [e1, e2].forEach(function (e) { if (e) { e.classList.remove('bad'); void e.offsetWidth; e.classList.add('bad'); } }); cur.ls = null; setTimeout(drawMatch, 380); }
  }
  else if (a === 'hint') doHint();
  else if (a === 'check') doCheck(ev);
  else if (a === 'quit') quit();
}
function doHint() {
  if (cur.answered || !G.useHint()) return;
  cur.usedHint = true; SFX.select(); var q = G.Q[cur.qid].raw, t = cur.type;
  if (['mc', 'out', 'prompt', 'diff', 'git', 'err'].indexOf(t) >= 0) {
    var n = G.hasRelic('lens') ? 2 : 1, btns = [].slice.call(document.querySelectorAll('.opt')).filter(function (b) { return cur.opts[+b.dataset.v] !== q[2][0] && !b.classList.contains('gone'); });
    shuffleArr(btns).slice(0, Math.max(0, Math.min(n, btns.length - 1))).forEach(function (b) { b.classList.add('gone'); if (cur.sel === +b.dataset.v) cur.sel = undefined; });
  } else if (t === 'order') { var want = q[2][cur.chosen.length]; var pi = cur.pool.indexOf(want); cur.chosen = cur.chosen.filter(function (x, k) { return cur.pool[x] === q[2][k]; }); want = q[2][cur.chosen.length]; pi = cur.pool.indexOf(want); if (pi >= 0 && cur.chosen.indexOf(pi) < 0) cur.chosen.push(pi); drawOrder(); }
  else if (t === 'fill') { for (var k = 0; k < cur.fill.length; k++) { var right = cur.pool.indexOf(q[3][k]); if (cur.fill[k] !== right) { var other = cur.fill.indexOf(right); if (other >= 0) cur.fill[other] = null; cur.fill[k] = right; break; } } drawFill(); }
  else if (t === 'match') { for (var i = 0; i < q[2].length; i++) if (!cur.done[i]) { cur.done[i] = true; break; } drawMatch(); if (isReady()) setTimeout(doCheck, 250); }
  else if (t === 'bug') { var lines = [].slice.call(document.querySelectorAll('.line')).filter(function (b) { return +b.dataset.v !== q[3] && !b.classList.contains('gone'); }); if (lines.length) { var b = shuffleArr(lines)[0]; b.classList.add('gone'); b.style.opacity = .25; b.style.pointerEvents = 'none'; if (cur.sel === +b.dataset.v) cur.sel = undefined; } }
  footer(); header();
}
function respValue() {
  var t = cur.type, q = G.Q[cur.qid].raw;
  if (['mc', 'out', 'prompt', 'diff', 'git', 'err'].indexOf(t) >= 0) return cur.opts[cur.sel];
  if (t === 'tf') return cur.sel === 0;
  if (t === 'order') return cur.chosen.map(function (i) { return cur.pool[i]; });
  if (t === 'fill') return cur.fill.map(function (i) { return cur.pool[i]; });
  if (t === 'match') return cur.mistakes;
  if (t === 'bug') return cur.sel;
}
function doCheck(ev) {
  if (cur.answered || !isReady()) return;
  cur.answered = true;
  var ok = G.check(cur.qid, respValue()), qid = cur.qid, q = G.Q[qid].raw, t = cur.type;
  var lvBefore = G.levelInfo().level;
  var res = G.answer(sess, qid, ok, cur.usedHint);
  // mark visuals
  if (['mc', 'out', 'prompt', 'diff', 'git', 'err'].indexOf(t) >= 0) document.querySelectorAll('.opt').forEach(function (b) { var o = cur.opts[+b.dataset.v]; if (o === q[2][0]) b.classList.add('right'); else if (+b.dataset.v === cur.sel) b.classList.add('wrong'); });
  if (t === 'tf') document.querySelectorAll('.opt').forEach(function (b) { var val = +b.dataset.v === 0; if (val === q[2]) b.classList.add('right'); else if (+b.dataset.v === cur.sel) b.classList.add('wrong'); });
  if (t === 'bug') document.querySelectorAll('.line').forEach(function (b) { if (+b.dataset.v === q[3]) b.classList.add('right'); else if (+b.dataset.v === cur.sel) b.classList.add('wrong'); });
  if (t === 'order') document.querySelectorAll('#az .tok').forEach(function (b, k) { b.style.borderColor = cur.pool[cur.chosen[k]] === q[2][k] ? 'var(--good)' : 'var(--bad)'; });
  if (t === 'fill') document.querySelectorAll('.blank').forEach(function (b, k) { b.style.borderColor = cur.pool[cur.fill[k]] === q[3][k] ? 'var(--good)' : 'var(--bad)'; b.style.color = b.style.borderColor; });
  if (ok) { SFX.good(); var cb = sess.combo; if (cb >= 3) setTimeout(function () { SFX.combo(cb); }, 180); }
  else SFX.bad();
  if (sess.kind === 'boss') { var bi = $('#bossIc'); if (ok && bi) { bi.classList.add('hit'); SFX.hit(); } }
  var btn = $('[data-act="check"]'), r = btn ? btn.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight - 80 };
  floatText('+' + res.xp + ' XP', r.left + r.width / 2, r.top, ok ? 'var(--good)' : '#9aa3c7');
  var praise = ['Nice!', 'Correct!', 'Great job!', 'You got it!', 'Exactly!', 'Sharp!'];
  var extra = [];
  if (res.wasNew && ok) extra.push('🆕 New skill learned');
  if (res.promoted && !res.wasNew) extra.push('📦 Box ' + G.item(qid).b + (res.mastered ? ' · 👑 MASTERED' : ''));
  if (res.practice && ok) extra.push('🏋️ Practice (not due yet): half XP');
  if (res.shielded) extra.push('🛡️ Steady Hands kept your combo');
  if (res.requeued) extra.push('🔁 This one comes back at the end');
  if (res.dual) extra.push('🦸 +' + Math.round(res.xp / 2) + ' ' + TR[res.dual].short + ' XP');
  if (res.newTerm) extra.push('📖 Glossary: ' + res.newTerm.map(function (k) { return DD.glossary[k][0]; }).join(', '));
  if (res.shiny) extra.push('✨ Shiny question!');
  if (sess.combo >= 5 && ok && sess.combo % 5 === 0) { confetti(30); extra.push('🔥 ' + sess.combo + ' in a row!'); }
  var foot = $('#lfoot'); foot.classList.add(ok ? 'good' : 'bad');
  $('#lfootIn').innerHTML = '<div class="fb"><div class="ic">' + (ok ? '✅' : '💡') + '</div><div class="grow"><h4>' + (ok ? praise[Math.floor(Math.random() * praise.length)] : 'Not quite') + '</h4>' +
    (!ok ? '<div class="ans">Correct answer: ' + esc(G.correctText(qid)).replace(/\n/g, '<br>') + '</div>' : '') +
    '<p>' + esc(G.explanation(qid)) + '</p>' + (extra.length ? '<div class="tiny" style="margin-top:6px">' + extra.join(' · ') + '</div>' : '') + '</div></div>' +
    '<button class="btn ' + (ok ? 'green' : 'red') + ' big" data-act="continue">Continue</button>';
  header();
  if (G.levelInfo().level > lvBefore) { /* header() handles toast */ }
}
function next() { sess.i++; G.save(); showQ(); }
function quit() {
  if (!sess) return closeLesson();
  if (sess.i > 0 && !confirm('Leave this ' + (sess.kind === 'boss' ? 'boss fight? It counts as a loss.' : 'lesson? Answers so far are saved, but you lose the completion bonus.'))) return;
  if (sess.kind === 'boss' && sess.i > 0) { sess.focus = 0; G.finishSession(sess); }
  G.save(); closeLesson();
}
function finish() {
  var r = G.finishSession(sess), boss = sess.kind === 'boss';
  var trophy = boss ? (r.won ? '🏆' : '💀') : r.perfect ? '💯' : r.acc >= 0.8 ? '🎉' : '📘';
  var title = boss ? (r.won ? 'Boss defeated!' : 'Defeated… for now') : r.perfect ? 'Perfect lesson!' : 'Lesson complete!';
  var h = '<div class="lbody summary"><div class="trophy">' + trophy + '</div><h2 style="font-size:26px;margin:10px 0 4px">' + title + '</h2><div class="muted">' + esc(sess.title) + '</div>';
  if (boss && r.won) h += '<div class="card" style="margin-top:14px"><b>Promoted to ' + G.RANKS[sess.tierN].name + '!</b><div class="muted">' + (sess.tierN < 5 ? DD.tiers[sess.tierN].name + ' units are now open, and harder, better-paying tickets are available.' : 'You have beaten every boss.') + '</div></div>';
  if (boss && !r.won) h += '<div class="card" style="margin-top:14px"><div class="muted">Review the questions you missed (they are due now) and try again in 30 minutes.</div></div>';
  h += '<div class="stats3"><div class="stat"><small>XP</small><b style="color:var(--good)">+' + sess.xp + '</b></div><div class="stat"><small>Accuracy</small><b style="color:var(--acc2)">' + pct(r.acc) + '</b></div><div class="stat"><small>Insight</small><b style="color:#a78bfa">+' + sess.insight + '</b></div></div>';
  if (r.drops.length) h += r.drops.map(function (d) { return '<div class="card" style="border-color:var(--gold)"><div style="font-size:48px">' + d.ic + '</div><b>RELIC: ' + d.name + '</b><div class="muted">' + d.eff + '</div></div>'; }).join('');
  if (r.ach.length) h += '<div class="muted">🏆 ' + r.ach.map(function (a) { return a.name; }).join(', ') + '</div>';
  h += '</div><div class="lfoot"><div class="in"><button class="btn big" data-act="sumdone">Continue</button></div></div>';
  $('#overlay').innerHTML = h; cur = null;
  SFX.done(); confetti(boss && r.won ? 260 : r.perfect ? 160 : 90, boss && r.won ? ['#fbbf24', '#f59e0b', '#fde68a', '#fff'] : null);
  header();
}
function closeLesson() { sess = null; cur = null; $('#overlay').classList.add('hidden'); $('#overlay').innerHTML = ''; render(); }

// ---------------- work ----------------
var codeLines = ['function ship(feature) {', '  if (!feature.tested) {', '    return runTests(feature)', '  }', '  deploy(feature)', '}', 'const bugs = issues.filter(i => i.open)', 'git commit -m "fix: empty cart"', 'SELECT * FROM orders WHERE id = 7;', '// TODO: ask the AI for a plan', 'await fetch("/api/tickets")', 'expect(total([5,5])).toBe(10)', 'for (const t of tickets) work(t)', 'git push origin main', 'if (user?.isAdmin) showPanel()'];
function deskHTML() {
  var S = G.S; G.ensureTickets();
  var hr = new Date().getHours(), night = hr < 7 || hr >= 19;
  var scroll = codeLines.concat(codeLines).join('\n');
  var h = '<div class="desk" id="desk" style="--sky1:' + (night ? '#0b1030' : '#38bdf8') + ';--sky2:' + (night ? '#1e1b4b' : '#bae6fd') + '"><div class="win">' + (night ? '<span style="position:absolute;left:10px;top:8px">🌙</span>' : '<span style="position:absolute;left:10px;top:6px">☀️</span>') + '</div><div class="mon"><div class="scroll">' + esc(scroll) + '</div></div><div class="table"></div><div class="dev">' + G.rank().ic + '</div><div class="cup">' + (G.lv('coffee') ? '☕' : '🥤') + '</div>' + (G.lv('cat') ? '<div class="pet">🐈</div>' : G.lv('plant') ? '<div class="pet">🪴</div>' : '') + '</div>';
  h += '<div class="card"><div class="row"><div class="grow"><h3>Your developer is working</h3><div class="muted">Speed <b>' + G.workSpeed().toFixed(2) + '×</b> from 🧠 ' + G.knowledgePower() + ' knowledge power. Every question you master makes the work faster.</div></div></div>' +
    '<div class="row" style="margin-top:8px;gap:6px;flex-wrap:wrap"><span class="chip">⭐ Rep ' + fmt(S.rep) + '</span><span class="chip">🎫 Ticket Lv ' + G.repLevel() + '/' + G.ticketLevelCap() + '</span><span class="chip">🖥️ ' + G.slots() + ' slot' + (G.slots() > 1 ? 's' : '') + '</span><span class="chip">🌙 Offline ' + pct(G.offRate()) + ' · ' + dur(G.offCap()) + '</span></div></div>';
  h += '<div class="sectionTitle">Active tickets</div><div id="tickets">' + S.work.tickets.map(ticketHTML).join('') + '</div>';
  if (!G.lv('queue')) h += '<div class="tiny" style="text-align:center">Tip: the 📥 Ticket Queue office upgrade claims finished tickets for you, even while you are away.</div>';
  return h;
}
function ticketHTML(tk, i) {
  var t = TR[tk.track], p = tk.done / tk.work, sp = G.ticketSpeed(tk), left = (tk.work - tk.done) / sp * 1000;
  return '<div class="ticket ' + (tk.finished ? 'done' : '') + '" id="tk' + i + '"><div class="row"><span style="font-size:22px">' + t.icon + '</span><div class="grow"><div class="tid">' + tk.id + ' · Lv ' + tk.L + '</div><b>' + esc(tk.name) + '</b></div>' +
    (tk.finished ? '<button class="btn sm gold" data-act="claim" data-v="' + i + '">Claim 🪙' + fmt(tk.coins * G.coinMult()) + '</button>' : '<span class="tiny" id="tkl' + i + '">' + leftTxt(left) + '</span>') + '</div>' +
    '<div class="bar small" style="margin-top:8px"><i id="tkb' + i + '" style="width:' + p * 100 + '%;background:' + t.color + '"></i></div></div>';
}
function leftTxt(ms) { return ms < 6e4 ? Math.max(1, Math.ceil(ms / 1000)) + 's' : dur(ms); }
function workInfoHTML() {
  return '<div class="card"><h3>💼 How the idle desk works</h3><div class="muted" style="line-height:1.6">' +
    '• Your developer works tickets on their own, online or offline.<br>• <b>Work speed</b> grows with 🧠 knowledge power, which comes only from questions you have answered right and kept in review. Each mastered question adds a lot.<br>• Tickets in a track you have leveled go faster, at +5% per track level.<br>' +
    '• Finished tickets pay 🪙 coins and ⭐ reputation. Reputation raises ticket level, which means more coins, but the level is capped by your career tier. <b>Beat bosses to earn bigger tickets.</b><br>' +
    '• Offline work runs at ' + pct(G.offRate()) + ' of normal speed for up to ' + dur(G.offCap()) + '. Upgrades raise both.<br>• Coins buy Office gear. 💠 Insight, from answering questions, buys permanent Mastery boosts.<br>• Nothing here can level up your knowledge. Only lessons and reviews do that.</div></div>';
}
function liveWork() {
  if (tab !== 'work') return;
  var S = G.S, rerender = false;
  S.work.tickets.forEach(function (tk, i) {
    var el = $('#tk' + i); if (!el) { rerender = true; return; }
    if (tk.finished !== el.classList.contains('done')) { rerender = true; return; }
    var b = $('#tkb' + i); if (b) b.style.width = (tk.done / tk.work * 100) + '%';
    var l = $('#tkl' + i); if (l) { var left = (tk.work - tk.done) / G.ticketSpeed(tk) * 1000; l.textContent = leftTxt(left); }
  });
  if (rerender) { var tks = $('#tickets'); if (tks) tks.innerHTML = S.work.tickets.map(ticketHTML).join(''); }
}

// ---------------- upgrades ----------------
function upgHTML(list, cur_, ic) {
  var S = G.S;
  var h = '<div class="card"><h3>' + (cur_ === 'insight' ? '💠 Mastery: permanent boosts' : '🪙 Office: idle gear') + '</h3><div class="muted">' + (cur_ === 'insight' ? 'Every correct answer gives 💠 Insight. Spend it on slow, permanent boosts. None of them skip learning.' : 'Coins come from tickets your developer finishes. Gear speeds up the desk and adds comforts.') + '</div><div style="margin-top:8px;font-weight:800;font-size:18px">' + ic + ' ' + fmt(S[cur_]) + '</div></div>';
  list.forEach(function (d) {
    var L = G.lv(d.id), max = d.id === 'freeze' ? false : L >= d.max, c = G.cost(d), can = G.canBuy(d, cur_);
    var lvTxt = d.id === 'freeze' ? 'Held: ' + S.streak.freezes + '/3' : 'Lv ' + L + '/' + d.max;
    h += '<div class="upg ' + (max ? 'maxed' : '') + '"><div class="uic">' + d.ic + '</div><div class="grow"><b>' + d.name + '</b> <span class="tiny">' + lvTxt + '</span><div class="tiny">' + d.desc + '</div>' + (d.max > 1 && d.max <= 25 && d.id !== 'freeze' ? '<div class="lvlpips">' + Array.apply(null, Array(d.max)).map(function (_, k) { return '<i class="' + (k < L ? 'on' : '') + '"></i>'; }).join('') + '</div>' : '') + '</div>' +
      (max ? '<span class="tiny" style="color:var(--gold);font-weight:800">MAX</span>' : '<button class="btn sm ' + (can ? 'gold' : 'ghost off') + '" data-act="buy" data-v="' + cur_ + ':' + d.id + '">' + ic + fmt(c) + '</button>') + '</div>';
  });
  return h;
}

// ---------------- codex ----------------
function relicsHTML() {
  var h = '<div class="card"><h3>🏺 Ultra-rare relics</h3><div class="muted">Every relic is shown with its exact odds. Relics are permanent and work across your whole account. 🍀 Lucky Duck improves your odds.</div><div class="tiny" style="margin-top:6px">Found ' + G.relicCount() + '/' + G.RELICS.length + '</div></div>';
  G.RELICS.forEach(function (r) {
    var n = G.S.relics[r.id] || 0, odds = G.relicOdds(r);
    h += '<div class="relic ' + (n ? 'owned' : '') + '"><div class="ric">' + r.ic + '</div><div class="grow"><b>' + r.name + (r.id === 'shinybug' && n ? ' ×' + n : '') + '</b><div class="tiny">' + r.eff + '</div><div class="odds">' + (r.id === 'shinybug' ? 'Shiny questions: 1 in ' + G.SHINY_ODDS + ' · always drops when answered right' : '1 in ' + odds.toLocaleString() + ' ' + G.SRC_TXT[r.src] + (odds !== r.odds ? ' (base 1 in ' + r.odds.toLocaleString() + ')' : '')) + '</div></div>' + (n ? '<span style="color:var(--gold);font-weight:800">OWNED</span>' : '') + '</div>';
  });
  return h;
}
var glossFilter = '';
function glossHTML() {
  var keys = Object.keys(DD.glossary).sort(function (a, b) { return DD.glossary[a][0].localeCompare(DD.glossary[b][0]); });
  var got = keys.filter(function (k) { return G.S.gloss[k]; }).length;
  var h = '<div class="card"><h3>📖 Glossary</h3><div class="muted">Terms unlock when you answer a question in their unit correctly. Learned: ' + got + '/' + keys.length + '</div></div><input class="search" id="glossQ" placeholder="Search learned terms…" value="' + esc(glossFilter) + '">';
  h += '<div id="glossList">' + glossList() + '</div>';
  return h;
}
function glossList() {
  var keys = Object.keys(DD.glossary).sort(function (a, b) { return DD.glossary[a][0].localeCompare(DD.glossary[b][0]); });
  var f = glossFilter.toLowerCase();
  return keys.map(function (k) { var g = DD.glossary[k], has = G.S.gloss[k]; if (f && !(has && (g[0] + g[1]).toLowerCase().indexOf(f) >= 0)) return ''; return '<div class="gl ' + (has ? '' : 'lock') + '"><b>' + (has ? esc(g[0]) : '???') + '</b> ' + (has ? '<span class="muted">— ' + esc(g[1]) + '</span>' : '<span class="tiny">keep learning to reveal</span>') + '</div>'; }).join('');
}
function achHTML() {
  var got = G.ACH.filter(function (a) { return G.S.ach[a.id]; }).length;
  return '<div class="card"><h3>🏆 Achievements</h3><div class="muted">' + got + '/' + G.ACH.length + ' unlocked · each gives +10 💠</div></div>' + G.ACH.map(function (a) { var g = G.S.ach[a.id]; return '<div class="ach ' + (g ? 'got' : '') + '"><div class="aic">' + a.ic + '</div><div class="grow"><b>' + a.name + '</b><div class="tiny">' + a.desc + '</div></div>' + (g ? '✅' : '') + '</div>'; }).join('');
}

// ---------------- hero ----------------
function profileHTML() {
  var S = G.S, L = G.levelInfo(), st = S.stats;
  var h = '<div class="card trackHero" style="--tc:#22d3ee"><div class="row"><div class="avatar" style="width:64px;height:64px;font-size:38px">' + (G.lv('hat') ? '<span class="hat" style="font-size:28px;top:-18px">🎩</span>' : '') + G.rank().ic + '</div><div class="grow"><h2>' + G.rank().name + '</h2><div class="muted">Level ' + L.level + ' · ' + G.countMastered() + ' questions mastered · best streak ' + S.streak.best + '</div></div></div>' +
    '<div class="row" style="margin-top:10px;gap:4px">' + G.RANKS.map(function (r, i) { return '<div style="flex:1;text-align:center;opacity:' + (S.tier >= r.t ? 1 : .3) + '"><div style="font-size:20px">' + r.ic + '</div><div class="tiny" style="font-size:9px">' + r.name + '</div></div>'; }).join('') + '</div></div>';
  h += '<div class="sectionTitle">Classes (tracks)</div>' + DD.tracks.map(function (t) { var tl = G.trackLevel(t.id), ts = G.trackStats(t.id); return '<div class="upg"><div class="uic">' + t.icon + '</div><div class="grow"><b>' + t.cls + '</b> <span class="tiny">' + t.name + '</span><div class="bar small"><i style="width:' + tl.into / tl.need * 100 + '%;background:' + t.color + '"></i></div><div class="tiny">Lv ' + tl.level + ' · mastery ' + pct(ts.mastery) + ' · ' + ts.mastered + '/' + ts.n + ' 👑</div></div></div>'; }).join('');
  var acc = st.answered ? st.correct / st.answered : 0;
  h += '<div class="sectionTitle">Stats</div><div class="card"><div class="muted" style="line-height:1.8">Answers: <b>' + fmt(st.answered) + '</b> (' + pct(acc) + ' correct)<br>Lessons: <b>' + st.lessons + '</b> · perfect <b>' + st.perfect + '</b><br>Best combo: <b>' + st.bestCombo + '</b> · reviews <b>' + st.reviews + '</b><br>Bosses beaten: <b>' + S.tier + '</b>/5<br>Tickets finished: <b>' + fmt(st.tickets) + '</b> · coins earned <b>' + fmt(st.coinsEarned) + '</b><br>Time in lessons: <b>' + dur(st.playMs) + '</b><br>Started: ' + new Date(S.created).toLocaleDateString() + '</div></div>';
  return h;
}
function settingsHTML() {
  return '<div class="card"><h3>⚙️ Settings</h3><div class="row"><div class="grow">Sound effects</div><button class="btn sm ' + (G.S.settings.sound ? 'green' : 'ghost') + '" data-act="sound">' + (G.S.settings.sound ? '🔊 On' : '🔇 Off') + '</button></div></div>' +
    '<div class="card"><h3>💾 Save</h3><div class="muted">Progress saves automatically in this browser. Export to move it to another device.</div><div class="row" style="margin-top:10px;gap:8px"><button class="btn sm" data-act="export">Export save</button><button class="btn sm ghost" data-act="import">Import save</button></div></div>' +
    '<div class="card"><h3>❓ How learning works</h3><div class="muted" style="line-height:1.6">Each question moves through 6 memory boxes. A right answer moves it up a box and pushes it further out: 10 min, then 1 day, 3 days, 7 days, 16 days. A miss sends it back to box 1. Answering early still earns half XP but does not move it up a box. You only get there by actually remembering over time, like learning a language.<br><br>Units open one at a time in each track. Tracks open as you learn more units. Each tier ends with a boss exam that opens the next tier: Very Basic, then Beginner, Intermediate, Advanced and Expert.<br><br>' + G.ALLQ.length + ' questions in ' + DD.units.length + ' units, 11 formats, ' + Object.keys(DD.glossary).length + ' glossary terms.</div></div>' +
    '<div class="card"><h3>⚠️ Danger zone</h3><button class="btn sm red" data-act="reset">Reset all progress</button></div>';
}

// ---------------- events ----------------
document.addEventListener('click', function (e) {
  var el = e.target.closest('[data-act]'); if (!el || el.disabled) return;
  var a = el.dataset.act, v = el.dataset.v;
  if ($('#overlay').contains(el)) { act(a, v, el, e); return; }
  SFX.tap();
  if (a === 'tab') { if (tab === v) { subIdx[tab] = 0; } tab = v; render(); }
  else if (a === 'sub') { var i = +v; if (tab !== 'learn' || true) { subIdx[tab] = i; var p = $('#pages'); p.scrollTo({ left: i * p.clientWidth, behavior: 'smooth' }); document.querySelectorAll('#subnav .pill').forEach(function (b, k) { b.classList.toggle('on', k === i); }); } }
  else if (a === 'lesson') begin(G.pickLesson(v));
  else if (a === 'review') { var s = G.pickReview(v); if (!s.queue.length) { toast('Answer a few lessons first. Nothing to review yet.'); return; } begin(s); }
  else if (a === 'boss') begin(G.pickBoss(+v));
  else if (a === 'deed') { var r = G.claimDeed(v); if (r) { SFX.coin(); toast('+' + r + ' 💠 Insight'); render(); } }
  else if (a === 'claim') { var tk = G.S.work.tickets[+v], res = G.claimTicket(tk); if (res) { SFX.coin(); flyCoins(); toast('🎫 ' + esc(tk.name) + ' shipped! +' + fmt(res.coins) + ' 🪙 +' + res.rep + ' ⭐'); G.checkAch(); G.save(); render(); } }
  else if (a === 'buy') { var pr = v.split(':'), list = pr[0] === 'insight' ? G.INSIGHT_UPG : G.OFFICE_UPG, d = list.filter(function (x) { return x.id === pr[1]; })[0]; if (G.buy(d, pr[0])) { SFX.level(); toast(d.ic + ' ' + d.name + ' upgraded!'); render(); } }
  else if (a === 'sound') { G.S.settings.sound = !G.S.settings.sound; G.save(); render(); }
  else if (a === 'export') { var code = G.exportSave(); modal('<div class="bigic">💾</div><h2>Your save</h2><p class="muted">Copy this text and keep it somewhere safe.</p><textarea readonly id="expTa">' + code + '</textarea><div class="row" style="margin-top:10px;gap:8px"><button class="btn grow" data-act="copyexp">Copy</button><button class="btn ghost grow" data-act="close">Close</button></div>'); }
  else if (a === 'copyexp') { var ta = $('#expTa'); ta.select(); try { navigator.clipboard.writeText(ta.value); } catch (er) { document.execCommand('copy'); } toast('Copied!'); }
  else if (a === 'import') modal('<div class="bigic">📥</div><h2>Import save</h2><textarea id="impTa" placeholder="Paste your save here"></textarea><div class="row" style="margin-top:10px;gap:8px"><button class="btn grow" data-act="doimport">Import</button><button class="btn ghost grow" data-act="close">Cancel</button></div>');
  else if (a === 'doimport') { try { G.importSave($('#impTa').value); closeModal(); toast('Save imported!'); render(); } catch (er) { toast('❌ ' + esc(er.message)); } }
  else if (a === 'reset') { if (confirm('Reset ALL progress? This cannot be undone.')) { G.reset(); lastLevel = 0; render(); } }
  else if (a === 'close') closeModal();
});
document.addEventListener('input', function (e) { if (e.target.id === 'glossQ') { glossFilter = e.target.value; $('#glossList').innerHTML = glossList(); } });
function flyCoins() { var d = $('#desk'); if (!d) return; for (var i = 0; i < 5; i++) { var s = document.createElement('span'); s.className = 'fly'; s.textContent = '🪙'; s.style.left = (40 + Math.random() * 20) + '%'; s.style.top = '50%'; s.style.animationDelay = (i * 0.08) + 's'; d.appendChild(s); setTimeout(function (x) { x.remove(); }.bind(null, s), 1500); } }

// ---------------- hooks from engine ----------------
window.UI = {
  relicFound: function (r) { setTimeout(function () { SFX.relic(); confetti(200, ['#fbbf24', '#fde68a', '#f472b6', '#22d3ee']); toast('<span style="font-size:22px">' + r.ic + '</span> RELIC FOUND: <b>' + r.name + '</b><br><small>' + r.eff + '</small>', 'gold'); }, 300); },
  achievement: function (a) { if (sess) return; setTimeout(function () { SFX.coin(); toast(a.ic + ' Achievement: <b>' + a.name + '</b> (+10 💠)'); }, 600); },
  dailyGoal: function (rew) { setTimeout(function () { SFX.done(); confetti(120); toast('🎯 Daily goal met! 🔥 Streak ' + G.S.streak.count + ' · +' + rew + ' 💠 · +1 💡', 'gold'); }, 500); }
};

// ---------------- boot ----------------
var had = G.load();
G.rollDay();
var off = had ? G.offlineCatchup() : null;
G.ensureTickets(); G.save();
lastLevel = G.levelInfo().level;
render();
$('#pages').addEventListener('scroll', onPagesScroll, { passive: true });
window.addEventListener('resize', function () { var p = $('#pages'); p.scrollLeft = subIdx[tab] * p.clientWidth; });
$('#gateBtn').addEventListener('click', function () {
  audioInit(); SFX.done(); $('#audioGate').classList.add('hidden');
  if (!G.S.seenIntro) {
    G.S.seenIntro = true; G.save();
    modal('<div class="bigic">🐉</div><h2>Welcome, Intern</h2><p class="muted" style="text-align:left;line-height:1.55">You are starting a long career: <b>Intern → Junior → Developer → Senior → Staff Architect → AI-Native Lead</b>.<br><br>📚 <b>Learn</b>: short quiz lessons, like learning a language. Questions you miss come back sooner. Only answering grows your knowledge.<br>🔁 <b>Review</b> daily. Mastery takes weeks of spaced practice.<br>⚔️ <b>Bosses</b> are exams at the end of each tier.<br>💼 <b>Work</b>: your developer earns coins on their own, faster the more you know.<br><br>Start with <b>🧠 Thinking Like a Developer → Step by Step</b>.</p><button class="btn big" data-act="close">Let’s go</button>');
  } else if (off && (off.coins || off.n || off.away > 3e5)) {
    modal('<div class="bigic">🌅</div><h2>Welcome back!</h2><p class="muted">You were away <b>' + dur(off.away) + '</b>. Your developer worked at ' + pct(off.rate) + ' speed for ' + dur(off.capped) + '.</p><div class="stats3"><div class="stat"><small>Coins</small><b>🪙' + fmt(off.coins) + '</b></div><div class="stat"><small>Tickets</small><b>' + off.n + '</b></div><div class="stat"><small>Rep</small><b>⭐' + off.rep + '</b></div></div>' + (G.lv('queue') ? '' : '<p class="tiny">Without the 📥 Ticket Queue, finished tickets wait for you to claim them.</p>') + '<p class="muted">' + (G.allDue().length ? '🔁 <b>' + G.allDue().length + '</b> question' + (G.allDue().length === 1 ? ' is' : 's are') + ' due for review.' : '') + '</p><button class="btn big" data-act="close">Back to work</button>');
  }
});
var lastT = Date.now(), n = 0;
setInterval(function () {
  var t = Date.now(), dt = Math.min(t - lastT, 5000); lastT = t;
  var c = G.tick(dt, false); if (c.n) { G.checkAch(); if (tab === 'work') { SFX.coin(); flyCoins(); } }
  n++;
  if (n % 4 === 0) { liveWork(); if (!sess) header(); }
  if (n % 40 === 0) G.save();
}, 250);
document.addEventListener('visibilitychange', function () { if (document.hidden) G.save(); else { var o = G.offlineCatchup(); lastT = Date.now(); if (o && o.n) toast('🌅 While away: +' + fmt(o.coins) + ' 🪙 from ' + o.n + ' tickets'); if (!sess) render(); } });
window.addEventListener('pagehide', function () { G.save(); });
window.__DD = { G: G, begin: begin, act: act, get sess() { return sess; }, get cur() { return cur; }, render: render };
})();
