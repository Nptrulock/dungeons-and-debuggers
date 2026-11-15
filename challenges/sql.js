// SQL track (real SQLite via sql.js) and the Book Shop Database project
var PETS = L("CREATE TABLE pets (id INTEGER PRIMARY KEY, name TEXT, species TEXT, age INTEGER);", "INSERT INTO pets (name, species, age) VALUES ('Rex','dog',3),('Whiskers','cat',5),('Bubbles','fish',1),('Luna','cat',2);");
var PRODUCTS = L("CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price REAL, qty INTEGER);", "INSERT INTO products (name, price, qty) VALUES ('Keyboard',49.99,10),('Mouse',19.99,25),('Monitor',189,5),('USB cable',7.5,100),('Webcam',59,8),('Headset',79,12);");
var SHOP = L("CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, email TEXT);", "INSERT INTO customers VALUES (1,'Ava','ava@example.com'),(2,'Bo',NULL),(3,'Cy','cy@example.com'),(4,'Dee','dee@example.com');", "CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, total REAL);", "INSERT INTO orders VALUES (101,1,25),(102,3,40),(103,1,15.5),(104,2,9.99);");
var names = function (rows) { return rows.map(function (r) { return r[0]; }).join(','); };
CH({ id: 's-select', t: 'sql', tier: 1, sb: 'sql', icon: '🗃️', title: 'Ask a table a question', setup: PETS,
  story: 'This is a real SQLite database with a `pets` table. Show only the **name** and **species** columns. Tap "Peek at the tables" to see what is inside.',
  code: L('SELECT {{cols}} FROM pets;'), slots: { cols: ['pets', 'name species', '*', 'name, species'] }, sol: { cols: 'name, species' },
  goals: [['Exactly the columns name and species', "cols.join(',') == 'name,species'"], ['All 4 pets', "rows.length == 4"]],
  hints: ['Column names are separated by commas.'],
  learn: { h: 'SELECT', x: '`SELECT columns FROM table` reads data. `*` means all columns. Without the comma, `name species` means "name, **renamed** to species", which is an alias. The query is valid and the result is wrong.\n\nSQL is the language of nearly every database: SQLite in your phone, Postgres and MySQL on servers.', terms: ['sql', 'table', 'query'] } });
CH({ id: 's-where', t: 'sql', tier: 1, sb: 'sql', icon: '🐈', title: 'Only the cats', setup: PETS,
  story: 'Show only the cats.',
  code: L('SELECT * FROM pets WHERE species {{op}} {{val}};'), slots: { op: ['!=', '>', '='], val: ['cat', "'Cat'", "'cat'"] }, sol: { op: '=', val: "'cat'" },
  goals: [['Whiskers and Luna, nothing else', "names(rows.map(function(r){return [r[1]];})) == 'Whiskers,Luna'"]],
  hints: ['Text values need single quotes, and SQLite compares them exactly.', "`= 'cat'`"],
  learn: { h: 'WHERE filters rows', x: '`WHERE` keeps only the rows where the condition is true. Text goes in **single quotes**. Without quotes, `cat` means "the column named cat", which gives `no such column: cat`. With the default settings, `\'Cat\'` will not match `\'cat\'`.\n\nSQL uses a single `=` for comparing, not `==`.', terms: ['sql', 'filter'] } });
CH({ id: 's-order', t: 'sql', tier: 1, sb: 'sql', icon: '🏆', title: 'Top 3 most expensive', setup: PRODUCTS,
  story: 'List the 3 most expensive products, priciest first.',
  code: L('SELECT name, price FROM products', 'ORDER BY price {{dir}}', 'LIMIT {{n}};'), slots: { dir: ['ASC', 'DESC'], n: { n: [1, 6, 1], s: 0 } }, sol: { dir: 'DESC', n: 3 },
  goals: [['Monitor, Headset, Webcam', "names(rows) == 'Monitor,Headset,Webcam'"]],
  hints: ['ASC means ascending (small to large).', '`DESC` and `LIMIT 3`.'],
  learn: { h: 'ORDER BY and LIMIT', x: '`ORDER BY col DESC` sorts largest first, and `LIMIT n` keeps the first n rows. Together they make every "top 10" list on the internet. Without ORDER BY, the database may return rows in **any** order. Never rely on it.', terms: ['sql', 'sort'] } });
