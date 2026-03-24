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
import { getCustomers, getDashboardStats, type Customer } from '@/database';

type TabType = 'customers' | 'suppliers' | 'all';

export default function KhataScreen() {
  const insets = useSafeAreaInsets();
  const { userRole } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('customers');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalReceivable: 0,
    totalPayable: 0,
    customerCount: 0,
    supplierCount: 0,
    totalProducts: 0,
    lowStockCount: 0,
  });

  const loadData = useCallback(async () => {
    try {
      const type = activeTab === 'all' ? undefined : activeTab === 'customers' ? 'customer' : 'supplier';
      const data = await getCustomers(type);
      setCustomers(data);
      const dashStats = await getDashboardStats();
      setStats(dashStats);
    } catch (e) {
      console.error('Error loading data:', e);
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

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const formatAmount = (amount: number) => {
    return `Rs ${Math.abs(amount).toLocaleString('en-PK')}`;
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = ['#FF6B35', '#E53935', '#2E7D32', '#1976D2', '#7B1FA2', '#F57C00', '#00838F', '#C62828'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const renderCustomer = ({ item }: { item: Customer }) => {
    const balance = item.current_balance;
    const isPositive = balance > 0;

    return (
      <Pressable
        style={({ pressed }) => [styles.customerRow, pressed && styles.customerRowPressed]}
        onPress={() => router.push({ pathname: '/customer/[id]', params: { id: item.id.toString() } })}
      >
        <View style={[styles.avatar, { backgroundColor: getAvatarColor(item.name) }]}>
          <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
        </View>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.customerDate}>
            {item.type === 'supplier' ? 'Supplier' : 'Customer'}
            {item.phone ? ` \u00B7 ${item.phone}` : ''}
          </Text>
        </View>
        <View style={styles.balanceContainer}>
          {balance !== 0 ? (
            <Text style={[styles.balanceAmount, { color: isPositive ? Colors.red : Colors.green }]}>
              {formatAmount(balance)}
            </Text>
          ) : (
            <Text style={[styles.balanceAmount, { color: Colors.textMuted }]}>Rs 0</Text>
          )}
          {balance > 0 && <Text style={styles.balanceLabel}>You'll Get</Text>}
          {balance < 0 && <Text style={[styles.balanceLabel, { color: Colors.green }]}>You'll Give</Text>}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Khata Book</Text>
        <Pressable
          style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.7 }]}
          onPress={() => {}}
        >
          <Feather name="download" size={20} color={Colors.text} />
        </Pressable>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Pressable style={styles.summaryItem} onPress={() => setActiveTab('customers')}>
            <Text style={styles.summaryLabel}>You Will Get</Text>
            <Text style={[styles.summaryAmount, { color: Colors.red }]}>
              {formatAmount(stats.totalReceivable)}
            </Text>
            <Text style={styles.summaryCount}>{stats.customerCount} Customers</Text>
          </Pressable>
          <View style={styles.summaryDivider} />
          <Pressable style={styles.summaryItem} onPress={() => setActiveTab('suppliers')}>
            <Text style={styles.summaryLabel}>You Will Give</Text>
            <Text style={[styles.summaryAmount, { color: Colors.green }]}>
              {formatAmount(stats.totalPayable)}
            </Text>
            <Text style={styles.summaryCount}>{stats.supplierCount} Suppliers</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.tabBar}>
        {(['customers', 'suppliers', 'all'] as TabType[]).map(tab => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'customers' ? 'Customers' : tab === 'suppliers' ? 'Suppliers' : 'All'}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={18} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or phone..."
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
        data={filteredCustomers}
        keyExtractor={item => item.id.toString()}
        renderItem={renderCustomer}
        contentContainerStyle={[styles.listContent, { paddingBottom: 140 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="account-group-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No customers found</Text>
          </View>
        }
      />

      {userRole === 'admin' && (
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
          onPress={() => router.push('/add-customer')}
        >
          <Feather name="plus" size={24} color={Colors.white} />
          <Text style={styles.fabText}>ADD CUSTOMER</Text>
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
  summaryCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    ...Shadow.medium,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  summaryAmount: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
  },
  summaryCount: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  summaryDivider: {
    width: 1,
    height: 50,
    backgroundColor: Colors.border,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
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
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.small,
  },
  customerRowPressed: {
    backgroundColor: Colors.primaryBg,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  customerInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  customerName: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: Colors.text,
  },
  customerDate: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    marginTop: 2,
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balanceAmount: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
  },
  balanceLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.red,
    marginTop: 2,
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
