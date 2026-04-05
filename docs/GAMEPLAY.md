# Gameplay Mechanics & Design

## Core Game Loop

### 1. Initialization

**When**: Game starts or next sentence loads

```
Load sentence pack
  ↓
Select sentence (sequentially or random)
  ↓
Display sentence (text + optional audio)
  ↓
Shuffle words
  ↓
Display shuffled tiles on screen
```

**Duration**: ~2 seconds

### 2. Selection Phase

**When**: User interacting with tiles

```
Child taps word tile
  ↓
Is next correct word?
  ├─ YES: Animate tile into sentence bar
  │     └─ Play success sound + light haptic
  │
  └─ NO: Shake tile
        └─ Play error sound + selection haptic
        └─ 2+ errors → show hint glow
```

**Duration**: 10–120 seconds per sentence (child-dependent)

### 3. Completion Phase

**When**: All words selected in correct order

```
Last word placed
  ↓
Sentence bar animates completion
  ↓
Play fanfare sound + medium haptic
  ↓
Confetti burst (0.8–1.2 seconds)
  ↓
Display "Next" button
```

**Duration**: 1–2 seconds

### 4. Progression

**When**: Child taps "Next"

```
Record metrics (time, errors, hints used)
  ↓
Update score/difficulty
  ↓
Check if pack is complete
  ├─ NO: Load next sentence, return to Step 1
  └─ YES: Show completion badge/screen
```

---

## Difficulty System

### Sentence Properties

| Property | Easy | Medium | Hard |
|----------|------|--------|------|
| Word Count | 3–4 | 4–5 | 5–6 |
| Vocab | High-freq sight words | Mix of common & new | More varied |
| Grammar | SVO (Subject-Verb-Object) | SVO + adjectives | Prepositional phrases |
| Examples | "I see a cat." | "The cat is big." | "She likes to play with toys." |

### Adaptive Difficulty

#### Difficulty Score (0–100)
- Increases by 1 per successful sentence (up to +15 per 2 successes)
- Decreases by 5 per error
- Resets when difficulty level changes

#### Triggers

```
if score ≥ 15 (easy pack) {
  Difficulty level ↑ (easy → medium → hard)
  Add 1–2 words to next sentence
  Reduce hint frequency
}

if 3 consecutive errors {
  Difficulty level ↓ (if not already easy)
  Hint enabled for current sentence
  Reduce word count temporarily
}
```

### Difficulty Progression Example

```
Sentence 1–2 (Easy):  "I see a cat." (3 words) ✓ Score: +2
Sentence 3–4 (Easy):  "The dog can run." (4 words) ✓ Score: +4
Sentence 5–6 (Easy):  "We like to jump." (4 words) ✓ Score: +6 → Total: 12

Sentence 7 (Medium):  "The cat is big." (4 words) ✓ Score: +8 → Difficulty ↑ Medium

Sentence 8 (Medium):  "She has a red bag." (5 words) ✓ Score: +9
Sentence 9 (Medium):  "The sun is big." (4 words) ✗ Error -5 → Score: 12
(Child continues with medium difficulty...)
```

---

## Feedback Mechanisms

### Immediate (0–50ms)

**Correct Tap**:
- Tile animates out of grid
- Tile animates into sentence bar
- Text "snaps" into place with spring easing

**Incorrect Tap**:
- Tile shakes (±5dp, 100ms)
- Tile stays in place

### Near-immediate (50–200ms)

**Audio**:
- ✓ Correct: Bright "pop" (250ms)
- ✗ Incorrect: Soft "boop" (150ms)
- ✓ Completion: Fanfare (0.8–1.2s)

**Haptics**:
- ✓ Correct: Light impact (20–30ms)
- ✗ Incorrect: Selection feedback (10–15ms)
- ✓ Completion: Medium success (40–60ms)

### Delayed Feedback (1–6 seconds)

