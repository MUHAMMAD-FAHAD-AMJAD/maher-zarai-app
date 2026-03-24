import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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

type StockTab = 'all' | 'low' | 'out';

export default function StockScreen() {
  const insets = useSafeAreaInsets();
  const { userRole } = useAuth();
  const [activeTab, setActiveTab] = useState<StockTab>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const loadData = useCallback(async () => {
    try {
      const all = await getProducts();
      setAllProducts(all);
      if (activeTab === 'low') {
        const data = await getLowStockProducts();
        setProducts(data);
      } else if (activeTab === 'out') {
        setProducts(all.filter(p => p.stock_quantity <= 0));
      } else {
        setProducts(all);
      }
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

  const inStockCount = allProducts.filter(p => p.stock_quantity > 0).length;
  const outOfStockCount = allProducts.filter(p => p.stock_quantity <= 0).length;
  const lowStockCount = allProducts.filter(p => p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold).length;

  const getUnitLabel = (unit: string) => {
    const labels: Record<string, string> = {
      bag: 'Bags', btl: 'Bottles', pkt: 'Packets', pcs: 'Pieces',
      kg: 'kg', can: 'Cans', box: 'Boxes', gln: 'Gallons', pack: 'Packs',
    };
    return labels[unit] || unit;
  };

  const getCategoryIcon = (category: string | null): string => {
    switch (category) {
      case 'Fertilizer': return 'leaf';
      case 'Pesticide': return 'bug-outline';
      case 'Seed': return 'seed-outline';
      default: return 'cube-outline';
    }
  };

  const getCategoryColor = (category: string | null): string => {
    switch (category) {
      case 'Fertilizer': return Colors.green;
      case 'Pesticide': return Colors.red;
      case 'Seed': return Colors.warning;
      default: return Colors.info;
    }
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const isOutOfStock = item.stock_quantity <= 0;
    const isLowStock = !isOutOfStock && item.stock_quantity <= item.low_stock_threshold;
    const catColor = getCategoryColor(item.category);

    return (
      <Pressable
        style={({ pressed }) => [styles.productRow, pressed && styles.productRowPressed]}
        onPress={() => router.push({ pathname: '/add-stock', params: { productId: item.id.toString() } })}
      >
        <View style={[styles.productIcon, { backgroundColor: catColor + '12' }]}>
          <MaterialCommunityIcons
            name={getCategoryIcon(item.category) as any}
            size={20}
            color={catColor}
          />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.productMeta}>
            <Text style={styles.productCategory}>{item.category || 'General'}</Text>
            <Text style={styles.productDot}>{'\u00B7'}</Text>
            <Text style={styles.productUnit}>{getUnitLabel(item.unit)}</Text>
          </View>
        </View>
        <View style={styles.stockContainer}>
          <Text style={[
            styles.stockQty,
            { color: isOutOfStock ? Colors.red : isLowStock ? Colors.warning : Colors.green }
          ]}>
            {item.stock_quantity}
          </Text>
          {isOutOfStock && (
            <View style={[styles.stockBadge, { backgroundColor: Colors.redBg }]}>
              <Text style={[styles.stockBadgeText, { color: Colors.red }]}>Out</Text>
            </View>
          )}
          {isLowStock && (
            <View style={[styles.stockBadge, { backgroundColor: Colors.warningBg }]}>
              <Text style={[styles.stockBadgeText, { color: Colors.warningDark }]}>Low</Text>
            </View>
          )}
          {!isOutOfStock && !isLowStock && (
            <Text style={styles.stockUnit}>{item.unit}</Text>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Stock Book</Text>
          <Text style={styles.headerSubtitle}>{allProducts.length} products tracked</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.7 }]}
            onPress={() => router.push({ pathname: '/add-stock', params: { type: 'in' } })}
          >
            <Feather name="arrow-down-circle" size={20} color={Colors.green} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.7 }]}
            onPress={() => router.push({ pathname: '/add-stock', params: { type: 'out' } })}
          >
            <Feather name="arrow-up-circle" size={20} color={Colors.red} />
          </Pressable>
        </View>
      </View>

      <View style={styles.statsRow}>
        <Pressable style={styles.statCard} onPress={() => setActiveTab('all')}>
          <LinearGradient
            colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
            style={styles.statIconCircle}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Feather name="package" size={14} color={Colors.white} />
          </LinearGradient>
          <Text style={[styles.statValue, { color: Colors.primary }]}>{allProducts.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </Pressable>
        <Pressable style={styles.statCard} onPress={() => setActiveTab('all')}>
          <View style={[styles.statIconCircle, { backgroundColor: Colors.greenBg }]}>
            <Feather name="check-circle" size={14} color={Colors.green} />
          </View>
          <Text style={[styles.statValue, { color: Colors.green }]}>{inStockCount}</Text>
          <Text style={styles.statLabel}>In Stock</Text>
        </Pressable>
        <Pressable style={styles.statCard} onPress={() => setActiveTab('low')}>
          <View style={[styles.statIconCircle, { backgroundColor: Colors.warningBg }]}>
            <Feather name="alert-triangle" size={14} color={Colors.warning} />
          </View>
          <Text style={[styles.statValue, { color: Colors.warning }]}>{lowStockCount}</Text>
          <Text style={styles.statLabel}>Low</Text>
        </Pressable>
        <Pressable style={styles.statCard} onPress={() => setActiveTab('out')}>
          <View style={[styles.statIconCircle, { backgroundColor: Colors.redBg }]}>
            <Feather name="x-circle" size={14} color={Colors.red} />
          </View>
          <Text style={[styles.statValue, { color: Colors.red }]}>{outOfStockCount}</Text>
          <Text style={styles.statLabel}>Out</Text>
        </Pressable>
      </View>

      <View style={styles.tabBar}>
        {([
          { key: 'all', label: 'All Items' },
          { key: 'low', label: 'Low Stock' },
          { key: 'out', label: 'Out of Stock' },
        ] as { key: StockTab; label: string }[]).map(tab => (
          <Pressable
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
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
          <Pressable onPress={() => setSearchQuery('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Feather name="x-circle" size={18} color={Colors.textMuted} />
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
            <View style={styles.emptyIconWrap}>
              <Feather name="package" size={48} color={Colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptyText}>
              {activeTab === 'low' ? 'No low stock alerts' : activeTab === 'out' ? 'All items are in stock' : 'Add products to track inventory'}
            </Text>
          </View>
        }
      />

      {userRole === 'admin' && (
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
          onPress={() => router.push('/add-product')}
        >
          <LinearGradient
            colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
            style={styles.fabGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Feather name="plus" size={20} color={Colors.white} />
            <Text style={styles.fabText}>ADD PRODUCT</Text>
          </LinearGradient>
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
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: Colors.textMuted,
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  headerBtn: {
    width: 42,
    height: 42,
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
    backgroundColor: Colors.white,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    ...Shadow.small,
  },
  statIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
  },
  statLabel: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.medium,
    color: Colors.textMuted,
    marginTop: 1,
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
    paddingVertical: Spacing.sm + 2,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSize.xs,
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
    height: 46,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.text,
    height: 46,
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
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  productRowPressed: {
    backgroundColor: Colors.primaryBg,
    borderColor: Colors.primary + '30',
  },
  productIcon: {
    width: 42,
    height: 42,
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
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: Spacing.xs,
  },
  productCategory: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
  },
  productDot: {
    fontSize: FontSize.xxs,
    color: Colors.textMuted,
  },
  productUnit: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
  },
  stockContainer: {
    alignItems: 'flex-end',
    minWidth: 50,
  },
  stockQty: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
  },
  stockUnit: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    marginTop: 1,
  },
  stockBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
    marginTop: 2,
  },
  stockBadgeText: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.semiBold,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.jumbo,
    gap: Spacing.sm,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    color: Colors.text,
  },
  emptyText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: Spacing.lg,
    borderRadius: BorderRadius.full,
    ...Shadow.medium,
  },
  fabPressed: {
    transform: [{ scale: 0.95 }],
  },
  fabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  fabText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
});
