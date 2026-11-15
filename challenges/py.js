// Python track (real CPython via Pyodide) and the Text Adventure project
CH({ id: 'p-print', t: 'py', tier: 1, sb: 'py', icon: '🐍', title: 'Hello, Python',
  story: 'This is real Python, running in your browser. Make it print exactly `Hello, Python!`. The first time, Python takes a few seconds to download.',
  code: L('print({{a}})'), slots: { a: ['Hello, Python!', 'print', '"Hello, Python!"'] }, sol: { a: '"Hello, Python!"' },
  goals: [['It prints Hello, Python!', "_out == 'Hello, Python!\\n'"]],
  hints: ['Text needs quotes, just like in JavaScript.'],
  learn: { h: 'print and strings', x: '`print(...)` writes a line to the console. Text in quotes is a **string**. Without quotes, Python tries to read `Hello, Python!` as code and gives a `SyntaxError`.\n\n`print(print)` prints the print function itself: `<built-in function print>`. In Python, functions are values too.', terms: ['string', 'syntax-error'] } });
CH({ id: 'p-div', t: 'py', tier: 1, sb: 'py', icon: '🍕', title: 'Full plates',
  story: '7 slices of pizza, 2 slices per plate. Print how many **full** plates you can serve. Try every operator.',
  code: L('print({{a}})'), slots: { a: ['7 / 2', '7 % 2', '7 ** 2', '7 // 2'] }, sol: { a: '7 // 2' },
  goals: [['It prints 3', "_out == '3\\n'"]],
  hints: ['One operator divides and throws away the remainder.', '`//` is floor division.'],
  learn: { h: 'Four kinds of division-ish', x: '`/` always gives a float: `3.5`. `//` is **floor division**: whole plates only, `3`. `%` is the **remainder**: 1 slice left over. `**` is a power: 7² = 49.\n\n`//` and `%` together answer "how many groups, and what is left over". They come up all the time: pagination, clocks, even or odd.', terms: ['number'] } });
CH({ id: 'p-fstr', t: 'py', tier: 1, sb: 'py', icon: '🧵', title: 'Mix text and numbers',
  story: 'Print `Noah is level 3` using the variables. One option crashes. Read Python\'s error.',
  code: L('name = "Noah"', 'level = 3', 'print({{s}})'), slots: { s: ['"name is level level"', 'name + " is level " + level', '"{name} is level {level}"', 'f"{name} is level {level}"'] }, sol: { s: 'f"{name} is level {level}"' },
  goals: [['It prints Noah is level 3', "_out == 'Noah is level 3\\n'"]],
  hints: ['Python will not glue a string and a number with `+`.', 'An `f` before the quotes makes the `{ }` work.'],
  learn: { h: 'f-strings', x: '`f"{name} is level {level}"` is an **f-string**. Expressions in `{ }` are evaluated and inserted. Without the `f`, the braces are just characters.\n\n`"is level " + 3` gives `TypeError: can only concatenate str (not "int") to str`. JavaScript would quietly glue them together. Python refuses and makes you be explicit, with `str(level)` or an f-string.', terms: ['string', 'f-string', 'type-error'] } });
CH({ id: 'p-int', t: 'py', tier: 1, sb: 'py', icon: '🔢', title: 'Input is always text', inputs: ['30'],
  story: 'The program asks for your age (the sandbox types "30") and should print next year\'s age: 31. `input()` hands back something that cannot do math yet.',
  code: L('age = {{f}}(input("How old are you? "))', 'print(age + 1)'), slots: { f: { o: ['', 'str', 'len', 'int'], l: ['(nothing)', 'str', 'len', 'int'] } }, sol: { f: 'int' },
  goals: [['It prints 31', "_out.endswith('31\\n')"], ['age is the number 30', "age == 30"]],
  hints: ['`input()` always gives a string, even when someone types digits.', '`int(...)` converts text to a whole number.'],
  learn: { h: 'Type conversion', x: '`input()` always returns a **string**. `"30" + 1` is a TypeError. `int("30")` converts it to the number 30. `float()` does decimals, and `str()` goes back to text.\n\n`len("30")` is 2, the number of characters, so it "works" and gives 3. The code runs, and the answer is wrong. Those bugs are the hardest to spot.', terms: ['data-type', 'input', 'type-conversion'] } });
