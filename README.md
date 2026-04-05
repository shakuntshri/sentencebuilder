# Tap & Tell: Sentence Builder - Documentation

## Overview

**Tap & Tell: Sentence Builder** is a kid-safe mobile game designed for children ages 4–6 to develop early literacy skills through interactive sentence building. The core gameplay involves tapping word tiles in the correct sequence to form sentences, with immediate audio, haptic, and visual feedback.

### Key Features

- ✨ **Engaging Gameplay**: Tap word tiles to build sentences with instant feedback
- 🎵 **Multi-sensory Feedback**: Sound effects, haptics, and celebratory animations
- ♿ **Accessibility First**: Dyslexia-friendly fonts, high contrast, screen reader support
- 👨‍👩‍👧 **Parent Dashboard**: Track progress, manage settings, view analytics (offline-only)
- 🎨 **Bright & Friendly UI**: Colorful rounded shapes, age-appropriate design
- 🔒 **Privacy-First**: No ads, no tracking, all data stored locally
- 📱 **Cross-Platform**: iOS and Android (phones and tablets)

---

## Project Structure

```
sentencebuilder/
├── App.tsx                          # Main app entry point
├── app.json                         # Expo config
├── package.json                     # Dependencies
├── assets/
│   ├── animations/
│   │   └── confetti.json           # Lottie confetti animation
│   ├── sounds/
│   │   ├── correct_pop.mp3         # Sound effect: correct selection
│   │   ├── incorrect_boop.mp3      # Sound effect: wrong selection
│   │   ├── completion_fanfare.mp3  # Sound effect: sentence complete
│   │   ├── hint_chime.mp3          # Sound effect: hint revealed
│   │   └── success_ding.mp3        # Sound effect: general success
│   └── images/
│       └── (icon, splash, etc.)
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── WordTile.tsx            # Individual word button
│   │   ├── SentenceBar.tsx         # Target sentence display
│   │   ├── Confetti.tsx            # Celebration animation
│   │   ├── FeedbackOverlay.tsx     # Status messages
│   │   └── ControlButton.tsx       # Reusable button
│   ├── context/                     # Global state management
│   │   ├── GameContext.tsx         # Game state & logic
│   │   └── SettingsContext.tsx     # User preferences
│   ├── screens/                     # App screens
│   │   ├── HomeScreen.tsx          # Pack selection
│   │   ├── GameScreen.tsx          # Main gameplay
│   │   ├── SettingsScreen.tsx      # User settings
│   │   └── ParentDashboardScreen.tsx # Analytics & parent controls
│   ├── navigation/
│   │   └── RootNavigator.tsx       # Screen navigation
│   ├── services/                    # Business logic
│   │   ├── AudioService.ts         # Sound & haptics
│   │   ├── StorageService.ts       # Local data persistence
│   │   └── AppInitializer.ts       # Startup initialization
│   ├── data/
│   │   └── sentencePacks.ts        # Game content data
│   ├── types/
│   │   └── game.ts                 # TypeScript interfaces
│   ├── constants/
│   │   └── theme.ts                # Colors, sizes, durations
│   ├── utils/
│   │   ├── gameLogic.ts            # Game mechanics functions
│   │   └── asyncStorage.ts         # Storage utilities
│   └── hooks/                       # Custom React hooks (future expansion)
└── docs/
    ├── ARCHITECTURE.md              # Code structure overview
    ├── GAMEPLAY.md                  # Core game mechanics
    ├── ACCESSIBILITY.md             # Accessibility features
    └── SENTENCE_FORMAT.md           # How to add new sentences
```

---

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode (for building to iOS)
- Android: Android Studio (for building to Android)

### Installation

```bash
cd sentencebuilder
npm install
```

### Running the App

```bash
# Start Expo dev server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web (development only)
npm run web
```

---

## Core Game Loop

1. **Initialization**: Load a sentence pack and shuffle the first sentence's words
2. **Word Selection**: Child taps word tiles in the order suggested by the sentence
3. **Feedback**: 
   - ✅ **Correct**: Pop sound + light haptic + tile animates into sentence bar
   - ❌ **Incorrect**: Boop sound + gentle haptic + shake animation
4. **Completion**: When all words are selected in order:
   - Full sentence animates
   - Voiceover reads the complete sentence
   - Confetti burst animation
   - Celebration sound + medium haptic
   - Star/coin reward
   - Auto-advance to next sentence or prompt for next
