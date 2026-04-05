# Sentence Pack Format & Content Guidelines

## Overview

Sentence packs are collections of age-appropriate sentences grouped by theme. This document describes how to create and add new sentence packs to the game.

---

## Sentence Pack Structure

### TypeScript Definition

```typescript
interface Sentence {
  id: string;                  // Unique identifier (e.g., 'sent_001')
  text: string;                // Full sentence text ("I see a cat.")
  words: Word[];               // Array of Word objects
  audioUrl?: string;           // (Optional) URL to sentence audio
  difficulty: 'easy' | 'medium' | 'hard';
  packId: string;              // Reference to parent pack
  category: string;            // Sub-category (e.g., 'animals', 'colors')
}

interface Word {
  id: string;                  // Unique identifier (e.g., 'w1')
  text: string;                // Single word ("cat")
  index: number;               // Position in correct sentence (0-indexed)
  partOfSpeech?: 'noun' | 'verb' | 'adjective' | 'function';
  audioUrl?: string;           // (Optional) Individual word audio
}

interface SentencePack {
  id: string;                  // Pack identifier (e.g., 'pack_animals')
  name: string;                // Display name ("Animal Friends")
  description: string;         // Short description
  difficulty: 'easy' | 'medium' | 'hard';
  ageGroup: '4-5' | '5-6' | '4-6';
  theme: string;               // Theme tag (for filtering)
  requiresUnlock: boolean;     // Free vs. premium
  Icon?: string;               // (Optional) Icon path
  sentences: Sentence[];       // Array of sentences
}
```

---

## Content Guidelines

### Age-Appropriateness (4–6 years)

✅ **Do Use**
- Common, concrete nouns: `cat`, `dog`, `ball`, `house`, `mom`, `dad`
- Simple verbs: `run`, `jump`, `play`, `see`, `like`, `have`, `is`, `can`, `go`, `sit`
- Positive emotions: `happy`, `fun`, `like`, `love`
- Safe, relatable settings: home, playground, park, school

❌ **Avoid**
- Complex words requiring prior knowledge
- Idioms and sarcasm ("raining cats and dogs")
- Negative emotions: angry, sad, hate, scared
- Culturally sensitive topics
- Violence, danger, or scary scenarios
- Bodily functions (poop, pee, etc.)
- Scary animals or situations

### Grammar & Structure

**Easy** (3–4 words)
- Subject + Verb + Object
- "I see a cat."
- "The dog can run."
- "We like to jump."

**Medium** (4–5 words)
- Subject + Verb + Adjective + Object
- "The cat is orange."
- "She has a red bag."
- "They like to sing songs."

**Hard** (5–6 words)
- Prepositional phrases, complex structure
- "The cat is in the house."
- "She likes to jump with rope."
- "We can play with our toys."

### Punctuation

- **Period (.)**: Most sentences
- **Question Mark (?)**: Simple yes/no questions only
- **Avoid**: Commas, semicolons, exclamation marks (initially)

---

## Creating a New Pack

### Step 1: Plan the Theme

Choose a cohesive theme with 15–20 sentences:
- **Animals**: Common pets and zoo animals
- **Colors**: Color words with objects
- **Home**: Household objects and rooms
- **Playtime**: Fun activities
- **Food**: Common snacks and meals
- **Nature**: Weather and outdoor elements

### Step 2: Write Sentences

Write 15–20 sentences following the grammar guidelines:

```
Easy sentences (5–10):
1. I see a cat.
2. The dog can run.
3. A bird can fly.
4. I like a ball.
5. We can play.

Medium sentences (4–8):
6. The cat is big.
7. She has a red bag.
8. I like to sing.
9. The dog is brown.
10. Can you jump?

Hard sentences (2–5):
11. The cat is on the house.
12. She likes to play with toys.
13. I have a red and blue ball.
```

### Step 3: Break into Words

For each sentence, identify individual words and assign indices:

```
"I see a cat."
- Word 0: "I" (function)
- Word 1: "see" (verb)
- Word 2: "a" (function)
- Word 3: "cat" (noun)
```

### Step 4: Assign Parts of Speech

- **Noun**: Person, place, thing (cat, boy, sun, house)
- **Verb**: Action (run, jump, see, like, is, can)
- **Adjective**: Describing word (red, big, small, happy)
- **Function**: Articles, prepositions, helpers (the, a, in, can, is, to)

### Step 5: Create TypeScript Object

```typescript
const newPack: SentencePack = {
  id: 'pack_animals',
  name: 'Animal Friends',
  description: 'Learn about animals with simple sentences',
  difficulty: 'easy',
  ageGroup: '4-6',
  theme: 'animals',
  requiresUnlock: false,
  sentences: [
    {
      id: 'sent_001',
      text: 'I see a cat.',
      words: [
        { id: 'w1', text: 'I', index: 0, partOfSpeech: 'function' },
        { id: 'w2', text: 'see', index: 1, partOfSpeech: 'verb' },
        { id: 'w3', text: 'a', index: 2, partOfSpeech: 'function' },
        { id: 'w4', text: 'cat', index: 3, partOfSpeech: 'noun' },
      ],
      difficulty: 'easy',
      packId: 'pack_animals',
      category: 'animals',
    },
    // ... more sentences
  ],
};
```

