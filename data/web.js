U('web', 1, 'wb-basics', 'How the Web Works', '🌐', ['browser', 'website', 'url', 'internet'], [
 ['mc', 'A web browser (Chrome, Safari) is…', ['An app that downloads web pages and displays them', 'The internet itself', 'A search engine only', 'A server'], 'The browser requests files from servers and turns them into the page you see.'],
 ['match', 'Match the part of https://shop.com/shoes to its name.', [['https', 'Protocol'], ['shop.com', 'Domain'], ['/shoes', 'Path']], 'A URL is an address: how to talk (protocol), which site (domain), which page (path).'],
 ['mc', 'What is a server?', ['A computer that stores and sends out websites and data', 'A person who types URLs', 'Your phone screen', 'A cable'], 'Servers "serve" requests. When you visit a site, a server somewhere sends you the files.'],
 ['tf', 'The internet and the web are exactly the same thing.', false, 'The internet is the global network. The web is one thing that runs on it, like email and video calls also do.'],
 ['order', 'Order what happens when you visit a website.', ['You type a URL', 'The browser finds the server\'s address', 'The browser asks the server for the page', 'The server sends back files', 'The browser displays the page'], 'Request → response is the heartbeat of the web.'],
 ['mc', 'The three main languages of a web page are…', ['HTML, CSS, JavaScript', 'Python, Java, C', 'SQL, JSON, Git', 'HTTP, URL, DNS'], 'HTML = content, CSS = style, JavaScript = behavior.'],
 ['match', 'Match the language to its job.', [['HTML', 'Structure and content'], ['CSS', 'Colors, layout, style'], ['JavaScript', 'Interactivity']], 'Think of a house: HTML is the walls, CSS is the paint, JavaScript is the electricity.'],
 ['mc', 'What does the lock 🔒 / "https" mean?', ['The connection is encrypted', 'The site is guaranteed safe and honest', 'The site is government-run', 'The site is fast'], 'HTTPS encrypts data in transit. A scam site can still have HTTPS, so it is not proof of trust.']
]);
U('web', 1, 'wb-html', 'HTML Basics', '🧱', ['html', 'tag', 'element', 'attribute'], [
 ['mc', 'HTML stands for…', ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink Text Machine Language'], 'It is a markup language: it labels content (this is a heading, this is a link).'],
 ['mc', 'What does this create?', ['A big heading that says Hello', 'A link', 'A button', 'A comment'], '<h1> is the top-level heading. Tags usually come in pairs: <h1> opens, </h1> closes.', '<h1>Hello</h1>'],
 ['match', 'Match the tag to what it makes.', [['<p>', 'Paragraph'], ['<a>', 'Link'], ['<img>', 'Image'], ['<button>', 'Button']], 'Tags describe meaning. Browsers know how to display each one.'],
 ['mc', 'In <a href="https://x.com">X</a>, what is href?', ['An attribute: the link\'s destination', 'A tag', 'The link text', 'A CSS style'], 'Attributes add details to a tag. href says where a link goes.'],
 ['bug', 'Which line is broken?', ['<ul>', '  <li>Milk</li>', '  <li>Eggs', '</ul>'], 2, 'The second <li> is never closed with </li>. Browsers often guess, but unclosed tags cause layout bugs.'],
 ['mc', 'What is the alt attribute for?', ['Text describing the image for screen readers and when it fails to load', 'An alternate image size', 'Animation', 'A tooltip color'], 'alt text is essential for accessibility, used by blind users\' screen readers.', '<img src="dog.jpg" alt="A golden retriever">'],
 ['fill', 'Make a link to example.com.', '<a ___="https://example.com">Visit</a>', ['href'], ['src', 'link', 'url'], 'Links use href; images use src.'],
 ['tf', 'HTML elements can be nested inside each other.', true, 'Pages are trees of elements: a <ul> contains <li>s, a <div> contains everything.']
]);
U('web', 2, 'wb-css', 'CSS Basics', '🎨', ['css', 'selector', 'class'], [
 ['mc', 'What does this CSS do?', ['Makes all paragraphs red', 'Makes the page red', 'Creates a paragraph', 'Nothing'], 'p is the selector (which elements); color: red is the rule.', 'p { color: red; }'],
 ['mc', 'In CSS, .card selects…', ['Elements with class="card"', 'The element with id="card"', 'All <card> tags', 'Every element'], '. means class, # means id.'],
 ['match', 'Match the selector to what it targets.', [['h1', 'All h1 elements'], ['.btn', 'Elements with class btn'], ['#logo', 'The element with id logo']], 'Classes are reusable; ids should be unique on the page.'],
 ['mc', 'Which property changes the space INSIDE an element\'s border?', ['padding', 'margin', 'gap', 'border'], 'Padding is inside the border; margin is outside it. This is the "box model."'],
 ['mc', 'display: flex is mostly used to…', ['Lay out children in a row or column with easy alignment', 'Make text bold', 'Animate elements', 'Hide elements'], 'Flexbox is the everyday tool for layouts like nav bars and button rows.'],
 ['mc', 'What is a media query for?', ['Applying styles only on certain screen sizes', 'Playing videos', 'Querying a database', 'Loading fonts'], 'Media queries make pages responsive: one layout on phones, another on desktops.', '@media (max-width: 600px) {\n  .sidebar { display: none; }\n}'],
 ['tf', 'CSS stands for Cascading Style Sheets.', true, '"Cascading" means multiple rules can apply, and the more specific or later one wins.'],
 ['bug', 'Which line has the error?', ['.title {', '  color blue;', '  font-size: 24px;', '}'], 1, 'CSS needs a colon between property and value: color: blue;']
]);
U('web', 2, 'wb-cs', 'Client vs Server', '🖥️', ['client', 'server', 'frontend', 'backend'], [
 ['match', 'Match the term.', [['Client', 'Your browser or app that asks'], ['Server', 'The computer that answers'], ['Request', 'The ask'], ['Response', 'The answer']], 'Client asks, server answers. That is the core pattern of web apps.'],
 ['mc', 'The "frontend" of a web app is…', ['The part that runs in the user\'s browser', 'The database', 'The company lobby', 'The server room'], 'Frontend = what users see and touch. Backend = servers and data behind it.'],
 ['mc', 'Where should a check like "is this user allowed to delete this post?" happen?', ['On the server (backend)', 'Only in the browser', 'In the CSS', 'Nowhere'], 'Anything in the browser can be changed by the user. Security checks must happen on the server.'],
 ['tf', 'Users can see and modify JavaScript that runs in their browser.', true, 'Frontend code is shipped to the user. Never put secrets (like API keys) in it.'],
 ['mc', 'Which belongs on the backend?', ['Storing passwords and talking to the database', 'Button hover colors', 'Animating a menu', 'Choosing a font'], 'Sensitive work and data live on the server.'],
 ['mc', 'A "full-stack" developer works on…', ['Both frontend and backend', 'Only databases', 'Only design', 'Only servers'], 'The "stack" is all the layers, from UI down to database.'],
 ['mc', 'A static site (like this game on GitHub Pages) is…', ['Files served as-is, with no custom server code', 'A site that never changes color', 'A broken site', 'A database'], 'Static hosting just hands out HTML/CSS/JS files. Logic runs in the browser.']
]);
U('web', 2, 'wb-http', 'HTTP & Status Codes', '📨', ['http', 'status-code', 'http-method'], [
 ['match', 'Match the HTTP method to its usual job.', [['GET', 'Read data'], ['POST', 'Create something'], ['PUT/PATCH', 'Update something'], ['DELETE', 'Remove something']], 'Methods are verbs. Loading a page is a GET; submitting a form is often a POST.'],
 ['match', 'Match the status code to its meaning.', [['200', 'OK'], ['404', 'Not found'], ['500', 'Server error'], ['401', 'Not logged in']], '2xx = success, 4xx = the request was wrong, 5xx = the server broke.'],
 ['mc', 'A 4xx status usually means…', ['The problem is with the request (client side)', 'The server crashed', 'Everything worked', 'The site moved'], 'Wrong URL, not logged in, bad data: 4xx. Server bugs: 5xx.'],
 ['err', 'Your app shows "500 Internal Server Error" after a form submit. Where do you look?', ['The server logs for that request', 'The CSS file', 'The user\'s Wi-Fi', 'The HTML title'], '500 means the server code failed. Server logs will show the actual error.'],
 ['mc', 'What does a 301 status mean?', ['Moved permanently (redirect)', 'Too many requests', 'Forbidden', 'Created'], '3xx codes are redirects. 301 tells browsers and search engines the new address.'],
 ['mc', 'What is 403?', ['Forbidden: you are known but not allowed', 'Not found', 'Server down', 'OK'], '401 = who are you? 403 = I know who you are, and the answer is no.'],
 ['tf', 'HTTP headers carry extra info like content type and authorization tokens.', true, 'Headers are metadata about a request or response, separate from the body.'],
 ['mc', 'What does 429 mean?', ['Too many requests (rate limited)', 'Created', 'Gone', 'Timeout'], 'Many APIs limit how often you can call them. Slow down and retry later.']
]);
U('web', 3, 'wb-api', 'APIs & JSON', '🔌', ['api', 'json', 'endpoint'], [
 ['mc', 'An API is…', ['A defined way for programs to talk to each other', 'A type of website design', 'A database table', 'A programming language'], 'Application Programming Interface: a menu of requests one program offers to others.'],
 ['mc', 'JSON is…', ['A text format for data using keys and values', 'A JavaScript framework', 'A database', 'A person named Jason'], 'JSON looks like JavaScript objects and is the most common way APIs send data.'],
 ['out', 'What is user.tags[1]?', ['"cooking"', '"music"', '2', 'undefined'], 'tags is an array; index 1 is the second item.', '{\n  "name": "Ana",\n  "tags": ["music", "cooking"],\n  "active": true\n}'],
 ['bug', 'Which line makes this invalid JSON?', ['{', '  "name": "Ana",', '  age: 30', '}'], 2, 'In JSON, keys must be in double quotes: "age": 30.'],
 ['mc', 'An API "endpoint" is…', ['A specific URL that does one thing, like /api/users', 'The end of the internet', 'A server shutting down', 'The last line of code'], 'Each endpoint + method is one capability, e.g. GET /api/users lists users.'],
 ['mc', 'An API key is…', ['A secret that identifies your app to the API, kept private', 'A keyboard shortcut', 'The first item in JSON', 'Public information'], 'Treat API keys like passwords. Leaked keys get abused and can cost real money.'],
 ['tf', 'JSON.parse turns a JSON string into a usable JavaScript object.', true, 'And JSON.stringify does the reverse: object → string to send.'],
 ['mc', 'Which is valid JSON?', ['{"ok": true, "count": 3}', "{'ok': true}", '{ok: true}', '{"ok": True}'], 'JSON needs double quotes and lowercase true/false.'],
 ['order', 'Order a typical API call from a web page.', ['Build the request (URL, method, data)', 'Send it with fetch', 'Wait for the response', 'Check the status code', 'Parse the JSON and update the page'], 'Checking the status before using the data avoids confusing bugs.']
]);
U('web', 3, 'wb-dom', 'The DOM & Events', '🌳', ['dom', 'event'], [
 ['mc', 'The DOM is…', ['The browser\'s live, editable model of the page', 'A database', 'A CSS file', 'A server'], 'JavaScript changes the page by changing the DOM (Document Object Model).'],
 ['mc', 'What does this do?', ['Finds the element with id "title" and changes its text', 'Creates a title', 'Deletes the page', 'Styles the title'], 'Selecting an element and setting properties is how JavaScript updates the page.', 'document.getElementById("title").textContent = "Hi!"'],
 ['mc', 'What does addEventListener("click", ...) do?', ['Runs a function whenever the element is clicked', 'Clicks the button automatically', 'Adds a button', 'Logs every click on the web'], 'Events are things that happen (click, typing, scrolling). Listeners react to them.'],
 ['match', 'Match the event to when it fires.', [['click', 'Element tapped/clicked'], ['input', 'Text field changes'], ['submit', 'Form is sent'], ['load', 'Page finished loading']], 'Interactive web apps are mostly "when X happens, do Y."'],
 ['mc', 'Why use textContent instead of innerHTML for user-provided text?', ['innerHTML can run injected HTML/scripts (XSS); textContent cannot', 'textContent is prettier', 'innerHTML is slower to type', 'No reason'], 'Putting user input into innerHTML is a classic security hole called cross-site scripting.'],
 ['tf', 'Frameworks like React exist largely to manage updating the DOM when data changes.', true, 'You describe what the page should look like for given data; the framework updates the DOM efficiently.']
]);
U('web', 4, 'wb-frameworks', 'Frameworks & Rendering', '⚛️', ['framework', 'component', 'state', 'ssr'], [
 ['mc', 'A component (React, Vue, Svelte) is…', ['A reusable piece of UI with its own logic, like a Button or ProfileCard', 'A database row', 'A server', 'A CSS color'], 'Apps are built from components nested like Lego bricks.'],
 ['mc', '"State" in a frontend app is…', ['Data that can change and that the UI displays', 'The US state the user lives in', 'A CSS file', 'The server location'], 'When state changes (e.g. cart items), the UI re-renders to match.'],
 ['mc', 'Server-side rendering (SSR) means…', ['The server builds the HTML before sending it', 'The browser builds everything from JavaScript', 'No server is used', 'Pages are printed'], 'SSR gives faster first paint and better SEO. Client-side rendering builds the page in the browser.'],
 ['mc', 'Props in React are…', ['Inputs passed from a parent component to a child', 'Global variables', 'CSS properties', 'Database fields'], 'Props flow down; a child should not change its props, only read them.'],
 ['tf', 'Next.js is a framework built on top of React.', true, 'It adds routing, server rendering and more on top of React.'],
 ['mc', 'Why might a page "flash" with no data, then fill in?', ['It renders first, then fetches data in the browser', 'The CSS is broken', 'The server is down', 'The monitor is slow'], 'Client-side fetching shows a loading state first. Good apps show skeletons or spinners, not blank space.']
]);
U('web', 4, 'wb-perf', 'Web Performance & Accessibility', '♿', ['accessibility', 'latency', 'cdn'], [
 ['mc', 'Accessibility (a11y) means…', ['Making apps usable by people with disabilities', 'Making apps load fast', 'Access control for admins', 'Free apps'], 'Screen readers, keyboard navigation, color contrast and captions are all accessibility.'],
 ['mc', 'Which helps performance most for a slow, image-heavy page?', ['Compress and resize images, lazy-load offscreen ones', 'Add more JavaScript', 'Use a bigger font', 'Add more colors'], 'Images are often the heaviest part of a page.'],
 ['mc', 'A CDN is…', ['A network of servers worldwide that serve files from close to the user', 'A coding language', 'A database', 'A type of image'], 'Content Delivery Networks cut latency by caching files near users.'],
 ['mc', 'Latency is…', ['The delay before data starts arriving', 'The amount of data', 'Screen brightness', 'Number of users'], 'Low latency feels snappy. Distance and round trips add latency.'],
 ['tf', 'A <div> with a click handler is just as accessible as a <button>.', false, 'Real <button>s get keyboard focus and screen reader support for free. Use the right element.'],
 ['mc', 'Why do color contrast rules matter?', ['Low contrast text is hard or impossible for many people to read', 'They make pages load faster', 'Search engines require purple', 'They do not'], 'WCAG guidelines recommend at least 4.5:1 contrast for normal text.']
]);
U('web', 5, 'wb-sec', 'Web Security', '🛡️', ['xss', 'csrf', 'cors'], [
 ['mc', 'XSS (cross-site scripting) is…', ['An attacker getting their script to run in other users\' browsers on your site', 'A fast stylesheet', 'A login method', 'A database backup'], 'Usually caused by inserting untrusted input into the page as HTML.'],
 ['mc', 'CORS is…', ['Browser rules about which websites may call an API from another origin', 'A CSS framework', 'An encryption algorithm', 'A server OS'], 'CORS errors mean the API did not allow requests from your site\'s origin. The fix is on the server, not by disabling security.'],
 ['err', 'Console: "blocked by CORS policy: No \'Access-Control-Allow-Origin\' header". Best fix?', ['Configure the API server to allow your site\'s origin', 'Ask users to install a CORS-disabling extension', 'Rename the file', 'Use http instead of https'], 'The server must opt in. Browser workarounds only "fix" it on your own machine.'],
 ['mc', 'Cookies marked HttpOnly…', ['Cannot be read by JavaScript, protecting session tokens from XSS', 'Only work over HTTP', 'Expire in an hour', 'Are visible to everyone'], 'HttpOnly limits the damage of XSS by hiding the session cookie from scripts.'],
 ['mc', 'CSRF tricks a user\'s browser into…', ['Sending an unwanted request to a site where they are logged in', 'Downloading a virus', 'Showing ads', 'Clearing cookies'], 'CSRF tokens and SameSite cookies defend against it.']
]);