5. **Progression**: After 2–3 successful sentences, difficulty increases

---

## Game Features

### Game Modes

#### Play
- Continuous stream of sentences
- Adaptive difficulty
- No time limit per sentence
- Hints available after 3 seconds without interaction

#### Challenges (Future)
- Themed 5-sentence mini-packs
- Timed mode (2–3 min per pack)
- Leaderboard/star rating

#### Practice
- Parent selects specific packs (sight words, color words, etc.)
- Adjustable difficulty
- Detailed feedback

### Difficulty System

- **Levels**: Easy → Medium → Hard
- **Easy**: 3–4 words, high-frequency sight words
- **Medium**: 4–5 words, adjectives, prepositions
- **Hard**: 5–6 words, complex grammar
- **Adaptation**: Difficulty increases after +15 points; decreases after 3 consecutive errors

### Hints & Help

- **Inactivity Hint** (3s): Subtle glow on next correct word
- **Helper Hint** (6s): Next word animates briefly to show position
- **Error-Based Hint** (2+ consecutive errors): Auto-enable next-word glow
- **Toggle**: Parents can disable hints in settings

---

## Accessibility Features

### Visual
- **High Contrast Mode**: Increases border widths, darkens colors
- **Dyslexia-Friendly Font**: OpenDyslexic-like or high-readable sans-serif
- **Adjustable Text Size**: Small, Medium, Large
- **Bold Indicators**: Non-color-dependent visual cues

### Audio
- **Voiceover**: Target sentence read aloud
- **Sound Effects**: Can be toggled on/off
- **Haptic Feedback**: Customizable (Light, Selection, Success patterns)

### Screen Reader
- **Labels**: All buttons and interactive elements have `accessibilityLabel`
- **Roles**: Proper `accessibilityRole` attributes
- **Hints**: Contextual help text (e.g., "Double tap to select")
- **Announcements**: Status updates (e.g., "3 of 4 words completed")

---

## Parent Dashboard

Located in Settings, behind optional parental gate (math-based COPPA-compliant).

### Features
- **Session Analytics**: Time spent, sentences completed, success rate
- **Pack Progress**: Which packs accessed, average difficulty rating
- **Streak Tracking**: Consecutive days played (future feature)
- **Settings Control**: 
  - Disable hints
  - Set difficulty level
  - Toggle sound/haptics
  - Enable color-coded parts of speech
- **Data Management**: Reset progress, view trends

### Privacy
- ✅ All data stored **locally** on device (AsyncStorage)
- ✅ No cloud sync, no external servers
- ✅ No behavioral tracking
- ✅ No user identification (anonymous)
- ✅ COPPA/GDPR-K compliant

---

## Local Storage Schema

### Settings (AsyncStorage Key: `sentencebuilder_settings`)
```typescript
{
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
```

### Pack Progress (AsyncStorage Key: `sentencebuilder_pack_progress_<packId>`)
```typescript
{
  packId: string;
  completedSentences: number;
  averageTimePerSentence: number;
  mistakesCount: number;
  rating: number; // 0-100 (for difficulty scaling)
  lastPlayedAt: number; // timestamp
}
```

### Session Stats (AsyncStorage Key: `sentencebuilder_session_stats_<sessionId>`)
```typescript
{
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
```

### Game Metrics (AsyncStorage Key: `sentencebuilder_game_metrics`)
```typescript
{
  totalSessions: number;
  totalPlayTime: number;
  totalSentencesCompleted: number;
  packsStarted: string[];
  packsCompleted: string[];
  averageSuccessRate: number;
  lastPlayedAt: number;
}
```

---

## Adding New Sentence Packs

See [SENTENCE_FORMAT.md](./docs/SENTENCE_FORMAT.md) for detailed instructions.

### Quick Example

```typescript
const newPack: SentencePack = {
  id: 'pack_colors',
  name: 'Color Words',
  description: 'Learn about colors',
  difficulty: 'easy',
  ageGroup: '4-6',
  theme: 'colors',
  requiresUnlock: false,
  sentences: [
    {
      id: 'sent_101',
      text: 'The apple is red.',
      words: [
        { id: 'w1', text: 'The', index: 0, partOfSpeech: 'function' },
        { id: 'w2', text: 'apple', index: 1, partOfSpeech: 'noun' },
        { id: 'w3', text: 'is', index: 2, partOfSpeech: 'verb' },
        { id: 'w4', text: 'red', index: 3, partOfSpeech: 'adjective' },
      ],
      difficulty: 'easy',
      packId: 'pack_colors',
      category: 'colors',
    },
    // ... more sentences
  ],
};
```

