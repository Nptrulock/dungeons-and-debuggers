// JavaScript track, To-Do App and Canvas Mini-Game projects
CH({ id: 'j-log', t: 'js', tier: 1, sb: 'js', icon: '👋', title: 'Say hello',
  story: '`console.log` prints a message to the console, the developer\'s notepad. Make it print exactly `Hello`. One choice crashes. Read the red error and work out why.',
  code: L('console.log({{a}});'), slots: { a: ['Hello', 'hello()', '"Hello"'] }, sol: { a: '"Hello"' },
  goals: [['The console shows `Hello`', "log==='Hello'"]],
  hints: ['Text in code needs something around it, or JavaScript thinks it is a name.', 'Quotes: `"Hello"`.'],
  learn: { h: 'Strings vs names', x: 'Text in quotes is a **string**: data. A bare word like `Hello` is a **name**, and JavaScript looks for a variable called Hello. There is none, so you get `ReferenceError: Hello is not defined`.\n\n`hello()` means "call a function named hello", which also does not exist. Error messages name the exact problem. Reading them is a core developer skill.', terms: ['string', 'variable', 'console-log'] } });
CH({ id: 'j-math', t: 'js', tier: 1, sb: 'js', icon: '🍕', title: 'Pizza math',
  story: 'A pizza has 8 slices. 3 friends each eat 2. Print how many slices are left. Several expressions look right. Run them and compare.',
  code: L('console.log({{e}});'), slots: { e: ['(8 - 3) * 2', '8 - 3 + 2', '8 / 3 * 2', '8 - 3 * 2'] }, sol: { e: '8 - 3 * 2' },
  goals: [['It prints 2', "log==='2'"]],
  hints: ['Which happens first, `-` or `*`?', 'Multiplication first: 8 − (3 × 2).'],
  learn: { h: 'Operator precedence', x: 'Like in school math, `*` and `/` happen before `+` and `-`. So `8 - 3 * 2` is `8 - 6`. Parentheses override that order.\n\nWhen in doubt, add parentheses. They cost nothing and make your intent obvious to the next reader.', terms: ['number', 'operator-precedence'] } });
CH({ id: 'j-concat', t: 'js', tier: 1, sb: 'js', icon: '🎂', title: 'Next year\'s age',
  story: 'A form gave us the age. Next year should be 31, but something odd happens. Try both versions.',
  code: L('const age = {{a}};', 'console.log("Next year you will be " + (age + 1));'), slots: { a: ['"30"', '30'] }, sol: { a: '30' },
  goals: [['It says 31', "log==='Next year you will be 31'"]],
  hints: ['`"30"` and `30` are different types of value.', 'A number has no quotes.'],
  learn: { h: '+ means two different things', x: 'With numbers, `+` adds. If either side is a **string**, `+` glues text together, so `"30" + 1` is `"301"`.\n\nData from forms, URLs and files usually arrives as text. Convert it with `Number("30")` before doing math. Mixing up types like this is one of the most common bugs on the web.', terms: ['data-type', 'string', 'number', 'concatenation'] } });
CH({ id: 'j-let', t: 'js', tier: 1, sb: 'js', icon: '🎯', title: 'Keep score',
  story: 'A player scores 10 points, twice. The final score should be 20.',
  code: L('let score = 0;', 'score = score {{op}} 10;', 'score = score {{op}} 10;', 'console.log(score);'), slots: { op: { o: ['+', '-', '*'], s: 1 } }, sol: { op: '+' },
  goals: [['Final score is 20', "log==='20'"]],
  hints: ['`score = score ? 10` takes the old value, changes it, and stores it back.'],
  learn: { h: 'Variables change over time', x: '`let score = 0` makes a box named score. `score = score + 10` reads the box, adds 10, and puts the result back. The `=` means "store", not "equals".\n\nThe shortcut `score += 10` does the same thing. Notice the same slot was used twice: when one idea repeats, it changes everywhere at once.', terms: ['variable', 'assignment'] } });
CH({ id: 'j-const', t: 'js', tier: 1, sb: 'js', icon: '❤️', title: 'Losing a life',
  story: 'The player starts with 3 lives and loses one. The code crashes before it can print 2. Read the error, then fix the first line.',
  code: L('{{kw}} lives = 3;', 'lives = lives - 1;', 'console.log(lives);'), slots: { kw: ['const', 'let'] }, sol: { kw: 'let' },
  goals: [['It prints 2', "log==='2'"]],
  hints: ['One keyword promises the value will never be reassigned.', '`let` allows changes. `const` does not.'],
  learn: { h: 'const vs let', x: '`const` makes a variable that can never be reassigned. Trying gives `TypeError: Assignment to constant variable`. `let` can change.\n\nMost developers use `const` by default and `let` only when the value must change. Then any reassignment you see is on purpose.', terms: ['variable', 'immutability'] } });
