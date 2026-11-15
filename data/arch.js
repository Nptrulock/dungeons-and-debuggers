U('arch', 2, 'ar-layers', 'The Layers of an App', '🍰', ['architecture', 'frontend', 'backend'], [
 ['order', 'Order the layers from user to data.', ['User interface (frontend)', 'API', 'Business logic (backend)', 'Database'], 'Requests flow down the layers and responses flow back up.'],
 ['mc', 'Software architecture is…', ['The big-picture structure: the parts of a system and how they connect', 'Building design software', 'The fonts used', 'The office layout'], 'Architecture decisions are the expensive-to-change ones.'],
 ['mc', 'Business logic is…', ['The rules specific to your product, like "orders over $50 ship free"', 'Accounting software', 'CSS', 'The login page'], 'Keep it in one place, not scattered across UI code.'],
 ['tf', 'Separating UI, logic and data makes each easier to change.', true, 'This is "separation of concerns."'],
 ['mc', 'Why put pricing rules on the server instead of the browser?', ['Browser code can be changed by users; the server is the source of truth', 'Browsers cannot do math', 'It is prettier', 'No reason'], 'Never trust the client for anything that matters (prices, permissions).']
]);
U('arch', 3, 'ar-state', 'State & Data Flow', '🌊', ['state', 'source-of-truth', 'cache'], [
 ['mc', 'A "single source of truth" means…', ['Each piece of data has one authoritative place it lives', 'Only one developer', 'One server', 'One file'], 'Two copies of the same data will eventually disagree.'],
 ['mc', 'A cart count shows 3 in the header but 2 on the cart page. Likely cause?', ['Two separate copies of the cart state that got out of sync', 'Math is broken', 'The CSS is wrong', 'Users added wrong'], 'Derive both displays from the same state.'],
 ['mc', 'Derived state is…', ['Values calculated from other state, like total from cart items', 'Stolen state', 'State from the database only', 'Old state'], 'Calculate it rather than storing it separately, so it cannot drift.'],
 ['tf', 'Storing the cart total AND the items separately, both editable, invites bugs.', true, 'Store the items; compute the total.'],
 ['mc', 'Optimistic UI means…', ['Updating the screen immediately, then confirming with the server (and undoing if it fails)', 'Hoping there are no bugs', 'Happy colors', 'Skipping the server'], 'Feels instant; needs rollback for failures.'],
 ['mc', 'Where should a logged-in user\'s session ultimately be validated?', ['On the server for each request', 'In localStorage only', 'In CSS', 'In the URL'], 'The client holds a token; the server decides whether it is valid.']
]);
U('arch', 3, 'ar-auth', 'Authentication & Authorization', '🔑', ['authentication', 'authorization', 'oauth', 'session'], [
 ['match', 'Match the term.', [['Authentication', 'Who are you?'], ['Authorization', 'What are you allowed to do?']], 'AuthN proves identity; AuthZ checks permissions. Both are needed.'],
 ['mc', '"Sign in with Google" typically uses…', ['OAuth / OpenID Connect', 'FTP', 'SQL', 'CSS'], 'You never give the app your Google password; Google vouches for you.'],
 ['mc', 'Why should you avoid building your own password system from scratch?', ['It is easy to get subtly wrong in insecure ways; proven libraries/services exist', 'Passwords are illegal', 'It is too fast', 'Browsers block it'], 'Hashing, resets, rate limiting, 2FA... use well-tested tools (e.g. Auth0, Clerk, Supabase Auth).'],
 ['diff', 'What is the authorization bug?', ['Any logged-in user can delete ANY post, not just their own', 'Missing semicolon', 'Wrong status code', 'Nothing'], 'Check ownership: post.authorId === req.user.id (or admin) before deleting.', 'app.delete("/posts/:id", requireLogin, async (req, res) => {\n  await db.posts.delete(req.params.id)\n  res.sendStatus(204)\n})'],
 ['mc', 'Two-factor authentication (2FA) adds…', ['A second proof, like a code from your phone', 'A second password field', 'Two accounts', 'Double encryption'], 'Even if a password leaks, the attacker usually lacks the second factor.'],
 ['tf', 'Hiding the Delete button in the UI is enough to stop users from deleting others\' data.', false, 'Users can call the API directly. Enforce permissions on the server.']
]);
U('arch', 4, 'ar-scale', 'Scaling & Performance', '📶', ['scalability', 'load-balancer', 'queue', 'bottleneck'], [
 ['mc', 'Scalability is…', ['How well a system handles growing load', 'The size of the logo', 'Code length', 'Team size'], 'An app for 10 users and one for 10 million need different designs.'],
 ['mc', 'A load balancer…', ['Spreads incoming requests across multiple servers', 'Weighs servers', 'Balances the budget', 'Compresses files'], 'It also routes around unhealthy servers.'],
 ['mc', 'A message queue is useful for…', ['Doing slow work (emails, video processing) in the background', 'Waiting in line at the bank', 'Storing passwords', 'CSS animations'], 'The user gets a fast response; workers handle the job later.'],
 ['mc', 'Before optimizing a slow page, you should first…', ['Measure to find the actual bottleneck', 'Rewrite it in a faster language', 'Buy bigger servers', 'Add caching everywhere'], 'Guessing at performance problems is usually wrong.'],
 ['match', 'Match the scaling approach.', [['Vertical scaling', 'Bigger machine'], ['Horizontal scaling', 'More machines'], ['Caching', 'Avoid repeating work']], 'Horizontal scales further but needs stateless servers.'],
 ['tf', 'Most apps do not need to be designed for millions of users on day one.', true, 'Design for the next order of magnitude, not the dream.'],
 ['mc', 'Rate limiting protects a system by…', ['Capping how many requests a client can make in a time window', 'Slowing all users always', 'Encrypting data', 'Limiting features'], 'It stops abuse and runaway clients.']
]);
U('arch', 4, 'ar-patterns', 'Design Principles', '📐', ['dry', 'coupling', 'separation-of-concerns', 'interface'], [
 ['mc', 'DRY stands for…', ['Don\'t Repeat Yourself', 'Do Run Yesterday', 'Data Ready Yet', 'Deploy Right Yearly'], 'Each piece of knowledge should live in one place. But do not over-abstract code that only looks similar.'],
 ['mc', 'Tight coupling means…', ['Parts depend heavily on each other\'s internals, so changing one breaks others', 'Parts are well organized', 'Code is short', 'Two developers pair'], 'Loose coupling + clear interfaces = parts can change independently.'],
 ['mc', 'An interface (contract) between modules defines…', ['What one part offers and expects, without exposing internals', 'The screen layout', 'Network cables', 'Git branches'], 'Stable contracts let teams work in parallel.'],
 ['mc', 'KISS means…', ['Keep It Simple: prefer the simplest design that works', 'Kill Inactive Server Sessions', 'Keep It Super Secure', 'A rock band'], 'Complexity is a cost you pay forever.'],
 ['tf', 'A "God object" that knows and does everything is a sign of good design.', false, 'It becomes a bottleneck for every change. Split responsibilities.'],
 ['mc', 'Dependency injection is mainly used to…', ['Pass in dependencies (like a database client) so they can be swapped, e.g. for tests', 'Inject code into websites', 'Install packages', 'Speed up loops'], 'Makes code testable and flexible.']
]);
U('arch', 4, 'ar-security', 'Secure by Design', '🏰', ['threat-model', 'encryption', 'input-validation'], [
 ['mc', 'Threat modeling asks…', ['What could go wrong, who might attack, and what would it cost?', 'Which theme is scariest?', 'How fast is the server?', 'Who is on vacation?'], 'Think like an attacker before they do.'],
 ['mc', 'Input validation means…', ['Checking that incoming data is the expected shape and range before using it', 'Making inputs pretty', 'Auto-filling forms', 'Spell-check'], 'Validate on the server; client validation is just for UX.'],
 ['match', 'Match the encryption term.', [['In transit', 'While moving over a network (HTTPS)'], ['At rest', 'While stored on disk'], ['Hashing', 'One-way scramble for passwords']], 'Encryption can be reversed with a key; hashing is designed not to be.'],
 ['tf', 'Security through obscurity (hiding how it works) is enough on its own.', false, 'Assume attackers will learn how it works. Real security holds anyway.'],
 ['mc', 'The safest default for a new API endpoint is…', ['Deny access unless explicitly allowed', 'Allow everyone', 'Allow admins only forever', 'No auth until launch'], '"Secure by default": opt in to access, not out.'],
 ['mc', 'Defense in depth means…', ['Several layers of protection so one failure is not fatal', 'Very deep code', 'A big firewall only', 'Hiding servers underground'], 'Auth + validation + least privilege + monitoring.']
]);
U('arch', 5, 'ar-systems', 'Distributed Systems', '🌍', ['microservices', 'idempotency', 'eventual-consistency'], [
 ['mc', 'Microservices split an app into…', ['Small services that deploy independently and talk over the network', 'Tiny files', 'Many databases in one file', 'Mini apps on phones'], 'Gains: independent teams. Costs: network failures, harder debugging.'],
 ['mc', 'For a small team\'s new product, a common recommendation is…', ['Start with a well-structured monolith; split later if needed', 'Start with 30 microservices', 'No backend', 'One file only'], 'Distributed systems add a lot of complexity before they add value.'],
 ['mc', 'An idempotent operation…', ['Has the same effect whether it runs once or many times', 'Never runs', 'Is very fast', 'Is random'], 'Critical for payments: a retried "charge order 812" must not charge twice. Idempotency keys enable this.'],
 ['mc', 'Eventual consistency means…', ['Copies of data may differ briefly but will converge', 'Data is always wrong', 'Data is instantly identical everywhere', 'Data eventually disappears'], 'A new post might take a second to show up for everyone.'],
 ['tf', 'In distributed systems, you must assume the network can fail.', true, 'Timeouts, retries with backoff, and idempotency are standard tools.'],
 ['mc', 'An ADR (architecture decision record) captures…', ['A decision, its context and its tradeoffs, so future people know why', 'Daily logs', 'Bug lists', 'Salaries'], 'Future teams (and AI agents) can read why things are the way they are.']
]);
U('arch', 5, 'ar-aiarch', 'Architecting AI Features', '🧠', ['rag', 'guardrails', 'evals'], [
 ['mc', 'Why should LLM calls usually happen on your backend, not the browser?', ['To keep API keys secret and enforce limits, logging and safety checks', 'Browsers cannot send text', 'It is cheaper always', 'No reason'], 'The backend is where secrets and policies live.'],
 ['mc', 'A chatbot must answer from your company\'s docs. A strong design is…', ['RAG: search the docs, put the best passages in the prompt, cite sources', 'Hope the model memorized them', 'Fine-tune daily', 'Paste all docs every time'], 'RAG keeps answers grounded and up to date.'],
 ['mc', 'An AI feature sometimes gives harmful output. Architecture-level fix?', ['Add input/output guardrails and evals that catch regressions', 'Increase temperature', 'Remove logging', 'Ask users to be nice'], 'Defense in depth applies to AI features too.'],
 ['mc', 'LLM outputs that feed other code should be…', ['Validated against a schema (e.g. JSON with required fields)', 'Trusted blindly', 'Rendered as HTML', 'Executed as code directly'], 'Treat model output like untrusted user input.'],
 ['tf', 'Caching identical LLM requests can cut cost and latency.', true, 'Same input, same answer, no new call (when freshness allows).'],
 ['mc', 'Giving an agent a tool that can run arbitrary SQL in production is…', ['Very risky; prefer narrow, purpose-built tools with limits', 'Best practice', 'Required for agents', 'Harmless'], 'Narrow tools = small blast radius.']
]);
