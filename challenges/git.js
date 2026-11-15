// Terminal, Git & GitHub track and DevOps track (simulated shell, git and GitHub) + the Ship It project
function GIT(o, extra) { // chips = every solution command plus distractors, in a stable shuffled order
  var seen = {}, all = (o.sol || []).concat(extra || []).filter(function (c) { if (seen[c]) return false; seen[c] = 1; return true; });
  all.sort(function (a, b) { var h = function (s) { var x = 7; for (var i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) % 9973; return x; }; return h(a) - h(b); });
  o.sb = 'git'; o.slots = {}; o.code = ''; o.git = o.git || {}; o.git.chips = all; return CH(o);
}
function nCommits(repo) { return repo ? Object.keys(repo.commits).length : 0; }
function headTree(g) { var r = g.repoFor(); return r ? g.headTree(r) : {}; }
var SITE_REPO = ['mkdir site', 'cd site', 'git init', '@file index.html <h1>My site</h1>', 'git add index.html', 'git commit -m "Add homepage"'];
GIT({ id: 'g-ls', t: 'git', tier: 1, icon: '📂', title: 'Look around',
  git: { setup: ['mkdir projects', 'mkdir photos', '@file notes.txt remember the milk', '@file projects/todo.txt finish game'], intro: 'Welcome to the terminal: you type commands, the computer answers. Tap a chip to fill the command line, then press ⏎.' },
  story: 'Developers live in the **terminal**. Find out where you are (`pwd`), list what is here (`ls`), move into the projects folder (`cd`), and read the file inside it (`cat`).',
  sol: ['pwd', 'ls', 'cd projects', 'cat todo.txt'],
  goals: [['You printed your location', "hist.indexOf('pwd') >= 0"], ['You are inside projects', "cwd === '/home/noah/projects'"], ['You read todo.txt', "/finish game/.test(last)"]],
  hints: ['`cd` changes directory. `cat` prints a file.', 'pwd → ls → cd projects → cat todo.txt'],
  learn: { h: 'The shell', x: 'The **terminal** runs a **shell** (bash or zsh) that executes commands. `pwd` prints the working directory, `ls` lists it, `cd` changes it, and `cat` prints files. `~` is your home folder and `..` is the parent folder.\n\nEvery server, Docker container and CI pipeline is driven this way, so terminal fluency is a developer superpower.', terms: ['terminal', 'shell', 'directory'] } }, ['ls -a', 'cd ..', 'cat notes.txt', 'whoami']);
GIT({ id: 'g-mk', t: 'git', tier: 1, icon: '🏗️', title: 'Make a project folder',
  git: { setup: [] },
  story: 'Create a folder called `game`, go into it, and create an empty `main.py` file.',
  sol: ['mkdir game', 'cd game', 'touch main.py'],
  goals: [['A game folder exists', "g.isDir('/home/noah/game')"], ['game/main.py exists', "g.isFile('/home/noah/game/main.py')"]],
  hints: ['mkdir → cd → touch'],
  learn: { h: 'Files and folders', x: '`mkdir` makes a directory, and `touch` creates an empty file (or updates its timestamp). Paths can be **relative** (`game/main.py`, from where you are) or **absolute** (`/home/noah/game/main.py`, from the root `/`).', terms: ['directory', 'path'] } }, ['ls', 'mkdir Game', 'touch game.py', 'pwd']);
GIT({ id: 'g-echo', t: 'git', tier: 1, icon: '✍️', title: 'Write and append',
  git: { setup: [] },
  story: 'Write "line one" into `log.txt`, then **add** "line two" without erasing line one. `>` and `>>` behave differently.',
  sol: ['echo "line one" > log.txt', 'echo "line two" >> log.txt', 'cat log.txt'],
  goals: [['log.txt has both lines', "g.isFile('/home/noah/log.txt') && g.read('/home/noah/log.txt') === 'line one\\nline two\\n'"]],
  hints: ['`>` overwrites, `>>` appends.'],
  learn: { h: 'Redirection', x: '`>` sends a command\'s output into a file, **replacing** it. `>>` **appends**. Same idea as Python\'s "w" vs "a" modes. Accidentally using `>` on an important file erases it, so pros double-check.\n\nThe `|` pipe sends one command\'s output into another, as in `cat log.txt | grep error`.', terms: ['redirection', 'terminal'] } }, ['echo "line two" > log.txt', 'cat log.txt', 'rm log.txt']);
