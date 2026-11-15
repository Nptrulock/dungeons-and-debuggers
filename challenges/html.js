// HTML + CSS tracks, and the Personal Website project
CH({ id: 'h-first', t: 'html', tier: 1, sb: 'html', icon: '🔤', title: 'Your first page',
  story: 'A browser turns **tags** into a page. This page should open with a big title, but right now the title looks like ordinary text.\n\nTap the highlighted tag name, pick another, and watch the preview change.',
  code: L('<{{t}}>Welcome to my page</{{t}}>', '<p>I am learning to build websites.</p>'),
  slots: { t: ['p', 'b', 'h6', 'h1'] }, sol: { t: 'h1' },
  goals: [['The title is the page\'s **main heading**', "!!q('h1') && txt('h1')==='Welcome to my page'"], ['It is bigger than the paragraph', "!!q('h1') && parseFloat(css('h1','font-size')) > parseFloat(css('p','font-size'))"]],
  hints: ['Headings have their own tags, numbered by importance.', 'The most important heading is number 1: `h1`.'],
  learn: { h: 'Tags give text a meaning', x: '`<h1>` means **main heading**. A tag wraps content: an opening tag `<h1>`, the content, then a closing tag `</h1>` with a slash. Together they make an **element**.\n\nThe browser has default styles for each tag, which is why `h1` is big and bold. There are six heading levels, `<h1>` to `<h6>`, plus `<p>` for paragraphs. Screen readers and search engines read headings to understand the outline of a page, so pick a tag for what the text **is**, not how it looks. Looks are CSS\'s job.', terms: ['html', 'tag', 'element'] } });

CH({ id: 'h-para', t: 'html', tier: 1, sb: 'html', icon: '📃', title: 'Two thoughts, two paragraphs',
  story: 'These two sentences should sit on separate lines as two paragraphs. Instead they run together on one line. Find a tag that puts each sentence in its own block.',
  code: L('<h1>About me</h1>', '<{{a}}>I like building things.</{{a}}>', '<{{a}}>Right now I am learning to code.</{{a}}>'),
  slots: { a: ['span', 'b', 'p'] }, sol: { a: 'p' },
  goals: [['Each sentence is a paragraph', "count('p')===2"], ['The second one starts on a new line', "count('p')===2 && box('p:nth-of-type(2)').top >= box('p').bottom"]],
  hints: ['Some tags flow inline like words. Others stack like blocks.', 'Paragraph is `p`.'],
  learn: { h: 'Block vs inline', x: '`<p>` is a **block** element: it starts on a new line and takes the full width. `<span>` and `<b>` are **inline**: they flow inside a line like words in a sentence.\n\nPressing Enter in your code does nothing on the page. HTML ignores extra spaces and line breaks. Structure comes from tags.', terms: ['element'] } });

CH({ id: 'h-strong', t: 'html', tier: 1, sb: 'html', icon: '💪', title: 'Make one word strong',
  story: 'Only the word **really** should be bold. Put an opening tag before it and a closing tag after it. Try mixing tags that do not match and see what the browser does.',
  code: L('<p>This is {{a}}really{{b}} important.</p>'),
  slots: { a: { o: ['', '<strong>', '<em>', '<u>'], l: ['▢', '<strong>', '<em>', '<u>'] }, b: { o: ['', '</strong>', '</em>', '</u>'], l: ['▢', '</strong>', '</em>', '</u>'] } }, sol: { a: '<strong>', b: '</strong>' },
  goals: [['"really" is inside `<strong>`', "txt('p strong')==='really'"], ['Nothing else is bold', "count('strong')===1 && txt('p')==='This is really important.'"]],
  hints: ['A closing tag has the same name as its opening tag, plus a slash.', 'Use `<strong>` before the word and `</strong>` after it.'],
  learn: { h: 'Opening and closing tags must match', x: 'When the closing tag does not match, the browser does not stop. It quietly guesses where the element ends, often at the end of the paragraph. That is why a typo in HTML can make half a page bold.\n\n`<strong>` means "important" and is usually bold. `<em>` means "emphasis" and is usually italic. They carry meaning that screen readers can announce, unlike plain styling.', terms: ['tag', 'syntax'] } });

CH({ id: 'h-link', t: 'html', tier: 1, sb: 'html', icon: '🔗', title: 'Link to somewhere',
  story: 'Turn "Wikipedia" into a working link to the HTML article, and make it open in a new tab so readers do not lose this page.',
  code: L('<p>Read more on <a {{attr}}="https://en.wikipedia.org/wiki/HTML"{{tgt}}>Wikipedia</a>.</p>'),
  slots: { attr: ['src', 'link', 'url', 'href'], tgt: { o: ['', ' target="_blank"', ' target="new tab"'], l: ['(same tab)', ' target="_blank"', ' target="new tab"'] } }, sol: { attr: 'href', tgt: ' target="_blank"' },
  goals: [['The link goes to the HTML article', "q('a').href==='https://en.wikipedia.org/wiki/HTML'"], ['It opens in a new tab', "q('a').target==='_blank'"]],
  hints: ['Links use an **attribute** whose name is short for "hypertext reference".', '`href` holds the address. `target="_blank"` opens a new tab.'],
  learn: { h: 'Attributes configure an element', x: 'An **attribute** sits inside the opening tag as `name="value"`. The `<a>` (anchor) tag needs `href` to know where to go. Without it, it is just text.\n\n`target="_blank"` is a special keyword meaning "a new tab". Other words like `"new tab"` just create a named window, which is why they behave strangely. Modern browsers also stop the new page from controlling yours, which used to need `rel="noopener"`.', terms: ['attribute', 'url'] } });