**Inactivity Hints**:
- 3 seconds (no tap): Border glow on next word
- 6 seconds (no tap): Helper animation (next word briefly animates position)
- 9 seconds (no tap): Auto-advance to next sentence (no penalty)

**Error-Based Hints**:
- 2 consecutive errors: Hint glow auto-enabled for that sentence
- Hint sound plays to notify child

---

## Word Tile Mechanics

### Shuffle Algorithm

```typescript
function shuffleWords(originalOrder) {
  let shuffled = randomSort(words);
  
  // Ensure first word doesn't stay first
  if (shuffled[0].index === 0) {
    swap(shuffled[0], random(shuffled[1...]));
  }
  
  return shuffled;
}
```

**Goal**: Prevent child from using position as a cue; encourages reading.

### Visual States

| State | Appearance | Interaction |
|-------|-----------|-------------|
| **Normal** | Solid color, no border | Tap to select |
| **Hinted** | Bold border + glow | Tap to select (with visual cue) |
| **Selected** | Faded (opacity 0.5) | Disabled (appears unselectable) |
| **Error** | Shake animation | Tap rejected (tile stays in grid) |

### Color Coding (Optional)

When `showPartsOfSpeech = true`:

- **Nouns** (blue): cat, dog, house, ball
- **Verbs** (red): run, jump, see, play
- **Adjectives** (green): big, small, red, happy
- **Function** (purple): the, a, is, can, to

Color + text label provides dual cue for accessibility.

---

## Score & Progression

### Points System

| Action | Points |
|--------|--------|
| Correct word tapped | +1 |
| Sentence completed (1st try) | +10 |
| Sentence completed (2+ tries) | +5 |
| Hint used (parent-allowed) | 0 (no penalty) |
| Error (wrong word) | 0 (no penalty) |

### Session Rating Calculation

```
Rating = (Completed / Total) × 100
       = (9 / 10) × 100
       = 90%
```

**Applied to**:
- Pack progression (rating stored locally)
- Daily streak (consecutive days, future)
- Achievement badges (future)

---

## Session Management

### Session Flow

```
Session starts
├─ Load pack
├─ Load settings (difficulty, hints, audio)
├─ Initialize session ID
│
└─ For each sentence:
   ├─ Record start time
   ├─ Display sentence
   ├─ Await completion
   ├─ Record metrics (time, errors, hints)
   ├─ Update score/difficulty
   └─ Advance if not end of pack
      
Session ends (when child exits or pack complete)
├─ Calculate final stats
├─ Save to AsyncStorage
├─ Update game metrics
└─ Display completion summary (future)
```

### Session Timeout

- **Default**: 30 minutes (auto-advance sentences)
- **Rationale**: Prevents child from staring at screen indefinitely
- **Behavior**: After 9 seconds without interaction, auto-advance to next without penalty

---

## Hint System

### Types of Hints

#### 1. Inactivity Glow (3s)
- Subtle border glow on next correct word
- No sound
- No penalty
- Auto-dismisses when word tapped

#### 2. Helper Animation (6s)
- Next word briefly animates (bounces) to show position
- Light chime sound
- No penalty
- Guides attention without spoiling

#### 3. Error-Based Hint (2 errors)
- Automatically enabled
- Hint glow + sound play
- Reduces cognitive load after frustration
- Resets when child succeeds

### Parent Controls

```typescript
// In parentSettings
hintsEnabled: true,          // Toggle all hints on/off
maxHintsPerSentence: 2,      // Cap at 2 hints per sentence (future)
```

---

## Session Statistics

### Tracked Metrics

| Metric | Purpose | Stored |
|--------|---------|--------|
| `sentencesCompleted` | Progress tracking | ✓ |
| `totalTimeSpent` | Session length | ✓ |
| `averageTimePerSentence` | Pacing indicator | ✓ |
| `hintsUsed` | Intervention metric | ✓ |
| `successRate` | Overall performance | ✓ |
| `errorCount` | Mistake frequency | (Local only) |
| `consecutiveErrors` | Frustration indicator | (Local only) |

