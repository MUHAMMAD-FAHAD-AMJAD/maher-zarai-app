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
  Platform,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { getBills, getCustomer, getMonthlyStats, type Bill, type Customer } from '@/database';

type FilterType = 'all' | 'unpaid' | 'paid';

type BillWithCustomer = Bill & { customerName: string };

export default function BillsScreen() {
  const insets = useSafeAreaInsets();
  const { userRole } = useAuth();
  const [bills, setBills] = useState<BillWithCustomer[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalPayments: 0,
    totalBills: 0,
    billCount: 0,
  });

  const loadData = useCallback(async () => {
    try {
      const now = new Date();
      const statusFilter = activeFilter === 'all' ? undefined : activeFilter;
      const [billsData, monthlyStats] = await Promise.all([
        getBills(undefined, statusFilter),
        getMonthlyStats(now.getFullYear(), now.getMonth() + 1),
      ]);

      const billsWithCustomers: BillWithCustomer[] = await Promise.all(
        billsData.map(async (bill) => {
          let customerName = 'Walk-in Customer';
          if (bill.customer_id) {
            const customer = await getCustomer(bill.customer_id);
            if (customer) customerName = customer.name;
          }
          return { ...bill, customerName };
        })
      );

      setBills(billsWithCustomers);
      setStats(monthlyStats);
    } catch (e) {
      console.error('Error loading bills:', e);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

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

  const formatAmount = (amount: number) => {
    return `Rs ${Math.abs(amount).toLocaleString('en-PK')}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getStatusColor = (status: string) => {
    if (status === 'paid') return Colors.green;
    if (status === 'partial') return Colors.warning;
    return Colors.red;
  };

  const getStatusBgColor = (status: string) => {
    if (status === 'paid') return Colors.greenBg;
    if (status === 'partial') return Colors.warningBg;
    return Colors.redBg;
  };

  const renderBill = ({ item }: { item: BillWithCustomer }) => (
    <Pressable
      style={({ pressed }) => [styles.billCard, pressed && styles.billCardPressed]}
      onPress={() => router.push({ pathname: '/bill/[id]', params: { id: item.id.toString() } })}
    >
      <View style={styles.billCardLeft}>
        <View style={styles.billNumberBadge}>
          <Text style={styles.billNumberText}>#{item.bill_number}</Text>
        </View>
        <View style={styles.billInfo}>
          <Text style={styles.billCustomerName} numberOfLines={1}>{item.customerName}</Text>
          <Text style={styles.billDate}>{formatDate(item.date)}</Text>
        </View>
      </View>
      <View style={styles.billCardRight}>
        <Text style={styles.billAmount}>{formatAmount(item.total_amount)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(item.status) }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'web' ? 67 : 0 }]}>
      <LinearGradient
        colors={[Colors.headerGradientStart, Colors.headerGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, { paddingTop: insets.top + Spacing.md }]}
      >
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Bills</Text>
          <Pressable
            style={({ pressed }) => [styles.headerAddBtn, pressed && { opacity: 0.7 }]}
            onPress={() => router.push('/create-bill')}
          >
            <Feather name="plus" size={22} color={Colors.headerGradientStart} />
          </Pressable>
        </View>
      </LinearGradient>

      <View style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Sales</Text>
            <Text style={[styles.statValue, { color: Colors.primary }]}>{formatAmount(stats.totalBills)}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Bills</Text>
            <Text style={[styles.statValue, { color: Colors.text }]}>{stats.billCount}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Collected</Text>
            <Text style={[styles.statValue, { color: Colors.green }]}>{formatAmount(stats.totalPayments)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.filterBar}>
        {(['all', 'unpaid', 'paid'] as FilterType[]).map(tab => (
          <Pressable
            key={tab}
            style={[styles.filterTab, activeFilter === tab && styles.filterTabActive]}
            onPress={() => setActiveFilter(tab)}
          >
            <Text style={[styles.filterTabText, activeFilter === tab && styles.filterTabTextActive]}>
              {tab === 'all' ? 'All' : tab === 'unpaid' ? 'Unpaid' : 'Paid'}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={bills}
          keyExtractor={item => item.id.toString()}
          renderItem={renderBill}
          contentContainerStyle={[styles.listContent, { paddingBottom: 140 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <MaterialCommunityIcons name="receipt" size={56} color={Colors.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>No Bills Yet</Text>
              <Text style={styles.emptyText}>
                Create your first bill to start tracking sales and payments
              </Text>
            </View>
          }
        />
      )}

      {userRole === 'admin' && (
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
          onPress={() => router.push('/create-bill')}
        >
          <Feather name="plus" size={24} color={Colors.white} />
          <Text style={styles.fabText}>NEW BILL</Text>
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
  headerGradient: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  headerAddBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.small,
  },
  statsCard: {
    marginHorizontal: Spacing.lg,
    marginTop: -Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    ...Shadow.medium,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  filterBar: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: 3,
    ...Shadow.small,
  },
  filterTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
  },
  filterTabText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: Colors.textSecondary,
  },
  filterTabTextActive: {
    color: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  billCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.small,
  },
  billCardPressed: {
    backgroundColor: Colors.primaryBg,
  },
  billCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.sm,
  },
  billNumberBadge: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  billNumberText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: Colors.primary,
  },
  billInfo: {
    flex: 1,
  },
  billCustomerName: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: Colors.text,
  },
  billDate: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    marginTop: 2,
  },
  billCardRight: {
    alignItems: 'flex-end',
  },
  billAmount: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.xs,
  },
  statusText: {
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.semiBold,
    textTransform: 'capitalize',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxxl * 2,
    gap: Spacing.md,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.borderLight,
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
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: Spacing.xxxl,
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