CH({ id: 'p-indent', t: 'py', tier: 1, sb: 'py', icon: '↹', title: 'Indentation is code',
  story: 'It should print lap 0, lap 1, lap 2, and then **done** once. In Python, the spaces at the start of a line decide what is inside the loop.',
  code: L('for lap in range(3):', '{{ind}}print("lap", lap)', '{{ind2}}print("done")'), slots: { ind: { o: ['', '    '], l: ['(no indent)', '⇥ 4 spaces'] }, ind2: { o: ['    ', ''], l: ['⇥ 4 spaces', '(no indent)'] } }, sol: { ind: '    ', ind2: '' },
  goals: [['Three laps, then done once', "_out == 'lap 0\\nlap 1\\nlap 2\\ndone\\n'"]],
  hints: ['Indented lines belong to the `for` above them.', 'Indent the lap line, and do not indent done.'],
  learn: { h: 'Blocks by indentation', x: 'JavaScript uses `{ }` to group lines. Python uses **indentation**. Lines indented under `for ...:` are the loop body, and the first line back at the left edge runs after the loop.\n\nNo indent gives `IndentationError: expected an indented block`. The style guide (PEP 8) says 4 spaces.', terms: ['block', 'indentation'] } });
CH({ id: 'p-range', t: 'py', tier: 1, sb: 'py', icon: '📏', title: 'Count from 1 to 5',
  story: 'Print the numbers 1 to 5, one per line. `range` has a surprise at the end.',
  code: L('for i in range({{a}}, {{b}}):', '    print(i)'), slots: { a: { n: [0, 6, 1], s: 0 }, b: { n: [0, 7, 1], s: 0 } }, sol: { a: 1, b: 6 },
  goals: [['1, 2, 3, 4, 5', "_out == '1\\n2\\n3\\n4\\n5\\n'"]],
  hints: ['`range(start, stop)` stops **before** the stop number.', '`range(1, 6)`.'],
  learn: { h: 'range excludes the end', x: '`range(1, 6)` gives 1, 2, 3, 4, 5. The stop value is **excluded**. That sounds odd, but `range(0, len(items))` then gives exactly every index, and `range(5)` runs exactly 5 times.\n\nThe same "half-open" idea is behind JavaScript\'s `slice` and C++ loops like `i < n`.', terms: ['loop'] } });
CH({ id: 'p-list', t: 'py', tier: 1, sb: 'py', icon: '🧑‍🤝‍🧑', title: 'Join the party',
  story: 'Add Sam to the **end** of the party list. JavaScript and Python name this differently. Read each error message.',
  code: L('party = ["Noah", "Ava"]', 'party.{{m}}("Sam")', 'print(party)'), slots: { m: ['push', 'add', 'insert', 'append'] }, sol: { m: 'append' },
  goals: [['party is Noah, Ava, Sam', "party == ['Noah', 'Ava', 'Sam']"]],
  hints: ['`push` is JavaScript. Python\'s word means "attach at the end".', '`append`.'],
  learn: { h: 'Lists and methods', x: 'Python **lists** are like JavaScript arrays. `append(x)` adds to the end. `insert(i, x)` needs a position too, so calling it with one argument is a TypeError. `push` and `add` do not exist on lists: `AttributeError`. (`add` belongs to sets.)\n\nSame idea, different words in each language. That is why developers look things up constantly.', terms: ['list', 'method'] } });
