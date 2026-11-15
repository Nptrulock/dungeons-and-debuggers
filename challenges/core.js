// Hands-on challenge registry. See README for the format.
var CHD = (typeof globalThis !== 'undefined' ? globalThis : window).CHD = { tracks: [], list: [], byId: {}, projects: [] };
CHD.tracks = [
  { id: 'html', name: 'HTML', icon: '🧱', color: '#fb923c', need: 0, desc: 'The skeleton of every web page.' },
  { id: 'py', name: 'Python', icon: '🐍', color: '#facc15', need: 0, desc: 'Real Python, running right in your browser.' },
  { id: 'css', name: 'CSS', icon: '🎨', color: '#60a5fa', need: 3, desc: 'Color, layout and style.' },
  { id: 'js', name: 'JavaScript', icon: '⚡', color: '#fde047', need: 4, desc: 'Make pages do things.' },
  { id: 'git', name: 'Terminal & Git', icon: '🌿', color: '#4ade80', need: 6, desc: 'The command line, version control and GitHub.' },
  { id: 'sql', name: 'SQL & Data', icon: '🗄️', color: '#f472b6', need: 9, desc: 'Real SQLite databases.' },
  { id: 'api', name: 'Web & APIs', icon: '🌐', color: '#34d399', need: 12, desc: 'HTTP, JSON and talking to servers.' },
  { id: 'aidev', name: 'Directing AI', icon: '🤖', color: '#22d3ee', need: 8, desc: 'Prompt, review and steer an AI coding assistant.' },
  { id: 'dbg', name: 'Debug & Test', icon: '🐞', color: '#f87171', need: 14, desc: 'Errors, stack traces, breakpoints and tests.' },
  { id: 'cpp', name: 'C++', icon: '⚙️', color: '#a78bfa', need: 16, desc: 'Compiled, typed, close to the metal.' },
  { id: 'atlas', name: 'Language Atlas', icon: '🗺️', color: '#c084fc', need: 18, desc: 'One task, many languages: discover the differences.' },
  { id: 'ops', name: 'Ship & DevOps', icon: '🚀', color: '#fb7185', need: 20, desc: 'CI, deploys and production.' },
  { id: 'sec', name: 'Architecture & Security', icon: '🏛️', color: '#e879f9', need: 24, desc: 'Design decisions and keeping users safe.' }
];
CHD.projects = [
  { id: 'site', name: 'Personal Website', icon: '🏠', sb: 'html', desc: 'Your own home page, from a blank file to a styled, responsive site.' },
  { id: 'todo', name: 'To-Do App', icon: '✅', sb: 'js', desc: 'A real to-do list that remembers your tasks.' },
  { id: 'weather', name: 'Weather App', icon: '⛅', sb: 'js', desc: 'Fetches forecasts from an API and shows them nicely.' },
  { id: 'quest', name: 'Python Text Adventure', icon: '🐉', sb: 'py', desc: 'A dungeon crawler that runs in the console.' },
  { id: 'books', name: 'Bookstore Database', icon: '📚', sb: 'sql', desc: 'Tables, relationships and reports for a small shop.' },
  { id: 'game', name: 'Canvas Mini-Game', icon: '🎮', sb: 'js', desc: 'A tiny game with a player, coins and a score.' },
  { id: 'ship', name: 'Ship It', icon: '🚀', sb: 'git', desc: 'Version your site, open a PR and deploy it with CI.' }
];
function CH(o) {
  if (CHD.byId[o.id]) throw new Error('duplicate challenge ' + o.id);
  o.goals = o.goals || []; o.slots = o.slots || {}; o.hints = o.hints || [];
  // normalise slots: array => options
  Object.keys(o.slots).forEach(function (k) { var s = o.slots[k]; if (Array.isArray(s)) o.slots[k] = { o: s, s: 0 }; else if (s.n) { if (s.s === undefined) s.s = s.n[0]; } else if (s.s === undefined) s.s = 0; });
  CHD.list.push(o); CHD.byId[o.id] = o; return o;
}
function startVals(ch) { var v = {}; Object.keys(ch.slots).forEach(function (k) { var s = ch.slots[k]; v[k] = s.n ? s.s : s.o[s.s]; }); return v; }
function solVals(ch) { var v = startVals(ch); Object.keys(ch.sol || {}).forEach(function (k) { v[k] = ch.sol[k]; }); return v; }
CHD.startVals = startVals; CHD.solVals = solVals;
function L() { return [].slice.call(arguments).join('\n'); }
var AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%237c5cff'/%3E%3Crect x='22' y='26' width='56' height='44' rx='12' fill='%23e0e7ff'/%3E%3Ccircle cx='38' cy='46' r='7' fill='%231e1b4b'/%3E%3Ccircle cx='62' cy='46' r='7' fill='%231e1b4b'/%3E%3Cpath d='M36 60 Q50 68 64 60' stroke='%231e1b4b' stroke-width='4' fill='none' stroke-linecap='round'/%3E%3Crect x='47' y='12' width='6' height='14' fill='%23e0e7ff'/%3E%3Ccircle cx='50' cy='11' r='5' fill='%23fbbf24'/%3E%3C/svg%3E";
