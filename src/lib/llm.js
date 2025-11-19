
/**
 * Service for interacting with the OpenAI API to generate stories and quizzes.
 */

import { OpenAI } from 'openai';

// TODO: Initialize OpenAI client safely (env vars)

/**
 * Generates a story chapter based on user input.
 * 
 * @param {Object} params
 * @param {string} params.heroName - Name of the hero
 * @param {string[]} params.targetWords - List of 3 target words
 * @param {string} params.genre - Selected genre
 * @param {string} [params.previousContext] - Summary of previous chapter (optional)
 * @param {string} [params.userAction] - User's action for the next chapter (optional)
 * @returns {Promise<Object>} - JSON response containing title, content, and quiz
 */
export async function generateStory({ heroName, targetWords, genre, previousContext, userAction }) {
    if (!heroName || !targetWords || !genre) {
        throw new Error('Missing required parameters');
    }

    const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true // For prototype only
    });

    const systemPrompt = `
**Role**: You are a JSON-speaking fantasy novelist engine for 5th graders. You write interactive stories where the user decides the next action.

---

## 2. Output Format
**Strict JSON only**.
\`\`\`json
{
  "title": "String (Chapter Title)",
  "content": "String (Story text with <b>tags</b>)",
  "quiz": {
    "question": "String (Related to this chapter)",
    "options": ["String", "String", "String"],
    "answer": "String"
  }
}
\`\`\`

## 3. Constraints
1.  **Length**: ~600 characters (Korean).
2.  **Target Words**: You MUST include ALL 3 target words in the story.
3.  **Highlighting**: Wrap every occurrence of the target words with \`<b>\` and \`</b>\`.
4.  **Quiz**:
    *   Create 1 fill-in-the-blank question based on the story context.
    *   The blank should be one of the target words.
    *   Provide 3 options (the target words).
    *   The \`answer\` must be one of the strings in \`options\`.
5.  **Language**: Korean (Hangul).
6.  **Tone**: Exciting, immersive, suitable for 10-12 year olds (RPG style).
7.  **Continuity**:
    *   If \`previousContext\` is provided, continue the story from there.
    *   If \`userAction\` is provided, incorporate it into the narrative immediately.
`;

    const userPrompt = JSON.stringify({
        heroName,
        targetWords,
        genre,
        previousContext,
        userAction
    });

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            response_format: { type: 'json_object' },
        });

        const content = completion.choices[0].message.content;
        return JSON.parse(content);
    } catch (error) {
        console.error('LLM Generation Error:', error);
        throw error;
    }
}