CH({ id: 'j-if', t: 'js', tier: 1, sb: 'js', icon: '🩳', title: 'Shorts or jacket?',
  story: 'At 25 degrees or warmer it is shorts weather. Below that, bring a jacket. The tests check 30, 10 and the tricky edge case: exactly 25.',
  code: L('function outfit(temp) {', '  if (temp {{op}} 25) {', '    return "shorts";', '  }', '  return "jacket";', '}', 'console.log(outfit(30), outfit(10), outfit(25));'),
  slots: { op: ['<', '===', '>', '>='] }, sol: { op: '>=' },
  goals: [['30 → shorts', "outfit(30)==='shorts'"], ['10 → jacket', "outfit(10)==='jacket'"], ['Exactly 25 → shorts', "outfit(25)==='shorts'"]],
  hints: ['`>` works for 30 and 10. Look at exactly 25.', '"25 or warmer" is `>=`.'],
  learn: { h: 'Comparisons and edge cases', x: '`if (condition)` runs the block only when the condition is true. `>` means strictly greater, and `>=` includes equality.\n\nThe value right on the boundary is an **edge case**, and it is where bugs hide. Good tests always check the edges: 0, empty lists, the exact limit.', terms: ['if-statement', 'comparison', 'edge-case'] } });
CH({ id: 'j-eq', t: 'js', tier: 1, sb: 'js', icon: '🟰', title: 'Text that looks like a number',
  story: 'The form sends `"5"` as text. The strict check `=== 5` refuses to match it. Convert the input so the check passes.',
  code: L('const input = "5";', 'if ({{conv}}(input) === 5) {', '  console.log("match");', '} else {', '  console.log("no match");', '}'),
  slots: { conv: { o: ['', 'String', 'Boolean', 'Number'], l: ['(nothing)', 'String', 'Boolean', 'Number'] } }, sol: { conv: 'Number' },
  goals: [['It prints match', "log==='match'"]],
  hints: ['`===` checks the type too, not just how it looks.', '`Number("5")` gives 5.'],
  learn: { h: '=== is strict', x: '`===` is true only if the type and value both match, so `"5" === 5` is false. The loose `==` converts types first, so `"5" == 5` is true, but it has strange rules (`"" == 0` is true!).\n\nPros use `===` and convert on purpose with `Number()` or `String()`.', terms: ['comparison', 'data-type'] } });
CH({ id: 'j-for', t: 'js', tier: 1, sb: 'js', icon: '⭐', title: 'A row of stars',
  story: 'Print exactly five stars in one line using a loop. Drag the number and watch the output.',
  code: L('let row = "";', 'for (let i = 0; i < {{n}}; i++) {', '  row = row + "⭐";', '}', 'console.log(row);'), slots: { n: { n: [0, 10, 1], s: 0 } }, sol: { n: 5 },
  goals: [['Exactly five stars', "log==='⭐⭐⭐⭐⭐'"]],
  hints: ['The loop runs while `i < n`, starting from 0.'],
  learn: { h: 'for loops', x: '`for (let i = 0; i < 5; i++)` has three parts: start (`i = 0`), keep going while (`i < 5`), and after each lap (`i++` adds 1). It runs for i = 0, 1, 2, 3, 4. That is five times.\n\nWith 0, the condition is false right away, the body never runs, and you get an empty line. Loops let 3 lines of code do the work of 5, or 5 million.', terms: ['loop'] } });
CH({ id: 'j-while', t: 'js', tier: 1, sb: 'js', icon: '🚀', title: 'Countdown',
  story: 'Count down 3, 2, 1, then "Liftoff!". The sandbox stops runaway loops, so feel free to find out what a loop that never ends looks like.',
  code: L('let n = 3;', 'while (n > 0) {', '  console.log(n);', '  n = n {{op}} 1;', '}', 'console.log("Liftoff!");'), slots: { op: ['+', '*', '-'] }, sol: { op: '-' },
  goals: [['3, 2, 1, Liftoff!', "logs.join(',')==='3,2,1,Liftoff!'"]],
  hints: ['The loop stops when `n > 0` becomes false. Does n ever get there?'],
  learn: { h: 'Infinite loops', x: 'A `while` loop repeats until its condition is false. If the body never moves toward that, for example `n = n + 1`, it runs forever and freezes the page. This sandbox stops it after 2 million steps. A real browser tab would just hang.\n\nEvery loop needs progress toward its exit.', terms: ['loop', 'infinite-loop'] } });
CH({ id: 'j-array', t: 'js', tier: 1, sb: 'js', icon: '🍒', title: 'Pick from a list',
  story: 'Print **cherry** from the list. Drag the index and watch. What happens past the end?',
  code: L('const fruits = ["apple", "banana", "cherry"];', 'console.log(fruits[{{i}}]);'), slots: { i: { n: [0, 4, 1], s: 0 } }, sol: { i: 2 },
  goals: [['It prints cherry', "log==='cherry'"]],
  hints: ['The first item is not number 1.', 'Counting starts at 0, so cherry is 2.'],
  learn: { h: 'Zero-based indexes', x: 'Arrays count from **0**: `fruits[0]` is apple and `fruits[2]` is cherry. `fruits.length` is 3, so the last index is `length - 1`.\n\nReading past the end gives `undefined` with no error. That silent `undefined` often causes a crash somewhere else later, which makes it confusing to debug.', terms: ['array', 'index', 'zero-index'] } });