CH({ id: 'p-dict', t: 'py', tier: 1, sb: 'py', icon: '📖', title: 'Take damage',
  story: 'The hero takes 3 damage. Update their HP from 10 to 7 **without** adding any new keys.',
  code: L('hero = {"name": "Noah", "hp": 10}', 'hero[{{k}}] = hero["hp"] - 3', 'print(hero)'), slots: { k: ['hp', '"HP"', '0', '"hp"'] }, sol: { k: '"hp"' },
  goals: [['hp is 7, and there are still 2 keys', "hero == {'name': 'Noah', 'hp': 7}"]],
  hints: ['Dictionary keys here are strings, and they are case-sensitive.', '`"hp"` with quotes and lowercase.'],
  learn: { h: 'Dictionaries', x: 'A **dict** maps keys to values, like a JavaScript object. `hero["hp"] = 7` updates it. Assigning to a key that does not exist, like `"HP"` or `0`, **adds** a new entry. `hp` without quotes is a variable name, which gives `NameError`.\n\nReading a missing key raises `KeyError`. `hero.get("mana", 0)` returns a default instead.', terms: ['key-value', 'dictionary'] } });
CH({ id: 'p-return', t: 'py', tier: 1, sb: 'py', icon: '📐', title: 'Give back the area',
  story: '`area(3, 4)` should **return** 12 so it can be stored in `result`. Watch for an extra line in the output.',
  code: L('def area(w, h):', '    {{body}}', '', 'result = area(3, 4)', 'print(result)'), slots: { body: ['print(w * h)', 'return "w * h"', 'return w * h'] }, sol: { body: 'return w * h' },
  goals: [['result is 12', "result == 12"]],
  hints: ['Printing is not giving back.'],
  learn: { h: 'None is Python\'s "nothing"', x: 'A function without `return` returns **`None`**. So `print(w * h)` printed 12, and then `print(result)` printed `None`. Same idea as JavaScript\'s `undefined`.\n\n`return "w * h"` returns the literal text. Functions that return values can be combined, tested and reused. Functions that only print cannot.', terms: ['function', 'return', 'null'] } });
CH({ id: 'p-accum', t: 'py', tier: 1, sb: 'py', icon: '➕', title: 'Running total',
  story: 'Add up all the numbers. The total should be 15.',
  code: L('total = 0', 'for n in [3, 5, 7]:', '    total {{op}} n', 'print(total)'), slots: { op: ['=', '==', '+='] }, sol: { op: '+=' },
  goals: [['It prints 15', "total == 15 and _out == '15\\n'"]],
  hints: ['`=` replaces, `==` compares, and one operator adds onto the existing value.'],
  learn: { h: 'The accumulator pattern', x: 'Start at zero, then add each item: `total += n`. That is the **accumulator** pattern, the basis of sums, counts and averages. `=` keeps only the last item (7). `==` compares and changes nothing.\n\nPython has a shortcut, `sum([3, 5, 7])`, but you just built what it does inside.', terms: ['loop', 'pattern'] } });
CH({ id: 'p-break', t: 'py', tier: 1, sb: 'py', icon: '🎲', title: 'Stop when you guess it',
  story: 'Check the guesses in order and stop as soon as one matches the secret. The output should end at "Got it: 7".',
  code: L('secret = 7', 'for g in [3, 9, 7, 5]:', '    if g == secret:', '        print("Got it:", g)', '        {{kw}}', '    print("Nope:", g)'), slots: { kw: ['pass', 'continue', 'break'] }, sol: { kw: 'break' },
  goals: [['Nope 3, Nope 9, Got it 7, and nothing after', "_out == 'Nope: 3\\nNope: 9\\nGot it: 7\\n'"]],
  hints: ['One keyword skips to the next lap. Another leaves the loop entirely.'],
  learn: { h: 'break, continue, pass', x: '`break` exits the loop immediately. `continue` skips the rest of this lap and moves to the next item. `pass` does nothing at all. It is a placeholder for when Python needs a line.\n\nThe same keywords exist in JavaScript, C++, Java and Go.', terms: ['loop'] } });
