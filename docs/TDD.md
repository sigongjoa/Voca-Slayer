# Test Driven Development (TDD) Strategy
**Project:** Word Master: My Own Novel Dungeon
**Version:** 1.0
**Date:** 2025-11-20

---

## 1. Testing Philosophy
We follow the **Red-Green-Refactor** cycle. Tests are written *before* the implementation code. This ensures that every feature has a clear requirement and that the code fulfills it.

### 1.1 Workflow
1.  **Red**: Write a failing test that defines a desired feature or improvement.
2.  **Green**: Write the minimum amount of code necessary to make the test pass.
3.  **Refactor**: Clean up the code while ensuring the test still passes.

---

## 2. Technology Stack
*   **Test Runner**: Vitest (Fast, native Vite support)
*   **Assertion Library**: Vitest (Chai-compatible)
*   **DOM Testing**: React Testing Library (RTL)
*   **Environment**: JSDOM (Simulates browser environment)

---

## 3. Testing Scope & Scenarios

### 3.1 Unit Tests (Business Logic)
*Target: `src/lib/llm.js`, `src/utils/*.js`*

#### Scenario 1: Parsing LLM Response
*   **Goal**: Ensure JSON string from OpenAI is correctly converted to a JavaScript object.
*   **Test Case**: `should parse valid JSON string into StoryContent object`
    *   *Input*: `'{"title": "Test", "content": "Story...", "quiz": {...}}'`
    *   *Expected*: Object matches structure.
*   **Test Case**: `should handle malformed JSON gracefully`
    *   *Input*: `'{ "title": "Incomplete...'`
    *   *Expected*: Throw specific error or return null.

#### Scenario 2: Word Highlighting Logic
*   **Goal**: Ensure target words are identified in the text.
*   **Test Case**: `should wrap target words in bold tags`
    *   *Input*: Text: "The variable is key.", Words: ["variable"]
    *   *Expected*: "The **variable** is key."

### 3.2 Component Tests (UI Interactions)
*Target: `src/components/*.jsx`*

#### Scenario 3: Input Validation (`InputScreen`)
*   **Goal**: Prevent starting the game with missing data.
*   **Test Case**: `should disable Start button when inputs are empty`
    *   *Action*: Render screen, check button state.
    *   *Expected*: Button has `disabled` attribute.
*   **Test Case**: `should enable Start button when all fields are filled`
    *   *Action*: Fill Name, 3 Words, Select Genre.
    *   *Expected*: Button is enabled.

#### Scenario 4: Quiz Interaction (`QuizScreen`)
*   **Goal**: Verify feedback on answer selection.
*   **Test Case**: `should show success state on correct answer`
    *   *Action*: Click button with `correctAnswer` text.
    *   *Expected*: Call `onAnswer(true)`, show "Victory" visual.
*   **Test Case**: `should show error state on incorrect answer`
    *   *Action*: Click button with wrong text.
    *   *Expected*: Call `onAnswer(false)`, show "Shake" animation.

### 3.3 Integration Tests (User Flow)
*Target: `src/App.jsx`*

#### Scenario 5: Game Flow
*   **Goal**: Ensure smooth transition between screens.
*   **Test Case**: `should switch from Input to Story on submission`
    *   *Action*: Submit form in InputScreen.
    *   *Expected*: `gameState` changes to `LOADING` then `STORY`.
*   **Test Case**: `should switch from Story to Quiz on completion`
    *   *Action*: Scroll to bottom of StoryScreen, click "Next".
    *   *Expected*: `gameState` changes to `QUIZ`.

---

## 4. Implementation Plan (TDD Order)

1.  **Setup**: Install `vitest`, `jsdom`, `@testing-library/react`.
2.  **Cycle 1 (Logic)**: Create `llm.test.js` -> Implement `llm.js`.
3.  **Cycle 2 (Input)**: Create `InputScreen.test.jsx` -> Implement `InputScreen.jsx`.
4.  **Cycle 3 (Story)**: Create `StoryScreen.test.jsx` -> Implement `StoryScreen.jsx`.
5.  **Cycle 4 (Quiz)**: Create `QuizScreen.test.jsx` -> Implement `QuizScreen.jsx`.