GIT({ id: 'g-mv', t: 'git', tier: 1, icon: '🧹', title: 'Tidy up',
  git: { setup: ['@file IMG_001.jpg (photo)', '@file IMG_002.jpg (photo)', '@file draft.txt old draft', 'mkdir pics'] },
  story: 'Move both photos into `pics`, and delete `draft.txt`. In a real shell `rm` has no undo and no trash can.',
  sol: ['mv IMG_001.jpg pics', 'mv IMG_002.jpg pics', 'rm draft.txt', 'ls pics'],
  goals: [['Both photos are in pics', "g.isFile('/home/noah/pics/IMG_001.jpg') && g.isFile('/home/noah/pics/IMG_002.jpg')"], ['draft.txt is gone', "!g.isFile('/home/noah/draft.txt')"], ['Nothing else was deleted', "g.isDir('/home/noah/pics')"]],
  hints: ['`mv file folder` moves it into the folder.'],
  learn: { h: 'mv, cp and rm', x: '`mv` moves or renames, `cp` copies, and `rm` deletes **permanently**. `rm -r folder` deletes a folder and everything inside it. The infamous `rm -rf /` would wipe a whole system. Look before you delete, with `ls`.', terms: ['terminal'] } }, ['rm -r pics', 'cp draft.txt pics', 'ls']);
GIT({ id: 'g-init', t: 'git', tier: 1, icon: '🌱', title: 'Start a repository',
  git: { setup: ['mkdir site', '@file site/index.html <h1>Hello</h1>'] },
  story: 'Go into `site` and turn it into a **Git repository**, so every change can be tracked. Then ask Git for its status.',
  sol: ['cd site', 'git init', 'git status'],
  goals: [['site is a git repo', "!!g.repos['/home/noah/site']"], ['You checked the status', "/Untracked files/.test(last)"]],
  hints: ['cd site → git init → git status'],
  learn: { h: 'Git', x: '**Git** records snapshots of your project over time. `git init` creates a hidden `.git` folder where that history lives. `git status` is the command you will run most. It tells you what changed and what is staged.\n\nRight now index.html is **untracked**: Git sees it but is not saving it yet.', terms: ['git', 'repository', 'version-control'] } }, ['git init site', 'ls -a', 'git log']);
GIT({ id: 'g-commit', t: 'git', tier: 1, icon: '📸', title: 'Your first commit',
  git: { setup: ['mkdir site', 'cd site', 'git init', '@file index.html <h1>Hello</h1>'] },
  story: 'Save a snapshot: **stage** index.html, then **commit** it with a message. Watch the commit graph grow its first dot.',
  sol: ['git add index.html', 'git commit -m "Add homepage"', 'git log --oneline'],
  goals: [['One commit exists', "nCommits(repo) === 1"], ['It contains index.html', "'index.html' in headTree(g)"]],
  hints: ['Commit only records what was added (staged).', 'git add index.html → git commit -m "..."'],
  learn: { h: 'Stage, then commit', x: 'Git has a two-step save. `git add` puts changes in the **staging area**, and `git commit -m "message"` records everything staged as one snapshot with an ID like `a1b2c3d`. Committing first says "nothing added to commit", and that is the staging area at work.\n\nGood messages say *why*: "Add homepage", not "stuff".', terms: ['commit', 'staging-area'] } }, ['git commit -m "Add homepage" index', 'git status', 'git add .']);
