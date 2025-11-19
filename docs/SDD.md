# Software Design Description (SDD)
**Project:** Word Master: My Own Novel Dungeon
**Version:** 1.0
**Date:** 2025-11-20

---

## 1. Introduction
### 1.1 Purpose
The purpose of this document is to describe the software architecture and detailed design of the "Word Master" web application. It serves as the blueprint for implementation, ensuring the system meets the requirements of a gamified vocabulary learning tool for 5th graders.

### 1.2 Scope
The system is a Single Page Application (SPA) built with React. It interacts with the OpenAI API to generate personalized stories and quizzes. The scope includes the UI/UX design, state management, and external API integration.

---

## 2. System Architecture
### 2.1 High-Level Architecture
```mermaid
graph LR
    Client[React Client (Vite)] <-->|HTTPS/JSON| OpenAI[OpenAI API]
    Client -->|Local Storage| BrowserStorage[Browser Storage (Persist Progress)]
```
*   **Client-Side Rendering**: The entire application runs in the browser.
*   **No Backend (Prototype)**: Direct API calls to OpenAI from the client (API Key handled via user input or env var).

### 2.2 Technology Stack
*   **Framework**: React 18+ (Vite)
*   **Language**: JavaScript (ES6+)
*   **Styling**: Tailwind CSS (Utility-first)
*   **State Management**: React Context API + `useReducer`
*   **Animations**: Framer Motion
*   **Icons**: Lucide React

---

## 3. Component Design
### 3.1 Component Hierarchy
```text
App
├── Layout (Background, Container)
├── Header (Logo, User Status)
└── ScreenRouter (Switch based on GameState)
    ├── InputScreen
    │   ├── HeroNameInput
    │   ├── WordInputList
    │   └── GenreSelector
    ├── LoadingScreen (Spinner, Fun facts)
    ├── StoryScreen
*   **Input**: Name, Genre, 3 Words.
*   **Output Format**: JSON (strictly enforced).
*   **Prompt Engineering**:
    *   "Use the words naturally in context."
    *   "Do not define the words."
    *   "Highlight words with **bold** markers in the text."

---

## 6. Security & Performance
*   **API Key Safety**: Warn user that the key is stored only in memory/local storage for the session.
*   **Performance**: Lazy load heavy assets (images). Use `React.memo` for the StoryViewer if text is long.
