import { Platform } from 'react-native';

export const FontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const FontSize = {
  xxs: 10,
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
  hero: 48,
} as const;

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
  jumbo: 56,
} as const;

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 999,
} as const;

export const Shadow = Platform.select({
  ios: {
    small: {
      shadowColor: '#1A1A2E',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
    },
    medium: {
      shadowColor: '#1A1A2E',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
    },
    large: {
      shadowColor: '#1A1A2E',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.14,
      shadowRadius: 20,
    },
    colored: (color: string) => ({
      shadowColor: color,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
    }),
  },
  android: {
    small: { elevation: 2 },
    medium: { elevation: 5 },
    large: { elevation: 10 },
    colored: () => ({ elevation: 6 }),
  },
  default: {
    small: { elevation: 2 },
    medium: { elevation: 5 },
    large: { elevation: 10 },
    colored: () => ({ elevation: 6 }),
  },
}) as Record<string, any>;

export const HitSlop = {
  small: { top: 8, bottom: 8, left: 8, right: 8 },
  medium: { top: 12, bottom: 12, left: 12, right: 12 },
  large: { top: 16, bottom: 16, left: 16, right: 16 },
} as const;