GIT({ id: 'g-stage', t: 'git', tier: 2, icon: '🎯', title: 'Commit only what is ready',
  git: { setup: ['mkdir app', 'cd app', 'git init', '@file style.css body{}', '@file app.js let x = 1;', 'git add .', 'git commit -m "Start"', '@file style.css body{color:navy}', '@file app.js let x = ;  // half-written, broken'] },
  story: 'You changed two files. The CSS fix is done, and app.js is half-written and broken. Commit **only** the CSS.',
  sol: ['git status', 'git add style.css', 'git commit -m "Make text navy"'],
  goals: [['2 commits', "nCommits(repo) === 2"], ['The CSS change is committed', "headTree(g)['style.css'] === 'body{color:navy}'"], ['The broken app.js is NOT committed', "headTree(g)['app.js'] === 'let x = 1;'"]],
  hints: ['`git add .` stages everything.', 'Add just style.css.'],
  learn: { h: 'Small, focused commits', x: 'The staging area lets you commit **part** of your work. Each commit should be one logical change. Then if something breaks, you can find and undo exactly that change. Half-finished work stays uncommitted (or goes on a branch).', terms: ['staging-area', 'commit'] } }, ['git add .', 'git commit -am "Everything"', 'git diff']);
GIT({ id: 'g-restore', t: 'git', tier: 2, icon: '⏪', title: 'Undo a bad edit',
  git: { setup: ['mkdir app', 'cd app', 'git init', '@file config.json {"debug": false}', 'git add .', 'git commit -m "Config"', '@file config.json {"debug": tru'] },
  story: 'You fat-fingered config.json and broke it. Look at what changed with `git diff`, then throw the change away and get the committed version back.',
  sol: ['git diff', 'git restore config.json', 'cat config.json'],
  goals: [['config.json is back to the committed version', "g.read('/home/noah/app/config.json') === '{\"debug\": false}'"]],
  hints: ['`git restore <file>` discards uncommitted changes.'],
  learn: { h: 'restore and diff', x: '`git diff` shows exactly what changed (`-` removed, `+` added). `git restore file` throws away uncommitted edits and goes back to the last commit. This is one reason to commit often: commits are save points.\n\nRestored changes are gone for good, because they were never committed.', terms: ['diff', 'commit'] } }, ['git restore --staged config.json', 'git status', 'git log']);
GIT({ id: 'g-ignore', t: 'git', tier: 2, icon: '🙈', title: 'Keep secrets out',
  git: { setup: ['mkdir app', 'cd app', 'git init', '@file app.py print("hi")', '@file .env API_KEY=sk-live-123', 'mkdir node_modules', '@file node_modules/huge.js // 40 MB of dependency code'] },
  story: 'Commit the app, but **never** the `.env` file (it holds an API key) or `node_modules` (downloaded dependencies). Tell Git to ignore them first.',
  sol: ['echo ".env" > .gitignore', 'echo "node_modules/" >> .gitignore', 'git add .', 'git commit -m "Initial app"'],
  goals: [['app.py is committed', "'app.py' in headTree(g)"], ['.env is NOT committed', "!('.env' in headTree(g))"], ['node_modules is NOT committed', "!Object.keys(headTree(g)).some(function(f){return f.indexOf('node_modules')===0;})"], ['.gitignore is committed', "'.gitignore' in headTree(g)"]],
  hints: ['A `.gitignore` file lists patterns Git should skip.', 'Create .gitignore before `git add .`.'],
  learn: { h: '.gitignore', x: '`.gitignore` lists files Git should never track: secrets (`.env`), dependencies (`node_modules/`), build output and OS junk (`.DS_Store`). Commit the .gitignore itself so the whole team shares it.\n\nOnce a secret is pushed to GitHub, consider it leaked. Bots scrape new commits within minutes. Ignoring it afterwards does not remove it from history.', terms: ['gitignore', 'environment-variable'] } }, ['git add .env', 'echo ".env" >> .gitignore', 'git status']);
