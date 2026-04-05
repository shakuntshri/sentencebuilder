# Architecture Overview

## Project Structure & Design Philosophy

### Core Principles

1. **Separation of Concerns**: Game logic (context), UI (components), and services are separate
2. **Type Safety**: Full TypeScript for dev-time error detection
3. **Accessibility First**: All UI components built with a11y from the start
4. **Local-Only Data**: No external servers, all storage via AsyncStorage
5. **Performance**: Animations use native driver, minimal re-renders

---

## Layer Architecture

### 1. **Context (State Management)**

**Files**: `src/context/`

- **GameContext.tsx**: Manages game state (current sentence, selected words, score, etc.)
  - Uses useReducer for predictable state updates
  - Actions: START_GAME, SELECT_WORD, COMPLETE_WORD, NEXT_SENTENCE, etc.
  - Provides: `useGame()` hook for components

- **SettingsContext.tsx**: Manages user preferences and parent settings
  - Loads/saves from AsyncStorage on init
  - Settings: sound, haptics, font, difficulty, accessibility options
  - Parent settings: parental gate, hints, analytics toggle
  - Provides: `useSettings()` hook

### 2. **Services (Business Logic)**

**Files**: `src/services/`

- **AudioService.ts**: Audio playback
  - Methods: `playCorrectSound()`, `playIncorrectSound()`, `playCompletionSound()`, etc.
  - Uses: `expo-av` for sound playback
  - Hook export: `useAudioHaptics()` for convenient component usage

- **HapticsService.ts**: Haptic feedback
  - Methods: `playCorrectHaptic()`, `playIncorrectHaptic()`, etc.
  - Uses: `expo-haptics` for device vibration
  - Gracefully degrades on unsupported devices

- **StorageService.ts**: Local data persistence
  - Methods: `getPackProgress()`, `updatePackProgress()`, `saveSessionStats()`, etc.
  - Uses: AsyncStorage for local device storage
  - COPPA-compliant: only stores anonymous, local data

- **AppInitializer.ts**: App startup setup
  - Loads fonts, initializes audio mode
  - Called once in `App.tsx` before rendering

### 3. **Utilities (Pure Functions)**

**Files**: `src/utils/`

- **gameLogic.ts**: Game mechanics
  - `shuffleWords()`: Randomize word order
  - `isCorrectNextWord()`: Validate word selection
  - `calculateDifficulty()`: Determine sentence difficulty
  - `shouldShowHint()`: Decide when to show help
  - No side effects, fully testable

- **asyncStorage.ts**: Storage abstraction
  - Re-exports AsyncStorage for cleaner imports

### 4. **Data Models**

**Files**: `src/data/`, `src/types/`

- **sentencePacks.ts**: Game content
  - `STARTER_PACKS`: Array of 3+ starter packs
  - `getSentencesByPack()`, `getSentenceById()`: Query functions

- **game.ts**: TypeScript interfaces
  - `Sentence`, `Word`, `SentencePack`, `SessionStats`, `GameMetrics`
  - Single source of truth for type definitions

### 5. **Components (UI)**

**Files**: `src/components/`

- **WordTile.tsx**: Individual word button
  - Props: word, isSelected, showPartOfSpeech, onPress, isHinted
  - Handles: tap animation, color coding, accessibility labels
  - Uses: React.memo for optimization

- **SentenceBar.tsx**: Target sentence display
  - Shows: full sentence text, building sentence, progress bar
  - Animates: scale on new word added
  - Accessibility: announces sentence and progress

- **Confetti.tsx**: Celebration animation
  - Uses: Lottie (JSON animation)
  - Props: trigger, duration, onComplete
  - Non-blocking: pointerEvents="none"

- **FeedbackOverlay.tsx**: Status messages
  - Types: correct, incorrect, completion, hint
  - Auto-dismisses after duration
  - Centered overlay with animation

- **ControlButton.tsx**: Reusable button
  - Props: label, onPress, variant, size
  - Variants: primary, secondary, danger
  - Accessible: proper labels and disabled state

### 6. **Screens (Feature Containers)**

**Files**: `src/screens/`

- **HomeScreen.tsx**: Pack selection
  - Shows: list of available packs
  - Actions: start Play/Challenge/Practice mode
  - Navigation: to GameScreen, SettingsScreen

- **GameScreen.tsx**: Core gameplay
  - Manages: game loop, word selection, feedback
  - Uses: GameContext, useAudioHaptics, StorageService
  - Handles: inactivity hints, difficulty progression

- **SettingsScreen.tsx**: User preferences
  - Toggle: sound, haptics, accessibility options
  - Adjust: difficulty, font size, text visibility
  - Reset: all settings to default

- **ParentDashboardScreen.tsx**: Analytics & controls
  - Display: session history, statistics
  - Actions: reset data, toggle parent settings
  - Accessibility: behind optional parental math gate

### 7. **Navigation**

**Files**: `src/navigation/`

- **RootNavigator.tsx**: Screen stack
  - Uses: React Navigation (native-stack)
  - Screens: Home, Game, Settings, ParentDashboard
  - Props flow: navigation state → screen components

### 8. **Constants**

**Files**: `src/constants/`

- **theme.ts**: Design tokens
  - Colors, spacing, font sizes, border radii
  - Animation durations
  - Game mechanics config (hint delays, tile sizes, etc.)
  - Haptic patterns, audio volumes

---

## Data Flow

### Game Initialization → Sentence Selection → Word Tapping

