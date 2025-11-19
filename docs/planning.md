# Word Master: My Own Novel Dungeon - Implementation Plan

## Goal Description
Create a gamified vocabulary learning web application for 5th-grade students. The app, "Word Master", uses an RPG dungeon theme where students input words and a genre to generate a personalized story using an LLM.
**New Feature**: The story is not a one-off. After completing a chapter (and its quiz), the user can input their next action to generate the next chapter, creating an endless interactive adventure.

## User Review Required
> [!IMPORTANT]
> **Tech Stack Decision**: I am proceeding with **Vite + React + Tailwind CSS** instead of Streamlit.
> **Reasoning**: To achieve the requested "Game (RPG) Interface" with "Premium Designs", "Dynamic Animations", and a "Wow" factor, React offers significantly more flexibility and visual control than Streamlit. Streamlit is great for data apps but harder to style as a custom immersive game.

> [!NOTE]
> **OpenAI API Key**: The application will require an OpenAI API key to function. I will implement a way to input this in the UI or use an environment variable if you have one configured in your workspace.

## Proposed Changes

### Project Structure
I will create a new Vite project in the current directory.

#### [NEW] [package.json](file:///d:/progress/Voca Slayer/package.json)
- Dependencies: `react`, `react-dom`, `framer-motion` (for animations), `lucide-react` (icons), `openai`.
- DevDependencies: `vite`, `tailwindcss`, `postcss`, `autoprefixer`.

#### [NEW] [src/App.jsx](file:///d:/progress/Voca Slayer/src/App.jsx)
- Main entry point.
- Manages global state (current screen, user data, game progress).
- Renders the active screen component based on state.

#### [NEW] [src/components/InputScreen.jsx](file:///d:/progress/Voca Slayer/src/components/InputScreen.jsx)
- **UI**: Hero image header, Input for Name, 3 Inputs for Words, Genre Selection Cards (Fantasy, SF, Horror).
- **Action**: "Start Adventure" button triggers API call.

#### [NEW] [src/components/StoryScreen.jsx](file:///d:/progress/Voca Slayer/src/components/StoryScreen.jsx)
- **UI**: Title, Story Text Area (renders current chapter).
- **Feature**: Target words highlighted.
- **Interaction**: Scroll progress updates XP.
- **Action**: "Challenge Boss" button appears at bottom.

#### [NEW] [src/components/QuizScreen.jsx](file:///d:/progress/Voca Slayer/src/components/QuizScreen.jsx)
- **UI**: Boss Monster visual.
- **Logic**: Quiz based on current chapter.
- **Action**: On success, show "Action Input" to decide next move.

#### [NEW] [src/components/ActionInputScreen.jsx](file:///d:/progress/Voca Slayer/src/components/ActionInputScreen.jsx)
- **UI**: "What will you do next?" input field.
- **Action**: Triggers generation of the next chapter.

#### [NEW] [src/components/ResultScreen.jsx](file:///d:/progress/Voca Slayer/src/components/ResultScreen.jsx)
- **UI**: Grade (S/A/B), Word Collection list.
- **Action**: "Share/Save" (mock functionality or print).

#### [NEW] [src/lib/llm.js](file:///d:/progress/Voca Slayer/src/lib/llm.js)
- Function to call OpenAI API with the specific System Prompt provided.
- Handles JSON parsing if we want structured output for the quiz, or just text for the story.
- *Strategy*: I will ask the LLM to return the story and the quiz question in a structured JSON format to make parsing easier for the frontend.

## Verification Plan

### Automated Tests
- None planned for this prototype.

### Manual Verification
1.  **Setup**: Run `npm install` and `npm run dev`.
2.  **Input Flow**:
    - Enter "Hero Name", "Word1", "Word2", "Word3".
    - Select "Fantasy".
    - Click "Start".
    - *Verify*: Loading state appears.
3.  **Story Generation**:
    - *Verify*: Story is displayed. Target words are highlighted.
    - *Verify*: XP bar fills as you scroll.
4.  **Quiz**:
    - Click "Next Stage".
    - *Verify*: Quiz question relates to the story. Options are displayed.
    - Select Correct Answer -> *Verify*: Success animation, Boss takes damage/dies.
5.  **Result**:
    - *Verify*: Final score screen is shown.