GIT({ id: 'g-branch', t: 'git', tier: 2, icon: '🌿', title: 'Work on a branch',
  git: { setup: SITE_REPO },
  story: 'Try a risky redesign without touching the working site. Create a branch called `redesign`, switch to it, change the page and commit. main stays safe. Watch the graph split.',
  sol: ['git switch -c redesign', 'echo "<h1>New look</h1>" > index.html', 'git commit -am "Try new look"', 'git switch main', 'cat index.html'],
  goals: [['redesign has the new page', "repo.branches.redesign && repo.commits[repo.branches.redesign].tree['index.html'] === '<h1>New look</h1>\\n'"], ['main is untouched', "repo.commits[repo.branches.main].tree['index.html'] === '<h1>My site</h1>'"], ['You are back on main', "repo.head.ref === 'main'"]],
  hints: ['`git switch -c name` creates and switches.', 'Commit on the branch, then switch back to main and look.'],
  learn: { h: 'Branches', x: 'A **branch** is a movable label pointing at a commit. New commits move the current branch forward and leave others alone. Switching branches swaps the files in your folder, and index.html changed back when you returned to main.\n\nTeams put every feature on its own branch, so main always works.', terms: ['branch', 'head'] } }, ['git branch', 'git switch redesign', 'git commit -m "Try new look"']);
GIT({ id: 'g-merge', t: 'git', tier: 2, icon: '🔀', title: 'Merge it in',
  git: { setup: SITE_REPO.concat(['git switch -c about', '@file about.html <h1>About me</h1>', 'git add about.html', 'git commit -m "Add about page"', 'git switch main']) },
  story: 'The `about` branch is finished. Bring its work into main.',
  sol: ['git log --oneline', 'git merge about', 'ls'],
  goals: [['main has about.html', "'about.html' in repo.commits[repo.branches.main].tree"], ['You are on main', "repo.head.ref === 'main'"]],
  hints: ['Be on the branch that receives the work, and merge the other one into it.'],
  learn: { h: 'Merging', x: '`git merge about`, run while on main, brings about\'s commits into main. Since main had not moved, Git just slid the label forward. That is a **fast-forward**. If both branches had new commits, Git would create a **merge commit** with two parents.', terms: ['merge', 'branch'] } }, ['git switch about', 'git merge main', 'git branch -d about']);
GIT({ id: 'g-conflict', t: 'git', tier: 3, icon: '⚔️', title: 'Merge conflict',
  git: { setup: SITE_REPO.concat(['git switch -c blue', '@file index.html <h1 style="color:blue">My site</h1>', 'git commit -am "Blue title"', 'git switch main', '@file index.html <h1 style="color:green">My site</h1>', 'git commit -am "Green title"']) },
  story: 'Two branches changed the **same line** differently. Merge `blue` into main, read the conflict markers, and resolve it by choosing green. Then finish the merge.',
  sol: ['git merge blue', 'cat index.html', "echo '<h1 style=\"color:green\">My site</h1>' > index.html", 'git add index.html', 'git commit -m "Merge blue, keep green"'],
  goals: [['The merge is finished', "!repo.merging && repo.commits[repo.branches.main].parents.length === 2"], ['No conflict markers remain', "!/<<<<<<<|>>>>>>>|=======/.test(headTree(g)['index.html'] || '<<<<<<<')"], ['The title is green', "(headTree(g)['index.html'] || '').trim() === '<h1 style=\"color:green\">My site</h1>'"]],
  hints: ['Git puts both versions in the file between `<<<<<<<` and `>>>>>>>`. You write the final version.', 'Overwrite the file with the green line (or `git checkout --ours index.html`), add it, commit.'],
  learn: { h: 'Resolving conflicts', x: 'When both sides edit the same lines, Git cannot guess, so it writes both versions into the file:\n```\n<<<<<<< HEAD\n(yours)\n=======\n(theirs)\n>>>>>>> blue\n```\nYou edit the file to the correct final content, delete the markers, `git add` it to mark it resolved, and commit. Conflicts are normal teamwork, not failure.', terms: ['merge-conflict', 'merge'] } }, ['git merge --abort', 'git status', 'git commit -m "Merge"', 'git checkout --theirs index.html', 'git checkout --ours index.html']);
