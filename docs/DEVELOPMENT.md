# Development Getting Started Guide

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd sentencebuilder
npm install
```

### 2. Start Dev Server
```bash
npm start
```

### 3. Run on Simulator
```bash
# iOS
npm run ios

# Android
npm run android
```

### 4. Test in App
- See HomeScreen with 3 starter packs
- Tap "Play" on any pack
- Select words in order
- Observe feedback (sounds, haptics, animations)

---

## Project Walkthrough

### Key Files to Understand First

1. **[App.tsx](../App.tsx)** - App entry, provider setup
2. **[src/context/GameContext.tsx](../src/context/GameContext.tsx)** - Game state management
3. **[src/screens/GameScreen.tsx](../src/screens/GameScreen.tsx)** - Core gameplay
4. **[src/components/WordTile.tsx](../src/components/WordTile.tsx)** - Word button component
5. **[src/data/sentencePacks.ts](../src/data/sentencePacks.ts)** - Game content

### Reading Order

**Understanding the Architecture** (30 min):
1. Read [docs/ARCHITECTURE.md](ARCHITECTURE.md) (overview)
2. Skim [src/types/game.ts](../src/types/game.ts) (data structures)
3. Review [src/constants/theme.ts](../src/constants/theme.ts) (design tokens)

**Understanding the Gameplay** (30 min):
1. Read [docs/GAMEPLAY.md](GAMEPLAY.md) (mechanics)
2. Trace GameScreen → WordTile flow
3. Review GameContext reducer logic

**Adding Content** (20 min):
1. Read [docs/SENTENCE_FORMAT.md](SENTENCE_FORMAT.md)
2. Add 5 sentences to a new pack in `sentencePacks.ts`
3. Test in-app

---

##Common Tasks

### Add a New Sentence Pack

1. **Create pack object** in `src/data/sentencePacks.ts`:
```typescript
const pack: SentencePack = {
  id: 'pack_colors',
  name: 'Color Words',
  ...
  sentences: [ ... ]
};
```

2. **Add to STARTER_PACKS array**:
```typescript
export const STARTER_PACKS: SentencePack[] = [
  ...STARTER_PACKS,
  pack,  // ← Add here
];
```

3. **Test**:
   - Run `npm start`
   - Verify pack appears on HomeScreen
   - Play 1–2 sentences

### Adjust a Game Mechanic

**Example**: Increase hint delay from 3s → 5s

1. **Find constant** in `src/constants/theme.ts`:
```typescript
HINT_DELAY: 3000, // ← Change to 5000
```

2. **Test in GameScreen**:
   - Start game
   - Wait 5 seconds without tapping
   - Verify hint glow appears

### Modify Accessibility Settings

1. **Find toggle** in `src/screens/SettingsScreen.tsx`
2. **Connect to useSettings() hook**:
```typescript
const { settings, updateSettings } = useSettings();

<Switch 
  value={settings.dyslexiaFont}
  onValueChange={(v) => updateSettings({ dyslexiaFont: v })}
/>
```
3. **Use in component**:
```typescript
// In WordTile.tsx
fontFamily: settings.dyslexiaFont ? 'OpenDyslexic' : 'System'
```

### Add Sound Effect

1. **Place audio file** in `assets/sounds/new_sound.mp3`
2. **Reference in AudioService**:
```typescript
export const SOUND_EFFECTS = {
  myNewSound: 'new_sound', // ← Add here
};
```
3. **Use in component**:
```typescript
const { playSound } = useAudioHaptics();
await audioManager.playSound('new_sound', 0.8);
```

---

## Testing Workflows

### Manual Game Loop Test

```
1. Open HomeScreen
2. Select "Animal Friends" → Play
3. Read sentence text (or listen to audio)
4. Tap words in correct order:
   - Correct tap: hear pop, feel haptic, word animates into sentence bar
   - Wrong tap: hear boop, feel selection, word shakes
5. Complete sentence: hear fanfare, feel success haptic, watch confetti
6. Tap "Next": advance to next sentence
7. Tap "Reset": clear selection without advancing
```

**Expected**: ~30 seconds per sentence, no crashes, smooth animations

### Accessibility QA

```bash
# iOS
1. Settings → Accessibility → VoiceOver → On
2. Launch app
3. Swipe to navigate
4. Double-tap to interact
5. Verify all UI elements announced clearly

# Android
1. Settings → Accessibility → TalkBack → On
2. Launch app
3. Swipe to navigate
4. Double-tap to interact
5. Verify all UI elements announced clearly
```

### Performance Check

```
1. Xcode → Debug → View Hierarchy
2. Check for unnecessary re-renders
3. Use React Profiler: npx react-devtools
4. Monitor frame rate (target: 60fps)
```

---

## Debugging Tips

### App Won't Start

**Error**: "Cannot find module 'expo'"
```bash
rm -rf node_modules
npm install
npm start
```

**Error**: "Native module not found"
```bash
expo prebuild --clean
expo start
```

### Audio/Haptics Not Working

**Check**: 
```typescript
// In AudioService.ts
// Verify audio player initialized
console.log(audioManager); // Should exist

