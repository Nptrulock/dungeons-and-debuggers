// Drills: Python (real Pyodide) and SQL (real SQLite)
(function (root) {
var DR = root.DRILLS, D = DR.D, J = DR.J, Q = DR.Q;
var PEOPLE = ['Ava', 'Bo', 'Cy', 'Dee', 'Eli', 'Fay', 'Gus', 'Hana', 'Ivy', 'Kai', 'Lena', 'Milo', 'Nia', 'Omar'];
function pyOut(lines) { return Q(lines.join('\n') + '\n'); }
function pyList(a) { return '[' + a.join(', ') + ']'; }

D({ id: 'py.fstring', t: 'py', sb: 'py', from: ['p-fstr'], name: 'f-strings', icon: '🧵', gen: function (R) {
  var nm = R.pick(PEOPLE), n = R.int(2, 99), w = R.pick(['coins', 'points', 'cats', 'tickets']);
  return { tag: 'Print “' + nm + ' has ' + n + ' ' + w + '”', code: J('name = ' + Q(nm), 'n = ' + n, 'print({{f}}"{name} has {n} ' + w + '")'), slots: { f: R.opts('f', ['', 'r', 's', 'b']) }, sol: { f: 'f' },
    goals: [['Prints ' + nm + ' has ' + n + ' ' + w, '_out == ' + pyOut([nm + ' has ' + n + ' ' + w])]], explain: 'Only an `f` prefix turns `{name}` into the variable’s value. Without it the braces print literally.' };
} });
D({ id: 'py.range', t: 'py', sb: 'py', from: ['p-range'], name: 'range()', icon: '🔢', gen: function (R) {
  var a = R.int(0, 5), b = a + R.int(2, 5), want = []; for (var i = a; i <= b; i++) want.push(i);
  return { tag: 'Print ' + a + ' to ' + b + ', one per line', code: J('for i in range({{s}}, {{e}}):', '    print(i)'), slots: { s: R.opts(a, [a + 1, a - 1 < 0 ? a + 2 : a - 1]), e: R.opts(b + 1, [b, b - 1, b + 2]) }, sol: { s: a, e: b + 1 },
    goals: [['Prints ' + a + '…' + b, '_out == ' + pyOut(want)]], explain: '`range(start, stop)` includes start and **excludes** stop, so to reach ' + b + ' use `range(' + a + ', ' + (b + 1) + ')`.' };
} });
D({ id: 'py.int', t: 'py', sb: 'py', from: ['p-int'], name: 'int() conversion', icon: '🔤', gen: function (R) {
  var n = R.int(5, 80), k = R.int(1, 20);
  return { tag: 'Print ' + n + ' + ' + k + ' (the input is text)', code: J('text = "' + n + '"  # from input()', 'print({{f}}(text) + ' + k + ')'), slots: { f: R.opts('int', ['str', 'len', 'float', 'list']) }, sol: { f: 'int' },
    goals: [['Prints ' + (n + k), '_out == ' + pyOut([n + k])]], explain: '`input()` always gives a string. `int(text)` converts it; `str + int` is a TypeError, and `float` prints a trailing `.0`.' };
} });
D({ id: 'py.indent', t: 'py', sb: 'py', from: ['p-indent'], name: 'Indentation = blocks', icon: '↹', gen: function (R) {
  var k = R.int(2, 4), inside = R.f() < 0.5, w = R.pick(['done', 'tick', 'next', 'beep']), lines = [];
  for (var i = 0; i < k; i++) { lines.push(i); if (inside) lines.push(w); } if (!inside) lines.push(w);
  return { tag: inside ? 'Print “' + w + '” after every number' : 'Print “' + w + '” once, after the loop', code: J('for i in range(' + k + '):', '    print(i)', '{{d}}print("' + w + '")'),
    slots: { d: { o: inside ? ['', '    '] : ['    ', ''], l: inside ? ['(no indent)', '(4 spaces)'] : ['(4 spaces)', '(no indent)'], s: 0 } }, sol: { d: inside ? '    ' : '' },
    goals: [['Right output', '_out == ' + pyOut(lines)]], explain: 'In Python, indentation **is** the block. Indented lines run on every loop pass; a line back at the left margin runs once, after the loop.' };
} });
D({ id: 'py.index', t: 'py', sb: 'py', from: ['p-list'], name: 'List indexes', icon: '📚', gen: function (R) {
  var items = R.sample(['apple', 'pear', 'kiwi', 'plum', 'mango', 'lime', 'fig'], 5), w = R.pick(['first', 'second', 'last', 'second to last']);
  var map = { first: [0, [1, -1, 'items[0]']], second: [1, [2, 0, -2]], last: [-1, ['len(items)', 0, 4.0]], 'second to last': [-2, [-1, 3.5, 'len(items) - 1']] }, m = map[w];
  var ans = w === 'first' ? items[0] : w === 'second' ? items[1] : w === 'last' ? items[4] : items[3];
  return { tag: 'Print the ' + w + ' item', code: J('items = ' + Q(items).replace(/,/g, ', '), 'print(items[{{i}}])'), slots: { i: R.opts(m[0], m[1]) }, sol: { i: m[0] },
    goals: [['Prints ' + ans, '_out == ' + pyOut([ans])]], explain: 'Python counts from 0, and negative indexes count from the end: `items[-1]` is the last item, `items[-2]` the one before.' };
} });
D({ id: 'py.slice', t: 'py', sb: 'py', from: ['p-str'], name: 'Slicing', icon: '🔪', gen: function (R) {
  var word = R.pick(['dungeon', 'debugger', 'keyboard', 'pancakes', 'wizardry', 'notebook']), k = R.int(2, 4), first = R.f() < 0.5;
  var corr = first ? ':' + k : '-' + k + ':', ans = first ? word.slice(0, k) : word.slice(-k);
  return { tag: 'Print the ' + (first ? 'first' : 'last') + ' ' + k + ' letters of “' + word + '”', code: J('word = ' + Q(word), 'print(word[{{s}}])'), slots: { s: R.opts(corr, [String(k), k + ':', ':' + (k - 1), ':-' + k, '-' + k, '1:' + k].filter(function (sp) { if (sp.indexOf(':') < 0) return true; var p = sp.split(':'), L = word.length, a = p[0] === '' ? 0 : +p[0], b = p[1] === '' ? L : +p[1]; if (a < 0) a += L; if (b < 0) b += L; return word.slice(a, b) !== ans; })) }, sol: { s: corr },
    goals: [['Prints ' + ans, '_out == ' + pyOut([ans])]], explain: '`s[a:b]` takes from a up to (not including) b. `s[:' + k + ']` is the first ' + k + '; `s[-' + k + ':]` the last ' + k + '.' };
} });
D({ id: 'py.dict', t: 'py', sb: 'py', from: ['p-dict'], name: 'Dictionaries', icon: '🗂️', gen: function (R) {
  var p = { name: R.pick(PEOPLE), city: R.pick(['Oslo', 'Lima', 'Pune', 'Cork']), age: R.int(18, 80) }, k = R.pick(['name', 'city', 'age']);
  return { tag: 'Print the person’s ' + k, code: J('person = {"name": ' + Q(p.name) + ', "city": ' + Q(p.city) + ', "age": ' + p.age + '}', 'print(person{{a}})'), slots: { a: R.opts('["' + k + '"]', ['.' + k, '[' + k + ']', '("' + k + '")', '.get' + k]) }, sol: { a: '["' + k + '"]' },
    goals: [['Prints ' + p[k], '_out == ' + pyOut([p[k]])]], explain: 'Dict values are read with square brackets and the key: `person["' + k + '"]` (or `person.get("' + k + '")`). Dot access is for attributes, not keys.' };
} });
D({ id: 'py.return', t: 'py', sb: 'py', from: ['p-return'], name: 'return vs print', icon: '↩️', gen: function (R) {
  var fn = R.pick(['double', 'triple', 'scale', 'boost']), k = { double: 2, triple: 3, scale: R.int(4, 9), boost: R.int(10, 20) }[fn], x = R.int(2, 9);
  return { tag: 'Make ' + fn + '(' + x + ') give back ' + (x * k), code: J('def ' + fn + '(x):', '    {{r}} x * ' + k, '', 'print(' + fn + '(' + x + ') + 1)'), slots: { r: R.opts('return', ['print', '', 'yield', 'output']) }, sol: { r: 'return' },
    goals: [['Prints ' + (x * k + 1), '_out == ' + pyOut([x * k + 1])]], explain: '`print` only shows a value; the function still returns `None`, and `None + 1` crashes. `return` hands the value back to the caller.' };
} });
D({ id: 'py.accum', t: 'py', sb: 'py', from: ['p-accum'], name: 'Accumulators', icon: '➕', gen: function (R) {
  var nums = R.distinct(R.int(3, 5), 1, 20), s = nums.reduce(function (a, b) { return a + b; }, 0);
  return { tag: 'Total the numbers', code: J('nums = ' + pyList(nums), 'total = 0', 'for n in nums:', '    total {{op}} n', 'print(total)'), slots: { op: R.opts('+=', ['=', '=+', '-=', '==']) }, sol: { op: '+=' },
    goals: [['Prints ' + s, '_out == ' + pyOut([s])]], explain: '`total += n` adds to the running total. `total = n` replaces it, and `=+` is just `= +n`.' };
} });
D({ id: 'py.break', t: 'py', sb: 'py', from: ['p-break'], name: 'break vs continue', icon: '⛔', gen: function (R) {
  var nums = [R.int(1, 9), R.int(1, 9), -R.int(1, 9), R.int(1, 9), -R.int(1, 9), R.int(1, 9)], stop = R.f() < 0.5, kw = stop ? 'break' : 'continue', out = [];
  for (var i = 0; i < nums.length; i++) { if (nums[i] < 0) { if (stop) break; continue; } out.push(nums[i]); }
  return { tag: stop ? 'Stop at the first negative number' : 'Skip the negative numbers', code: J('nums = ' + pyList(nums), 'for n in nums:', '    if n < 0:', '        {{k}}', '    print(n)'), slots: { k: R.opts(kw, ['pass', stop ? 'continue' : 'break', 'return', 'stop']) }, sol: { k: kw },
    goals: [['Prints ' + out.join(', '), '_out == ' + pyOut(out)]], explain: '`break` leaves the loop entirely; `continue` skips to the next item; `pass` does nothing.' };
} });
D({ id: 'py.comp', t: 'py', sb: 'py', from: ['p-comp'], name: 'List comprehensions', icon: '🧺', gen: function (R) {
  var nums = R.distinct(6, 1, 15).sort(function (a, b) { return a - b; }), k = nums[3];
  var T = R.pick([['if n % 2 == 0', 'even', function (n) { return n % 2 === 0; }], ['if n % 2 == 1', 'odd', function (n) { return n % 2 === 1; }], ['if n > ' + k, 'greater than ' + k, function (n) { return n > k; }]]);
  var want = pyList(nums.filter(T[2]).map(function (n) { return n * n; }));
  return { tag: 'List the squares of the ' + (T[1].indexOf('greater') === 0 ? 'numbers ' + T[1] : T[1] + ' numbers'), code: J('nums = ' + pyList(nums), 'print([n * n for n in nums {{c}}])'), slots: { c: R.opts(T[0], ['', 'if n % 2 == 0', 'if n % 2 == 1', 'if n > ' + k, 'if n >= ' + k, 'while n > 0'].filter(function (x) { return x !== T[0]; })) }, sol: { c: T[0] },
    goals: [['Prints ' + want, '_out == ' + pyOut([want])]], explain: '`[expr for x in items if condition]` maps and filters in one line. The `if` goes at the end.' };
} });
D({ id: 'py.try', t: 'py', sb: 'py', from: ['p-try'], name: 'Catching exceptions', icon: '🥅', gen: function (R) {
  var E = [['int("abc")', 'ValueError'], ['{"a": 1}["b"]', 'KeyError'], ['10 / 0', 'ZeroDivisionError'], ['[1, 2][5]', 'IndexError']], e = R.pick(E), fb = R.pick([-1, 0, 'None']);
  return { tag: 'Don’t crash: fall back to ' + fb, code: J('try:', '    x = ' + e[0], 'except {{e}}:', '    x = ' + fb, 'print(x)'), slots: { e: R.opts(e[1], E.map(function (x) { return x[1]; }).concat(['TypeError'])) }, sol: { e: e[1] },
    goals: [['Prints ' + fb, '_out == ' + pyOut([fb])]], explain: '`except` only catches the exception type you name. `' + e[0] + '` raises **' + e[1] + '**; catching anything else lets it crash.' };
} });
D({ id: 'py.count', t: 'py', sb: 'py', from: ['p-count'], name: 'Counting with dict.get', icon: '🧮', gen: function (R) {
  var pool = R.sample(['red', 'blue', 'cat', 'dog', 'tea', 'sun'], 3), words = [], target = pool[0], n = 0; for (var i = 0; i < 7; i++) { var w = R.pick(pool); words.push(w); if (w === target) n++; }
  if (!n) { words[0] = target; n = words.filter(function (x) { return x === target; }).length; }
  return { tag: 'Count how often “' + target + '” appears', code: J('words = ' + Q(words).replace(/,/g, ', '), 'counts = {}', 'for w in words:', '    counts[w] = counts.get(w, {{d}}) + 1', 'print(counts["' + target + '"])'), slots: { d: R.opts('0', ['1', 'None', '""', '-1']) }, sol: { d: '0' },
    goals: [['Prints ' + n, '_out == ' + pyOut([n])]], explain: '`dict.get(key, default)` returns the default for a missing key. Counting starts at 0; `None + 1` is a TypeError.' };
} });

// ---------- SQL ----------
function users(R) {
  var names = R.sample(PEOPLE, 6), ages = R.distinct(6, 18, 65), cities = ['Detroit', 'Austin', 'Boston', 'Denver'], rows = names.map(function (n, i) { return { id: i + 1, name: n, age: ages[i], city: R.pick(cities), email: R.f() < 0.35 ? null : n.toLowerCase() + '@example.com' }; });
  if (rows.every(function (r) { return r.email; })) rows[2].email = null; if (rows.every(function (r) { return !r.email; })) rows[0].email = 'a@example.com';
  var sql = J('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, city TEXT, email TEXT);', 'INSERT INTO users VALUES ' + rows.map(function (r) { return '(' + r.id + ",'" + r.name + "'," + r.age + ",'" + r.city + "'," + (r.email ? "'" + r.email + "'" : 'NULL') + ')'; }).join(',') + ';');
  return { rows: rows, sql: sql };
}
function namesG(list) { return "rows.map(function(r){return r[0];}).join(',')===" + Q(list.join(',')); }
D({ id: 'sql.select', t: 'sql', sb: 'sql', from: ['s-select'], name: 'SELECT columns', icon: '🗃️', gen: function (R) {
  var U = users(R), c = R.sample(['name', 'age', 'city', 'email'], 2);
  return { tag: 'Show only ' + c[0] + ' and ' + c[1], setup: U.sql, code: 'SELECT {{c}} FROM users;', slots: { c: R.opts(c.join(', '), ['*', c.join(' '), c.join(' AND '), c[0], c[1] + ', ' + c[0]]) }, sol: { c: c.join(', ') },
    goals: [['Columns ' + c.join(', '), "cols.join(',')===" + Q(c.join(',')) + ' && rows.length===6']], explain: 'List columns separated by commas, in the order you want them. `*` means every column; a missing comma silently renames a column.' };
} });
D({ id: 'sql.where', t: 'sql', sb: 'sql', from: ['s-where'], name: 'WHERE', icon: '🔎', gen: function (R) {
  var U = users(R), k = U.rows[R.int(1, 4)].age, T = R.pick([['age > ' + k, 'older than ' + k], ['age >= ' + k, k + ' or older'], ['age < ' + k, 'younger than ' + k], ['age <= ' + k, k + ' or younger']]);
  var f = function (c) { return U.rows.filter(function (r) { var age = r.age; return eval(c.replace('=', '==').replace('<==', '<=').replace('>==', '>=')); }).map(function (r) { return r.name; }); };
  return { tag: 'SELECT users ' + T[1], setup: U.sql, code: 'SELECT name FROM users WHERE {{c}};', slots: { c: R.opts(T[0], ['age > ' + k, 'age >= ' + k, 'age < ' + k, 'age <= ' + k, 'age = ' + k].filter(function (x) { return x !== T[0]; })) }, sol: { c: T[0] },
    goals: [['Exactly the users ' + T[1], namesG(f(T[0]))]], explain: '`WHERE` keeps rows where the condition is true. `>` excludes the boundary (' + k + '), `>=` includes it.' };
} });
D({ id: 'sql.order', t: 'sql', sb: 'sql', from: ['s-order'], name: 'ORDER BY', icon: '↕️', gen: function (R) {
  var items = R.sample(['Keyboard', 'Mouse', 'Monitor', 'Webcam', 'Headset', 'Cable', 'Lamp', 'Desk'], 5), prices = R.distinct(5, 5, 300);
  var setup = J('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price REAL);', 'INSERT INTO products (name, price) VALUES ' + items.map(function (n, i) { return "('" + n + "'," + prices[i] + ')'; }).join(',') + ';');
  var T = R.pick([['price DESC', 'most expensive first', function (a, b) { return b.p - a.p; }], ['price ASC', 'cheapest first', function (a, b) { return a.p - b.p; }], ['name', 'by name, A to Z', function (a, b) { return a.n < b.n ? -1 : 1; }], ['name DESC', 'by name, Z to A', function (a, b) { return a.n < b.n ? 1 : -1; }]]);
  var want = items.map(function (n, i) { return { n: n, p: prices[i] }; }).sort(T[2]).map(function (x) { return x.n; });
  return { tag: 'List products ' + T[1], setup: setup, code: 'SELECT name, price FROM products ORDER BY {{o}};', slots: { o: R.opts(T[0], ['price', 'price DESC', 'name', 'name DESC', 'id', 'price ASC'].filter(function (x) { return x !== T[0] && !(T[0] === 'price ASC' && x === 'price') && !(T[0] === 'name' && x === 'name ASC'); })) }, sol: { o: T[0] },
    goals: [['Order: ' + want.join(', '), namesG(want)]], explain: '`ORDER BY col` sorts ascending by default; add `DESC` for descending. Without ORDER BY, SQL promises no order at all.' };
} });
D({ id: 'sql.agg', t: 'sql', sb: 'sql', from: ['s-agg'], name: 'Aggregates', icon: '∑', gen: function (R) {
  var tot = R.distinct(R.int(4, 6), 5, 90), setup = J('CREATE TABLE orders (id INTEGER PRIMARY KEY, total REAL);', 'INSERT INTO orders (total) VALUES ' + tot.map(function (t) { return '(' + t + ')'; }).join(',') + ';');
  var sum = tot.reduce(function (a, b) { return a + b; }, 0), T = R.pick([['COUNT(*)', 'How many orders are there?', tot.length], ['SUM(total)', 'What is the total of all orders?', sum], ['AVG(total)', 'What is the average order?', sum / tot.length], ['MAX(total)', 'What is the biggest order?', Math.max.apply(null, tot)], ['MIN(total)', 'What is the smallest order?', Math.min.apply(null, tot)]]);
  return { tag: T[1], setup: setup, code: 'SELECT {{f}} FROM orders;', slots: { f: R.opts(T[0], ['COUNT(*)', 'SUM(total)', 'AVG(total)', 'MAX(total)', 'MIN(total)', 'total'].filter(function (x) { return x !== T[0]; })) }, sol: { f: T[0] },
    goals: [['Answers ' + (Math.round(T[2] * 100) / 100), 'rows.length===1 && Math.abs(rows[0][0]-' + T[2] + ')<0.01']], explain: '`COUNT`, `SUM`, `AVG`, `MAX` and `MIN` collapse many rows into one number.' };
} });
D({ id: 'sql.group', t: 'sql', sb: 'sql', from: ['s-group'], name: 'GROUP BY', icon: '🧺', gen: function (R) {
  var cust = R.sample(PEOPLE, 3), rows = [], sums = {}; for (var i = 0; i < 7; i++) { var c = cust[i % 3], t = R.int(5, 60); rows.push("('" + c + "'," + t + ')'); sums[c] = (sums[c] || 0) + t; }
  var setup = J('CREATE TABLE orders (id INTEGER PRIMARY KEY, customer TEXT, total INTEGER);', 'INSERT INTO orders (customer, total) VALUES ' + rows.join(',') + ';');
  var want = Object.keys(sums).sort().map(function (k) { return k + ':' + sums[k]; }).join(',');
  return { tag: 'Total spent per customer', setup: setup, code: J('SELECT customer, SUM(total) FROM orders', 'GROUP BY {{g}}', 'ORDER BY customer;'), slots: { g: R.opts('customer', ['total', 'id', 'SUM(total)', 'orders']) }, sol: { g: 'customer' },
    goals: [['One row per customer with their total', "rows.map(function(r){return r[0]+':'+r[1];}).join(',')===" + Q(want)]], explain: '`GROUP BY customer` makes one group per customer, and `SUM` adds up inside each group.' };
} });
D({ id: 'sql.update', t: 'sql', sb: 'sql', from: ['s-update'], name: 'UPDATE with WHERE', icon: '✏️', gen: function (R) {
  var U = users(R), who = R.pick(U.rows), n = R.int(70, 99);
  var want = U.rows.map(function (r) { return r.name + ':' + (r === who ? n : r.age); }).join(',');
  return { tag: 'Set ' + who.name + '’s age to ' + n + ' (only theirs)', setup: U.sql, code: J('UPDATE users SET age = ' + n + ' {{w}};', 'SELECT name, age FROM users ORDER BY id;'), slots: { w: R.opts("WHERE name = '" + who.name + "'", ['', 'WHERE age = ' + n, "AND name = '" + who.name + "'", "WHERE name = " + who.name]) }, sol: { w: "WHERE name = '" + who.name + "'" },
    goals: [['Only ' + who.name + ' changed', "rows.map(function(r){return r[0]+':'+r[1];}).join(',')===" + Q(want)]], explain: 'An UPDATE without WHERE changes **every row**. Always write the WHERE first. Text values need single quotes.' };
} });
D({ id: 'sql.null', t: 'sql', sb: 'sql', from: ['s-null'], name: 'IS NULL', icon: '🕳️', gen: function (R) {
  var U = users(R), none = R.f() < 0.6, corr = none ? 'IS NULL' : 'IS NOT NULL';
  var want = U.rows.filter(function (r) { return none ? !r.email : !!r.email; }).map(function (r) { return r.name; });
  return { tag: none ? 'Find users with no email' : 'Find users who have an email', setup: U.sql, code: 'SELECT name FROM users WHERE email {{c}};', slots: { c: R.opts(corr, ['= NULL', "= ''", none ? 'IS NOT NULL' : 'IS NULL', '!= NULL']) }, sol: { c: corr },
    goals: [['Exactly ' + want.join(', '), namesG(want)]], explain: 'NULL means “unknown”, so `= NULL` is never true. Use `IS NULL` / `IS NOT NULL`.' };
} });
function shop(R) {
  var cust = R.sample(PEOPLE, 4), orders = [], id = 100;
  cust.forEach(function (c, i) { if (i === 3) return; var k = R.int(1, 2); for (var j = 0; j < k; j++) orders.push({ id: ++id, cid: i + 1, total: R.int(5, 80) }); });
  var sql = J('CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT);', 'INSERT INTO customers VALUES ' + cust.map(function (c, i) { return '(' + (i + 1) + ",'" + c + "')"; }).join(',') + ';', 'CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, total INTEGER);', 'INSERT INTO orders VALUES ' + orders.map(function (o) { return '(' + o.id + ',' + o.cid + ',' + o.total + ')'; }).join(',') + ';');
  return { cust: cust, orders: orders, sql: sql };
}
D({ id: 'sql.join', t: 'sql', sb: 'sql', from: ['s-join'], name: 'JOIN … ON', icon: '🔗', gen: function (R) {
  var S = shop(R), want = S.orders.map(function (o) { return S.cust[o.cid - 1] + ':' + o.total; }).join(',');
  return { tag: 'Show each order with its customer’s name', setup: S.sql, code: J('SELECT customers.name, orders.total', 'FROM orders JOIN customers ON {{on}}', 'ORDER BY orders.id;'), slots: { on: R.opts('orders.customer_id = customers.id', ['orders.id = customers.id', 'customers.id = orders.total', 'orders.customer_id = orders.id', '1 = 1']) }, sol: { on: 'orders.customer_id = customers.id' },
    goals: [['Every order matched to the right customer', "rows.map(function(r){return r[0]+':'+r[1];}).join(',')===" + Q(want)]], explain: 'Join on the foreign key: `orders.customer_id` points at `customers.id`. Matching unrelated columns gives wrong or missing rows.' };
} });
D({ id: 'sql.left', t: 'sql', sb: 'sql', from: ['s-left'], name: 'LEFT JOIN', icon: '⬅️', gen: function (R) {
  var S = shop(R), want = S.cust.map(function (c, i) { return c + ':' + S.orders.filter(function (o) { return o.cid === i + 1; }).length; }).join(',');
  return { tag: 'Count orders per customer, including customers with none', setup: S.sql, code: J('SELECT c.name, COUNT(o.id) FROM customers c', '{{j}} orders o ON o.customer_id = c.id', 'GROUP BY c.id ORDER BY c.id;'), slots: { j: R.opts('LEFT JOIN', ['JOIN', 'INNER JOIN', 'CROSS JOIN', 'RIGHT']) }, sol: { j: 'LEFT JOIN' },
    goals: [['All 4 customers, one with 0', "rows.map(function(r){return r[0]+':'+r[1];}).join(',')===" + Q(want)]], explain: 'An inner JOIN drops rows with no match. `LEFT JOIN` keeps every row from the left table and fills the missing side with NULL, which COUNT treats as 0.' };
} });
D({ id: 'sql.distinct', t: 'sql', sb: 'sql', from: ['s-distinct'], name: 'DISTINCT', icon: '🧬', gen: function (R) {
  var U = users(R), c = R.pick(['city', 'city']), n = {}; U.rows.forEach(function (r) { n[r.city] = 1; });
  return { tag: 'List each city once', setup: U.sql, code: 'SELECT {{d}} city FROM users;', slots: { d: R.opts('DISTINCT', ['', 'ALL', 'UNIQUE', 'ONE']) }, sol: { d: 'DISTINCT' },
    goals: [[Object.keys(n).length + ' cities, no repeats', 'rows.length===' + Object.keys(n).length]], explain: '`SELECT DISTINCT` removes duplicate rows from the result.' };
} });
D({ id: 'sql.insert', t: 'sql', sb: 'sql', from: ['s-insert'], name: 'INSERT', icon: '➕', gen: function (R) {
  var U = users(R), nm = R.pick(['Zed', 'Yara', 'Xavi', 'Wren']), age = R.int(18, 70);
  return { tag: 'Add ' + nm + ', age ' + age, setup: U.sql, code: J('INSERT INTO users (name, age) VALUES ({{v}});', "SELECT name, age FROM users WHERE name = '" + nm + "';"), slots: { v: R.opts("'" + nm + "', " + age, [age + ", '" + nm + "'", nm + ', ' + age, "'" + nm + "'", '"' + nm + age + '"']) }, sol: { v: "'" + nm + "', " + age },
    goals: [[nm + ' is ' + age, 'rows.length===1 && rows[0][1]===' + age]], explain: 'Values go in the same order as the column list. Text needs single quotes; an unquoted word is read as a column name.' };
} });
})(typeof window !== 'undefined' ? window : globalThis);