GIT({ id: 'g-remote', t: 'git', tier: 2, icon: '☁️', title: 'Push to GitHub',
  git: { setup: ['@ghrepo site'].concat(SITE_REPO) },
  story: 'Your repo only lives on this computer. An empty GitHub repository called `site` is waiting. Connect it as `origin` and **push** main. Then check the GitHub tab.',
  sol: ['git remote add origin https://github.com/noah/site.git', 'git push -u origin main'],
  goals: [['origin points at GitHub', "!!repo.remotes.origin"], ['GitHub has your commit', "gh.repos.site.branches.main === repo.branches.main"]],
  hints: ['`git remote add <name> <url>`, then `git push -u origin main`.'],
  learn: { h: 'Remotes and GitHub', x: 'Git is distributed: every copy has the full history. **GitHub** hosts a copy online for backup, sharing and collaboration. `origin` is the conventional name for that remote. `push` uploads your commits, and `-u` remembers the pairing so later you can just type `git push`.\n\nGit and GitHub are different things: Git is the tool, GitHub is a website (GitLab and Bitbucket are alternatives).', terms: ['remote', 'github', 'push'] } }, ['git push', 'git remote -v', 'git pull']);
GIT({ id: 'g-pull', t: 'git', tier: 3, icon: '🤝', title: 'A teammate pushed first',
  git: { setup: ['@ghrepo site'].concat(SITE_REPO, ['git remote add origin https://github.com/noah/site.git', 'git push -u origin main', '@teammate site main README.md # Site\\nBy Noah and Sam', '@file style.css h1 { color: navy }', 'git add style.css', 'git commit -m "Add styles"']) },
  story: 'Your teammate Sam pushed a README while you committed styles. Try to push: GitHub will reject it. Get Sam\'s work, then push both.',
  sol: ['git push', 'git pull', 'git push'],
  goals: [['GitHub has Sam\'s README and your styles', "var t = gh.repos.site.commits[gh.repos.site.branches.main].tree; return 'README.md' in t && 'style.css' in t"], ['Your local main matches GitHub', "repo.branches.main === gh.repos.site.branches.main"]],
  hints: ['Read the rejection message: it tells you what to do.', 'push (rejected) → pull → push'],
  learn: { h: 'Pull before you push', x: 'GitHub rejects a push that would erase commits you do not have. `git pull` = **fetch** (download) + **merge**. Then your push includes both. Different files merged automatically. The same line would have meant a conflict.\n\nNever "fix" a rejection with `git push --force` on a shared branch. It deletes your teammate\'s work.', terms: ['pull', 'push', 'fetch'] } }, ['git push --force', 'git fetch', 'git log --oneline']);
GIT({ id: 'g-pr', t: 'git', tier: 3, icon: '📬', title: 'Open a pull request',
  git: { setup: ['@ghrepo site'].concat(SITE_REPO, ['git remote add origin https://github.com/noah/site.git', 'git push -u origin main']) },
  story: 'Teams do not push straight to main. They open a **pull request** so someone can review. Create a branch, add a contact page, push the branch, open a PR, and merge it.',
  sol: ['git switch -c contact', 'echo "<h1>Contact</h1>" > contact.html', 'git add contact.html', 'git commit -m "Add contact page"', 'git push -u origin contact', 'gh pr create --title "Add contact page"', 'gh pr merge 1'],
  goals: [['A PR was opened', "gh.repos.site.prs.length >= 1"], ['It was merged', "gh.repos.site.prs.some(function(p){return p.state==='MERGED';})"], ['GitHub main has contact.html', "'contact.html' in gh.repos.site.commits[gh.repos.site.branches.main].tree"]],
  hints: ['A PR needs the branch to exist on GitHub first, so push it.', 'branch → commit → push -u origin contact → gh pr create → gh pr merge 1'],
  learn: { h: 'Pull requests', x: 'A **pull request** (PR) asks to merge a branch into main and gives teammates a place to review the diff, discuss and run automated checks (CI) before anything lands. `gh` is GitHub\'s command-line tool. On the website, the same thing is a green "Merge" button.\n\nPRs are the heartbeat of professional software, and open source runs on them.', terms: ['pull-request', 'code-review', 'github'] } }, ['git push origin main', 'gh pr list', 'git merge contact']);
