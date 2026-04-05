# Accessibility Features & Guidelines

## Overview

"Tap & Tell: Sentence Builder" is built with accessibility as a core principle, not an afterthought. This document outlines all accessibility features and guidelines for maintaining them.

---

## WCAG 2.1 AA Compliance

The app targets **WCAG 2.1 Level AA** compliance across:
- Perceivability
- Operability
- Understandability
- Robustness

---

## 1. Visual Accessibility

### Color Contrast

- **Minimum**: WCAG AA standard (4.5:1 for normal text, 3:1 for large text)
- **Implementation**: 
  - Text on backgrounds always tested with WebAIM contrast checker
  - Tile colors chosen for sufficient contrast with white text
  - Gray scale has defined contrast values in `theme.ts`

- **Testing**:
  ```bash
  # Use WebAIM or Deque tools
  # Verify all UI elements meet 4.5:1 or 3:1
  ```

### Color Independence

- **Principle**: Color is never the only cue
- **Implementation**:
  - Word tiles have text labels, not just colors
  - Progress bar has both color and width
  - Hints use border + glow, not just color change
  - Parts of speech labels available as text

- **Toggle Options**:
  ```typescript
  // In SettingsScreen
  "Show Parts of Speech" - Display category labels
  "High Contrast Mode" - Increase contrast and emphasize borders
  ```

### High Contrast Mode

Enabled in SettingsScreen:
```typescript
if (settings.highContrast) {
  tile.borderWidth = 3;      // Increased from 1
  colors = saturatedPalette; // Bolder colors
}
```

**Visual Changes**:
- Thicker borders on all interactive elements
- Increased color saturation
- Enhanced shadows for depth

### Text Sizing

- **Range**: Small, Medium, Large (three preset options)
- **Implementation**:
  ```typescript
  const fontSize = {
    small: FONT_SIZES.smallMedium,    // 14px
    medium: FONT_SIZES.large,          // 20px
    large: FONT_SIZES.extraLarge,      // 24px
  }[settings.fontSize];
  ```
- **Minimum**: 14px (well above 12px minimum)
- **Scalability**: Text adjusts proportionally; layout doesn't break

### Dyslexia-Friendly Font

- **Option**: Toggle in Accessibility section
- **Font**: OpenDyslexic (or Lexie Readable alternative)
  ```typescript
  fontFamily: settings.dyslexiaFont ? 'OpenDyslexic' : 'System'
  ```
- **Benefits for Dyslexia**:
  - Heavier baseline weight
  - Increased letter spacing
  - Reduced mirror-image confusion
  - Clearer distinction between similar letters

### Responsive Layout

