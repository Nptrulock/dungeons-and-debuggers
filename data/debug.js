U('debug', 1, 'db-errors1', 'Reading Error Messages', '🚩', ['error-message', 'syntax-error'], [
 ['mc', 'When you see an error message, the first thing to do is…', ['Read it carefully, it usually says what and where', 'Panic', 'Close the app', 'Restart the computer'], 'Errors are clues, not insults. Most say exactly what went wrong and the line number.'],
 ['err', 'SyntaxError: Unexpected end of input. Likely cause?', ['A missing closing bracket, brace or quote', 'The internet is down', 'Wrong password', 'The server crashed'], 'The computer reached the end of the file still waiting for something to close.'],
 ['err', 'ReferenceError: totl is not defined. Likely cause?', ['A typo: the variable is probably named total', 'The total is zero', 'The math is wrong', 'The file is missing'], 'Spelling mistakes in names are among the most common errors.'],
 ['mc', 'What does "line 12" in an error usually tell you?', ['Where the problem was detected (the cause may be just before)', 'How many errors there are', 'The file size', 'Nothing useful'], 'Start at that line, then look above it. A missing brace on line 10 can be reported on line 12.'],
 ['tf', 'It is a good idea to copy the exact error text when asking someone (or an AI) for help.', true, 'The exact message is far more useful than "it does not work."'],
 ['match', 'Match the error to its usual meaning.', [['SyntaxError', 'Code is not written correctly'], ['ReferenceError', 'Name does not exist'], ['TypeError', 'Wrong kind of value used']], 'The error type is the first clue.'],
 ['err', 'Python: IndentationError: expected an indented block. Fix?', ['Indent the lines under the if/def/for', 'Remove all spaces', 'Add a semicolon', 'Restart Python'], 'Python uses indentation for blocks. The line after a colon must be indented.']
]);
U('debug', 2, 'db-errors2', 'Common Errors', '🧯', ['type-error', 'stack-trace'], [
 ['err', 'TypeError: Cannot read properties of undefined (reading \'name\'). What does it mean?', ['Something you expected to be an object is undefined', 'The name is too long', 'Wrong font', 'The server is offline'], 'Something like user.name where user is undefined. Find why user is missing.'],
 ['err', 'TypeError: x.map is not a function. Likely cause?', ['x is not an array (maybe an object, null, or a string)', 'map is misspelled in the browser', 'Arrays are disabled', 'Missing CSS'], 'Log x to see what it actually is. APIs often return { items: [...] } instead of a bare array.'],
 ['mc', 'A stack trace is…', ['The list of function calls that led to the error', 'A pile of servers', 'A git log', 'A CSS layout'], 'Read it top-down: the top is where it broke; lower lines show who called it.'],
 ['mc', 'In a stack trace, which lines matter most at first?', ['The first lines that point to YOUR code (not libraries)', 'The last line only', 'Lines with the most numbers', 'None'], 'Library internals are usually fine. Find the first frame in your own files.'],
 ['err', 'Python: KeyError: \'email\'. Meaning?', ['The dictionary has no "email" key', 'Email server down', 'Wrong keyboard', 'Encryption failed'], 'Use d.get("email") for a safe default, or find why it is missing.'],
 ['err', 'ModuleNotFoundError: No module named \'requests\'. Fix?', ['Install the package (pip install requests) in the right environment', 'Rename the file', 'Delete Python', 'Use a different browser'], 'The library is not installed where the code runs. Virtual environments often explain this.'],
 ['err', 'Error: listen EADDRINUSE: address already in use :::3000. Fix?', ['Another program is using port 3000: stop it or use another port', 'Reinstall Node', 'Your code has a typo', 'The database is full'], 'Often a dev server you started earlier is still running.'],
 ['tf', 'The line where an error is thrown is always the line with the real bug.', false, 'Bad data might be created far earlier and only crash later. Trace where the value came from.']
]);
U('debug', 2, 'db-logs', 'Logging & Inspecting', '🪵', ['console-log', 'log', 'devtools'], [
 ['mc', 'console.log in the middle of code is used to…', ['See what values actually are at that moment', 'Make code faster', 'Save data', 'Deploy'], 'Check your assumptions: print the value instead of guessing.'],
 ['mc', 'Browser DevTools (F12 / Inspect) let you…', ['See console errors, network requests, and the page structure', 'Edit other people\'s servers', 'Hack websites', 'Install apps'], 'The Console and Network tabs answer most "why is this broken?" questions.'],
 ['mc', 'The Network tab is best for checking…', ['Whether API requests succeed and what they return', 'Font sizes', 'Git history', 'CPU temperature'], 'You can see each request\'s URL, status code and response.'],
 ['mc', 'Which log line is most useful?', ['"Checkout failed for order 812: card declined"', '"here"', '"oops"', '"asdf"'], 'Good logs say what happened, to what, and why.'],
 ['mc', 'Log levels (info, warn, error) help by…', ['Letting you filter what matters', 'Coloring code', 'Encrypting logs', 'Speeding up the app'], 'Production systems collect millions of logs; levels make them searchable.'],
 ['tf', 'You should log passwords and full card numbers so debugging is easier.', false, 'Never log secrets or sensitive data. Logs get copied, stored and shared.'],
 ['mc', 'A breakpoint is…', ['A spot where the debugger pauses so you can inspect everything', 'A crash', 'A git branch', 'A CSS rule'], 'Debuggers let you step line by line and watch values change.']
]);
U('debug', 3, 'db-tests', 'Unit Tests', '✅', ['test', 'unit-test', 'assertion'], [
 ['mc', 'An automated test is…', ['Code that checks other code behaves as expected', 'A quiz for developers', 'A manual click-through', 'A server'], 'Tests run in seconds and catch regressions every time.'],
 ['mc', 'A unit test checks…', ['One small piece (like a function) in isolation', 'The whole app', 'The design', 'The server hardware'], 'Small, fast and focused.'],
 ['mc', 'What is this test checking?', ['That add(2, 3) returns 5', 'That add exists', 'That 5 is a number', 'Nothing'], 'expect(actual).toBe(expected) is an assertion. If it is false, the test fails.', 'test("adds numbers", () => {\n  expect(add(2, 3)).toBe(5)\n})'],
 ['mc', 'A "regression" is…', ['Something that used to work breaking again', 'Going back to an old version on purpose', 'A slow test', 'A refactor'], 'Tests are the main defense against regressions.'],
 ['order', 'Order the "Arrange, Act, Assert" test pattern.', ['Arrange: set up the data', 'Act: call the code', 'Assert: check the result'], 'This structure keeps tests readable.'],
 ['mc', 'Which is the best extra test for a divide(a, b) function?', ['What happens when b is 0', 'divide(10, 2) again', 'divide(4, 2) with comments', 'Testing the font'], 'Test edge cases, not just repeat happy paths.'],
 ['tf', 'If an AI writes code and its own tests, and the tests pass, the code is definitely correct.', false, 'The AI can write tests that check the wrong thing, or tests that match its bug. Read the tests too.'],
 ['mc', 'TDD (test-driven development) means…', ['Write a failing test first, then code to pass it', 'Test after release', 'Delete tests to ship faster', 'Only test on Tuesdays'], 'Red → green → refactor. Great for directing AI: give it the tests as the spec.']
]);
U('debug', 3, 'db-strategy', 'Debugging Strategies', '🎯', ['bisect', 'minimal-repro'], [
 ['mc', 'A minimal reproduction is…', ['The smallest code/steps that still show the bug', 'A tiny screenshot', 'A bug in small code only', 'A short commit message'], 'Stripping everything else away often reveals the cause, and makes it easy to share.'],
 ['mc', 'Binary search debugging means…', ['Repeatedly cutting the suspect area in half to find the cause', 'Debugging only 0s and 1s', 'Searching Google twice', 'Testing every line in order'], 'Disable half the code: still broken? The bug is in the other half. Repeat.'],
 ['git', 'Find which commit introduced a bug by binary search through history.', ['git bisect', 'git blame', 'git log', 'git stash'], 'git bisect checks out commits halfway between "good" and "bad" until it finds the culprit.'],
 ['mc', 'It works on your computer but not in production. Common causes?', ['Different environment variables, data, or versions', 'Production hates you', 'The code is cursed', 'Computers are random'], '"Works on my machine" usually means the environments differ.'],
 ['mc', 'A "heisenbug" is…', ['A bug that changes or disappears when you try to observe it', 'A bug in physics software', 'A bug only in Germany', 'A typo'], 'Often caused by timing (race conditions). Adding logs changes the timing.'],
 ['mc', 'You are stuck for an hour. Best move?', ['Write down what you know, take a break, or ask someone with your notes', 'Keep changing random things', 'Rewrite the whole app', 'Delete the tests'], 'Fresh eyes (and a clear write-up of what you tried) solve a surprising number of bugs.']
]);
U('debug', 4, 'db-testing2', 'Testing Strategy', '🧪', ['integration-test', 'e2e-test', 'mock', 'coverage'], [
 ['match', 'Match the test type.', [['Unit test', 'One function'], ['Integration test', 'Several parts together'], ['End-to-end test', 'Whole app like a real user']], 'The "testing pyramid": many unit tests, fewer integration, a few E2E.'],
 ['mc', 'A mock is…', ['A fake version of a dependency used in tests', 'Making fun of code', 'A real database', 'A screenshot'], 'Mocks let you test without calling real payment or email services.'],
 ['mc', 'Test coverage of 100% means…', ['Every line ran during tests, not that every behavior is correct', 'The code has no bugs', 'Tests are perfect', 'All users tested it'], 'Coverage shows what ran, not whether it was checked well.'],
 ['mc', 'A "flaky" test…', ['Sometimes passes and sometimes fails without code changes', 'Always fails', 'Tests pastry', 'Is very fast'], 'Flaky tests erode trust. Usually timing, randomness or shared state.'],
 ['tf', 'E2E tools like Playwright can click through a real browser automatically.', true, 'They simulate real users: open page, tap button, check result.'],
 ['mc', 'Why are tests especially valuable when using AI agents?', ['They give the agent and you an objective check that changes did not break things', 'AI cannot run without tests', 'They make the AI cheaper', 'They are not'], 'Agents can run tests, see failures and fix them in a loop.']
]);
U('debug', 5, 'db-observe', 'Observability', '🔭', ['observability', 'metric', 'trace', 'alert'], [
 ['match', 'Match the three pillars of observability.', [['Logs', 'Detailed event records'], ['Metrics', 'Numbers over time'], ['Traces', 'A request\'s path through services']], 'Together they explain what a system is doing in production.'],
 ['mc', 'A good alert should be…', ['Actionable: someone needs to do something now', 'Sent for every log line', 'Silent', 'Only weekly'], 'Too many alerts cause "alert fatigue" and real ones get ignored.'],
 ['mc', 'p99 latency means…', ['99% of requests were faster than this time', 'The average', 'The fastest request', '99 requests'], 'Averages hide the slow outliers that real users feel.'],
 ['mc', 'A postmortem should focus on…', ['What happened, why, and how to prevent it, without blame', 'Who to fire', 'Hiding the incident', 'Nothing'], 'Blameless postmortems encourage honesty, which leads to real fixes.'],
 ['mc', 'Error tracking tools (like Sentry) help by…', ['Capturing errors from real users with stack traces and context', 'Writing code', 'Blocking hackers', 'Hosting sites'], 'You learn about bugs before users report them.']
]);
