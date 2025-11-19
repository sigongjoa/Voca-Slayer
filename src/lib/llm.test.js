import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateStory } from './llm';
import mockResponse from '../../docs/mock_story_response.json';

// Mock the OpenAI library
const mockCreate = vi.fn();
vi.mock('openai', () => {
    return {
        OpenAI: vi.fn().mockImplementation(() => ({
            chat: {
                completions: {
                    create: mockCreate,
                },
            },
        })),
    };
});

describe('LLM Service - generateStory', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should throw an error if required parameters are missing', async () => {
        await expect(generateStory({})).rejects.toThrow();
    });

    it('should call OpenAI with the correct prompt structure', async () => {
        mockCreate.mockResolvedValue({
            choices: [{ message: { content: JSON.stringify(mockResponse) } }],
        });

        const input = {
            heroName: 'Cheolsu',
            targetWords: ['Apple', 'Banana', 'Grape'],
            genre: 'Fantasy',
        };

        await generateStory(input);

        expect(mockCreate).toHaveBeenCalledTimes(1);
        const callArgs = mockCreate.mock.calls[0][0];
        expect(callArgs.model).toBe('gpt-4o-mini');
        expect(callArgs.response_format).toEqual({ type: 'json_object' });
        expect(callArgs.messages[1].content).toContain('Cheolsu');
        expect(callArgs.messages[1].content).toContain('Fantasy');
    });

    it('should return parsed JSON data on success', async () => {
        mockCreate.mockResolvedValue({
            choices: [{ message: { content: JSON.stringify(mockResponse) } }],
        });

        const result = await generateStory({
            heroName: 'Cheolsu',
            targetWords: ['A', 'B', 'C'],
            genre: 'SF',
        });

        expect(result).toEqual(mockResponse);
        expect(result.title).toBeDefined();
        expect(result.quiz).toBeDefined();
    });

    it('should handle API errors gracefully', async () => {
        mockCreate.mockRejectedValue(new Error('API Error'));

        await expect(generateStory({
            heroName: 'Cheolsu',
            targetWords: ['A', 'B', 'C'],
            genre: 'SF',
        })).rejects.toThrow('API Error');
    });
});