- **Tested on**:
  - Small phones (4.5"): iPhone SE
  - Large phones (6.5"): iPhone 14 Pro Max, Galaxy S21
  - Tablets (8"-10"): iPad Air, Samsung Tab

- **Behavior**:
  - Tiles scale based on screen width
  - Minimum tap target: 56dp (7mm)
  - Maximum tile size: 80dp
  - Padding and margins adjust for screen size

---

## 2. Motor & Touch Accessibility

### Tap Target Size

- **Minimum**: 56dp × 56dp (inclusive design standard for 4-6 year olds)
- **Actual sizes**: Tiles span 56–80dp based on screen
- **Spacing**: 8dp margin between tiles prevents accidental taps
- **Accessibility attributes**:
  ```typescript
  <TouchableOpacity
    minHeight={GAME_CONFIG.BOX_SIZE_MIN}
    minWidth={GAME_CONFIG.BOX_SIZE_MIN}
    accessibilityRole="button"
  />
  ```

### Gesture Support

- **Single tap**: Select word (primary interaction)
- **No double-tap required**: Avoid complex gestures
- **No swipe/drag required**: Layout doesn't rely on gestures
- **Long-press**: (Future) Hear individual word pronunciation

### Motion & Animation

- **Reduce Motion**: (Future feature)
  - Check `useWindowDimensions().scale` for accessibility settings
  - Disable confetti if motion reduced
  - Simplify animations to shorter durations

---

## 3. Auditory Accessibility

### Sound Effects

- **Mandatory Alternative**: Text + visual feedback (not audio-only)
- **Optional**: Can be disabled in settings
- **Volume**: Respects device volume settings (not forced loud)

### Voiceover (Future)

- **Sentence voiceover**: Clear, warm, neutral accent
- **Word-level audio**: (Long-press to hear)
- **Speed control**: Adjustable (0.75x to 1.5x)

---

## 4. Semantic & Screen Reader Support

### Accessibility Labels & Roles

All interactive elements have:

```typescript
<TouchableOpacity
  accessibilityRole="button"
  accessibilityLabel="Select the word 'cat'"
  accessibilityHint="This word completes the sentence"
  accessibilityState={{ disabled: false }}
/>
```

### Screen Reader Announcements

**Example GameScreen Announcement**:
```
"Game screen. Sentence: I see a cat. 
 Three of four words completed.
 
 Word 1: 'I' - function word
 Word 2: 'see' - verb
 Word 3: 'a' - function word
 Word 4: 'cat' - noun
 
 Word 'I' selected. Correct.
 Tap 'see' to continue."
```

### Heading Hierarchy

- H1: Screen title ("Tap & Tell")
- H2: Section headers ("Accessibility", "Audio & Haptics")
- Descriptive: All UI elements labeled

---

## 5. Cognitive Accessibility

### Simplicity & Predictability

- **Clear Instructions**: "Tap words in order..."
- **Consistent Layout**: Same position across all screens
- **Undo Capability**: "Reset" button to try sentence again
- **Feedback**: Immediate (no >200ms delay)

### Language Clarity

- **No jargon**: Avoid "phoneme", "syntax", "predicate"
- **Simple words**: "correct", "good job", "try again"
- **Consistent terminology**: Same words across UI (don't say "select" in one place and "tap" in another)

### Visual Organization

- **Whitespace**: Generous padding prevents crowding
- **Consistent grouping**: Related elements grouped together
- **Information scent**: Visual clues match content (e.g., buttons look tappable)

---

## 6. Neurodiversity Considerations

### ADHD

- **Minimal distractions**: Clean UI, no flashing
- **Immediate rewards**: Instant feedback on every action
- **Short sessions**: 5–10 sentences = ~60–90 seconds
- **Clear goal**: "Build the sentence in the correct order"

### Autism Spectrum

- **Predictable structure**: Same game loop every round
- **Minimal sensory overload**: Soft sounds, gentle animations
- **Clear rules**: No hidden mechanics or surprises
- **Customizable sensory input**: Sound/haptics toggles

### Dyslexia

- **Font option**: OpenDyslexic with increased spacing
- **Words in tiles**: Not just visual position; each word labeled
- **Color patterns**: Consistent across sessions (red = verbs)
- **Multisensory**: Audio + visual + haptic

### Visual Impairment

- **Screen reader**: Full support with VoiceOver (iOS) / TalkBack (Android)
- **High contrast**: Option for better visibility
- **Text sizing**: Up to 24px large
- **No image-only content**: All visual info has text alternative

---

## 7. Accessibility Checklist

### Before Launch

- [ ] All text ≥14px OR adjustable
- [ ] Color contrast ≥4.5:1 (normal text) or ≥3:1 (large text)
- [ ] All buttons/interactive elements ≥56dp
- [ ] Spacing between taps ≥8dp
- [ ] VoiceOver (iOS) tested on:
  - [ ] iPhone SE (4.5")
  - [ ] iPhone 14 Pro Max (6.7")
  - [ ] iPad (10")
- [ ] TalkBack (Android) tested on:
  - [ ] Pixel 4a (5.8")
  - [ ] Galaxy Tab S8 (11")
- [ ] Screen rotation: portrait → landscape → portrait (no layout breaks)
- [ ] Text-only mode: disable images, verify content still consuming
- [ ] Animation testing:
  - [ ] Confetti doesn't distract (can be disabled)
  - [ ] Animations respect motion preferences (future)
- [ ] No color-only indicators:
  - [ ] Verify tile selection visible without color
  - [ ] Progress bar shows width + color
  - [ ] Hints show border + glow, not just color

### Ongoing Maintenance

- [ ] New components include `accessibilityLabel` and `accessibilityRole`
- [ ] New colors tested for contrast (WebAIM)
- [ ] New fonts tested with dyslexia reader
- [ ] Quarterly review of reported accessibility issues

---

## 8. Testing Methods

### Automated Tools

```bash
# React Native accessibility check
npm install --save-dev jest-axe

# WebAIM contrast checker
# https://webaim.org/resources/contrastchecker/

# Deque axe DevTools
# https://www.deque.com/axe/devtools/
```

### Manual Testing

1. **VoiceOver / TalkBack**:
   - Enable in device settings
   - Navigate entire app using only gestures
   - Verify all text announced clearly

2. **Screen Reader with Closed Eyes**:
   - Close eyes or use screen reader
   - Complete full game loop
   - Identify missing labels or confusing announcements

3. **Font Testing**:
   - Enable dyslexia font
   - Play one full round
   - Verify clarity and legibility

4. **Keyboard Navigation** (Web/Android):
   - Navigate without mouse/touch
   - Tab through all interactive elements
   - Verify logical tab order

---

## 9. Known Limitations & Workarounds

### Limitation: Haptics on Android
- **Issue**: Haptics unavailable on some Android devices
- **Workaround**: Toggle haptics off in settings; app continues normally

### Limitation: Screen Reader Confetti
- **Issue**: Lottie animation has poor screen reader support
- **Workaround**: Announce "Sentence complete" via AccessibilityInfo.announceForAccessibility()

### Limitation: Dyslexic-Friendly Font Support
- **Issue**: OpenDyslexic not pre-installed on most devices
- **Workaround**: Load via Expo Font; falls back to system sans-serif if unavailable

### Limitation: Multiple Languages
- **Issue**: Current release English-only
- **Roadmap**: Add Spanish, French, Mandarin, ASL in future versions

---

## 10. Resources & References

### Standards
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Apple HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Material Design Accessibility](https://material.io/design/usability/accessibility.html)

### Testing Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Lighthouse (Chrome)](https://developers.google.com/web/tools/lighthouse)
- [Deque axe DevTools](https://www.deque.com/axe/devtools/)

### Fonts
- [OpenDyslexic](https://opendyslexic.org/)
- [Lexie Readable](https://www.lexiereadable.com/)
- [Read Regular](https://www.readregular.com/)

### Dyslexia Resources
- [Understood.org - Dyslexia](https://www.understood.org/en/learning-thinking-differences/child-learning-disabilities/dyslexia)
- [Dyslexia Association](https://www.dyslexiaida.org/)

---

## Contributing Accessibility Improvements

### Reporting Accessibility Issues

Include:
1. Device & OS (iPhone 12 iOS 16, Samsung Galaxy S21 Android 12)
2. Accessibility tool used (VoiceOver, TalkBack, etc.)
3. Exact steps to reproduce
4. Expected vs. actual behavior
5. Severity (blocker, major, minor)

### Making Changes

1. Test on real device (simulator may not reflect real behavior)
2. Verify with screen reader before committing
3. Check color contrast with WebAIM
4. Update this documentation if adding new features

---

**Last Updated**: March 2026  
**Compliance Target**: WCAG 2.1 Level AA
