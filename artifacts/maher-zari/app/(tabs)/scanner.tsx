import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

export default function ScannerScreen() {
  const insets = useSafeAreaInsets();
  const { userRole } = useAuth();

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Scanner</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.illustration}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="notebook-outline" size={64} color={Colors.primary} />
          </View>
          <View style={styles.arrowContainer}>
            <Feather name="arrow-down" size={32} color={Colors.textMuted} />
          </View>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="cellphone-check" size={64} color={Colors.green} />
          </View>
        </View>

        <Text style={styles.title}>Scan Your Notebook</Text>
        <Text style={styles.description}>
          Take a photo of your notebook page. Our AI reads your Urdu handwriting and converts entries into digital records automatically.
        </Text>

        <View style={styles.steps}>
          <View style={styles.step}>
            <View style={[styles.stepNumber, { backgroundColor: Colors.primaryBg }]}>
              <Text style={[styles.stepNumberText, { color: Colors.primary }]}>1</Text>
            </View>
            <Text style={styles.stepText}>Take photo of notebook page</Text>
          </View>
          <View style={styles.step}>
            <View style={[styles.stepNumber, { backgroundColor: Colors.infoBg }]}>
              <Text style={[styles.stepNumberText, { color: Colors.info }]}>2</Text>
            </View>
            <Text style={styles.stepText}>AI reads and extracts entries</Text>
          </View>
          <View style={styles.step}>
            <View style={[styles.stepNumber, { backgroundColor: Colors.greenBg }]}>
              <Text style={[styles.stepNumberText, { color: Colors.green }]}>3</Text>
            </View>
            <Text style={styles.stepText}>Review, edit, and confirm</Text>
          </View>
        </View>

        {userRole === 'admin' ? (
          <Pressable
            style={({ pressed }) => [styles.scanButton, pressed && styles.scanButtonPressed]}
            onPress={() => {}}
          >
            <MaterialCommunityIcons name="camera" size={24} color={Colors.white} />
            <Text style={styles.scanButtonText}>SCAN NOTEBOOK</Text>
          </Pressable>
        ) : (
          <View style={styles.viewOnlyBadge}>
            <Feather name="eye" size={16} color={Colors.textSecondary} />
            <Text style={styles.viewOnlyText}>View-only mode. Admin access required to scan.</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    color: Colors.text,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxxl,
    paddingBottom: 80,
  },
  illustration: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.medium,
  },
  arrowContainer: {
    paddingVertical: Spacing.md,
  },
  title: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xxl,
  },
  steps: {
    width: '100%',
    gap: Spacing.md,
    marginBottom: Spacing.xxxl,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
  },
  stepText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
    color: Colors.text,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
    ...Shadow.medium,
  },
  scanButtonPressed: {
    backgroundColor: Colors.primaryDark,
    transform: [{ scale: 0.97 }],
  },
  scanButtonText: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  viewOnlyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  viewOnlyText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
  },
});
