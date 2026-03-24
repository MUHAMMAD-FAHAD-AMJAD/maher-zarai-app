import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '@/constants/theme';

type ScannedEntry = {
  id: string;
  name: string;
  amount: number;
  type: 'credit' | 'payment';
  description: string;
  confirmed: boolean;
};

export default function ScanReviewScreen() {
  const insets = useSafeAreaInsets();
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [entries, setEntries] = useState<ScannedEntry[]>([]);
  const [saving, setSaving] = useState(false);

  const processImage = async () => {
    setProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      setEntries([
        { id: '1', name: 'Ahmad Khan', amount: 5000, type: 'credit', description: 'Fertilizer purchase', confirmed: true },
        { id: '2', name: 'Ali Raza', amount: 3200, type: 'payment', description: 'Cash payment', confirmed: true },
        { id: '3', name: 'Hassan', amount: 1500, type: 'credit', description: 'Pesticide', confirmed: true },
      ]);
      setProcessed(true);
    } catch (e) {
      Alert.alert('Error', 'Failed to process image. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const toggleEntry = (id: string) => {
    setEntries(prev =>
      prev.map(e => e.id === id ? { ...e, confirmed: !e.confirmed } : e)
    );
  };

  const removeEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleSave = async () => {
    const confirmed = entries.filter(e => e.confirmed);
    if (confirmed.length === 0) {
      Alert.alert('No Entries', 'Please confirm at least one entry to save');
      return;
    }
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert(
        'Saved',
        `${confirmed.length} entries saved successfully`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (e) {
      Alert.alert('Error', 'Failed to save entries');
    } finally {
      setSaving(false);
    }
  };

  const confirmedCount = entries.filter(e => e.confirmed).length;
  const totalAmount = entries.filter(e => e.confirmed).reduce((sum, e) => sum + e.amount, 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Scan Review</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {imageUri && (
          <View style={styles.imageCard}>
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
            {!processed && !processing && (
              <Pressable
                style={({ pressed }) => [styles.processBtn, pressed && { opacity: 0.9 }]}
                onPress={processImage}
              >
                <LinearGradient
                  colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
                  style={styles.processBtnGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <MaterialCommunityIcons name="brain" size={20} color={Colors.white} />
                  <Text style={styles.processBtnText}>PROCESS WITH AI</Text>
                </LinearGradient>
              </Pressable>
            )}
            {processing && (
              <View style={styles.processingOverlay}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.processingText}>AI is reading your notebook...</Text>
                <Text style={styles.processingSubtext}>Detecting Urdu handwriting</Text>
              </View>
            )}
          </View>
        )}

        {!imageUri && (
          <View style={styles.noImageCard}>
            <MaterialCommunityIcons name="camera-off" size={48} color={Colors.textMuted} />
            <Text style={styles.noImageText}>No image captured</Text>
            <Pressable onPress={() => router.back()}>
              <Text style={styles.retryLink}>Go back and try again</Text>
            </Pressable>
          </View>
        )}

        {processed && entries.length > 0 && (
          <>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>Extracted Entries</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{entries.length} found</Text>
              </View>
            </View>

            {entries.map((entry) => (
              <Pressable
                key={entry.id}
                style={[styles.entryCard, !entry.confirmed && styles.entryCardDimmed]}
                onPress={() => toggleEntry(entry.id)}
              >
                <View style={styles.entryLeft}>
                  <View style={[
                    styles.checkCircle,
                    entry.confirmed && styles.checkCircleActive,
                  ]}>
                    {entry.confirmed && <Feather name="check" size={14} color={Colors.white} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.entryName}>{entry.name}</Text>
                    <Text style={styles.entryDesc}>{entry.description}</Text>
                  </View>
                </View>
                <View style={styles.entryRight}>
                  <Text style={[
                    styles.entryAmount,
                    { color: entry.type === 'credit' ? Colors.red : Colors.green }
                  ]}>
                    Rs {entry.amount.toLocaleString('en-PK')}
                  </Text>
                  <View style={[
                    styles.entryTypeBadge,
                    { backgroundColor: entry.type === 'credit' ? Colors.redBg : Colors.greenBg }
                  ]}>
                    <Text style={[
                      styles.entryTypeText,
                      { color: entry.type === 'credit' ? Colors.red : Colors.green }
                    ]}>
                      {entry.type === 'credit' ? 'Credit' : 'Payment'}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}

            <View style={styles.infoCard}>
              <Feather name="info" size={16} color={Colors.info} />
              <Text style={styles.infoText}>
                Tap entries to include/exclude them. AI results may not be 100% accurate - please verify before saving.
              </Text>
            </View>
          </>
        )}

        {processed && entries.length === 0 && (
          <View style={styles.noResultsCard}>
            <MaterialCommunityIcons name="text-box-remove-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.noResultsTitle}>No entries detected</Text>
            <Text style={styles.noResultsText}>AI could not find any readable entries in this image. Try a clearer photo.</Text>
          </View>
        )}
      </ScrollView>

      {processed && entries.length > 0 && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
          <View style={styles.footerInfo}>
            <Text style={styles.footerLabel}>{confirmedCount} entries selected</Text>
            <Text style={styles.footerAmount}>Rs {totalAmount.toLocaleString('en-PK')}</Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
            onPress={handleSave}
            disabled={saving || confirmedCount === 0}
          >
            <LinearGradient
              colors={confirmedCount > 0
                ? [Colors.successGradientStart, Colors.successGradientEnd]
                : [Colors.textMuted, Colors.textMuted]}
              style={styles.saveBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Feather name="save" size={20} color={Colors.white} />
              <Text style={styles.saveBtnText}>{saving ? 'SAVING...' : 'SAVE ENTRIES'}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.text },
  content: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: 140 },
  imageCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    overflow: 'hidden', ...Shadow.medium,
  },
  image: { width: '100%', height: 200, backgroundColor: Colors.skeleton },
  processBtn: { margin: Spacing.lg, borderRadius: BorderRadius.md },
  processBtnGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: Spacing.md, borderRadius: BorderRadius.md, gap: Spacing.sm,
  },
  processBtnText: { fontSize: FontSize.md, fontFamily: FontFamily.bold, color: Colors.white },
  processingOverlay: {
    padding: Spacing.xxl, alignItems: 'center', gap: Spacing.md,
  },
  processingText: { fontSize: FontSize.md, fontFamily: FontFamily.semiBold, color: Colors.text },
  processingSubtext: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted },
  noImageCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: Spacing.jumbo, alignItems: 'center', gap: Spacing.md, ...Shadow.small,
  },
  noImageText: { fontSize: FontSize.lg, fontFamily: FontFamily.semiBold, color: Colors.text },
  retryLink: { fontSize: FontSize.md, fontFamily: FontFamily.medium, color: Colors.primary },
  resultsHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  resultsTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.text },
  countBadge: { backgroundColor: Colors.primaryBg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full },
  countBadgeText: { fontSize: FontSize.xs, fontFamily: FontFamily.semiBold, color: Colors.primary },
  entryCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: BorderRadius.md,
    padding: Spacing.lg, ...Shadow.small,
  },
  entryCardDimmed: { opacity: 0.5 },
  entryLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  checkCircle: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center',
  },
  checkCircleActive: { backgroundColor: Colors.green, borderColor: Colors.green },
  entryName: { fontSize: FontSize.md, fontFamily: FontFamily.semiBold, color: Colors.text },
  entryDesc: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted, marginTop: 2 },
  entryRight: { alignItems: 'flex-end', gap: Spacing.xs },
  entryAmount: { fontSize: FontSize.md, fontFamily: FontFamily.bold },
  entryTypeBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.xs },
  entryTypeText: { fontSize: FontSize.xxs, fontFamily: FontFamily.semiBold },
  infoCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.infoBg, borderRadius: BorderRadius.md,
    padding: Spacing.md, borderLeftWidth: 3, borderLeftColor: Colors.info,
  },
  infoText: { flex: 1, fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textSecondary, lineHeight: 18 },
  noResultsCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: Spacing.jumbo, alignItems: 'center', gap: Spacing.md, ...Shadow.small,
  },
  noResultsTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.semiBold, color: Colors.text },
  noResultsText: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted, textAlign: 'center' },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md,
    backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  footerInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md },
  footerLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.textSecondary },
  footerAmount: { fontSize: FontSize.md, fontFamily: FontFamily.bold, color: Colors.text },
  saveBtn: { borderRadius: BorderRadius.md, ...Shadow.medium },
  saveBtnGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: Spacing.lg, borderRadius: BorderRadius.md, gap: Spacing.sm,
  },
  saveBtnText: { fontSize: FontSize.md, fontFamily: FontFamily.bold, color: Colors.white },
});
