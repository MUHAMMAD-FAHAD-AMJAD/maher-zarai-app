import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Platform,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { getProducts, getLowStockProducts, type Product } from '@/database';

type StockTab = 'all' | 'low';

export default function StockScreen() {
  const insets = useSafeAreaInsets();
  const { userRole } = useAuth();
  const [activeTab, setActiveTab] = useState<StockTab>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [totalValue, setTotalValue] = useState(0);

  const loadData = useCallback(async () => {
    try {
      let data: Product[];
      if (activeTab === 'low') {
        data = await getLowStockProducts();
      } else {
        data = await getProducts();
      }
      setProducts(data);
      const value = data.reduce((sum, p) => sum + (p.stock_quantity * p.sale_price), 0);
      setTotalValue(value);
    } catch (e) {
      console.error('Error loading products:', e);
    }
  }, [activeTab]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inStockCount = products.filter(p => p.stock_quantity > 0).length;
  const outOfStockCount = products.filter(p => p.stock_quantity === 0).length;

  const getUnitLabel = (unit: string) => {
    const labels: Record<string, string> = {
      bag: 'Bags', btl: 'Bottles', pkt: 'Packets', pcs: 'Pieces',
      kg: 'kg', can: 'Cans', box: 'Boxes', gln: 'Gallons', pack: 'Packs',
    };
    return labels[unit] || unit;
  };

  const getCategoryIcon = (category: string | null) => {
    switch (category) {
      case 'Fertilizer': return 'leaf';
      case 'Pesticide': return 'bug-outline';
      case 'Seed': return 'seed-outline';
      default: return 'cube-outline';
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <Pressable
      style={({ pressed }) => [styles.productRow, pressed && styles.productRowPressed]}
      onPress={() => {}}
    >
      <View style={[styles.productIcon, {
        backgroundColor: item.stock_quantity > 0 ? Colors.greenBg : Colors.redBg
      }]}>
        <MaterialCommunityIcons
          name={getCategoryIcon(item.category) as any}
          size={20}
          color={item.stock_quantity > 0 ? Colors.green : Colors.red}
        />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productUnit}>{getUnitLabel(item.unit)}</Text>
      </View>
      <View style={styles.stockContainer}>
        <Text style={[
          styles.stockQty,
          { color: item.stock_quantity > 0 ? Colors.green : Colors.red }
        ]}>
          {item.stock_quantity}
        </Text>
        <Text style={styles.stockUnit}>{item.unit}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stock Book</Text>
        <Pressable
          style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.7 }]}
          onPress={() => {}}
        >
          <Feather name="download" size={20} color={Colors.text} />
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: Colors.primaryBg }]}>
          <Text style={styles.statValue}>{products.length}</Text>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: Colors.greenBg }]}>
          <Text style={[styles.statValue, { color: Colors.green }]}>{inStockCount}</Text>
          <Text style={styles.statLabel}>In Stock</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: Colors.redBg }]}>
          <Text style={[styles.statValue, { color: Colors.red }]}>{outOfStockCount}</Text>
          <Text style={styles.statLabel}>Out of Stock</Text>
        </View>
      </View>

      <View style={styles.reportButtons}>
        <Pressable style={[styles.reportBtn, { backgroundColor: Colors.greenBg }]} onPress={() => {}}>
          <Feather name="arrow-down-circle" size={16} color={Colors.green} />
          <Text style={[styles.reportBtnText, { color: Colors.green }]}>Stock IN Report</Text>
        </Pressable>
        <Pressable style={[styles.reportBtn, { backgroundColor: Colors.redBg }]} onPress={() => {}}>
          <Feather name="arrow-up-circle" size={16} color={Colors.red} />
          <Text style={[styles.reportBtnText, { color: Colors.red }]}>Stock OUT Report</Text>
        </Pressable>
      </View>

      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>All Items</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'low' && styles.tabActive]}
          onPress={() => setActiveTab('low')}
        >
          <Text style={[styles.tabText, activeTab === 'low' && styles.tabTextActive]}>Low Stock</Text>
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={18} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <Pressable onPress={() => setSearchQuery('')}>
            <Feather name="x" size={18} color={Colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id.toString()}
        renderItem={renderProduct}
        contentContainerStyle={[styles.listContent, { paddingBottom: 140 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="package" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
      />

      {userRole === 'admin' && (
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
          onPress={() => router.push('/add-product')}
        >
          <Feather name="plus" size={24} color={Colors.white} />
          <Text style={styles.fabText}>ADD PRODUCT</Text>
        </Pressable>
      )}
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    color: Colors.text,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Colors.primary,
  },
  statLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  reportButtons: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  reportBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  reportBtnText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: 3,
    ...Shadow.small,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
    ...Shadow.small,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.text,
    height: 44,
  },
  listContent: {
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.small,
  },
  productRowPressed: {
    backgroundColor: Colors.primaryBg,
  },
  productIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  productInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  productName: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: Colors.text,
  },
  productUnit: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    marginTop: 2,
  },
  stockContainer: {
    alignItems: 'flex-end',
  },
  stockQty: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
  },
  stockUnit: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxxl,
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
    color: Colors.textMuted,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
    ...Shadow.medium,
  },
  fabPressed: {
    backgroundColor: Colors.primaryDark,
    transform: [{ scale: 0.95 }],
  },
  fabText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
});