CH({ id: 's-agg', t: 'sql', tier: 1, sb: 'sql', icon: '💰', title: 'Value of the warehouse', setup: PRODUCTS,
  story: 'What is all the stock worth? That is each product\'s price times its quantity, all added up. The answer should be 4114.65.',
  code: L('SELECT {{f}}({{expr}}) AS value FROM products;'), slots: { f: ['COUNT', 'MAX', 'SUM'], expr: ['price', 'qty', 'price * qty'] }, sol: { f: 'SUM', expr: 'price * qty' },
  goals: [['value is 4114.65', "rows.length == 1 && Math.abs(rows[0][0] - 4114.65) < 0.001"]],
  hints: ['You need to multiply inside, then add up.', '`SUM(price * qty)`.'],
  learn: { h: 'Aggregates', x: '`SUM`, `COUNT`, `AVG`, `MIN` and `MAX` squash many rows into one value. You can aggregate an **expression** too: `SUM(price * qty)` multiplies each row first, then adds.\n\n`SUM(price) * SUM(qty)` gives a very different, wrong answer. Order of operations matters in SQL as well.', terms: ['aggregate'] } });
CH({ id: 's-group', t: 'sql', tier: 1, sb: 'sql', icon: '🧮', title: 'Count by species', setup: PETS,
  story: 'How many pets of each species are there? You want one row per species with its count.',
  code: L('SELECT species, COUNT(*) AS n FROM pets', '{{g}};'), slots: { g: ['ORDER BY species', 'WHERE species', 'GROUP BY species'] }, sol: { g: 'GROUP BY species' },
  goals: [['3 species', "rows.length == 3"], ['cat has 2', "rows.some(function(r){return r[0]=='cat' && r[1]==2;})"]],
  hints: ['Without grouping, COUNT(*) squashes everything into one row.'],
  learn: { h: 'GROUP BY', x: '`GROUP BY species` makes one bucket per species, and the aggregate runs once per bucket. Without it, `COUNT(*)` counts every pet and SQLite shows an arbitrary species next to the total, which is misleading.\n\nGROUP BY drives every report: sales per month, users per country, bugs per team.', terms: ['aggregate', 'group-by'] } });
CH({ id: 's-insert', t: 'sql', tier: 1, sb: 'sql', icon: '🐹', title: 'Add a pet', setup: PETS,
  story: 'Add a hamster named Nibbles, age 1. Then the SELECT shows that it was saved.',
  code: L("INSERT INTO pets (name, species, age) VALUES ({{v}});", 'SELECT * FROM pets;'), slots: { v: ["'Nibbles', 1, 'hamster'", "Nibbles, hamster, 1", "'Nibbles', 'hamster', 1"] }, sol: { v: "'Nibbles', 'hamster', 1" },
  goals: [['Nibbles the hamster, age 1, exists', "(q1(\"SELECT COUNT(*) FROM pets WHERE name='Nibbles' AND species='hamster' AND age=1\")||[[0]])[0][0] == 1"], ['5 pets total', "rows.length == 5"]],
  hints: ['Values go in the same order as the column list.'],
  learn: { h: 'INSERT', x: 'The values line up with the columns **by position**. Mix them up and SQLite happily stores age = \'hamster\', because SQLite is very relaxed about types. Postgres would reject it. `id` was filled automatically because it is an `INTEGER PRIMARY KEY`.', terms: ['sql', 'primary-key'] } });
CH({ id: 's-update', t: 'sql', tier: 1, sb: 'sql', icon: '🎂', title: 'Happy birthday, Whiskers', setup: PETS,
  story: 'Whiskers (id 2) just turned 6. Update **only** Whiskers. Watch what happens to the other pets with each option.',
  code: L('UPDATE pets SET age = 6{{w}};', 'SELECT name, age FROM pets;'), slots: { w: { o: ['', " WHERE species = 'cat'", ' WHERE id = 2'], l: ['(no WHERE)', "WHERE species = 'cat'", 'WHERE id = 2'] } }, sol: { w: ' WHERE id = 2' },
  goals: [['Whiskers is 6', "rows.some(function(r){return r[0]=='Whiskers' && r[1]==6;})"], ['Nobody else changed', "names(rows.map(function(r){return [r[1]];})) == '3,6,1,2'"]],
  hints: ['Without WHERE, UPDATE changes every row.', 'Target the unique id.'],
  learn: { h: 'UPDATE without WHERE', x: '`UPDATE pets SET age = 6` with no WHERE makes **every** pet 6. That is a classic production disaster. `WHERE species = \'cat\'` also caught Luna. Use the **primary key** to target exactly one row.\n\nCareful teams run the matching SELECT first, or wrap changes in a transaction so they can roll back.', terms: ['sql', 'primary-key'] } });