CH({ id: 'h-img', t: 'html', tier: 1, sb: 'html', icon: '🖼️', title: 'Add a picture',
  story: 'Show an avatar picture at least 120 pixels wide, and describe it in words for people who cannot see it. `cat.jpg` does not exist on this site. See what happens when you use it anyway.',
  code: L('<img src="{{src}}" alt="{{alt}}" width="{{w}}">', '<p>That\'s me!</p>'),
  slots: { src: { o: ['cat.jpg', AVATAR], l: ['cat.jpg', 'avatar.svg'] }, alt: { o: ['', 'Cartoon robot avatar'], l: ['(empty)', 'Cartoon robot avatar'] }, w: { n: [20, 300, 10], s: 20, u: '' } }, sol: { src: AVATAR, alt: 'Cartoon robot avatar', w: 150 },
  goals: [['The image actually loads', "await wait(200); return q('img').complete && q('img').naturalWidth > 0"], ['It has alt text', "q('img').alt.length > 5"], ['It is at least 120px wide', "box('img').width >= 120"]],
  hints: ['A broken image shows a little icon, plus the alt text if there is one.', 'Pick avatar.svg, add the alt text, and drag width to 120 or more.'],
  learn: { h: 'Images, sources and alt text', x: '`<img>` has no closing tag. It is a **void element**: everything it needs is in its attributes. `src` is the file to load, and if it is missing the browser shows a broken image.\n\n`alt` is read aloud by screen readers and shown when the image fails. Write what the image means: "Cartoon robot avatar", not "image123". `width` is in pixels unless you say otherwise.', terms: ['accessibility', 'attribute', 'void-element'] } });

CH({ id: 'h-list', t: 'html', tier: 1, sb: 'html', icon: '🔢', title: 'Top three, numbered',
  story: 'This is a ranked list, so it should show 1, 2, 3 automatically. Find the list tag that numbers items.',
  code: L('<h2>My top 3 languages to learn</h2>', '<{{t}}>', '  <li>Python</li>', '  <li>JavaScript</li>', '  <li>C++</li>', '</{{t}}>'),
  slots: { t: ['div', 'ul', 'ol'] }, sol: { t: 'ol' },
  goals: [['An ordered (numbered) list with 3 items', "count('ol > li')===3"]],
  hints: ['One list type is "unordered" (bullets). The other is "ordered".', 'Ordered list: `ol`.'],
  learn: { h: 'ul, ol and li', x: '`<ul>` is an **unordered** list with bullets. `<ol>` is an **ordered** list with numbers. Each item is an `<li>`. If you insert an item in the middle of an `ol`, the numbers update by themselves. You never type them.\n\nMenus, navigation bars and to-do lists are usually lists under the hood, styled with CSS.', terms: ['list', 'element'] } });

CH({ id: 'h-nest', t: 'html', tier: 1, sb: 'html', icon: '🪆', title: 'Nesting matters',
  story: 'Bread fell out of the shopping list. The closing `</ul>` is in the wrong place. Move it so all three items are inside the list.',
  code: L('<h2>Shopping</h2>', '<ul>', '  <li>Milk</li>', '  <li>Eggs</li>{{a}}', '  <li>Bread</li>{{b}}'),
  slots: { a: { o: ['\n</ul>', ''], l: ['</ul> here', '▢'] }, b: { o: ['', '\n</ul>'], l: ['▢', '</ul> here'] } }, sol: { a: '', b: '\n</ul>' },
  goals: [['All three items are in the list', "count('ul > li')===3"], ['Bread is the last item', "txt('ul li:last-child')==='Bread'"]],
  hints: ['An element contains everything between its opening and closing tag.', 'Close the list after Bread, not before it.'],
  learn: { h: 'Elements nest like boxes', x: 'HTML is a tree: the `ul` contains the `li`s, the `body` contains the `ul`, and so on. An element ends at its closing tag, so anything after it is outside.\n\nThis tree is called the **DOM**. JavaScript and CSS both work by finding elements in it, so clean nesting makes everything else easier. Indenting nested lines shows the tree at a glance.', terms: ['dom', 'element'] } });

CH({ id: 'h-table', t: 'html', tier: 1, sb: 'html', icon: '📅', title: 'A class schedule table',
  story: 'Make the top row a real header row, then fill in Tuesday\'s class with **Python**. Try putting a whole `<td>` inside a cell and see what the browser builds.',
  code: L('<table>', '  <tr><{{h}}>Day</{{h}}><{{h}}>Class</{{h}}></tr>', '  <tr><td>Mon</td><td>HTML</td></tr>', '  <tr><td>Tue</td><td>{{c}}</td></tr>', '</table>', '<style>td, th { border: 1px solid #999; padding: 4px 10px; }</style>'),
  slots: { h: ['td', 'th'], c: { o: ['', 'Python', '<td>Python</td>'], l: ['▢', 'Python', '<td>Python</td>'] } }, sol: { h: 'th', c: 'Python' },
  goals: [['The first row uses header cells', "count('th')===2"], ['Tuesday has exactly 2 cells: Tue and Python', "count('tr')===3 && count('tr:last-child td')===2 && txt('tr:last-child td:last-child')==='Python'"]],
  hints: ['`th` means table header, `td` means table data.', 'Use `th` for the header, and type just the word Python into the cell.'],
  learn: { h: 'Tables are for grids of data', x: '`<table>` holds rows (`<tr>`). Rows hold cells: `<th>` for headers and `<td>` for data. Screen readers use the headers to say "Class: Python" as you move through cells.\n\nA `<td>` inside a `<td>` is not allowed. The browser fixes it by ending the first cell and starting a new one, so the row gets an extra cell. Browsers always repair broken HTML, sometimes in surprising ways. Use tables for data, and CSS for page layout.', terms: ['element'] } });

CH({ id: 'h-form', t: 'html', tier: 1, sb: 'html', icon: '📝', title: 'A sign-up form',
  story: 'Two problems: tapping the word "Email" should put the cursor in the box, and phones should show the keyboard with the **@** key. Fix both.',
  code: L('<label for="{{f}}">Email</label>', '<input id="email" type="{{t}}" placeholder="you@example.com">', '<button>Sign up</button>'),
  slots: { f: ['mail', 'Email', 'email'], t: ['text', 'password', 'number', 'email'] }, sol: { f: 'email', t: 'email' },
  goals: [['The label is connected to the input', "q('label').control===q('input')"], ['The input is an email field', "q('input').type==='email'"]],
  hints: ['A label\'s `for` must match exactly what? Look at the input\'s attributes.', '`for="email"` matches `id="email"`. Use `type="email"`.'],
  learn: { h: 'Labels and input types', x: 'A `<label for="x">` belongs to the element with `id="x"`. It must match exactly, including uppercase and lowercase. Then tapping the label focuses the box, and screen readers say "Email, edit text".\n\n`type` changes behavior: `email` brings up the @ keyboard and checks the format, `password` hides the text, and `number` shows a number pad. The right type is free usability and basic **input validation**. The server must still validate too, because anyone can bypass the browser.', terms: ['input-validation', 'accessibility'] } });

