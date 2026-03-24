import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { addProduct } from '@/database';

const CATEGORIES = ['General', 'Fertilizer', 'Pesticide', 'Seed', 'Equipment', 'Feed'];
const UNITS = [
  { key: 'bag', label: 'Bag' },
  { key: 'btl', label: 'Bottle' },
  { key: 'pkt', label: 'Packet' },
  { key: 'pcs', label: 'Piece' },
  { key: 'kg', label: 'Kg' },
  { key: 'can', label: 'Can' },
  { key: 'box', label: 'Box' },
  { key: 'gln', label: 'Gallon' },
  { key: 'pack', label: 'Pack' },
];

export default function AddProductScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('bag');
  const [category, setCategory] = useState('General');
  const [stockQty, setStockQty] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter product name');
      return;
    }
    setSaving(true);
    try {
      await addProduct(
        name.trim(),
        unit,
        parseInt(stockQty) || 0,
        parseFloat(purchasePrice) || 0,
        parseFloat(salePrice) || 0,
        category,
      );
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Add Product</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Name *</Text>
            <View style={styles.inputRow}>
              <Feather name="package" size={18} color={Colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="e.g. DAP Fertilizer 50kg"
                placeholderTextColor={Colors.textMuted}
                value={name}
                onChangeText={setName}
                autoFocus
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              <View style={styles.chipRow}>
                {CATEGORIES.map(c => (
                  <Pressable
                    key={c}
                    style={[styles.chip, category === c && styles.chipActive]}
                    onPress={() => setCategory(c)}
                  >
                    <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Unit</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              <View style={styles.chipRow}>
                {UNITS.map(u => (
                  <Pressable
                    key={u.key}
                    style={[styles.chip, unit === u.key && styles.chipActive]}
                    onPress={() => setUnit(u.key)}
                  >
                    <Text style={[styles.chipText, unit === u.key && styles.chipTextActive]}>{u.label}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Opening Stock</Text>
            <View style={styles.inputRow}>
              <MaterialCommunityIcons name="cube-outline" size={18} color={Colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={Colors.textMuted}
                value={stockQty}
                onChangeText={setStockQty}
                keyboardType="numeric"
              />
              <Text style={styles.unitLabel}>{UNITS.find(u => u.key === unit)?.label || unit}</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Purchase Price</Text>
              <View style={styles.inputRow}>
                <Text style={styles.rsPrefix}>Rs</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={Colors.textMuted}
                  value={purchasePrice}
                  onChangeText={setPurchasePrice}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Sale Price</Text>
              <View style={styles.inputRow}>
                <Text style={styles.rsPrefix}>Rs</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={Colors.textMuted}
                  value={salePrice}
                  onChangeText={setSalePrice}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {purchasePrice && salePrice && parseFloat(salePrice) > parseFloat(purchasePrice) && (
            <View style={styles.profitCard}>
              <Feather name="trending-up" size={16} color={Colors.green} />
              <Text style={styles.profitText}>
                Profit Margin: Rs {(parseFloat(salePrice) - parseFloat(purchasePrice)).toLocaleString('en-PK')} per unit
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <Pressable
          style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
          onPress={handleSave}
          disabled={saving}
        >
          <LinearGradient
            colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
            style={styles.saveBtnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Feather name="check" size={20} color={Colors.white} />
            <Text style={styles.saveBtnText}>{saving ? 'SAVING...' : 'ADD PRODUCT'}</Text>
          </LinearGradient>
        </Pressable>
      </View>
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
  content: { padding: Spacing.xl, gap: Spacing.xl, paddingBottom: 40 },
  inputGroup: { gap: Spacing.sm },
  label: { fontSize: FontSize.sm, fontFamily: FontFamily.semiBold, color: Colors.text, marginLeft: Spacing.xs },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    borderRadius: BorderRadius.md, paddingHorizontal: Spacing.lg, height: 52,
    borderWidth: 1, borderColor: Colors.borderLight, gap: Spacing.md,
  },
  rsPrefix: { fontSize: FontSize.md, fontFamily: FontFamily.bold, color: Colors.primary },
  input: { flex: 1, fontSize: FontSize.md, fontFamily: FontFamily.regular, color: Colors.text, height: 52 },
  unitLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.textMuted },
  chipScroll: { marginHorizontal: -Spacing.xl },
  chipRow: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.xl },
  chip: {
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.full, backgroundColor: Colors.white,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.textSecondary },
  chipTextActive: { color: Colors.white },
  priceRow: { flexDirection: 'row', gap: Spacing.md },
  profitCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.greenBg, borderRadius: BorderRadius.md,
    padding: Spacing.md, borderLeftWidth: 3, borderLeftColor: Colors.green,
  },
  profitText: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.green },
  footer: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  saveBtn: { borderRadius: BorderRadius.md, ...Shadow.medium },
  saveBtnGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: Spacing.lg, borderRadius: BorderRadius.md, gap: Spacing.sm,
  },
  saveBtnText: { fontSize: FontSize.md, fontFamily: FontFamily.bold, color: Colors.white },
});