CH({ id: 'p-str', t: 'py', tier: 1, sb: 'py', icon: '✂️', title: 'Clean up a title',
  story: 'Turn the messy text into `Dungeons And Debuggers`: no extra spaces, and each word capitalized. Chain two string methods.',
  code: L('title = "   dungeons and DEBUGGERS  "', 'print(title.{{m1}}().{{m2}}())'), slots: { m1: ['upper', 'lower', 'split', 'strip'], m2: ['upper', 'lower', 'strip', 'title'] }, sol: { m1: 'strip', m2: 'title' },
  goals: [['It prints Dungeons And Debuggers', "_out == 'Dungeons And Debuggers\\n'"]],
  hints: ['One method removes spaces at the ends, and one capitalizes each word.', '`.strip().title()`.'],
  learn: { h: 'Method chaining', x: 'Strings never change. Each method returns a **new** string, so you can chain calls: `title.strip().title()`. `split()` returns a list, and lists have no `.title()`, so that chain crashes with AttributeError.\n\nCleaning input with `strip()` and `lower()` before comparing it saves many bugs. "Noah " does not equal "noah".', terms: ['string', 'method'] } });
CH({ id: 'p-turtle', t: 'py', tier: 1, sb: 'py', icon: '🐢', title: 'Turtle square',
  story: 'A turtle walks and draws a line behind it. Make it draw a **closed square**: 4 sides that end where it started. Drag both numbers.',
  code: L('t = Turtle()', 'for i in range({{n}}):', '    t.forward(100)', '    t.left({{a}})'), slots: { n: { n: [1, 8, 1], s: 1 }, a: { n: [0, 180, 15], s: 0 } }, sol: { n: 4, a: 90 },
  goals: [['Exactly 4 sides', "len(_segs) == 4"], ['It ends where it started', "len(_segs) > 0 and abs(_segs[-1][2]) < 0.5 and abs(_segs[-1][3]) < 0.5"]],
  hints: ['How many sides does a square have, and how sharp is each corner?', '4 sides, 90° turns.'],
  learn: { h: 'Loops draw shapes', x: 'Repeat "forward, turn" N times and you get a shape. A square is 4 × 90°. The turns always add up to 360° for a closed shape, so a hexagon is 6 × 60°.\n\nTurtle graphics are a classic Python teaching tool (`import turtle`). This sandbox includes a lightweight version that draws on the canvas below.', terms: ['loop', 'turtle'] } });
CH({ id: 'p-poly', t: 'py', tier: 2, sb: 'py', icon: '🔷', title: 'Experiment: any polygon', explore: 3,
  story: 'Experiment zone. The turn angle is computed from the number of sides. Try triangles, hexagons and 12-gons in different colors. Every new drawing earns XP.',
  code: L('sides = {{n}}', 't = Turtle()', 't.color("{{c}}")', 'for i in range(sides):', '    t.forward(80)', '    t.left(360 / sides)'), slots: { n: { n: [3, 12, 1], s: 3 }, c: ['#22d3ee', '#f472b6', '#fbbf24', '#4ade80'] }, sol: { n: 6 },
  goals: [['A closed shape', "len(_segs) == sides and abs(_segs[-1][2]) < 0.5 and abs(_segs[-1][3]) < 0.5"]],
  hints: ['Change the sides and the color, and run each version.'],
  learn: { h: 'Generalize with variables', x: '`360 / sides` makes one program draw every regular polygon. Replacing a hard-coded number with a variable is **generalizing**, and it turns a one-off script into a tool.\n\nWith many sides the shape looks like a circle. That is roughly how computers draw curves: lots of tiny straight lines.', terms: ['abstraction'] } });
CH({ id: 'p-comp', t: 'py', tier: 2, sb: 'py', icon: '🧪', title: 'Squares of the evens',
  story: 'Build `[4, 16, 36]`: the **squares** of only the **even** numbers. A list comprehension does it in one line.',
  code: L('nums = [1, 2, 3, 4, 5, 6]', 'evens = [{{expr}} for n in nums if n {{cond}}]', 'print(evens)'), slots: { expr: ['n', 'n * 2', 'n * n'], cond: ['> 3', '% 2', '% 2 == 0'] }, sol: { expr: 'n * n', cond: '% 2 == 0' },
  goals: [['evens is [4, 16, 36]', "evens == [4, 16, 36]"]],
  hints: ['A number is even when dividing by 2 leaves 0.', '`n * n` and `% 2 == 0`.'],
  learn: { h: 'List comprehensions', x: '`[expr for item in list if condition]` builds a new list: a map and a filter in one line. It is Python\'s version of JavaScript\'s `nums.filter(...).map(...)`.\n\n`n % 2` alone is 1 for odd numbers, which counts as true, so it keeps the **odd** ones. In Python, 0 is falsy and other numbers are truthy.', terms: ['list', 'list-comprehension', 'map', 'filter'] } });