CH({ id: 'h-semantic', t: 'html', tier: 1, sb: 'html', icon: '🏛️', title: 'Meaningful structure',
  story: 'This page looks fine, but to a screen reader or a search engine it is just three anonymous boxes. Give each part the tag that says what it is: the top banner, the main content, and the bottom footer.\n\nWatch the preview. Does anything change?',
  code: L('<{{a}}>', '  <h1>Noah\'s Site</h1>', '</{{a}}>', '<{{b}}>', '  <p>Welcome! Here is what I am building.</p>', '</{{b}}>', '<{{c}}>', '  <p>© 2026 Noah</p>', '</{{c}}>'),
  slots: { a: ['div', 'section', 'main', 'footer', 'header'], b: ['div', 'header', 'section', 'footer', 'main'], c: ['div', 'header', 'main', 'section', 'footer'] }, sol: { a: 'header', b: 'main', c: 'footer' },
  goals: [['The banner is a `header`', "count('header h1')===1"], ['The content is `main`', "count('main p')===1"], ['The bottom is a `footer`', "count('footer p')===1"]],
  hints: ['The tag names describe their job on the page.', 'header, main, footer, in that order.'],
  learn: { h: 'Semantic HTML', x: 'Nothing changed visually, and that is the point. `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>` and `<article>` look like plain `<div>`s, but they tell machines what each part **means**.\n\nScreen reader users can jump straight to the main content. Search engines understand your page better. Developers can read the structure at a glance. This is called **semantic HTML**.', terms: ['accessibility', 'semantic-html'] } });

CH({ id: 'h-comment', t: 'html', tier: 1, sb: 'html', icon: '🤫', title: 'Hide a draft note',
  story: 'There is a private note on the page. Hide it from visitors but keep it in the file for later, without deleting it. Try opening a comment without closing it.',
  code: L('{{a}}<p>Draft note: launch is Friday</p>{{b}}', '<p>Welcome!</p>'),
  slots: { a: { o: ['', '<!-- '], l: ['▢', '<!--'] }, b: { o: ['', ' -->'], l: ['▢', '-->'] } }, sol: { a: '<!-- ', b: ' -->' },
  goals: [['Only "Welcome!" shows', "count('p')===1 && txt('p')==='Welcome!'"], ['The note is still in the file', "document.body.innerHTML.indexOf('Draft note')>=0"]],
  hints: ['HTML comments start with `<!--` and end with `-->`.', 'Wrap the draft paragraph in `<!--` and `-->`.'],
  learn: { h: 'Comments are hidden, not secret', x: 'Anything between `<!--` and `-->` is a comment. The browser skips it. Forget the closing `-->` and everything after it disappears too.\n\nBut comments are **not private**. Anyone can open "View source" and read them. Never put passwords, keys or private plans in HTML or front-end code. If the browser downloads it, the visitor has it.', terms: ['comment', 'secret'] } });

CH({ id: 'h-entity', t: 'html', tier: 1, sb: 'html', icon: '🔣', title: 'Show a tag as text',
  story: 'You are writing a tutorial and want the page to literally display `<b>`. Typing it directly does something else. Find a way to show the characters themselves.',
  code: L('<p>Use the {{a}} tag for bold text.</p>'),
  slots: { a: ['<b>', '"<b>"', '\\<b\\>', '&lt;b&gt;'] }, sol: { a: '&lt;b&gt;' },
  goals: [['The page shows the text "<b>"', "txt('p')==='Use the <b> tag for bold text.'"], ['No real bold element was created', "count('p b')===0"]],
  hints: ['Some characters are special in HTML, so they have escape codes.', '`&lt;` is <, and `&gt;` is >.'],
  learn: { h: 'Escaping special characters', x: '`<` starts a tag, so to show it you write an **entity**: `&lt;` (less than), `&gt;` (greater than), `&amp;` (&). Quotes and backslashes do not help, because HTML is not a programming language with string escapes.\n\nThis matters for security. If a website puts user text into a page without escaping it, a stranger can inject real tags and scripts. That attack is called **XSS**, and you will try it later.', terms: ['syntax', 'xss', 'entity'] } });

CH({ id: 'h-classid', t: 'html', tier: 1, sb: 'html', icon: '🏷️', title: 'Style many at once',
  story: 'The CSS rule `.tag` should give every skill a gold badge, but none of them are gold. Which attribute connects an element to a `.something` rule?',
  code: L('<style>', '  .tag { background: gold; padding: 2px 8px; border-radius: 6px; }', '</style>', '<p>Skills:', '  <span {{a}}="tag">HTML</span>', '  <span {{a}}="tag">CSS</span>', '  <span {{a}}="tag">JS</span>', '</p>'),
  slots: { a: ['id', 'name', 'style', 'class'] }, sol: { a: 'class' },
  goals: [['All three badges are gold', "return qa('span').length===3 && qa('span').every(function(s){return getComputedStyle(s).backgroundColor==='rgb(255, 215, 0)'})"]],
  hints: ['The dot in `.tag` means "class".', '`class="tag"`.'],
  learn: { h: 'Classes vs ids', x: 'A **class** is a reusable label. Many elements can share `class="tag"`, and the CSS selector `.tag` styles all of them. An **id** must be unique on the page and is selected with `#name`.\n\nUse classes for styling and ids for one-of-a-kind things, like a link target (`href="#about"`) or the element JavaScript needs to find.', terms: ['class', 'selector'] } });

CH({ id: 'h-explore', t: 'html', tier: 1, sb: 'html', icon: '🧪', title: 'Experiment: headings', explore: 3,
  story: 'Experiment zone: no wrong answers. Try different heading levels and colors and watch the preview. Each new combination you run earns XP.',
  code: L('<{{t}} style="color: {{c}}">Level up!</{{t}}>', '<p>Regular paragraph text, for comparison.</p>'),
  slots: { t: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], c: ['black', 'crimson', 'teal', 'darkorange', 'rebeccapurple'] }, sol: { t: 'h2', c: 'teal' },
  goals: [['There is a heading on the page', "!!q('h1,h2,h3,h4,h5,h6')"]],
  hints: ['Change one thing at a time and run each version.'],
  learn: { h: 'Six levels, one style attribute', x: 'Headings go from `h1` (biggest) to `h6` (smaller than normal text). Use them in order, like the chapters and sections of a book.\n\nThe `style` attribute is **inline CSS**. It works, but a `<style>` block or a stylesheet file keeps the design in one place. You will move to that in the CSS track.', terms: ['css'] } });

