import React, { useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { DURATIONS } from '../constants/theme';

interface ConfettiProps {
  trigger: boolean;
  duration?: number;
  onComplete?: () => void;
}

export const Confetti: React.FC<ConfettiProps> = ({
  trigger,
  duration = DURATIONS.slowest,
  onComplete,
}) => {
  const scaleAnim = new Animated.Value(0);
  const opacityAnim = new Animated.Value(1);

  useEffect(() => {
    if (trigger) {
      // Burst animation
      scaleAnim.setValue(0);
      opacityAnim.setValue(1);

      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: DURATIONS.quick,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(duration - DURATIONS.quick),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: DURATIONS.quick,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        onComplete?.();
      });
    }
  }, [trigger, duration, scaleAnim, opacityAnim, onComplete]);

  if (!trigger) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
      pointerEvents="none"
    >
      {/* Using LottieView for confetti animation */}
      <LottieView
        source={require('../../assets/animations/confetti.json')}
        autoPlay
        loop={false}
        duration={duration}
        style={styles.lottie}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
});