CH({ id: 's-null', t: 'sql', tier: 2, sb: 'sql', icon: '🕳️', title: 'Who has no email?', setup: SHOP,
  story: 'Find the customers with no email address. One option looks right and returns nothing.',
  code: L('SELECT name FROM customers WHERE email {{c}};'), slots: { c: ["= ''", '= NULL', 'IS NULL'] }, sol: { c: 'IS NULL' },
  goals: [['Bo', "names(rows) == 'Bo'"]],
  hints: ['NULL is not equal to anything, not even NULL.'],
  learn: { h: 'NULL is "unknown"', x: '`NULL` means unknown or missing. `email = NULL` is never true, because unknown = unknown is unknown. You must write `IS NULL` or `IS NOT NULL`. An empty string `\'\'` is a real value, not NULL.\n\nThe same trap exists in other languages: JavaScript\'s `NaN === NaN` is false.', terms: ['null'] } });
CH({ id: 's-join', t: 'sql', tier: 2, sb: 'sql', icon: '🔗', title: 'Whose order is it?', setup: SHOP,
  story: 'Orders store a `customer_id`, not a name. Join the tables so each order shows its customer\'s name.',
  code: L('SELECT orders.id, customers.name, orders.total', 'FROM orders JOIN customers', 'ON {{on}}', 'ORDER BY orders.id;'), slots: { on: ['orders.id = customers.id', 'customers.id = 1', 'orders.customer_id = customers.id'] }, sol: { on: 'orders.customer_id = customers.id' },
  goals: [['4 orders', "rows.length == 4"], ['101 Ava, 102 Cy, 103 Ava, 104 Bo', "rows.map(function(r){return r[0]+r[1];}).join(',') == '101Ava,102Cy,103Ava,104Bo'"]],
  hints: ['Which column in orders points at a customer?'],
  learn: { h: 'JOIN and foreign keys', x: '`orders.customer_id` is a **foreign key**: it holds the id of a row in `customers`. `JOIN ... ON` matches them up. Storing the id instead of a copy of the name means renaming a customer only touches one row. That design is called **normalization**.\n\nJoining on the wrong columns still runs, and it quietly gives nonsense (or no rows).', terms: ['join', 'foreign-key', 'primary-key'] } });
CH({ id: 's-distinct', t: 'sql', tier: 2, sb: 'sql', icon: '🎯', title: 'Customers who ordered', setup: SHOP,
  story: 'List each customer id that has placed an order, **once**. Ava ordered twice.',
  code: L('SELECT {{d}} customer_id FROM orders ORDER BY customer_id;'), slots: { d: { o: ['', 'ALL', 'DISTINCT'], l: ['(nothing)', 'ALL', 'DISTINCT'] } }, sol: { d: 'DISTINCT' },
  goals: [['1, 2, 3', "names(rows) == '1,2,3'"]],
  hints: ['One keyword removes duplicate rows.'],
  learn: { h: 'DISTINCT', x: '`SELECT DISTINCT` removes duplicate rows from the result. `ALL` is the default, so it keeps them. To count unique values, use `COUNT(DISTINCT customer_id)`.', terms: ['sql'] } });
CH({ id: 's-left', t: 'sql', tier: 3, sb: 'sql', icon: '👻', title: 'Customers with no orders', setup: SHOP,
  story: 'Marketing wants customers who have **never** ordered. A normal JOIN hides them. Find Dee.',
  code: L('SELECT customers.name FROM customers', '{{j}} orders ON orders.customer_id = customers.id', 'WHERE orders.id IS NULL;'), slots: { j: ['JOIN', 'INNER JOIN', 'LEFT JOIN'] }, sol: { j: 'LEFT JOIN' },
  goals: [['Dee', "names(rows) == 'Dee'"]],
  hints: ['An inner JOIN drops customers with no match.', 'A LEFT JOIN keeps every customer, with NULLs where there is no order.'],
  learn: { h: 'LEFT JOIN finds what is missing', x: '`JOIN` (an inner join) keeps only matched pairs, so Dee disappears. `LEFT JOIN` keeps **every** row from the left table and fills NULLs where nothing matches. Then `WHERE orders.id IS NULL` finds exactly the unmatched ones.\n\nThis "anti-join" pattern finds inactive users, unsold products and orphaned records.', terms: ['join', 'null'] } });