---

## Configuration & Customization

### Theme (src/constants/theme.ts)
- **Colors**: Primary, secondary, accent, status colors, parts of speech
- **Spacing**: xs, sm, md, lg, xl, xxl, xxxl
- **Font Sizes**: 10px to 48px
- **Border Radius**: small, medium, large, round
- **Animation Durations**: instant to slowest

### Game Config (src/constants/theme.ts)
```typescript
GAME_CONFIG = {
  MIN_SENTENCE_LENGTH: 3,      // Min words per sentence
  MAX_SENTENCE_LENGTH: 6,      // Max words per sentence
  HINT_DELAY: 3000,            // ms before hint glow appears
  HELPER_HINT_DELAY: 6000,     // ms before helper animation
  COMPLETION_CELEBRATION_DURATION: 1200, // Confetti duration
  DIFFICULTY_THRESHOLD: 15,    // Points to adjust difficulty
  CONSECUTIVE_ERRORS_FOR_HINT: 2, // Errors before hint
  INACTIVITY_TIMEOUT: 30000,   // ms before auto-skip sentence
  BOX_SIZE_MIN: 56,            // Accessibility min tap target
  BOX_SIZE_MAX: 80,            // Max tile size
};
```

---

## Performance Optimization

- **Lazy Loading**: Sentence packs load on demand
- **Memoization**: Components memoized to prevent unnecessary re-renders
- **Animation Efficiency**: Native driver animations for Flick/scroll performance
- **Memory Management**: Audio resources cleaned up after use
- **Storage Limits**: Session stats capped at 100 entries per pack

---

## Testing Guidance

### Automated Tests (Future)
- Unit tests for game logic (`gameLogic.ts`)
- Component snapshot tests
- Integration tests for navigation
- E2E tests for core gameplay loop

### Manual Testing Checklist
- [ ] Tap mechanics work on hardware with varied screen sizes
- [ ] Audio/haptics respond within 50ms
- [ ] 30-minute continuous session: no crashes, memory stable
- [ ] All tap targets ≥56dp, accessible
- [ ] Color contrast meets WCAG AA standard
- [ ] Parental gate math challenge is solvable
- [ ] Local data persists across app restart

---

## Troubleshooting

### App Won't Start
- Clear Expo cache: `expo logout && expo login`
- Delete `node_modules` and `package-lock.json`, reinstall
- Check for native module issues in logs

### Audio/Haptics Not Working
- Verify device sound/haptics are enabled
- Check `AudioService` is initialized in `AppInitializer.ts`
- Test on physical device (simulators may not support haptics)

### High Memory Usage
- Profile with React DevTools
- Check for memory leaks in animation cleanup
- Limit in-flight sound effects to 3 simultaneous

### Sentence Packs Not Loading
- Verify pack IDs in `sentencePacks.ts`
- Check `getSentencesByPack()` returns non-empty array
- Log `currentSentence` state in GameScreen

---

## Future Enhancements

- [ ] Leaderboard/achievements system
- [ ] Voiceover customization (multiple voices)
- [ ] More advanced grammar (plurals, tenses)
- [ ] Multiplayer co-op mode
- [ ] Themed challenges (seasonal, holiday)
- [ ] Badge/reward system
- [ ] Parent export (analytics as PDF)
- [ ] A/B testing framework
- [ ] Machine learning difficulty adaptation
- [ ] Subscription unlock model (Optional)

---

## License & Attribution

This project is designed with accessibility and child safety as core principles. All third-party libraries are MIT or compatible open-source licenses.

### Key Libraries
- **Expo**: React Native framework
- **React Navigation**: Screen management
- **Lottie**: Animation library
- **AsyncStorage**: Local data persistence
- **Zustand** (if added): State management

---

## Support & Feedback

For bugs, feature requests, or accessibility feedback, please document:
1. **Device & OS**: iPhone 12 iOS 16, Samsung Galaxy S21 Android 12, etc.
2. **App Version**: Find in Settings
3. **Reproducible Steps**: Exact sequence to trigger issue
4. **Expected vs. Actual**: What should happen vs. what did

---

**Last Updated**: March 2026  
**Current Version**: 0.1.0 (Vertical Slice)