CH({ id: 'h-a11y', t: 'html', tier: 2, sb: 'html', icon: '♿', title: 'A button everyone can use',
  story: 'This "Add to cart" box works with a mouse, but keyboard users press **Tab** to move between controls and never reach it. Pick an element that is keyboard-friendly.',
  code: L('<p>Ballet slippers · $34</p>', '<{{tag}} class="buy" onclick="this.textContent = \'Added!\'">Add to cart</{{tag}}>'),
  slots: { tag: ['div', 'span', 'a', 'button'] }, sol: { tag: 'button' },
  goals: [['Keyboard users can reach it with Tab', "q('.buy').tabIndex >= 0"], ['Clicking it still works', "click('.buy'); return txt('.buy')==='Added!'"]],
  hints: ['Some elements are focusable by default. Plain boxes are not.', 'A real `<button>`.'],
  learn: { h: 'Use the real element', x: '`<button>` comes with keyboard focus, Enter and Space to press it, and a "button" role for screen readers, all for free. A clickable `<div>` has none of that. An `<a>` without `href` is not focusable either.\n\nRule of thumb: if it does something, use `<button>`. If it goes somewhere, use `<a href>`.', terms: ['accessibility'] } });

// ---------- Personal Website project ----------
var SITE1 = L('<h1>Noah Trulock</h1>', '<p>Learning to code one quest at a time.</p>');
CH({ id: 'site-1', t: 'html', tier: 1, sb: 'html', icon: '🏠', title: 'Start your homepage', proj: ['site', 1],
  story: 'Project time. Over six steps you will build your own personal website, and it stays in the 🏗️ Workshop.\n\nStep 1: put your name at the top as the main heading, with a short tagline underneath.',
  code: L('<{{a}}>Noah Trulock</{{a}}>', '<p>{{tag}}</p>'),
  slots: { a: ['p', 'h2', 'h1'], tag: { o: ['', 'Learning to code one quest at a time.', 'Builder. Dad. New programmer.'], l: ['(empty)', 'Learning to code one quest at a time.', 'Builder. Dad. New programmer.'] } }, sol: { a: 'h1', tag: 'Learning to code one quest at a time.' },
  goals: [['Your name is the main heading', "txt('h1')==='Noah Trulock'"], ['A tagline sits under it', "!!q('p') && txt('p').length > 5"]],
  hints: ['The main heading tag has a number in it.', 'Use h1, then pick a tagline.'],
  learn: { h: 'Every site starts as a file', x: 'This is `index.html`, the file a web server sends when someone visits your address. Real pages also have a `<head>` with the title and settings. The sandbox adds that for you here, and you will see it in the Ship It project.\n\nNext you will add navigation, a picture and a list, then style it with CSS.', terms: ['website', 'html'] } });
var SITE2 = L('<nav>', '  <a href="#about">About</a>', '  <a href="#projects">Projects</a>', '</nav>', SITE1, '<h2 id="about">About</h2>', '<p>I am teaching myself to build software.</p>', '<h2 id="projects">Projects</h2>', '<p>Everything I build in Dungeons &amp; Debuggers.</p>');
CH({ id: 'site-2', t: 'html', tier: 1, sb: 'html', icon: '🧭', title: 'Navigation links', proj: ['site', 2],
  story: 'The nav bar should jump to sections on the same page. "About" already works. Make "Projects" work too: the link and the section it points to.',
  code: L('<nav>', '  <a href="#about">About</a>', '  <a href="{{l}}">Projects</a>', '</nav>', SITE1, '<h2 id="about">About</h2>', '<p>I am teaching myself to build software.</p>', '<h2 id="{{id}}">Projects</h2>', '<p>Everything I build in Dungeons &amp; Debuggers.</p>'),
  slots: { l: ['projects', 'projects.html', '#projects'], id: { o: ['', '#projects', 'projects'], l: ['(empty)', '#projects', 'projects'] } }, sol: { l: '#projects', id: 'projects' },
  goals: [['The Projects link points to `#projects`', "q('nav a:last-child').getAttribute('href')==='#projects'"], ['A section with id "projects" exists', "!!document.getElementById('projects')"]],
  hints: ['Look at how the About link and the About heading are connected.', 'The link uses `#projects`; the id itself has no #.'],
  learn: { h: 'Fragment links', x: '`href="#projects"` means "scroll to the element on this page with `id="projects"`". The `#` part of a URL is called the **fragment**. It is never sent to the server.\n\n`projects` without the `#` would look for a different page called "projects". Small symbols in URLs carry a lot of meaning.', terms: ['url'] } });
var SITE3 = L(SITE2.replace('<p>I am teaching myself to build software.</p>', L('<img src="' + AVATAR + '" alt="Cartoon robot avatar" width="96">', '<p>I am teaching myself to build software.</p>', '<ul>', '  <li>Learning Python</li>', '  <li>Building this website</li>', '  <li>Good coffee</li>', '</ul>')));
CH({ id: 'site-3', t: 'html', tier: 1, sb: 'html', icon: '🖼️', title: 'Avatar and interests', proj: ['site', 3],
  story: 'Add your avatar with good alt text, and turn your interests into a bulleted list.',
  code: SITE2.replace('<p>I am teaching myself to build software.</p>', L('<img src="' + AVATAR + '" alt="{{alt}}" width="96">', '<p>I am teaching myself to build software.</p>', '<{{lt}}>', '  <li>Learning Python</li>', '  <li>Building this website</li>', '  <li>Good coffee</li>', '</{{lt}}>')),
  slots: { alt: { o: ['', 'image', 'Cartoon robot avatar'], l: ['(empty)', 'image', 'Cartoon robot avatar'] }, lt: ['div', 'ol', 'ul'] }, sol: { alt: 'Cartoon robot avatar', lt: 'ul' },
  goals: [['The avatar has descriptive alt text', "q('img').alt.length > 8"], ['Interests are a bulleted list of 3', "count('ul > li')===3"]],
  hints: ['"image" does not tell a blind visitor anything.', 'Describe the picture; use `ul` for bullets.'],
  learn: { h: 'Content first, then style', x: 'Your page now has real structure: navigation, headings, an image and a list. It is plain, but it is complete and accessible. Professionals often build it this way: get the HTML meaning right, then add CSS for looks.\n\nNext stop is the 🎨 CSS track, where this same page gets colors, fonts and a layout.', terms: ['separation-of-concerns'] } });