CH({ id: 'j-filter', t: 'js', tier: 1, sb: 'js', icon: '🏷️', title: 'Cheap things only',
  story: 'Get a **new list** of the prices under 10: `[5, 8]`. Three array methods look alike. Run each one and compare the results.',
  code: L('const prices = [5, 12, 8, 20];', 'const result = prices.{{m}}(p => p {{op}} 10);', 'console.log(result);'), slots: { m: ['map', 'find', 'filter'], op: ['>', '<'] }, sol: { m: 'filter', op: '<' },
  goals: [['It prints [5,8]', "log==='[5,8]'"]],
  hints: ['One method transforms every item, one returns the first match, and one keeps the matches.', '`filter` with `p < 10`.'],
  learn: { h: 'map, filter, find', x: '`map` turns every item into something else, here true or false. `filter` keeps the items that pass a test. `find` returns only the **first** match.\n\n`p => p < 10` is an **arrow function**: a tiny function written inline. These three methods replace most hand-written loops in modern JavaScript.', terms: ['map', 'filter', 'array'] } });
CH({ id: 'j-func', t: 'js', tier: 1, sb: 'js', icon: '🎁', title: 'Return the greeting',
  story: '`greet("Noah")` should give back `Hi Noah` so the caller can print it once. One option prints twice. Look closely at the console.',
  code: L('function greet(name) {', '  {{body}}', '}', 'console.log(greet("Noah"));'), slots: { body: ['console.log("Hi " + name)', 'return "Hi name"', 'return "Hi " + "name"', 'return "Hi " + name'] }, sol: { body: 'return "Hi " + name' },
  goals: [['Exactly one line: Hi Noah', "logs.length===1 && log==='Hi Noah'"]],
  hints: ['Printing is not the same as giving a value back.', '`return` sends the value out, and `name` must be outside the quotes.'],
  learn: { h: 'return vs console.log', x: '`return` hands a value back to whoever called the function. `console.log` only displays it. A function without `return` gives back `undefined`, which is why "undefined" appeared.\n\nInside quotes, `"name"` is just four letters. Outside, `name` is the parameter holding `"Noah"`.', terms: ['function', 'return', 'parameter'] } });
CH({ id: 'j-obj', t: 'js', tier: 1, sb: 'js', icon: '🧙', title: 'Level up the hero',
  story: 'Level the hero up from 1 to 2. Two choices run without any error, but only one updates the real level.',
  code: L('const hero = { name: "Noah", level: 1 };', 'hero.{{k}} = hero.level + 1;', 'console.log(hero.name + " is level " + hero.level);'), slots: { k: ['Level', 'lvl', 'level'] }, sol: { k: 'level' },
  goals: [['Noah is level 2', "log==='Noah is level 2'"]],
  hints: ['Property names must match exactly.', 'Lowercase `level`.'],
  learn: { h: 'Objects are case-sensitive', x: 'An **object** groups named values (properties). `hero.Level = 2` does not fail. It quietly creates a **new** property named `Level`, separate from `level`.\n\nThat is why typos in property names are sneaky bugs. TypeScript catches them before the code runs.', terms: ['object', 'property'] } });
CH({ id: 'j-dom', t: 'js', tier: 1, sb: 'js', icon: '🖐️', title: 'Change the page', html: '<h1 id="title">Loading…</h1>',
  story: 'Use JavaScript to change the heading to "Ready!". Find the element first. Some combinations find nothing and crash.',
  code: L('document.{{f}}("{{sel}}").textContent = "Ready!";'), slots: { f: ['getElementById', 'querySelector'], sel: { o: ['#title', 'title', 'h1'], s: 0 } }, sol: { f: 'getElementById', sel: 'title' },
  goals: [['The heading says Ready!', "txt('#title')==='Ready!'"]],
  hints: ['`getElementById` takes a bare id. `querySelector` takes a CSS selector.', 'getElementById("title"), querySelector("#title") and querySelector("h1") all work.'],
  learn: { h: 'The DOM', x: 'The browser turns HTML into a tree of objects called the **DOM**. JavaScript finds elements with `getElementById("title")`, using the id with no #, or with `querySelector("#title")`, which takes CSS selector syntax.\n\nIf nothing is found you get `null`, and `null.textContent` crashes with "Cannot set properties of null". That is one of the most common errors on the web.', terms: ['dom', 'null'] } });
CH({ id: 'j-event', t: 'js', tier: 1, sb: 'js', icon: '🖱️', title: 'Click counter', html: '<button id="btn">Clicked 0 times</button>',
  story: 'Each click should add one to the counter. Click the button in the preview to test it yourself. The checker clicks it twice.',
  code: L('let count = 0;', 'const btn = document.getElementById("btn");', 'btn.addEventListener("{{ev}}", () => {', '  count{{inc}};', '  btn.textContent = "Clicked " + count + " times";', '});'),
  slots: { ev: ['hover', 'load', 'click'], inc: ['--', ' + 1', '++'] }, sol: { ev: 'click', inc: '++' },
  goals: [['Two clicks → "Clicked 2 times"', "click('#btn'); click('#btn'); return txt('#btn')==='Clicked 2 times'"]],
  hints: ['The event name for a tap or click is simply "click". "hover" is not a real event name.', '`count++` adds one and stores it. `count + 1` computes a value and throws it away.'],
  learn: { h: 'Events', x: '`addEventListener("click", fn)` says: whenever this is clicked, run fn. The page waits for the user. That is **event-driven** programming.\n\nThere is no "hover" event (it is called `mouseenter`), and listening for a made-up name fails silently. `count + 1;` computes a number and discards it. Only `count++` or `count += 1` stores it.', terms: ['event', 'event-listener'] } });
