import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../constants/theme';

interface ControlButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
}

export const ControlButton: React.FC<ControlButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  size = 'medium',
  icon,
}) => {
  const variants = {
    primary: { bg: COLORS.primary, text: COLORS.white },
    secondary: { bg: COLORS.gray[200], text: COLORS.gray[900] },
    danger: { bg: COLORS.error, text: COLORS.white },
  };

  const sizes = {
    small: { padding: SPACING.sm, fontSize: FONT_SIZES.small },
    medium: { padding: SPACING.md, fontSize: FONT_SIZES.medium },
    large: { padding: SPACING.lg, fontSize: FONT_SIZES.largeSmall },
  };

  const { bg, text: textColor } = variants[variant];
  const { padding, fontSize } = sizes[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor: disabled ? COLORS.gray[300] : bg,
          padding,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text
        style={[
          styles.label,
          {
            fontSize,
            color: disabled ? COLORS.gray[500] : textColor,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  icon: {
    marginRight: SPACING.sm,
  },
  label: {
    fontWeight: '600',
  },
});
