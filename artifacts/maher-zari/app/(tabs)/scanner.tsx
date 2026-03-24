import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

const STEP_CARDS = [
  {
    step: 1,
    title: 'Capture',
    description: 'Take photo of notebook page',
    icon: 'camera' as const,
    iconType: 'feather' as const,
    bgColor: Colors.primaryBg,
    accentColor: Colors.primary,
    gradientStart: Colors.primaryGradientStart,
    gradientEnd: Colors.primaryGradientEnd,
  },
  {
    step: 2,
    title: 'AI Process',
    description: 'AI reads and extracts entries',
    icon: 'brain' as const,
    iconType: 'material' as const,
    bgColor: Colors.infoBg,
    accentColor: Colors.info,
    gradientStart: '#3B82F6',
    gradientEnd: '#60A5FA',
  },
  {
    step: 3,
    title: 'Confirm',
    description: 'Review, edit, and save',
    icon: 'check-circle' as const,
    iconType: 'feather' as const,
    bgColor: Colors.greenBg,
    accentColor: Colors.green,
    gradientStart: Colors.successGradientStart,
    gradientEnd: Colors.successGradientEnd,
  },
];

export default function ScannerScreen() {
  const insets = useSafeAreaInsets();
  const { userRole } = useAuth();
  const router = useRouter();

  const handleScan = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Camera is only available on Android.');
      return;
    }

    try {
      const ImagePicker = require('expo-image-picker');
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is needed to scan notebooks.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        router.push({ pathname: '/scan-review', params: { imageUri: result.assets[0].uri } });
      }
    } catch {
      Alert.alert('Error', 'Failed to open camera. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <LinearGradient
        colors={[Colors.headerGradientStart, Colors.headerGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name="line-scan" size={24} color={Colors.white} />
          <Text style={styles.headerTitle}>AI Scanner</Text>
        </View>
        <Text style={styles.headerSubtitle}>Digitize your notebook with AI</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <LinearGradient
            colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
            style={styles.heroIconCircle}
          >
            <MaterialCommunityIcons name="notebook-outline" size={56} color={Colors.white} />
          </LinearGradient>
          <Text style={styles.heroTitle}>Scan Your Notebook</Text>
          <Text style={styles.heroDescription}>
            Take a photo of your notebook page. Our AI reads your Urdu handwriting and converts entries into digital records automatically.
          </Text>
        </View>

        <View style={styles.stepsSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepsContainer}>
            {STEP_CARDS.map((card) => (
              <View key={card.step} style={[styles.stepCard, Shadow.small]}>
                <LinearGradient
                  colors={[card.gradientStart, card.gradientEnd]}
                  style={styles.stepIconCircle}
                >
                  {card.iconType === 'feather' ? (
                    <Feather name={card.icon as any} size={20} color={Colors.white} />
                  ) : (
                    <MaterialCommunityIcons name={card.icon as any} size={20} color={Colors.white} />
                  )}
                </LinearGradient>
                <View style={styles.stepTextContainer}>
                  <View style={styles.stepTitleRow}>
                    <Text style={[styles.stepBadge, { backgroundColor: card.bgColor, color: card.accentColor }]}>
                      Step {card.step}
                    </Text>
                    <Text style={styles.stepTitle}>{card.title}</Text>
                  </View>
                  <Text style={styles.stepDescription}>{card.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Scans</Text>
          <View style={[styles.emptyScansCard, Shadow.small]}>
            <MaterialCommunityIcons name="scan-helper" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyScansText}>No scans yet</Text>
            <Text style={styles.emptyScansSubtext}>Your scanned notebook entries will appear here</Text>
          </View>
        </View>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, Spacing.lg) }]}>
        {userRole === 'admin' ? (
          <Pressable
            onPress={handleScan}
            style={({ pressed }) => [pressed && styles.scanButtonPressed]}
          >
            <LinearGradient
              colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.scanButton, Shadow.colored?.(Colors.primary) ?? Shadow.medium]}
            >
              <MaterialCommunityIcons name="camera" size={24} color={Colors.white} />
              <Text style={styles.scanButtonText}>SCAN NOTEBOOK</Text>
            </LinearGradient>
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
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: Spacing.xxs,
    marginLeft: Spacing.xxxl,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  heroIconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    ...Shadow.large,
  },
  heroTitle: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  heroDescription: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.lg,
  },
  stepsSection: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  stepsContainer: {
    gap: Spacing.md,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  stepIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xxs,
  },
  stepBadge: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.semiBold,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.xs,
    overflow: 'hidden',
  },
  stepTitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: Colors.text,
  },
  stepDescription: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
  },
  recentSection: {
    marginBottom: Spacing.xxl,
  },
  emptyScansCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyScansText: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  emptyScansSubtext: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  bottomBar: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    gap: Spacing.md,
  },
  scanButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  scanButtonText: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: Colors.white,
    letterSpacing: 1,
  },
  viewOnlyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