CH({ id: 'j-style', t: 'js', tier: 1, sb: 'js', icon: '💡', title: 'Light switch', html: '<div id="lamp" style="width:80px;height:80px;border-radius:50%;background:#333;margin:10px"></div><button id="sw">Switch</button>',
  story: 'Pressing Switch should turn the lamp gold. In CSS the property is called `background-color`. In JavaScript, one spelling crashes before anything runs.',
  code: L('document.getElementById("sw").onclick = () => {', '  const lamp = document.getElementById("lamp");', '  lamp.style.{{p}} = "gold";', '};'), slots: { p: ['color', 'background-color', 'backgroundColor'] }, sol: { p: 'backgroundColor' },
  goals: [['After a click the lamp is gold', "click('#sw'); return same('#lamp','background-color','gold')"]],
  hints: ['In JavaScript, `-` means minus.', 'CSS names become camelCase in JavaScript: `backgroundColor`.'],
  learn: { h: 'CSS from JavaScript', x: '`element.style.backgroundColor` sets inline CSS. JavaScript reads `lamp.style.background-color` as `lamp.style.background` **minus** `color`, which is invalid. So the whole script fails to load: a **SyntaxError**.\n\n`color` changes the text color, and this lamp has no text. Usually a better design is to toggle a class (`lamp.classList.toggle("on")`) and keep the styles in CSS.', terms: ['dom', 'syntax-error'] } });
CH({ id: 'j-canvas', t: 'js', tier: 1, sb: 'js', icon: '🟥', title: 'Draw on a canvas', html: '<canvas id="c" width="300" height="150" style="border:1px solid #ccc;border-radius:8px"></canvas>',
  story: 'Draw a **red** 100×100 square on the **right** side of the canvas. The canvas is 300 wide. Where is x = 0?',
  code: L('const ctx = document.getElementById("c").getContext("2d");', 'ctx.fillStyle = "{{col}}";', 'ctx.fillRect({{x}}, 20, 100, 100);'), slots: { col: { o: ['red', 'blue', 'green'], s: 1 }, x: { n: [0, 200, 10], s: 0 } }, sol: { col: 'red', x: 180 },
  goals: [['A red square covers the right side (x = 250)', "var p=pixel('#c',250,70);return p[0]>200&&p[1]<50&&p[2]<50"], ['The left side is empty', "pixel('#c',20,70)[3]===0"]],
  hints: ['x is measured from the left edge.', 'x of about 160 to 200 puts the square on the right.'],
  learn: { h: 'Canvas coordinates', x: 'On a canvas, (0, 0) is the **top-left** corner. x grows to the right and y grows **downward**, which is the opposite of school graphs. `fillRect(x, y, width, height)` paints a rectangle.\n\nCanvas is how most browser games draw: clear the frame, redraw everything, about 60 times a second.', terms: ['canvas'] } });
CH({ id: 'j-circles', t: 'js', tier: 1, sb: 'js', icon: '🫧', title: 'Experiment: circles', explore: 3, html: '<canvas id="c" width="300" height="150" style="border:1px solid #ccc;border-radius:8px"></canvas>',
  story: 'Experiment zone. Draw a circle anywhere, any size, any color. Every new version you run earns XP.',
  code: L('const ctx = document.getElementById("c").getContext("2d");', 'ctx.beginPath();', 'ctx.arc({{x}}, {{y}}, {{r}}, 0, Math.PI * 2);', 'ctx.fillStyle = "{{c}}";', 'ctx.fill();'),
  slots: { x: { n: [0, 300, 20], s: 140 }, y: { n: [0, 150, 10], s: 70 }, r: { n: [0, 80, 5], s: 0 }, c: ['teal', 'tomato', 'gold', 'rebeccapurple'] }, sol: { r: 40 },
  goals: [['Something is drawn', "painted('#c') > 0"]],
  hints: ['A radius of 0 draws nothing.'],
  learn: { h: 'Paths and radians', x: '`arc(x, y, radius, start, end)` traces part of a circle. Angles are in **radians**: a full turn is `Math.PI * 2`, about 6.28, not 360.\n\n`beginPath()` starts a new shape, and `fill()` paints it. Forgetting `beginPath` makes new shapes join onto old ones.', terms: ['canvas'] } });
CH({ id: 'j-template', t: 'js', tier: 1, sb: 'js', icon: '🧵', title: 'Fill in the blanks',
  story: 'Print `Hi Noah!` by putting the variable inside the text. One kind of quote can do it.',
  code: L('const name = "Noah";', 'console.log({{s}});'), slots: { s: ['"Hi ${name}!"', "'Hi ' + name", '`Hi ${name}!`'] }, sol: { s: '`Hi ${name}!`' },
  goals: [['It prints Hi Noah!', "log==='Hi Noah!'"]],
  hints: ['Look at the shape of the quotes.', 'Backticks: `` ` ``.'],
  learn: { h: 'Template literals', x: 'Backtick strings (`` `like this` ``) are **template literals**. Anything inside `${ }` is evaluated and inserted. With normal quotes, `${name}` is just characters.\n\nTemplates can also span several lines. Python\'s version is the f-string: `f"Hi {name}!"`.', terms: ['string', 'template-literal'] } });
