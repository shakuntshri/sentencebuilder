// Game types
export interface Word {
  id: string;
  text: string;
  index: number; // position in correct sentence
  partOfSpeech?: 'noun' | 'verb' | 'adjective' | 'function'; // for color coding
  audioUrl?: string;
}

export interface Sentence {
  id: string;
  text: string;
  words: Word[];
  audioUrl?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  packId: string;
  category: string;
}

export interface SentencePack {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sentences: Sentence[];
  ageGroup: '4-5' | '5-6' | '4-6';
  theme: string;
  requiresUnlock: boolean;
  icon?: string;
}

export interface PackProgress {
  packId: string;
  completedSentences: number;
  averageTimePerSentence: number;
  mistakesCount: number;
  rating: number; // 0-100, for difficulty adjustment
  lastPlayedAt: number;
}

export interface SessionStats {
  sessionId: string;
  startTime: number;
  endTime?: number;
  packId: string;
  mode: 'play' | 'challenge' | 'practice';
  sentencesCompleted: number;
  totalTimeSpent: number;
  hintsUsed: number;
  averageTimePerSentence: number;
  successRate: number; // 0-100
}

export interface GameMetrics {
  totalSessions: number;
  totalPlay time: number;
  totalSentencesCompleted: number;
  packsStarted: string[];
  packsCompleted: string[];
  averageSuccessRate: number;
  lastPlayedAt: number;
}