---

## Naming Conventions

### Pack IDs
- Format: `pack_<theme>`
- Examples: `pack_animals`, `pack_colors`, `pack_home`
- Avoid spaces and special characters

### Sentence IDs
- Format: `sent_<number>`
- Examples: `sent_001`, `sent_002`, `sent_100`
- Use zero-padding for consistency

### Word IDs
- Format: `w<number>`
- Examples: `w1`, `w2`, `w100`

---

## Integration

### 1. Add to sentencePacks.ts

```typescript
// src/data/sentencePacks.ts

export const STARTER_PACKS: SentencePack[] = [
  // ... existing packs
  newPack, // Add here
];
```

### 2. Update getAllSentences() if needed

The function automatically includes all packs, no changes required.

### 3. Test

```typescript
// In GameScreen or HomeScreen
const sentences = getSentencesByPack('pack_animals');
console.log(sentences); // Should return all sentences
```

---

## Translation Guidelines

For multi-language support (future feature):

```typescript
interface SentenceTranslated extends Sentence {
  texts: { [locale: string]: string };
  words: (Word & { texts: { [locale: string]: string } })[];
}
```

---

## Audio Integration (Future)

Once voiceover is implemented:

1. Record sentence with clear, warm voice
2. Save as `sent_001_audio.mp3`
3. Add to `audioUrl` field:

```typescript
{
  id: 'sent_001',
  text: 'I see a cat.',
  audioUrl: '/audio/sentences/sent_001_audio.mp3',
  words: [
    { id: 'w1', text: 'I', audioUrl: '/audio/words/w1_audio.mp3', ... },
    // ...
  ],
}
```

---

## Validation Checklist

- [ ] All sentences are 3–6 words
- [ ] Vocabulary is age-appropriate
- [ ] No banned words or topics
- [ ] Grammar is correct
- [ ] Word indices are sequential (0, 1, 2, 3...)
- [ ] All word IDs are unique within the sentence
- [ ] All sentence IDs are unique within the pack
- [ ] Pack ID follows naming convention
- [ ] Difficulty rating matches word count
- [ ] No duplicate sentences
- [ ] ~15–20 sentences per pack
- [ ] TypeScript compiles without errors

---

## Example: Complete Pack

```typescript
export const EXAMPLE_PACK: SentencePack = {
  id: 'pack_example',
  name: 'Example Pack',
  description: 'A well-formed sentence pack example',
  difficulty: 'easy',
  ageGroup: '4-6',
  theme: 'example',
  requiresUnlock: false,
  sentences: [
    {
      id: 'sent_001',
      text: 'I see a cat.',
      words: [
        { id: 'w1', text: 'I', index: 0, partOfSpeech: 'function' },
        { id: 'w2', text: 'see', index: 1, partOfSpeech: 'verb' },
        { id: 'w3', text: 'a', index: 2, partOfSpeech: 'function' },
        { id: 'w4', text: 'cat', index: 3, partOfSpeech: 'noun' },
      ],
      difficulty: 'easy',
      packId: 'pack_example',
      category: 'animals',
    },
    {
      id: 'sent_002',
      text: 'The cat is orange.',
      words: [
        { id: 'w5', text: 'The', index: 0, partOfSpeech: 'function' },
        { id: 'w6', text: 'cat', index: 1, partOfSpeech: 'noun' },
        { id: 'w7', text: 'is', index: 2, partOfSpeech: 'verb' },
        { id: 'w8', text: 'orange', index: 3, partOfSpeech: 'adjective' },
      ],
      difficulty: 'easy',
      packId: 'pack_example',
      category: 'colors',
    },
  ],
};
```

---

## Accessibility Notes

- Ensure words are recognizable and learnable
- Use consistent word order patterns
- Introduce new vocabulary gradually
- Pair visual/audio cues with text
- Provide dyslexia-friendly font option

---

## FAQ

**Q: Can I use punctuation in the middle of sentences?**
A: No, punctuation should only appear at the sentence end for 4-6 age group.

**Q: What if a sentence has repeated words?**
A: Each occurrence is a separate `Word` object with unique IDs:
```typescript
// "I like I like toys"
words: [
  { id: 'w1', text: 'I', index: 0, ... },
  { id: 'w2', text: 'like', index: 1, ... },
  { id: 'w3', text: 'I', index: 2, ... }, // Different ID
  { id: 'w4', text: 'like', index: 3, ... }, // Different ID
  { id: 'w5', text: 'toys', index: 4, ... },
]
```

**Q: Can I use contractions (don't, can't)?**
A: Avoid for early readers; spell out: "do not", "can not".

**Q: How many packs should I create initially?**
A: Start with 3–5 themed packs (animals, home, playtime). Gradually expand.

---

**Last Updated**: March 2026