CH({ id: 'p-count', t: 'py', tier: 2, sb: 'py', icon: '📊', title: 'Count the words',
  story: 'Count how many times each word appears. The trick is a word you have not seen yet. Pick a method that gives a default instead of crashing.',
  code: L('text = "the cat and the hat and the bat"', 'counts = {}', 'for word in text.split():', '    counts[word] = counts{{m}} + 1', 'print(counts)'), slots: { m: ['[word]', '.pop(word, 0)', '.get(word, 0)'] }, sol: { m: '.get(word, 0)' },
  goals: [['"the" appears 3 times', "counts.get('the') == 3"], ['"and" appears 2 times', "counts.get('and') == 2"]],
  hints: ['`counts[word]` crashes the first time a word appears.', '`.get(word, 0)` returns 0 for new words.'],
  learn: { h: 'Defaults and KeyError', x: '`counts["cat"]` on a missing key raises `KeyError`. `counts.get("cat", 0)` returns 0 instead, so the first time becomes 0 + 1. `pop` removes the key, which would reset the count each time.\n\nThis pattern is so common that Python has `collections.Counter(text.split())`, which does the whole thing in one call.', terms: ['dictionary', 'exception'] } });
CH({ id: 'p-file', t: 'py', tier: 2, sb: 'py', icon: '📄', title: 'Write a notes file',
  story: 'Write two lines to `notes.txt`, then read the file back. Both lines should survive. The file mode decides whether the second write keeps the first line.',
  code: L('import os', 'if os.path.exists("notes.txt"):', '    os.remove("notes.txt")  # start fresh on every run', '', 'with open("notes.txt", "{{mode}}") as f:', '    f.write("Buy milk\\n")', 'with open("notes.txt", "{{mode}}") as f:', '    f.write("Learn Python\\n")', '', 'contents = open("notes.txt").read()', 'print(contents)'), slots: { mode: ['w', 'r', 'a'] }, sol: { mode: 'a' },
  goals: [['Both lines are in the file', "contents == 'Buy milk\\nLearn Python\\n'"]],
  hints: ['"w" means write from scratch, and "r" means read only.', '"a" means append.'],
  learn: { h: 'Files and modes', x: '`open(name, "w")` creates or **overwrites** a file. `"a"` **appends** to the end. `"r"` is read-only, so writing fails. `with` closes the file automatically, even if an error happens.\n\nThis is a real file system inside the browser\'s Python. On your own computer, the same code writes a file next to your script.', terms: ['file'] } });
CH({ id: 'p-try', t: 'py', tier: 2, sb: 'py', icon: '🛟', title: 'Divide safely',
  story: '`safe_div` should return `None` instead of crashing when dividing by zero. Catch the right kind of error.',
  code: L('def safe_div(a, b):', '    try:', '        return a / b', '    except {{e}}:', '        return None', '', 'print(safe_div(6, 3))', 'print(safe_div(1, 0))'), slots: { e: ['ValueError', 'TypeError', 'ZeroDivisionError'] }, sol: { e: 'ZeroDivisionError' },
  goals: [['safe_div(6, 3) is 2', "safe_div(6, 3) == 2"], ['safe_div(1, 0) is None', "safe_div(1, 0) is None"]],
  hints: ['Run it once without the fix and read the error name in the traceback.', '`ZeroDivisionError`.'],
  learn: { h: 'Exceptions', x: 'When something goes wrong, Python **raises** an exception with a specific type. `try/except SomeError` catches only that type. Catch the wrong type and the error flies right past.\n\nCatching everything with a bare `except:` hides real bugs. Catch what you expect and handle it on purpose. The traceback is a map: the last line names the error, and the lines above show where.', terms: ['exception', 'try-catch'] } });