GIT({ id: 'g-revert', t: 'git', tier: 3, icon: '↩️', title: 'Undo a pushed commit safely',
  git: { setup: ['@ghrepo site'].concat(SITE_REPO, ['git remote add origin https://github.com/noah/site.git', '@file index.html <h1>My site</h1><p>Sale: 90% off everything!!!</p>', 'git commit -am "Add sale banner"', 'git push -u origin main']) },
  story: 'Oops: you pushed a banner offering 90% off. Others may already have pulled it, so do not rewrite history. Create a **new** commit that undoes it, and push.',
  sol: ['git log --oneline', 'git revert HEAD', 'git push'],
  goals: [['The banner is gone on GitHub', "!/90%/.test(gh.repos.site.commits[gh.repos.site.branches.main].tree['index.html'])"], ['History was kept (3 commits)', "nCommits(repo) === 3"]],
  hints: ['`git revert <commit>` makes a new commit that is the opposite of that one.', '`git revert HEAD` undoes the latest commit.'],
  learn: { h: 'revert vs reset', x: '`git revert` adds a new commit that undoes an old one, so history stays intact and is safe on shared branches. `git reset` moves the branch backwards and **erases** commits. That is fine locally, and dangerous after pushing, because teammates still have the old commits.\n\nRule of thumb: public history is append-only.', terms: ['revert', 'commit'] } }, ['git reset --hard', 'git push --force', 'git status']);

// ---------- DevOps track + Ship It project ----------
var DEPLOY_YML = 'name: deploy\\non: [push]\\njobs:\\n  build:\\n    runs-on: ubuntu-latest\\n    steps:\\n      - uses: actions/checkout@v4\\n      - run: test -f index.html\\n      - run: grep -q "<title>" index.html\\n      - uses: actions/deploy-pages@v4';
var TEMPLATES = ['@file ~/templates/deploy.yml ' + DEPLOY_YML, '@file ~/templates/index.html <!doctype html>\\n<html><head><title>Noah builds things</title></head>\\n<body><h1>Hi, I am Noah</h1><p>I learned to ship this site with Git and GitHub Actions.</p></body></html>'];
var SHIP0 = TEMPLATES.concat(['mkdir portfolio', 'cd portfolio', '@file index.html <h1>Hi, I am Noah</h1>']);
GIT({ id: 'ship-1', t: 'ops', tier: 3, icon: '🚀', title: 'Ship it: repo on GitHub', proj: ['ship', 1],
  git: { setup: SHIP0, intro: 'Project: put a real website on the internet, the way professionals do. Here, GitHub is simulated.' },
  story: 'Project: deploy a portfolio site in 4 steps. First, make the folder a Git repo with a first commit, then create the GitHub repo with the `gh` CLI and push it in one go.',
  sol: ['git init', 'git add .', 'git commit -m "First version"', 'gh repo create portfolio --public --source=. --push'],
  goals: [['A local commit exists', "nCommits(repo) >= 1"], ['GitHub has the portfolio repo with your commit', "gh.repos.portfolio && gh.repos.portfolio.branches.main === repo.branches.main"]],
  hints: ['init → add → commit, then `gh repo create … --source=. --push`.'],
  learn: { h: 'The gh CLI', x: '`gh repo create name --public --source=. --push` creates the GitHub repo, adds it as origin and pushes, all in one command. CLIs like `gh`, `vercel` and `aws` let you script everything a website lets you click.', terms: ['github', 'cli'] } }, ['git push', 'gh repo create portfolio', 'git status']);