// ---------- CSS ----------
CH({ id: 'c-color', t: 'css', tier: 1, sb: 'html', icon: '🍅', title: 'Brand color',
  story: 'The brand color for Tomato Soup Co. is called **tomato**. Make the heading that color. Some values below are not real CSS. See what the browser does with them.',
  code: L('<style>', '  h1 { color: {{c}}; }', '</style>', '<h1>Tomato Soup Co.</h1>'),
  slots: { c: ['black', 'Tomato Red', '#tomato', 'tomato'] }, sol: { c: 'tomato' },
  goals: [['The heading is tomato colored', "same('h1','color','tomato')"]],
  hints: ['CSS knows about 140 color names, but they must be spelled exactly.', 'Just `tomato`.'],
  learn: { h: 'Rules, properties, values', x: 'A CSS **rule** is a selector (`h1`), then braces with `property: value;` pairs. `color` sets the text color.\n\nWhen CSS sees a value it does not understand, like `Tomato Red`, it **silently ignores that line**. There is no error message. This is the most common reason your styles do nothing: check the spelling in the browser\'s DevTools.', terms: ['css', 'selector', 'property'] } });

CH({ id: 'c-hex', t: 'css', tier: 1, sb: 'html', icon: '🌤️', title: 'Exact colors with hex',
  story: 'The designer\'s sky blue is **red 135, green 206, blue 235**. Pick the value that matches it exactly. More than one way works.',
  code: L('<style>', '  .sky { height: 80px; border-radius: 12px; background: {{c}}; }', '</style>', '<div class="sky"></div>'),
  slots: { c: ['#ff0000', '#135206235', 'rgb(235, 206, 135)', '#87ceeb', 'rgb(135, 206, 235)'] }, sol: { c: '#87ceeb' },
  goals: [['The box is exactly 135, 206, 235', "same('.sky','background-color','rgb(135, 206, 235)')"]],
  hints: ['Hex uses two digits per color, in base 16: 87 hex = 135.', 'Both `#87ceeb` and `rgb(135, 206, 235)` work. Order is red, green, blue.'],
  learn: { h: 'Hex and RGB', x: 'Screens mix **red, green and blue** light, each from 0 to 255. `rgb(135, 206, 235)` says it in decimal. `#87ceeb` says the same thing in **hexadecimal**: `87` = 135, `ce` = 206, `eb` = 235.\n\nHex counts 0 to 9, then a to f, so two hex digits cover 0 to 255. `#135206235` is not valid hex, so it was ignored.', terms: ['hex-color'] } });

CH({ id: 'c-size', t: 'css', tier: 1, sb: 'html', icon: '🔎', title: 'Readable size',
  story: 'The poster title is tiny. Drag the size until it is bold and big (at least 40px) but still fits on the phone (64px or less).',
  code: L('<style>', '  h1 { font-size: {{s}}px; }', '</style>', '<h1>Spring Recital</h1>', '<p>Saturday · 2 PM</p>'),
  slots: { s: { n: [8, 96, 2], s: 8 } }, sol: { s: 48 },
  goals: [['At least 40px', "parseFloat(css('h1','font-size')) >= 40"], ['At most 64px', "parseFloat(css('h1','font-size')) <= 64"]],
  hints: ['Tap the number and drag the slider.', 'Anything from 40 to 64.'],
  learn: { h: 'Pixels', x: '`px` is a CSS pixel, about 1/96 of an inch at normal zoom. Phones pack several real pixels into one CSS pixel, so a design looks the same size on any screen.\n\nNormal body text is about 16px. Headings are usually 1.5 to 3 times that.', terms: ['css'] } });

CH({ id: 'c-units', t: 'css', tier: 1, sb: 'html', icon: '📏', title: 'Relative units',
  story: 'The notice inside the big box must be exactly **32px**. The page root is 16px and the box is 20px. Several units look right in one place but not another. Find the one that gives exactly 32px here.',
  code: L('<style>', '  .box { font-size: 20px; }', '  .note { font-size: {{u}}; }', '</style>', '<div class="box">', '  <p class="note">Doors open at 1:30</p>', '</div>'),
  slots: { u: ['32', '2em', '200%', '2rem'] }, sol: { u: '2rem' },
  goals: [['The note is exactly 32px', "css('.note','font-size')==='32px'"]],
  hints: ['`em` and `%` scale with the parent. One unit scales with the root of the page instead.', '`rem` = root em. 2 × 16 = 32.'],
  learn: { h: 'rem, em, % and unitless', x: '`em` and `%` multiply the **parent\'s** size, so here they give 40px. `rem` multiplies the **root** (`html`) size, so it gives the same result anywhere. That makes it popular for consistent text.\n\n`32` with no unit is invalid for font-size and was ignored. Zero is the only length that works without a unit.', terms: ['rem'] } });

CH({ id: 'c-box', t: 'css', tier: 1, sb: 'html', icon: '📦', title: 'The box model',
  story: 'The button text touches its border, and the two buttons are glued together. Add space **inside** the buttons and **between** them.',
  code: L('<style>', '  .btn { display: inline-block; border: 2px solid #6366f1; border-radius: 8px;', '         padding: {{p}}px; margin: {{m}}px; }', '</style>', '<span class="btn b1">Save</span><span class="btn b2">Cancel</span>'),
  slots: { p: { n: [0, 32, 2], s: 0 }, m: { n: [0, 24, 2], s: 0 } }, sol: { p: 12, m: 8 },
  goals: [['Space inside the border (padding ≥ 10px)', "parseFloat(css('.btn','padding-top')) >= 10"], ['Space between the buttons (≥ 12px)', "box('.b2').left - box('.b1').right >= 12"], ['They stay on one line', "box('.b1').top === box('.b2').top"]],
  hints: ['One property adds space inside the border, the other outside it.', 'Padding is inside, margin is outside. Margins of neighbors add up.'],
  learn: { h: 'Content, padding, border, margin', x: 'Every element is a box. From the inside out: **content**, **padding** (inside space, which shows the background), **border**, then **margin** (outside space, always transparent).\n\nSide by side, two margins add up: 8 + 8 = 16px. Stacked vertically, they collapse to the larger one. Open DevTools on any site and hover an element to see these four layers.', terms: ['box-model'] } });

