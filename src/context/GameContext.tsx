import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { SentencePack, Sentence } from '../types/game';

export interface GameState {
  currentMode: 'play' | 'challenge' | 'practice';
  currentPackId: string;
  currentSentenceIndex: number;
  currentSentence: Sentence | null;
  selectedWordIndices: number[];
  attempts: number;
  errorCount: number;
  consecutiveErrors: number;
  showHint: boolean;
  hintTime: number;
  score: number;
  difficulty: number;
  sessionStats: {
    startTime: number;
    sentencesCompleted: number;
    hintsUsed: number;
    averageTimePerSentence: number;
  };
}

interface GameContextType {
  state: GameState;
  startGame: (mode: 'play' | 'challenge' | 'practice', packId: string) => void;
  selectWord: (wordIndex: number) => void;
  unselectWord: (wordIndex: number) => void;
  completeWord: (wordIndex: number) => void;
  resetCurrentSentence: () => void;
  nextSentence: () => void;
  showNextWordHint: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialState: GameState = {
  currentMode: 'play',
  currentPackId: '',
  currentSentenceIndex: 0,
  currentSentence: null,
  selectedWordIndices: [],
  attempts: 0,
  errorCount: 0,
  consecutiveErrors: 0,
  showHint: false,
  hintTime: Date.now(),
  score: 0,
  difficulty: 0,
  sessionStats: {
    startTime: Date.now(),
    sentencesCompleted: 0,
    hintsUsed: 0,
    averageTimePerSentence: 0,
  },
};

type GameAction =
  | { type: 'START_GAME'; mode: 'play' | 'challenge' | 'practice'; packId: string; sentence: Sentence }
  | { type: 'SELECT_WORD'; wordIndex: number }
  | { type: 'UNSELECT_WORD'; wordIndex: number }
  | { type: 'COMPLETE_WORD'; wordIndex: number; isCorrect: boolean }
  | { type: 'RESET_SENTENCE' }
  | { type: 'NEXT_SENTENCE'; sentence: Sentence }
  | { type: 'SHOW_HINT' }
  | { type: 'RESET_GAME' }
  | { type: 'SET_DIFFICULTY'; difficulty: number };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...initialState,
        currentMode: action.mode,
        currentPackId: action.packId,
        currentSentence: action.sentence,
        sessionStats: {
          ...initialState.sessionStats,
          startTime: Date.now(),
        },
      };

    case 'SELECT_WORD':
      return {
        ...state,
        selectedWordIndices: [...state.selectedWordIndices, action.wordIndex],
      };

    case 'UNSELECT_WORD':
      return {
        ...state,
        selectedWordIndices: state.selectedWordIndices.filter((i) => i !== action.wordIndex),
      };

    case 'COMPLETE_WORD':
      if (action.isCorrect) {
        return {
          ...state,
          selectedWordIndices: state.selectedWordIndices.filter((i) => i !== action.wordIndex),
          errorCount: 0,
          consecutiveErrors: 0,
          score: state.score + 10,
        };
      } else {
        return {
          ...state,
          errorCount: state.errorCount + 1,
          consecutiveErrors: state.consecutiveErrors + 1,
          selectedWordIndices: state.selectedWordIndices.filter((i) => i !== action.wordIndex),
        };
      }

    case 'RESET_SENTENCE':
      return {
        ...state,
        selectedWordIndices: [],
        attempts: state.attempts + 1,
      };

    case 'NEXT_SENTENCE':
      return {
        ...state,
        currentSentenceIndex: state.currentSentenceIndex + 1,
        currentSentence: action.sentence,
        selectedWordIndices: [],
        attempts: 0,
        errorCount: 0,
        consecutiveErrors: 0,
        showHint: false,
        sessionStats: {
          ...state.sessionStats,
          sentencesCompleted: state.sessionStats.sentencesCompleted + 1,
        },
      };

    case 'SHOW_HINT':
      return {
        ...state,
        showHint: true,
        hintTime: Date.now(),
        sessionStats: {
          ...state.sessionStats,
          hintsUsed: state.sessionStats.hintsUsed + 1,
        },
      };

    case 'SET_DIFFICULTY':
      return {
        ...state,
        difficulty: action.difficulty,
      };

    case 'RESET_GAME':
      return initialState;

    default:
      return state;
  }
}

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = useCallback(
    (mode: 'play' | 'challenge' | 'practice', packId: string, sentence: Sentence) => {
      dispatch({ type: 'START_GAME', mode, packId, sentence });
    },
    []
  );

  const selectWord = useCallback((wordIndex: number) => {
    dispatch({ type: 'SELECT_WORD', wordIndex });
  }, []);

  const unselectWord = useCallback((wordIndex: number) => {
    dispatch({ type: 'UNSELECT_WORD', wordIndex });
  }, []);

  const completeWord = useCallback((wordIndex: number, isCorrect: boolean) => {
    dispatch({ type: 'COMPLETE_WORD', wordIndex, isCorrect });
  }, []);

  const resetCurrentSentence = useCallback(() => {
    dispatch({ type: 'RESET_SENTENCE' });
  }, []);

  const nextSentence = useCallback((sentence: Sentence) => {
    dispatch({ type: 'NEXT_SENTENCE', sentence });
  }, []);

  const showNextWordHint = useCallback(() => {
    dispatch({ type: 'SHOW_HINT' });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const value: GameContextType = {
    state,
    startGame,
    selectWord,
    unselectWord,
    completeWord,
    resetCurrentSentence,
    nextSentence,
    showNextWordHint,
    resetGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
