// Dungeons & Debuggers — simulated shell + git + GitHub (pure JS, runs in browser and node).
(function (root) {
'use strict';
function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ('0000000' + (h >>> 0).toString(16)).slice(-7); }
function tokenize(line) {
  var out = [], cur = '', q = null, had = false;
  for (var i = 0; i < line.length; i++) {
    var c = line[i];
    if (q) { if (c === q) q = null; else cur += c; continue; }
    if (c === '"' || c === "'") { q = c; had = true; continue; }
    if (c === ' ' || c === '\t') { if (cur || had) out.push(cur); cur = ''; had = false; continue; }
    if (c === '>' ) { if (cur || had) out.push(cur); cur = ''; had = false; if (line[i + 1] === '>') { out.push('>>'); i++; } else out.push('>'); continue; }
    cur += c;
  }
  if (q) throw new Error('unterminated quote');
  if (cur || had) out.push(cur);
  return out;
}
function norm(p) { var parts = [], segs = p.split('/'); segs.forEach(function (s) { if (!s || s === '.') return; if (s === '..') parts.pop(); else parts.push(s); }); return '/' + parts.join('/'); }
function rel(root, p) { return p === root ? '' : p.slice(root.length + 1); }

function Sim(opts) {
  opts = opts || {};
  this.home = '/home/noah'; this.cwd = this.home;
  this.fs = { '/': { d: 1 }, '/home': { d: 1 }, '/home/noah': { d: 1 } };
  this.repos = {}; // root -> repo
  this.gh = { user: 'noah', repos: {} }; // simulated GitHub
  this.n = 0; this.events = []; this.history = [];
}
var P = Sim.prototype;
P.abs = function (p) { if (!p) return this.cwd; if (p === '~') return this.home; if (p.indexOf('~/') === 0) p = this.home + p.slice(1); return norm(p[0] === '/' ? p : this.cwd + '/' + p); };
P.isDir = function (p) { return !!(this.fs[p] && this.fs[p].d); };
P.isFile = function (p) { return !!(this.fs[p] && !this.fs[p].d); };
P.parent = function (p) { return norm(p + '/..'); };
P.write = function (p, content) { if (!this.isDir(this.parent(p))) throw new Error('No such file or directory: ' + p); if (this.isDir(p)) throw new Error(p + ': Is a directory'); this.fs[p] = { c: content }; };
P.read = function (p) { if (!this.isFile(p)) throw new Error('No such file: ' + p.split('/').pop()); return this.fs[p].c; };
P.children = function (p) { var pre = p === '/' ? '/' : p + '/', out = []; for (var k in this.fs) if (k !== p && k.indexOf(pre) === 0 && k.slice(pre.length).indexOf('/') < 0) out.push(k.slice(pre.length)); return out.sort(); };
P.repoFor = function (p) { p = p || this.cwd; for (;;) { if (this.repos[p]) return this.repos[p]; if (p === '/') return null; p = this.parent(p); } };
P.worktree = function (repo) { // map rel path -> content of files under repo root (excluding .git)
  var out = {}, pre = repo.root + '/';
  for (var k in this.fs) if (k.indexOf(pre) === 0 && !this.fs[k].d) { var r = k.slice(pre.length); if (r.indexOf('.git/') === 0) continue; out[r] = this.fs[k].c; }
  return out;
};
P.ignored = function (repo, r) { var gi = this.fs[repo.root + '/.gitignore']; if (!gi) return false; return gi.c.split('\n').map(function (s) { return s.trim(); }).filter(Boolean).some(function (pat) { pat = pat.replace(/\/$/, ''); if (pat[0] === '*') return r.slice(-(pat.length - 1)) === pat.slice(1); return r === pat || r.indexOf(pat + '/') === 0; }); };
P.headId = function (repo) { return repo.head.ref ? repo.branches[repo.head.ref] : repo.head.id; };
P.headTree = function (repo) { var id = this.headId(repo); return id ? repo.commits[id].tree : {}; };
P.mkCommit = function (repo, msg, parents, tree) {
  this.n++; var id = hash(msg + '|' + parents.join(',') + '|' + JSON.stringify(tree) + '|' + this.n);
  repo.commits[id] = { id: id, msg: msg, parents: parents, tree: JSON.parse(JSON.stringify(tree)), n: this.n, branch: repo.head.ref || '(detached)' };
  return id;
};
P.ancestors = function (repo, id) { var seen = {}, st = [id]; while (st.length) { var c = st.pop(); if (!c || seen[c]) continue; seen[c] = 1; (repo.commits[c] ? repo.commits[c].parents : []).forEach(function (p) { st.push(p); }); } return seen; };
P.mergeBase = function (repo, a, b) { var A = this.ancestors(repo, a), best = null, bn = -1, B = this.ancestors(repo, b); for (var k in B) if (A[k] && repo.commits[k].n > bn) { bn = repo.commits[k].n; best = k; } return best; };
P.checkoutTree = function (repo, tree) { // replace tracked files with tree content
  var cur = this.headTree(repo), self = this;
  Object.keys(cur).forEach(function (r) { if (!(r in tree)) delete self.fs[repo.root + '/' + r]; });
  Object.keys(tree).forEach(function (r) { var p = repo.root + '/' + r, segs = r.split('/'); for (var i = 1; i < segs.length; i++) { var d = repo.root + '/' + segs.slice(0, i).join('/'); if (!self.fs[d]) self.fs[d] = { d: 1 }; } self.fs[p] = { c: tree[r] }; });
  repo.index = JSON.parse(JSON.stringify(tree));
};
P.dirty = function (repo) { var wt = this.worktree(repo), ht = this.headTree(repo), self = this, d = false; Object.keys(wt).forEach(function (r) { if (self.ignored(repo, r)) return; if (ht[r] !== wt[r] && (r in ht)) d = true; }); Object.keys(repo.index).forEach(function (r) { if (repo.index[r] !== ht[r]) d = true; }); return d; };

P.run = function (line) {
  line = line.trim(); if (!line) return '';
  this.history.push(line);
  var parts = line.split(/\s*&&\s*/);
  if (parts.length > 1) { var self = this; return parts.map(function (p) { return self.run1(p); }).join('\n'); }
  return this.run1(line);
};
P.run1 = function (line) {
  var a = tokenize(line), cmd = a[0], self = this;
  try {
    // redirection for echo
    if (cmd === 'echo') {
      var gt = a.indexOf('>'), gg = a.indexOf('>>'), k = gt >= 0 ? gt : gg;
      if (k >= 0) { var txt = a.slice(1, k).join(' ') + '\n', f = this.abs(a[k + 1]); if (!a[k + 1]) return 'bash: syntax error near unexpected token `newline\''; if (gg >= 0 && this.isFile(f)) this.write(f, this.read(f) + txt); else this.write(f, txt); this.events.push('write:' + f); return ''; }
      return a.slice(1).join(' ');
    }
    if (this['c_' + cmd]) return this['c_' + cmd](a.slice(1), line);
    return cmd + ': command not found';
  } catch (e) { return (cmd === 'git' ? 'fatal: ' : cmd + ': ') + e.message; }
};
P.c_help = function () { return 'Commands: pwd ls cd mkdir touch cat echo rm mv cp clear\n  git init|status|add|commit|log|branch|checkout|switch|merge|diff|restore|remote|push|pull|clone|revert\n  gh repo create|pr create|pr list|pr merge|run list'; };
P.c_pwd = function () { return this.cwd; };
P.c_clear = function () { return '\u001bclear'; };
P.c_whoami = function () { return 'noah'; };
P.c_ls = function (a) { var all = a.indexOf('-a') >= 0 || a.indexOf('-la') >= 0, t = a.filter(function (x) { return x[0] !== '-'; })[0], p = this.abs(t); if (this.isFile(p)) return t; if (!this.isDir(p)) throw new Error("cannot access '" + t + "': No such file or directory"); var self = this; return this.children(p).filter(function (n) { return all || n[0] !== '.'; }).map(function (n) { return self.isDir(p + (p === '/' ? '' : '/') + n) ? n + '/' : n; }).join('  '); };
P.c_cd = function (a) { var p = this.abs(a[0] || '~'); if (!this.isDir(p)) throw new Error((a[0]) + ': No such file or directory'); this.cwd = p; return ''; };
P.c_mkdir = function (a) { var self = this, pf = a.indexOf('-p') >= 0; a.filter(function (x) { return x[0] !== '-'; }).forEach(function (d) { var p = self.abs(d); if (self.fs[p]) { if (!pf) throw new Error("cannot create directory '" + d + "': File exists"); return; } if (!self.isDir(self.parent(p))) { if (!pf) throw new Error("cannot create directory '" + d + "': No such file or directory"); var segs = p.split('/').filter(Boolean), cur = ''; segs.forEach(function (s) { cur += '/' + s; if (!self.fs[cur]) self.fs[cur] = { d: 1 }; }); } self.fs[p] = { d: 1 }; }); return ''; };
P.c_touch = function (a) { var self = this; a.forEach(function (f) { var p = self.abs(f); if (!self.fs[p]) self.write(p, ''); }); return ''; };
P.c_cat = function (a) { var self = this; return a.map(function (f) { return self.read(self.abs(f)).replace(/\n$/, ''); }).join('\n'); };
P.c_rm = function (a) { var self = this, r = a.indexOf('-r') >= 0 || a.indexOf('-rf') >= 0; a.filter(function (x) { return x[0] !== '-'; }).forEach(function (f) { var p = self.abs(f); if (!self.fs[p]) throw new Error("cannot remove '" + f + "': No such file or directory"); if (self.fs[p].d && !r) throw new Error("cannot remove '" + f + "': Is a directory"); Object.keys(self.fs).forEach(function (k) { if (k === p || k.indexOf(p + '/') === 0) delete self.fs[k]; }); if (self.repos[p]) delete self.repos[p]; }); return ''; };
P.c_mv = function (a) { var s = this.abs(a[0]), d = this.abs(a[1]); if (!this.fs[s]) throw new Error("cannot stat '" + a[0] + "': No such file or directory"); if (this.isDir(d)) d = d + '/' + s.split('/').pop(); var self = this; Object.keys(this.fs).forEach(function (k) { if (k === s || k.indexOf(s + '/') === 0) { self.fs[d + k.slice(s.length)] = self.fs[k]; delete self.fs[k]; } }); return ''; };
P.c_cp = function (a) { var s = this.abs(a[0]), d = this.abs(a[1]); if (this.isDir(d)) d = d + '/' + s.split('/').pop(); this.write(d, this.read(s)); return ''; };
P.c_code = P.c_nano = function (a) { return '(use echo "text" > ' + (a[0] || 'file') + ' to write files in this terminal)'; };

// ---------------- git ----------------
P.c_git = function (a) {
  var sub = a[0], args = a.slice(1);
  if (!sub) return 'usage: git <command> [<args>]';
  if (sub === 'init') return this.g_init(args);
  if (sub === 'clone') return this.g_clone(args);
  if (sub === '--version' || sub === 'version') return 'git version 2.47.0 (simulated)';
  var repo = this.repoFor(); if (!repo) throw new Error('not a git repository (or any of the parent directories): .git');
  var f = this['g_' + sub]; if (!f) return "git: '" + sub + "' is not a git command. See 'git --help'.";
  return f.call(this, repo, args);
};
P.g_init = function () { if (this.repos[this.cwd]) return 'Reinitialized existing Git repository in ' + this.cwd + '/.git/'; this.repos[this.cwd] = { root: this.cwd, commits: {}, branches: { main: null }, head: { ref: 'main' }, index: {}, remotes: {}, merging: null, tracking: {} }; this.fs[this.cwd + '/.git'] = { d: 1 }; return 'Initialized empty Git repository in ' + this.cwd + '/.git/'; };
P.g_status = function (repo) {
  var wt = this.worktree(repo), ht = this.headTree(repo), ix = repo.index, self = this, staged = [], unstaged = [], untracked = [], conflicted = [];
  Object.keys(Object.assign({}, ix, ht)).sort().forEach(function (r) { if (ix[r] !== ht[r]) staged.push((r in ht ? (r in ix ? 'modified:   ' : 'deleted:    ') : 'new file:   ') + r); });
  Object.keys(Object.assign({}, wt, ix)).sort().forEach(function (r) { if (self.ignored(repo, r) && !(r in ix)) return; if (!(r in ix) && !(r in ht)) { untracked.push(r); return; } if (repo.merging && repo.merging.conflicts.indexOf(r) >= 0 && !repo.merging.resolved[r]) { conflicted.push('both modified:   ' + r); return; } if (r in ix && wt[r] !== ix[r]) unstaged.push((r in wt ? 'modified:   ' : 'deleted:    ') + r); });
  var b = repo.head.ref ? 'On branch ' + repo.head.ref : 'HEAD detached at ' + repo.head.id, out = [b];
  if (!this.headId(repo)) out.push('\nNo commits yet');
  if (repo.merging) out.push('You have unmerged paths.\n  (fix conflicts and run "git commit")');
  if (conflicted.length) out.push('Unmerged paths:\n  (use "git add <file>..." to mark resolution)\n\t' + conflicted.join('\n\t'));
  if (staged.length) out.push('Changes to be committed:\n\t' + staged.join('\n\t'));
  if (unstaged.length) out.push('Changes not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n\t' + unstaged.join('\n\t'));
  if (untracked.length) out.push('Untracked files:\n  (use "git add <file>..." to include in what will be committed)\n\t' + untracked.join('\n\t'));
  if (!staged.length && !unstaged.length && !untracked.length && !conflicted.length) out.push(this.headId(repo) ? 'nothing to commit, working tree clean' : 'nothing to commit (create/copy files and use "git add" to track)');
  return out.join('\n');
};
P.g_add = function (repo, args) {
  if (!args.length) return 'Nothing specified, nothing added.';
  var wt = this.worktree(repo), self = this, all = args.indexOf('.') >= 0 || args.indexOf('-A') >= 0 || args.indexOf('--all') >= 0, cwdRel = rel(repo.root, this.cwd);
  var targets = all ? Object.keys(Object.assign({}, wt, repo.index)).filter(function (r) { return !cwdRel || r.indexOf(cwdRel + '/') === 0; }) : [];
  if (!all) args.forEach(function (x) { var p = self.abs(x), r = rel(repo.root, p); if (self.isDir(p)) { Object.keys(Object.assign({}, wt, repo.index)).forEach(function (k) { if (!r || k.indexOf(r + '/') === 0) targets.push(k); }); return; } if (!(r in wt) && !(r in repo.index)) throw new Error("pathspec '" + x + "' did not match any files"); targets.push(r); });
  targets.forEach(function (r) { if (self.ignored(repo, r) && !(r in repo.index)) return; if (r in wt) repo.index[r] = wt[r]; else delete repo.index[r]; if (repo.merging) repo.merging.resolved[r] = true; });
  return '';
};
P.g_rm = function (repo, args) { var cached = args.indexOf('--cached') >= 0, self = this, out = []; args.filter(function (x) { return x[0] !== '-'; }).forEach(function (x) { var r = rel(repo.root, self.abs(x)); if (!(r in repo.index)) throw new Error("pathspec '" + x + "' did not match any files"); delete repo.index[r]; if (!cached) delete self.fs[repo.root + '/' + r]; out.push("rm '" + r + "'"); }); return out.join('\n'); };
P.g_restore = function (repo, args) { var staged = args.indexOf('--staged') >= 0, self = this, ht = this.headTree(repo); args.filter(function (x) { return x[0] !== '-'; }).forEach(function (x) { var r = rel(repo.root, self.abs(x)); if (staged) { if (r in ht) repo.index[r] = ht[r]; else delete repo.index[r]; } else { if (!(r in repo.index)) throw new Error("pathspec '" + x + "' did not match any file(s) known to git"); self.fs[repo.root + '/' + r] = { c: repo.index[r] }; } }); return ''; };
P.g_reset = function (repo, args) { if (args[0] === '--hard') { var t = this.headTree(repo); this.checkoutTree(repo, t); repo.merging = null; return 'HEAD is now at ' + this.headId(repo) + ' ' + repo.commits[this.headId(repo)].msg; } return this.g_restore(repo, ['--staged'].concat(args)); };
P.g_commit = function (repo, args) {
  var mi = args.indexOf('-m'), am = args.indexOf('-am');
  if (args.indexOf('-a') >= 0 || am >= 0) { var wt = this.worktree(repo); Object.keys(repo.index).forEach(function (r) { if (r in wt) repo.index[r] = wt[r]; else delete repo.index[r]; }); if (am >= 0) mi = am; }
  if (mi < 0 || !args[mi + 1]) return 'error: switch `m\' requires a value (use git commit -m "your message")';
  var msg = args[mi + 1], ht = this.headTree(repo), parent = this.headId(repo);
  if (repo.merging) { var un = repo.merging.conflicts.filter(function (r) { return !repo.merging.resolved[r]; }); if (un.length) return 'error: Committing is not possible because you have unmerged files.\nhint: Fix them up in the work tree, and then use \'git add <file>\'\nfatal: Exiting because of an unresolved conflict.'; }
  if (JSON.stringify(sortObj(repo.index)) === JSON.stringify(sortObj(ht)) && !repo.merging) return 'On branch ' + (repo.head.ref || 'HEAD') + '\nnothing to commit, working tree clean';
  var parents = parent ? [parent] : []; if (repo.merging) parents.push(repo.merging.theirs);
  var id = this.mkCommit(repo, msg, parents, repo.index);
  if (repo.head.ref) repo.branches[repo.head.ref] = id; else repo.head.id = id;
  var n = 0; Object.keys(Object.assign({}, ht, repo.index)).forEach(function (r) { if (ht[r] !== repo.index[r]) n++; });
  repo.merging = null; this.events.push('commit:' + id);
  return '[' + (repo.head.ref || 'detached HEAD') + (parents.length ? '' : ' (root-commit)') + ' ' + id + '] ' + msg + '\n ' + n + ' file' + (n === 1 ? '' : 's') + ' changed';
};
function sortObj(o) { var r = {}; Object.keys(o).sort().forEach(function (k) { r[k] = o[k]; }); return r; }
P.decor = function (repo, id) { var d = []; if (this.headId(repo) === id) d.push(repo.head.ref ? 'HEAD -> ' + repo.head.ref : 'HEAD'); for (var b in repo.branches) if (repo.branches[b] === id && b !== repo.head.ref) d.push(b); for (var rn in repo.remotes) { var rr = repo.remotes[rn].seen || {}; for (var b2 in rr) if (rr[b2] === id) d.push(rn + '/' + b2); } return d.length ? ' (' + d.join(', ') + ')' : ''; };
P.g_log = function (repo, args) {
  var id = this.headId(repo); if (!id) return "fatal: your current branch '" + repo.head.ref + "' does not have any commits yet";
  var anc = this.ancestors(repo, id), self = this, list = Object.keys(anc).map(function (k) { return repo.commits[k]; }).sort(function (a, b) { return b.n - a.n; });
  if (args.indexOf('--oneline') >= 0) return list.map(function (c) { return c.id + self.decor(repo, c.id) + ' ' + c.msg; }).join('\n');
  return list.map(function (c) { return 'commit ' + c.id + self.decor(repo, c.id) + (c.parents.length > 1 ? '\nMerge: ' + c.parents.join(' ') : '') + '\nAuthor: Noah <noah@example.com>\n\n    ' + c.msg + '\n'; }).join('\n');
};
P.g_branch = function (repo, args) {
  if (!args.length || args[0] === '-a' || args[0] === '--list') { var self = this, out = Object.keys(repo.branches).sort().map(function (b) { return (b === repo.head.ref ? '* ' : '  ') + b; }); if (args[0] === '-a') for (var rn in repo.remotes) for (var b in (repo.remotes[rn].seen || {})) out.push('  remotes/' + rn + '/' + b); return out.join('\n'); }
  if (args[0] === '-d' || args[0] === '-D') { var n = args[1]; if (!(n in repo.branches)) throw new Error("branch '" + n + "' not found."); if (n === repo.head.ref) throw new Error("Cannot delete branch '" + n + "' checked out"); var head = this.headId(repo); if (args[0] === '-d' && repo.branches[n] && !this.ancestors(repo, head)[repo.branches[n]]) return "error: The branch '" + n + "' is not fully merged.\nIf you are sure you want to delete it, run 'git branch -D " + n + "'."; delete repo.branches[n]; return 'Deleted branch ' + n + '.'; }
  if (args[0] === '-m') { var from = args.length > 2 ? args[1] : repo.head.ref, to = args[args.length - 1]; repo.branches[to] = repo.branches[from]; delete repo.branches[from]; if (repo.head.ref === from) repo.head.ref = to; return ''; }
  var name = args[0]; if (name in repo.branches) throw new Error("a branch named '" + name + "' already exists");
  if (!this.headId(repo)) throw new Error("not a valid object name: '" + repo.head.ref + "'");
  repo.branches[name] = this.headId(repo); return '';
};
P.switchTo = function (repo, name, create) {
  if (create) { if (name in repo.branches) throw new Error("a branch named '" + name + "' already exists"); repo.branches[name] = this.headId(repo); repo.head = { ref: name }; return "Switched to a new branch '" + name + "'"; }
  if (!(name in repo.branches)) {
    for (var rn in repo.remotes) { var seen = repo.remotes[rn].seen || {}; if (seen[name]) { repo.branches[name] = seen[name]; repo.tracking[name] = rn; break; } }
    if (!(name in repo.branches)) { if (repo.commits[name]) { this.checkoutTree(repo, repo.commits[name].tree); repo.head = { id: name }; return "Note: switching to '" + name + "'.\nYou are in 'detached HEAD' state."; } throw new Error("invalid reference: " + name); }
  }
  if (name === repo.head.ref) return "Already on '" + name + "'";
  if (this.dirty(repo)) { var target = repo.branches[name] ? repo.commits[repo.branches[name]].tree : {}, ht = this.headTree(repo), wt = this.worktree(repo), clash = Object.keys(wt).filter(function (r) { return r in ht && wt[r] !== ht[r] && target[r] !== ht[r]; }); if (clash.length) return 'error: Your local changes to the following files would be overwritten by checkout:\n\t' + clash.join('\n\t') + '\nPlease commit your changes or stash them before you switch branches.\nAborting'; }
  var tree = repo.branches[name] ? repo.commits[repo.branches[name]].tree : {};
  // keep uncommitted, non-clashing changes like real git: simple approach = replace tracked files
  var keepWt = this.worktree(repo), keepHt = this.headTree(repo), changed = {}; Object.keys(keepWt).forEach(function (r) { if (keepHt[r] !== keepWt[r]) changed[r] = keepWt[r]; });
  this.checkoutTree(repo, tree); repo.head = { ref: name };
  var self = this; Object.keys(changed).forEach(function (r) { self.fs[repo.root + '/' + r] = { c: changed[r] }; });
  return "Switched to branch '" + name + "'";
};
P.g_checkout = function (repo, args) {
  if (args[0] === '-b') return this.switchTo(repo, args[1], true);
  if (args[0] === '--ours' || args[0] === '--theirs') {
    if (!repo.merging) throw new Error('no merge in progress');
    var r = rel(repo.root, this.abs(args[1])), side = args[0] === '--ours' ? repo.merging.ours[r] : repo.merging.theirsTree[r];
    if (side === undefined) throw new Error("path '" + args[1] + "' does not have " + args[0].slice(2) + ' version'); this.fs[repo.root + '/' + r] = { c: side }; return 'Updated 1 path from the index';
  }
  if (args[0] === '--') { return this.g_restore(repo, args.slice(1)); }
  return this.switchTo(repo, args[0], false);
};
P.g_switch = function (repo, args) { if (args[0] === '-c' || args[0] === '--create') return this.switchTo(repo, args[1], true); return this.switchTo(repo, args[0], false); };
P.mergeInto = function (repo, theirsId, label) {
  var ours = this.headId(repo);
  if (!theirsId) throw new Error(label + ' - not something we can merge');
  if (ours && this.ancestors(repo, ours)[theirsId]) return 'Already up to date.';
  if (!ours || this.ancestors(repo, theirsId)[ours]) { var t = repo.commits[theirsId].tree; this.checkoutTree(repo, t); if (repo.head.ref) repo.branches[repo.head.ref] = theirsId; return 'Updating ' + (ours || '0000000') + '..' + theirsId + '\nFast-forward'; }
  if (this.dirty(repo)) return 'error: Your local changes would be overwritten by merge.\nPlease commit your changes or stash them before you merge.\nAborting';
  var base = this.mergeBase(repo, ours, theirsId), B = base ? repo.commits[base].tree : {}, O = repo.commits[ours].tree, T = repo.commits[theirsId].tree, out = {}, conflicts = [];
  Object.keys(Object.assign({}, B, O, T)).forEach(function (r) {
    var b = B[r], o = O[r], t = T[r];
    if (o === t) { if (o !== undefined) out[r] = o; }
    else if (t === b) { if (o !== undefined) out[r] = o; }
    else if (o === b) { if (t !== undefined) out[r] = t; }
    else { conflicts.push(r); var nl = function (x) { x = x || ''; return x && x.slice(-1) !== '\n' ? x + '\n' : x; }; out[r] = '<<<<<<< HEAD\n' + nl(o) + '=======\n' + nl(t) + '>>>>>>> ' + label + '\n'; }
  });
  var self = this;
  // write working tree
  Object.keys(O).forEach(function (r) { if (!(r in out)) delete self.fs[repo.root + '/' + r]; });
  Object.keys(out).forEach(function (r) { self.fs[repo.root + '/' + r] = { c: out[r] }; });
  if (conflicts.length) {
    var ix = {}; Object.keys(out).forEach(function (r) { if (conflicts.indexOf(r) < 0) ix[r] = out[r]; else if (r in O) ix[r] = O[r]; }); repo.index = ix;
    repo.merging = { theirs: theirsId, conflicts: conflicts, resolved: {}, ours: O, theirsTree: T, label: label };
    return conflicts.map(function (r) { return 'Auto-merging ' + r + '\nCONFLICT (content): Merge conflict in ' + r; }).join('\n') + '\nAutomatic merge failed; fix conflicts and then commit the result.';
  }
  repo.index = out;
  var id = this.mkCommit(repo, "Merge branch '" + label + "'", [ours, theirsId], out); repo.branches[repo.head.ref] = id;
  return "Merge made by the 'ort' strategy.";
};
P.g_merge = function (repo, args) {
  if (args[0] === '--abort') { if (!repo.merging) throw new Error('There is no merge to abort (MERGE_HEAD missing).'); this.checkoutTree(repo, repo.merging.ours); repo.merging = null; return ''; }
  var name = args[0], id = repo.branches[name];
  if (id === undefined && name && name.indexOf('/') > 0) { var sp = name.split('/'); id = (repo.remotes[sp[0]] && repo.remotes[sp[0]].seen || {})[sp[1]]; }
  if (repo.merging) return 'error: Merging is not possible because you have unmerged files.';
  return this.mergeInto(repo, id, name);
};
P.g_diff = function (repo, args) {
  var staged = args.indexOf('--staged') >= 0 || args.indexOf('--cached') >= 0, A = staged ? this.headTree(repo) : repo.index, Bt = staged ? repo.index : this.worktree(repo), out = [];
  Object.keys(Object.assign({}, A, staged ? Bt : A)).sort().forEach(function (r) {
    if (!(r in A) && !staged) return; var a = A[r], b = Bt[r]; if (a === b) return;
    out.push('diff --git a/' + r + ' b/' + r + '\n--- a/' + r + '\n+++ b/' + r);
    (a || '').split('\n').filter(Boolean).forEach(function (l) { if ((b || '').split('\n').indexOf(l) < 0) out.push('-' + l); });
    (b || '').split('\n').filter(Boolean).forEach(function (l) { if ((a || '').split('\n').indexOf(l) < 0) out.push('+' + l); });
  });
  return out.join('\n');
};
P.g_revert = function (repo, args) { var id = args[0] === 'HEAD' ? this.headId(repo) : args[0], c = repo.commits[id]; if (!c) throw new Error('bad revision ' + args[0]); var par = c.parents[0] ? repo.commits[c.parents[0]].tree : {}, cur = JSON.parse(JSON.stringify(this.headTree(repo))); Object.keys(Object.assign({}, par, c.tree)).forEach(function (r) { if (par[r] === c.tree[r]) return; if (par[r] === undefined) delete cur[r]; else cur[r] = par[r]; }); this.checkoutTree(repo, cur); var nid = this.mkCommit(repo, 'Revert "' + c.msg + '"', [this.headId(repo)], cur); repo.branches[repo.head.ref] = nid; return '[' + repo.head.ref + ' ' + nid + '] Revert "' + c.msg + '"'; };
P.g_remote = function (repo, args) {
  if (args[0] === 'add') { var name = args[1], url = args[2]; if (repo.remotes[name]) throw new Error('remote ' + name + ' already exists.'); var m = /github\.com[/:]([\w.-]+)\/([\w.-]+?)(\.git)?$/.exec(url || ''); if (!m) throw new Error("'" + url + "' does not appear to be a git repository"); repo.remotes[name] = { url: url, repo: m[2], seen: {} }; return ''; }
  if (args[0] === '-v' || !args.length) { var out = []; for (var r in repo.remotes) { out.push(r + '\t' + repo.remotes[r].url + ' (fetch)'); out.push(r + '\t' + repo.remotes[r].url + ' (push)'); } return out.join('\n'); }
  return 'usage: git remote add <name> <url>';
};
P.ghRepo = function (name) { return this.gh.repos[name]; };
P.copyCommits = function (fromCommits, toCommits, id) { var st = [id]; while (st.length) { var c = st.pop(); if (!c || toCommits[c]) continue; toCommits[c] = JSON.parse(JSON.stringify(fromCommits[c])); fromCommits[c].parents.forEach(function (p) { st.push(p); }); } };
P.g_push = function (repo, args) {
  var a0u = args.indexOf('-u') >= 0 || args.indexOf('--set-upstream') >= 0;
  args = args.filter(function (x) { return x !== '-u' && x !== '--set-upstream' && x !== '--force' && x !== '-f'; });
  var rn = args[0] || 'origin', br = args[1] || repo.head.ref, R = repo.remotes[rn];
  if (!R) throw new Error("'" + rn + "' does not appear to be a git repository\nfatal: Could not read from remote repository.");
  var gr = this.ghRepo(R.repo); if (!gr) return 'remote: Repository not found.\nfatal: repository \'' + R.url + '\' not found';
  var id = repo.branches[br]; if (!id) return 'error: src refspec ' + br + ' does not match any';
  var remoteId = gr.branches[br];
  if (remoteId && !this.ancestors(repo, id)[remoteId]) return ' ! [rejected]        ' + br + ' -> ' + br + ' (fetch first)\nerror: failed to push some refs\nhint: Updates were rejected because the remote contains work that you do not\nhint: have locally. Integrate the remote changes (e.g. \'git pull\') before pushing again.';
  this.copyCommits(repo.commits, gr.commits, id); gr.branches[br] = id; R.seen[br] = id; repo.tracking[br] = rn;
  var msg = 'To ' + R.url + '\n' + (remoteId ? '   ' + remoteId + '..' + id + '  ' + br + ' -> ' + br : ' * [new branch]      ' + br + ' -> ' + br) + (a0u ? "\nbranch '" + br + "' set up to track '" + rn + '/' + br + "'." : '');
  this.events.push('push:' + br);
  var ci = this.runCI(gr, br, id); if (ci) msg += '\n' + ci;
  return msg;
};
P.runCI = function (gr, br, id) {
  var tree = gr.commits[id].tree, wf = Object.keys(tree).filter(function (r) { return r.indexOf('.github/workflows/') === 0; });
  if (!wf.length) return '';
  var yml = wf.map(function (r) { return tree[r]; }).join('\n'), steps = [], ok = true;
  if (!/on:\s*\[?\s*push/.test(yml) && !/on:\s*\n\s*push/.test(yml)) return '';
  if (/branches:\s*\[\s*main\s*\]/.test(yml) && br !== 'main') return '';
  if (/run:\s*test -f index\.html/.test(yml)) { var has = 'index.html' in tree; steps.push((has ? '✓' : '✗') + ' test -f index.html'); if (!has) ok = false; }
  if (/run:\s*grep -q "<title>" index\.html/.test(yml)) { var t = (tree['index.html'] || '').indexOf('<title>') >= 0; steps.push((t ? '✓' : '✗') + ' grep -q "<title>" index.html'); if (!t) ok = false; }
  var deploy = ok && /deploy-pages|pages/i.test(yml) && br === 'main';
  var run = { id: (gr.runs.length + 1), br: br, commit: id, ok: ok, steps: steps, deployed: deploy };
  gr.runs.push(run); if (deploy) { gr.pages = { url: 'https://' + this.gh.user + '.github.io/' + gr.name + '/', commit: id, html: tree['index.html'] || '' }; }
  return '⚙️  GitHub Actions: run #' + run.id + ' on ' + br + '\n   ' + steps.join('\n   ') + '\n   ' + (ok ? '✅ passed' : '❌ failed') + (deploy ? '\n🚀 Deployed to ' + gr.pages.url : '');
};
P.g_fetch = function (repo, args) { var rn = args[0] || 'origin', R = repo.remotes[rn]; if (!R) throw new Error("'" + rn + "' does not appear to be a git repository"); var gr = this.ghRepo(R.repo); for (var b in gr.branches) { this.copyCommits(gr.commits, repo.commits, gr.branches[b]); R.seen[b] = gr.branches[b]; } return ''; };
P.g_pull = function (repo, args) { var rn = args[0] || repo.tracking[repo.head.ref] || 'origin', br = args[1] || repo.head.ref, R = repo.remotes[rn]; if (!R) throw new Error("'" + rn + "' does not appear to be a git repository"); this.g_fetch(repo, [rn]); var id = R.seen[br]; if (!id) return "fatal: couldn't find remote ref " + br; var r = this.mergeInto(repo, id, rn + '/' + br); return 'From ' + R.url + '\n * branch            ' + br + '       -> FETCH_HEAD\n' + r; };
P.g_clone = function (args) { var url = args[0], m = /github\.com[/:]([\w.-]+)\/([\w.-]+?)(\.git)?$/.exec(url || ''); if (!m) throw new Error("repository '" + url + "' does not exist"); var gr = this.ghRepo(m[2]); if (!gr) throw new Error("repository '" + url + "' not found"); var dir = this.abs(args[1] || m[2]); if (this.fs[dir]) throw new Error("destination path '" + m[2] + "' already exists and is not an empty directory."); this.fs[dir] = { d: 1 }; var save = this.cwd; this.cwd = dir; this.g_init(); var repo = this.repos[dir]; repo.remotes.origin = { url: url, repo: m[2], seen: {} }; this.g_fetch(repo, ['origin']); var def = gr.branches.main ? 'main' : Object.keys(gr.branches)[0]; if (def) { repo.branches = {}; repo.branches[def] = gr.branches[def]; repo.head = { ref: def }; repo.tracking[def] = 'origin'; this.checkoutTree(repo, gr.commits[gr.branches[def]].tree); } this.cwd = save; return "Cloning into '" + (args[1] || m[2]) + "'...\ndone."; };
P.g_stash = function (repo, args) { repo.stash = repo.stash || []; if (args[0] === 'pop') { var s = repo.stash.pop(); if (!s) return 'No stash entries found.'; var self = this; Object.keys(s).forEach(function (r) { self.fs[repo.root + '/' + r] = { c: s[r] }; }); return 'Dropped refs/stash@{0}'; } var wt = this.worktree(repo), ht = this.headTree(repo), ch = {}; Object.keys(wt).forEach(function (r) { if (r in ht && wt[r] !== ht[r]) ch[r] = wt[r]; }); if (!Object.keys(ch).length) return 'No local changes to save'; repo.stash.push(ch); this.checkoutTree(repo, ht); return 'Saved working directory and index state WIP on ' + repo.head.ref; };

// ---------------- gh (GitHub CLI, simulated) ----------------
P.c_gh = function (a) {
  var sub = a[0] + ' ' + (a[1] || ''), repo = this.repoFor(), self = this;
  if (sub === 'repo create') { var name = a[2]; if (!name) return 'usage: gh repo create <name> --public'; if (this.gh.repos[name]) throw new Error('repository ' + name + ' already exists'); this.gh.repos[name] = { name: name, branches: {}, commits: {}, prs: [], runs: [], pages: null, public: a.indexOf('--private') < 0 }; var out = '✓ Created repository noah/' + name + ' on GitHub\n  https://github.com/noah/' + name; if (a.indexOf('--source=.') >= 0 && repo) { if (!repo.remotes.origin) repo.remotes.origin = { url: 'https://github.com/noah/' + name + '.git', repo: name, seen: {} }; out += '\n✓ Added remote https://github.com/noah/' + name + '.git'; if (a.indexOf('--push') >= 0) out += '\n' + this.g_push(repo, ['origin', repo.head.ref]); } return out; }
  if (!repo || !repo.remotes.origin) return 'no git remotes found';
  var gr = this.ghRepo(repo.remotes.origin.repo); if (!gr) return 'GraphQL: Could not resolve to a Repository';
  if (sub === 'pr create') { var br = repo.head.ref; if (br === 'main') return 'must be on a branch other than main to create a pull request'; if (!gr.branches[br]) return 'aborted: you must first push the current branch to a remote, or use the --head flag'; var ti = a.indexOf('--title'), title = ti >= 0 ? a[ti + 1] : repo.commits[gr.branches[br]].msg; var pr = { n: gr.prs.length + 1, title: title, head: br, base: 'main', state: 'OPEN' }; gr.prs.push(pr); this.events.push('pr:' + pr.n); return 'Creating pull request for ' + br + ' into main in noah/' + gr.name + '\n\nhttps://github.com/noah/' + gr.name + '/pull/' + pr.n; }
  if (sub === 'pr list') { var open = gr.prs.filter(function (p) { return p.state === 'OPEN'; }); return open.length ? open.map(function (p) { return '#' + p.n + '  ' + p.title + '  ' + p.head + '  OPEN'; }).join('\n') : 'no open pull requests in noah/' + gr.name; }
  if (sub === 'pr merge') { var n = +String(a[2] || '').replace('#', ''), p = gr.prs.filter(function (x) { return x.n === n; })[0] || gr.prs.filter(function (x) { return x.state === 'OPEN'; })[0]; if (!p || p.state !== 'OPEN') return 'no open pull request found'; var hid = gr.branches[p.head], mid = gr.branches.main; if (mid && !this.ancestors({ commits: gr.commits }, hid)[mid]) { var base = this.mergeBase({ commits: gr.commits }, mid, hid), B = base ? gr.commits[base].tree : {}, O = gr.commits[mid].tree, T = gr.commits[hid].tree, bad = Object.keys(Object.assign({}, O, T)).filter(function (r) { return O[r] !== T[r] && O[r] !== B[r] && T[r] !== B[r]; }); if (bad.length) return 'X Pull request #' + p.n + ' is not mergeable: the merge commit cannot be cleanly created.\n  Conflicts in: ' + bad.join(', ') + '\n  Pull main into your branch, resolve, and push again.'; var out2 = {}; Object.keys(Object.assign({}, B, O, T)).forEach(function (r) { var v = O[r] === T[r] ? O[r] : T[r] === B[r] ? O[r] : T[r]; if (v !== undefined) out2[r] = v; }); this.n++; var id = hash('pr' + p.n + this.n); gr.commits[id] = { id: id, msg: 'Merge pull request #' + p.n + ' from noah/' + p.head, parents: [mid, hid], tree: out2, n: this.n, branch: 'main' }; gr.branches.main = id; } else gr.branches.main = hid; p.state = 'MERGED'; this.events.push('prmerge:' + p.n); var ci = this.runCI(gr, 'main', gr.branches.main); return '✓ Merged pull request #' + p.n + ' (' + p.title + ')' + (ci ? '\n' + ci : ''); }
  if (sub === 'run list') return gr.runs.length ? gr.runs.slice().reverse().map(function (r) { return (r.ok ? '✓' : 'X') + '  #' + r.id + '  ' + r.br + '  ' + r.commit + (r.deployed ? '  deployed' : ''); }).join('\n') : 'no runs found';
  if (sub === 'browse ') return gr.pages ? gr.pages.url : 'https://github.com/noah/' + gr.name;
  return 'unknown gh command: ' + a.join(' ');
};

// ---------------- setup helpers (used by challenge definitions; prefix @) ----------------
P.setup = function (cmds) {
  var self = this;
  (cmds || []).forEach(function (c) {
    if (c[0] !== '@') { self.run(c); return; }
    var a = tokenize(c.slice(1));
    var raw = /^\w+\s+(\S+)\s?([\s\S]*)$/.exec(c.slice(1)) || [];
    if (a[0] === 'file') { var p = self.abs(a[1]), segs = p.split('/').filter(Boolean), cur = ''; segs.slice(0, -1).forEach(function (s) { cur += '/' + s; if (!self.fs[cur]) self.fs[cur] = { d: 1 }; }); self.fs[p] = { c: (raw[2] || '').replace(/\\n/g, '\n') }; }
    else if (a[0] === 'ghrepo') { self.gh.repos[a[1]] = { name: a[1], branches: {}, commits: {}, prs: [], runs: [], pages: null, public: true }; }
    else if (a[0] === 'teammate') { // @teammate <repo> <branch> <file> <content...> : a commit pushed by someone else
      var gr = self.gh.repos[a[1]], br = a[2], file = a[3], content = (/^\S+\s+\S+\s+\S+\s+\S+\s?([\s\S]*)$/.exec(c.slice(1)) || [])[1].replace(/\\n/g, '\n'), parent = gr.branches[br], tree = parent ? JSON.parse(JSON.stringify(gr.commits[parent].tree)) : {};
      tree[file] = content; self.n++; var id = hash('tm' + file + content + self.n); gr.commits[id] = { id: id, msg: 'Teammate: update ' + file, parents: parent ? [parent] : [], tree: tree, n: self.n, branch: br, by: 'sam' }; gr.branches[br] = id;
    }
    else if (a[0] === 'cd') self.cwd = self.abs(a[1]);
  });
  this.history = [];
};
// ---------------- graph data for the UI ----------------
P.graph = function () {
  var repo = this.repoFor(); if (!repo) return null;
  var commits = Object.keys(repo.commits).map(function (k) { return repo.commits[k]; }).sort(function (a, b) { return a.n - b.n; });
  var lanes = {}, laneN = 0; lanes.main = 0; laneN = 1;
  commits.forEach(function (c) { if (!(c.branch in lanes)) lanes[c.branch] = laneN++; });
  var heads = {}; for (var b in repo.branches) if (repo.branches[b]) (heads[repo.branches[b]] = heads[repo.branches[b]] || []).push(b);
  var remote = {}; for (var rn in repo.remotes) for (var b2 in (repo.remotes[rn].seen || {})) (remote[repo.remotes[rn].seen[b2]] = remote[repo.remotes[rn].seen[b2]] || []).push(rn + '/' + b2);
  return { commits: commits.map(function (c) { return { id: c.id, msg: c.msg, parents: c.parents, lane: lanes[c.branch], branch: c.branch }; }), heads: heads, remote: remote, head: this.headId(repo), headRef: repo.head.ref, lanes: lanes, merging: !!repo.merging };
};
Sim.tokenize = tokenize;
root.GitSim = Sim;
if (typeof module !== 'undefined') module.exports = Sim;
})(typeof window !== 'undefined' ? window : globalThis);
