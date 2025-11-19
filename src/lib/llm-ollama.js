/**
 * Service for interacting with Ollama to generate stories and quizzes.
 */

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';

/**
 * Generates a story chapter based on user input using Ollama.
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

    const systemPrompt = `**Role**: You are a JSON-speaking fantasy novelist engine for 5th graders. You write interactive stories where the user decides the next action.

## Output Format
**Strict JSON only**. You MUST respond with ONLY valid JSON, no other text.
\`\`\`json
{
  "title": "String (Chapter Title)",
  "content": "String (Story text with <b>tags</b>)",
  "summary": "String (CRITICAL: A 3-sentence summary of THIS chapter to be used as context for the NEXT chapter)",
  "image_prompt": "String (An English description of the current scene to generate an illustration. Style: Anime/Webtoon)",
  "quiz": {
    "question": "String (Related to this chapter)",
    "options": ["String", "String", "String"],
    "answer": "String"
  }
}
\`\`\`

## Constraints
1.  **Length**: ~600 characters (Korean).
2.  **Target Words**: You MUST include ALL 3 target words naturally.
3.  **Highlighting**: Wrap every occurrence of the target words with \`<b>\` and \`</b>\`.
4.  **Quiz**:
    * Create 1 fill-in-the-blank question based on the story context.
    * The blank should be one of the target words.
    * Provide 3 options (the target words).
    * The \`answer\` must be one of the strings in \`options\`.
5.  **Language**: Korean (Hangul).
6.  **Tone**: Exciting, immersive, suitable for 10-12 year olds (RPG style).
7.  **Continuity**:
    * If \`previousContext\` is provided, continue the story from there.
    * If \`userAction\` is provided, incorporate it into the narrative immediately.

IMPORTANT: Return ONLY the JSON object, nothing else.`;

    const userPrompt = `Generate a story with these parameters:
Hero Name: ${heroName}
Target Words: ${targetWords.join(', ')}
Genre: ${genre}
${previousContext ? `Previous Context: ${previousContext}` : ''}
${userAction ? `User Action: ${userAction}` : ''}

Remember: Return ONLY valid JSON, no markdown code blocks or other text.`;

    try {
        const response = await fetch(OLLAMA_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama2',
                prompt: `${systemPrompt}\n\n${userPrompt}`,
                stream: false,
                format: 'json',
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.response;

        // Parse the JSON response
        let parsedContent;
        try {
            parsedContent = JSON.parse(content);
        } catch (parseError) {
            console.error('Failed to parse Ollama response:', content);
            // Try to extract JSON from the response
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                parsedContent = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('Invalid JSON response from Ollama');
            }
        }

        return parsedContent;
    } catch (error) {
        console.error('LLM Generation Error:', error);
        throw error;
    }
}