// In HapticsService.ts
// Verify device supports haptics
try {
  await Haptics.impactAsync(...);
} catch (e) {
  console.log('Haptics unavailable:', e);
}
```

**Test**: Use device, not simulator (simulators don't support haptics)

### Game Performance Slow

**Profile**:
```bash
# Enable profiling
React.Profiler (use Chrome DevTools)

# Check memory
Android Studio → Profiler tab
Xcode → Memory Report
```

**Optimize**:
- Memoize components: `memo(Component)`
- Use native driver: `useNativeDriver: true`
- Limit concurrent animations

### Screen Reader Not Announcing

**Check accessibility attributes**:
```typescript
<TouchableOpacity
  accessibilityRole="button"           // ← Required
  accessibilityLabel="Word: cat"       // ← Required
  accessibilityHint="Tap to select"    // ← Optional but helpful
/>
```

**Test**:
```bash
# iOS: Enable VoiceOver (triple-tap home button)
# Android: Enable TalkBack (Vol + Vol or Settings)
# Navigate UI, listen for announcements
```

---

## Common Code Patterns

### Update Game State

```typescript
import { useGame } from '../context/GameContext';

export const MyComponent = () => {
  const { state, selectWord, completeWord, nextSentence } = useGame();

  const handleTap = (wordIndex: number) => {
    selectWord(wordIndex);
    // Later:
    completeWord(wordIndex, true); // true = correct
    // Next sentence:
    nextSentence(newSentence);
  };
};
```

### Use Settings

```typescript
import { useSettings } from '../context/SettingsContext';

export const MyComponent = () => {
  const { settings, updateSettings } = useSettings();

  // Read
  console.log(settings.soundEnabled);

  // Update
  await updateSettings({ soundEnabled: false });

  // Render based on setting
  return settings.highContrast ? <HighContrastUI /> : <NormalUI />;
};
```

### Play Feedback

```typescript
import { useAudioHaptics } from '../services/AudioService';

export const MyComponent = () => {
  const { playCorrect, playIncorrect } = useAudioHaptics();

  // On correct selection
  await playCorrect(); // Sound + haptic

  // On error
  await playIncorrect(); // Different sound + haptic
};
```

### Save Data

```typescript
import { StorageService } from '../services/StorageService';

// Save session
await StorageService.saveSessionStats({
  sessionId: 'sess_123',
  startTime: Date.now(),
  packId: 'pack_animals',
  mode: 'play',
  sentencesCompleted: 10,
  // ...
});

// Load progress
const progress = await StorageService.getPackProgress('pack_animals');
console.log(progress.rating); // 0-100
```

---

## File Organization Best Practices

### Adding a New Feature

1. **Create feature branch**:
```bash
git checkout -b feature/my-feature
```

2. **Add files in correct directories**:
   - Component: `src/components/MyComponent.tsx`
   - Screen: `src/screens/MyScreen.tsx`
   - Logic: `src/utils/myLogic.ts` or `src/services/MyService.ts`
   - Types: Add to `src/types/game.ts`

3. **Update imports**:
   - Create `index.ts` in directory if needed
   - Import from `../components` or `../services` (relative paths)

4. **Test**:
```bash
npm start
# Test feature in simulator
```

5. **Commit**:
```bash
git add .
git commit -m "feat: add my feature"
git push origin feature/my-feature
```

---

## Performance Benchmarks (Target)

| Metric | Target | Tool |
|--------|--------|------|
| App startup | <3 seconds | Xcode/Android Studio |
| Screen transition | <200ms | Chrome DevTools frame rate |
| Tap → sound play | <50ms | Manual testing + logs |
| 60+ FPS gameplay | 60fps | React DevTools Profiler |
| Memory (after 30 min) | <100MB | Xcode Memory Report |
| Language pack load | <500ms | Console timing logs |

---

## Resources

### React Native
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Hooks](https://react.dev/reference/react)

### Accessibility
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)

### Design & Animation
- [Animated API](https://reactnative.dev/docs/animated)
- [Lottie](https://lottiefiles.com/)
- [Material Design](https://material.io/)

### Testing
- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/)
- [Detox (E2E)](https://wix.github.io/Detox/)

---

## Getting Help

### Common Questions

**Q: How do I test on my phone?**
A: Run `npm start`, then scan QR code in Expo Go app

**Q: How do I revert a change?**
A: `git checkout <file>` or `git revert <commit>`

**Q: Where's the voiceover audio?**
A: Not implemented yet; see FUTURE_WORK.md

**Q: Can I use custom fonts?**
A: Yes, load via `expo-font` in `AppInitializer.ts`

### Getting Support

1. **Check existing docs**: Review relevant file in `docs/`
2. **Search codebase**: `grep -r "searchTerm"` or VS Code find
3. **Test in isolation**: Create minimal example
4. **Document findings**: Add to troubleshooting section

---

## Next Steps

1. ✅ Read this guide & ARCHITECTURE.md
2. ✅ Run `npm start` and play the game
3. ✅ Add 5 sentences to starter pack (see SENTENCE_FORMAT.md)
4. ✅ Modify one setting to understand flow
5. ✅ Review GameScreen code & understand state
6. ✅ Test on real device or emulator
7. 🚀 Ready to contribute!

---

**Last Updated**: March 2026
**Questions?** See [README.md](../README.md) for official documentation
