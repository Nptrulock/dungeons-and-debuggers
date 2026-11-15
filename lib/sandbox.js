// Dungeons & Debuggers — sandbox runners (browser). Each runner returns a Promise of a result object.
(function () {
'use strict';
var SB = window.SB = {};
var PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
var SQLJS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/';

// ---------- template filling ----------
SB.fill = function (ch, vals) { return ch.code.replace(/\{\{(\w+)\}\}/g, function (_, k) { var v = vals[k]; return v === undefined ? '' : String(v); }); };

// ---------- loop guard for JS ----------
SB.guardLoops = function (code) {
  var out = '', i = 0, n = code.length, q = null;
  while (i < n) {
    var c = code[i];
    if (q) { out += c; if (c === '\\') { out += code[i + 1] || ''; i += 2; continue; } if (c === q) q = null; i++; continue; }
    if (c === '"' || c === "'" || c === '`') { q = c; out += c; i++; continue; }
    if (c === '/' && code[i + 1] === '/') { var e = code.indexOf('\n', i); if (e < 0) e = n; out += code.slice(i, e); i = e; continue; }
    var m = /^(for|while)\b\s*\(/.exec(code.slice(i, i + 12));
    if (m && !/[\w$.]/.test(code[i - 1] || '')) {
      var j = i + m[0].length, depth = 1; while (j < n && depth) { if (code[j] === '(') depth++; else if (code[j] === ')') depth--; j++; }
      var k = j; while (k < n && /\s/.test(code[k])) k++;
      out += code.slice(i, k);
      if (code[k] === '{') { out += '{if(++__lg>2e6)throw new Error("Infinite loop? Stopped after 2,000,000 steps.");'; i = k + 1; } else i = k;
      continue;
    }
    if (code.slice(i, i + 2) === 'do' && !/[\w$]/.test(code[i - 1] || '') && /^do\s*\{/.test(code.slice(i, i + 6))) { var kk = code.indexOf('{', i); out += code.slice(i, kk + 1) + 'if(++__lg>2e6)throw new Error("Infinite loop? Stopped after 2,000,000 steps.");'; i = kk + 1; continue; }
    out += c; i++;
  }
  return out;
};
// ---------- tracer for JS debug challenges ----------
SB.instrument = function (code, watch) {
  var lines = code.split('\n'), vars = watch.map(function (v) { return '(function(){try{return ' + v + '}catch(e){return undefined}})()'; }).join(',');
  return lines.map(function (l, i) {
    var t = l.trim(), nxt = (lines[i + 1] || '').trim();
    if (!t || /^\/\//.test(t) || /^(else|\}|\)|\]|\.|case|default)/.test(t)) return l;
    if (/^(else|catch|finally)/.test(nxt) || /^\./.test(nxt)) return l;
    if (/[,(\[+\-*/=&|?:]$/.test(t) && !/\+\+$|--$/.test(t)) return l;
    if (/^(function|class|if|for|while|switch|try|do)\b/.test(t) && !/\{$/.test(t)) return l;
    var rec = '__tr(' + (i + 1) + ',[' + vars + ']);';
    if (/\{$/.test(t)) return /^(function|class)\b/.test(t) || /=>\s*\{$/.test(t) ? l : l + rec;
    if (/^return\b/.test(t)) return rec + l;
    return l + ';' + rec;
  }).join('\n');
};

// ---------- HTML / JS iframe runner ----------
var HARNESS = function () {
  var logs = [], errs = [], steps = [];
  window.__lg = 0;
  try { window.localStorage.getItem('x'); } catch (e) { var mem = {}; var ls = { getItem: function (k) { return k in mem ? mem[k] : null; }, setItem: function (k, v) { mem[k] = String(v); }, removeItem: function (k) { delete mem[k]; }, clear: function () { mem = {}; }, key: function (i) { return Object.keys(mem)[i] || null; } }; Object.defineProperty(ls, 'length', { get: function () { return Object.keys(mem).length; } }); try { Object.defineProperty(window, 'localStorage', { value: ls, configurable: true }); } catch (x) { } }
  window.alert = function (m) { console.log('[alert] ' + m); };
  function fmt(v) { try { if (typeof v === 'string') return v; if (v === undefined) return 'undefined'; if (typeof v === 'function') return 'ƒ ' + (v.name || 'anonymous') + '()'; if (v instanceof Element) return '<' + v.tagName.toLowerCase() + '>'; return JSON.stringify(v); } catch (e) { return String(v); } }
  ['log', 'info', 'warn', 'error'].forEach(function (k) { var o = console[k]; console[k] = function () { if (logs.length >= 1000) throw new Error('Stopped after 1,000 lines of output. Is a loop running forever?'); var s = [].map.call(arguments, fmt).join(' '); logs.push(s); if (logs.length <= 300) parent.postMessage({ __dd: 1, t: 'log', k: k, s: s }, '*'); else if (logs.length === 301) parent.postMessage({ __dd: 1, t: 'log', k: 'warn', s: '… (console output truncated)' }, '*'); }; });
  window.__tr = function (line, vals) { if (steps.length < 600) steps.push({ l: line, v: vals.map(fmt) }); };
  window.onerror = function (msg, src, line, col, e) { var s = (e && e.name ? e.name + ': ' + e.message : String(msg)); var off = window.__USER_LINE || 0, st = e && e.stack ? String(e.stack).split('\n').slice(1).filter(function (l) { return /about:srcdoc/.test(l) && !/HARNESS|__ddcheck/.test(l); }).map(function (l) { return l.replace(/\(?about:srcdoc:(\d+):\d+\)?/, function (_, n) { return '(line ' + (n - off) + ')'; }).trim(); }).join('\n') : ''; errs.push({ msg: s, line: line - off, stack: st }); parent.postMessage({ __dd: 1, t: 'err', s: s, line: line - off, st: st }, '*'); return true; };
  window.addEventListener('unhandledrejection', function (ev) { ev.preventDefault(); var e = ev.reason || {}; var s = (e.name ? e.name + ': ' + e.message : String(e)); errs.push({ msg: s, line: 0 }); parent.postMessage({ __dd: 1, t: 'err', s: s }, '*'); });
  var H = {
    q: function (s) { return document.querySelector(s); }, qa: function (s) { return [].slice.call(document.querySelectorAll(s)); },
    txt: function (s) { var e = document.querySelector(s); return e ? e.textContent.trim() : null; },
    css: function (s, p) { var e = document.querySelector(s); return e ? getComputedStyle(e).getPropertyValue(p).trim() : null; },
    same: function (s, p, v) { var e = document.querySelector(s); if (!e) return false; var t = document.createElement('div'); t.style.setProperty(p, v); document.body.appendChild(t); var a = getComputedStyle(t).getPropertyValue(p), b = getComputedStyle(e).getPropertyValue(p); t.remove(); return a === b; },
    box: function (s) { var e = document.querySelector(s); return e ? e.getBoundingClientRect() : null; },
    wait: function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); },
    click: function (s) { var e = document.querySelector(s); if (e) e.click(); return !!e; },
    type: function (s, v) { var e = document.querySelector(s); if (!e) return false; e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); return true; },
    key: function (s, k) { var e = document.querySelector(s) || document; e.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true })); return true; },
    count: function (s) { return document.querySelectorAll(s).length; },
    pixel: function (s, x, y) { var c = document.querySelector(s); if (!c) return null; var d = c.getContext('2d').getImageData(x, y, 1, 1).data; return [d[0], d[1], d[2], d[3]]; },
    contrast: function (s) { var e = document.querySelector(s); if (!e) return 0; function rgb(c) { var m = c.match(/[\d.]+/g) || [0, 0, 0, 0]; return m.map(Number); } function lum(c) { var a = c.slice(0, 3).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]; } var fg = rgb(getComputedStyle(e).color), bg = null, n = e; while (n && n.nodeType === 1) { var b = rgb(getComputedStyle(n).backgroundColor); if (b.length < 4 || b[3] > 0) { bg = b; break; } n = n.parentElement; } bg = bg || [255, 255, 255]; var L1 = lum(fg), L2 = lum(bg); return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05); },
    rule: function (sel) { var out = null; [].forEach.call(document.styleSheets, function (sh) { try { [].forEach.call(sh.cssRules, function walk(r) { if (r.selectorText === sel) out = r; if (r.cssRules) [].forEach.call(r.cssRules, walk); }); } catch (e) { } }); return out; },
    media: function (txt) { var out = null; [].forEach.call(document.styleSheets, function (sh) { try { [].forEach.call(sh.cssRules, function (r) { if (r.media && r.media.mediaText.replace(/\s/g, '').indexOf(txt.replace(/\s/g, '')) >= 0) out = r; }); } catch (e) { } }); return out; },
    painted: function (s) { var c = document.querySelector(s); if (!c) return 0; var d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data, n = 0; for (var i = 3; i < d.length; i += 4) if (d[i]) n++; return n; }
  };
  window.addEventListener('message', function (ev) {
    var m = ev.data; if (!m || !m.__ddcheck) return;
    var names = Object.keys(H), vals = names.map(function (k) { return H[k]; });
    var AF = Object.getPrototypeOf(async function () { }).constructor;
    (async function () {
      await H.wait(m.delay || 60);
      var res = [];
      for (var i = 0; i < m.goals.length; i++) {
        var g = m.goals[i];
        try { var an = names.concat(['logs', 'log', 'err', 'errs']).join(','), f; try { f = new AF(an, 'return (' + g + '\n);'); } catch (se) { f = new AF(an, g); } var lg = logs.join('\n'); res.push(!!(await f.apply(null, vals.concat([logs, lg, errs.length ? errs[0].msg : '', errs])))); }
        catch (e) { res.push(false); }
      }
      parent.postMessage({ __dd: 1, t: 'done', id: m.id, res: res, logs: logs, errs: errs, steps: steps }, '*');
    })();
  });
  parent.postMessage({ __dd: 1, t: 'ready' }, '*');
};
SB.buildDoc = function (ch, code) {
  var head = '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:system-ui,-apple-system,sans-serif;margin:12px;color:#111;background:#fff}</style>';
  var harness = '<script>(' + HARNESS.toString() + ')();<\/script>';
  var mock = ch.mock ? '<script>' + SB.mockFetch(ch.mock) + '<\/script>' : '';
  if (ch.sb === 'html') {
    // user owns the whole document body (may include <style> and <script>)
    var doc = '<!doctype html><html><head>' + head + harness + mock + (ch.pre ? '<script>' + ch.pre + '<\/script>' : '') + '</head><body>' + code + '</body></html>';
    return doc;
  }
  var user = ch.trace ? SB.instrument(code, ch.trace) : code;
  user = SB.guardLoops(user);
  var before = '<!doctype html><html><head>' + head + harness + mock + '</head><body>' + (ch.html || '') + (ch.pre ? '<script>' + ch.pre + '<\/script>' : '') + '<script>window.__USER_LINE=0;<\/script><script>\n';
  var lineOffset = before.split('\n').length - 1;
  return before.replace('window.__USER_LINE=0', 'window.__USER_LINE=' + lineOffset) + user + '\n<\/script></body></html>';
};
SB.mockFetch = function (routes) {
  return 'window.__calls=[];window.fetch=function(url,opt){var R=' + JSON.stringify(routes) + ';url=String(url);opt=opt||{};var meth=(opt.method||"GET").toUpperCase(),path=url.split("?")[0];window.__calls.push(meth+" "+url);var key=Object.keys(R).find(function(k){return k===meth+" "+url||k===meth+" "+path})||Object.keys(R).find(function(k){return url===k||path===k||(k.indexOf("*")>=0&&url.indexOf(k.replace("*",""))===0)});var r=key?R[key]:{status:404,body:{error:"Not found"}};if(r.auth){var hd=opt.headers||{};if(hd.Authorization!==r.auth)r={status:401,body:{error:"Unauthorized"}};}if(r.method&&r.method!==meth)r={status:405,body:{error:"Method Not Allowed"}};if(typeof r.byQuery==="object"){var qv=decodeURIComponent((url.split("=")[1]||"")).toLowerCase();r=r.byQuery[qv]||{status:404,body:{error:"City not found"}};}return new Promise(function(res){setTimeout(function(){var st=r.status||200;res({ok:st>=200&&st<300,status:st,json:function(){return Promise.resolve(JSON.parse(JSON.stringify(r.body)))},text:function(){return Promise.resolve(typeof r.body==="string"?r.body:JSON.stringify(r.body))}})},r.delay||150)})};';
};
var activeFrame = null;
SB.runFrame = function (ch, code, mount, opts) {
  opts = opts || {};
  return new Promise(function (resolve) {
    if (activeFrame && activeFrame.cleanup) activeFrame.cleanup();
    var f = document.createElement('iframe');
    f.setAttribute('sandbox', 'allow-scripts allow-modals');
    f.className = 'sbframe';
    if (opts.hidden) f.style.cssText = 'position:absolute;width:390px;height:600px;left:-9999px;top:0';
    var id = Math.random().toString(36).slice(2), done = false, liveLogs = [];
    function onMsg(ev) {
      if (ev.source !== f.contentWindow) return; var m = ev.data; if (!m || !m.__dd) return;
      if (m.t === 'log' && opts.onLog) opts.onLog(m);
      if (m.t === 'err' && opts.onLog) opts.onLog({ k: 'error', s: m.s + (m.line > 0 ? ' (line ' + m.line + ')' : '') + (m.st ? '\n' + m.st.split('\n').map(function (l) { return '    ' + l; }).join('\n') : '') });
      if (m.t === 'ready') setTimeout(function () { f.contentWindow.postMessage({ __ddcheck: 1, id: id, goals: (ch.goals || []).map(function (g) { return g[1]; }), delay: ch.delay || 80 }, '*'); }, 0);
      if (m.t === 'done' && m.id === id) { done = true; clearTimeout(to); resolve({ ok: true, res: m.res, logs: m.logs, errs: m.errs, steps: m.steps, frame: f }); }
    }
    window.addEventListener('message', onMsg);
    var to = setTimeout(function () { if (!done) { window.removeEventListener('message', onMsg); try { f.srcdoc = ''; f.remove(); } catch (e) { } resolve({ ok: false, timeout: true, res: (ch.goals || []).map(function () { return false; }), logs: [], errs: [{ msg: 'Your code took too long to finish. Is there a loop that never ends?' }], steps: [] }); } }, opts.timeout || 6000);
    activeFrame = { cleanup: function () { window.removeEventListener('message', onMsg); } };
    f.srcdoc = SB.buildDoc(ch, code);
    if (mount) { mount.innerHTML = ''; mount.appendChild(f); } else document.body.appendChild(f);
  });
};
SB.preview = function (ch, code, mount) { // just render (portfolio), no checks
  var f = document.createElement('iframe'); f.setAttribute('sandbox', 'allow-scripts allow-modals'); f.className = 'sbframe'; f.srcdoc = SB.buildDoc(Object.assign({}, ch, { goals: [] }), code); mount.innerHTML = ''; mount.appendChild(f); return f;
};

// ---------- Python (Pyodide in a Web Worker) ----------
var PY_PRELUDE = [
  'import sys, io, math, random',
  'class _Turtle:',
  '    def __init__(self):',
  '        self.x, self.y, self.h, self.down, self.col, self.w = 0.0, 0.0, 0.0, True, "#22d3ee", 3',
  '    def forward(self, d):',
  '        nx = self.x + d * math.cos(math.radians(self.h)); ny = self.y + d * math.sin(math.radians(self.h))',
  '        if self.down: _segs.append([round(self.x, 2), round(self.y, 2), round(nx, 2), round(ny, 2), self.col, self.w])',
  '        self.x, self.y = nx, ny',
  '    def backward(self, d): self.forward(-d)',
  '    def left(self, a): self.h = (self.h + a) % 360',
  '    def right(self, a): self.h = (self.h - a) % 360',
  '    def penup(self): self.down = False',
  '    def pendown(self): self.down = True',
  '    def color(self, c): self.col = c',
  '    def width(self, w): self.w = w',
  '    def goto(self, x, y):',
  '        if self.down: _segs.append([round(self.x, 2), round(self.y, 2), x, y, self.col, self.w])',
  '        self.x, self.y = x, y',
  '    fd = forward; lt = left; rt = right; bk = backward',
  '_segs = []',
  'def Turtle(): return _Turtle()',
  ''].join('\n');
SB.PY_PRELUDE = PY_PRELUDE;
var WORKER_SRC = function () {
  var py = null, loading = null;
  self.onmessage = async function (ev) {
    var m = ev.data;
    try {
      if (!py) { importScripts(m.url + 'pyodide.js'); py = await loadPyodide({ indexURL: m.url }); postMessage({ t: 'loaded' }); }
      if (m.t === 'load') return;
      try { await py.loadPackagesFromImports(m.code); if (/\bhashlib\b/.test(m.code)) await py.loadPackage('hashlib'); } catch (e) { }
      var out = [];
      py.setStdout({ batched: function (s) { out.push(s); } }); py.setStderr({ batched: function (s) { out.push(s); } });
      var ns = py.globals.get('dict')();
      py.runPython(m.prelude, { globals: ns });
      var err = null, steps = [];
      if (m.inputs) { ns.set('_inputs', py.toPy(m.inputs)); py.runPython('_it = iter(_inputs)\nimport builtins\ndef input(prompt=""):\n    v = next(_it, None)\n    if v is None:\n        raise EOFError("EOF when reading a line (the script ran out of typed input)")\n    print(str(prompt) + v)\n    return v\n', { globals: ns }); }
      if (m.trace) { ns.set('_watch', py.toPy(m.trace)); py.runPython('_steps = []\ndef _tracer(frame, event, arg):\n    if frame.f_code.co_filename == "<exec>" and event == "line" and len(_steps) < 600:\n        _steps.append([frame.f_lineno, [repr(frame.f_locals.get(v, frame.f_globals.get(v, None))) if (v in frame.f_locals or v in frame.f_globals) else "—" for v in _watch]])\n    return _tracer\n', { globals: ns }); }
      try {
        if (m.trace) { py.runPython('sys.settrace(_tracer)', { globals: ns }); }
        py.runPython(m.code, { globals: ns, filename: '<exec>' });
      } catch (e) { var s = String(e.message || e); var lines = s.trim().split('\n'); var ln = /line (\d+)/.exec(lines.filter(function (l) { return /File "<exec>"/.test(l); }).pop() || ''); err = { msg: lines[lines.length - 1], line: ln ? +ln[1] : 0, tb: lines.filter(function (l) { return !/_pyodide|pyodide\/|File "\/lib/.test(l); }).join('\n') }; }
      finally { if (m.trace) py.runPython('sys.settrace(None)', { globals: ns }); }
      if (m.trace) steps = ns.get('_steps').toJs();
      ns.set('_out', out.join('\n') + (out.length ? '\n' : ''));
      var res = m.goals.map(function (g) { try { return !!py.runPython('bool(' + g + ')', { globals: ns }); } catch (e) { return false; } });
      var segs = []; try { segs = ns.get('_segs').toJs(); } catch (e) { }
      postMessage({ t: 'done', id: m.id, out: out, err: err, res: res, segs: segs, steps: steps });
    } catch (e) { postMessage({ t: 'fatal', id: m.id, msg: String(e && e.message || e) }); }
  };
};
var pyWorker = null, pyReady = false, pyLoading = null;
function newWorker() { var blob = new Blob(['(' + WORKER_SRC.toString() + ')()'], { type: 'text/javascript' }); pyWorker = new Worker(URL.createObjectURL(blob)); pyReady = false; pyLoading = null; }
SB.pyLoad = function (onStatus) {
  if (pyReady) return Promise.resolve();
  if (pyLoading) return pyLoading;
  if (!pyWorker) newWorker();
  if (onStatus) onStatus('Loading Python (about 10 MB, first time only)…');
  pyLoading = new Promise(function (resolve, reject) {
    var to = setTimeout(function () { reject(new Error('Python could not load. Check your internet connection, then try again.')); pyWorker.terminate(); pyWorker = null; pyLoading = null; }, 90000);
    pyWorker.onmessage = function (ev) { if (ev.data.t === 'loaded') { clearTimeout(to); pyReady = true; resolve(); } else if (ev.data.t === 'fatal') { clearTimeout(to); reject(new Error('Python could not load: ' + ev.data.msg)); pyWorker.terminate(); pyWorker = null; pyLoading = null; } };
    pyWorker.onerror = function (e) { clearTimeout(to); reject(new Error('Python could not load (offline?)')); try { pyWorker.terminate(); } catch (x) { } pyWorker = null; pyLoading = null; e.preventDefault && e.preventDefault(); };
    pyWorker.postMessage({ t: 'load', url: PYODIDE_URL });
  });
  return pyLoading;
};
SB.runPy = function (ch, code, onStatus) {
  return SB.pyLoad(onStatus).then(function () {
    return new Promise(function (resolve) {
      var id = Math.random().toString(36).slice(2);
      var to = setTimeout(function () { pyWorker.terminate(); pyWorker = null; pyReady = false; resolve({ ok: false, timeout: true, out: [], err: { msg: 'Your program ran for more than 8 seconds and was stopped. Is a loop running forever?' }, res: (ch.goals || []).map(function () { return false; }), segs: [] }); }, 8000);
      pyWorker.onmessage = function (ev) { var m = ev.data; if (m.id !== id) return; clearTimeout(to); if (m.t === 'fatal') resolve({ ok: false, out: [], err: { msg: m.msg }, res: (ch.goals || []).map(function () { return false; }), segs: [] }); else resolve({ ok: true, out: m.out, err: m.err, res: m.res, segs: m.segs, steps: m.steps }); };
      pyWorker.postMessage({ t: 'run', id: id, url: PYODIDE_URL, prelude: PY_PRELUDE, code: code, goals: (ch.goals || []).map(function (g) { return g[1]; }), trace: ch.trace || null, inputs: ch.inputs || null });
    });
  });
};

// goal text: an expression, or a function body if it does not parse as one
SB.goalFn = function (args, g) { try { return new Function(args.join(','), 'return (' + g + '\n);'); } catch (e) { return new Function(args.join(','), g); } };
// ---------- SQL (sql.js) ----------
var SQL = null, sqlLoading = null;
SB.sqlLoad = function (onStatus) {
  if (SQL) return Promise.resolve(SQL);
  if (sqlLoading) return sqlLoading;
  if (onStatus) onStatus('Loading SQLite…');
  sqlLoading = new Promise(function (resolve, reject) {
    var s = document.createElement('script'); s.src = SQLJS_URL + 'sql-wasm.js';
    s.onload = function () { window.initSqlJs({ locateFile: function (f) { return SQLJS_URL + f; } }).then(function (S) { SQL = S; resolve(S); }, function (e) { sqlLoading = null; reject(new Error('SQLite could not load: ' + e.message)); }); };
    s.onerror = function () { sqlLoading = null; reject(new Error('SQLite could not load. Check your internet connection.')); };
    document.head.appendChild(s);
  });
  return sqlLoading;
};
SB.runSql = function (ch, code, onStatus) {
  return SB.sqlLoad(onStatus).then(function (S) {
    var db = new S.Database(), err = null, results = [];
    try { if (ch.setup) db.run(ch.setup); } catch (e) { err = { msg: 'Setup error: ' + e.message }; }
    if (!err) try { results = db.exec(code); } catch (e) { err = { msg: e.message }; }
    var last = results.length ? results[results.length - 1] : { columns: [], values: [] };
    var q1 = function (sql) { try { var r = db.exec(sql); return r.length ? r[0].values : []; } catch (e) { return null; } };
    var res = (ch.goals || []).map(function (g) { try { return !!(SB.goalFn(['res', 'rows', 'cols', 'q1', 'err', 'all'], g[1]))(last, last.values, last.columns, q1, err ? err.msg : '', results); } catch (e) { return false; } });
    var tables = q1("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name") || [];
    db.close();
    return { ok: true, results: results, err: err, res: res, tables: tables.map(function (r) { return r[0]; }) };
  });
};

// ---------- Git ----------
SB.newGit = function (ch) { var g = new window.GitSim(); g.setup(ch.git && ch.git.setup); return g; };
SB.checkGit = function (ch, g) {
  var repo = g.repoFor(), last = g.lastOut || '';
  return (ch.goals || []).map(function (goal) { try { return !!(SB.goalFn(['g', 'repo', 'gh', 'fs', 'hist', 'last', 'cwd'], goal[1]))(g, repo, g.gh, g.fs, g.history, last, g.cwd); } catch (e) { return false; } });
};

// ---------- compiled (pre-recorded from real compilers) ----------
SB.runCompiled = function (ch, vals) {
  var key = ch.id + '|' + Object.keys(ch.slots || {}).sort().map(function (k) { return vals[k]; }).join('|');
  var r = (window.COMPILED || {})[key];
  if (!r) return { ok: false, missing: true, res: (ch.goals || []).map(function () { return false; }), out: '', err: 'This combination was not pre-recorded.' };
  var res = (ch.goals || []).map(function (g) { try { return !!(SB.goalFn(['ok', 'out', 'err', 'phase', 'src'], g[1]))(r.ok, r.out, r.err, r.phase, SB.fill(ch, vals)); } catch (e) { return false; } });
  return { ok: true, compiled: r, res: res };
};
})();
