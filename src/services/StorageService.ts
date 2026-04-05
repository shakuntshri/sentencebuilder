import AsyncStorage from '@react-native-async-storage/async-storage';
import { PackProgress, SessionStats, GameMetrics } from '../types/game';
import { generateSessionId } from '../utils/gameLogic';

const PACK_PROGRESS_KEY = 'sentencebuilder_pack_progress';
const SESSION_STATS_KEY = 'sentencebuilder_session_stats';
const GAME_METRICS_KEY = 'sentencebuilder_game_metrics';

export const StorageService = {
  // Pack Progress
  async getPackProgress(packId: string): Promise<PackProgress | null> {
    try {
      const data = await AsyncStorage.getItem(`${PACK_PROGRESS_KEY}_${packId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting pack progress:', error);
      return null;
    }
  },

  async updatePackProgress(packId: string, progress: Partial<PackProgress>): Promise<void> {
    try {
      const existing = await this.getPackProgress(packId);
      const updated: PackProgress = {
        packId,
        completedSentences: existing?.completedSentences ?? 0,
        averageTimePerSentence: existing?.averageTimePerSentence ?? 0,
        mistakesCount: existing?.mistakesCount ?? 0,
        rating: existing?.rating ?? 0,
        lastPlayedAt: Date.now(),
        ...progress,
      };
      await AsyncStorage.setItem(`${PACK_PROGRESS_KEY}_${packId}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating pack progress:', error);
    }
  },

  async getAllPackProgress(): Promise<PackProgress[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const packKeys = keys.filter((k) => k.startsWith(PACK_PROGRESS_KEY));
      const results = await AsyncStorage.multiGet(packKeys);
      return results
        .map(([, value]) => (value ? JSON.parse(value) : null))
        .filter((v): v is PackProgress => v !== null);
    } catch (error) {
      console.error('Error getting all pack progress:', error);
      return [];
    }
  },

  // Session Stats
  async saveSessionStats(stats: SessionStats): Promise<void> {
    try {
      const key = `${SESSION_STATS_KEY}_${stats.sessionId}`;
      await AsyncStorage.setItem(key, JSON.stringify(stats));

      // Update game metrics
      await this.updateGameMetrics(stats);
    } catch (error) {
      console.error('Error saving session stats:', error);
    }
  },

  async getSessionStats(sessionId: string): Promise<SessionStats | null> {
    try {
      const key = `${SESSION_STATS_KEY}_${sessionId}`;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting session stats:', error);
      return null;
    }
  },

  async getAllSessionStats(): Promise<SessionStats[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const sessionKeys = keys.filter((k) => k.startsWith(SESSION_STATS_KEY));
      const results = await AsyncStorage.multiGet(sessionKeys);
      return results
        .map(([, value]) => (value ? JSON.parse(value) : null))
        .filter((v): v is SessionStats => v !== null);
    } catch (error) {
      console.error('Error getting all session stats:', error);
      return [];
    }
  },

  // Game Metrics
  async getGameMetrics(): Promise<GameMetrics | null> {
    try {
      const data = await AsyncStorage.getItem(GAME_METRICS_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting game metrics:', error);
      return null;
    }
  },

  async updateGameMetrics(sessionStats: SessionStats): Promise<void> {
    try {
      const existing = await this.getGameMetrics();
      const metrics: GameMetrics = {
        totalSessions: (existing?.totalSessions ?? 0) + 1,
        totalPlayTime: (existing?.totalPlayTime ?? 0) + sessionStats.totalTimeSpent,
        totalSentencesCompleted:
          (existing?.totalSentencesCompleted ?? 0) + sessionStats.sentencesCompleted,
        packsStarted: existing?.packsStarted ?? [],
        packsCompleted: existing?.packsCompleted ?? [],
        averageSuccessRate: sessionStats.successRate,
        lastPlayedAt: Date.now(),
      };

      // Track pack starts and completions
      if (!metrics.packsStarted.includes(sessionStats.packId)) {
        metrics.packsStarted.push(sessionStats.packId);
      }

      await AsyncStorage.setItem(GAME_METRICS_KEY, JSON.stringify(metrics));
    } catch (error) {
      console.error('Error updating game metrics:', error);
    }
  },

  async resetLocalData(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const dataKeys = keys.filter(
        (k) =>
          k.startsWith(PACK_PROGRESS_KEY) ||
          k.startsWith(SESSION_STATS_KEY) ||
          k === GAME_METRICS_KEY
      );
      await AsyncStorage.multiRemove(dataKeys);
    } catch (error) {
      console.error('Error resetting local data:', error);
    }
  },
};

// Initialize storage with default values if not present
export const initializeStorage = async () => {
  try {
    const metrics = await StorageService.getGameMetrics();
    if (!metrics) {
      await StorageService.updateGameMetrics({
        sessionId: generateSessionId(),
        startTime: Date.now(),
        packId: '',
        mode: 'play',
        sentencesCompleted: 0,
        totalTimeSpent: 0,
        hintsUsed: 0,
        averageTimePerSentence: 0,
        successRate: 0,
      });
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};