CH({ id: 'j-json', t: 'js', tier: 1, sb: 'js', icon: '📦', title: 'Read the JSON',
  story: 'A server sent this text. Turn it into a real object so `data.level + 1` gives 4.',
  code: L('const text = \'{"name":"Noah","level":3}\';', 'const data = {{f}}(text);', 'console.log(data.level + 1);'), slots: { f: ['JSON.stringify', 'String', 'JSON.parse'] }, sol: { f: 'JSON.parse' },
  goals: [['It prints 4', "log==='4'"]],
  hints: ['One method goes from text to object, the other from object to text.', '`JSON.parse`.'],
  learn: { h: 'JSON: text that looks like objects', x: '**JSON** is how most web APIs send data: text in JavaScript-object syntax. `JSON.parse` turns the text into an object, and `JSON.stringify` turns an object into text.\n\nUntil it is parsed, it is only a string, so `.level` is `undefined` and `undefined + 1` is `NaN` ("Not a Number").', terms: ['json'] } });
CH({ id: 'j-scope', t: 'js', tier: 2, sb: 'js', icon: '⏳', title: 'Timers in a loop',
  story: 'Each timer should print its own lap: 0, 1, 2. With one keyword it prints 3, 3, 3. Try both and think about why.',
  code: L('for ({{kw}} i = 0; i < 3; i++) {', '  setTimeout(() => console.log(i), 10);', '}'), slots: { kw: ['var', 'let'] }, sol: { kw: 'let' },
  goals: [['It prints 0, 1, 2', "await wait(60); return logs.join(',')==='0,1,2'"]],
  hints: ['The timers run **after** the loop finishes. Which `i` do they see?', '`let` gives each lap its own `i`.'],
  learn: { h: 'Scope and closures', x: 'The timer callbacks run after the loop has finished. With `var` there is **one** `i` for the whole function, and by then it is 3. With `let`, each lap of the loop gets its **own** `i`, and each callback remembers its own. That memory is a **closure**.\n\nThis exact bug has caught out generations of JavaScript developers, which is a big reason `let` was added.', terms: ['scope', 'closure', 'async'] } });
CH({ id: 'j-sort', t: 'js', tier: 2, sb: 'js', icon: '🔀', title: 'Sort the scores',
  story: 'Sort the scores from smallest to largest. The default `sort()` does something surprising with numbers.',
  code: L('const scores = [10, 9, 100, 1];', 'scores.sort({{cmp}});', 'console.log(scores);'), slots: { cmp: { o: ['', '(a, b) => b - a', '(a, b) => a - b'], l: ['(nothing)', '(a, b) => b - a', '(a, b) => a - b'] } }, sol: { cmp: '(a, b) => a - b' },
  goals: [['[1,9,10,100]', "log==='[1,9,10,100]'"]],
  hints: ['Without help, sort compares items as text: "100" comes before "9" like in a dictionary.', 'A compare function returning `a - b` sorts ascending.'],
  learn: { h: 'Default sort is alphabetical', x: '`sort()` with no argument turns items into strings and sorts them like words, so `"10"` comes before `"9"`. Pass a **compare function**: return a negative number to put a first, or a positive one to put b first. `a - b` sorts ascending and `b - a` descending.\n\nA classic example of code that "works" in a quick test and fails on real data.', terms: ['array', 'edge-case'] } });
CH({ id: 'j-float', t: 'js', tier: 2, sb: 'js', icon: '🧮', title: 'Floating point surprise',
  story: 'Show 0.1 + 0.2 as exactly `0.3`. Run the first option and look at the result.',
  code: L('const total = 0.1 + 0.2;', 'console.log({{e}});'), slots: { e: ['total', 'total === 0.3', 'total.toFixed(2)', 'Math.round(total * 100) / 100'] }, sol: { e: 'Math.round(total * 100) / 100' },
  goals: [['It prints 0.3', "log==='0.3'"]],
  hints: ['Computers store most decimals as tiny approximations.', 'Round it: `Math.round(total * 100) / 100`.'],
  learn: { h: 'Floating-point numbers', x: '`0.1 + 0.2` is `0.30000000000000004` in JavaScript, Python, C++ and nearly every language. Numbers are stored in binary, and 0.1 cannot be written exactly in binary, just as 1/3 cannot be written exactly in decimal.\n\n`toFixed(2)` gives the **string** `"0.30"`. For money, store whole cents as integers (`1999` for $19.99) and format only when you display them.', terms: ['number', 'floating-point'] } });