### Example Session

```
Pack: Animal Friends
Mode: Play
Duration: 5:30 (330 seconds)
Sentences: 10 completed

Sentence Breakdown:
1. "I see a cat." - 15s, 0 errors ✓
2. "The dog can run." - 20s, 1 error, 1 hint ✓
3. "A bird can fly." - 12s, 0 errors ✓
...
10. "I like a rabbit." - 18s, 2 errors, 2 hints ✓

Stats:
- Average time per sentence: 33s
- Success rate: 100% (10/10)
- Hints used: 3
- Difficulty progression: Easy → Easy → Medium
```

---

## Accessibility in Gameplay

### For Dyslexic Players
- Words displayed larger (font size toggle)
- OpenDyslexic font available
- Each word remains visible (not erased from grid when selected)
- Color-coded parts of speech help word identification

### For ADHD Players
- Instant feedback (no waiting)
- Short sessions (5–10 sentences)
- Clear progress indication
- Frequent rewards (points, celebration)

### For Motorically Different Players
- Large tap targets (56–80dp)
- Generous spacing between tiles (8dp)
- No time pressure (except optional challenges)
- Reset button for retry (no penalty)

### For Visually Impaired Players
- VoiceOver support (all tiles labeled)
- Word audio (future: long-press to hear)
- High contrast mode
- Text size adjustable to 24px

---

## Future Gameplay Features

### Challenges (Timed Mode)
- 5-sentence pack in 2–3 minutes
- Score multiplier for speed
- Leaderboard (local device-only)

### Streaks & Habits
- "Days in a row" counter
- Streak badges
- Encourages daily play (non-addictive)

### Themes & Customization
- Character avatar (future)
- Theme colors (choose palette)
- Sound pack selection (nature sounds, instruments, etc.)

### Multiplayer (Future)
- Co-op take-turns (one device, two children)
- Never competitive (both kids win or both learn)

---

## Balancing Challenge & Frustration

### Design Goals
1. **Child succeeds on 1st try** 40% of the time
2. **Child succeeds on 2-3 tries** 45% of the time
3. **Child needs help** 15% of the time

### When to Reduce Difficulty

```
if consecutiveErrors ≥ 3:
  Difficulty ↓
  Sentence length ↓ by 1 word
  Hint enabled automatically
  Encouragement message displayed
```

### When to Increase Difficulty

```
if successRate ≥ 90% AND score ≥ 15 points:
  Difficulty ↑
  Sentence length ↑ by 1 word
  Introduce new grammar concepts
```

---

## Age-Appropriateness Validation

### Cognitive Development (4–6 years)
- **Memory**: Remembers 3–5 items (4-word sentences fit)
- **Attention span**: 15–20 minutes (sessions capped at 10 min)
- **Pattern recognition**: Recognizes word order patterns
- **Frustration tolerance**: Needs low failure rate (hints at 2 errors)

### Motor Development
- **Hand-eye coordination**: Can tap 56dp+ targets reliably
- **Precision**: Tap targets spaced 8dp+ apart
- **Endurance**: 5–10 minute play sessions prevent fatigue

### Social-Emotional
- **Encouragement**: Positive feedback on every action
- **No punishment**: No "game over" or penalties
- **Pride**: Celebration for completion (confetti, sound, badge)

---

## Engagement Metrics (Parent Dashboard)

### What Parents See

```
This Week:
- Sessions: 5
- Sentences completed: 47
- Average time per sentence: 28s
- Packs started: 3 (Animals, Home, Playtime)
- Success rate: 92%

Trends:
- Difficulty progression: Easy → Medium (steady)
- Most-played pack: Animals (18/47 sentences)
- Least errors in: Playtime (8%)
```

### Insights Provided

- Child progressing well? (success rate ≥85%)
- Child struggling? (frequent hints, slower completion)
- Engagement level? (sessions this week vs. last week)
- Readiness for harder content? (score ≥15 per pack)

---

**Last Updated**: March 2026
