// Dungeons & Debuggers — content registry. Add units with U(track, tier, id, name, icon, terms, questions).
// Question formats (first option is always the correct one in source; the game shuffles):
//  ['mc'|'out'|'prompt'|'diff'|'git'|'err', question, [correct, wrong...], explanation, code?]
//  ['tf', statement, true|false, explanation, code?]
//  ['order', instruction, [step1, step2, ...in correct order], explanation, code?]
//  ['fill', instruction, codeWith___Blanks, [answersInOrder], [distractors], explanation]
//  ['match', instruction, [[term, meaning], ...], explanation]
//  ['bug', instruction, [line0, line1, ...], buggyLineIndex, explanation]
var DD = (typeof globalThis !== 'undefined' ? globalThis : window).DD = { tracks: [], units: [], glossary: {}, tiers: [] };
DD.tiers = [
  { n: 1, name: 'Very Basic', icon: '🥚', boss: 'The Blank Screen', bossIcon: '⬜' },
  { n: 2, name: 'Beginner', icon: '🐣', boss: 'The First Code Review', bossIcon: '🧐' },
  { n: 3, name: 'Intermediate', icon: '🦊', boss: 'The Friday Deploy', bossIcon: '🔥' },
  { n: 4, name: 'Advanced', icon: '🐉', boss: 'The 3 AM Outage', bossIcon: '🚨' },
  { n: 5, name: 'Expert', icon: '🧙', boss: 'The Rogue Agent', bossIcon: '🤖' }
];
DD.tracks = [
  { id: 'think', name: 'Thinking Like a Developer', short: 'Thinking', icon: '🧠', color: '#a78bfa', cls: 'Strategist' },
  { id: 'code', name: 'Code Reading Basics', short: 'Code', icon: '📜', color: '#60a5fa', cls: 'Scribe' },
  { id: 'web', name: 'The Web', short: 'Web', icon: '🌐', color: '#34d399', cls: 'Weaver' },
  { id: 'tools', name: 'Tools & Workflow', short: 'Tools', icon: '🛠️', color: '#fbbf24', cls: 'Artificer' },
  { id: 'data', name: 'Data & Databases', short: 'Data', icon: '🗄️', color: '#f472b6', cls: 'Archivist' },
  { id: 'debug', name: 'Debugging & Testing', short: 'Debug', icon: '🐞', color: '#f87171', cls: 'Hunter' },
  { id: 'ai', name: 'Working with AI', short: 'AI', icon: '🤖', color: '#22d3ee', cls: 'Summoner' },
  { id: 'ship', name: 'Shipping', short: 'Ship', icon: '🚀', color: '#fb923c', cls: 'Herald' },
  { id: 'arch', name: 'Architecture & Design', short: 'Architecture', icon: '🏛️', color: '#c084fc', cls: 'Architect' },
  { id: 'pro', name: 'Professional Practice', short: 'Pro', icon: '🤝', color: '#4ade80', cls: 'Diplomat' }
];
function U(track, tier, id, name, icon, terms, qs) { DD.units.push({ track: track, tier: tier, id: id, name: name, icon: icon, terms: terms || [], qs: qs }); }
function G(obj) { for (var k in obj) DD.glossary[k] = obj[k]; }