// ---------- To-Do App project ----------
var TODO_HTML = '<style>body{font-family:system-ui}#list li{padding:6px 4px;cursor:pointer;border-bottom:1px solid #eee}#list li.done{text-decoration:line-through;opacity:.55}#new{padding:6px;border:1px solid #bbb;border-radius:6px}</style><h2>✅ My tasks</h2><input id="new" placeholder="New task"> <button id="add">Add</button><ul id="list"></ul><p id="left"></p>';
CH({ id: 'todo-1', t: 'js', tier: 2, sb: 'js', icon: '✅', title: 'To-do: show the list', proj: ['todo', 1], html: TODO_HTML,
  story: 'Project: a real to-do app in 5 steps. First, turn the `tasks` array into list items on the page.',
  code: L('const tasks = ["Buy milk", "Learn JavaScript"];', 'const list = document.getElementById("list");', '', 'for (const task of tasks) {', '  const item = document.createElement("{{tag}}");', '  item.textContent = task;', '  list.{{m}}(item);', '}'),
  slots: { tag: ['div', 'ul', 'li'], m: ['push', 'remove', 'appendChild'] }, sol: { tag: 'li', m: 'appendChild' },
  goals: [['Two list items appear', "count('#list li')===2"], ['The first is "Buy milk"', "txt('#list li')==='Buy milk'"]],
  hints: ['Items in a `ul` are `li` elements. Arrays use `push`; the DOM uses something else.', '`createElement("li")` and `list.appendChild(item)`.'],
  learn: { h: 'Data drives the page', x: 'The array is the **data**. The loop **renders** it into DOM elements. `createElement` makes an element in memory, and `appendChild` attaches it to the page.\n\n`push` belongs to arrays, not DOM elements, hence "list.push is not a function". This split between data and how it is rendered is the core idea behind React and every other front-end framework.', terms: ['dom', 'state'] } });
var TODO2 = L('const tasks = ["Buy milk", "Learn JavaScript"];', 'const list = document.getElementById("list");', 'const input = document.getElementById("new");', '', 'function render() {', '  list.innerHTML = "";', '  for (const task of tasks) {', '    const item = document.createElement("li");', '    item.textContent = task;', '    list.appendChild(item);', '  }', '}', '', 'document.getElementById("add").addEventListener("click", () => {', '  if (input.value.trim() {{cond}}) return;', '  tasks.{{m}}(input.value.trim());', '  input.value = "";', '  render();', '});', 'render();');
CH({ id: 'todo-2', t: 'js', tier: 2, sb: 'js', icon: '➕', title: 'To-do: add tasks', proj: ['todo', 2], html: TODO_HTML,
  story: 'Typing a task and pressing Add should put it at the **end** of the list, and empty or blank tasks should be ignored. Try it yourself in the preview.',
  code: TODO2, slots: { cond: { o: ['!== ""', '.length > 0', '=== ""'], s: 0 }, m: { o: ['pop', 'unshift', 'push'], s: 0 } }, sol: { cond: '=== ""', m: 'push' },
  goals: [['Adding "Walk the dog" puts it last', "type('#new','Walk the dog'); click('#add'); return count('#list li')===3 && txt('#list li:last-child')==='Walk the dog'"], ['A blank task is ignored', "var n=count('#list li'); type('#new','   '); click('#add'); return count('#list li')===n && txt('#list li:last-child')!==''"]],
  hints: ['The `if` should leave early when the trimmed text is empty.', '`=== ""` to bail out, then `push` adds to the end.'],
  learn: { h: 'Change the data, then re-render', x: 'The click handler never touches list items directly. It updates the **array** and calls `render()`, which rebuilds the list from scratch. One source of truth means the page can never disagree with the data.\n\n`trim()` removes spaces at both ends, so "   " becomes "". That is **input validation**. `unshift` adds to the front and `pop` removes from the end.', terms: ['state', 'input-validation'] } });
var TODO3 = L('const tasks = [', '  { text: "Buy milk", done: false },', '  { text: "Learn JavaScript", done: true },', '];', 'const list = document.getElementById("list");', 'const input = document.getElementById("new");', '', 'function render() {', '  list.innerHTML = "";', '  tasks.forEach((task) => {', '    const item = document.createElement("li");', '    item.textContent = task.text;', '    if (task.done) item.classList.add("done");', '    item.addEventListener("click", () => {', '      task.done = {{expr}};', '      render();', '    });', '    list.appendChild(item);', '  });', '{{LEFT}}}', '', 'document.getElementById("add").addEventListener("click", () => {', '  if (input.value.trim() === "") return;', '  tasks.push({ text: input.value.trim(), done: false });', '  input.value = "";', '  render();', '});', 'render();');
CH({ id: 'todo-3', t: 'js', tier: 2, sb: 'js', icon: '✔️', title: 'To-do: tick tasks off', proj: ['todo', 3], html: TODO_HTML,
  story: 'Tasks are now **objects** with `text` and `done`. Tapping a task should cross it off, and tapping again should bring it back.',
  code: TODO3.replace('{{LEFT}}', ''), slots: { expr: ['true', 'false', '!task.done'] }, sol: { expr: '!task.done' },
  goals: [['"Learn JavaScript" starts crossed out', "q('#list li:nth-child(2)').classList.contains('done')"], ['Tapping toggles on and off', "click('#list li'); var a=q('#list li').classList.contains('done'); click('#list li'); var b=q('#list li').classList.contains('done'); return a && !b"]],
  hints: ['`true` only ever turns it on. You want the **opposite** of the current value.', '`!task.done` flips true and false.'],
  learn: { h: 'Objects in arrays', x: 'Real data has several fields, so each task is an object: `{ text, done }`. The `!` operator means "not", so `!true` is `false`. Setting a value to its own opposite is called **toggling**.\n\nThe crossed-out look comes from a CSS class (`.done`). JavaScript decides the state, and CSS decides how it looks.', terms: ['object', 'boolean'] } });