CH({ id: 'p-class', t: 'py', tier: 3, sb: 'py', icon: '🛡️', title: 'Build a Hero class',
  story: 'Each hero should remember **its own** name. Two options run without errors for one hero. Then a second hero shows the difference.',
  code: L('class Hero:', '    def __init__(self, name):', '        {{a}} = name', '        self.hp = 10', '', '    def hit(self, damage):', '        self.hp -= damage', '', 'h = Hero("Noah")', 'h.hit(3)', 'print(h.name, h.hp)'), slots: { a: ['name', 'Hero.name', 'self.name'] }, sol: { a: 'self.name' },
  goals: [['It prints Noah 7', "_out == 'Noah 7\\n'"], ['A second hero has its own name', "Hero('Ava').name == 'Ava' and h.name == 'Noah'"]],
  hints: ['Inside a method, `self` is the specific object being created.', '`self.name = name`.'],
  learn: { h: 'Classes and self', x: 'A **class** is a blueprint, and each `Hero(...)` is an **instance**. `self.name` stores data on that one instance. Plain `name = name` makes a local variable that vanishes when the function ends. `Hero.name` stores it on the **class**, so every hero shares one name, and the last one wins.\n\nJavaScript uses `this` where Python uses `self`.', terms: ['object', 'class'] } });

// ---------- Text Adventure project ----------
CH({ id: 'quest-1', t: 'py', tier: 2, sb: 'py', icon: '🐉', title: 'Adventure: the hero', proj: ['quest', 1],
  story: 'Project: a text adventure game in 5 steps. First, create the hero and print the opening line. A hero with 0 HP will not last long.',
  code: L('hero = "{{name}}"', 'hp = {{hp}}', 'gold = 0', 'print(f"{hero} enters the dungeon with {hp} HP and {gold} gold.")'), slots: { name: ['Noah', 'Ava', 'Sir Debugs-a-Lot'], hp: { n: [0, 30, 5], s: 0 } }, sol: { hp: 20 },
  goals: [['The hero has at least 10 HP', "hp >= 10"], ['The story begins', "'enters the dungeon' in _out"]],
  hints: ['Drag hp up.'],
  learn: { h: 'State for a whole game', x: 'Variables like `hp` and `gold` are the game\'s **state**. Every game, app and website is mostly state, plus the rules for changing it.\n\nNext you will build a map out of dictionaries.', terms: ['state', 'variable'] } });
var ROOMS = L('rooms = {', '    "hall": {"north": "armory", "east": "library"},', '    "armory": {"south": "hall"},', '    "library": {"west": "hall"},', '}');
CH({ id: 'quest-2', t: 'py', tier: 2, sb: 'py', icon: '🗺️', title: 'Adventure: the map', proj: ['quest', 2],
  story: 'The map is a dictionary of rooms, and each room lists its exits. Walk **north** from the hall into the armory.',
  code: L(ROOMS, 'here = "hall"', 'here = rooms[here][{{dir}}]', 'print("You are in the", here)'), slots: { dir: ['north', '"North"', '"north"'] }, sol: { dir: '"north"' },
  goals: [['You are in the armory', "here == 'armory'"]],
  hints: ['Keys are strings, and capital letters matter.', '`"north"`.'],
  learn: { h: 'Nested dictionaries', x: '`rooms["hall"]` is itself a dict of exits, so `rooms["hall"]["north"]` digs two levels deep. Nesting lets simple pieces describe complex worlds. JSON from web APIs looks exactly like this.\n\n`"North"` raises `KeyError: \'North\'`. In the next step you will handle bad directions properly.', terms: ['dictionary', 'json'] } });
