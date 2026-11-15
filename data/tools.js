U('tools', 1, 'tl-files', 'Files & Folders', '📁', ['file', 'folder', 'path', 'extension'], [
 ['mc', 'A file path like /projects/app/index.html tells you…', ['Where the file is, folder by folder', 'The file size', 'Who made the file', 'When it was edited'], 'Paths are directions through folders. Code uses them constantly.'],
 ['match', 'Match the extension to the file type.', [['.js', 'JavaScript'], ['.py', 'Python'], ['.html', 'Web page'], ['.json', 'Data']], 'Extensions tell tools what kind of file it is.'],
 ['mc', 'A project folder usually holds…', ['All the code, config and assets for one app', 'Only one file', 'Only images', 'Your photos'], 'Developers keep each project in its own folder, called the project root.'],
 ['mc', 'In a path, ".." means…', ['The parent folder (one level up)', 'The current folder', 'Hidden file', 'Delete'], '. is the current folder; .. is the folder above it.'],
 ['tf', 'Files starting with a dot (like .env or .gitignore) are often hidden by default.', true, 'Dotfiles are usually configuration. You may need to "show hidden files" to see them.'],
 ['mc', 'What is README.md usually for?', ['Explaining what the project is and how to run it', 'Storing passwords', 'The main code', 'Images'], 'The README is the front door of a project. .md means Markdown, a simple formatting language.'],
 ['mc', 'Why do developers avoid spaces in file names?', ['Many tools and terminals need extra quoting for spaces, causing errors', 'Spaces cost money', 'Computers ban spaces', 'It is just fashion'], 'Use my-file.js or my_file.js instead of my file.js.']
]);
U('tools', 1, 'tl-terminal', 'Terminal Basics', '⌨️', ['terminal', 'command', 'cli'], [
 ['mc', 'The terminal (command line) is…', ['A text window where you type commands to the computer', 'A video game', 'A web browser', 'A type of file'], 'Developers use it to run code, install tools and use git. AI coding agents use it too.'],
 ['match', 'Match the command to what it does.', [['ls', 'List files'], ['cd', 'Change folder'], ['mkdir', 'Make a folder'], ['pwd', 'Show current folder']], 'These four let you move around. (On Windows, dir replaces ls.)'],
 ['mc', 'What does "cd projects" do?', ['Moves into the projects folder', 'Deletes projects', 'Creates projects', 'Copies projects'], 'cd = change directory. "Directory" is another word for folder.'],
 ['mc', 'Which command is DANGEROUS if you are not sure?', ['rm -rf folder', 'ls', 'pwd', 'cd ..'], 'rm deletes, -r means recursive (everything inside), -f means no confirmation. There is no recycle bin.'],
 ['mc', 'CLI stands for…', ['Command Line Interface', 'Computer Language Input', 'Code Library Index', 'Cloud Login ID'], 'Many tools (git, npm, gh) are CLIs: you use them by typing commands.'],
 ['tf', 'An AI coding agent that can run terminal commands can also delete files.', true, 'That is why agents ask permission for risky commands, and why you should read what they plan to run.'],
 ['mc', 'Pressing the Up arrow in a terminal usually…', ['Shows your previous command', 'Scrolls the screen', 'Deletes a line', 'Exits'], 'Command history saves lots of retyping.'],
 ['mc', 'Ctrl + C in a terminal usually…', ['Stops the running command', 'Copies text always', 'Closes the computer', 'Clears files'], 'Use it to stop a stuck program or a running server.']
]);
U('tools', 2, 'tl-git1', 'Git: Saving History', '🌱', ['git', 'repository', 'commit', 'staging'], [
 ['mc', 'Git is…', ['A version control tool that records the history of your code', 'A website', 'A programming language', 'A cloud server'], 'Git lets you save snapshots, go back in time, and work with others safely.'],
 ['mc', 'A repository (repo) is…', ['A project folder whose history git tracks', 'A storage closet', 'A backup drive', 'A database'], 'GitHub hosts repos online so teams can share them.'],
 ['mc', 'A commit is…', ['A saved snapshot of changes with a message', 'An upload to the internet', 'A promise to finish', 'A bug'], 'Commits are save points. Each one has a message explaining the change.'],
 ['order', 'Order the basic git save flow.', ['Edit files', 'git add (stage the changes)', 'git commit -m "message"', 'git push (send to GitHub)'], 'Stage what you want, commit it locally, then push to share.'],
 ['git', 'You want to see which files you changed. Which command?', ['git status', 'git push', 'git clone', 'git delete'], 'git status is the "where am I?" command. Run it often.'],
 ['git', 'You want a copy of a GitHub repo on your computer. Which command?', ['git clone <url>', 'git commit', 'git status', 'git init'], 'clone downloads the repo with its full history.'],
 ['mc', 'Which commit message is best?', ['Fix crash when cart is empty', 'stuff', 'asdf', 'changes'], 'Good messages say what changed and why, so future-you can find it.'],
 ['tf', 'git commit sends your code to GitHub.', false, 'Commit saves locally. git push sends commits to the remote (like GitHub).'],
 ['git', 'Which command starts tracking a brand-new folder with git?', ['git init', 'git clone', 'git pull', 'git start'], 'git init creates a new empty repository in the current folder.']
]);
U('tools', 2, 'tl-git2', 'Git: Branches & PRs', '🌿', ['branch', 'merge', 'pull-request', 'merge-conflict'], [
 ['mc', 'A branch is…', ['A separate line of work so changes do not affect main until ready', 'A copy of GitHub', 'A deleted commit', 'A server'], 'Branches let you try things safely. main stays stable.'],
 ['git', 'Create and switch to a new branch called login-page.', ['git checkout -b login-page', 'git commit login-page', 'git push login-page', 'git merge login-page'], 'checkout -b (or git switch -c) creates and switches in one step.'],
 ['mc', 'A pull request (PR) is…', ['A request to merge your branch, where others review it first', 'Downloading code', 'A bug report', 'Deleting a branch'], 'PRs are where code review happens on GitHub.'],
 ['mc', 'Merging means…', ['Combining changes from one branch into another', 'Deleting duplicates', 'Starting over', 'Renaming files'], 'When a PR is approved, it is merged into main.'],
 ['mc', 'A merge conflict happens when…', ['Two branches changed the same lines differently', 'GitHub is down', 'You typed the wrong password', 'Files are too large'], 'Git cannot guess which version to keep, so a human (or AI with your review) decides.'],
 ['git', 'Get the latest changes from GitHub into your current branch.', ['git pull', 'git push', 'git add', 'git log'], 'pull = fetch + merge. Do it before starting new work.'],
 ['order', 'Order a typical feature workflow.', ['Pull latest main', 'Create a branch', 'Commit your changes', 'Push the branch and open a PR', 'Get review and merge'], 'This is the daily rhythm on most software teams.'],
 ['mc', 'What do these markers in a file mean?', ['A merge conflict: pick or combine the two versions, then remove the markers', 'A comment', 'A syntax style', 'Encrypted text'], 'Between <<<<<<< and ======= is your version; between ======= and >>>>>>> is theirs.', '<<<<<<< HEAD\nconst color = "red"\n=======\nconst color = "blue"\n>>>>>>> feature'],
 ['git', 'See the history of commits.', ['git log', 'git status', 'git diff', 'git branch -d'], 'git log lists commits, newest first.']
]);
U('tools', 2, 'tl-pkg', 'Packages & Dependencies', '📦', ['package', 'dependency', 'npm', 'package-json'], [
 ['mc', 'A package (library) is…', ['Reusable code someone else wrote that you install', 'A zip file of photos', 'A delivery', 'A database'], 'Instead of writing everything, developers install packages like a date formatter.'],
 ['match', 'Match the package manager to its language.', [['npm', 'JavaScript'], ['pip', 'Python'], ['brew', 'macOS tools']], 'Package managers download and track the libraries a project needs.'],
 ['mc', 'package.json lists…', ['The project\'s dependencies and scripts', 'All user passwords', 'Only images', 'The HTML'], 'Anyone can run npm install to get the same dependencies.'],
 ['mc', 'Why is node_modules usually NOT committed to git?', ['It is huge and can be rebuilt with npm install', 'It is secret', 'It is always broken', 'Git cannot store folders'], 'It is listed in .gitignore. The lockfile records exact versions instead.'],
 ['mc', 'A lockfile (package-lock.json) exists to…', ['Pin exact versions so every install is identical', 'Lock the computer', 'Encrypt the code', 'Stop edits'], 'Without it, two installs a month apart could get different versions and different bugs.'],
 ['tf', 'AI tools sometimes suggest packages that do not exist, which attackers can register.', true, 'Hallucinated package names are a real attack vector ("slopsquatting"). Check a package exists and is reputable before installing.'],
 ['mc', 'npm run dev usually…', ['Runs the "dev" script defined in package.json, often a local server', 'Deletes the project', 'Deploys to production', 'Installs Node'], 'Scripts are named shortcuts for common commands.']
]);
U('tools', 3, 'tl-env', 'Environments & Secrets', '🔐', ['environment', 'env-var', 'secret', 'gitignore'], [
 ['match', 'Match the environment.', [['Local / dev', 'Your own computer'], ['Staging', 'Production-like test copy'], ['Production', 'The real app users use']], 'Changes move dev → staging → production to catch problems before users do.'],
 ['mc', 'An environment variable is…', ['A setting provided from outside the code, like a database URL or API key', 'A variable about the weather', 'A CSS value', 'A global JavaScript variable'], 'The same code can use different values in dev and production.'],
 ['mc', 'A .env file typically holds…', ['Local secrets and settings, and it should be in .gitignore', 'The main app code', 'Public documentation', 'Images'], 'Never commit .env. Leaked keys on GitHub get found by bots within minutes.'],
 ['mc', 'You accidentally pushed an API key to a public repo. First step?', ['Revoke/rotate the key immediately', 'Delete the commit and hope', 'Make the repo private and do nothing else', 'Wait and see'], 'Assume it is already stolen. Rotate the key, then clean up history.'],
 ['mc', '.gitignore is…', ['A list of files git should not track', 'A list of ignored bugs', 'A git error', 'A private branch'], 'Typical entries: node_modules, .env, build output, OS junk files.'],
 ['tf', 'It is fine to paste production secrets into an AI chat as long as you delete the chat later.', false, 'Treat secrets as something you never paste anywhere they could be stored or logged. Use placeholders.'],
 ['mc', 'Which is the safest way to give a deployed app its database password?', ['Set it as an environment variable/secret in the hosting platform', 'Hard-code it in the JavaScript', 'Put it in the README', 'Email it to the team'], 'Hosting platforms have secret stores for exactly this.']
]);
U('tools', 3, 'tl-editor', 'Editors & AI IDEs', '📝', ['ide', 'linter', 'formatter'], [
 ['mc', 'An IDE / code editor (VS Code, Cursor) is…', ['An app for writing code with helpers like autocomplete and search', 'A server', 'A database', 'A web browser'], 'Modern editors integrate AI, terminals, git and debugging.'],
 ['mc', 'A linter…', ['Flags likely mistakes and style problems in code', 'Removes lint from keyboards', 'Compiles code', 'Hosts websites'], 'ESLint (JavaScript) and Ruff (Python) catch bugs before you run code.'],
 ['mc', 'A formatter (like Prettier)…', ['Automatically makes code style consistent', 'Formats your hard drive', 'Writes tests', 'Translates languages'], 'Formatters end arguments about spacing and keep diffs clean.'],
 ['mc', 'Search-across-files is useful because…', ['You can find every place a function or name is used before changing it', 'It makes code faster', 'It deletes duplicates', 'It is required by git'], 'Before renaming or deleting, find all usages.'],
 ['tf', 'In an AI editor, giving the AI the relevant files as context usually improves its answers.', true, 'AI can only use what it can see. Pointing it at the right files is a key skill.'],
 ['mc', 'Version control + small commits make AI-assisted coding safer because…', ['You can easily review and undo what the AI changed', 'The AI writes better code', 'Git blocks bad code', 'It hides bugs'], 'Commit before letting an agent loose; review the diff after.']
]);
U('tools', 4, 'tl-git3', 'Git Power Tools', '🧙', ['rebase', 'revert', 'diff'], [
 ['git', 'Undo a commit that is already on shared main, safely.', ['git revert <commit>', 'git reset --hard and force push', 'Delete the repo', 'git commit --amend'], 'revert creates a new commit that reverses the old one, without rewriting shared history.'],
 ['git', 'See exactly what changed in your files (not yet staged).', ['git diff', 'git log', 'git status', 'git show-branch'], 'git diff shows line-by-line changes: - removed, + added.'],
 ['mc', 'Why is force-pushing to a shared branch dangerous?', ['It can overwrite teammates\' commits', 'It is slow', 'It deletes the internet', 'It is not dangerous'], 'Force push rewrites remote history. Avoid it on branches others use.'],
 ['mc', 'git rebase main (on your feature branch)…', ['Replays your commits on top of the latest main', 'Deletes main', 'Merges two repos', 'Undoes all commits'], 'Rebasing makes history linear, but rewrites your branch\'s commits.'],
 ['git', 'Temporarily set aside uncommitted changes to switch branches.', ['git stash', 'git drop', 'git hide', 'git pause'], 'git stash pop brings them back.'],
 ['mc', 'git blame shows…', ['Which commit last changed each line', 'Who caused a bug, officially', 'Failing tests', 'Deleted files'], 'Despite the name, it is for finding context: why did this line change?']
]);
U('tools', 5, 'tl-monorepo', 'Scaling the Workflow', '🏗️', ['monorepo', 'code-owner', 'feature-flag'], [
 ['mc', 'A monorepo is…', ['One repository holding many projects or services', 'A repo with one file', 'A private repo', 'A broken repo'], 'Big companies often use monorepos to share code and tooling.'],
 ['mc', 'A feature flag lets you…', ['Turn a feature on or off without redeploying', 'Mark a bug', 'Delete a feature', 'Flag spam'], 'Ship code dark, turn it on for 1% of users, then everyone.'],
 ['mc', 'CODEOWNERS files…', ['Auto-request review from the team that owns those files', 'List copyright holders', 'Block all changes', 'Store passwords'], 'They route reviews to the right experts.'],
 ['tf', 'Trunk-based development means merging small changes to main frequently.', true, 'Small, frequent merges reduce painful conflicts. Feature flags hide unfinished work.'],
 ['mc', 'Why do teams require passing checks before merging?', ['To stop broken code from reaching main automatically', 'To slow developers down', 'Git requires it', 'For billing'], 'Branch protection with required CI keeps main always shippable.']
]);