var SHIP1 = SHIP0.concat(['git init', 'git add .', 'git commit -m "First version"', 'gh repo create portfolio --public --source=. --push']);
GIT({ id: 'ship-2', t: 'ops', tier: 3, icon: '⚙️', title: 'Ship it: add CI', proj: ['ship', 2],
  git: { setup: SHIP1 },
  story: 'Add a **GitHub Actions workflow** that checks the site and deploys it on every push. A ready-made one is in `~/templates/deploy.yml`. Copy it to `.github/workflows/`, commit, push, and read what CI says.',
  sol: ['cat ~/templates/deploy.yml', 'mkdir -p .github/workflows', 'cp ~/templates/deploy.yml .github/workflows/deploy.yml', 'git add .', 'git commit -m "Add deploy workflow"', 'git push'],
  goals: [['The workflow is on GitHub', "'.github/workflows/deploy.yml' in gh.repos.portfolio.commits[gh.repos.portfolio.branches.main].tree"], ['CI ran (and caught a problem!)', "gh.repos.portfolio.runs.length >= 1 && !gh.repos.portfolio.runs[gh.repos.portfolio.runs.length-1].ok"]],
  hints: ['Workflows live in `.github/workflows/`.', 'mkdir -p → cp → add → commit → push'],
  learn: { h: 'Continuous integration', x: '**CI** runs checks automatically on every push. This workflow: on push, check that index.html exists and has a `<title>`, then deploy. Your page has no `<title>`, so CI **failed** and nothing deployed. That is CI doing its job.\n\nReal pipelines run tests, linters, type checks and security scans before anything reaches users.', terms: ['ci-cd', 'github-actions', 'yaml'] } }, ['git push --force', 'cat .github/workflows/deploy.yml', 'gh run list']);
var SHIP2 = SHIP1.concat(['mkdir -p .github/workflows', 'cp ~/templates/deploy.yml .github/workflows/deploy.yml', 'git add .', 'git commit -m "Add deploy workflow"', 'git push']);
GIT({ id: 'ship-3', t: 'ops', tier: 3, icon: '🌍', title: 'Ship it: go live', proj: ['ship', 3],
  git: { setup: SHIP2 },
  story: 'CI failed because the page has no `<title>`. Check the run, fix index.html (a complete version is in `~/templates/index.html`), commit, push, and watch it **deploy**. Then open the live site from the GitHub tab.',
  sol: ['gh run list', 'cp ~/templates/index.html index.html', 'git commit -am "Add a proper title"', 'git push'],
  goals: [['The latest CI run passed', "var r = gh.repos.portfolio.runs; return r.length && r[r.length-1].ok"], ['The site is deployed', "!!(gh.repos.portfolio.pages && /<title>/.test(gh.repos.portfolio.pages.html))"]],
  hints: ['Overwrite index.html with the template, then commit and push.'],
  learn: { h: 'Deployment', x: 'Push → CI passes → deploy. That is **continuous deployment**. Your site is now served at `noah.github.io/portfolio` (simulated here; the real GitHub Pages works exactly this way, and this game is hosted on it).\n\nBecause every deploy comes from a commit, you always know what is live, and you can roll back.', terms: ['deployment', 'ci-cd', 'github-pages'] } }, ['git push --force', 'cat index.html', 'git add index.html']);
