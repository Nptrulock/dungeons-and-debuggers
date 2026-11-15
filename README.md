# 🐉 Dungeons & Debuggers

An educational incremental RPG for learning to **think like a developer in the age of AI**. It starts at the very basics, like learning a language, and is meant to take weeks or months. Plain HTML/CSS/JS with no build step.

**Play:** https://nptrulock.github.io/dungeons-and-debuggers/

## v3: Mastery drills and Your Bot
- **🎯 Mastery (replaces Review).** Every concept you discover in Build spawns applied drills: just a terse tag ("Center it with flexbox", "Fix the off-by-one"), a small broken starting state, and no hints. Drills run in the same real sandboxes and are checked by tests. The explanation and solution appear only after a miss.
  - **92 drill generators** with procedural variants (HTML/CSS 18, JS + APIs + debugging + security 30, Python + SQL 24, Git 9, AI-assistant 6, compiled C++/Rust/TypeScript 5). `tools/verify.html` checks that every generated variant's starting state fails and its reference solution passes.
  - **Slams:** 6 or 10 interleaved drills, with a 🔥 combo multiplier and a ⚡ speed bonus against a per-sandbox par time.
  - **Spacing per concept:** Leitner boxes with intervals of 10 min, 20 h, 3 d, 7 d and 16 d. A miss halves the box. Mastery % is shown for each concept.
  - **Levels:** 🌱 Learned → 🛠️ Practiced (2 unaided, 2 variants) → ⚡ Fluent (box 4, 2 days, 4 variants) → 👑 Mastered (box 6, 3 days, 6 variants, 3 in a row). Level-ups pay 💠 Insight and roll relics (⏱️ Metronome from slams, ⚙️ Gear from Fluent).
  - **Bosses:** the build phase, then an 8-drill mastery exam (6 unaided to win). The boss opens at 70% of the tier's builds plus 50% of its concepts Practiced.
  - The old quiz lessons remain as optional **📚 Theory** pages.
- **🤖 Your Bot (replaces the work desk).** An automation bot works tasks for coins, online and at a reduced rate offline. Task types grow by tier: sort the inbox, the daily report, bug triage, answering from docs, deploys.
  - You improve it through **27 hands-on modules** in real sandboxes:
    - Code: parse, route, tool/API call, retry with backoff, structured logging.
    - Triggers: cron, webhooks, queue + workers, rate limits.
    - Tools: function-calling schema, env secrets, least privilege.
    - Train: system prompt, few-shot, eval set with precision/recall, fixing failures, RAG, context window, temperature, train/test split, overfitting, confusion matrix.
    - Ops: tests, monitoring, human-in-the-loop, prompt-injection guardrail, cost per task.
  - Modules unlock when the concepts they use are Practiced.
  - The bot page shows an animated avatar and a live pipeline (trigger → parse → decide → tool → verify → done, with the failing stage in red). It also shows measured stats: success, tasks/hr, cost/task, uptime and error types. Accuracy appears only once you build an eval set, a confusion matrix once you build one, and an error log once you add logging.
  - The model itself is simulated. The module code really runs, and its effect on the stats is modeled on what that technique does.

## v2: learn by building (🔨 Build tab)
The main loop is now **198 hands-on challenges**. You change real code, run it, see the result live, and then a **"What you discovered"** card explains what you just found and unlocks glossary terms. Quizzes are still there as 📚 Review (spaced repetition) and boss exams.

- **Sandboxes** (all phone-friendly: tap highlighted code chips to swap pieces, drag sliders with ± buttons, or ✏️ type freely):
  - 🧱 **HTML/CSS:** a live iframe preview that updates as you change things.
  - ⚡ **JavaScript:** console, page and canvas output, checked by tests. Includes a loop guard and a mock HTTP server for API work.
  - 🐍 **Python:** real CPython via Pyodide, loaded lazily in a Web Worker, with turtle graphics, scripted `input()` and a line-by-line stepper.
  - 🗄️ **SQL:** real SQLite via sql.js, with result tables and "Peek at the tables".
  - 🌿 **Terminal & Git:** a simulated shell, Git and GitHub with a live commit graph, a file status view, PRs, Actions CI and Pages deploys.
  - ⚙️ **Compiler:** C++, Java, Rust, Go, TypeScript, Bash and Python. Every output (errors included) was **recorded from the real toolchains** for every choice combination by `tools/build-compiled.js`. Adds a stack/heap memory visualizer with pointer arrows and same-idea-in-other-languages comparisons.
  - 🤖 **AI assistant:** build a prompt from parts. The (pre-written) assistant replies with code that is **really run against tests**. Covers hallucinations, context, edge cases, reward hacking, XSS, agents and prompt injection.
  - 🐞 **Debugging:** real error messages, stack traces mapped to your lines, and a breakpoint stepper.
