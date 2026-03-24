import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import Colors from '@/constants/colors';
import { FontFamily, FontSize, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

const PIN_LENGTH = 6;
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'bio', '0', 'del'];
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login, loginWithBiometric, isBiometricAvailable } = useAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [shakeAnim] = useState(new Animated.Value(0));
  const [success, setSuccess] = useState(false);
  const dotAnims = useRef(Array.from({ length: PIN_LENGTH }, () => new Animated.Value(0))).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();

    if (isBiometricAvailable && Platform.OS !== 'web') {
      setTimeout(() => handleBiometric(), 500);
    }
  }, [isBiometricAvailable]);

  useEffect(() => {
    dotAnims.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: i < pin.length ? 1 : 0,
        tension: 300,
        friction: 15,
        useNativeDriver: true,
      }).start();
    });
  }, [pin]);

  const shake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 15, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -15, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 15, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -15, duration: 50, useNativeDriver: true }),
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
        setSuccess(true);
        setTimeout(() => router.replace('/(tabs)'), 400);
      } else {
        if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        shake();
        setError(result.error || 'Incorrect PIN');
        setTimeout(() => setPin(''), 300);
      }
    }
  }, [pin, login, shake]);

  const handleBiometric = useCallback(async () => {
    const result = await loginWithBiometric();
    if (result.success) {
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSuccess(true);
      setTimeout(() => router.replace('/(tabs)'), 400);
    }
  }, [loginWithBiometric]);

  const keySize = Math.min(72, (SCREEN_WIDTH - 80) / 3 - 12);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <View style={[styles.topSection, { paddingTop: insets.top + 40 }]}>
        <Animated.View style={[styles.logoWrap, {
          transform: [{ scale: logoAnim }],
          opacity: logoAnim,
        }]}>
          <LinearGradient
            colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
            style={styles.logoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialCommunityIcons name="store" size={36} color={Colors.white} />
          </LinearGradient>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.title}>Maher Zarai Markaz</Text>
          <Text style={styles.subtitle}>Enter your 6-digit PIN</Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.pinSection, { transform: [{ translateX: shakeAnim }] }]}>
        <View style={styles.pinContainer}>
          {dotAnims.map((anim, i) => (
            <Animated.View
              key={i}
              style={[
                styles.pinDot,
                success && styles.pinDotSuccess,
                {
                  transform: [{
                    scale: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.2],
                    })
                  }],
                  backgroundColor: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['transparent', success ? Colors.green : Colors.primary],
                  }),
                  borderColor: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [Colors.border, success ? Colors.green : Colors.primary],
                  }),
                },
              ]}
            />
          ))}
        </View>

        {error ? (
          <Animated.Text style={styles.errorText}>{error}</Animated.Text>
        ) : (
          <View style={styles.errorPlaceholder} />
        )}
      </Animated.View>

      <Animated.View style={[styles.keypadSection, { opacity: fadeAnim }]}>
        <View style={styles.keypad}>
          {KEYS.map((key) => {
            if (key === 'bio') {
              return (
                <Pressable
                  key={key}
                  style={({ pressed }) => [
                    styles.key,
                    { width: keySize, height: keySize, borderRadius: keySize / 2 },
                    pressed && styles.keyPressed,
                  ]}
                  onPress={() => handleKeyPress(key)}
                  disabled={!isBiometricAvailable}
                >
                  <Feather
                    name="smartphone"
                    size={22}
                    color={isBiometricAvailable ? Colors.primary : Colors.textMuted}
                  />
                </Pressable>
              );
            }

            if (key === 'del') {
              return (
                <Pressable
                  key={key}
                  style={({ pressed }) => [
                    styles.key,
                    { width: keySize, height: keySize, borderRadius: keySize / 2 },
                    pressed && styles.keyPressed,
                  ]}
                  onPress={() => handleKeyPress(key)}
                >
                  <Feather name="delete" size={22} color={Colors.text} />
                </Pressable>
              );
            }

            return (
              <Pressable
                key={key}
                style={({ pressed }) => [
                  styles.key,
                  { width: keySize, height: keySize, borderRadius: keySize / 2 },
                  pressed && styles.keyPressed,
                ]}
                onPress={() => handleKeyPress(key)}
              >
                <Text style={styles.keyText}>{key}</Text>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.footerPill}>
          <Feather name="shield" size={12} color={Colors.primary} />
          <Text style={styles.footerText}>Secured with PIN + Fingerprint</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  topSection: {
    alignItems: 'center',
    paddingBottom: Spacing.xl,
  },
  logoWrap: {
    marginBottom: Spacing.lg,
  },
  logoGradient: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  pinSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  pinContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  pinDotSuccess: {
    borderColor: Colors.green,
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
  keypadSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 280,
    gap: Spacing.md,
    justifyContent: 'center',
  },
  key: {
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyPressed: {
    backgroundColor: Colors.primaryBg,
    transform: [{ scale: 0.92 }],
  },
  keyText: {
    fontSize: 26,
    fontFamily: FontFamily.semiBold,
    color: Colors.text,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  footerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  footerText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: Colors.primary,
  },
});
