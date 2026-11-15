U('code', 1, 'cd-what', 'What Is Code?', '📜', ['code', 'language', 'syntax', 'comment'], [
 ['mc', 'Code is…', ['Instructions written in a language computers can run', 'A secret password', 'A type of hardware', 'Only numbers'], 'Code is text: human-readable instructions in a programming language.'],
 ['mc', 'JavaScript and Python are both…', ['Programming languages', 'Web browsers', 'Databases', 'Operating systems'], 'They are two of the most popular languages. JavaScript runs in every browser; Python is popular for scripts, data and AI.'],
 ['mc', '"Syntax" means…', ['The grammar rules of a programming language', 'How fast the code runs', 'The color of the code', 'A list of bugs'], 'Like grammar in English, syntax rules say where brackets, quotes and punctuation go. Break them and the code will not run.'],
 ['mc', 'What does this line do?', ['Nothing — it is a comment for humans', 'Prints "say hi"', 'Deletes a file', 'Causes an error'], 'Lines starting with // in JavaScript (or # in Python) are comments. The computer skips them.', '// say hi to the user'],
 ['match', 'Match the comment style to the language.', [['// note', 'JavaScript'], ['# note', 'Python'], ['<!-- note -->', 'HTML']], 'Each language marks comments differently, but they all do the same thing: notes the computer ignores.'],
 ['tf', 'Code is read by people far more often than it is written.', true, 'You and teammates (and AI tools) will reread code many times. That is why clarity matters.'],
 ['out', 'What does this JavaScript show?', ['Hello', 'console.log', '"Hello"', 'Nothing'], 'console.log prints whatever is in the parentheses. The quotes mark text but are not shown.', 'console.log("Hello")'],
 ['out', 'What does this Python print?', ['Hi', 'print', 'print("Hi")', 'Error'], 'print() is Python\'s way of showing output.', 'print("Hi")'],
 ['tf', 'In most languages, capital letters matter: "Name" and "name" are different.', true, 'Most languages are case-sensitive. A capital letter typo is a very common bug.']
]);
U('code', 1, 'cd-vars', 'Variables', '📦', ['variable', 'assignment', 'value'], [
 ['mc', 'A variable is…', ['A named box that holds a value', 'A math equation that must balance', 'An error', 'A website'], 'Think of a labeled box. The label is the name; what is inside is the value.'],
 ['mc', 'In JavaScript, what does = do here?', ['Puts the value 10 into the box named score', 'Checks if score equals 10', 'Adds 10 to score', 'Compares two numbers'], 'A single = is assignment: "store this value in this name." It is not a math "equals" question.', 'let score = 10'],
 ['out', 'What gets printed?', ['8', '5', '3', '53'], 'The box first holds 5, then is replaced with 8. Variables hold their latest value.', 'let lives = 5\nlives = 8\nconsole.log(lives)'],
 ['out', 'What does this Python print?', ['Mia', 'name', '"name"', 'Error'], 'print(name) shows the value stored in the variable, not the word "name".', 'name = "Mia"\nprint(name)'],
 ['fill', 'Create a JavaScript variable named age holding 30.', 'let age ___ 30', ['='], ['==', ':', '=>'], 'One = assigns. == is used for comparing.'],
 ['mc', 'In JavaScript, what is the difference between let and const?', ['const cannot be reassigned; let can', 'let is faster', 'const is only for text', 'There is no difference'], 'Use const for values that should not change, and let for ones that will. Many developers default to const.'],
 ['bug', 'Which line causes an error?', ['const max = 10', 'console.log(max)', 'max = 20'], 2, 'max was declared with const, so it cannot be reassigned. JavaScript throws "Assignment to constant variable."'],
 ['out', 'What is printed?', ['15', '10', '5', '105'], 'points + 5 reads the current value (10), adds 5, and stores 15 back into points.', 'let points = 10\npoints = points + 5\nconsole.log(points)'],
 ['tf', 'In Python you do not need "let" or "const" to create a variable.', true, 'In Python you just write name = value.']
]);
U('code', 1, 'cd-types', 'Strings, Numbers, Booleans', '🔤', ['string', 'number', 'boolean', 'data-type'], [
 ['match', 'Match the value to its type.', [['"hello"', 'String (text)'], ['42', 'Number'], ['true', 'Boolean']], 'Text in quotes is a string; numbers are numbers; true/false are booleans.'],
 ['mc', 'A boolean can only be…', ['true or false', 'Any number', 'Any text', 'A list'], 'Booleans are yes/no values, the basis of every decision a program makes.'],
 ['out', 'What does this JavaScript print?', ['55', '10', '5+5', 'Error'], 'Both are strings (in quotes), so + joins them like gluing text: "5" + "5" = "55".', 'console.log("5" + "5")'],
 ['out', 'What does this print?', ['10', '55', '"10"', 'Error'], 'Without quotes these are numbers, so + does addition.', 'console.log(5 + 5)'],
 ['out', 'What is printed?', ['Hi Sam', 'HiSam', 'Hi + Sam', 'Error'], 'Joining strings is called concatenation. The space inside "Hi " is kept.', 'let name = "Sam"\nconsole.log("Hi " + name)'],
 ['mc', 'Which is a string?', ['"42"', '42', 'true', '3.14'], 'Quotes make it text, even if it looks like a number. This difference causes lots of real bugs.'],
 ['out', 'What does this Python print?', ['ha ha ha ', 'ha 3', 'Error', '9'], 'In Python, a string times a number repeats the string.', 'print("ha " * 3)'],
 ['out', 'What does .length give?', ['5', '4', '6', '"apple"'], 'In JavaScript .length counts the characters in a string: a-p-p-l-e = 5.', 'console.log("apple".length)'],
 ['mc', 'Why does the type of a value matter?', ['It decides what operations do, like + adding or joining', 'It changes the font', 'It does not matter', 'Only for colors'], '+ adds numbers but joins strings. Knowing the type tells you what code will actually do.']
]);
U('code', 1, 'cd-compare', 'Comparisons', '🟰', ['comparison', 'boolean'], [
 ['out', 'What does this print?', ['true', 'false', '5', 'Error'], '> asks "is the left bigger?" 7 is bigger than 5, so the answer is the boolean true.', 'console.log(7 > 5)'],
 ['match', 'Match the operator to its meaning.', [['===', 'Equal to'], ['!==', 'Not equal to'], ['>=', 'Greater than or equal'], ['<', 'Less than']], 'Comparison operators always produce true or false.'],
 ['mc', 'In JavaScript, which checks equality strictly (value AND type)?', ['===', '=', '==', '=>'], '=== is strict equality. == tries to convert types first, which surprises people. Most teams always use ===.'],
 ['out', 'What does this print?', ['false', 'true', 'Error', '"5"'], 'Strict equality also compares types. A number is not the same type as a string, so it is false.', 'console.log(5 === "5")'],
 ['out', 'What does this Python print?', ['True', 'False', 'Error', '3'], 'Python uses == for equality and capitalizes True/False.', 'print(3 == 3)'],
 ['mc', 'What is the mistake?', ['It assigns 10 instead of comparing, so the check is always true', 'Nothing', 'if needs a semicolon', 'score must be a string'], 'A single = assigns. To compare you need === (or == in Python). This is a classic bug.', 'if (score = 10) { win() }'],
 ['out', 'What does this print?', ['true', 'false', 'Error', 'undefined'], '&& means AND: both sides must be true. 5 > 3 is true and 2 < 4 is true.', 'console.log(5 > 3 && 2 < 4)'],
 ['out', 'What does this print?', ['true', 'false', 'Error', 'null'], '|| means OR: true if at least one side is true.', 'console.log(1 > 9 || 2 === 2)'],
 ['out', 'What does this print?', ['false', 'true', '!true', 'Error'], '! means NOT; it flips true to false.', 'console.log(!true)']
]);
U('code', 2, 'cd-if', 'If / Else', '🔀', ['if-statement', 'condition', 'block'], [
 ['out', 'What is printed?', ['Adult', 'Kid', 'Both', 'Nothing'], 'age >= 18 is true (20 is at least 18), so the first block runs and else is skipped.', 'let age = 20\nif (age >= 18) {\n  console.log("Adult")\n} else {\n  console.log("Kid")\n}'],
 ['out', 'What does this Python print?', ['cold', 'hot', 'hot cold', 'Nothing'], 'temp > 30 is false, so the else branch runs. Python uses indentation and a colon instead of braces.', 'temp = 12\nif temp > 30:\n    print("hot")\nelse:\n    print("cold")'],
 ['out', 'What prints?', ['B', 'A', 'C', 'A B'], 'Checks run top to bottom; the FIRST true one wins. 85 >= 90 is false; 85 >= 80 is true, so "B".', 'let s = 85\nif (s >= 90) console.log("A")\nelse if (s >= 80) console.log("B")\nelse console.log("C")'],
 ['mc', 'In Python, what marks which lines are "inside" the if?', ['Indentation (spaces at the start of lines)', 'Curly braces {}', 'Semicolons', 'Capital letters'], 'Python uses indentation to group lines. JavaScript uses { }. Wrong indentation in Python is a real error.'],
 ['bug', 'Which line has the bug? (Python)', ['if lives == 0', '    print("Game over")'], 0, 'Python needs a colon at the end of an if line: if lives == 0:'],
 ['fill', 'Complete the JavaScript so it prints "Free" when price is 0.', 'if (price ___ 0) {\n  console.log("Free")\n}', ['==='], ['=', '=>', '!=='], 'Use === to compare. A single = would assign 0 to price.'],
 ['out', 'What prints?', ['Nothing', 'Welcome', 'Error', 'false'], 'loggedIn is false, so the if block is skipped, and there is no else.', 'let loggedIn = false\nif (loggedIn) {\n  console.log("Welcome")\n}'],
 ['order', 'Arrange this Python so it prints "even" for even numbers.', ['n = 4', 'if n % 2 == 0:', '    print("even")', 'else:', '    print("odd")'], 'Set the value, check it, then the two branches. % gives the remainder; even numbers have remainder 0 when divided by 2.'],
 ['out', 'What prints?', ['Sale!', 'Full price', 'Error', 'Nothing'], 'onSale is true AND stock > 0 is true, so the whole condition is true.', 'let onSale = true\nlet stock = 3\nif (onSale && stock > 0) console.log("Sale!")\nelse console.log("Full price")']
]);
U('code', 2, 'cd-loops', 'Loops', '🔁', ['loop', 'iteration', 'infinite-loop'], [
 ['out', 'How many times does this print "hi"?', ['3', '2', '4', 'Forever'], 'i starts at 0 and runs while i < 3: 0, 1, 2. That is 3 times.', 'for (let i = 0; i < 3; i++) {\n  console.log("hi")\n}'],
 ['out', 'What does this Python print?', ['0 1 2 (one per line)', '1 2 3', '0 1 2 3', '3'], 'range(3) gives 0, 1, 2. Counting from 0 is normal in programming.', 'for i in range(3):\n    print(i)'],
 ['mc', 'In for (let i = 0; i < 5; i++), what does i++ do?', ['Adds 1 to i after each loop', 'Doubles i', 'Ends the loop', 'Prints i'], 'i++ is short for i = i + 1. It moves the counter forward.'],
 ['out', 'What prints?', ['red, then blue (one per line)', 'colors', '0, then 1', 'red blue as one line'], 'for...of goes through each item of the list in order.', 'const colors = ["red", "blue"]\nfor (const c of colors) {\n  console.log(c)\n}'],
 ['mc', 'What is wrong with this loop?', ['n never changes, so it loops forever', 'while is not real JavaScript', 'n should be a string', 'Nothing'], 'If the condition never becomes false, the loop never stops: an infinite loop. It needs n = n + 1 inside.', 'let n = 0\nwhile (n < 5) {\n  console.log(n)\n}'],
 ['out', 'What is the total?', ['6', '3', '123', '0'], 'The loop adds each number: 0+1=1, 1+2=3, 3+3=6.', 'let total = 0\nfor (const x of [1, 2, 3]) {\n  total = total + x\n}\nconsole.log(total)'],
 ['out', 'What does this Python print?', ['Hi Ana, then Hi Bo', 'Hi names', 'Ana Bo', 'Error'], 'The loop puts each name into n, one at a time.', 'for n in ["Ana", "Bo"]:\n    print("Hi " + n)'],
 ['mc', 'Which keyword stops a loop early?', ['break', 'stop', 'end', 'exit'], 'break jumps out of the loop immediately. continue skips to the next round.'],
 ['tf', 'A while loop keeps going as long as its condition is true.', true, 'Each round it re-checks the condition and stops once it is false.']
]);
U('code', 2, 'cd-lists', 'Lists (Arrays)', '📋', ['array', 'index', 'list'], [
 ['mc', 'An array (Python calls it a list) is…', ['An ordered collection of values', 'A single number', 'A type of loop', 'A web page'], 'Arrays hold many values in order: ["milk", "eggs", "bread"].'],
 ['out', 'What prints?', ['cat', 'dog', 'bird', 'Error'], 'Indexes start at 0. pets[0] is the first item.', 'const pets = ["cat", "dog", "bird"]\nconsole.log(pets[0])'],
 ['out', 'What prints?', ['bird', 'dog', 'cat', 'undefined'], 'Index 2 is the third item (0, 1, 2).', 'const pets = ["cat", "dog", "bird"]\nconsole.log(pets[2])'],
 ['out', 'What prints?', ['3', '2', '4', '"cat"'], '.length counts the items. Last index is always length - 1.', 'const pets = ["cat", "dog", "bird"]\nconsole.log(pets.length)'],
 ['out', 'What prints?', ['["a", "b", "c"]', '["a", "b"]', '["c", "a", "b"]', 'Error'], 'push adds an item to the END of the array.', 'const xs = ["a", "b"]\nxs.push("c")\nconsole.log(xs)'],
 ['out', 'What does this Python print?', ['3', '1', '2', 'Error'], 'len() gives the number of items in a Python list.', 'nums = [4, 8, 15]\nprint(len(nums))'],
 ['out', 'What does this Python print?', ['15', '4', '8', 'Error'], 'In Python, index -1 means the last item.', 'nums = [4, 8, 15]\nprint(nums[-1])'],
 ['out', 'What prints?', ['undefined', '"z"', 'Error: out of range', '0'], 'In JavaScript, reading past the end gives undefined (Python would raise an IndexError).', 'const xs = ["x", "y"]\nconsole.log(xs[5])'],
 ['fill', 'Get the FIRST item.', 'const first = items[___]', ['0'], ['1', 'first', '-1'], 'Zero-based indexing: the first item is at index 0.']
]);
U('code', 2, 'cd-funcs', 'Functions', '⚙️', ['function', 'parameter', 'argument', 'return'], [
 ['mc', 'A function is…', ['A named, reusable set of steps', 'A type of variable that holds text', 'An error message', 'A file'], 'Functions let you write steps once and run them whenever you want by name.'],
 ['out', 'What prints?', ['Hi Lee', 'Hi name', 'greet', 'Nothing'], 'Calling greet("Lee") sets name to "Lee" inside the function.', 'function greet(name) {\n  console.log("Hi " + name)\n}\ngreet("Lee")'],
 ['mc', 'In function add(a, b), what are a and b?', ['Parameters: placeholders for inputs', 'Return values', 'Global variables', 'Loops'], 'Parameters are the input slots. The actual values you pass in, like add(2, 3), are called arguments.'],
 ['out', 'What prints?', ['5', 'a + b', '23', 'undefined'], 'return sends a value back to whoever called the function.', 'function add(a, b) {\n  return a + b\n}\nconsole.log(add(2, 3))'],
 ['out', 'What prints?', ['undefined', '5', '0', 'Error'], 'This function adds but never returns, so the caller gets undefined. A forgotten return is a very common bug.', 'function add(a, b) {\n  const s = a + b\n}\nconsole.log(add(2, 3))'],
 ['out', 'What does this Python print?', ['10', 'double', 'x * 2', 'None'], 'def defines a function in Python. double(5) returns 10.', 'def double(x):\n    return x * 2\n\nprint(double(5))'],
 ['mc', 'What does "calling" a function mean?', ['Running it, e.g. greet()', 'Defining it', 'Deleting it', 'Naming it'], 'Defining describes the steps; calling actually runs them. The parentheses () do the calling.'],
 ['out', 'What prints?', ['Done', 'Nothing', 'Error', 'finish'], 'This one is an arrow function, a shorter JavaScript way to write a function.', 'const finish = () => {\n  console.log("Done")\n}\nfinish()'],
 ['out', 'What prints?', ['Start', 'Start, then Saved', 'Saved', 'Nothing'], 'The function save is defined but never called, so "Saved" never prints.', 'function save() {\n  console.log("Saved")\n}\nconsole.log("Start")'],
 ['fill', 'Make the function give back the area.', 'function area(w, h) {\n  ___ w * h\n}', ['return'], ['print', 'give', 'send'], 'return hands the result back to the caller.']
]);
U('code', 2, 'cd-objects', 'Objects & Dictionaries', '🗃️', ['object', 'key-value', 'property'], [
 ['mc', 'An object (in Python: dictionary) stores…', ['Named values: key → value pairs', 'Only numbers', 'Values in a numbered order only', 'Code files'], 'Objects describe a thing with labeled fields: { name: "Ana", age: 30 }.'],
 ['out', 'What prints?', ['Ana', 'name', 'user', 'undefined'], 'Dot notation reads a property: user.name.', 'const user = { name: "Ana", age: 30 }\nconsole.log(user.name)'],
 ['out', 'What prints?', ['30', 'age', '"age"', 'Error'], 'Bracket notation with a string key works too: user["age"].', 'const user = { name: "Ana", age: 30 }\nconsole.log(user["age"])'],
 ['out', 'What does this Python print?', ['Blue', 'color', 'car', 'Error'], 'Python dictionaries use square brackets with the key.', 'car = {"color": "Blue", "doors": 4}\nprint(car["color"])'],
 ['out', 'What prints?', ['undefined', 'Error', 'null', '""'], 'Reading a property that does not exist gives undefined in JavaScript. (Python raises KeyError for missing dictionary keys.)', 'const user = { name: "Ana" }\nconsole.log(user.email)'],
 ['out', 'What prints?', ['31', '30', '3031', 'Error'], 'You can update a property just like a variable.', 'const user = { age: 30 }\nuser.age = user.age + 1\nconsole.log(user.age)'],
 ['match', 'Match the part of { "id": 7 } to its name.', [['"id"', 'Key'], ['7', 'Value'], ['"id": 7', 'Key-value pair']], 'Keys are labels; values are the data. Together they make a pair.'],
 ['out', 'What prints?', ['Pizza', 'orders', '0', 'undefined'], 'Arrays of objects are everywhere in real apps. orders[0] is the first object; .item reads its field.', 'const orders = [\n  { item: "Pizza", qty: 2 },\n  { item: "Soda", qty: 1 }\n]\nconsole.log(orders[0].item)']
]);
U('code', 3, 'cd-methods', 'Handy Methods', '🧰', ['method', 'map', 'filter'], [
 ['out', 'What prints?', ['[2, 4, 6]', '[1, 2, 3]', '6', '[1, 2, 3, 2]'], 'map makes a NEW array by applying a function to each item.', 'const nums = [1, 2, 3]\nconsole.log(nums.map(n => n * 2))'],
 ['out', 'What prints?', ['[4, 6]', '[1, 2, 3, 4, 5, 6]', '[1, 2, 3]', '2'], 'filter keeps only items where the function returns true.', 'const nums = [1, 4, 2, 6]\nconsole.log(nums.filter(n => n > 3))'],
 ['out', 'What prints?', ['HELLO', 'hello', 'Hello', 'Error'], 'Methods are functions attached to a value. toUpperCase returns a capitalized copy.', 'console.log("hello".toUpperCase())'],
 ['out', 'What prints?', ['true', 'false', '"cat"', 'Error'], 'includes checks whether the array contains the value.', 'console.log(["cat", "dog"].includes("cat"))'],
 ['out', 'What prints?', ['["a", "b", "c"]', '"a,b,c"', '[a b c]', 'Error'], 'split cuts a string into an array at each comma.', 'console.log("a,b,c".split(","))'],
 ['out', 'What does this Python print?', ['[1, 2, 3]', '[3, 2, 1]', 'None', 'Error'], 'sorted() returns a new sorted list.', 'print(sorted([3, 1, 2]))'],
 ['out', 'What prints?', ['Bo', 'Ana', '["Bo"]', 'undefined'], 'find returns the FIRST matching item itself, not an array.', 'const users = [{ n: "Ana", age: 15 }, { n: "Bo", age: 22 }]\nconsole.log(users.find(u => u.age >= 18).n)'],
 ['match', 'Match the array method to what it does.', [['map', 'Transform every item'], ['filter', 'Keep some items'], ['find', 'Get the first match'], ['push', 'Add to the end']], 'These four cover a huge share of everyday array code.'],
 ['out', 'What prints? (watch the trim)', ['"hi"', '"  hi  "', '"hi  "', 'Error'], 'trim removes spaces from both ends. It is often used on form inputs.', 'console.log(JSON.stringify("  hi  ".trim()))']
]);
U('code', 3, 'cd-scope', 'Scope & Mutability', '🔭', ['scope', 'global', 'mutation'], [
 ['mc', 'Scope means…', ['Where in the code a variable can be seen and used', 'How big a program is', 'The speed of a loop', 'A testing tool'], 'A variable created inside a function usually only exists inside that function.'],
 ['out', 'What happens?', ['Error: secret is not defined', 'Prints 42', 'Prints undefined', 'Prints secret'], 'secret lives inside the function scope. Outside it does not exist.', 'function f() {\n  const secret = 42\n}\nf()\nconsole.log(secret)'],
 ['out', 'What prints?', ['["x", "y"]', '["x"]', 'Error', '[]'], 'const stops reassigning the name, but the array itself can still be changed (mutated).', 'const list = ["x"]\nlist.push("y")\nconsole.log(list)'],
 ['out', 'What prints?', ['2', '1', 'undefined', 'Error'], 'b and a point to the SAME object. Changing b.n changes what a sees too. This surprises many beginners.', 'const a = { n: 1 }\nconst b = a\nb.n = 2\nconsole.log(a.n)'],
 ['tf', 'Global variables that many parts of the code change are a common source of bugs.', true, 'When anything can change it, it is hard to know who broke it. Developers keep state as local as possible.'],
 ['out', 'What prints?', ['1', '2', 'undefined', 'Error'], 'The inner x is a different variable that only exists inside the block. The outer x is still 1.', 'let x = 1\n{\n  let x = 2\n}\nconsole.log(x)'],
 ['mc', 'Copying an object with { ...a } creates…', ['A new shallow copy, so changing top-level fields of the copy does not affect a', 'The same object', 'An error', 'An array'], 'The spread syntax makes a new object. "Shallow" means nested objects inside are still shared.']
]);
U('code', 3, 'cd-async', 'Async & Waiting', '⏳', ['async', 'promise', 'await', 'callback'], [
 ['mc', 'Why does code need "async" behavior?', ['Some tasks (network, files) take time and the app should not freeze while waiting', 'To make math faster', 'To hide bugs', 'Because computers are lazy'], 'Async code starts a slow task and continues; the result arrives later.'],
 ['out', 'In what order do these print?', ['A, C, B', 'A, B, C', 'B, A, C', 'C, B, A'], 'setTimeout schedules B for later (even with 0 ms), so the rest of the code runs first.', 'console.log("A")\nsetTimeout(() => console.log("B"), 0)\nconsole.log("C")'],
 ['mc', 'A Promise in JavaScript is…', ['An object representing a value that will be ready later (or fail)', 'A guarantee the code has no bugs', 'A type of loop', 'A comment'], 'Promises are "IOUs": pending now, then fulfilled with a value or rejected with an error.'],
 ['mc', 'What does await do here?', ['Pauses this function until the fetch finishes, then gives the result', 'Makes fetch faster', 'Cancels the request', 'Runs fetch twice'], 'await waits for a Promise inside an async function, so the code reads top to bottom.', 'async function load() {\n  const res = await fetch("/api/user")\n  const user = await res.json()\n}'],
 ['bug', 'Which line has the bug?', ['async function getUser() {', '  const data = fetch("/api/user").json()', '  return data', '}'], 1, 'fetch returns a Promise, not a response. It needs await: (await fetch(...)).json(), and .json() also needs awaiting.'],
 ['mc', 'What should async code usually include?', ['Error handling (try/catch) because network calls can fail', 'Infinite loops', 'Global variables', 'Nothing extra'], 'Networks fail. Async code that ignores errors leaves users staring at a spinner forever.'],
 ['tf', 'You can only use await inside an async function (or at the top level of a module).', true, 'That is a JavaScript rule. Using await elsewhere is a syntax error.']
]);
U('code', 3, 'cd-errors', 'Errors & Null', '🕳️', ['null', 'undefined', 'exception', 'try-catch'], [
 ['mc', 'null and undefined both mean…', ['"No value here"', 'Zero', 'An empty string only', 'An error happened'], 'They represent missing values. undefined usually means "never set"; null usually means "deliberately empty".'],
 ['out', 'What happens?', ['TypeError: cannot read properties of null', 'Prints null', 'Prints ""', 'Prints Ana'], 'You cannot read a property of nothing. This is one of the most common errors in JavaScript.', 'const user = null\nconsole.log(user.name)'],
 ['out', 'What prints?', ['undefined', 'Error', 'null', '""'], 'Optional chaining ?. stops safely and gives undefined if user is null.', 'const user = null\nconsole.log(user?.name)'],
 ['out', 'What prints?', ['Guest', 'null', 'undefined', 'Error'], '?? gives a fallback when the left side is null or undefined.', 'const name = null\nconsole.log(name ?? "Guest")'],
 ['out', 'What prints?', ['Oops', 'Error and crash', 'Nothing', 'ok'], 'try runs code; if something throws, catch handles it instead of crashing.', 'try {\n  JSON.parse("not json")\n  console.log("ok")\n} catch (e) {\n  console.log("Oops")\n}'],
 ['out', 'What does this Python print?', ['Cannot divide by zero', 'Infinity', '0', 'Crash'], 'Dividing by zero raises ZeroDivisionError in Python. The except block catches it.', 'try:\n    print(10 / 0)\nexcept ZeroDivisionError:\n    print("Cannot divide by zero")'],
 ['tf', 'In JavaScript, 10 / 0 gives Infinity rather than an error.', true, 'JavaScript returns Infinity. Python raises ZeroDivisionError. Languages differ in edge cases.']
]);
U('code', 4, 'cd-types2', 'Types & TypeScript', '🧷', ['typescript', 'type-annotation', 'type-error'], [
 ['mc', 'TypeScript is…', ['JavaScript plus type annotations that are checked before running', 'A different language for databases', 'A browser', 'A JavaScript replacement that runs only on servers'], 'TypeScript adds types so mistakes are caught while editing. It compiles to plain JavaScript.'],
 ['mc', 'What does ": number" mean here?', ['price must be a number', 'price is a phone number', 'price is optional', 'It is a comment'], 'A type annotation tells the checker what kind of value is allowed.', 'function tax(price: number) {\n  return price * 0.06\n}'],
 ['mc', 'What does TypeScript report?', ['An error: a string is not assignable to a number parameter', 'Nothing, it prints 0.6', 'A runtime crash only', 'A warning about style'], 'Type checkers catch type mismatches before the code ever runs.', 'function tax(price: number) {\n  return price * 0.06\n}\ntax("10")'],
 ['tf', 'Types help AI assistants and editors give better suggestions and catch their mistakes.', true, 'Types are machine-checkable documentation. They catch many AI-generated mistakes automatically.'],
 ['mc', 'What does the ? in "email?: string" mean?', ['The field is optional', 'The field is a question', 'The field is secret', 'The field can be any type'], 'Optional fields may be missing, so code must handle undefined.', 'type User = {\n  name: string\n  email?: string\n}'],
 ['mc', 'Why do many teams prefer TypeScript for large codebases?', ['Types catch mistakes early and make code easier to change safely', 'It runs faster in browsers', 'It needs no testing', 'It is required by law'], 'Types are especially valuable when many people (and AI tools) change the same code.']
]);
U('code', 4, 'cd-patterns', 'Reading Real Code', '🔬', ['refactor', 'readability', 'pure-function'], [
 ['mc', 'What does this function do?', ['Returns only the active users\' emails', 'Deletes inactive users', 'Counts all users', 'Sends emails to users'], 'filter keeps active users; map pulls out each email. Reading chains left to right is a key skill.', 'const getEmails = users =>\n  users.filter(u => u.active).map(u => u.email)'],
 ['mc', 'A "pure function"…', ['Always returns the same output for the same input and changes nothing outside itself', 'Has no bugs', 'Is written in Python', 'Never returns anything'], 'Pure functions are easy to test and reason about.'],
 ['mc', 'Which change is a refactor?', ['Renaming variables and splitting a function without changing behavior', 'Adding a new feature', 'Fixing a crash', 'Changing prices'], 'Refactoring improves structure while keeping behavior the same. Tests prove nothing changed.'],
 ['mc', 'What is the "early return" pattern doing here?', ['Exiting immediately when there is no user, avoiding deep nesting', 'Returning the user twice', 'A syntax error', 'Making it async'], 'Guard clauses handle bad cases first so the main logic stays flat and readable.', 'function greet(user) {\n  if (!user) return "Hi guest"\n  return "Hi " + user.name\n}'],
 ['out', 'What does this return for [3, 7, 2]?', ['7', '3', '2', '12'], 'It keeps the biggest value seen so far: start 3, then 7 wins, 2 does not.', 'function biggest(xs) {\n  let best = xs[0]\n  for (const x of xs) if (x > best) best = x\n  return best\n}'],
 ['mc', 'What is a "magic number" and why avoid it?', ['An unexplained literal like 86400; use a named constant like SECONDS_PER_DAY', 'A random number generator', 'A number that changes itself', 'A very large number'], 'Named constants explain meaning and make values easy to change in one place.'],
 ['mc', 'You open an unfamiliar codebase. Best first move?', ['Find the entry point and follow one feature end to end', 'Read every file alphabetically', 'Rewrite it', 'Delete unused-looking files'], 'Trace one real path (e.g. "what happens when I click Save") to build a mental map.']
]);
U('code', 5, 'cd-concepts', 'Deeper Concepts', '🌀', ['recursion', 'closure', 'immutability'], [
 ['mc', 'Recursion is…', ['A function that calls itself on a smaller piece of the problem', 'A loop that never ends', 'Running code twice by accident', 'A type of database'], 'Recursion needs a base case to stop, like a loop needs a stopping condition.'],
 ['out', 'What does count(3) print?', ['3, 2, 1', '1, 2, 3', '3 forever', '0'], 'Each call prints n then calls with n - 1. When n reaches 0 the base case stops it.', 'function count(n) {\n  if (n === 0) return\n  console.log(n)\n  count(n - 1)\n}'],
 ['out', 'What prints?', ['2', '1', '0', 'undefined'], 'The inner function "closes over" the count variable and remembers it between calls. That is a closure.', 'function counter() {\n  let count = 0\n  return () => ++count\n}\nconst next = counter()\nnext()\nconsole.log(next())'],
 ['mc', 'Immutability means…', ['Not changing data in place; creating new copies with changes instead', 'Code that cannot run', 'Data that is encrypted', 'A frozen screen'], 'Immutable updates make changes easy to track, which is why UI frameworks like React prefer them.'],
 ['tf', 'Big-O notation describes how an algorithm\'s work grows as the input grows.', true, 'O(n) grows in step with input; O(n²) grows much faster. It helps predict what breaks at scale.'],
 ['mc', 'Checking every pair in a list of n items is roughly…', ['O(n²)', 'O(1)', 'O(n)', 'O(log n)'], 'n items each compared with n items is n × n. Fine for 100 items, painful for a million.']
]);