var SHIP3 = SHIP2.concat(['cp ~/templates/index.html index.html', 'git commit -am "Add a proper title"', 'git push']);
GIT({ id: 'ship-4', t: 'ops', tier: 3, icon: '🧭', title: 'Ship it: the pro workflow', proj: ['ship', 4],
  git: { setup: SHIP3 },
  story: 'Now do it the way teams do: add an about page on a **branch**, push it, open a PR, and merge. Merging to main triggers CI and a fresh deploy.',
  sol: ['git switch -c about', 'echo "<title>About</title><h1>About Noah</h1>" > about.html', 'git add about.html', 'git commit -m "Add about page"', 'git push -u origin about', 'gh pr create --title "Add about page"', 'gh pr merge 1'],
  goals: [['The PR was merged', "gh.repos.portfolio.prs.some(function(p){return p.state==='MERGED';})"], ['The deployed main includes about.html', "var gr = gh.repos.portfolio; return gr.pages && 'about.html' in gr.commits[gr.pages.commit].tree"]],
  hints: ['branch → commit → push the branch → gh pr create → gh pr merge 1'],
  learn: { h: 'Branch → PR → CI → deploy', x: 'This loop is how most software ships: small branches, reviewed PRs, automated checks and automatic deploys. Nobody pushes straight to production.\n\n🚀 Your site is live in the simulation. See it in the 🏗️ Workshop.', terms: ['pull-request', 'ci-cd', 'deployment'] } }, ['git push origin main', 'gh pr list', 'gh run list']);
GIT({ id: 'o-env', t: 'ops', tier: 3, icon: '🔥', title: 'Incident: committed a secret',
  git: { setup: ['mkdir api', 'cd api', 'git init', '@file server.js const key = process.env.API_KEY;', '@file .env API_KEY=sk-live-999', 'git add .', 'git commit -m "Initial server"'] },
  story: 'You committed `.env` with a live key (not pushed yet, phew). Stop tracking it **without deleting your local file**, ignore it, and commit. (In real life, rotate the key too.)',
  sol: ['git rm --cached .env', 'echo ".env" > .gitignore', 'git add .gitignore', 'git commit -m "Stop tracking .env"'],
  goals: [['.env is no longer in the latest commit', "!('.env' in headTree(g))"], ['Your local .env still exists', "g.isFile('/home/noah/api/.env')"], ['.env is ignored', "g.ignored(repo, '.env')"]],
  hints: ['`git rm --cached` untracks a file but leaves it on disk.'],
  learn: { h: 'Untracking files', x: '`git rm --cached file` removes it from Git\'s tracking but keeps it on disk, while plain `rm` deletes it. Adding it to .gitignore prevents a repeat.\n\nThe key is still in the **first commit\'s** history. If it had been pushed, you would have to treat it as leaked: revoke and rotate it at the provider. Tools like git-filter-repo can scrub history, but rotating is what matters.', terms: ['gitignore', 'environment-variable', 'incident'] } }, ['rm .env', 'git rm .env', 'git status']);
GIT({ id: 'o-rollback', t: 'ops', tier: 3, icon: '🧯', title: 'Incident: bad deploy',
  git: { setup: TEMPLATES.concat(['@ghrepo shop', 'mkdir shop', 'cd shop', 'git init', 'mkdir -p .github/workflows', 'cp ~/templates/deploy.yml .github/workflows/deploy.yml', '@file index.html <title>Shop</title><h1>Shop</h1><button>Buy</button>', 'git add .', 'git commit -m "Shop v1"', 'git remote add origin https://github.com/noah/shop.git', 'git push -u origin main', '@file index.html <title>Shop</title><h1>Shop</h1><!-- TODO: buy button -->', 'git commit -am "Refactor header"', 'git push']) },
  story: '🔥 Customers report they cannot buy anything. The latest deploy removed the Buy button. Roll back production **fast** and safely. Find the bad commit, revert it and push so CI redeploys.',
  sol: ['git log --oneline', 'git revert HEAD', 'git push'],
  goals: [['Production has the Buy button again', "var p = gh.repos.shop.pages; return !!p && /<button>Buy/.test(p.html)"], ['History preserved', "nCommits(repo) === 3"]],
  hints: ['Revert, then push to trigger a redeploy.'],
  learn: { h: 'Roll back first, debug second', x: 'In an incident, **restore service first**, then investigate. Because every deploy is a commit, rolling back is just `git revert` plus a push. Afterwards, teams write a blameless **postmortem**: what happened, why, and what check would have caught it (here, a test that the Buy button exists).', terms: ['incident', 'revert', 'deployment'] } }, ['git reset --hard', 'gh run list', 'git push --force']);
