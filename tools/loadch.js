// Load data + challenge files into one VM context (node). Usage: require('./tools/loadch.js')() -> context
const fs = require('fs'), vm = require('vm'), path = require('path');
module.exports = function () {
  const root = path.join(__dirname, '..');
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const files = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]).filter(f => /^(data|challenges|drills)\//.test(f));
  const ctx = { console }; ctx.window = ctx; ctx.globalThis = ctx; vm.createContext(ctx);
  files.forEach(f => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f }));
  return ctx;
};
if (require.main === module) { const c = module.exports(); const by = {}; c.CHD.list.forEach(x => { const k = (x.boss ? 'boss' : x.t) + '/' + x.sb; by[k] = (by[k] || 0) + 1; }); console.log(c.CHD.list.length, by); }