```
App.tsx
  ↓
GameProvider, SettingsProvider
  ↓
RootNavigator
  ↓
HomeScreen
  │
  └─> onStartGame(packId, mode)
       ↓
    GameScreen
      ├─ GameContext (game state)
      ├─ SettingsContext (user prefs)
      ├─ useAudioHaptics (audio/haptics)
      ├─ StorageService (save progress)
      │
      └─ Components
         ├─ SentenceBar (display sentence)
         ├─ WordTile[] (word buttons)
         ├─ FeedbackOverlay (status)
         ├─ Confetti (celebration)
```

### Word Tap → Validation → Feedback

```
WordTile onPress(wordIndex)
  ↓
GameScreen.handleWordTap()
  ├─ gameLogic.isCorrectNextWord() → boolean
  ├─ useAudioHaptics.playCorrect() / playIncorrect()
  ├─ GameContext.completeWord()
  ├─ Set FeedbackOverlay state
  └─ Check if sentence complete
      └─ Confetti.trigger + playCompletion()
```

### Settings Update → Local Storage

```
SettingsScreen
  └─> useSettings.updateSettings(partialSettings)
       ↓
     AsyncStorage.setItem()
       ↓
     SettingsContext state updated
       ↓
     All consuming components re-render
```

---

## Performance Optimization Strategies

### Component Memoization
```typescript
// Avoid re-render if props unchanged
export const WordTile: React.FC<WordTileProps> = memo(({ word, ... }) => {
  // ...
});
```

### Native Driver Animations
```typescript
// Use native thread, not JS thread
Animated.timing(scaleAnim, {
  toValue: 1,
  duration: 200,
  useNativeDriver: true, // ← Key for performance
}).start();
```

### Lazy Loading
- Sentence packs load on demand in GameScreen
- Audio files created on-the-fly (not pre-cached)

### State Normalization
- GameContext: only store what's essential
- Don't duplicate data (e.g., don't store both word array and selected indices redundantly)

---

## Error Handling

### Try-Catch Blocks
- StorageService methods wrap AsyncStorage calls
- AudioService methods catch playback errors gracefully
- HapticsService catches device support errors

### Loggers
- Console.warn for non-critical issues
- Console.error for critical failures
- Store for future crash reporting (if added)

### Graceful Degradation
```typescript
// If haptics not supported, continue without error
try {
  await Haptics.impactAsync(...);
} catch (e) {
  console.warn('Haptics not available');
}
```

---

## Testing Strategy

### Unit Tests (gameLogic.ts)
```typescript
describe('gameLogic', () => {
  test('shuffleWords changes position of first word', () => {
    const words = [{ index: 0 }, { index: 1 }, ...];
    const shuffled = shuffleWords(words);
    expect(shuffled[0].index).not.toBe(0);
  });
  
  test('isCorrectNextWord validates selection', () => {
    const result = isCorrectNextWord(1, [0], words);
    expect(result).toBe(true);
  });
});
```

### Component Tests
- Snapshot tests for layout
- Interaction tests for button presses
- Accessibility tests using jest-axe

### Integration Tests
- Full game loop: load pack → select words → complete → next
- Settings: update setting → verify persisted → reload app

### E2E Tests (Detox or Maestro)
- On real device/emulator
- User journey: home → select pack → play → dashboard

---

## Scalability Considerations

### Adding New Game Modes
1. Add mode type to `Game` types
2. Create new screen in `src/screens/`
3. Extend GameContext with mode-specific logic
4. Update RootNavigator to route to new screen

### Expanding Content
- New packs in `sentencePacks.ts` (no code changes needed if format consistent)
- Easy to add 100+ sentences without performance hit

### Multi-Language Support (Future)
- Add locale to SettingsContext
- Store sentences with translations
- Use i18n library (e.g., react-i18next)

### Offline Sync (Future)
- Track pending changes in context
- When online, push to backend
- No changes needed to current architecture

---

## Security Considerations

### COPPA/GDPR-K Compliance
- ✅ No personal data collection
- ✅ Local-only storage
- ✅ No third-party trackers
- ✅ Parental gate for settings export

### Data Safety
- AsyncStorage encrypted on iOS, unencrypted on Android (user responsibility)
- Consider MMKV library for Android encryption in future
- No external API calls

### Code Security
- No API keys in source (all config local)
- Dependency scanning via npm audit
- No known vulnerable packages in current stack

---

## Directory Structure Rationale

```
src/
├── components/      # Pure UI, no logic
├── context/         # Global state
├── screens/         # Full-screen features
├── services/        # Business logic, external APIs
├── data/            # Constants, game content
├── types/           # Shared TypeScript definitions
├── utils/           # Pure helper functions
├── constants/       # Theme, config
├── navigation/      # Screen routing
└── hooks/           # Custom React hooks (future)
```

**Benefits**:
- Clear separation of concerns
- Easy to locate and modify features
- Testable in isolation
- Scalable as code grows

---

## Key Dependencies

| Package | Purpose | Version |
|---------|---------|---------|
| `expo` | React Native framework | ^50.0 |
| `react-native` | Native platform bridge | ^0.73 |
| `@react-navigation/native` | Screen routing | ^6.1 |
| `expo-av` | Audio/video playback | ^13.10 |
| `expo-haptics` | Haptic feedback | ^12.8 |
| `lottie-react-native` | Animation library | ^6.4 |
| `@react-native-async-storage/async-storage` | Local storage | ^1.21 |

---

**Last Updated**: March 2026
