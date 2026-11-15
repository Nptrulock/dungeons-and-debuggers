U('data', 1, 'da-what', 'What Is Data?', '🗄️', ['data', 'database', 'table', 'row'], [
 ['mc', 'A database is…', ['An organized place where an app stores data so it lasts', 'A spreadsheet app only', 'A website', 'A programming language'], 'Without a database, everything disappears when the app restarts.'],
 ['match', 'Match the spreadsheet idea to its database name.', [['Sheet', 'Table'], ['Row', 'Record (one item)'], ['Column', 'Field (one attribute)']], 'A users table has one row per user and columns like name and email.'],
 ['mc', 'Which data would an online store keep in a database?', ['Products, orders, customers', 'Button colors', 'The CSS file', 'Font sizes'], 'Databases hold the facts the business runs on.'],
 ['tf', 'Saving data in a browser\'s localStorage is the same as saving it in a server database.', false, 'localStorage lives on one device and can be cleared. A server database is shared and durable. (This game uses localStorage, which is why you should export saves.)'],
 ['mc', 'Each row in a table usually has a unique…', ['ID (primary key)', 'Color', 'Password', 'File path'], 'A unique id lets you point to exactly one record, even if two users share a name.'],
 ['mc', 'Why not just store everything in one giant text file?', ['Finding, updating and sharing data safely becomes slow and error-prone', 'Text files are illegal', 'It is faster', 'Computers cannot read text'], 'Databases handle searching, concurrent edits and crashes for you.']
]);
U('data', 2, 'da-sql1', 'SQL: Asking Questions', '🔎', ['sql', 'query', 'select', 'where'], [
 ['mc', 'SQL is…', ['A language for asking questions of (querying) databases', 'A spreadsheet', 'A web browser', 'A type of server'], 'Structured Query Language reads almost like English.'],
 ['mc', 'What does this return?', ['Every column of every row in users', 'Only the first user', 'Nothing', 'The table name'], '* means "all columns." No WHERE means all rows.', 'SELECT * FROM users;'],
 ['mc', 'What does this return?', ['Names of users older than 30', 'All users', 'Ages of all users', 'An error'], 'SELECT picks columns; WHERE filters rows.', 'SELECT name FROM users WHERE age > 30;'],
 ['fill', 'Get only products cheaper than 20.', 'SELECT * FROM products ___ price < 20;', ['WHERE'], ['IF', 'WHEN', 'FILTER'], 'WHERE is SQL\'s filter.'],
 ['order', 'Arrange the query in valid order.', ['SELECT name, price', 'FROM products', 'WHERE price < 20', 'ORDER BY price'], 'SQL clauses have a fixed order: SELECT, FROM, WHERE, ORDER BY.'],
 ['mc', 'ORDER BY price DESC sorts…', ['Highest price first', 'Lowest price first', 'Alphabetically', 'Randomly'], 'DESC = descending. ASC (the default) = ascending.'],
 ['mc', 'What does LIMIT 5 do?', ['Returns at most 5 rows', 'Limits price to 5', 'Deletes 5 rows', 'Sets 5 columns'], 'Handy for "top 5" lists and for peeking at big tables.'],
 ['mc', 'Which counts how many users there are?', ['SELECT COUNT(*) FROM users;', 'SELECT users;', 'COUNT users;', 'SELECT SUM(users);'], 'COUNT, SUM, AVG, MIN and MAX are aggregate functions.'],
 ['mc', 'In SQL, text values go in…', ["Single quotes: WHERE city = 'Detroit'", 'No quotes', 'Curly braces', 'Backslashes'], "Standard SQL uses single quotes for strings."]
]);
U('data', 2, 'da-sql2', 'SQL: Changing Data', '✏️', ['insert', 'update', 'delete'], [
 ['match', 'Match the SQL command to its action.', [['INSERT', 'Add rows'], ['UPDATE', 'Change rows'], ['DELETE', 'Remove rows'], ['SELECT', 'Read rows']], 'Together these are CRUD: Create, Read, Update, Delete.'],
 ['mc', 'What does this do?', ['Deletes EVERY row in users', 'Deletes one user', 'Deletes the database', 'Errors'], 'No WHERE means every row. This is one of the most feared mistakes in SQL.', 'DELETE FROM users;'],
 ['bug', 'Which line is dangerous?', ["UPDATE accounts", "SET balance = 0;"], 1, 'Without a WHERE clause, every account\'s balance becomes 0. It should end with something like WHERE id = 42;'],
 ['mc', 'What does this do?', ["Adds a new user named Ana", 'Finds Ana', 'Deletes Ana', 'Renames the table'], 'INSERT INTO table (columns) VALUES (values).', "INSERT INTO users (name, age) VALUES ('Ana', 30);"],
 ['tf', 'Before running an UPDATE or DELETE, it is wise to run a SELECT with the same WHERE first.', true, 'Preview exactly which rows will change. Experienced developers do this habitually.'],
 ['mc', 'CRUD stands for…', ['Create, Read, Update, Delete', 'Code, Run, Use, Debug', 'Copy, Replace, Undo, Do', 'Cache, Route, Upload, Download'], 'Most apps are CRUD apps at their core.']
]);
U('data', 3, 'da-schema', 'Schemas & Relationships', '🔗', ['schema', 'primary-key', 'foreign-key', 'join'], [
 ['mc', 'A schema is…', ['The structure of the data: tables, columns and their types', 'A scam', 'A query result', 'A backup'], 'It is the blueprint of the database.'],
 ['mc', 'A foreign key is…', ['A column that points to a row in another table', 'A key from another country', 'An encrypted password', 'The first column'], 'orders.user_id points to users.id, linking each order to its customer.'],
 ['mc', 'Why store user_id in orders instead of copying the user\'s name and address into every order?', ['To avoid duplicated data that can go out of sync', 'Names are too long', 'SQL forbids text', 'It is slower'], 'Store facts once and link to them. This is called normalization.'],
 ['mc', 'A JOIN…', ['Combines rows from two tables using a related column', 'Adds a new table', 'Deletes duplicates', 'Merges two databases'], 'JOINs answer questions like "show each order with its customer\'s name."', 'SELECT orders.id, users.name\nFROM orders\nJOIN users ON orders.user_id = users.id;'],
 ['match', 'Match the relationship.', [['A user has many orders', 'One-to-many'], ['A user has one profile', 'One-to-one'], ['Students and classes', 'Many-to-many']], 'Many-to-many needs a "join table" like enrollments(student_id, class_id).'],
 ['mc', 'A migration is…', ['A versioned script that changes the database schema', 'Moving to a new office', 'A data backup', 'A server restart'], 'Migrations let every environment\'s schema change in the same, repeatable way.'],
 ['tf', 'Column types (integer, text, date) help catch bad data before it is saved.', true, 'A date column will reject "banana."']
]);
U('data', 3, 'da-safety', 'Data Safety', '💉', ['sql-injection', 'backup', 'index'], [
 ['mc', 'SQL injection happens when…', ['User input is pasted directly into a SQL string and runs as code', 'A database gets a vaccine', 'Queries are too slow', 'Tables are too big'], 'Input like  \' OR 1=1 --  can change the meaning of the query.'],
 ['diff', 'An AI wrote this. What is the problem?', ['User input is concatenated into SQL: SQL injection risk', 'Nothing', 'SELECT should be lowercase', 'It uses a variable'], 'Use parameterized queries: db.query("SELECT * FROM users WHERE email = $1", [email]).', 'const q = "SELECT * FROM users WHERE email = \'" + email + "\'"\ndb.query(q)'],
 ['mc', 'A database index…', ['Speeds up lookups on a column, like a book\'s index', 'Lists all tables', 'Encrypts data', 'Counts rows'], 'Indexes make reads faster but writes slightly slower and use space.'],
 ['tf', 'A backup you have never tested restoring might not actually work.', true, 'Teams practice restores. An untested backup is a hope, not a plan.'],
 ['mc', 'Which should NEVER be stored in plain text?', ['Passwords', 'Product names', 'Order dates', 'Prices'], 'Passwords are stored hashed (e.g. bcrypt, argon2) so even a leak does not reveal them.'],
 ['mc', 'A transaction guarantees…', ['A group of changes all succeed or all fail together', 'Payment processing', 'Faster queries', 'A backup'], 'Moving money: subtract from A and add to B must both happen, or neither.']
]);
U('data', 4, 'da-scale', 'Data at Scale', '📈', ['sql-vs-nosql', 'cache', 'n-plus-one'], [
 ['mc', 'NoSQL databases (like MongoDB) typically…', ['Store flexible documents instead of fixed tables', 'Cannot store data', 'Are always faster', 'Use no queries at all'], 'Both SQL and NoSQL are valid; the choice depends on the shape of your data and needs.'],
 ['mc', 'The "N+1 query problem" is…', ['Running one query for a list, then one more per item, instead of one combined query', 'A math puzzle', 'Having N+1 tables', 'A login bug'], '100 posts → 101 queries. Fix with a JOIN or batch loading. AI-written code does this often.'],
 ['mc', 'A cache (like Redis) is used to…', ['Keep frequently-read data in fast memory', 'Store money', 'Permanently store everything', 'Back up the database'], 'Caches are fast but can serve stale data, so you need a plan for invalidation.'],
 ['tf', '"There are only two hard things in computer science: cache invalidation and naming things."', true, 'A famous quote by Phil Karlton, and painfully true.'],
 ['mc', 'Read replicas help by…', ['Spreading read traffic across copies of the database', 'Making writes faster', 'Deleting old data', 'Encrypting backups'], 'Writes go to the primary; reads can go to replicas, which may lag slightly.'],
 ['mc', 'Vector databases are commonly used in AI apps to…', ['Find text with similar meaning (semantic search) for RAG', 'Draw vector graphics', 'Store passwords', 'Run SQL faster'], 'Text is turned into embeddings (lists of numbers); similar meanings land close together.']
]);
U('data', 5, 'da-privacy', 'Data Ethics & Privacy', '🔏', ['pii', 'least-privilege'], [
 ['mc', 'PII means…', ['Personally Identifiable Information, like names, emails, addresses', 'Public Internet Index', 'Primary Index ID', 'Page Insight Info'], 'PII must be protected and often has legal rules (GDPR, CCPA).'],
 ['mc', 'Least privilege means…', ['Each person or service gets only the access it needs', 'Everyone is an admin', 'No one gets access', 'Interns do everything'], 'If a key leaks, least privilege limits the damage.'],
 ['tf', 'Sending customer data to a third-party AI service may require checking your privacy policy and agreements first.', true, 'Data you send to outside services may be stored or processed elsewhere. Check what is allowed.'],
 ['mc', 'Data minimization means…', ['Collecting only the data you actually need', 'Compressing data', 'Deleting all data', 'Using small fonts'], 'Data you do not have cannot leak.'],
 ['mc', 'Logs accidentally contain users\' passwords. Best response?', ['Stop logging them, purge the logs, and review how it happened', 'Ignore it', 'Make the logs public', 'Email users their passwords'], 'Treat it as a security incident, fix the root cause, then clean up.']
]);
