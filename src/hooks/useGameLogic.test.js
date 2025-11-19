import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useGameLogic } from './useGameLogic';
import { GAME_STATES } from '../lib/constants';

describe('useGameLogic (Roguelike)', () => {
    it('should initialize with default state', () => {
        const { result } = renderHook(() => useGameLogic());
        expect(result.current.state.gameState).toBe(GAME_STATES.INPUT);
        expect(result.current.state.turn).toBe(1);
        expect(result.current.state.hp).toBe(3);
    });

    it('should transition to LOADING on start game', () => {
        const { result } = renderHook(() => useGameLogic());
        act(() => {
            result.current.startGame({
                heroName: 'Hero',
                targetWords: ['A', 'B', 'C'],
                genre: 'Fantasy'
            });
        });
        expect(result.current.state.gameState).toBe(GAME_STATES.LOADING);
        expect(result.current.state.heroName).toBe('Hero');
    });

    it('should transition to STORY when story is set', () => {
        const { result } = renderHook(() => useGameLogic());
        act(() => {
            result.current.setStory({ title: 'Chapter 1', content: '...', summary: 'Summary' });
        });
        expect(result.current.state.gameState).toBe(GAME_STATES.STORY);
        expect(result.current.state.storyData.summary).toBe('Summary');
    });

    it('should handle correct quiz answer (Level Up / Action Input)', () => {
        const { result } = renderHook(() => useGameLogic());
        // Setup state
        act(() => {
            result.current.startGame({ heroName: 'Hero', targetWords: ['Word1'], genre: 'F' });
            result.current.setStory({ title: 'T', content: 'C', summary: 'S' });
        });

        act(() => {
            result.current.submitQuiz(true);
        });

        expect(result.current.state.gameState).toBe(GAME_STATES.ACTION_INPUT);
        expect(result.current.state.inventory).toContain('Word1');
    });

    it('should handle incorrect quiz answer (Damage)', () => {
        const { result } = renderHook(() => useGameLogic());
        act(() => {
            result.current.submitQuiz(false);
        });
        expect(result.current.state.hp).toBe(2);
    });

    it('should increment turn on nextTurn', () => {
        const { result } = renderHook(() => useGameLogic());
        // Setup story data to verify summary persistence
        act(() => {
            result.current.setStory({ title: 'T', content: 'C', summary: 'Old Summary' });
        });

        act(() => {
            result.current.nextTurn();
        });

        expect(result.current.state.turn).toBe(2);
        expect(result.current.state.previousSummary).toBe('Old Summary');
        expect(result.current.state.gameState).toBe(GAME_STATES.LOADING);
    });
});
