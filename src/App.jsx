import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import InputScreen from './components/InputScreen';
import StoryScreen from './components/StoryScreen';
import QuizScreen from './components/QuizScreen';
import ActionInputScreen from './components/ActionInputScreen';
import ResultScreen from './components/ResultScreen';
import { generateStory } from './lib/llm-ollama';

function GameFlow() {
    const { state, dispatch } = useGame();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleStart = async (userData) => {
        dispatch({ type: 'START_GAME', payload: userData });
        await loadStory(userData);
    };

    const loadStory = async (userData, userAction = null) => {
        setIsLoading(true);
        setError(null);

        try {
            const previousContext = state.rpgState.history.length > 0
                ? state.rpgState.history[state.rpgState.history.length - 1]
                : null;

            const story = await generateStory({
                heroName: userData.heroName || state.userData.heroName,
                targetWords: userData.targetWords || state.userData.targetWords,
                genre: userData.genre || state.userData.genre,
                previousContext,
                userAction,
            });

            dispatch({ type: 'SET_STORY', payload: story });
        } catch (err) {
            console.error('Story generation failed:', err);
            setError(err.message);
            dispatch({ type: 'SET_ERROR', payload: err.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleStoryNext = () => {
        dispatch({ type: 'NEXT_STAGE_READY' });
    };

    const handleQuizAnswer = (isCorrect) => {
        if (isCorrect) {
            dispatch({ type: 'QUIZ_SUCCESS' });
        } else {
            dispatch({ type: 'QUIZ_FAIL' });
        }
    };

    const handleActionSubmit = async (action) => {
        dispatch({ type: 'NEXT_TURN_START' });
        await loadStory(state.userData, action);
    };

    const handleRestart = () => {
        dispatch({ type: 'RESET_GAME' });
        setError(null);
    };

    // Loading Screen
    if (isLoading || state.gameState === 'LOADING') {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="text-xl text-slate-300">Generating your story...</p>
                    <p className="text-sm text-slate-500">This may take a moment with Ollama</p>
                </div>
            </div>
        );
    }

    // Error Screen
    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
                <div className="text-center space-y-4 max-w-md">
                    <div className="text-6xl">⚠️</div>
                    <h2 className="text-2xl font-bold text-red-400">Error</h2>
                    <p className="text-slate-300">{error}</p>
                    <button
                        onClick={handleRestart}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat bg-blend-overlay">
            {state.gameState === 'INPUT' && (
                <InputScreen onStart={handleStart} />
            )}

            {state.gameState === 'STORY' && (
                <StoryScreen story={state.currentStory} onNext={handleStoryNext} />
            )}

            {state.gameState === 'QUIZ' && (
                <QuizScreen
                    quiz={state.currentStory?.quiz}
                    hp={state.rpgState.hp}
                    maxHp={state.rpgState.maxHp}
                    onAnswer={handleQuizAnswer}
                />
            )}

            {state.gameState === 'ACTION_INPUT' && (
                <ActionInputScreen onSubmit={handleActionSubmit} />
            )}

            {state.gameState === 'RESULT' && (
                <ResultScreen
                    isVictory={!state.rpgState.isGameOver}
                    turn={state.rpgState.turn}
                    onRestart={handleRestart}
                />
            )}
        </div>
    );
}

function App() {
    return (
        <GameProvider>
            <GameFlow />
        </GameProvider>
    );
}

export default App;