CH({ id: 'c-class', t: 'css', tier: 1, sb: 'html', icon: '⚠️', title: 'Target just one',
  story: 'Only the warning should be crimson. The normal paragraph must stay gray. Which selector picks exactly the warning?',
  code: L('<style>', '  p { color: gray; }', '  {{sel}} { color: crimson; }', '</style>', '<p>Class starts at 5 PM.</p>', '<p class="warn">Studio closed Monday!</p>'),
  slots: { sel: ['p', '#warn', 'warn', '.warn'] }, sol: { sel: '.warn' },
  goals: [['The warning is crimson', "same('.warn','color','crimson')"], ['The normal paragraph stays gray', "same('p:not(.warn)','color','gray')"]],
  hints: ['The warning has a class. How do you select a class?', 'A dot: `.warn`.'],
  learn: { h: 'Selectors', x: '`p` selects every paragraph. `.warn` selects anything with `class="warn"`. `#warn` selects `id="warn"`, which does not exist here. `warn` with no symbol looks for a `<warn>` tag.\n\nThe class rule wins over the `p` rule because it is more **specific**. More on that next.', terms: ['selector', 'class'] } });

CH({ id: 'c-spec', t: 'css', tier: 2, sb: 'html', icon: '⚖️', title: 'Why won\'t it turn red?',
  story: 'Someone wrote `p#msg { color: blue }` and now your red rule loses every time. Find a selector for your rule that wins without deleting theirs.',
  code: L('<style>', '  p#msg { color: blue; }', '  {{s}} { color: red; }', '</style>', '<p id="msg" class="note">Why am I not red?</p>'),
  slots: { s: ['p', '.note', 'p.note', '#msg', 'p#msg'] }, sol: { s: 'p#msg' },
  goals: [['The message is red', "same('#msg','color','red')"]],
  hints: ['Count what each selector uses: ids, classes, tags. More ids beat more classes, and more classes beat more tags.', 'An equally specific selector that comes **later** wins: `p#msg`.'],
  learn: { h: 'Specificity and the cascade', x: 'When rules conflict, CSS compares **specificity**: count ids, then classes, then tags. `p#msg` is 1 id + 1 tag. `#msg` is only 1 id, so it loses. `.note` and `p.note` have no id at all.\n\nIf specificity ties, the rule that comes **later** wins. That is the "cascade" in Cascading Style Sheets. `!important` overrides all of this, but it starts an arms race. Prefer simple class selectors everywhere.', terms: ['specificity'] } });

CH({ id: 'c-flex', t: 'css', tier: 1, sb: 'html', icon: '🎯', title: 'Dead center',
  story: 'Centering things used to be a famous web-developer headache. Put the star in the exact middle of the stage, both left-right and top-bottom.',
  code: L('<style>', '  .stage { height: 180px; background: #e0e7ff; border-radius: 12px;', '    display: {{d}}; justify-content: {{j}}; align-items: {{a}}; }', '  .star { font-size: 40px; }', '</style>', '<div class="stage"><span class="star">⭐</span></div>'),
  slots: { d: ['block', 'flex'], j: ['flex-start', 'space-between', 'flex-end', 'center'], a: ['stretch', 'flex-start', 'flex-end', 'center'] }, sol: { d: 'flex', j: 'center', a: 'center' },
  goals: [['Centered left to right', "var s=box('.star'),g=box('.stage');return Math.abs((s.left+s.right)/2-(g.left+g.right)/2)<3"], ['Centered top to bottom', "var s=box('.star'),g=box('.stage');return Math.abs((s.top+s.bottom)/2-(g.top+g.bottom)/2)<3"]],
  hints: ['`justify-content` and `align-items` only work on a flex (or grid) container.', '`display: flex`, then center both directions.'],
  learn: { h: 'Flexbox', x: '`display: flex` turns a box into a **flex container**. `justify-content` places children along the main axis (a row, left to right). `align-items` places them across it (top to bottom).\n\nWith `display: block`, those two properties do nothing, and the browser does not warn you. Flexbox is how most navigation bars, toolbars and card rows are built today.', terms: ['flexbox'] } });

CH({ id: 'c-grid', t: 'css', tier: 2, sb: 'html', icon: '🔲', title: 'Photo gallery grid',
  story: 'Six photos should sit in **two rows of three**, filling the width. Try each column recipe and see what changes.',
  code: L('<style>', '  .grid { display: grid; grid-template-columns: {{cols}}; gap: 8px; }', '  .tile { height: 60px; border-radius: 10px; background: #a78bfa; }', '</style>', '<div class="grid">', '  <div class="tile"></div><div class="tile"></div><div class="tile"></div>', '  <div class="tile"></div><div class="tile"></div><div class="tile"></div>', '</div>'),
  slots: { cols: ['1fr', '1fr 1fr', '120px 120px 120px 120px', 'repeat(3, 1fr)'] }, sol: { cols: 'repeat(3, 1fr)' },
  goals: [['Three per row', "box('.tile:nth-child(1)').top===box('.tile:nth-child(3)').top && box('.tile:nth-child(4)').top > box('.tile:nth-child(1)').top"], ['The row fills the width exactly', "Math.abs(box('.tile:nth-child(3)').right - box('.grid').right) < 2"]],
  hints: ['Each value in the list is one column.', '`repeat(3, 1fr)` means three equal columns.'],
  learn: { h: 'CSS Grid and fr', x: '`grid-template-columns` lists the columns. `fr` is a **fraction** of the free space, so `1fr 1fr 1fr` gives three equal columns that stretch with the screen. Fixed pixel columns can overflow a phone.\n\nUse grid for two-dimensional layouts (rows and columns), and flexbox for one row or one column.', terms: ['css-grid'] } });