CH({ id: 'todo-4', t: 'js', tier: 2, sb: 'js', icon: '🔢', title: 'To-do: tasks left', proj: ['todo', 4], html: TODO_HTML,
  story: 'Show how many tasks are **not done yet**, like "1 left". It should update as you tick tasks off.',
  code: TODO3.replace('{{expr}}', '!task.done').replace('{{LEFT}}', '  document.getElementById("left").textContent = tasks.{{m}}(t => {{c}}).length + " left";\n'), slots: { m: ['map', 'find', 'filter'], c: ['t.done', '!t.done'] }, sol: { m: 'filter', c: '!t.done' },
  goals: [['Starts at "1 left"', "txt('#left')==='1 left'"], ['Ticking "Buy milk" → "0 left"', "click('#list li'); return txt('#left')==='0 left'"]],
  hints: ['You want only the tasks that pass a test, then count them.', '`filter(t => !t.done).length`.'],
  learn: { h: 'Derived state', x: 'The "left" count is never stored. It is **computed** from the tasks every render. Storing it separately would risk the two disagreeing.\n\n`filter(t => t.done)` also showed "1 left" at first, purely by coincidence, and broke after a click. That is why tests try more than one situation.', terms: ['filter', 'source-of-truth'] } });
var TODO5 = TODO3.replace('{{expr}}', '!task.done').replace('const tasks = [\n  { text: "Buy milk", done: false },\n  { text: "Learn JavaScript", done: true },\n];', 'const saved = localStorage.getItem("tasks");\nconst tasks = saved ? JSON.parse(saved) : [\n  { text: "Buy milk", done: false },\n  { text: "Learn JavaScript", done: true },\n];').replace('{{LEFT}}', '  document.getElementById("left").textContent = tasks.filter(t => !t.done).length + " left";\n  localStorage.setItem("tasks", {{s}});\n');
CH({ id: 'todo-5', t: 'js', tier: 3, sb: 'js', icon: '💾', title: 'To-do: remember tasks', proj: ['todo', 5], html: TODO_HTML,
  story: 'Close the tab and your tasks vanish. Save them in the browser\'s **localStorage** on every render. Storage only holds text.',
  code: TODO5, slots: { s: ['tasks', 'String(tasks)', 'JSON.stringify(tasks)'] }, sol: { s: 'JSON.stringify(tasks)' },
  goals: [['After adding a task, storage holds 3 tasks', "type('#new','Walk the dog'); click('#add'); try { return JSON.parse(localStorage.getItem('tasks')).length===3 } catch (e) { return false }"], ['Each saved task keeps its text and done flag', "try { var t=JSON.parse(localStorage.getItem('tasks')); return t[1].text==='Learn JavaScript' && t[1].done===true } catch (e) { return false }"]],
  hints: ['localStorage stores strings. An array of objects turns into "[object Object]" when forced into text.', '`JSON.stringify(tasks)` on save, `JSON.parse` on load.'],
  learn: { h: 'Persistence', x: '`localStorage` keeps strings in the browser, even after you close the tab. To store objects, `JSON.stringify` on the way in and `JSON.parse` on the way out. `String(tasks)` gives `"[object Object],[object Object]"`, and the data is lost.\n\nThe sandbox stores things in memory for safety, but the code is exactly what a real app uses. ✅ Your to-do app is complete. Find it in the 🏗️ Workshop. Later you will store tasks in a real database.', terms: ['json', 'state', 'localstorage'] } });

// ---------- Canvas Mini-Game project ----------
var GAME_HTML = '<canvas id="c" width="300" height="150" style="background:#0b1020;border-radius:12px;display:block;max-width:100%"></canvas><div style="margin-top:8px;font:16px system-ui"><button id="left" style="font-size:20px;padding:6px 16px">◀</button> <button id="right" style="font-size:20px;padding:6px 16px">▶</button> <b id="score">Score: 0</b></div>';
CH({ id: 'game-1', t: 'js', tier: 2, sb: 'js', icon: '🎮', title: 'Game: draw the player', proj: ['game', 1], html: GAME_HTML,
  story: 'Project: a tiny arcade game. Step 1: draw the player, a 20×20 square, somewhere **on screen** in a color you can actually see on the dark background.',
  code: L('const ctx = document.getElementById("c").getContext("2d");', 'let x = {{x}};', 'const y = 110;', '', 'function draw() {', '  ctx.clearRect(0, 0, 300, 150);', '  ctx.fillStyle = "{{col}}";', '  ctx.fillRect(x, y, 20, 20);', '}', 'draw();'),
  slots: { x: { n: [-60, 340, 20], s: -60 }, col: ['#0b1020', '#22d3ee', '#fbbf24'] }, sol: { x: 140, col: '#22d3ee' },
  goals: [['The player is fully on screen', "x >= 0 && x <= 280"], ['It is visible against the background', "var p=pixel('#c',x+10,120);return p[3]>0 && !(p[0]===11&&p[1]===16&&p[2]===32)"]],
  hints: ['The canvas is 300 wide and the player is 20 wide.', 'x between 0 and 280, and not the background color.'],
  learn: { h: 'Game state', x: '`x` is the player\'s position. It is **state**: a value that changes as the game runs. `draw()` paints the current state. Games clear and redraw everything every frame.\n\nA square the same color as the background is technically drawn, just invisible. Bugs like that make you doubt your code when the logic is fine.', terms: ['state', 'canvas'] } });
