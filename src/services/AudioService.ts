import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useSettings } from '../context/SettingsContext';

// Sound effects registry
export const SOUND_EFFECTS = {
  correct: 'correct_pop',
  incorrect: 'incorrect_boop',
  completion: 'completion_fanfare',
  hint: 'hint_chime',
  success: 'success_ding',
} as const;

class AudioManager {
  private sounds: { [key: string]: Audio.Sound } = {};
  private currentSound: Audio.Sound | null = null;

  async playSound(soundKey: string, volume: number = 0.8): Promise<void> {
    try {
      // Create a new sound for each play to avoid conflicts
      const { sound } = await Audio.Sound.createAsync(
        require(`../../assets/sounds/${soundKey}.mp3`),
        { shouldPlay: true, volume }
      );
      this.currentSound = sound;
      await sound.playAsync();
    } catch (error) {
      console.warn(`Error playing sound ${soundKey}:`, error);
    }
  }

  async stopSound(): Promise<void> {
    if (this.currentSound) {
      await this.currentSound.stopAsync();
      this.currentSound = null;
    }
  }

  async cleanup(): Promise<void> {
    for (const sound of Object.values(this.sounds)) {
      await sound.unloadAsync();
    }
    this.sounds = {};
  }
}

const audioManager = new AudioManager();

export const AudioService = {
  playCorrectSound: async (enabled: boolean = true) => {
    if (enabled && audioManager) {
      await audioManager.playSound(SOUND_EFFECTS.correct, 0.8);
    }
  },

  playIncorrectSound: async (enabled: boolean = true) => {
    if (enabled && audioManager) {
      await audioManager.playSound(SOUND_EFFECTS.incorrect, 0.6);
    }
  },

  playCompletionSound: async (enabled: boolean = true) => {
    if (enabled && audioManager) {
      await audioManager.playSound(SOUND_EFFECTS.completion, 1.0);
    }
  },

  playHintSound: async (enabled: boolean = true) => {
    if (enabled && audioManager) {
      await audioManager.playSound(SOUND_EFFECTS.hint, 0.7);
    }
  },

  stopCurrentSound: async () => {
    await audioManager.stopSound();
  },

  cleanup: async () => {
    await audioManager.cleanup();
  },
};

export const HapticsService = {
  playCorrectHaptic: async (enabled: boolean = true) => {
    if (enabled) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (e) {
        console.warn('Haptics not available', e);
      }
    }
  },

  playIncorrectHaptic: async (enabled: boolean = true) => {
    if (enabled) {
      try {
        await Haptics.selectionAsync();
      } catch (e) {
        console.warn('Haptics not available', e);
      }
    }
  },

  playCompletionHaptic: async (enabled: boolean = true) => {
    if (enabled) {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (e) {
        console.warn('Haptics not available', e);
      }
    }
  },

  playHintHaptic: async (enabled: boolean = true) => {
    if (enabled) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (e) {
        console.warn('Haptics not available', e);
      }
    }
  },
};

// Hook to use audio/haptics with settings
export const useAudioHaptics = () => {
  const { settings } = useSettings();

  return {
    playCorrect: () =>
      Promise.all([
        AudioService.playCorrectSound(settings.soundEnabled),
        HapticsService.playCorrectHaptic(settings.hapticsEnabled),
      ]),
    playIncorrect: () =>
      Promise.all([
        AudioService.playIncorrectSound(settings.soundEnabled),
        HapticsService.playIncorrectHaptic(settings.hapticsEnabled),
      ]),
    playCompletion: () =>
      Promise.all([
        AudioService.playCompletionSound(settings.soundEnabled),
        HapticsService.playCompletionHaptic(settings.hapticsEnabled),
      ]),
    playHint: () =>
      Promise.all([
        AudioService.playHintSound(settings.soundEnabled),
        HapticsService.playHintHaptic(settings.hapticsEnabled),
      ]),
  };
};
