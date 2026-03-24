import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import Colors from '@/constants/colors';
import { FontFamily, FontSize, Spacing, BorderRadius } from '@/constants/theme';
import { addStockEntry, getProducts, type Product } from '@/database';

export default function AddStockScreen() {
  const { productId, type: stockType } = useLocalSearchParams<{ productId?: string; type?: string }>();
  const insets = useSafeAreaInsets();
  const isIn = stockType !== 'out';
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(productId ? parseInt(productId) : null);
  const [quantity, setQuantity] = useState('');
  const [rate, setRate] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleSave = async () => {
    if (!selectedProductId) {
      Alert.alert('Required', 'Please select a product.');
      return;
    }
    const qty = parseFloat(quantity);
    const r = parseFloat(rate);
    if (!qty || qty <= 0) {
      Alert.alert('Invalid', 'Please enter a valid quantity.');
      return;
    }
    if (!r || r <= 0) {
      Alert.alert('Invalid', 'Please enter a valid rate.');
      return;
    }

    setSaving(true);
    try {
      await addStockEntry(
        selectedProductId,
        isIn ? 'in' : 'out',
        qty,
        r,
        undefined,
        undefined,
        notes.trim(),
      );
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to save stock entry.');
    }
    setSaving(false);
  };

  const totalAmount = (parseFloat(quantity) || 0) * (parseFloat(rate) || 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={[styles.headerBar, { backgroundColor: isIn ? Colors.green : Colors.red }]}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
          onPress={() => router.back()}
        >
          <Feather name="x" size={22} color={Colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Stock {isIn ? 'IN' : 'OUT'}</Text>
        <Pressable
          style={({ pressed }) => [styles.saveHeaderBtn, pressed && { opacity: 0.8 }, saving && { opacity: 0.5 }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveHeaderText}>{saving ? 'Saving...' : 'Save'}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!selectedProduct ? (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Select Product *</Text>
            <TextInput
              style={styles.input}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search products..."
              placeholderTextColor={Colors.textMuted}
            />
            <View style={styles.productList}>
              {filteredProducts.slice(0, 10).map(p => (
                <Pressable
                  key={p.id}
                  style={({ pressed }) => [styles.productItem, pressed && { backgroundColor: Colors.primaryBg }]}
                  onPress={() => {
                    setSelectedProductId(p.id);
                    setSearchQuery('');
                  }}
                >
                  <Text style={styles.productItemName}>{p.name}</Text>
                  <Text style={styles.productItemStock}>Stock: {p.stock_quantity} {p.unit}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.selectedProductCard}>
            <View style={styles.selectedProductInfo}>
              <Text style={styles.selectedProductName}>{selectedProduct.name}</Text>
              <Text style={styles.selectedProductStock}>Current Stock: {selectedProduct.stock_quantity} {selectedProduct.unit}</Text>
            </View>
            <Pressable onPress={() => setSelectedProductId(null)}>
              <Feather name="x" size={18} color={Colors.textMuted} />
            </Pressable>
          </View>
        )}

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              placeholder="0"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
            />
          </View>
          <View style={{ width: Spacing.md }} />
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Rate (Rs per unit)</Text>
            <TextInput
              style={styles.input}
              value={rate}
              onChangeText={setRate}
              placeholder="0"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
            />
          </View>
        </View>

        {totalAmount > 0 && (
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={[styles.totalValue, { color: isIn ? Colors.green : Colors.red }]}>
              Rs {totalAmount.toLocaleString('en-PK')}
            </Text>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, { minHeight: 60, textAlignVertical: 'top' }]}
            value={notes}
            onChangeText={setNotes}
            placeholder="e.g. Supplier name, details..."
            placeholderTextColor={Colors.textMuted}
            multiline
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    flex: 1,
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  saveHeaderBtn: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  saveHeaderText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: Colors.white,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: 100,
  },
  inputGroup: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  productList: {
    marginTop: Spacing.sm,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.divider,
  },
  productItemName: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
    color: Colors.text,
    flex: 1,
  },
  productItemStock: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
  },
  selectedProductCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryBg,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  selectedProductInfo: {
    flex: 1,
  },
  selectedProductName: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: Colors.text,
  },
  selectedProductStock: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
  },
  totalCard: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xl,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
  },
  totalLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
  },
  totalValue: {
    fontSize: FontSize.xxxl,
    fontFamily: FontFamily.bold,
    marginTop: Spacing.xs,
  },
});
