import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import Colors from '@/constants/colors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import {
  searchCustomers,
  searchProducts,
  createBill,
  getProducts,
  type Customer,
  type Product,
} from '@/database';

type BillItem = { product: Product; quantity: number; price: number };

export default function CreateBillScreen() {
  const insets = useSafeAreaInsets();

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [items, setItems] = useState<BillItem[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [customerResults, setCustomerResults] = useState<Customer[]>([]);
  const [productResults, setProductResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  const customerSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const productSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleCustomerSearch = useCallback((text: string) => {
    setCustomerSearch(text);
    if (customerSearchTimer.current) clearTimeout(customerSearchTimer.current);
    if (text.trim().length === 0) {
      setCustomerResults([]);
      setShowCustomerDropdown(false);
      return;
    }
    customerSearchTimer.current = setTimeout(async () => {
      const results = await searchCustomers(text.trim());
      setCustomerResults(results);
      setShowCustomerDropdown(results.length > 0);
    }, 300);
  }, []);

  const handleProductSearch = useCallback((text: string) => {
    setProductSearch(text);
    if (productSearchTimer.current) clearTimeout(productSearchTimer.current);
    if (text.trim().length === 0) {
      setProductResults([]);
      setShowProductDropdown(false);
      return;
    }
    productSearchTimer.current = setTimeout(async () => {
      const results = await searchProducts(text.trim());
      const filtered = results.filter(
        (p) => !items.some((item) => item.product.id === p.id)
      );
      setProductResults(filtered);
      setShowProductDropdown(filtered.length > 0);
    }, 300);
  }, [items]);

  const selectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch('');
    setCustomerResults([]);
    setShowCustomerDropdown(false);
    if (Platform.OS !== 'web') Haptics.selectionAsync();
  };

  const removeCustomer = () => {
    setSelectedCustomer(null);
    if (Platform.OS !== 'web') Haptics.selectionAsync();
  };

  const addItem = (product: Product) => {
    setItems((prev) => [
      ...prev,
      { product, quantity: 1, price: product.sale_price || 0 },
    ]);
    setProductSearch('');
    setProductResults([]);
    setShowProductDropdown(false);
    if (Platform.OS !== 'web') Haptics.selectionAsync();
  };

  const updateItemQuantity = (index: number, qty: string) => {
    const val = parseFloat(qty) || 0;
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, quantity: val } : item)));
  };

  const updateItemPrice = (index: number, price: string) => {
    const val = parseFloat(price) || 0;
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, price: val } : item)));
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
    if (Platform.OS !== 'web') Haptics.selectionAsync();
  };

  const handleCreateBill = async () => {
    if (items.length === 0) {
      Alert.alert('No Items', 'Please add at least one item to the bill.');
      return;
    }

    const invalidItems = items.filter((item) => item.quantity <= 0 || item.price <= 0);
    if (invalidItems.length > 0) {
      Alert.alert('Invalid Items', 'All items must have valid quantity and price.');
      return;
    }

    setLoading(true);
    try {
      const billItems = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const billId = await createBill(
        selectedCustomer?.id ?? null,
        billItems,
        ''
      );

      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      router.replace({ pathname: '/bill/[id]', params: { id: billId.toString() } });
    } catch (e) {
      Alert.alert('Error', 'Failed to create bill. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={[Colors.headerGradientStart, Colors.headerGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={Colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Create Bill</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLabelRow}>
                <MaterialCommunityIcons name="account-outline" size={20} color={Colors.primary} />
                <Text style={styles.sectionLabel}>Select Customer</Text>
              </View>
              {!selectedCustomer && (
                <View style={styles.optionalBadge}>
                  <Text style={styles.optionalBadgeText}>Optional</Text>
                </View>
              )}
            </View>

            {selectedCustomer ? (
              <View style={styles.customerChip}>
                <View style={styles.customerChipAvatar}>
                  <Text style={styles.customerChipAvatarText}>
                    {selectedCustomer.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.customerChipName}>{selectedCustomer.name}</Text>
                  {selectedCustomer.phone ? (
                    <Text style={styles.customerChipPhone}>{selectedCustomer.phone}</Text>
                  ) : null}
                </View>
                <Pressable onPress={removeCustomer} style={styles.chipRemoveBtn}>
                  <Feather name="x" size={16} color={Colors.textSecondary} />
                </Pressable>
              </View>
            ) : (
              <View>
                <View style={styles.searchInputWrapper}>
                  <Feather name="search" size={16} color={Colors.textMuted} style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search customer by name or phone..."
                    placeholderTextColor={Colors.textMuted}
                    value={customerSearch}
                    onChangeText={handleCustomerSearch}
                    autoCapitalize="none"
                  />
                </View>
                {showCustomerDropdown && (
                  <View style={styles.dropdown}>
                    {customerResults.map((customer) => (
                      <Pressable
                        key={customer.id}
                        style={styles.dropdownItem}
                        onPress={() => selectCustomer(customer)}
                      >
                        <View style={styles.dropdownItemAvatar}>
                          <Text style={styles.dropdownItemAvatarText}>
                            {customer.name.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.dropdownItemName}>{customer.name}</Text>
                          {customer.phone ? (
                            <Text style={styles.dropdownItemSub}>{customer.phone}</Text>
                          ) : null}
                        </View>
                        <Text style={[
                          styles.dropdownItemBalance,
                          { color: customer.current_balance >= 0 ? Colors.green : Colors.red }
                        ]}>
                          Rs {Math.abs(customer.current_balance).toLocaleString()}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
                <View style={styles.walkinRow}>
                  <MaterialCommunityIcons name="walk" size={16} color={Colors.textSecondary} />
                  <Text style={styles.walkinText}>Leave empty for walk-in customer</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLabelRow}>
                <MaterialCommunityIcons name="package-variant" size={20} color={Colors.primary} />
                <Text style={styles.sectionLabel}>Add Items</Text>
              </View>
              {items.length > 0 && (
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{items.length}</Text>
                </View>
              )}
            </View>

            <View style={styles.searchInputWrapper}>
              <Feather name="search" size={16} color={Colors.textMuted} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search products..."
                placeholderTextColor={Colors.textMuted}
                value={productSearch}
                onChangeText={handleProductSearch}
                autoCapitalize="none"
              />
            </View>

            {showProductDropdown && (
              <View style={styles.dropdown}>
                {productResults.map((product) => (
                  <Pressable
                    key={product.id}
                    style={styles.dropdownItem}
                    onPress={() => addItem(product)}
                  >
                    <View style={[styles.dropdownItemAvatar, { backgroundColor: Colors.primaryBg }]}>
                      <MaterialCommunityIcons name="cube-outline" size={16} color={Colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.dropdownItemName}>{product.name}</Text>
                      <Text style={styles.dropdownItemSub}>
                        Stock: {product.stock_quantity} {product.unit}
                      </Text>
                    </View>
                    {product.sale_price > 0 && (
                      <Text style={styles.dropdownItemPrice}>Rs {product.sale_price}</Text>
                    )}
                    <Feather name="plus-circle" size={20} color={Colors.primary} style={{ marginLeft: Spacing.sm }} />
                  </Pressable>
                ))}
              </View>
            )}

            {items.length > 0 && (
              <View style={styles.itemsList}>
                {items.map((item, index) => (
                  <View key={`${item.product.id}-${index}`} style={styles.itemCard}>
                    <View style={styles.itemCardHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.itemName}>{item.product.name}</Text>
                        <Text style={styles.itemUnit}>{item.product.unit}</Text>
                      </View>
                      <Pressable onPress={() => removeItem(index)} style={styles.itemRemoveBtn}>
                        <Feather name="trash-2" size={14} color={Colors.red} />
                      </Pressable>
                    </View>
                    <View style={styles.itemInputRow}>
                      <View style={styles.itemInputGroup}>
                        <Text style={styles.itemInputLabel}>Qty</Text>
                        <TextInput
                          style={styles.itemInput}
                          value={item.quantity.toString()}
                          onChangeText={(v) => updateItemQuantity(index, v)}
                          keyboardType="numeric"
                          selectTextOnFocus
                        />
                      </View>
                      <View style={styles.itemInputGroup}>
                        <Text style={styles.itemInputLabel}>Price</Text>
                        <TextInput
                          style={styles.itemInput}
                          value={item.price.toString()}
                          onChangeText={(v) => updateItemPrice(index, v)}
                          keyboardType="numeric"
                          selectTextOnFocus
                        />
                      </View>
                      <View style={styles.itemTotalGroup}>
                        <Text style={styles.itemInputLabel}>Total</Text>
                        <Text style={styles.itemTotalText}>
                          Rs {(item.quantity * item.price).toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}

                <View style={styles.subtotalRow}>
                  <Text style={styles.subtotalLabel}>Subtotal</Text>
                  <Text style={styles.subtotalValue}>Rs {subtotal.toLocaleString()}</Text>
                </View>
              </View>
            )}

            {items.length === 0 && (
              <View style={styles.emptyItems}>
                <MaterialCommunityIcons name="cart-outline" size={40} color={Colors.textLight} />
                <Text style={styles.emptyItemsText}>Search and add products above</Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.md }]}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryLabel}>
                {items.length} {items.length === 1 ? 'Item' : 'Items'}
              </Text>
              <Text style={styles.summaryCustomer}>
                {selectedCustomer ? selectedCustomer.name : 'Walk-in Customer'}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>Rs {subtotal.toLocaleString()}</Text>
            </View>
          </View>

          <Pressable
            onPress={handleCreateBill}
            disabled={loading || items.length === 0}
            style={{ opacity: loading || items.length === 0 ? 0.5 : 1 }}
          >
            <LinearGradient
              colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.createBtn}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <>
                  <MaterialCommunityIcons name="receipt" size={20} color={Colors.white} />
                  <Text style={styles.createBtnText}>CREATE BILL</Text>
                </>
              )}
            </LinearGradient>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadow.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sectionLabel: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    color: Colors.text,
  },
  optionalBadge: {
    backgroundColor: Colors.infoBg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.full,
  },
  optionalBadgeText: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.medium,
    color: Colors.info,
  },
  customerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryBg,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  customerChipAvatar: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerChipAvatarText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  customerChipName: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: Colors.text,
  },
  customerChipPhone: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  chipRemoveBtn: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginLeft: Spacing.md,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? Spacing.md : Spacing.sm,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.text,
  },
  dropdown: {
    marginTop: Spacing.xs,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadow.small,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  dropdownItemAvatar: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownItemAvatarText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: Colors.textSecondary,
  },
  dropdownItemName: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
    color: Colors.text,
  },
  dropdownItemSub: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  dropdownItemBalance: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
  },
  dropdownItemPrice: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: Colors.textSecondary,
  },
  walkinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    paddingLeft: Spacing.xs,
  },
  walkinText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
  },
  countBadge: {
    backgroundColor: Colors.primary,
    width: 22,
    height: 22,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeText: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  itemsList: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  itemCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  itemCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  itemName: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: Colors.text,
  },
  itemUnit: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    marginTop: 1,
  },
  itemRemoveBtn: {
    width: 30,
    height: 30,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.redBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-end',
  },
  itemInputGroup: {
    flex: 1,
  },
  itemInputLabel: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.xxs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemInput: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Platform.OS === 'ios' ? Spacing.sm : Spacing.xs,
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
    color: Colors.text,
    textAlign: 'center',
  },
  itemTotalGroup: {
    flex: 1,
    alignItems: 'flex-end',
  },
  itemTotalText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: Colors.primary,
    paddingVertical: Platform.OS === 'ios' ? Spacing.sm : Spacing.xs,
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  subtotalLabel: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: Colors.textSecondary,
  },
  subtotalValue: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: Colors.text,
  },
  emptyItems: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.sm,
  },
  emptyItemsText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
  },
  bottomBar: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadow.medium,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  summaryLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
  },
  summaryCustomer: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    marginTop: 2,
  },
  summaryTotalLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
  },
  summaryTotalValue: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    color: Colors.text,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  createBtnText: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: Colors.white,
    letterSpacing: 1,
  },
});
