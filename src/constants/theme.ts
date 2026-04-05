// Color scheme for UI
export const COLORS = {
  // Primary colors
  primary: '#6366f1', // Indigo
  secondary: '#ec4899', // Pink
  accent: '#f59e0b', // Amber

  // Status colors
  success: '#10b981', // Green
  error: '#ef4444', // Red
  warning: '#f97316', // Orange
  info: '#3b82f6', // Blue

  // Parts of speech colors
  partOfSpeech: {
    noun: '#3b82f6', // Blue
    verb: '#ef4444', // Red
    adjective: '#10b981', // Green
    function: '#a78bfa', // Purple
  },

  // Neutral colors
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Backgrounds
  bgLight: '#fafafa',
  bgDark: '#ffffff',
};

// Font sizes for different screen sizes
export const FONT_SIZES = {
  tiny: 10,
  small: 12,
  smallMedium: 14,
  medium: 16,
  largeSmall: 18,
  large: 20,
  extraLarge: 24,
  huge: 32,
  giant: 48,
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Border radius
export const RADIUS = {
  small: 8,
  medium: 12,
  large: 16,
  round: 999,
};

// Animation durations (ms)
export const DURATIONS = {
  instant: 0,
  superQuick: 100,
  quick: 200,
  normal: 300,
  slow: 400,
  slower: 500,
  verySlow: 800,
  slowest: 1200,
};

// Game mechanics
export const GAME_CONFIG = {
  MIN_SENTENCE_LENGTH: 3,
  MAX_SENTENCE_LENGTH: 6,
  HINT_DELAY: 3000, // ms before hint appears
  HELPER_HINT_DELAY: 6000, // ms before helper animation
  COMPLETION_CELEBRATION_DURATION: 1200, // ms
  DIFFICULTY_THRESHOLD: 15, // points to adjust difficulty
  CONSECUTIVE_ERRORS_FOR_HINT: 2,
  INACTIVITY_TIMEOUT: 30000, // ms before moving to next sentence auto
  BOX_SIZE_MIN: 56, // dp, accessibility minimum
  BOX_SIZE_MAX: 80, // dp
};

// Haptic patterns
export const HAPTICS = {
  success: 'light',
  error: 'selection',
  completion: 'success',
  hint: 'light',
};

// Sound volumes
export const AUDIO_VOLUMES = {
  normal: 0.8,
  quiet: 0.5,
  loud: 1.0,
};
