import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  AccessibilityInfo,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, DURATIONS, GAME_CONFIG } from '../constants/theme';
import { useGame } from '../context/GameContext';
import { useSettings } from '../context/SettingsContext';
import { useAudioHaptics } from '../services/AudioService';
import { shuffleWords, isCorrectNextWord, shouldShowHint } from '../utils/gameLogic';
import { StorageService } from '../services/StorageService';
import { WordTile } from './WordTile';
import { SentenceBar } from './SentenceBar';
import { Confetti } from './Confetti';
import { FeedbackOverlay } from './FeedbackOverlay';
import { ControlButton } from './ControlButton';
import { Sentence, Word } from '../types/game';
import { getSentencesByPack } from '../data/sentencePacks';

interface GameScreenProps {
  packId: string;
  mode: 'play' | 'challenge' | 'practice';
}

export const GameScreen: React.FC<GameScreenProps> = ({ packId, mode }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { state, selectWord, completeWord, nextSentence, showNextWordHint, resetCurrentSentence } =
    useGame();
  const { settings } = useSettings();
  const { playCorrect, playIncorrect, playCompletion, playHint } = useAudioHaptics();

  // Local state
  const [currentSentence, setCurrentSentence] = useState<Sentence | null>(null);
  const [shuffledWords, setShuffledWords] = useState<Word[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [hintStartTime, setHintStartTime] = useState<number | null>(null);
  const [showHintGlow, setShowHintGlow] = useState(false);
  const sentenceIndexRef = useRef(0);

  // Initialize game
  useEffect(() => {
    const initializeSentence = async () => {
      const sentences = getSentencesByPack(packId);
      if (sentences.length > 0) {
        const firstSentence = sentences[0];
        setCurrentSentence(firstSentence);
        setShuffledWords(shuffleWords(firstSentence.words));
        sentenceIndexRef.current = 0;
      }
    };

    initializeSentence();
  }, [packId]);

  // Check for inactivity and show hints
  useEffect(() => {
    if (isCompleted || !currentSentence || selectedIndices.length === currentSentence.words.length) {
      return;
    }

    const hintTimer = setTimeout(() => {
      if (!hintStartTime) {
        setHintStartTime(Date.now());
        setShowHintGlow(true);
        playHint();
      }
    }, GAME_CONFIG.HINT_DELAY);

    return () => clearTimeout(hintTimer);
  }, [selectedIndices, currentSentence, isCompleted, hintStartTime, playHint]);

  const getNextCorrectWordIndex = useCallback(() => {
    if (!currentSentence) return -1;
    const nextPos = selectedIndices.length;
    return currentSentence.words.findIndex((w) => w.index === nextPos);
  }, [currentSentence, selectedIndices]);

  const handleWordTap = useCallback(
    async (wordIndex: number) => {
      if (!currentSentence || isCompleted) return;

      const tappedWord = currentSentence.words.find((w) => w.index === wordIndex);
      if (!tappedWord) return;

      const isCorrect = isCorrectNextWord(
        currentSentence.words.indexOf(tappedWord),
        selectedIndices,
        currentSentence.words
      );

      if (isCorrect) {
        // Correct word selected
        await playCorrect();
        setFeedbackType('correct');
        const newIndices = [...selectedIndices, wordIndex];
        setSelectedIndices(newIndices);
        setShowHintGlow(false);
        setHintStartTime(null);

        // Check if sentence is complete
        if (newIndices.length === currentSentence.words.length) {
          setIsCompleted(true);
          setShowConfetti(true);
          await playCompletion();
        }
      } else {
        // Incorrect word selected
        await playIncorrect();
        setFeedbackType('incorrect');
      }

      // Clear feedback after delay
      setTimeout(() => setFeedbackType(null), DURATIONS.normal);
    },
    [currentSentence, isCompleted, selectedIndices, playCorrect, playIncorrect, playCompletion]
  );

  const handleNextSentence = useCallback(async () => {
    const sentences = getSentencesByPack(packId);
    const nextIndex = sentenceIndexRef.current + 1;

    if (nextIndex < sentences.length) {
      const nextSentence = sentences[nextIndex];
      setCurrentSentence(nextSentence);
      setShuffledWords(shuffleWords(nextSentence.words));
      setSelectedIndices([]);
      setIsCompleted(false);
      setShowConfetti(false);
      setFeedbackType(null);
      setHintStartTime(null);
      setShowHintGlow(false);
      sentenceIndexRef.current = nextIndex;

      // Save progress
      await StorageService.updatePackProgress(packId, {
        completedSentences: nextIndex,
        lastPlayedAt: Date.now(),
      });
    }
  }, [packId]);

  const handleReset = useCallback(() => {
    setSelectedIndices([]);
    setIsCompleted(false);
    setShowConfetti(false);
    setFeedbackType(null);
    setHintStartTime(null);
    setShowHintGlow(false);
  }, []);

  const nextCorrectWordIdx = getNextCorrectWordIndex();
  const columnsPerRow = Math.floor(width / 110);

  if (!currentSentence) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      accessible={true}
      accessibilityRole="main"
    >
      {/* Sentence bar */}
      <SentenceBar
        targetText={currentSentence.text}
        selectedWords={currentSentence.words.filter((w) =>
          selectedIndices.includes(w.index)
        )}
        totalWords={currentSentence.words.length}
        completedCount={selectedIndices.length}
      />

      {/* Word tiles */}
      <ScrollView
        style={styles.tilesContainer}
        contentContainerStyle={styles.tilesContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tilesGrid}>
          {shuffledWords.map((word) => {
            const tileIndex = shuffledWords.indexOf(word);
            const isSelected = selectedIndices.includes(word.index);
            const isHinted = showHintGlow && nextCorrectWordIdx === tileIndex;

            return (
              <WordTile
                key={word.id}
                word={word}
                isSelected={isSelected}
                showPartOfSpeech={settings.parentSettings?.showPartsOfSpeech ?? false}
                onPress={handleWordTap}
                isHinted={isHinted}
                disabled={isCompleted}
              />
            );
          })}
        </View>
      </ScrollView>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <ControlButton label="Reset" onPress={handleReset} variant="secondary" />
        {isCompleted && (
          <ControlButton
            label="Next"
            onPress={handleNextSentence}
            variant="primary"
            size="large"
          />
        )}
      </View>

      {/* Feedback overlays */}
      {feedbackType && (
        <FeedbackOverlay type={feedbackType} visible={!!feedbackType} />
      )}

      {/* Confetti on completion */}
      {showConfetti && (
        <Confetti
          trigger={showConfetti}
          duration={DURATIONS.slowest}
          onComplete={() => {
            setShowConfetti(false);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
    paddingH orizontal: SPACING.lg,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bgLight,
  },
  tilesContainer: {
    flex: 1,
    marginVertical: SPACING.md,
  },
  tilesContentContainer: {
    paddingVertical: SPACING.md,
  },
  tilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
  },
});