CH({ id: 's-index', t: 'sql', tier: 3, sb: 'sql', icon: '⚡', title: 'Make lookups fast', setup: L(PETS, 'CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT);', "WITH RECURSIVE n(i) AS (SELECT 1 UNION ALL SELECT i+1 FROM n WHERE i < 5000) INSERT INTO users (email) SELECT 'user' || i || '@example.com' FROM n;"),
  story: '5,000 users, and logins look them up by email. Ask SQLite **how** it would run the query. You want it to use an index, not scan every row.',
  code: L('{{idx}}', "EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = 'user4999@example.com';"), slots: { idx: { o: ['', 'CREATE INDEX idx_id ON users(id);', 'CREATE INDEX idx_email ON users(email);'], l: ['(no index)', 'index on id', 'index on email'] } }, sol: { idx: 'CREATE INDEX idx_email ON users(email);' },
  goals: [['The plan says USING INDEX', "rows.length > 0 && /USING (COVERING )?INDEX idx_email/.test(String(rows[0][3]))"]],
  hints: ['Index the column you search by.'],
  learn: { h: 'Indexes and query plans', x: 'Without an index, the plan says `SCAN users`: read all 5,000 rows. With an index on `email`, it says `SEARCH users USING INDEX`: jump straight to the row, like a book\'s index. Indexing `id` does nothing here, because the primary key is already indexed and you are not searching by id.\n\nIndexes speed up reads and slightly slow down writes. `EXPLAIN` is how pros find slow queries.', terms: ['index', 'big-o'] } });

// ---------- Book Shop Database project ----------
var BOOKS1 = "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, price {{type}});\nINSERT INTO books (title, price) VALUES ('Clean Code', '37.5'), ('Dune', '9.99'), ('SICP', '45'), ('The Hobbit', '12');";
var BOOKS = L("CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, price REAL, author_id INTEGER, stock INTEGER);", "CREATE TABLE authors (id INTEGER PRIMARY KEY, name TEXT);", "INSERT INTO authors VALUES (1,'Robert C. Martin'),(2,'Frank Herbert'),(3,'Abelson & Sussman'),(4,'J.R.R. Tolkien');", "INSERT INTO books VALUES (1,'Clean Code',37.5,1,4),(2,'Dune',9.99,2,12),(3,'SICP',45,3,2),(4,'The Hobbit',12,4,9),(5,'Clean Architecture',29,1,3),(6,'Children of Dune',11,2,7);", "CREATE TABLE sales (book_id INTEGER, copies INTEGER);", "INSERT INTO sales VALUES (1,2),(2,5),(4,3),(1,1),(6,2),(3,1),(2,1);");
CH({ id: 'books-1', t: 'sql', tier: 2, sb: 'sql', icon: '📚', title: 'Book shop: the books table', proj: ['books', 1], setup: '',
  story: 'Project: a database for a small book shop, built in 5 steps. First, design the books table. Sorting by price should put Dune ($9.99) first and SICP ($45) last. The column type decides how prices compare.',
  code: L(BOOKS1, 'SELECT title, price FROM books ORDER BY price;'), slots: { type: ['TEXT', 'BLOB', 'REAL'] }, sol: { type: 'REAL' },
  goals: [['Cheapest to priciest: Dune, The Hobbit, Clean Code, SICP', "names(rows) == 'Dune,The Hobbit,Clean Code,SICP'"]],
  hints: ['As text, "12" sorts before "9.99", because it compares character by character.', 'Prices are numbers: `REAL`.'],
  learn: { h: 'Column types matter', x: 'With `TEXT`, prices sort alphabetically: "12" < "37.5" < "45" < "9.99". With `REAL`, SQLite converts the inserted text to numbers and sorts numerically.\n\nPicking types is **schema design**. Getting it wrong early causes weird bugs months later. (Real shops store cents as INTEGER to avoid floating-point rounding.)', terms: ['schema', 'data-type'] } });
