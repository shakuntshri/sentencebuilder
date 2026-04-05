import { Sentence, SentencePack } from '../types/game';

// Starter sentence packs for age 4-6
export const STARTER_PACKS: SentencePack[] = [
  {
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
      {
        id: 'sent_002',
        text: 'The dog can run.',
        words: [
          { id: 'w5', text: 'The', index: 0, partOfSpeech: 'function' },
          { id: 'w6', text: 'dog', index: 1, partOfSpeech: 'noun' },
          { id: 'w7', text: 'can', index: 2, partOfSpeech: 'function' },
          { id: 'w8', text: 'run', index: 3, partOfSpeech: 'verb' },
        ],
        difficulty: 'easy',
        packId: 'pack_animals',
        category: 'animals',
      },
      {
        id: 'sent_003',
        text: 'A bird can fly.',
        words: [
          { id: 'w9', text: 'A', index: 0, partOfSpeech: 'function' },
          { id: 'w10', text: 'bird', index: 1, partOfSpeech: 'noun' },
          { id: 'w11', text: 'can', index: 2, partOfSpeech: 'function' },
          { id: 'w12', text: 'fly', index: 3, partOfSpeech: 'verb' },
        ],
        difficulty: 'easy',
        packId: 'pack_animals',
        category: 'animals',
      },
      {
        id: 'sent_004',
        text: 'The fish can swim.',
        words: [
          { id: 'w13', text: 'The', index: 0, partOfSpeech: 'function' },
          { id: 'w14', text: 'fish', index: 1, partOfSpeech: 'noun' },
          { id: 'w15', text: 'can', index: 2, partOfSpeech: 'function' },
          { id: 'w16', text: 'swim', index: 3, partOfSpeech: 'verb' },
        ],
        difficulty: 'easy',
        packId: 'pack_animals',
        category: 'animals',
      },
      {
        id: 'sent_005',
        text: 'I like a rabbit.',
        words: [
          { id: 'w17', text: 'I', index: 0, partOfSpeech: 'function' },
          { id: 'w18', text: 'like', index: 1, partOfSpeech: 'verb' },
          { id: 'w19', text: 'a', index: 2, partOfSpeech: 'function' },
          { id: 'w20', text: 'rabbit', index: 3, partOfSpeech: 'noun' },
        ],
        difficulty: 'easy',
        packId: 'pack_animals',
        category: 'animals',
      },
    ],
  },
  {
    id: 'pack_home',
    name: 'My Home',
    description: 'Discover objects and activities at home',
    difficulty: 'easy',
    ageGroup: '4-6',
    theme: 'home',
    requiresUnlock: false,
    sentences: [
      {
        id: 'sent_006',
        text: 'I have a bed.',
        words: [
          { id: 'w21', text: 'I', index: 0, partOfSpeech: 'function' },
          { id: 'w22', text: 'have', index: 1, partOfSpeech: 'verb' },
          { id: 'w23', text: 'a', index: 2, partOfSpeech: 'function' },
          { id: 'w24', text: 'bed', index: 3, partOfSpeech: 'noun' },
        ],
        difficulty: 'easy',
        packId: 'pack_home',
        category: 'home',
      },
      {
        id: 'sent_007',
        text: 'The door is big.',
        words: [
          { id: 'w25', text: 'The', index: 0, partOfSpeech: 'function' },
          { id: 'w26', text: 'door', index: 1, partOfSpeech: 'noun' },
          { id: 'w27', text: 'is', index: 2, partOfSpeech: 'verb' },
          { id: 'w28', text: 'big', index: 3, partOfSpeech: 'adjective' },
        ],
        difficulty: 'easy',
        packId: 'pack_home',
        category: 'home',
      },
      {
        id: 'sent_008',
        text: 'I like my home.',
        words: [
          { id: 'w29', text: 'I', index: 0, partOfSpeech: 'function' },
          { id: 'w30', text: 'like', index: 1, partOfSpeech: 'verb' },
          { id: 'w31', text: 'my', index: 2, partOfSpeech: 'function' },
          { id: 'w32', text: 'home', index: 3, partOfSpeech: 'noun' },
        ],
        difficulty: 'easy',
        packId: 'pack_home',
        category: 'home',
      },
      {
        id: 'sent_009',
        text: 'The window is open.',
        words: [
          { id: 'w33', text: 'The', index: 0, partOfSpeech: 'function' },
          { id: 'w34', text: 'window', index: 1, partOfSpeech: 'noun' },
          { id: 'w35', text: 'is', index: 2, partOfSpeech: 'verb' },
          { id: 'w36', text: 'open', index: 3, partOfSpeech: 'adjective' },
        ],
        difficulty: 'easy',
        packId: 'pack_home',
        category: 'home',
      },
      {
        id: 'sent_010',
        text: 'I see a chair.',
        words: [
          { id: 'w37', text: 'I', index: 0, partOfSpeech: 'function' },
          { id: 'w38', text: 'see', index: 1, partOfSpeech: 'verb' },
          { id: 'w39', text: 'a', index: 2, partOfSpeech: 'function' },
          { id: 'w40', text: 'chair', index: 3, partOfSpeech: 'noun' },
        ],
        difficulty: 'easy',
        packId: 'pack_home',
        category: 'home',
      },
    ],
  },
  {
    id: 'pack_playtime',
    name: 'Playtime Fun',
    description: 'Actions and activities kids love',
    difficulty: 'easy',
    ageGroup: '4-6',
    theme: 'playtime',
    requiresUnlock: false,
    sentences: [
      {
        id: 'sent_011',
        text: 'We like to jump.',
        words: [
          { id: 'w41', text: 'We', index: 0, partOfSpeech: 'function' },
          { id: 'w42', text: 'like', index: 1, partOfSpeech: 'verb' },
          { id: 'w43', text: 'to', index: 2, partOfSpeech: 'function' },
          { id: 'w44', text: 'jump', index: 3, partOfSpeech: 'verb' },
        ],
        difficulty: 'easy',
        packId: 'pack_playtime',
        category: 'playtime',
      },
      {
        id: 'sent_012',
        text: 'Can you run?',
        words: [
          { id: 'w45', text: 'Can', index: 0, partOfSpeech: 'function' },
          { id: 'w46', text: 'you', index: 1, partOfSpeech: 'function' },
          { id: 'w47', text: 'run', index: 2, partOfSpeech: 'verb' },
        ],
        difficulty: 'easy',
        packId: 'pack_playtime',
        category: 'playtime',
      },
      {
        id: 'sent_013',
        text: 'I can play.',
        words: [
          { id: 'w48', text: 'I', index: 0, partOfSpeech: 'function' },
          { id: 'w49', text: 'can', index: 1, partOfSpeech: 'function' },
          { id: 'w50', text: 'play', index: 2, partOfSpeech: 'verb' },
        ],
        difficulty: 'easy',
        packId: 'pack_playtime',
        category: 'playtime',
      },
      {
        id: 'sent_014',
        text: 'The ball is red.',
        words: [
          { id: 'w51', text: 'The', index: 0, partOfSpeech: 'function' },
          { id: 'w52', text: 'ball', index: 1, partOfSpeech: 'noun' },
          { id: 'w53', text: 'is', index: 2, partOfSpeech: 'verb' },
          { id: 'w54', text: 'red', index: 3, partOfSpeech: 'adjective' },
        ],
        difficulty: 'easy',
        packId: 'pack_playtime',
        category: 'playtime',
      },
      {
        id: 'sent_015',
        text: 'I like to sing.',
        words: [
          { id: 'w55', text: 'I', index: 0, partOfSpeech: 'function' },
          { id: 'w56', text: 'like', index: 1, partOfSpeech: 'verb' },
          { id: 'w57', text: 'to', index: 2, partOfSpeech: 'function' },
          { id: 'w58', text: 'sing', index: 3, partOfSpeech: 'verb' },
        ],
        difficulty: 'easy',
        packId: 'pack_playtime',
        category: 'playtime',
      },
    ],
  },
];

export const getAllSentences = (): Sentence[] => {
  return STARTER_PACKS.flatMap((pack) => pack.sentences);
};

export const getSentencesByPack = (packId: string): Sentence[] => {
  const pack = STARTER_PACKS.find((p) => p.id === packId);
  return pack ? pack.sentences : [];
};

export const getSentenceById = (sentenceId: string): Sentence | undefined => {
  return getAllSentences().find((s) => s.id === sentenceId);
};
