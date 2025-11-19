import React, { createContext, useContext, useReducer, useEffect } from 'react';

// 1. 초기 상태 (로그라이크 데이터 포함)
const initialState = {
    gameState: 'INPUT', // INPUT, LOADING, STORY, QUIZ, ACTION_INPUT, RESULT
    userData: {
        heroName: '',
        targetWords: ['', '', ''],
        genre: 'Fantasy',
    },
    rpgState: {
        turn: 1,       // 현재 챕터 (1부터 시작)
        hp: 3,         // 목숨 3개
        maxHp: 3,
        history: [],   // 이전 챕터 요약본(summary) 누적
        isGameOver: false,
    },
    currentStory: null, // { title, content, summary, quiz }
    error: null,
};

// 2. 리듀서 (상태 변경 로직)
function gameReducer(state, action) {
    switch (action.type) {
        case 'START_GAME':
            return {
                ...state,
                gameState: 'LOADING',
                userData: action.payload,
                rpgState: { ...initialState.rpgState }, // RPG 상태 초기화
                currentStory: null,
            };

        case 'SET_STORY':
            return {
                ...state,
                gameState: 'STORY',
                currentStory: action.payload,
                error: null,
            };

        case 'NEXT_STAGE_READY': // 퀴즈 풀러 가기
            return {
                ...state,
                gameState: 'QUIZ',
            };

        case 'QUIZ_SUCCESS': // 정답 -> 행동 입력 단계로
            return {
                ...state,
                gameState: 'ACTION_INPUT',
                // 퀴즈 맞히면 HP 회복? (선택사항)
            };

        case 'QUIZ_FAIL': // 오답 -> HP 감소
            const newHp = state.rpgState.hp - 1;
            return {
                ...state,
                rpgState: { ...state.rpgState, hp: newHp, isGameOver: newHp <= 0 },
                gameState: newHp <= 0 ? 'RESULT' : 'QUIZ', // 죽으면 결과창, 아니면 재도전
                error: '틀렸습니다! HP가 1 깎였습니다.',
            };

        case 'NEXT_TURN_START': // 다음 챕터 로딩 시작
            return {
                ...state,
                gameState: 'LOADING',
                rpgState: {
                    ...state.rpgState,
                    turn: state.rpgState.turn + 1,
                    history: [...state.rpgState.history, state.currentStory.summary], // 요약본 저장
                },
            };

        case 'RESET_GAME':
            return initialState;

        case 'SET_ERROR':
            return { ...state, error: action.payload, gameState: 'INPUT' };

        default:
            return state;
    }
}

// 3. Context 생성
const GameContext = createContext();

export function GameProvider({ children }) {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    // (옵션) 로컬 스토리지 저장 로직을 여기에 추가 가능

    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
}

// 4. 커스텀 훅
export function useGame() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}
