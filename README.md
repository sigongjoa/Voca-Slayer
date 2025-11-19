# Word Master: My Own Novel Dungeon (워드 마스터: 나만의 소설 던전)

**Word Master** is a gamified vocabulary learning web application designed for 5th-grade students. It transforms boring vocabulary drills into an exciting RPG adventure using AI-generated stories.

## 🎮 Project Overview
Students input target words and select a genre (Fantasy, SF, Horror). The system then generates a personalized interactive story where the student becomes the hero. To defeat the "Boss Monster" and advance to the next chapter, they must solve vocabulary quizzes based on the story context.

## ✨ Key Features
-   **Personalized Story Generation**: Uses OpenAI (GPT-4o-mini) to create unique stories containing the student's target words.
-   **RPG Dungeon Theme**: Immersive interface with health bars, boss monsters, and dynamic animations.
-   **Interactive Gameplay**:
    -   **Read**: Enjoy a short story with highlighted vocabulary.
    -   **Battle**: Solve a fill-in-the-blank quiz to damage the boss.
    -   **Action**: Decide the hero's next move to generate the subsequent chapter.
-   **Visual Feedback**: Dynamic animations for attacks, damage, and victory.

## 🛠️ Tech Stack
-   **Frontend**: React, Vite
-   **Styling**: Tailwind CSS, Framer Motion (Animations), Lucide React (Icons)
-   **AI Integration**: OpenAI API (gpt-4o-mini)
-   **Testing**: Vitest, React Testing Library, Playwright (E2E)

## 🚀 Getting Started

### Prerequisites
-   Node.js (v18+)
-   OpenAI API Key

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/sigongjoa/Voca-Slayer.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file and add your API key:
    ```env
    VITE_OPENAI_API_KEY=your_api_key_here
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

## 🧪 Testing
-   **Unit Tests**: `npm run test`
-   **E2E Tests**: `npm run test:e2e`