CH({ id: 'c-pos', t: 'css', tier: 2, sb: 'html', icon: '📌', title: 'Pin a badge to the corner',
  story: 'The red "3" badge should hug the card\'s top-right corner. Right now it flies to the corner of the whole page. Fix it without pulling the card out of the page flow.',
  code: L('<style>', '  .card { {{p}} width: 200px; padding: 16px; margin: 20px; background: #fef3c7; border-radius: 12px; }', '  .badge { position: absolute; top: -8px; right: -8px; background: crimson; color: white; border-radius: 99px; padding: 2px 8px; }', '</style>', '<div class="card">Messages <span class="badge">3</span></div>', '<p class="after">Text after the card.</p>'),
  slots: { p: { o: ['', 'position: absolute;', 'position: fixed;', 'position: relative;'], l: ['(nothing)', 'position: absolute;', 'position: fixed;', 'position: relative;'] } }, sol: { p: 'position: relative;' },
  goals: [['The badge sits on the card\'s corner', "var b=box('.badge'),c=box('.card');return Math.abs(b.right-(c.right+8))<2 && Math.abs(b.top-(c.top-8))<2"], ['The text after the card stays below it', "box('.after').top >= box('.card').bottom"]],
  hints: ['An absolute element is positioned relative to its nearest **positioned** ancestor.', 'Give the card `position: relative`, which changes nothing about where the card itself goes.'],
  learn: { h: 'Positioning context', x: '`position: absolute` takes an element out of the flow and places it relative to the nearest ancestor that has a position set. With none, that is the whole page.\n\n`position: relative` on the card creates that context without moving the card. `absolute` or `fixed` on the card would also give a context, but they pull the card out of the flow, so the text below slides up under it.', terms: ['css'] } });

CH({ id: 'c-hover', t: 'css', tier: 2, sb: 'html', icon: '✨', title: 'Hover and transition',
  story: 'Make the button turn orange when the mouse is over it, and make the change fade smoothly over at least 0.2 seconds. On desktop you can hover the preview to test.',
  code: L('<style>', '  .btn { background: #6366f1; color: white; padding: 10px 16px; border: 0; border-radius: 10px;', '         transition: background {{t}}s; }', '  .btn:{{ps}} { background: #f59e0b; }', '</style>', '<button class="btn">Book a class</button>'),
  slots: { ps: ['visited', 'active', 'focus', 'hover'], t: { n: [0, 1, 0.1], s: 0 } }, sol: { ps: 'hover', t: 0.3 },
  goals: [['A rule for `.btn:hover` exists', "!!rule('.btn:hover')"], ['It fades for at least 0.2s', "parseFloat(css('.btn','transition-duration')) >= 0.2"]],
  hints: ['These are **pseudo-classes**: states an element can be in.', '`:hover`, and slide the time to 0.2 or more.'],
  learn: { h: 'Pseudo-classes and transitions', x: '`:hover` applies while the pointer is over the element. `:active` applies while it is pressed, `:focus` when it has keyboard focus, and `:visited` only to links already visited.\n\n`transition` animates changes between states. Phones have no hover. A tap may trigger it, and it may stick, so never hide important actions behind hover.', terms: ['pseudo-class'] } });

CH({ id: 'c-hsl', t: 'css', tier: 1, sb: 'html', icon: '🌈', title: 'Experiment: HSL colors', explore: 3,
  story: 'Experiment zone. HSL describes color the way people think about it: **hue** (position on the color wheel), **saturation** (how vivid) and **lightness**. Slide the values and run each version. The sky starts pitch black.',
  code: L('<style>', '  .sky { height: 120px; border-radius: 12px; background: hsl({{h}}, {{s}}%, {{l}}%); }', '</style>', '<div class="sky"></div>'),
  slots: { h: { n: [0, 360, 15], s: 210 }, s: { n: [0, 100, 10], s: 80 }, l: { n: [0, 100, 5], s: 0 } }, sol: { h: 200, s: 80, l: 60 },
  goals: [['Not pitch black', "css('.sky','background-color')!=='rgb(0, 0, 0)'"]],
  hints: ['Lightness 0% is always black, and 100% is always white, whatever the hue.'],
  learn: { h: 'Thinking in HSL', x: 'Hue goes around the wheel: 0 red, 120 green, 240 blue, 360 red again. Saturation 0% is gray. Lightness 50% is the pure color.\n\nDesigners like HSL because you can keep the hue and change only lightness to get a matching palette: a dark, normal and light version of the same blue.', terms: ['hex-color'] } });

CH({ id: 'c-vars', t: 'css', tier: 2, sb: 'html', icon: '🎨', title: 'Rebrand in one line',
  story: 'The studio is rebranding from purple to **tomato**. The button, the link and the heading underline all use the brand color. Change everything by editing one line.',
  code: L('<style>', '  :root { --brand: {{b}}; }', '  .btn { background: var(--brand); color: white; border: 0; padding: 8px 14px; border-radius: 8px; }', '  a { color: var(--brand); }', '  h2 { border-bottom: 3px solid var(--brand); }', '</style>', '<h2>Fall classes</h2>', '<p><a href="#">See the schedule</a></p>', '<button class="btn">Enroll</button>'),
  slots: { b: ['purple', '--tomato', 'var(tomato)', 'tomato'] }, sol: { b: 'tomato' },
  goals: [['The button is tomato', "same('.btn','background-color','tomato')"], ['The link is tomato', "same('a','color','tomato')"], ['The underline is tomato', "same('h2','border-bottom-color','tomato')"]],
  hints: ['`--brand` is a variable. `var(--brand)` reads it. What should its value be?', 'Just the color: `tomato`.'],
  learn: { h: 'CSS custom properties', x: '`--brand` is a **custom property**, a CSS variable. Define it once on `:root` (the whole page), then read it anywhere with `var(--brand)`. Change one line, and the whole site updates.\n\nThis is **DRY**: don\'t repeat yourself. One source of truth for each design decision. Dark mode is often just swapping a set of variables.', terms: ['dry', 'source-of-truth', 'css-variable'] } });

