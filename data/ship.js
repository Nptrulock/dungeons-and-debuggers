U('ship', 1, 'sh-what', 'What Is Shipping?', '📦', ['deploy', 'hosting', 'release'], [
 ['mc', 'To "deploy" means…', ['Put your code on a server so real users can use it', 'Write code', 'Delete old code', 'Test locally'], 'Code on your laptop helps nobody. Deploying makes it live.'],
 ['mc', 'Hosting is…', ['A service that runs or serves your app on the internet', 'Throwing a party', 'A database', 'A code editor'], 'GitHub Pages, Vercel, Netlify and AWS are all hosting options.'],
 ['tf', 'This game is hosted for free on GitHub Pages as static files.', true, 'Static hosting just serves HTML/CSS/JS files.'],
 ['mc', '"Ship it" in developer slang means…', ['Release it to users', 'Mail a package', 'Delete it', 'Pause it'], 'Shipping is the moment value reaches users.'],
 ['mc', 'A domain name (like example.com) is…', ['A human-friendly name that points to a server\'s address', 'The server itself', 'A programming language', 'An email'], 'You rent domains from registrars and point them at your host.'],
 ['order', 'Order a simple release.', ['Finish and test the change', 'Merge to main', 'Deploy', 'Check the live site works'], 'Always check the live site after deploying. Something can differ from your computer.']
]);
U('ship', 2, 'sh-dns', 'Domains & DNS', '📇', ['dns', 'ip-address', 'ssl'], [
 ['mc', 'DNS is…', ['The internet\'s phone book: turns names into IP addresses', 'A coding language', 'A virus scanner', 'A hosting company'], 'Your browser asks DNS "where is example.com?" and gets back an IP address.'],
 ['mc', 'An IP address is…', ['A numeric address of a device on a network', 'Intellectual property', 'An email address', 'A port'], 'Like 93.184.216.34 (IPv4) or a longer IPv6 address.'],
 ['tf', 'DNS changes can take a while to spread around the internet.', true, 'Caches hold old answers until their TTL (time to live) expires.'],
 ['mc', 'An SSL/TLS certificate lets a site…', ['Use HTTPS so traffic is encrypted', 'Load faster', 'Rank first on Google', 'Avoid all hackers'], 'Free certificates from Let\'s Encrypt are common; many hosts add them automatically.'],
 ['match', 'Match the DNS record.', [['A record', 'Name → IPv4 address'], ['CNAME', 'Name → another name'], ['MX', 'Where email goes']], 'You mainly touch these when connecting a custom domain.']
]);
U('ship', 2, 'sh-build', 'Builds & Bundles', '🔨', ['build', 'bundler', 'minify'], [
 ['mc', 'A "build" step…', ['Transforms source code into optimized files ready to deploy', 'Writes code for you', 'Tests the UI by hand', 'Builds servers'], 'TypeScript → JavaScript, bundling, minifying, image optimization.'],
 ['mc', 'Minifying code means…', ['Removing spaces and shortening names to make files smaller', 'Deleting features', 'Making text smaller', 'Writing less code'], 'Smaller files load faster. Source maps let you debug the original.'],
 ['mc', 'A bundler (Vite, webpack) combines…', ['Many source files and packages into a few files for the browser', 'Servers', 'Databases', 'Git branches'], 'Fewer, optimized files load faster.'],
 ['tf', 'This game has no build step: the files you wrote are the files users get.', true, 'Simple projects can skip builds. Bigger apps usually need one.'],
 ['err', 'The deploy log says "Build failed: Cannot find module \'./Header\'". Most likely?', ['A wrong import path or file name (often capitalization)', 'The server is full', 'DNS is broken', 'Too many users'], 'Mac/Windows ignore case; Linux build servers do not. header.js ≠ Header.js.']
]);
U('ship', 3, 'sh-ci', 'CI/CD', '🔄', ['ci', 'cd', 'pipeline'], [
 ['mc', 'CI (continuous integration) means…', ['Automatically building and testing every change', 'Writing code continuously', 'Deploying on Fridays', 'Code inspection by managers'], 'Every push or PR runs the checks, so broken code is caught fast.'],
 ['mc', 'CD (continuous delivery/deployment) means…', ['Automatically getting tested changes out to environments or users', 'Burning CDs', 'Code documentation', 'Customer delight'], 'Merge → automatic deploy, with checks in between.'],
 ['mc', 'GitHub Actions is…', ['GitHub\'s tool for running automated workflows like tests and deploys', 'A social feature', 'A code editor', 'A database'], 'Workflows are YAML files in .github/workflows.'],
 ['order', 'Order a typical pipeline.', ['Push code', 'Install dependencies', 'Run lint and tests', 'Build', 'Deploy'], 'Each stage gates the next: no deploy if tests fail.'],
 ['tf', 'A red (failing) CI check on a PR should usually be fixed before merging.', true, 'Merging red builds trains everyone to ignore CI.'],
 ['mc', 'Why run tests in CI and not just locally?', ['CI runs the same way for everyone, every time, on a clean machine', 'It is faster', 'Local tests do not work', 'It is free'], 'It catches "works on my machine" problems.']
]);
U('ship', 3, 'sh-release', 'Safe Releases', '🪂', ['rollback', 'canary', 'versioning'], [
 ['mc', 'A rollback is…', ['Returning to the previous working version', 'A dance move', 'Deleting the database', 'Refactoring'], 'The fastest fix for a bad deploy is often to roll back, then investigate.'],
 ['mc', 'A canary release…', ['Sends a new version to a small % of users first', 'Releases on bird day', 'Deploys everything at once', 'Is a test environment'], 'If metrics look bad, only a few users were affected.'],
 ['mc', 'In semantic version 2.4.1, what does a change to 3.0.0 signal?', ['A breaking change', 'A small bug fix', 'A new feature that is backward compatible', 'Nothing'], 'MAJOR.MINOR.PATCH: major = breaking, minor = features, patch = fixes.'],
 ['tf', 'Deploying on Friday afternoon is risky because fewer people are around if it breaks.', true, 'Not a law, but a well-earned meme. Good automation and rollback make any day safer.'],
 ['mc', 'Release notes / changelogs exist to…', ['Tell users and teammates what changed', 'Store passwords', 'Replace tests', 'Hide bugs'], 'Clear notes reduce support questions.'],
 ['mc', 'A smoke test after deploy is…', ['A quick check that the most important things still work', 'Testing a fire alarm', 'A full test suite', 'A load test'], 'Can users log in? Does the home page load? Can they pay?']
]);
U('ship', 4, 'sh-ops', 'Running in Production', '🏭', ['uptime', 'monitoring', 'serverless', 'container'], [
 ['mc', 'Monitoring means…', ['Continuously watching health metrics and errors of a live system', 'Buying monitors', 'Reading code', 'Pair programming'], 'You want to know something is wrong before users tell you.'],
 ['mc', '99.9% uptime allows about how much downtime per year?', ['About 8.8 hours', 'About 5 minutes', 'About 3 days', 'Zero'], '0.1% of 8,760 hours ≈ 8.76 hours. Each extra 9 is ~10x harder.'],
 ['mc', 'A container (Docker) packages…', ['An app with everything it needs to run the same anywhere', 'Shipping boxes', 'Only data', 'Only images'], 'Containers end most "works on my machine" problems.'],
 ['mc', 'Serverless functions…', ['Run your code on demand without you managing servers', 'Use no computers at all', 'Are always free', 'Cannot access databases'], 'There are servers; you just do not manage them. Watch for cold starts and limits.'],
 ['tf', 'Autoscaling adds servers automatically when traffic rises.', true, 'And removes them when traffic falls, to save money.'],
 ['mc', 'Your cloud bill doubled overnight. First step?', ['Check billing breakdown for which service or key spiked', 'Ignore it', 'Delete everything', 'Change passwords only'], 'Spikes often mean a bug (infinite loop), abuse (leaked key) or a traffic surge.']
]);
U('ship', 5, 'sh-incident', 'Incident Response', '🚨', ['incident', 'on-call', 'runbook'], [
 ['order', 'Order incident response.', ['Detect and declare the incident', 'Mitigate: stop the bleeding (e.g. rollback)', 'Communicate status to users and team', 'Find and fix the root cause', 'Write a blameless postmortem'], 'Stop the damage first, keep people informed, then learn from it.'],
 ['mc', 'During an outage, the first priority is usually…', ['Restoring service, even before fully understanding the cause', 'Finding who caused it', 'Writing the postmortem', 'Refactoring'], 'Mitigate first, investigate after.'],
 ['mc', 'A runbook is…', ['Step-by-step instructions for handling known problems', 'A jogging app', 'A test file', 'A changelog'], 'At 3 AM, nobody should have to improvise.'],
 ['mc', 'On-call means…', ['Being the person responsible for responding to alerts during a period', 'Answering phones for sales', 'Being in meetings', 'Working from home'], 'Good teams keep alerts actionable so on-call is sustainable.'],
 ['tf', 'Status pages that honestly communicate outages build user trust.', true, 'Silence makes users assume the worst.']
]);
