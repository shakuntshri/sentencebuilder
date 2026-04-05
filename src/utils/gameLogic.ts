import { Word, Sentence } from '../types/game';

/**
 * Shuffle words in a sentence while ensuring the first word
 * is not in the same position as the original
 */
export const shuffleWords = (words: Word[]): Word[] => {
  let shuffled: Word[] = [];
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    shuffled = [...words].sort(() => Math.random() - 0.5);

    // Check if first word is in a different position
    if (shuffled[0].index !== 0) {
      return shuffled;
    }
    attempts++;
  }

  // If we can't shuffle properly, just return partially shuffled
  return shuffled;
};

/**
 * Get the next correct word index based on selected words
 */
export const getNextCorrectWordIndex = (
  selectedCount: number,
  totalWords: number
): number => {
  return selectedCount;
};

/**
 * Check if word selection is correct
 */
export const isWordSelectionCorrect = (
  selectedIndices: number[],
  correctIndices: number[]
): boolean => {
  if (selectedIndices.length !== correctIndices.length) {
    return false;
  }

  for (let i = 0; i < selectedIndices.length; i++) {
    if (selectedIndices[i] !== correctIndices[i]) {
      return false;
    }
  }

  return true;
};

/**
 * Check if a tap is the correct next word
 */
export const isCorrectNextWord = (
  tappedWordIndex: number,
  selectedIndices: number[],
  words: Word[]
): boolean => {
  const nextExpectedPosition = selectedIndices.length;
  const expectedWordIndex = words.findIndex((w) => w.index === nextExpectedPosition);
  return tappedWordIndex === expectedWordIndex;
};

/**
 * Calculate difficulty level based on sentence length and word complexity
 */
export const calculateDifficulty = (sentence: Sentence): 'easy' | 'medium' | 'hard' => {
  const wordCount = sentence.words.length;
  const hasAdjectives = sentence.words.some((w) => w.partOfSpeech === 'adjective');
  const hasPrepositions = sentence.words.some((w) => w.partOfSpeech === 'function');

  if (wordCount <= 3) {
    return 'easy';
  } else if (wordCount === 4 && !hasAdjectives) {
    return 'easy';
  } else if (wordCount === 4 && hasAdjectives) {
    return 'medium';
  } else if (wordCount === 5) {
    return 'medium';
  } else {
    return 'hard';
  }
};

/**
 * Check if user should get a hint based on errors
 */
export const shouldShowHint = (
  errorCount: number,
  consecutiveErrors: number,
  maxHints: number = 2
): boolean => {
  if (maxHints <= 0) return false;
  return consecutiveErrors >= 2;
};

/**
 * Calculate time per sentence in ms
 */
export const calculateAverageTime = (
  sessionStats: {
    sentencesCompleted: number;
    startTime: number;
  }
): number => {
  if (sessionStats.sentencesCompleted === 0) return 0;
  const elapsed = Date.now() - sessionStats.startTime;
  return Math.round(elapsed / sessionStats.sentencesCompleted);
};

/**
 * Generate a unique session ID
 */
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calculate success rate
 */
export const calculateSuccessRate = (
  sentencesCompleted: number,
  totalAttempts: number
): number => {
  if (totalAttempts === 0) return 0;
  return Math.round((sentencesCompleted / totalAttempts) * 100);
};
