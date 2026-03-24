import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import Colors from '@/constants/colors';
import { FontFamily, FontSize, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

const PIN_LENGTH = 6;
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'bio', '0', 'del'];

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login, loginWithBiometric, isBiometricAvailable } = useAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [shakeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isBiometricAvailable && Platform.OS !== 'web') {
      handleBiometric();
    }
  }, [isBiometricAvailable]);

  const shake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  const handleKeyPress = useCallback(async (key: string) => {
    if (key === 'del') {
      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setPin(prev => prev.slice(0, -1));
      setError('');
      return;
    }

    if (key === 'bio') {
      handleBiometric();
      return;
    }

    if (pin.length >= PIN_LENGTH) return;

    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newPin = pin + key;
    setPin(newPin);
    setError('');

    if (newPin.length === PIN_LENGTH) {
      const result = await login(newPin);
      if (result.success) {
        if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace('/(tabs)');
      } else {
        if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        shake();
        setError(result.error || 'Incorrect PIN');
        setPin('');
      }
    }
  }, [pin, login, shake]);

  const handleBiometric = useCallback(async () => {
    const result = await loginWithBiometric();
    if (result.success) {
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    }
  }, [loginWithBiometric]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="store" size={48} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Maher Zarai Markaz</Text>
        <Text style={styles.subtitle}>Enter your 6-digit PIN</Text>
      </View>

      <Animated.View style={[styles.pinContainer, { transform: [{ translateX: shakeAnim }] }]}>
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.pinDot,
              i < pin.length && styles.pinDotFilled,
            ]}
          />
        ))}
      </Animated.View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <View style={styles.errorPlaceholder} />
      )}

      <View style={styles.keypad}>
        {KEYS.map((key) => {
          if (key === 'bio') {
            return (
              <Pressable
                key={key}
                style={({ pressed }) => [styles.key, pressed && styles.keyPressed]}
                onPress={() => handleKeyPress(key)}
                disabled={!isBiometricAvailable}
              >
                <Feather
                  name="smartphone"
                  size={24}
                  color={isBiometricAvailable ? Colors.primary : Colors.textMuted}
                />
              </Pressable>
            );
          }

          if (key === 'del') {
            return (
              <Pressable
                key={key}
                style={({ pressed }) => [styles.key, pressed && styles.keyPressed]}
                onPress={() => handleKeyPress(key)}
              >
                <Feather name="delete" size={24} color={Colors.text} />
              </Pressable>
            );
          }

          return (
            <Pressable
              key={key}
              style={({ pressed }) => [styles.key, pressed && styles.keyPressed]}
              onPress={() => handleKeyPress(key)}
            >
              <Text style={styles.keyText}>{key}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 16) }]}>
        <Text style={styles.footerText}>Admin PIN: Full Access</Text>
        <Text style={styles.footerText}>Viewer PIN: View Only</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.xxxl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
  },
  pinContainer: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: Spacing.xxxl,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
  },
  pinDotFilled: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  errorText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.red,
    marginTop: Spacing.md,
    height: 20,
  },
  errorPlaceholder: {
    height: 20,
    marginTop: Spacing.md,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 280,
    gap: Spacing.md,
    marginTop: Spacing.xl,
    justifyContent: 'center',
  },
  key: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyPressed: {
    backgroundColor: Colors.primaryBg,
    transform: [{ scale: 0.95 }],
  },
  keyText: {
    fontSize: 28,
    fontFamily: FontFamily.semiBold,
    color: Colors.text,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    gap: 2,
  },
  footerText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
  },
});
