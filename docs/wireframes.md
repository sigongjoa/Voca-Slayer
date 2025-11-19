# Frontend Wireframes
**Project:** Word Master: My Own Novel Dungeon
**Version:** 1.0
**Date:** 2025-11-20

---

## 1. Design System & Theme
*   **Theme**: RPG / Fantasy Adventure.
*   **Colors**: Dark Mode base (Deep Slate/Black), Vibrant Accents (Neon Blue for Magic, Gold for Rewards, Red for Danger).
*   **Typography**: Playful but readable (e.g., 'Nunito' or 'Gamja Flower' for Korean text).
*   **Components**: Glassmorphism cards, Glowing buttons, Animated progress bars.

---

## 2. Screen Layouts

### 2.1 Input Screen (Home)
*Goal: Excitement & Setup*

```text
+--------------------------------------------------+
|  [Header]                                        |
|  🧙‍♂️ Word Master: My Own Novel Dungeon            |
+--------------------------------------------------+
|                                                  |
|  [Hero Card]                                     |
|  +--------------------------------------------+  |
|  |  Label: Hero Name                          |  |
|  |  [ Input: "Kim Cheolsu" ]                  |  |
|  +--------------------------------------------+  |
|                                                  |
|  [Magic Words (Target Vocabulary)]               |
|  +--------------------------------------------+  |
|  |  [ Input 1 ]  [ Input 2 ]  [ Input 3 ]     |  |
|  |  (e.g. Abstraction, Variable, Algorithm)   |  |
|  +--------------------------------------------+  |
|                                                  |
|  [Select Dungeon Theme]                          |
|  +-----------+  +-----------+  +-----------+     |
|  | 🏰 Fantasy|  | 🚀 Sci-Fi |  | 👻 Horror |     |
|  +-----------+  +-----------+  +-----------+     |
|                                                  |
|  [ BIG CTA BUTTON ]                              |
|  ⚔️ START ADVENTURE                              |
|                                                  |
+--------------------------------------------------+
```

### 2.2 Story Screen (Reading)
*Goal: Immersion & Focus*

```text
+--------------------------------------------------+
| [Sticky Header]                                  |
| XP Bar: [========== 45% ==========      ]        |
+--------------------------------------------------+
|                                                  |
|  Title: "Cheolsu and the Sword of Abstraction"   |
|                                                  |
|  [Story Content Area]                            |
|  Long ago, in the kingdom of Code...             |
|                                                  |
|  Cheolsu found a **Variable**. It was glowing... |
|  (Target words are Bold + Color Highlighted)     |
|                                                  |
|  ...                                             |
|  ... (Scroll to read more) ...                   |
|  ...                                             |
|                                                  |
+--------------------------------------------------+
| [Floating Action Button (Appears at 100% XP)]    |
| 🏹 NEXT STAGE (BOSS BATTLE)                      |
+--------------------------------------------------+
```

### 2.3 Quiz Screen (Boss Battle)
*Goal: Challenge & Feedback*

```text
+--------------------------------------------------+
|  [Boss Visual Area]                              |
|        👹 BOSS MONSTER (Animated Shake)          |
|      HP: [====================] 100%             |
+--------------------------------------------------+
|  ... (Quiz Question & Options) ...               |
+--------------------------------------------------+
```

### 2.4 Action Input Screen (New Chapter Setup)
*Goal: Agency & Continuity*

```text
+--------------------------------------------------+
|  [Victory Message]                               |
|  🎉 Boss Defeated! Level Up!                     |
+--------------------------------------------------+
|                                                  |
|  [Narrative Prompt]                              |
|  "The monster falls. A dark tunnel appears ahead.|
|   What will Cheolsu do next?"                    |
|                                                  |
|  [Action Input]                                  |
|  [ Enter your action... (e.g. Enter the tunnel) ]|
|                                                  |
|  [ BUTTON ]                                      |
|  🏃‍♂️ CONTINUE ADVENTURE                          |
|                                                  |
|  [Secondary Button]                              |
|  🛑 End Game & View Results                      |
+--------------------------------------------------+
```

### 2.5 Result Screen (Final)
*Goal: Reward & Retention*
... (Same as before) ...

---

## 3. Interaction Details
*   **Input -> Story**: Fade out Input, Fade in Loading Spinner (Sword spinning), then Fade in Story.
*   **Story Scroll**: XP Bar fills smoothly as user scrolls down.
*   **Quiz Answer**:
    *   **Correct**: Screen flashes white, Boss turns red/fades, "Critical Hit" text appears.
    *   **Wrong**: Screen shakes, red overlay, "Miss" text appears.
