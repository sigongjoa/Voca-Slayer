# Project File Structure
**Project:** Word Master: My Own Novel Dungeon
**Version:** 1.0
**Date:** 2025-11-20

---

## Directory Tree

```text
root/
├── public/
│   └── assets/              # Static assets (images, sounds)
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components (Atomic Design)
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── Badge.jsx
│   │   ├── InputScreen.jsx  # Step 1: User Input
│   │   ├── StoryScreen.jsx  # Step 2: Reading & Story
│   │   ├── QuizScreen.jsx   # Step 3: Boss Battle
│   │   └── ResultScreen.jsx # Step 4: Rewards
│   ├── hooks/
│   │   └── useGameLogic.js  # Custom hook for managing Game State (Input -> Story -> Quiz)
│   ├── lib/
│   │   ├── llm.js           # OpenAI API integration & Mock fallback
│   │   └── constants.js     # Config, Prompts, Default Values
│   ├── mocks/
│   │   └── story_response.json # Mock data for TDD
│   ├── App.jsx              # Main Router/Layout
│   ├── index.css            # Tailwind imports & Global styles
│   └── main.jsx             # Entry point
├── docs/                    # Documentation (Planning, SDD, TDD, etc.)
├── package.json
├── tailwind.config.js
└── vite.config.js
```
