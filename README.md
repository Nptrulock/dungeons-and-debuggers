# 🐉 Dungeons & Debuggers

An educational incremental RPG for learning to **think like a developer in the age of AI**. It starts at the very basics, like learning a language, and is meant to take weeks or months. Plain HTML/CSS/JS with no build step.

**Play:** https://nptrulock.github.io/dungeons-and-debuggers/

## Core loop
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
- **Idle (passive):** your developer works tickets on their own, earning 🪙 coins and ⭐ reputation.
  - Work speed scales with *knowledge power*, the sum of your memory boxes.
  - Offline work runs at 25% speed, capped at 4h, and both can be upgraded.
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
- `node validate.js`: integrity of the question bank (answer indexes, blanks, pairs, explanations, glossary links, duplicates).
- `node runsnips.js`: runs every JavaScript and Python "predict the output" snippet and prints the real output next to the keyed answer.
