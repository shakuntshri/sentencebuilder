import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SettingsState {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  dyslexiaFont: boolean;
  showTextPrompt: boolean;
  voiceType: 'adult' | 'child';
  voiceSpeed: number; // 0.75 to 1.5
}

interface ParentSettings {
  parentalGateEnabled: boolean;
  hintsEnabled: boolean;
  maxHintsPerSentence: number;
  showPartsOfSpeech: boolean;
  analyticsEnabled: boolean;
}

interface SettingsContextType {
  settings: SettingsState;
  parentSettings: ParentSettings;
  updateSettings: (settings: Partial<SettingsState>) => Promise<void>;
  updateParentSettings: (settings: Partial<ParentSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultSettings: SettingsState = {
  soundEnabled: true,
  hapticsEnabled: true,
  difficultyLevel: 'easy',
  fontSize: 'medium',
  highContrast: false,
  dyslexiaFont: false,
  showTextPrompt: true,
  voiceType: 'adult',
  voiceSpeed: 1,
};

const defaultParentSettings: ParentSettings = {
  parentalGateEnabled: true,
  hintsEnabled: true,
  maxHintsPerSentence: 2,
  showPartsOfSpeech: false,
  analyticsEnabled: true,
};

const SETTINGS_STORAGE_KEY = 'sentencebuilder_settings';
const PARENT_SETTINGS_STORAGE_KEY = 'sentencebuilder_parent_settings';

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [parentSettings, setParentSettings] = useState<ParentSettings>(defaultParentSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from AsyncStorage on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const [savedSettings, savedParentSettings] = await Promise.all([
          AsyncStorage.getItem(SETTINGS_STORAGE_KEY),
          AsyncStorage.getItem(PARENT_SETTINGS_STORAGE_KEY),
        ]);

        if (savedSettings) {
          setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
        }
        if (savedParentSettings) {
          setParentSettings({ ...defaultParentSettings, ...JSON.parse(savedParentSettings) });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoaded(true);
      }
    }

    loadSettings();
  }, []);

  const updateSettings = useCallback(
    async (newSettings: Partial<SettingsState>) => {
      try {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error updating settings:', error);
      }
    },
    [settings]
  );

  const updateParentSettings = useCallback(
    async (newSettings: Partial<ParentSettings>) => {
      try {
        const updated = { ...parentSettings, ...newSettings };
        setParentSettings(updated);
        await AsyncStorage.setItem(PARENT_SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error updating parent settings:', error);
      }
    },
    [parentSettings]
  );

  const resetSettings = useCallback(async () => {
    try {
      setSettings(defaultSettings);
      setParentSettings(defaultParentSettings);
      await Promise.all([
        AsyncStorage.removeItem(SETTINGS_STORAGE_KEY),
        AsyncStorage.removeItem(PARENT_SETTINGS_STORAGE_KEY),
      ]);
    } catch (error) {
      console.error('Error resetting settings:', error);
    }
  }, []);

  if (!isLoaded) {
    return null;
  }

  const value: SettingsContextType = {
    settings,
    parentSettings,
    updateSettings,
    updateParentSettings,
    resetSettings,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
