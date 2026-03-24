import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
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
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { addStockEntry, getProduct, searchProducts, type Product } from '@/database';

type StockType = 'in' | 'out';

export default function AddStockScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ productId?: string; type?: string }>();
  const [stockType, setStockType] = useState<StockType>((params.type as StockType) || 'in');
  const [quantity, setQuantity] = useState('');
  const [rate, setRate] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (params.productId) {
      loadProduct(parseInt(params.productId));
    }
  }, [params.productId]);

  const loadProduct = async (id: number) => {
    const p = await getProduct(id);
    if (p) {
      setSelectedProduct(p);
      setRate(p.purchase_price?.toString() || '');
    }
  };

  const handleSearch = async (query: string) => {
    setProductSearch(query);
    if (query.length >= 1) {
      const results = await searchProducts(query);
      setSearchResults(results);
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  };

  const selectProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductSearch('');
    setShowSearch(false);
    if (stockType === 'in') {
      setRate(product.purchase_price?.toString() || '');
    } else {
      setRate(product.sale_price?.toString() || '');
    }
  };

  const totalAmount = (parseFloat(quantity) || 0) * (parseFloat(rate) || 0);

  const handleSave = async () => {
    if (!selectedProduct) {
      Alert.alert('Required', 'Please select a product');
      return;
    }
    const qty = parseFloat(quantity);
    if (!qty || qty <= 0) {
      Alert.alert('Required', 'Please enter quantity');
      return;
    }
    if (stockType === 'out' && qty > selectedProduct.stock_quantity) {
      Alert.alert('Insufficient Stock', `Only ${selectedProduct.stock_quantity} ${selectedProduct.unit} available`);
      return;
    }
    setSaving(true);
    try {
      await addStockEntry(
        selectedProduct.id,
        stockType,
        qty,
        parseFloat(rate) || 0,
        undefined,
        undefined,
        notes.trim() || undefined,
      );
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const isIn = stockType === 'in';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{isIn ? 'Stock In' : 'Stock Out'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.typeToggle}>
            <Pressable
              style={[styles.typeBtn, isIn && { backgroundColor: Colors.green }]}
              onPress={() => setStockType('in')}
            >
              <Feather name="arrow-down-circle" size={16} color={isIn ? Colors.white : Colors.textSecondary} />
              <Text style={[styles.typeBtnText, isIn && { color: Colors.white }]}>Stock In</Text>
            </Pressable>
            <Pressable
              style={[styles.typeBtn, !isIn && { backgroundColor: Colors.red }]}
              onPress={() => setStockType('out')}
            >
              <Feather name="arrow-up-circle" size={16} color={!isIn ? Colors.white : Colors.textSecondary} />
              <Text style={[styles.typeBtnText, !isIn && { color: Colors.white }]}>Stock Out</Text>
            </Pressable>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product *</Text>
            {selectedProduct ? (
              <View style={styles.selectedProduct}>
                <View style={[styles.prodIcon, { backgroundColor: Colors.primaryBg }]}>
                  <Feather name="package" size={16} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.prodName}>{selectedProduct.name}</Text>
                  <Text style={styles.prodStock}>
                    Current Stock: {selectedProduct.stock_quantity} {selectedProduct.unit}
                  </Text>
                </View>
                <Pressable onPress={() => setSelectedProduct(null)}>
                  <Feather name="x-circle" size={20} color={Colors.textMuted} />
                </Pressable>
              </View>
            ) : (
              <View>
                <View style={styles.inputRow}>
                  <Feather name="search" size={18} color={Colors.textMuted} />
                  <TextInput
                    style={styles.input}
                    placeholder="Search product..."
                    placeholderTextColor={Colors.textMuted}
                    value={productSearch}
                    onChangeText={handleSearch}
                  />
                </View>
                {showSearch && searchResults.length > 0 && (
                  <View style={styles.searchDropdown}>
                    {searchResults.slice(0, 5).map(p => (
                      <Pressable
                        key={p.id}
                        style={styles.searchItem}
                        onPress={() => selectProduct(p)}
                      >
                        <Text style={styles.searchItemName}>{p.name}</Text>
                        <Text style={styles.searchItemStock}>{p.stock_quantity} {p.unit}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Quantity *</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={Colors.textMuted}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                />
                <Text style={styles.unitLabel}>{selectedProduct?.unit || 'units'}</Text>
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Rate (Rs)</Text>
              <View style={styles.inputRow}>
                <Text style={styles.rsPrefix}>Rs</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={Colors.textMuted}
                  value={rate}
                  onChangeText={setRate}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {totalAmount > 0 && (
            <View style={[styles.totalCard, { borderLeftColor: isIn ? Colors.green : Colors.red }]}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={[styles.totalAmount, { color: isIn ? Colors.green : Colors.red }]}>
                Rs {totalAmount.toLocaleString('en-PK')}
              </Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (optional)</Text>
            <View style={[styles.inputRow, { height: 80, alignItems: 'flex-start', paddingTop: Spacing.md }]}>
              <Feather name="edit-3" size={18} color={Colors.textMuted} style={{ marginTop: 2 }} />
              <TextInput
                style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
                placeholder="Add any notes..."
                placeholderTextColor={Colors.textMuted}
                value={notes}
                onChangeText={setNotes}
                multiline
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <Pressable
          style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
          onPress={handleSave}
          disabled={saving}
        >
          <LinearGradient
            colors={isIn
              ? [Colors.successGradientStart, Colors.successGradientEnd]
              : [Colors.dangerGradientStart, Colors.dangerGradientEnd]}
            style={styles.saveBtnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Feather name={isIn ? 'arrow-down-circle' : 'arrow-up-circle'} size={20} color={Colors.white} />
            <Text style={styles.saveBtnText}>
              {saving ? 'SAVING...' : isIn ? 'ADD STOCK' : 'REMOVE STOCK'}
            </Text>
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
  typeToggle: {
    flexDirection: 'row', backgroundColor: Colors.white, borderRadius: BorderRadius.md,
    padding: 3, ...Shadow.small,
  },
  typeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, paddingVertical: Spacing.md, borderRadius: BorderRadius.sm,
  },
  typeBtnText: { fontSize: FontSize.md, fontFamily: FontFamily.semiBold, color: Colors.textSecondary },
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
  selectedProduct: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    borderRadius: BorderRadius.md, padding: Spacing.lg, gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.primary + '30',
  },
  prodIcon: { width: 36, height: 36, borderRadius: BorderRadius.sm, alignItems: 'center', justifyContent: 'center' },
  prodName: { fontSize: FontSize.md, fontFamily: FontFamily.semiBold, color: Colors.text },
  prodStock: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textSecondary, marginTop: 2 },
  searchDropdown: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.md,
    marginTop: Spacing.xs, ...Shadow.medium, overflow: 'hidden',
  },
  searchItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  searchItemName: { fontSize: FontSize.md, fontFamily: FontFamily.medium, color: Colors.text },
  searchItemStock: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted },
  row: { flexDirection: 'row', gap: Spacing.md },
  totalCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.md,
    padding: Spacing.lg, borderLeftWidth: 3, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center', ...Shadow.small,
  },
  totalLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.textSecondary },
  totalAmount: { fontSize: FontSize.xl, fontFamily: FontFamily.bold },
  footer: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  saveBtn: { borderRadius: BorderRadius.md, ...Shadow.medium },
  saveBtnGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: Spacing.lg, borderRadius: BorderRadius.md, gap: Spacing.sm,
  },
  saveBtnText: { fontSize: FontSize.md, fontFamily: FontFamily.bold, color: Colors.white },
});
