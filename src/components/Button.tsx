/**
 * Reusable Button Component
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {
  COLORS,
  SIZES,
  SPACING,
  TYPOGRAPHY,
  SHADOWS,
} from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const getButtonStyle = (): ViewStyle[] => {
    const styles: ViewStyle[] = [baseStyles.button];

    // Variant styles
    switch (variant) {
      case 'primary':
        styles.push(baseStyles.primaryButton);
        break;
      case 'secondary':
        styles.push(baseStyles.secondaryButton);
        break;
      case 'outline':
        styles.push(baseStyles.outlineButton);
        break;
      case 'text':
        styles.push(baseStyles.textButton);
        break;
    }

    // Size styles
    switch (size) {
      case 'small':
        styles.push(baseStyles.smallButton);
        break;
      case 'large':
        styles.push(baseStyles.largeButton);
        break;
    }

    if (fullWidth) {
      styles.push(baseStyles.fullWidth);
    }

    if (disabled) {
      styles.push(baseStyles.disabledButton);
    }

    if (style) {
      styles.push(style);
    }

    return styles;
  };

  const getTextStyle = (): TextStyle[] => {
    const styles: TextStyle[] = [baseStyles.text];

    switch (variant) {
      case 'primary':
        styles.push(baseStyles.primaryText);
        break;
      case 'secondary':
        styles.push(baseStyles.secondaryText);
        break;
      case 'outline':
        styles.push(baseStyles.outlineText);
        break;
      case 'text':
        styles.push(baseStyles.textButtonText);
        break;
    }

    switch (size) {
      case 'small':
        styles.push(baseStyles.smallText);
        break;
      case 'large':
        styles.push(baseStyles.largeText);
        break;
    }

    if (textStyle) {
      styles.push(textStyle);
    }

    return styles;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'outline' || variant === 'text'
              ? COLORS.primary
              : COLORS.white
          }
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const baseStyles = StyleSheet.create({
  button: {
    height: SIZES.buttonHeight,
    borderRadius: SIZES.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    ...SHADOWS.sm,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  outlineButton: {
    backgroundColor: COLORS.transparent,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  textButton: {
    backgroundColor: COLORS.transparent,
    shadowColor: COLORS.transparent,
    elevation: 0,
  },
  smallButton: {
    height: 36,
    paddingHorizontal: SPACING.md,
  },
  largeButton: {
    height: 56,
    paddingHorizontal: SPACING['3xl'],
  },
  disabledButton: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.white,
  },
  outlineText: {
    color: COLORS.primary,
  },
  textButtonText: {
    color: COLORS.primary,
  },
  smallText: {
    fontSize: TYPOGRAPHY.fontSize.base,
  },
  largeText: {
    fontSize: TYPOGRAPHY.fontSize.xl,
  },
});