CH({ id: 'c-vis', t: 'css', tier: 2, sb: 'html', icon: '🙈', title: 'Three ways to hide',
  story: 'Hide the old "NEW" badge. But the text after it must not jump left, and screen readers should skip the badge too. Each choice hides it differently.',
  code: L('<style>', '  .badge { background: crimson; color: white; padding: 2px 8px; border-radius: 6px; }', '  .badge.old { {{rule}} }', '</style>', '<p><span class="badge old">NEW</span> <span class="after">Spring recital tickets</span></p>'),
  slots: { rule: ['/* nothing */', 'opacity: 0;', 'display: none;', 'visibility: hidden;'] }, sol: { rule: 'visibility: hidden;' },
  goals: [['The badge is invisible', "css('.old','visibility')==='hidden' || css('.old','opacity')==='0' || css('.old','display')==='none'"], ['The text does not jump left', "box('.after').left - box('p').left > 20"], ['Screen readers skip it too', "css('.old','visibility')==='hidden' || css('.old','display')==='none'"]],
  hints: ['One option removes the box completely. One only makes it see-through.', '`visibility: hidden` keeps the space but hides it from everyone.'],
  learn: { h: 'display, visibility, opacity', x: '`display: none` removes the element as if it never existed: no space, no screen reader. `visibility: hidden` keeps its space but hides it from eyes and screen readers. `opacity: 0` is fully see-through, but it is still there, still clickable, and still read aloud.\n\nWhen the page jumps as things appear and disappear, that is **layout shift**, and users hate it.', terms: ['accessibility'] } });

var SITE_STYLE4 = L('<style>', '  body { background: #0f172a; color: #e2e8f0; font-family: Georgia, serif; }', '</style>');
CH({ id: 'site-4', t: 'css', tier: 1, sb: 'html', icon: '🌙', title: 'Website: dark theme', proj: ['site', 4],
  story: 'Back to your website. Give it a dark theme with a non-default font. The text must stay **easy to read**: the contrast checker needs at least 4.5 to 1.',
  code: L('<style>', '  body {', '    background: {{bg}};', '    color: {{fg}};', '    font-family: {{ff}};', '  }', '</style>', SITE3),
  slots: { bg: ['white', '#fde68a', '#0f172a'], fg: ['#1e293b', 'navy', '#475569', '#e2e8f0'], ff: ['system-ui', 'Georgia, serif', '"Courier New", monospace', 'Verdana, sans-serif'] }, sol: { bg: '#0f172a', fg: '#e2e8f0', ff: 'Georgia, serif' },
  goals: [['A dark background', "var m=css('body','background-color').match(/\\d+/g).map(Number);return m[0]+m[1]+m[2] < 200"], ['Readable text (contrast ≥ 4.5:1)', "contrast('p') >= 4.5"], ['Not the default font', "css('body','font-family').indexOf('system-ui') < 0"]],
  hints: ['Dark text on a dark background has low contrast.', 'Dark navy background `#0f172a` with light `#e2e8f0` text, plus any other font.'],
  learn: { h: 'Contrast and inheritance', x: 'You only styled `body`, yet the headings and paragraphs changed too. `color` and `font-family` are **inherited** by everything inside.\n\nThe contrast ratio compares how bright the text and background are. 4.5:1 is the accessibility guideline (WCAG AA) for normal text. Gray text on a dark background is a classic way to fail it.', terms: ['accessibility', 'contrast'] } });
var SITE5BODY = SITE3.replace('<p>Everything I build in Dungeons &amp; Debuggers.</p>', L('<div class="cards">', '  <div class="card">🧱 My first page</div>', '  <div class="card">✅ To-do app</div>', '  <div class="card">🐉 Text adventure</div>', '</div>'));
var CARD_CSS = '  .card { flex: 1; padding: 12px; border-radius: 12px; background: #1e293b; }';
CH({ id: 'site-5', t: 'css', tier: 2, sb: 'html', icon: '🃏', title: 'Website: project cards', proj: ['site', 5],
  story: 'Your projects are now cards, but they stack in a boring column. Put them **side by side** with a gap between them.',
  code: L('<style>', '  body { background: #0f172a; color: #e2e8f0; font-family: Georgia, serif; }', '  .cards { display: {{d}}; gap: {{g}}px; }', CARD_CSS, '</style>', SITE5BODY),
  slots: { d: ['block', 'inline', 'flex'], g: { n: [0, 32, 4], s: 0 } }, sol: { d: 'flex', g: 12 },
  goals: [['The cards sit side by side', "box('.card:nth-child(1)').top===box('.card:nth-child(3)').top"], ['A gap of at least 8px between them', "box('.card:nth-child(2)').left - box('.card:nth-child(1)').right >= 8"]],
  hints: ['A row of things is a job for flexbox.', '`display: flex` and a gap of 8 or more.'],
  learn: { h: 'gap and flex: 1', x: '`gap` puts space between flex or grid items without adding margins to the edges. `flex: 1` on each card tells them to share the row equally.\n\nOn a narrow phone, three cards in a row get squished. That is what responsive design fixes in the final step.', terms: ['flexbox'] } });
CH({ id: 'site-6', t: 'css', tier: 2, sb: 'html', icon: '📱', title: 'Website: responsive', proj: ['site', 6],
  story: 'On phones the three cards are squished. Use a **media query** so that on screens narrower than a tablet the cards stack in a column, while laptops keep the row.\n\nPhones are about 360 to 430px wide. Tablets start around 768px.',
  code: L('<style>', '  body { background: #0f172a; color: #e2e8f0; font-family: Georgia, serif; }', '  .cards { display: flex; gap: 12px; }', CARD_CSS, '  @media (max-width: {{w}}px) {', '    .cards { flex-direction: {{dir}}; }', '  }', '</style>', SITE5BODY),
  slots: { w: [300, 1400, 600], dir: ['row', 'row-reverse', 'column'] }, sol: { w: 600, dir: 'column' },
  goals: [['Phones (390px) stack the cards', "var r=media('max-width');if(!r)return false;var w=+/max-width:\\s*(\\d+)px/.exec(r.media.mediaText)[1];return w>=430 && [].some.call(r.cssRules,function(x){return x.selectorText==='.cards'&&x.style.flexDirection==='column'})"], ['Tablets and laptops keep the row', "var r=media('max-width');if(!r)return false;var w=+/max-width:\\s*(\\d+)px/.exec(r.media.mediaText)[1];return w<768"]],
  hints: ['`max-width: 600px` means "only when the screen is 600px or narrower".', '600px and `column`.'],
  learn: { h: 'Responsive design', x: 'A **media query** applies CSS only when a condition is true, such as the screen width. "Mobile first" means you write the phone layout first, then add `min-width` queries for bigger screens.\n\nReal pages also need `<meta name="viewport" content="width=device-width">` in the `<head>`. Otherwise phones pretend to be a 980px desktop and shrink everything. The sandbox includes it for you.\n\n🏠 Your website is complete. Open it in the 🏗️ Workshop, and deploy it in the 🚀 Ship It project.', terms: ['media-query'] } });
