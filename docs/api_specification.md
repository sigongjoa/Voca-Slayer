# Backend API Specification
**Project:** Word Master: My Own Novel Dungeon
**Version:** 1.0
**Date:** 2025-11-20

---

## 1. Overview
This document defines the RESTful API contract for the "Word Master" application.
*   **Base URL**: `/api/v1` (or mocked locally via `src/lib/api.js`)
*   **Content-Type**: `application/json`

---

## 2. Endpoints

### 2.1 Generate Adventure
Generates a personalized story and a quiz question based on user input.

*   **Endpoint**: `POST /adventure/generate`
*   **Description**: Calls the LLM to create a story containing the target words and a follow-up quiz.

#### Request Headers
| Header | Value | Description |
| :--- | :--- | :--- |
| `Content-Type` | `application/json` | Required |
| `Authorization` | `Bearer <OPENAI_API_KEY>` | Required (if using direct client proxy) |

#### Request Body
```json
{
  "heroName": "Cheolsu",
  "targetWords": ["Abstraction", "Variable", "Algorithm"],
  "genre": "Fantasy",
  "previousContext": "Summary of previous chapter... (Optional)",
  "userAction": "Cheolsu decides to open the door. (Optional)"
}
```

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `heroName` | `string` | Yes | Name of the protagonist. |
| `targetWords` | `string[]` | Yes | Array of 3 words to include. |
| `genre` | `string` | Yes | Genre of the story. |
| `previousContext` | `string` | No | Summary or full text of the previous chapter (for continuity). |
| `userAction` | `string` | No | The user's input for what happens next. |

#### Response Body (Success - 200 OK)
```json
{
  "status": "success",
  "data": {
    "title": "Cheolsu and the Sword of Abstraction",
    "content": "Cheolsu picked up the sword. It was an **Abstraction** of power...",
    "quiz": {
      "question": "What did Cheolsu use to simplify the monster?",
      "options": ["Variable", "Abstraction", "Algorithm"],
      "answer": "Abstraction"
    }
  }
}
```

#### Response Body (Error)
```json
{
  "status": "error",
  "code": "INVALID_INPUT",
  "message": "Target words must contain exactly 3 items."
}
```

---

## 3. Error Codes

| Code | HTTP Status | Description |
| :--- | :--- | :--- |
| `INVALID_INPUT` | 400 | Missing or invalid parameters in request body. |
| `API_KEY_MISSING` | 401 | OpenAI API Key is missing or invalid. |
| `GENERATION_FAILED` | 500 | LLM failed to generate valid JSON output. |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests to the LLM provider. |

---

## 4. Implementation Notes
*   **Prototype Phase**: This API will be simulated in `src/lib/llm.js`. The function `generateStory(params)` will act as the client for this endpoint, directly calling OpenAI and formatting the response to match this spec.
*   **Production Phase**: This spec can be directly implemented as a Node.js/Express route or a Next.js API Route to hide the API key and add rate limiting.