- **Hints ladder:** 💡 nudge (free) → 🔦 bigger hint (−25% XP) → 🗝️ solution (−60% XP, no relic). 🧪 Experiment zones reward every distinct thing you try.
- **Projects** (results persist and replay in the 🏗️ Workshop): Personal Website (6 steps), To-Do App (5), Weather App (5), Python Text Adventure (5), Bookstore Database (5), Canvas Mini-Game (4), Ship It: deploy with CI (4).
- **Bosses:** one per tier, built under constraints or run as live incidents (limited runs or commands), followed by the quiz boss exam.
- Challenge files: `challenges/*.js`. Format: `challenges/core.js`.

## Core loop (quiz and idle systems)
- **Learn (active):** short quiz lessons in 11 formats:
  - multiple choice
  - predict the output
  - choose the better AI prompt
  - review an AI diff
  - pick the git command
  - triage the error
  - true/false
  - put in order
  - fill in the blank
  - match pairs
  - spot the buggy line
- **Explanations:** every answer comes with a plain-words explanation.
- **Spaced repetition:** each question moves through 6 Leitner boxes (10 min → 1 day → 3 days → 7 days → 16 days). A miss sends it back to box 1, and missed questions come back at the end of the lesson.
- **Levels come only from answering.**
- **Idle (passive):** see 🤖 Your Bot above. Offline it runs at 25% speed, capped at 4h, and both can be upgraded.
- **Progression:**
  - Career ranks: Intern → Junior → Developer → Senior → Staff Architect → AI-Native Lead.
  - 5 tiers: Very Basic → Beginner → Intermediate → Advanced → Expert. Each is gated by a boss exam: 20 mixed questions, 16 hits before 4 misses. The boss opens once every unit in the tier is learned and the tier is at 55% mastery.
  - 💠 Insight from answers buys permanent Mastery boosts. None of them skip learning.
  - Coins buy Office gear.
  - Daily goal, streak, freezes, and daily deeds.
- **Collection:**
  - 12 visible ultra-rare relics with exact odds.
  - Shiny questions.
  - 39 achievements.
  - A 260-term glossary that fills in as you learn.

## Content
`data/*.js` holds 645 handcrafted questions in 93 units across 10 tracks:
- Thinking Like a Developer
- Code Reading (JS + Python)
- The Web
- Tools & Workflow
- Data
- Debugging & Testing
- Working with AI
- Shipping
- Architecture
- Professional Practice

To add content, append `U(track, tier, id, name, icon, terms, [questions])` blocks. The format is documented in `data/core.js`.

## Checks
- `python3 tools/dd_verify.py <sandboxes|ids|t:track>` (needs `python3 -m http.server 8765` running in the repo): runs every challenge headless and checks that the starting code **fails** and the reference solution **passes**. All 198 pass.
- `node tools/simprog.js`: simulates unlock and tier rules to prove progression never deadlocks.
- `node tools/build-compiled.js`: re-records compiler outputs (needs clang/zig, JDK 21, rustc, go, tsc, node, bash, python3).
- `python3 tools/dd_verify_drills.py N [ids]`: generates N variants of every drill generator and checks start fails / solution passes.
- `python3 tools/dd_e2e3.py`: v3 end-to-end (slam with a miss, concept to Practiced, bot module changes stats, pipeline, mastery boss exam, v2→v3 migration, phone + desktop).
- `python3 tools/dd_e2e.py`: end-to-end phone (390×844) and desktop test. `tools/dd_offline.py` checks the offline fallback.
- `node validate.js`: integrity of the question bank (answer indexes, blanks, pairs, explanations, glossary links, duplicates).
- `node runsnips.js`: runs every JavaScript and Python "predict the output" snippet and prints the real output next to the keyed answer.
