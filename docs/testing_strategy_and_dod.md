# Testing Strategy & Definition of Done (DoD)
**Project:** Word Master: My Own Novel Dungeon
**Version:** 1.0
**Date:** 2025-11-20

---

## 1. Definition of Done (DoD)
For any feature or user story to be considered "Done", it must satisfy the following criteria:

### 1.1 Code Quality
- [ ] Code is written in accordance with the project's style guide (Prettier/ESLint).
- [ ] No console errors or warnings in the browser DevTools.
- [ ] Code is refactored for readability and maintainability.

### 1.2 Testing
- [ ] **Unit Tests**: Business logic (e.g., parsers, state reducers) has >80% coverage.
- [ ] **Component Tests**: Critical UI components render correctly and handle user interactions.
- [ ] **Integration Tests**: The feature works correctly with connected components (e.g., API calls update the UI).
- [ ] **Manual Verification**: The feature has been manually tested in the browser against the Wireframes.

### 1.4 Test Reporting (MANDATORY)
- [ ] **Automated Reports**: A consolidated test report (HTML/JSON) must be generated for every test run.
- [ ] **Evidence**: E2E tests must include screenshots and execution logs (traces) for every step.
- [ ] **Coverage**: Unit tests must output a code coverage report.

---

## 2. Testing Strategy

### 2.1 Frontend Testing
*Focus: Component rendering, User Interaction, State Management*

*   **Tools**: Vitest, React Testing Library (RTL)
*   **Reporting**: Vitest UI / HTML Report
*   **Scope**:
    *   **Atomic Components**: Verify buttons, inputs, and cards render props correctly.
    *   **Screen Components**: Verify `InputScreen` validates form data before submission.
    *   **State Logic**: Verify `useGameLogic` hook transitions states correctly (e.g., `INPUT` -> `LOADING` -> `STORY`).
*   **Example Test**:
    ```javascript
    test('Start button is disabled when inputs are empty', () => {
      render(<InputScreen />);
      expect(screen.getByText('Start Adventure')).toBeDisabled();
    });
    ```

### 2.2 Backend / API Testing
*Focus: Data Contract, Error Handling, Response Format*

*   **Tools**: Vitest (mocking `fetch`), Postman (for real API checks)
*   **Reporting**: Vitest HTML Report
*   **Scope**:
    *   **Request Validation**: Ensure the client sends the correct JSON structure (`heroName`, `targetWords`, `genre`).
    *   **Response Parsing**: Ensure the client correctly parses the LLM's JSON response.
    *   **Error Handling**: Verify the UI shows an error message if the API returns 400/500 or malformed JSON.
*   **Mocking Strategy**:
    *   Use `src/mocks/story_response.json` to simulate a successful API response during development.
    *   Simulate network delays and failures to test loading states and error boundaries.

### 2.3 End-to-End (E2E) Testing
*Focus: Critical User Journeys, Multi-screen flows*

*   **Tools**: **Playwright** (Required)
*   **Reporting**: Playwright HTML Report (with Screenshots, Video, and Trace)
*   **Scope**:
    *   **Full Game Loop**: Start -> Story -> Quiz -> Result -> Restart.
    *   **Interactive Flow**: Start -> Story -> Quiz -> Action Input -> Next Story.
*   **Scenario**:
    1.  User enters "Cheolsu", ["Apple", "Banana", "Grape"], "SF".
    2.  User clicks "Start".
    3.  Story loads with "Apple" highlighted.
    4.  User scrolls to bottom.
    5.  User answers Quiz correctly.
    6.  User enters "Go to Mars".
    7.  Next chapter loads.

### 2.4 Use Case Validation
*Focus: Ensuring business requirements are met*

| Use Case | Test Procedure | Expected Outcome |
| :--- | :--- | :--- |
| **UC-01: Start Adventure** | Enter valid data and click Start. | Transition to Loading, then Story screen. |
| **UC-02: Read Story** | Check text for bold tags. | Target words are visually distinct. |
| **UC-03: Take Quiz** | Select correct answer. | "Victory" animation plays, "Next Action" input appears. |
| **UC-05: Continue Adventure** | Enter action and submit. | New story chapter is generated and displayed. |

---

## 3. Test Execution Plan
1.  **Pre-Commit**: Run `npm run test` (Unit/Component tests) -> Check Coverage Report.
2.  **Feature Completion**: Run `npm run test:e2e` (Playwright) -> Review HTML Report with Screenshots.
3.  **Release**: All tests must pass with 100% report generation.