var MOVE = L('def move(here, direction):', '    exits = rooms[here]', '    if direction {{op}} exits:', '        return exits[direction]', '    print("You can\'t go that way.")', '    return here');
CH({ id: 'quest-3', t: 'py', tier: 2, sb: 'py', icon: '🚪', title: 'Adventure: moving around', proj: ['quest', 3],
  story: 'Write `move()`: if the direction is a real exit, go there. Otherwise, stay put and say so.',
  code: L(ROOMS, '', MOVE, '', 'here = "hall"', 'here = move(here, "west")', 'here = move(here, "north")', 'print("You are in the", here)'), slots: { op: ['==', 'not in', 'in'] }, sol: { op: 'in' },
  goals: [['hall + north → armory', "move('hall', 'north') == 'armory'"], ['hall + west → stays in the hall', "move('hall', 'west') == 'hall'"], ['It warns about walls', "\"can't go\" in _out"]],
  hints: ['How do you ask whether a key exists in a dict?', '`if direction in exits`.'],
  learn: { h: 'Check before you use', x: '`key in some_dict` is True if the key exists. Checking first avoids a `KeyError` crash. That is defensive programming: **validate input** before acting on it, especially input from players.', terms: ['input-validation', 'dictionary'] } });
var MOVE_OK = MOVE.replace('{{op}}', 'in');
var LOOK = L('items = {"armory": "sword", "library": "map"}', 'inventory = []', '', 'def look(here):', '    if here in items:', '        thing = items.{{m2}}(here)', '        inventory.{{m}}(thing)', '        print("You found a", thing)', '    else:', '        print("Nothing here.")');
CH({ id: 'quest-4', t: 'py', tier: 2, sb: 'py', icon: '🗡️', title: 'Adventure: loot', proj: ['quest', 4],
  story: 'Looking around a room picks up its item **once**. Looking again should find nothing. Your inventory must hold exactly one sword.',
  code: L(ROOMS, '', MOVE_OK, '', LOOK, '', 'look("armory")', 'look("armory")', 'print(inventory)'), slots: { m: ['add', 'extend', 'append'], m2: ['get', 'pop'] }, sol: { m: 'append', m2: 'pop' },
  goals: [['Inventory is exactly ["sword"]', "inventory == ['sword']"], ['The armory is now empty', "'armory' not in items"]],
  hints: ['`get` reads an item and leaves it there. `extend` adds each **character** of a string.', '`pop` to take it, `append` to add one thing.'],
  learn: { h: 'Reading vs removing', x: '`dict.get(k)` reads, while `dict.pop(k)` reads **and removes**. That is the difference between looking at the sword and picking it up. `list.extend("sword")` adds each letter: `["s", "w", "o", "r", "d"]`, because a string is a sequence of characters.', terms: ['list', 'dictionary'] } });
CH({ id: 'quest-5', t: 'py', tier: 3, sb: 'py', icon: '🏁', title: 'Adventure: the game loop', proj: ['quest', 5], inputs: ['north', 'look', 'south', 'east', 'look', 'quit'],
  story: 'Tie it together with a game loop that reads commands. The sandbox will type: north, look, south, east, look, quit. Typing **quit** must end the game.',
  code: L(ROOMS, '', MOVE_OK, '', LOOK.replace('{{m2}}', 'pop').replace('{{m}}', 'append'), '', 'here = "hall"', 'while True:', '    cmd = input("> ")', '    if cmd == "quit":', '        {{kw}}', '    elif cmd == "look":', '        look(here)', '    else:', '        here = move(here, cmd)', 'print("You leave with:", inventory)'), slots: { kw: ['pass', 'continue', 'break'] }, sol: { kw: 'break' },
  goals: [['You collect the sword and the map', "inventory == ['sword', 'map']"], ['The game ends cleanly', "'You leave with' in _out"]],
  hints: ['`while True` only ends with one keyword.'],
  learn: { h: 'The game loop', x: '`while True:` loops forever: read input, update state, show the result. Only `break` gets out. With `pass` or `continue`, the program kept asking after "quit" and ran out of typed input (EOFError).\n\nEvery game, chat app and server has a loop like this at its heart. 🐉 Your adventure is complete and playable in the 🏗️ Workshop. Try adding rooms!', terms: ['loop', 'state'] } });