CH({ id: 'books-2', t: 'sql', tier: 2, sb: 'sql', icon: '✍️', title: 'Book shop: authors', proj: ['books', 2], setup: BOOKS,
  story: 'Authors live in their own table, and each book stores an `author_id`. List the books by **Frank Herbert**.',
  code: L('SELECT books.title FROM books', 'JOIN authors ON books.author_id = authors.id', 'WHERE {{w}}', 'ORDER BY books.title;'), slots: { w: ["books.id = 2", "authors.name = 'Herbert'", "authors.name = 'Frank Herbert'"] }, sol: { w: "authors.name = 'Frank Herbert'" },
  goals: [['Children of Dune and Dune', "names(rows) == 'Children of Dune,Dune'"]],
  hints: ['Filter on the author\'s full name.'],
  learn: { h: 'Why a separate authors table', x: 'If every book row repeated "Frank Herbert", a typo in one row would split him into two authors. A separate table with one row per author, referenced by id, is **normalization**. `books.id = 2` finds just one book. An id is a book identity, not an author.', terms: ['foreign-key', 'join', 'normalization'] } });
CH({ id: 'books-3', t: 'sql', tier: 2, sb: 'sql', icon: '👑', title: 'Book shop: prolific authors', proj: ['books', 3], setup: BOOKS,
  story: 'Which authors have **2 or more** books in the shop? Filtering on a count needs a different keyword than WHERE.',
  code: L('SELECT authors.name, COUNT(*) AS n FROM books', 'JOIN authors ON books.author_id = authors.id', 'GROUP BY authors.name', '{{h}} COUNT(*) >= 2', 'ORDER BY authors.name;'), slots: { h: ['WHERE', 'AND', 'HAVING'] }, sol: { h: 'HAVING' },
  goals: [['Frank Herbert and Robert C. Martin', "names(rows) == 'Frank Herbert,Robert C. Martin'"]],
  hints: ['WHERE filters rows **before** grouping. Which keyword filters groups afterwards?'],
  learn: { h: 'WHERE vs HAVING', x: '`WHERE` filters individual rows **before** grouping, so it cannot see `COUNT(*)` yet. `HAVING` filters **after** grouping. In SQL, the order you write clauses is not the order they run: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.', terms: ['group-by', 'aggregate'] } });
CH({ id: 'books-4', t: 'sql', tier: 3, sb: 'sql', icon: '📈', title: 'Book shop: best seller', proj: ['books', 4], setup: BOOKS,
  story: 'Which book earned the most **money**? That is copies sold × price, summed per book. The most-sold book is not the answer.',
  code: L('SELECT books.title, SUM({{e}}) AS revenue', 'FROM sales JOIN books ON sales.book_id = books.id', 'GROUP BY books.title', 'ORDER BY revenue DESC LIMIT 1;'), slots: { e: ['sales.copies', 'books.price', 'sales.copies * books.price'] }, sol: { e: 'sales.copies * books.price' },
  goals: [['Clean Code with 112.5', "rows.length == 1 && rows[0][0] == 'Clean Code' && Math.abs(rows[0][1] - 112.5) < 0.001"]],
  hints: ['Dune sold the most copies (6), but it is cheap.', 'Multiply copies by price inside SUM.'],
  learn: { h: 'Ask the right question', x: 'By copies, Dune wins with 6. By revenue, Clean Code wins: 3 × $37.50 = $112.50. Same data, different question, different answer. Half of data work is pinning down which question the business is actually asking.', terms: ['aggregate', 'join'] } });
CH({ id: 'books-5', t: 'sql', tier: 3, sb: 'sql', icon: '🚚', title: 'Book shop: restock report', proj: ['books', 5], setup: BOOKS,
  story: 'Save a reusable **view** that lists books with fewer than 5 in stock, so the shop can check it every morning with one SELECT.',
  code: L('CREATE VIEW restock AS', '  SELECT title, stock FROM books WHERE stock {{op}} {{n}};', 'SELECT * FROM restock ORDER BY stock;'), slots: { op: ['>', '=', '<'], n: { n: [0, 10, 1], s: 0 } }, sol: { op: '<', n: 5 },
  goals: [['SICP, Clean Architecture, Clean Code', "names(rows) == 'SICP,Clean Architecture,Clean Code'"], ['The view exists', "(q1(\"SELECT COUNT(*) FROM sqlite_master WHERE type='view' AND name='restock'\")||[[0]])[0][0] == 1"]],
  hints: ['Fewer than 5 in stock.'],
  learn: { h: 'Views', x: 'A **view** is a saved query that acts like a table. It always shows current data, because it re-runs each time. Reports, dashboards and permissions are often built on views.\n\n📚 Your book shop database is complete. Open it in the 🏗️ Workshop and run your own queries.', terms: ['view', 'schema'] } });
