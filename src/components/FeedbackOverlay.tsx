import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../constants/theme';

interface FeedbackOverlayProps {
  type: 'correct' | 'incorrect' | 'completion' | 'hint';
  message?: string;
  visible: boolean;
  onDismiss?: () => void;
  duration?: number;
}

export const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({
  type,
  message,
  visible,
  onDismiss,
  duration = 1500,
}) => {
  const [isShowing, setIsShowing] = React.useState(visible);

  React.useEffect(() => {
    setIsShowing(visible);
    if (visible && duration) {
      const timer = setTimeout(() => {
        setIsShowing(false);
        onDismiss?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onDismiss]);

  if (!isShowing) {
    return null;
  }

  const colors = {
    correct: { bg: COLORS.success, text: 'Great!' },
    incorrect: { bg: COLORS.warning, text: 'Try again!' },
    completion: { bg: COLORS.primary, text: 'Complete!' },
    hint: { bg: COLORS.info, text: 'Hint' },
  };

  const { bg, text: defaultText } = colors[type];

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: COLORS.white }]}>
        {message || defaultText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -50 }],
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.medium,
    zIndex: 100,
    elevation: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    minWidth: 200,
  },
  text: {
    fontSize: FONT_SIZES.largeSmall,
    fontWeight: '600',
    textAlign: 'center',
  },
});
