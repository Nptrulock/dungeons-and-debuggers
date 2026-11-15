U('pro', 2, 'pr-tickets', 'Tickets & Tasks', '🎫', ['ticket', 'backlog', 'user-story'], [
 ['mc', 'A ticket (issue) is…', ['A written record of one piece of work: a bug, feature or task', 'A concert pass', 'An error message', 'A git commit'], 'Jira, Linear and GitHub Issues all track tickets.'],
 ['mc', 'Which ticket is best written?', ['"Checkout: Pay button stays disabled after valid card entry on Safari 17. Steps: ... Expected: enabled. Actual: disabled."', '"checkout broken"', '"fix pay"', '"urgent!!!"'], 'Title with area + problem, steps, expected vs. actual.'],
 ['mc', 'A user story follows the pattern…', ['As a [user], I want [goal], so that [reason]', 'If X then Y', 'Given When Then only', 'Title: Body'], 'It keeps the focus on who benefits and why.'],
 ['mc', 'The backlog is…', ['The ordered list of work not yet started', 'Old code', 'A server log', 'A list of complaints only'], 'Prioritizing the backlog is a key product skill.'],
 ['tf', 'A bug report should include steps to reproduce.', true, 'Without steps, the developer has to guess.'],
 ['match', 'Match the ticket field.', [['Priority', 'How urgent'], ['Assignee', 'Who is doing it'], ['Status', 'To do / in progress / done'], ['Labels', 'Categories like bug or feature']], 'Fields make work searchable and visible.']
]);
U('pro', 2, 'pr-review', 'Code Review Etiquette', '🧐', ['code-review', 'nit'], [
 ['mc', 'Code review is mainly for…', ['Catching problems and sharing knowledge before code merges', 'Judging people', 'Slowing work down', 'Counting lines'], 'Reviews improve code and spread understanding across the team.'],
 ['mc', 'Which review comment is best?', ['"This loops over users inside another loop; with 10k users it could be slow. Could we use a map?"', '"This is bad."', '"Why would you do this?"', '"Wrong."'], 'Explain the concern, the impact, and suggest a path. Critique code, not people.'],
 ['mc', 'A "nit:" prefix on a comment means…', ['A minor, optional suggestion', 'A blocking issue', 'A security bug', 'Approve immediately'], 'Labeling severity helps the author prioritize.'],
 ['mc', 'A good PR description includes…', ['What changed, why, how to test it, and screenshots if UI', 'Only the branch name', 'Nothing', 'A joke'], 'Help reviewers understand fast.'],
 ['tf', 'Smaller PRs get faster and better reviews.', true, 'A 50-line PR gets real attention; a 3,000-line PR gets "LGTM."'],
 ['mc', 'LGTM means…', ['Looks Good To Me', 'Let\'s Go To Market', 'Large Git Tree Merge', 'Log Generated Too Many'], 'Approval shorthand. Only say it if you actually reviewed it.'],
 ['mc', 'Your PR was mostly AI-generated. You should…', ['Review it yourself first and be able to explain every change', 'Let reviewers figure it out', 'Hide that AI helped', 'Skip tests'], 'You own the code you submit, whoever typed it.']
]);
U('pro', 3, 'pr-estimate', 'Estimates & Planning', '📅', ['estimate', 'scope-creep', 'mvp'], [
 ['mc', 'Why are software estimates often wrong?', ['Unknowns appear once work starts', 'Developers are lazy', 'Clocks are broken', 'They are always right'], 'Give ranges, and re-estimate as you learn.'],
 ['mc', 'Scope creep is…', ['Requirements growing during a project', 'A slow computer', 'Code getting shorter', 'A bug type'], 'Each "small addition" pushes the deadline. Say yes to one, no to another.'],
 ['mc', 'An MVP (minimum viable product) is…', ['The smallest version that delivers real value and lets you learn', 'The most valuable player', 'A finished product', 'A prototype nobody uses'], 'Ship small, learn, iterate.'],
 ['mc', 'Which estimate is most useful?', ['"2–4 days; the unknown is the payment API. I will know more by Tuesday."', '"Soon"', '"Exactly 3 hours 12 minutes"', '"No idea"'], 'A range, the risk, and when you will update.'],
 ['tf', 'Breaking a task into smaller pieces usually makes estimates more accurate.', true, 'Small tasks have fewer hidden surprises.'],
 ['mc', 'You realize mid-way the deadline will slip. Best move?', ['Tell the team early with the reason and options', 'Wait and hope', 'Work all night silently', 'Blame someone'], 'Early bad news is a gift; late bad news is a crisis.']
]);
U('pro', 3, 'pr-docs', 'Documentation', '📚', ['documentation', 'readme'], [
 ['mc', 'The most important doc for a new project is usually…', ['A README that explains what it is and how to run it', 'A 100-page spec', 'Release notes', 'An org chart'], 'If someone cannot run it in 10 minutes, the README needs work.'],
 ['mc', 'Good code comments mostly explain…', ['WHY something is done a certain way', 'What each line does, word for word', 'Who wrote it', 'Jokes'], '"// retry 3x because the vendor API drops connections" is gold.'],
 ['tf', 'Outdated documentation can be worse than no documentation.', true, 'Wrong docs actively mislead. Update docs with the code.'],
 ['mc', 'Documentation also helps AI tools because…', ['Agents read docs and rules files to follow your conventions', 'AI cannot read code', 'It is required by law', 'It does not'], 'Clear docs make both humans and agents faster.'],
 ['mc', 'API documentation should include…', ['Endpoints, inputs, outputs, errors and examples', 'Only the URL', 'Team photos', 'Nothing'], 'Examples are often the most-used part.']
]);
U('pro', 4, 'pr-product', 'Product Thinking', '🎯', ['product-thinking', 'user-feedback', 'metric'], [
 ['mc', 'Product thinking means…', ['Focusing on the user problem and outcome, not just the code', 'Selling products', 'Writing more code', 'Designing logos'], 'The best developers ask "what problem does this solve?"'],
 ['mc', 'A stakeholder requests a feature. Best first question?', ['What problem are you trying to solve?', 'When is it due?', 'What color?', 'Who approved it?'], 'Often a simpler solution exists once you know the real need.'],
 ['mc', 'How do you know if a shipped feature worked?', ['Measure a metric tied to its goal (e.g. signups, time saved)', 'It compiled', 'Nobody complained', 'The team liked it'], 'Define success before you build.'],
 ['tf', 'Talking to real users often reveals problems you would never guess.', true, 'Watch someone use your app once and you will find a dozen things.'],
 ['mc', 'A/B testing means…', ['Showing two versions to different users and comparing results', 'Testing letters A and B', 'Two developers testing', 'Alpha and beta releases'], 'Data beats opinions, when you have enough traffic.']
]);
U('pro', 4, 'pr-team', 'Working on a Team', '👥', ['standup', 'pair-programming'], [
 ['mc', 'A daily standup is for…', ['Quick sync: what you did, what is next, what is blocking you', 'A long status meeting', 'Exercise', 'Reviewing code'], 'Keep it short; take deep discussions offline.'],
 ['mc', 'You are blocked for a day. You should…', ['Say so early and ask for help', 'Stay quiet', 'Switch jobs', 'Wait until Friday'], 'Asking for help is a skill, not a weakness.'],
 ['mc', 'Pair programming means…', ['Two people working on the same code together, one driving', 'Writing code in pairs of files', 'Two monitors', 'Coding in teams of 10'], 'Great for hard problems and onboarding. Working with an AI is a kind of pairing too.'],
 ['tf', 'Disagreeing respectfully in code review is healthy.', true, 'Strong opinions, loosely held. Data and reasons settle debates.'],
 ['mc', 'A good way to ask a technical question is…', ['Share the goal, what you tried, the exact error, and your guess', '"It does not work, help"', 'DM 10 people at once', 'Post a blurry photo of your screen'], 'The same structure makes AI help better too.']
]);
U('pro', 5, 'pr-lead', 'Leading & Mentoring', '🧭', ['mentoring', 'tech-lead'], [
 ['mc', 'A tech lead\'s main job is…', ['Helping the team make good technical decisions and deliver', 'Writing all the code', 'Approving vacations', 'Fixing printers'], 'Leverage comes from multiplying others.'],
 ['mc', 'Good mentoring usually means…', ['Asking guiding questions so others build their own understanding', 'Doing their work for them', 'Criticizing publicly', 'Avoiding juniors'], 'The goal is that they can solve the next one alone.'],
 ['mc', 'When the team argues over two reasonable designs, a lead should…', ['Agree on criteria, decide, write it down, and move on', 'Let it run for weeks', 'Pick randomly without telling anyone', 'Build both fully'], 'A good-enough decision now beats a perfect one never.'],
 ['tf', 'Senior developers spend much of their time reading, reviewing, and communicating, not just coding.', true, 'Influence grows through clarity and judgment.'],
 ['mc', 'Introducing AI tools to a team works best when you…', ['Set shared guidelines for review, security and when to use them', 'Ban all review', 'Let everyone do whatever', 'Measure only lines of code'], 'Clear norms keep quality high while speed goes up.']
]);
