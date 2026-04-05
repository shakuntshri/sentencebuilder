import { initializeStorage } from './StorageService';
import * as Font from 'expo-font';
import { Audio } from 'expo-av';

export const AppInitializer = {
  async initialize() {
    try {
      // Set up audio mode
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      // Load fonts
      await Font.loadAsync({
        // Add custom fonts here
        // 'custom-font': require('../../assets/fonts/custom-font.ttf'),
      });

      // Initialize local storage
      await initializeStorage();

      console.log('App initialization complete');
    } catch (error) {
      console.error('Error during app initialization:', error);
      throw error;
    }
  },
};
