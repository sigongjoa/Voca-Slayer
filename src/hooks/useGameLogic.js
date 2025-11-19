import { useState, useReducer, useCallback } from 'react';
import { GAME_STATES } from '../lib/constants';

const INITIAL_STATE = {
    gameState: GAME_STATES.INPUT,
    turn: 1,
    hp: 3,
    heroName: '',
    targetWords: [],
    genre: '',
    storyData: null,
    previousSummary: '',
    inventory: [],
    score: 0,
};

function gameReducer(state, action) {
    switch (action.type) {
        case 'START_GAME':
            return {
                ...INITIAL_STATE,
                gameState: GAME_STATES.LOADING,
                heroName: action.payload.heroName,
                targetWords: action.payload.targetWords,
                genre: action.payload.genre,
            };
        case 'SET_STORY':
            return {
                ...state,
                gameState: GAME_STATES.STORY,
                storyData: action.payload,
            };
        case 'COMPLETE_QUIZ':
            if (action.payload.success) {
                return {
                    ...state,
                    gameState: GAME_STATES.ACTION_INPUT,
                    score: state.score + 100,
                    inventory: [...state.inventory, ...state.targetWords], // Add words to inventory
                };
            } else {
                const newHp = state.hp - 1;
                return {
                    ...state,
                    hp: newHp,
                    gameState: newHp <= 0 ? GAME_STATES.RESULT : state.gameState, // Game Over if HP 0
                };
            }
        case 'NEXT_TURN':
            return {
                ...state,
                gameState: GAME_STATES.LOADING,
                turn: state.turn + 1,
                previousSummary: state.storyData?.summary || '',
                storyData: null, // Clear old story
            };
        case 'RESTART':
            return INITIAL_STATE;
        default:
            return state;
    }
}

export function useGameLogic() {
    const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);

    const startGame = useCallback((data) => {
        dispatch({ type: 'START_GAME', payload: data });
    }, []);

    const setStory = useCallback((data) => {
        dispatch({ type: 'SET_STORY', payload: data });
    }, []);

    const submitQuiz = useCallback((success) => {
        dispatch({ type: 'COMPLETE_QUIZ', payload: { success } });
    }, []);

    const nextTurn = useCallback(() => {
        dispatch({ type: 'NEXT_TURN' });
    }, []);

    const restartGame = useCallback(() => {
        dispatch({ type: 'RESTART' });
    }, []);

    return {
        state,
        startGame,
        setStory,
        submitQuiz,
        nextTurn,
        restartGame,
    };
}
