// Drills: JavaScript, Web & APIs, Debugging, Ops, Security
(function (root) {
var DR = root.DRILLS, D = DR.D, J = DR.J, Q = DR.Q;
var WORDS = ['Hello', 'Ready', 'Victory', 'Saved', 'Done', 'Welcome', 'Launch', 'Online'];
var PEOPLE = ['Ava', 'Bo', 'Cy', 'Dee', 'Eli', 'Fay', 'Gus', 'Hana', 'Ivy', 'Kai', 'Lena', 'Milo', 'Nia', 'Omar'];
function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }

D({ id: 'js.string', t: 'js', sb: 'js', from: ['j-log'], name: 'Strings vs names', icon: '👋', gen: function (R) {
  var w = R.pick(WORDS);
  return { tag: 'Print ' + w, code: 'console.log({{a}});', slots: { a: R.opts(Q(w), [w, w + '()', "'" + w, w.toLowerCase(), '"' + w.toLowerCase() + '"']) }, sol: { a: Q(w) }, view: 'console',
    goals: [['The console shows ' + w, 'log===' + Q(w)]], explain: 'Text needs quotes to be a **string**. A bare word is a variable name (ReferenceError), and capitalization matters.' };
} });
D({ id: 'js.precedence', t: 'js', sb: 'js', from: ['j-math'], name: 'Operator precedence', icon: '🍕', gen: function (R) {
  var a = R.int(2, 9), b = R.int(2, 9), c = R.int(2, 9);
  var F = [['(a + b) * c', 'Add ' + a + ' and ' + b + ', then multiply by ' + c], ['a + b * c', 'Multiply ' + b + ' by ' + c + ', then add ' + a], ['a * (b + c)', 'Multiply ' + a + ' by the sum of ' + b + ' and ' + c], ['a * b + c', 'Multiply ' + a + ' by ' + b + ', then add ' + c]];
  var ev = function (f) { return eval(f.replace(/a/g, a).replace(/b/g, b).replace(/c/g, c)); };
  var t = R.pick(F), tv = ev(t[0]); var wr = F.filter(function (f) { return ev(f[0]) !== tv; }).map(function (f) { return f[0]; }).concat(['a + b + c']);
  var sub = function (f) { return f.replace(/a/g, a).replace(/b/g, b).replace(/c/g, c); };
  return { tag: t[1] + '. Print it.', code: 'console.log({{e}});', slots: { e: R.opts(sub(t[0]), wr.map(sub).filter(function (x) { return eval(x) !== tv; })) }, sol: { e: sub(t[0]) }, view: 'console',
    goals: [['Prints ' + tv, 'log===' + Q(String(tv))]], explain: '`*` and `/` bind tighter than `+` and `-`. Parentheses force the order you mean.' };
} });
D({ id: 'js.types', t: 'js', sb: 'js', from: ['j-concat'], name: 'String to number', icon: '🔢', gen: function (R) {
  var n = R.int(10, 90), k = R.int(1, 9);
  return { tag: 'Print ' + n + ' + ' + k + ' (the input is text)', code: J('const input = "' + n + '";', 'console.log({{e}} + ' + k + ');'), slots: { e: R.opts('Number(input)', ['input', '"input"', 'input.length', 'String(input)']) }, sol: { e: 'Number(input)' }, view: 'console',
    goals: [['Prints ' + (n + k), 'log===' + Q(String(n + k))]], explain: '`"' + n + '" + ' + k + '` glues text: `"' + n + k + '"`. Convert first with `Number(input)` (or `parseInt`).' };
} });
D({ id: 'js.if', t: 'js', sb: 'js', from: ['j-if'], name: 'Comparisons', icon: '🔀', gen: function (R) {
  var v = R.pick(['age', 'score', 'temp', 'count', 'speed', 'level']), k = R.int(5, 60);
  var ops = [['>=', 'at least'], ['>', 'more than'], ['<', 'less than'], ['<=', 'at most'], ['===', 'exactly']], op = R.pick(ops);
  var f = function (o, x) { return o === '>=' ? x >= k : o === '>' ? x > k : o === '<' ? x < k : o === '<=' ? x <= k : x === k; };
  var g = [k - 1, k, k + 1].map(function (x) { return 'check(' + x + ')===' + f(op[0], x); }).join(' && ');
  return { tag: 'Return true when ' + v + ' is ' + op[1] + ' ' + k, code: J('function check(' + v + ') {', '  return ' + v + ' {{op}} ' + k + ';', '}'), slots: { op: R.opts(op[0], ops.map(function (o) { return o[0]; }).concat(['!=='])) }, sol: { op: op[0] }, view: 'console',
    goals: [['Right answer for ' + (k - 1) + ', ' + k + ' and ' + (k + 1), g]], explain: '`>` excludes the boundary, `>=` includes it. Always test the exact boundary value (' + k + ').' };
} });
D({ id: 'js.for', t: 'js', sb: 'js', from: ['j-for'], name: 'for loops', icon: '🔁', gen: function (R) {
  var a = R.int(0, 6), b = a + R.int(3, 6);
  return { tag: 'Loop ' + a + '–' + b + ', print each', code: J('for (let i = {{s}}; i {{c}} ' + b + '; i++) {', '  console.log(i);', '}'), slots: { s: R.opts(a, [a + 1, a - 1, a + 2]), c: R.opts('<=', ['<', '>=', '>', '==']) }, sol: { s: a, c: '<=' }, view: 'console',
    goals: [['Prints ' + a + ' through ' + b, 'logs.join(",")===' + Q(range(a, b).join(','))]], explain: 'Start at the first value; `<=` includes the last one, `<` stops one short.' };
} });
D({ id: 'js.offbyone', t: 'js', sb: 'js', from: ['d-off1'], name: 'Off-by-one', icon: '1️⃣', gen: function (R) {
  var nm = R.pick(['prices', 'scores', 'steps', 'votes']), arr = R.distinct(R.int(4, 6), 1, 30), sum = arr.reduce(function (s, x) { return s + x; }, 0), bugA = R.f() < 0.5;
  return { tag: 'Fix the off-by-one: total the ' + nm, code: J('const ' + nm + ' = ' + Q(arr).replace(/,/g, ', ') + ';', 'let total = 0;', 'for (let i = {{s}}; i {{c}} ' + nm + '.length; i++) {', '  total += ' + nm + '[i];', '}', 'console.log(total);'),
    slots: { s: { o: [0, 1], s: bugA ? 0 : 1 }, c: { o: ['<=', '<'], s: bugA ? 0 : 1 } }, sol: { s: 0, c: '<' }, view: 'console',
    goals: [['Prints ' + sum, 'log===' + Q(String(sum))]], explain: 'Indexes run from `0` to `length - 1`. `i <= length` reads one past the end (`undefined`, so NaN); starting at 1 skips the first item.' };
} });
D({ id: 'js.index', t: 'js', sb: 'js', from: ['j-array'], name: 'Array indexes', icon: '📚', gen: function (R) {
  var nm = R.pick(['fruits', 'planets', 'colors', 'pets']), items = R.sample(['apple', 'pear', 'kiwi', 'plum', 'mango', 'lime', 'fig', 'date'], 5), w = R.pick([0, 1, 2, 'last']);
  var corr = w === 'last' ? nm + '.length - 1' : w, wr = w === 'last' ? [nm + '.length', '-1', '5', 'last'] : [w + 1, w + 2, w === 0 ? -1 : w - 1, 'first'];
  var ans = w === 'last' ? items[4] : items[w];
  return { tag: 'Print the ' + (w === 'last' ? 'last' : ['first', 'second', 'third'][w]) + ' item', code: J('const ' + nm + ' = ' + Q(items).replace(/,/g, ', ') + ';', 'console.log(' + nm + '[{{i}}]);'), slots: { i: R.opts(corr, wr) }, sol: { i: corr }, view: 'console',
    goals: [['Prints ' + ans, 'log===' + Q(ans)]], explain: 'Arrays count from 0, so the n-th item is at `n - 1` and the last is at `length - 1`. Out-of-range indexes give `undefined`, not an error.' };
} });
D({ id: 'js.filter', t: 'js', sb: 'js', from: ['j-filter'], name: 'filter', icon: '🧹', gen: function (R) {
  var k = R.int(10, 40), nums = R.shuffle(R.distinct(5, 1, 60).concat([k]));
  var T = [['n > ' + k, 'above ' + k], ['n < ' + k, 'below ' + k], ['n % 2 === 0', 'even'], ['n >= ' + k, k + ' or more']], t = R.pick(T);
  var ev = function (c) { return nums.filter(function (n) { return eval(c); }).join(','); }, want = ev(t[0]);
  var wr = T.map(function (x) { return x[0]; }).concat(['n = ' + k, 'n % 2']).filter(function (c) { try { return ev(c) !== want; } catch (e) { return true; } });
  return { tag: 'Keep only the ' + (t[1].indexOf(' or more') > 0 ? 'numbers ' + t[1] : t[1] === 'even' ? 'even numbers' : 'numbers ' + t[1]), code: J('const nums = ' + Q(nums).replace(/,/g, ', ') + ';', 'const out = nums.filter(n => {{c}});', 'console.log(out.join(","));'), slots: { c: R.opts(t[0], wr) }, sol: { c: t[0] }, view: 'console',
    goals: [['Prints ' + (want || '(nothing)'), 'log===' + Q(want)]], explain: '`filter` keeps each item for which the arrow function returns true. Watch the boundary: `>` vs `>=`.' };
} });
D({ id: 'js.map', t: 'js', sb: 'js', from: ['j-filter', 'todo-2'], name: 'map', icon: '🗺️', gen: function (R) {
  var nums = R.distinct(4, 3, 12), k = R.int(3, 9);
  var T = [['n * 2', 'Double'], ['n + ' + k, 'Add ' + k + ' to'], ['n * n', 'Square'], ['n - 1', 'Subtract 1 from']], t = R.pick(T);
  var ev = function (e) { return nums.map(function (n) { return eval(e); }).join(','); }, want = ev(t[0]);
  var wr = T.map(function (x) { return x[0]; }).concat(['n', 'n + 2', 'n * ' + k]).filter(function (e) { return ev(e) !== want; });
  return { tag: t[1] + ' every number', code: J('const nums = ' + Q(nums).replace(/,/g, ', ') + ';', 'console.log(nums.map(n => {{e}}).join(","));'), slots: { e: R.opts(t[0], wr) }, sol: { e: t[0] }, view: 'console',
    goals: [['Prints ' + want, 'log===' + Q(want)]], explain: '`map` builds a new array by applying the function to every item; the array keeps its length.' };
} });
D({ id: 'js.func', t: 'js', sb: 'js', from: ['j-func'], name: 'return', icon: '🧩', gen: function (R) {
  var F = R.pick([['area', 'a * b', function (a, b) { return a * b; }], ['perimeter', '2 * (a + b)', function (a, b) { return 2 * (a + b); }], ['average', '(a + b) / 2', function (a, b) { return (a + b) / 2; }], ['total', 'a + b', function (a, b) { return a + b; }]]);
  var x = R.int(2, 9), y = R.int(2, 9) * 2;
  return { tag: 'Make ' + F[0] + '(' + x + ', ' + y + ') return ' + F[2](x, y), code: J('function ' + F[0] + '(a, b) {', '  {{r}} ' + F[1] + ';', '}'), slots: { r: R.opts('return', ['console.log', 'print', '', 'output', 'yield']) }, sol: { r: 'return' }, view: 'console',
    goals: [[F[0] + '(' + x + ', ' + y + ') is ' + F[2](x, y), F[0] + '(' + x + ',' + y + ')===' + F[2](x, y) + ' && ' + F[0] + '(1,3)===' + F[2](1, 3)]], explain: 'A function hands a value back with `return`. Without it, the call evaluates to `undefined`, even if the math ran.' };
} });
D({ id: 'js.object', t: 'js', sb: 'js', from: ['j-obj'], name: 'Object properties', icon: '🗂️', gen: function (R) {
  var u = { name: R.pick(PEOPLE), city: R.pick(['Detroit', 'Lagos', 'Oslo', 'Lima', 'Kyoto']), age: R.int(18, 70) }, key = R.pick(['name', 'city', 'age']);
  return { tag: 'Print the user’s ' + key, code: J('const user = { name: ' + Q(u.name) + ', city: ' + Q(u.city) + ', age: ' + u.age + ' };', 'console.log(user{{a}});'), slots: { a: R.opts('.' + key, ['[' + key + ']', '.' + key[0].toUpperCase() + key.slice(1), '->' + key, '.' + key + 's', '(' + key + ')']) }, sol: { a: '.' + key }, view: 'console',
    goals: [['Prints ' + u[key], 'log===' + Q(String(u[key]))]], explain: 'Read a property with `user.' + key + '` (or `user["' + key + '"]`). Names are case-sensitive; `user[' + key + ']` looks for a variable called ' + key + '.' };
} });
D({ id: 'js.dom', t: 'js', sb: 'js', from: ['j-dom'], name: 'DOM select and change', icon: '🌳', gen: function (R) {
  var id = R.pick(['status', 'title', 'msg', 'score', 'banner']), t = R.pick(['Saved!', 'Game over', 'You win', 'Loading…', 'Hi Noah']);
  return { tag: 'Make the #' + id + ' element say “' + t + '”', html: '<p id="' + id + '">old text</p>', code: 'document.{{m}}.textContent = ' + Q(t) + ';',
    slots: { m: R.opts('getElementById("' + id + '")', ['querySelector("' + id + '")', 'getElementById("#' + id + '")', 'getElementsByClassName("' + id + '")', 'body("' + id + '")']) }, sol: { m: 'getElementById("' + id + '")' },
    goals: [['#' + id + ' says ' + t, "txt('#" + id + "')===" + Q(t)]], explain: '`getElementById("' + id + '")` takes the bare id. `querySelector` takes a CSS selector, so it needs `"#' + id + '"`.' };
} });
D({ id: 'js.event', t: 'js', sb: 'js', from: ['j-event'], name: 'Events', icon: '👆', gen: function (R) {
  if (R.f() < 0.5) {
    var n = R.int(2, 4), clicks = []; for (var i = 0; i < n; i++) clicks.push("click('button');");
    return { tag: 'Count clicks on the button', html: '<button>+1</button> <b id="out">0</b>', code: J('const btn = document.querySelector("button");', 'const out = document.querySelector("#out");', 'let n = 0;', 'btn.addEventListener("{{e}}", () => {', '  n++;', '  out.textContent = n;', '});'),
      slots: { e: R.opts('click', ['hover', 'press', 'load', 'tap', 'input']) }, sol: { e: 'click' },
      goals: [['After ' + n + ' clicks it shows ' + n, clicks.join('') + " await wait(30); return txt('#out')==='" + n + "'"]], explain: 'The event name for a tap or mouse click is `click`. Unknown names like `tap` never fire, and no error tells you.' };
  }
  var w = R.pick(['hello', 'coffee', 'debug', 'pixels']);
  return { tag: 'Show the length as the user types', html: '<input> <b id="out">0</b>', code: J('const box = document.querySelector("input");', 'const out = document.querySelector("#out");', 'box.addEventListener("{{e}}", () => {', '  out.textContent = box.value.length;', '});'),
    slots: { e: R.opts('input', ['click', 'submit', 'type', 'hover', 'load']) }, sol: { e: 'input' },
    goals: [['Typing “' + w + '” shows ' + w.length, "type('input'," + Q(w) + "); await wait(30); return txt('#out')==='" + w.length + "'"]], explain: '`input` fires on every change to a text field. `click` only fires on clicks, `submit` on forms.' };
} });
D({ id: 'js.template', t: 'js', sb: 'js', from: ['j-template'], name: 'Template literals', icon: '🧵', gen: function (R) {
  var v = R.pick(['who', 'name', 'player', 'user']), p = R.pick(PEOPLE), gr = R.pick(['Hi', 'Welcome back', 'Good luck', 'Hello']);
  return { tag: 'Print “' + gr + ', ' + p + '!” with a template', code: J('const ' + v + ' = ' + Q(p) + ';', 'console.log({{q}}' + gr + ', ${' + v + '}!{{q}});'), slots: { q: R.opts('`', ['"', "'"]) }, sol: { q: '`' }, view: 'console',
    goals: [['Prints ' + gr + ', ' + p + '!', 'log===' + Q(gr + ', ' + p + '!')]], explain: 'Only backticks make a template literal, where `${...}` is replaced by the value. In normal quotes `${' + v + '}` is just text.' };
} });
D({ id: 'js.json', t: 'js', sb: 'js', from: ['j-json'], name: 'JSON.parse', icon: '📦', gen: function (R) {
  var o = { city: R.pick(['Paris', 'Accra', 'Quito']), temp: R.int(-5, 35), user: R.pick(PEOPLE) }, key = R.pick(['city', 'temp', 'user']);
  return { tag: 'Print the ' + key + ' from the JSON text', code: J("const raw = '" + JSON.stringify(o) + "';", 'const data = {{f}}(raw);', 'console.log(data.' + key + ');'), slots: { f: R.opts('JSON.parse', ['JSON.stringify', 'String', 'Object', 'JSON.read']) }, sol: { f: 'JSON.parse' }, view: 'console',
    goals: [['Prints ' + o[key], 'log===' + Q(String(o[key]))]], explain: 'JSON arrives as text. `JSON.parse` turns text into an object; `JSON.stringify` goes the other way.' };
} });
D({ id: 'js.sort', t: 'js', sb: 'js', from: ['j-sort'], name: 'Numeric sort', icon: '📶', gen: function (R) {
  var nums = R.shuffle([R.int(2, 9), R.int(10, 39), R.int(100, 400), R.int(40, 99), R.int(1000, 3000)]), up = R.f() < 0.5;
  var want = nums.slice().sort(function (a, b) { return up ? a - b : b - a; }).join(',');
  var c = up ? '(a, b) => a - b' : '(a, b) => b - a';
  return { tag: 'Sort the numbers ' + (up ? 'smallest first' : 'largest first'), code: J('const nums = ' + Q(nums).replace(/,/g, ', ') + ';', 'nums.sort({{c}});', 'console.log(nums.join(","));'), slots: { c: R.opts(c, ['', up ? '(a, b) => b - a' : '(a, b) => a - b', '(a, b) => a + b']) }, sol: { c: c }, view: 'console',
    goals: [['Prints ' + want, 'log===' + Q(want)]], explain: 'With no comparator, `sort` compares items as **text**, so 1000 sorts before 9. `(a, b) => a - b` sorts numbers ascending; `b - a` descending.' };
} });
D({ id: 'js.eq', t: 'js', sb: 'js', from: ['j-eq'], name: 'Strict equality', icon: '⚖️', gen: function (R) {
  var k = R.int(1, 99), fn = R.pick(['isWinner', 'isTarget', 'matches']);
  return { tag: 'Return true only for the number ' + k + ' (not the string "' + k + '")', code: J('function ' + fn + '(x) {', '  return x {{op}} ' + k + ';', '}'), slots: { op: R.opts('===', ['==', '=', '!=', '>=']) }, sol: { op: '===' }, view: 'console',
    goals: [['Number ' + k + ' → true, "' + k + '" → false', fn + '(' + k + ')===true && ' + fn + '("' + k + '")===false && ' + fn + '(' + (k + 1) + ')===false']], explain: '`==` converts types first, so `"' + k + '" == ' + k + '` is true. `===` also compares the type. A single `=` assigns.' };
} });
D({ id: 'js.float', t: 'js', sb: 'js', from: ['j-float'], name: 'Floating point', icon: '🫧', gen: function (R) {
  var p = R.pick([[0.1, 0.2, 0.3], [0.1, 0.7, 0.8], [0.2, 0.4, 0.6], [0.3, 0.6, 0.9], [0.7, 0.1, 0.8]]);
  return { tag: 'Check that ' + p[0] + ' + ' + p[1] + ' equals ' + p[2] + ' (print true)', code: J('const a = ' + p[0] + ', b = ' + p[1] + ';', 'console.log({{e}});'), slots: { e: R.opts('Math.abs(a + b - ' + p[2] + ') < 1e-9', ['a + b === ' + p[2], 'a + b == ' + p[2], '(a + b).equals(' + p[2] + ')']) }, sol: { e: 'Math.abs(a + b - ' + p[2] + ') < 1e-9' }, view: 'console',
    goals: [['Prints true', "log==='true'"]], explain: 'Binary floating point cannot store ' + p[0] + ' exactly, so the sum is off by a tiny amount. Compare with a tolerance: `Math.abs(x - y) < 1e-9`.' };
} });

// ---------- Web & APIs ----------
D({ id: 'api.await', t: 'api', sb: 'js', from: ['a-await'], name: 'await fetch', icon: '⏳', gen: function (R) {
  var e = R.pick([['/api/joke', { punchline: 'Because light attracts bugs.' }, 'punchline'], ['/api/user', { name: R.pick(PEOPLE) }, 'name'], ['/api/weather', { temp: R.int(-5, 35) }, 'temp'], ['/api/quote', { author: 'Ada Lovelace' }, 'author']]);
  var mock = {}; mock[e[0]] = { body: e[1] };
  var aw = { o: ['', 'await '], l: ['(nothing)', 'await'] }, s1 = R.int(0, 2);
  return { tag: 'Print the ' + e[2] + ' from ' + e[0], mock: mock, view: 'console', delay: 500, code: J('async function main() {', '  const res = {{a1}}fetch("' + e[0] + '");', '  const data = {{a2}}res.json();', '  console.log(data.' + e[2] + ');', '}', 'main();'),
    slots: { a1: { o: aw.o, l: aw.l, s: s1 === 1 ? 1 : 0 }, a2: { o: aw.o, l: aw.l, s: s1 === 1 ? 0 : s1 === 2 ? 1 : 0 } }, sol: { a1: 'await ', a2: 'await ' },
    goals: [['Prints ' + e[1][e[2]], 'log===' + Q(String(e[1][e[2]]))]], explain: '`fetch()` and `res.json()` both return promises. `await` each one to get the actual value.' };
} });
D({ id: 'api.status', t: 'api', sb: 'js', from: ['a-status'], name: 'Check res.ok', icon: '🚦', gen: function (R) {
  var good = R.int(2, 50), bad = R.int(60, 999), nm = R.pick(PEOPLE), msg = R.pick(['Not found', 'No such user', 'Missing']);
  var mock = {}; mock['/api/users/' + good] = { body: { name: nm } }; mock['/api/users/' + bad] = { status: 404, body: { error: 'User not found' } };
  return { tag: 'Return “' + msg + '” when the user does not exist', mock: mock, view: 'console', delay: 400, code: J('async function load(id) {', '  const res = await fetch("/api/users/" + id);', '  if ({{c}}) return ' + Q(msg) + ';', '  const u = await res.json();', '  return u.name;', '}'),
    slots: { c: R.opts('!res.ok', ['res.ok', '!res', 'res.status === 200', 'res.error']) }, sol: { c: '!res.ok' },
    goals: [['Existing user → ' + nm, '(await load(' + good + '))===' + Q(nm)], ['Missing user → ' + msg, '(await load(' + bad + '))===' + Q(msg)]], explain: 'A 404 still resolves the promise. Check `res.ok` (true for 200–299) or `res.status` before using the body.' };
} });
D({ id: 'api.method', t: 'api', sb: 'js', from: ['a-post'], name: 'HTTP methods', icon: '📮', gen: function (R) {
  var id = R.int(2, 90), v = R.pick([['POST', '/api/notes', 201, 'Create a note'], ['DELETE', '/api/notes/' + id, 204, 'Delete note ' + id], ['PUT', '/api/notes/' + id, 200, 'Replace note ' + id], ['GET', '/api/notes/' + id, 200, 'Read note ' + id]]);
  var mock = {}; mock[v[0] + ' ' + v[1]] = { status: v[2], body: {} };
  return { tag: v[3] + ' (expect ' + v[2] + ')', mock: mock, view: 'console', delay: 400, code: J('async function go() {', '  const res = await fetch("' + v[1] + '", { method: "{{m}}" });', '  console.log(res.status);', '  return res.status;', '}', 'go();'),
    slots: { m: R.opts(v[0], ['GET', 'POST', 'PUT', 'DELETE', 'SEND', 'REMOVE']) }, sol: { m: v[0] },
    goals: [['The server answers ' + v[2], '(await go())===' + v[2]]], explain: 'REST: **GET** reads, **POST** creates (201), **PUT** replaces, **DELETE** removes (often 204 No Content).' };
} });
D({ id: 'api.auth', t: 'api', sb: 'js', from: ['a-auth'], name: 'Authorization header', icon: '🔑', gen: function (R) {
  var tok = 'tok-' + R.int(1000, 9999), nm = R.pick(PEOPLE);
  return { tag: 'Send the token so /api/me answers', mock: { '/api/me': { auth: 'Bearer ' + tok, body: { name: nm } } }, view: 'console', delay: 400,
    code: J('async function me() {', '  const res = await fetch("/api/me", {', '    headers: { {{h}}: "{{p}}' + tok + '" }', '  });', '  const data = await res.json();', '  console.log(data.name);', '}', 'me();'),
    slots: { h: R.opts('Authorization', ['Auth', 'Token', 'X-Bearer', 'Password']), p: R.opts('Bearer ', ['', 'Token ', 'Basic ']) }, sol: { h: 'Authorization', p: 'Bearer ' },
    goals: [['Prints ' + nm, 'log===' + Q(nm)]], explain: 'APIs usually expect `Authorization: Bearer <token>`. A wrong header name or scheme gets 401 Unauthorized.' };
} });
D({ id: 'api.query', t: 'api', sb: 'js', from: ['a-query'], name: 'Encode query values', icon: '❓', gen: function (R) {
  var q = R.pick(['R&D', 'C#', 'salt & pepper', 'rock&roll', 'A+B', 'New York', 'café crème', '50% off']), n = R.int(2, 40);
  var mock = {}; mock['/api/search?q=' + encodeURIComponent(q)] = { body: { count: n } };
  return { tag: 'Search the API for “' + q + '”', mock: mock, view: 'console', delay: 400, code: J('async function search(text) {', '  const res = await fetch("/api/search?q=" + {{e}});', '  const data = await res.json();', '  console.log(data.count);', '}', 'search(' + Q(q) + ');'),
    slots: { e: R.opts('encodeURIComponent(text)', ['text', '"text"', 'text.trim()', 'String(text)']) }, sol: { e: 'encodeURIComponent(text)' },
    goals: [['Prints ' + n + ' results', 'log===' + Q(String(n))]], explain: 'Characters like `&`, `#`, `+`, `%` and spaces mean something in URLs. `encodeURIComponent` escapes them so the server sees the exact text.' };
} });

// ---------- Debug & Test ----------
D({ id: 'dbg.ref', t: 'dbg', sb: 'js', from: ['d-ref'], name: 'ReferenceError', icon: '🚩', gen: function (R) {
  var nm = R.pick(['total', 'count', 'price', 'score', 'width']), v = R.int(3, 40), typo = [nm + 's', nm.slice(0, -1), nm[0].toUpperCase() + nm.slice(1), nm.slice(0, 2) + nm.slice(3)];
  return { tag: 'Fix the ReferenceError', view: 'console', code: J('const ' + nm + ' = ' + v + ';', 'console.log({{v}} * 2);'), slots: { v: R.opts(nm, typo) }, sol: { v: nm },
    goals: [['Prints ' + (v * 2) + ' with no error', 'log===' + Q(String(v * 2)) + ' && !err']], explain: '`ReferenceError: X is not defined` means the name does not exist in scope. Usually a typo or wrong capitalization.' };
} });
D({ id: 'dbg.undef', t: 'dbg', sb: 'js', from: ['d-undef'], name: 'Cannot read properties of undefined', icon: '🕳️', gen: function (R) {
  var a = R.pick(['customer', 'user', 'owner']), b = R.pick(['address', 'location', 'home']), c = R.pick(['city', 'zip', 'country']), val = R.pick(['Detroit', '48201', 'Ghana', 'Lyon']);
  var corr = '.' + a + '.' + b + '.' + c;
  return { tag: 'Fix the TypeError: print the ' + c, view: 'console', code: J('const order = { ' + a + ': { ' + b + ': { ' + c + ': ' + Q(val) + ' } } };', 'console.log(order{{p}});'),
    slots: { p: R.opts(corr, ['.' + b + '.' + c, '.' + a + '.' + c, '.' + c, '.' + a + '[' + c + ']']) }, sol: { p: corr },
    goals: [['Prints ' + val, 'log===' + Q(val) + ' && !err']], explain: '“Cannot read properties of undefined” means a step in the chain did not exist. Walk the path one level at a time: order → ' + a + ' → ' + b + ' → ' + c + '.' };
} });
D({ id: 'dbg.test', t: 'dbg', sb: 'js', from: ['d-test1'], name: 'Make the tests pass', icon: '✅', gen: function (R) {
  var T = R.pick([
    { fn: 'isAdult(age)', body: 'return age {{x}} 18;', o: ['>=', '>', '<', '==='], s: '>=', tests: ['isAdult(18) === true', 'isAdult(17) === false', 'isAdult(40) === true'] },
    { fn: 'last(list)', body: 'return list[{{x}}];', o: ['list.length - 1', 'list.length', '-1', '0'], s: 'list.length - 1', tests: ['last([1, 2, 3]) === 3', 'last(["a"]) === "a"', 'last([]) === undefined'] },
    { fn: 'isEmpty(text)', body: 'return text{{x}} === 0;', o: ['.trim().length', '.length', '.size', ''], s: '.trim().length', tests: ['isEmpty("") === true', 'isEmpty("   ") === true', 'isEmpty("hi") === false'] },
    { fn: 'clamp(n)', body: 'return Math.{{x}}(0, Math.min(100, n));', o: ['max', 'min', 'abs', 'round'], s: 'max', tests: ['clamp(50) === 50', 'clamp(-5) === 0', 'clamp(500) === 100'] }]);
  var code = J('function ' + T.fn + ' {', '  ' + T.body, '}', '', '// tests', 'const check = (ok) => console.log(ok ? "PASS" : "FAIL");').concat('\n' + T.tests.map(function (t) { return 'check(' + t + ');'; }).join('\n'));
  return { tag: 'Make all 3 tests pass', view: 'console', code: code, slots: { x: R.opts(T.s, T.o) }, sol: { x: T.s },
    goals: [['3 × PASS', "logs.length===3 && logs.every(function(l){return l==='PASS';})"]], explain: 'Read each failing test as a spec: it names an input and the exact expected output. Edge cases (boundaries, empty input) are where bugs hide.' };
} });

// ---------- Ops & Security ----------
D({ id: 'ops.backoff', t: 'ops', sb: 'js', from: ['o-backoff'], name: 'Exponential backoff', icon: '📈', gen: function (R) {
  var b = R.pick([100, 200, 250, 500]), m = R.pick([2, 3]), n = R.int(3, 4), want = []; for (var i = 0; i < n; i++) want.push(b * Math.pow(m, i));
  return { tag: 'Back off: ' + want.join(', ') + ' ms', view: 'console', code: J('for (let attempt = 0; attempt < ' + n + '; attempt++) {', '  const delay = {{e}};', '  console.log(delay);', '}'),
    slots: { e: R.opts(b + ' * ' + m + ' ** attempt', [b + ' * attempt', b + ' + attempt', b + ' ** attempt', b + ' * ' + m + ' * attempt', b + ' * (attempt + 1)']) }, sol: { e: b + ' * ' + m + ' ** attempt' },
    goals: [['Delays ' + want.join(', '), 'logs.join(",")===' + Q(want.join(','))]], explain: 'Exponential backoff multiplies the wait each retry: base × ' + m + '^attempt. It gives an overloaded server room to recover (add random jitter in real systems).' };
} });
D({ id: 'sec.secret', t: 'sec', sb: 'js', from: ['sec-secret'], name: 'Secrets from env', icon: '🤫', gen: function (R) {
  var nm = R.pick(['API_KEY', 'STRIPE_KEY', 'MAPS_TOKEN', 'OPENAI_KEY']), nk = 'sk-' + R.int(10000, 99999), ok = 'sk-' + R.int(100, 999);
  return { tag: 'Use the key from the environment (the hard-coded one was rotated)', view: 'console', delay: 400, pre: 'window.process = { env: { ' + nm + ': ' + Q(nk) + ' } };', mock: { '/api/data': { auth: 'Bearer ' + nk, body: { ok: 'yes' } } },
    code: J('const key = {{k}};', 'fetch("/api/data", { headers: { Authorization: "Bearer " + key } })', '  .then(r => r.json()).then(d => console.log(d.ok));'),
    slots: { k: R.opts('process.env.' + nm, [Q(ok), 'env.' + nm, Q('process.env.' + nm), nm]) }, sol: { k: 'process.env.' + nm },
    goals: [['The API accepts the request', "log==='yes'"]], explain: 'Never hard-code secrets: they leak through git history and cannot be rotated without a deploy. Read them from the environment: `process.env.' + nm + '`.' };
} });
D({ id: 'sec.authz', t: 'sec', sb: 'js', from: ['sec-authz'], name: 'Authorization checks', icon: '🛂', gen: function (R) {
  var admin = R.f() < 0.4, corr = admin ? 'user.id === doc.ownerId || user.role === "admin"' : 'user.id === doc.ownerId';
  var tests = ['canEdit({id:1,role:"user",loggedIn:true},{ownerId:1})===true', 'canEdit({id:2,role:"user",loggedIn:true},{ownerId:1})===false', 'canEdit({id:3,role:"admin",loggedIn:true},{ownerId:1})===' + admin];
  return { tag: 'Only the owner' + (admin ? ' or an admin' : '') + ' may edit', view: 'console', code: J('function canEdit(user, doc) {', '  return {{c}};', '}'),
    slots: { c: R.opts(corr, ['user.loggedIn', 'true', 'user.id === doc.id', admin ? 'user.id === doc.ownerId' : 'user.id === doc.ownerId || user.role === "admin"', '!!doc.ownerId']) }, sol: { c: corr },
    goals: [['Owner yes, stranger no' + (admin ? ', admin yes' : ', admin no'), tests.join(' && ')]], explain: 'Authentication says who you are; **authorization** says what you may do. Check ownership on the server for every request.' };
} });
D({ id: 'sec.xss', t: 'sec', sb: 'js', from: ['ai-xss'], name: 'textContent vs innerHTML', icon: '🧯', gen: function (R) {
  var payload = R.pick(['<b>hi</b>', '<i>lol</i>', '<u>x</u>', '<em>wow</em>']);
  return { tag: 'Show the comment as plain text, never as HTML', html: '<div id="out"></div>', code: J('const comment = ' + Q(payload) + ';', 'document.querySelector("#out").{{p}} = comment;'),
    slots: { p: R.opts('textContent', ['innerHTML', 'outerHTML', 'html']) }, sol: { p: 'textContent' },
    goals: [['No HTML was created', "!!q('#out') && q('#out').children.length===0 && txt('#out')===" + Q(payload)]], explain: '`innerHTML` parses user text as markup, which is how XSS attacks inject scripts. `textContent` always inserts plain text.' };
} });
})(typeof window !== 'undefined' ? window : globalThis);
