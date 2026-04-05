import React, { useEffect, useState } from 'react';
import { View, Text, Animated, StyleSheet, AccessibilityInfo } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZES, DURATIONS } from '../constants/theme';
import { Word } from '../types/game';
import { useSettings } from '../context/SettingsContext';

interface SentenceBarProps {
  targetText: string;
  selectedWords: Word[];
  totalWords: number;
  completedCount: number;
}

export const SentenceBar: React.FC<SentenceBarProps> = ({
  targetText,
  selectedWords,
  totalWords,
  completedCount,
}) => {
  const { settings } = useSettings();
  const [displayText, setDisplayText] = useState('');
  const scaleAnim = new Animated.Value(1);
  const progressPercent = (completedCount / totalWords) * 100;

  useEffect(() => {
    // Build text from selected words
    const text = selectedWords.map((w) => w.text).join(' ');
    setDisplayText(text);

    // Animate scale when new word is added
    if (selectedWords.length > 0) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: DURATIONS.quick,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: DURATIONS.quick,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selectedWords, scaleAnim]);

  const fontSize =
    {
      small: FONT_SIZES.smallMedium,
      medium: FONT_SIZES.large,
      large: FONT_SIZES.extraLarge,
    }[settings.fontSize] || FONT_SIZES.large;

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel={`Sentence: ${displayText || 'Start selecting words'}`}
      accessibilityHint={`${completedCount} of ${totalWords} words completed`}
    >
      {/* Target sentence (optional visual reference) */}
      <Text
        style={[
          styles.targetText,
          {
            fontSize: FONT_SIZES.small,
            color: COLORS.gray[500],
            fontFamily: settings.dyslexiaFont ? 'OpenDyslexic' : 'System',
          },
        ]}
      >
        {settings.showTextPrompt ? targetText : '...'}
      </Text>

      {/* Animated sentence building area */}
      <Animated.View
        style={[
          styles.sentenceDisplay,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text
          style={[
            styles.displayText,
            {
              fontSize,
              color: displayText ? COLORS.primary : COLORS.gray[400],
              fontFamily: settings.dyslexiaFont ? 'OpenDyslexic' : 'System',
              fontWeight: displayText ? '600' : '400',
            },
          ]}
          numberOfLines={3}
          adjustsFontSizeToFit
        >
          {displayText || 'Tap words in order...'}
        </Text>
      </Animated.View>

      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${progressPercent}%`,
              backgroundColor:
                completedCount === totalWords ? COLORS.success : COLORS.primary,
            },
          ]}
        />
      </View>

      {/* Word count indicator */}
      <Text
        style={[
          styles.wordCount,
          {
            color: COLORS.gray[600],
            fontSize: FONT_SIZES.small,
          },
        ]}
      >
        {completedCount}/{totalWords}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.large,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  targetText: {
    marginBottom: SPACING.sm,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sentenceDisplay: {
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  displayText: {
    textAlign: 'center',
    lineHeight: 32,
    paddingHorizontal: SPACING.md,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: COLORS.gray[200],
    borderRadius: RADIUS.small,
    overflow: 'hidden',
    marginVertical: SPACING.md,
  },
  progressBar: {
    height: '100%',
    borderRadius: RADIUS.small,
  },
  wordCount: {
    textAlign: 'center',
    fontSize: FONT_SIZES.small,
  },
});