var GAME2 = L('const ctx = document.getElementById("c").getContext("2d");', 'let x = 140;', 'const y = 110;', '', 'function draw() {', '  ctx.clearRect(0, 0, 300, 150);', '  ctx.fillStyle = "#22d3ee";', '  ctx.fillRect(x, y, 20, 20);', '}', '');
CH({ id: 'game-2', t: 'js', tier: 2, sb: 'js', icon: '🕹️', title: 'Game: move with buttons', proj: ['game', 2], html: GAME_HTML,
  story: '▶ should move the player right by 20, and ◀ should move it left. Tap the buttons in the preview to test.',
  code: GAME2 + L('document.getElementById("right").onclick = () => { x = x {{op}} 20; draw(); };', 'document.getElementById("left").onclick = () => { x = x {{op2}} 20; draw(); };', 'draw();'),
  slots: { op: ['-', '*', '+'], op2: ['+', '*', '-'] }, sol: { op: '+', op2: '-' },
  goals: [['▶ adds 20, ◀ takes it back', "var a=x; click('#right'); var b=x; click('#left'); return b===a+20 && x===a"]],
  hints: ['On a canvas, x grows to the right.'],
  learn: { h: 'Input changes state', x: 'Each click changes `x`, then redraws. That is the game loop in miniature: **input → update state → draw**.\n\nReal games also run a timer (`requestAnimationFrame`) about 60 times a second, so things can move without input.', terms: ['event', 'state'] } });
var GAME3 = GAME2 + L('function move(dx) {', '  x = x + dx;', '  x = Math.max({{min}}, Math.min(x, {{max}}));', '  draw();', '}', 'document.getElementById("right").onclick = () => move(20);', 'document.getElementById("left").onclick = () => move(-20);', 'draw();');
CH({ id: 'game-3', t: 'js', tier: 2, sb: 'js', icon: '🧱', title: 'Game: walls', proj: ['game', 3], html: GAME_HTML,
  story: 'The player can run off the screen forever. **Clamp** x so the whole square always stays visible.',
  code: GAME3, slots: { min: { o: [-20, 20, 0], s: 0 }, max: { o: [300, 260, 280], s: 0 } }, sol: { min: 0, max: 280 },
  goals: [['Far right stops at 280', "for(var i=0;i<30;i++)click('#right'); return x===280"], ['Far left stops at 0', "for(var i=0;i<30;i++)click('#left'); return x===0"]],
  hints: ['x is the left edge of the square. The square is 20 wide.', 'Between 0 and 300 − 20 = 280.'],
  learn: { h: 'Clamping', x: '`Math.max(lo, Math.min(x, hi))` **clamps** x into a range: not below lo, not above hi. It shows up everywhere: volume sliders, scroll positions, health bars.\n\nThe off-by-20 detail, where the right edge is x + width, is a typical off-by-one style bug.', terms: ['edge-case'] } });
CH({ id: 'game-4', t: 'js', tier: 3, sb: 'js', icon: '🪙', title: 'Game: collect coins', proj: ['game', 4], html: GAME_HTML,
  story: 'Add a coin. Touching it scores a point and moves the coin. Walking around far away must not score.',
  code: L('const ctx = document.getElementById("c").getContext("2d");', 'let x = 40, coinX = 200, score = 0;', 'const y = 110;', '', 'function draw() {', '  ctx.clearRect(0, 0, 300, 150);', '  ctx.fillStyle = "#fbbf24";', '  ctx.beginPath();', '  ctx.arc(coinX + 10, y + 10, 8, 0, Math.PI * 2);', '  ctx.fill();', '  ctx.fillStyle = "#22d3ee";', '  ctx.fillRect(x, y, 20, 20);', '}', 'function move(dx) {', '  x = Math.max(0, Math.min(x + dx, 280));', '  if (Math.abs(x - coinX) {{op}} 20) {', '    score{{inc}};', '    coinX = (coinX + 130) % 280;', '    document.getElementById("score").textContent = "Score: " + score;', '  }', '  draw();', '}', 'document.getElementById("right").onclick = () => move(20);', 'document.getElementById("left").onclick = () => move(-20);', 'draw();'),
  slots: { op: ['>', '===', '<'], inc: { o: ['--', ' = 1', '++'], s: 0 } }, sol: { op: '<', inc: '++' },
  goals: [['Far from the coin: no points', "var s=score; x=0; move(20); return score===s"], ['Touching the coin scores', "x=180; coinX=200; score=0; move(20); return score===1 && txt('#score')==='Score: 1'"], ['A second coin makes 2', "x=coinX-20; move(20); return score===2"]],
  hints: ['"Touching" means the distance between them is small.', 'Distance `< 20`, and `score++`.'],
  learn: { h: 'Collision detection', x: '`Math.abs(x - coinX)` is the distance between the player and the coin, ignoring direction. Below 20 means they overlap. Most 2D games use rectangle overlap tests just like this.\n\n`score = 1` would reset the score to 1 every time. 🎮 Your game is complete. Play it from the 🏗️ Workshop.', terms: ['state'] } });
