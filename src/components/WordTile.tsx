import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  AccessibilityInfo,
  AccessibilityRole,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZES, DURATIONS, GAME_CONFIG } from '../constants/theme';
import { Word } from '../types/game';
import { useSettings } from '../context/SettingsContext';

interface WordTileProps {
  word: Word;
  isSelected: boolean;
  showPartOfSpeech: boolean;
  onPress: (wordIndex: number) => void;
  isHinted: boolean;
  disabled: boolean;
}

const partOfSpeechColors = {
  noun: COLORS.partOfSpeech.noun,
  verb: COLORS.partOfSpeech.verb,
  adjective: COLORS.partOfSpeech.adjective,
  function: COLORS.partOfSpeech.function,
};

export const WordTile: React.FC<WordTileProps> = ({
  word,
  isSelected,
  showPartOfSpeech,
  onPress,
  isHinted,
  disabled,
}) => {
  const { width } = useWindowDimensions();
  const { settings } = useSettings();
  const scaleAnim = new Animated.Value(1);
  const opacityAnim = new Animated.Value(1);
  const [accessibilityLabel, setAccessibilityLabel] = React.useState('');

  useEffect(() => {
    setAccessibilityLabel(
      `${word.text}${showPartOfSpeech && word.partOfSpeech ? `, ${word.partOfSpeech}` : ''}`
    );
  }, [word, showPartOfSpeech]);

  const handlePress = () => {
    if (!disabled && !isSelected) {
      // Bounce animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      onPress(word.index);
    }
  };

  useEffect(() => {
    if (isSelected) {
      Animated.timing(opacityAnim, {
        toValue: 0.5,
        duration: DURATIONS.quick,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: DURATIONS.quick,
        useNativeDriver: true,
      }).start();
    }
  }, [isSelected, opacityAnim]);

  const tileSize = Math.min(width * 0.25, GAME_CONFIG.BOX_SIZE_MAX);
  const fontSize =
    {
      small: FONT_SIZES.small,
      medium: FONT_SIZES.medium,
      large: FONT_SIZES.largeSmall,
    }[settings.fontSize] || FONT_SIZES.medium;

  const tileBackgroundColor = showPartOfSpeech
    ? partOfSpeechColors[word.partOfSpeech || 'function']
    : COLORS.primary;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || isSelected}
        accessibilityRole={AccessibilityRole.Button}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={isSelected ? 'Word selected' : 'Double tap to select'}
        style={[
          styles.tile,
          {
            width: tileSize,
            height: tileSize,
            backgroundColor: tileBackgroundColor,
            borderWidth: isHinted ? 3 : 1,
            borderColor: isHinted ? COLORS.warning : COLORS.gray[200],
            opacity: isSelected ? 0.5 : 1,
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              fontSize,
              color: COLORS.white,
              fontWeight: settings.dyslexiaFont ? '600' : '500',
              fontFamily: settings.dyslexiaFont ? 'OpenDyslexic' : 'System',
            },
          ]}
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          {word.text}
        </Text>

        {showPartOfSpeech && word.partOfSpeech && (
          <Text
            style={[
              styles.partOfSpeech,
              {
                fontSize: FONT_SIZES.tiny,
                color: COLORS.white,
              },
            ]}
          >
            {word.partOfSpeech}
          </Text>
        )}
      </TouchableOpacity>

      {isHinted && (
        <View
          style={[
            styles.hintGlow,
            {
              shadowRadius: 10,
              shadowOpacity: 0.8,
              shadowColor: COLORS.warning,
            },
          ]}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: SPACING.sm,
    alignItems: 'center',
  },
  tile: {
    borderRadius: RADIUS.medium,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    minHeight: GAME_CONFIG.BOX_SIZE_MIN,
    minWidth: GAME_CONFIG.BOX_SIZE_MIN,
  },
  text: {
    textAlign: 'center',
    fontWeight: '600',
  },
  partOfSpeech: {
    marginTop: SPACING.xs,
    fontWeight: '400',
  },
  hintGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.medium,
    borderWidth: 2,
    borderColor: COLORS.warning,
  },
});
