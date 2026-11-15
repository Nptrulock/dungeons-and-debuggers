// Drills: HTML, CSS
(function (root) {
var DR = root.DRILLS, D = DR.D, J = DR.J, Q = DR.Q;
var WORDS = ['Welcome', 'Our Menu', 'Pricing', 'Contact us', 'Gallery', 'Latest news', 'FAQ', 'Downloads', 'Meet the team', 'Opening hours', 'Shipping', 'Reviews'];
var COLORS = ['red', 'blue', 'green', 'purple', 'orange', 'teal', 'navy', 'crimson', 'gold', 'hotpink', 'tomato', 'darkgreen'];
var NAMES = ['note', 'intro', 'warning', 'card', 'price', 'hero', 'badge', 'promo', 'alert', 'tip'];

D({ id: 'html.heading', t: 'html', sb: 'html', from: ['h-first'], name: 'Heading tags', icon: '🔤', gen: function (R) {
  var w = R.pick(WORDS), n = R.int(1, 3), t = 'h' + n;
  return { tag: 'Make “' + w + '” an ' + t + ' heading', code: J('<{{t}}>' + w + '</{{t}}>', '<p>Some text below.</p>'), slots: { t: R.opts(t, ['p', 'span', 'div', 'b', 'h' + (n + 1), 'h' + (n + 2)]) }, sol: { t: t },
    goals: [['It is an ' + t, "txt(" + Q(t) + ")===" + Q(w)], ['Exactly one heading', "count('h1,h2,h3,h4,h5,h6')===1"]],
    explain: 'Headings are `<h1>` (most important) to `<h6>`. The opening and closing tag both use the same name: `<' + t + '>…</' + t + '>`.' };
} });
D({ id: 'html.strong', t: 'html', sb: 'html', from: ['h-strong'], name: 'strong and em', icon: '💪', gen: function (R) {
  var w = R.pick(['really', 'never', 'always', 'today', 'free', 'only', 'now']), em = R.f() < 0.4, tg = em ? 'em' : 'strong';
  var full = 'This is ' + w + ' important.';
  return { tag: em ? 'Emphasize only “' + w + '” (em)' : 'Make only “' + w + '” strong', code: '<p>This is {{a}}' + w + '{{b}} important.</p>',
    slots: { a: { o: ['', '<strong>', '<em>', '<u>'], l: ['▢', '<strong>', '<em>', '<u>'], s: 0 }, b: { o: ['', '</strong>', '</em>', '</u>'], l: ['▢', '</strong>', '</em>', '</u>'], s: 0 } }, sol: { a: '<' + tg + '>', b: '</' + tg + '>' },
    goals: [['“' + w + '” is in <' + tg + '>', "txt('p " + tg + "')===" + Q(w)], ['Nothing else changed', "count('" + tg + "')===1 && txt('p')===" + Q(full)]],
    explain: 'Wrap just the word: `<' + tg + '>' + w + '</' + tg + '>`. The closing tag repeats the name with a slash. `strong` means important (bold), `em` means emphasis (italic).' };
} });
D({ id: 'html.link', t: 'html', sb: 'html', from: ['h-link'], name: 'Links', icon: '🔗', gen: function (R) {
  var site = R.pick([['MDN', 'https://developer.mozilla.org/'], ['GitHub', 'https://github.com/'], ['Wikipedia', 'https://en.wikipedia.org/'], ['Python', 'https://www.python.org/'], ['W3C', 'https://www.w3.org/']]), nt = R.f() < 0.6;
  return { tag: 'Link “' + site[0] + '” to ' + site[1] + (nt ? ' (new tab)' : ' (same tab)'), code: '<a {{a}}="' + site[1] + '"{{t}}>' + site[0] + '</a>',
    slots: { a: R.opts('href', ['src', 'link', 'url', 'ref']), t: { o: nt ? ['', ' target="_blank"', ' target="new"'] : [' target="_blank"', '', ' target="new"'], l: nt ? ['(none)', 'target="_blank"', 'target="new"'] : ['target="_blank"', '(none)', 'target="new"'], s: 0 } },
    sol: { a: 'href', t: nt ? ' target="_blank"' : '' },
    goals: [['It links to ' + site[1], "q('a').getAttribute('href')===" + Q(site[1])], [nt ? 'Opens in a new tab' : 'Stays in this tab', nt ? "q('a').target==='_blank'" : "!q('a').target"]],
    explain: 'The destination goes in `href`. `target="_blank"` opens a new tab; leaving target out keeps the same tab.' };
} });
D({ id: 'html.img', t: 'html', sb: 'html', from: ['h-img'], name: 'Images and alt text', icon: '🖼️', gen: function (R) {
  var im = R.pick([['cat.png', 'A sleeping cat'], ['logo.svg', 'Company logo'], ['team.jpg', 'Our team at the office'], ['map.webp', 'Map to our shop'], ['chart.png', 'Sales up 20%']]);
  return { tag: 'Show ' + im[0] + ' with alt text “' + im[1] + '”', code: '<img {{a}}="' + im[0] + '" alt={{b}}>',
    slots: { a: R.opts('src', ['href', 'link', 'file', 'img']), b: R.opts(Q(im[1]), ['""', Q(im[0]), '"image"']) }, sol: { a: 'src', b: Q(im[1]) },
    goals: [['The image file is ' + im[0], "q('img').getAttribute('src')===" + Q(im[0])], ['The alt text describes it', "q('img').alt===" + Q(im[1])]],
    explain: '`src` is the file to show. `alt` is the text screen readers read and that appears if the image fails. Describe what the picture shows.' };
} });
D({ id: 'html.list', t: 'html', sb: 'html', from: ['h-list'], name: 'Lists', icon: '📋', gen: function (R) {
  var ord = R.f() < 0.5, items = R.sample(['Preheat the oven', 'Mix the flour', 'Add eggs', 'Bake 20 minutes', 'Let it cool', 'Serve', 'Wash up'], R.int(3, 5)), t = ord ? 'ol' : 'ul';
  return { tag: (ord ? 'Number these ' : 'Bullet these ') + items.length + ' items', code: J('<{{t}}>', items.map(function (i) { return '  <li>' + i + '</li>'; }).join('\n'), '</{{t}}>'),
    slots: { t: R.opts(t, ['div', 'dl', ord ? 'ul' : 'ol', 'p']) }, sol: { t: t },
    goals: [['A ' + (ord ? 'numbered' : 'bulleted') + ' list of ' + items.length, "count('" + t + " > li')===" + items.length]],
    explain: '`<ol>` is an ordered (numbered) list and `<ul>` an unordered (bulleted) list. Both contain `<li>` items.' };
} });
D({ id: 'html.input', t: 'html', sb: 'html', from: ['h-form'], name: 'Input types', icon: '📝', gen: function (R) {
  var v = R.pick([['email', 'Email'], ['number', 'Quantity'], ['password', 'Password'], ['date', 'Birthday'], ['checkbox', 'I agree'], ['color', 'Favorite color']]);
  return { tag: 'Make the “' + v[1] + '” field the right input type', code: '<label>' + v[1] + ' <input type="{{t}}" name="f"></label>',
    slots: { t: R.opts(v[0], ['text', 'email', 'number', 'password', 'date', 'checkbox', 'color', 'string']) }, sol: { t: v[0] },
    goals: [['The input is type ' + v[0], "q('input').type===" + Q(v[0])]],
    explain: 'The `type` attribute picks the control: `' + v[0] + '` gives the right keyboard, validation or picker on phones. Unknown types fall back to text.' };
} });
D({ id: 'html.classid', t: 'html', sb: 'html', from: ['h-classid'], name: 'class and id', icon: '🏷️', gen: function (R) {
  var nm = R.pick(NAMES), isId = R.f() < 0.5, a = isId ? 'id' : 'class';
  return { tag: 'Give the paragraph the ' + a + ' “' + nm + '”', code: '<p {{a}}="' + nm + '">Hello</p>', slots: { a: R.opts(a, ['name', 'style', 'title', isId ? 'class' : 'id']) }, sol: { a: a },
    goals: [['It has ' + a + ' ' + nm, isId ? "!!q('#" + nm + "') && !q('p." + nm + "')" : "!!q('p." + nm + "') && !q('#" + nm + "')"]],
    explain: '`class` can be shared by many elements (selected with `.' + nm + '`); `id` must be unique (selected with `#' + nm + '`).' };
} });
D({ id: 'html.semantic', t: 'html', sb: 'html', from: ['h-semantic'], name: 'Semantic landmarks', icon: '🏛️', gen: function (R) {
  var v = R.pick([['nav', 'the site navigation', '<a href="/">Home</a> <a href="/blog">Blog</a>'], ['footer', 'the page footer', '© 2026 My Site'], ['header', 'the page header', '<h1>My Site</h1>'], ['main', 'the main content', '<p>The article…</p>'], ['aside', 'a sidebar', '<p>Related links</p>']]);
  return { tag: 'Use the landmark tag for ' + v[1], code: '<{{t}}>' + v[2] + '</{{t}}>', slots: { t: R.opts(v[0], ['div', 'section', 'span', 'nav', 'footer', 'header', 'main', 'aside']) }, sol: { t: v[0] },
    goals: [['It is a <' + v[0] + '>', "count(" + Q(v[0]) + ")===1"]],
    explain: 'Landmarks (`header`, `nav`, `main`, `aside`, `footer`) look like a `div` but tell screen readers and search engines what each region is.' };
} });
D({ id: 'html.entity', t: 'html', sb: 'html', from: ['h-entity'], name: 'Escaping < and >', icon: '🔣', gen: function (R) {
  var t = R.pick(['b', 'i', 'div', 'p', 'h1', 'li', 'em']), want = 'The <' + t + '> tag is common.';
  return { tag: 'Show the literal text “<' + t + '>” on the page', code: '<p>The {{a}} tag is common.</p>',
    slots: { a: R.opts('&lt;' + t + '&gt;', ['<' + t + '>', '\\<' + t + '\\>', '"<' + t + '>"', '<' + t + '/>']) }, sol: { a: '&lt;' + t + '&gt;' },
    goals: [['The page shows <' + t + '> as text', "txt('p')===" + Q(want) + " && count('p " + t + "')===0"]],
    explain: 'A raw `<' + t + '>` is parsed as a tag. To show the characters, use entities: `&lt;` for < and `&gt;` for >.' };
} });

// ---------- CSS ----------
function css(rule, body) { return J('<style>', '  ' + rule, '</style>', body); }
D({ id: 'css.color', t: 'css', sb: 'html', from: ['c-color', 'c-hex'], name: 'color vs background', icon: '🎨', gen: function (R) {
  var c = R.pick(COLORS), bg = R.f() < 0.4, p = bg ? 'background-color' : 'color', w = R.pick(WORDS);
  return { tag: bg ? 'Give the heading a ' + c + ' background' : 'Make the heading ' + c, code: css('h1 { {{p}}: {{v}}; }', '<h1>' + w + '</h1>'),
    slots: { p: R.opts(p, ['font-color', 'text-color', bg ? 'color' : 'background-color', 'fill']), v: R.opts(c, R.sample(COLORS.filter(function (x) { return x !== c; }), 3)) }, sol: { p: p, v: c },
    goals: [['The heading ' + (bg ? 'background' : 'text') + ' is ' + c, "same('h1'," + Q(p) + "," + Q(c) + ")"]],
    explain: '`color` sets text color; `background-color` fills the box behind it. There is no `font-color` in CSS: an unknown property is silently ignored.' };
} });
D({ id: 'css.size', t: 'css', sb: 'html', from: ['c-size', 'c-units'], name: 'font-size units', icon: '🔠', gen: function (R) {
  var n = R.pick([12, 14, 18, 20, 24, 28, 32, 40]);
  return { tag: 'Make the paragraph text ' + n + 'px', code: css('p { font-size: {{v}}; }', '<p>Hello there</p>'), slots: { v: R.opts(n + 'px', [String(n), n + ' px', (n * 2) + 'px', n + 'pt', n + '%']) }, sol: { v: n + 'px' },
    goals: [['Text is ' + n + 'px', "css('p','font-size')===" + Q(n + 'px')]],
    explain: 'CSS lengths need a unit glued to the number: `' + n + 'px`. A bare number or a space before the unit makes the whole declaration invalid, so it is ignored.' };
} });
D({ id: 'css.box', t: 'css', sb: 'html', from: ['c-box'], name: 'padding, margin, radius', icon: '📦', gen: function (R) {
  var v = R.pick([['padding', 'of space inside the box', 'padding-top'], ['margin', 'of space outside the box', 'margin-top'], ['border-radius', 'rounded corners', 'border-top-left-radius']]), n = R.pick([8, 12, 16, 20, 24, 30]);
  return { tag: 'Give the box ' + n + 'px ' + v[1], code: css('.box { {{p}}: ' + n + 'px; border: 2px solid; }', '<div class="box">Box</div>'), slots: { p: R.opts(v[0], ['padding', 'margin', 'border-radius', 'spacing', 'gap'].filter(function (x) { return x !== v[0]; })) }, sol: { p: v[0] },
    goals: [[v[0] + ' is ' + n + 'px', "css('.box'," + Q(v[2]) + ")===" + Q(n + 'px')]],
    explain: 'Box model: content, then **padding** (inside the border), the **border**, then **margin** (outside). `border-radius` rounds the corners.' };
} });
D({ id: 'css.selector', t: 'css', sb: 'html', from: ['c-class', 'c-spec'], name: 'Selectors', icon: '🎯', gen: function (R) {
  var k = R.pick(NAMES), j = R.pick(['main', 'top', 'special', 'first', 'x1']), c = R.pick(COLORS), mode = R.pick(['class', 'id', 'all']);
  var corr = mode === 'class' ? '.' + k : mode === 'id' ? '#' + j : 'p';
  var g = mode === 'class' ? "same('." + k + "','color','" + c + "') && !same('#" + j + "','color','" + c + "')" : mode === 'id' ? "same('#" + j + "','color','" + c + "') && !same('." + k + "','color','" + c + "')" : "qa('p').every(function(e){var t=document.createElement('i');t.style.color='" + c + "';document.body.appendChild(t);var ok=getComputedStyle(t).color===getComputedStyle(e).color;t.remove();return ok;})";
  return { tag: mode === 'all' ? 'Make every paragraph ' + c : 'Make only the paragraph with ' + (mode === 'class' ? 'class “' + k + '”' : 'id “' + j + '”') + ' ' + c,
    code: css('{{s}} { color: ' + c + '; }', J('<p class="' + k + '">one</p>', '<p>two</p>', '<p id="' + j + '">three</p>')), slots: { s: R.opts(corr, ['.' + k, k, '#' + k, 'p', '#' + j, '.' + j, j]) }, sol: { s: corr },
    goals: [['The right paragraphs are ' + c, g]],
    explain: '`.name` selects a class, `#name` an id, and a bare tag name like `p` selects every element of that type.' };
} });
D({ id: 'css.flex', t: 'css', sb: 'html', from: ['c-flex'], name: 'Flexbox', icon: '↔️', gen: function (R) {
  var v = R.pick([['center', 'centered'], ['space-between', 'spread to both edges'], ['flex-end', 'pushed to the right']]);
  return { tag: 'Put the items in a row, ' + v[1], code: css('.row { display: {{d}}; justify-content: {{j}}; }', '<div class="row"><span class="i">A</span><span class="i">B</span><span class="i">C</span></div>'),
    slots: { d: R.opts('flex', ['block', 'inline', 'row', 'table']), j: R.opts(v[0], ['center', 'space-between', 'flex-end', 'left', 'middle']) }, sol: { d: 'flex', j: v[0] },
    goals: [['A flex row', "css('.row','display')==='flex'"], ['Items are ' + v[1], "css('.row','justify-content')===" + Q(v[0]) + " && box('.i:nth-child(3)').top===box('.i').top"]],
    explain: '`display: flex` lays children out in a row. `justify-content` distributes them along that row: `center`, `space-between`, `flex-end`…' };
} });
D({ id: 'css.grid', t: 'css', sb: 'html', from: ['c-grid'], name: 'Grid columns', icon: '▦', gen: function (R) {
  var n = R.int(2, 4), cells = ''; for (var i = 1; i <= n + 2; i++) cells += '<div class="c">' + i + '</div>';
  return { tag: 'Make a ' + n + '-column grid', code: css('.grid { display: grid; grid-template-columns: {{v}}; }', '<div class="grid">' + cells + '</div>'),
    slots: { v: R.opts('repeat(' + n + ', 1fr)', [String(n), '1fr', 'repeat(' + (n + 1) + ', 1fr)', 'repeat(' + (n - 1 || 5) + ', 1fr)', n + ' columns']) }, sol: { v: 'repeat(' + n + ', 1fr)' },
    goals: [[n + ' cells per row', "box('.c:nth-child(" + n + ")').top===box('.c').top && box('.c:nth-child(" + (n + 1) + ")').top>box('.c').top"]],
    explain: '`grid-template-columns: repeat(' + n + ', 1fr)` makes ' + n + ' equal columns (`fr` = a fraction of the free space). A bare number is invalid.' };
} });
D({ id: 'css.hover', t: 'css', sb: 'html', from: ['c-hover'], name: 'Pseudo-classes', icon: '🖱️', gen: function (R) {
  var v = R.pick([[':hover', 'when the mouse is over it'], [':focus', 'when it has keyboard focus'], [':active', 'while it is being pressed']]), c = R.pick(COLORS);
  return { tag: 'Turn the button ' + c + ' only ' + v[1], code: css('button{{s}} { background: ' + c + '; }', '<button>Buy</button>'), slots: { s: R.opts(v[0], ['', '.hover', ':hover', ':focus', ':active', ':clicked']) }, sol: { s: v[0] },
    goals: [['Only in the ' + v[0] + ' state', "!!rule('button" + v[0] + "') && !same('button','background-color','" + c + "')"]],
    explain: 'Pseudo-classes like `:hover`, `:focus` and `:active` apply styles only while the element is in that state. Without one, the rule applies all the time.' };
} });
D({ id: 'css.vars', t: 'css', sb: 'html', from: ['c-vars'], name: 'CSS variables', icon: '🧪', gen: function (R) {
  var nm = R.pick(['brand', 'accent', 'primary', 'ink', 'main']), c = R.pick(COLORS);
  return { tag: 'Color the heading with the --' + nm + ' variable', code: css(':root { --' + nm + ': ' + c + '; }\n  h1 { color: {{v}}; }', '<h1>Hi</h1>'), slots: { v: R.opts('var(--' + nm + ')', ['--' + nm, '$' + nm, nm, 'var(' + nm + ')', '@' + nm]) }, sol: { v: 'var(--' + nm + ')' },
    goals: [['The heading uses --' + nm + ' (' + c + ')', "same('h1','color','" + c + "')"]],
    explain: 'Custom properties start with `--` and are read with `var(--' + nm + ')`. Change the variable once and everything using it updates.' };
} });
D({ id: 'css.media', t: 'css', sb: 'html', from: ['site-6'], name: 'Media queries', icon: '📱', gen: function (R) {
  var w = R.pick([480, 600, 720, 768, 900]), narrow = R.f() < 0.6, f = narrow ? 'max-width' : 'min-width';
  return { tag: (narrow ? 'Hide .side on screens up to ' : 'Hide .side on screens ' ) + w + 'px' + (narrow ? ' wide' : ' and wider'), code: css('@media ({{f}}: ' + w + 'px) { .side { display: none; } }', '<div class="side">Sidebar</div>'), slots: { f: R.opts(f, ['max-width', 'min-width', 'width', 'screen-width']) }, sol: { f: f },
    goals: [['A ' + f + ' query at ' + w + 'px', "!!media(" + Q(f + ': ' + w + 'px') + ")"]],
    explain: '`max-width: ' + w + 'px` matches screens **up to** ' + w + 'px (phones); `min-width` matches screens **at least** that wide. `width:` alone matches one exact width.' };
} });
})(typeof window !== 'undefined' ? window : globalThis);
