# Sequence Diagram: Word Master
**Project:** Word Master: My Own Novel Dungeon
**Version:** 1.0
**Date:** 2025-11-20

This document visualizes the interaction flow between the User, the React Client Application, and the OpenAI API.

## Main Game Flow

```mermaid
sequenceDiagram
    actor User
    participant Client as React Client (App)
    participant API as OpenAI API

    Note over User, Client: 1. Setup Phase
    User->>Client: Enter Name, 3 Words, Select Genre
    User->>Client: Click "Start Adventure"
    Client->>Client: Validate Inputs
    
    alt Invalid Inputs
        Client-->>User: Show Error Message (Toast/Alert)
    else Valid Inputs
        Client->>Client: Set GameState to LOADING
        Client-->>User: Show Loading Spinner
        
        Note over Client, API: 2. Generation Phase
        Client->>API: POST /v1/chat/completions (System Prompt + User Inputs)
        activate API
        API-->>Client: JSON Response { Story, Quiz }
        deactivate API
        
        Client->>Client: Parse JSON Response
        Client->>Client: Set GameState to STORY
        
        Note over User, Client: 3. Reading Phase
        Client-->>User: Display Story with Highlighted Words
        
        loop Reading
            User->>Client: Scroll Down
            Client->>Client: Update XP Bar (Scroll Progress)
        end
        
        User->>Client: Click "Next Stage" (Enabled at 100% XP)
        Client->>Client: Set GameState to QUIZ
        
        Note over User, Client: 4. Quiz Phase
        Client-->>User: Display Boss & Quiz Question
        User->>Client: Select Answer Option
        
        alt Correct Answer
            Client->>Client: Play Attack Animation
            Client->>Client: Reduce Boss Health to 0
            Client-->>User: Show Victory Message
            Client->>Client: Set GameState to RESULT (Grade S)
        else Incorrect Answer
            Client->>Client: Play Damage Animation
            Client-->>User: Show Try Again / Hint
            Client->>Client: Set GameState to RESULT (Grade B)
        end
        
        Note over User, Client: 5. Result Phase
        Client-->>User: Show Score & Word Collection
        User->>Client: Click "Restart"
        Client->>Client: Reset State -> Return to Input Screen
    end
```
