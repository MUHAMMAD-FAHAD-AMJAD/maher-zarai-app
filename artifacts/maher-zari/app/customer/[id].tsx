import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { getCustomer, getTransactions, softDeleteCustomer, type Customer, type Transaction } from '@/database';

const AVATAR_COLORS = [
  '#FF6B35', '#E53935', '#2E7D32', '#3B82F6',
  '#8B5CF6', '#EC4899', '#F59E0B', '#06B6D4',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

function formatAmount(amount: number): string {
  return `Rs ${Math.abs(amount).toLocaleString('en-PK')}`;
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
}

export default function CustomerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { userRole } = useAuth();
  const isAdmin = userRole === 'admin';

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      const c = await getCustomer(parseInt(id));
      setCustomer(c);
      const txns = await getTransactions(parseInt(id));
      setTransactions(txns);
    } catch (e) {
      console.error('Error loading customer:', e);
    } finally {
      setLoading(false);
    }
  }, [id]);

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

  const handleDelete = () => {
    Alert.alert(
      'Delete Customer',
      `Are you sure you want to delete "${customer?.name}"? This action can be undone from Recycle Bin.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (customer) {
              await softDeleteCustomer(customer.id);
              router.back();
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading customer...</Text>
        </View>
      </View>
    );
  }

  if (!customer) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <Feather name="user-x" size={48} color={Colors.textMuted} />
          <Text style={styles.loadingText}>Customer not found</Text>
          <Pressable onPress={() => router.back()} style={styles.goBackBtn}>
            <Text style={styles.goBackText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const balance = customer.current_balance;
  const isOwed = balance > 0;
  const isSettled = balance === 0;
  const balanceLabel = isSettled ? 'Settled' : isOwed ? 'You Will Get' : 'You Will Give';
  const balanceColor = isSettled ? Colors.textMuted : isOwed ? '#FBBF24' : '#86EFAC';
  const avatarColor = getAvatarColor(customer.name);
  const initials = getInitials(customer.name);

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const isCredit = item.type === 'credit';
    return (
      <View style={styles.txnCard}>
        <View style={[styles.txnIcon, { backgroundColor: isCredit ? Colors.redBg : Colors.greenBg }]}>
          <Feather
            name={isCredit ? 'arrow-up' : 'arrow-down'}
            size={18}
            color={isCredit ? Colors.red : Colors.green}
          />
        </View>
        <View style={styles.txnContent}>
          <Text style={styles.txnDesc} numberOfLines={1}>
            {item.description || (isCredit ? 'Credit Added' : 'Payment Received')}
          </Text>
          <Text style={styles.txnDate}>{formatDate(item.date)}</Text>
        </View>
        <Text style={[styles.txnAmount, { color: isCredit ? Colors.red : Colors.green }]}>
          {formatAmount(item.amount)}
        </Text>
      </View>
    );
  };

  const ListHeader = () => (
    <>
      <LinearGradient
        colors={[Colors.headerGradientStart, Colors.headerGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, { paddingTop: insets.top + Spacing.md }]}
      >
        <View style={styles.headerTopRow}>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={22} color={Colors.white} />
          </Pressable>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.backBtn} />
        </View>

        <View style={styles.avatarSection}>
          <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.customerName}>{customer.name}</Text>
          {customer.phone ? (
            <Text style={styles.customerPhone}>{customer.phone}</Text>
          ) : null}
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>
              {customer.type === 'supplier' ? 'Supplier' : 'Customer'}
            </Text>
          </View>
        </View>

        <View style={styles.balanceSection}>
          <Text style={[styles.balanceLabel, { color: balanceColor }]}>{balanceLabel}</Text>
          <Text style={styles.balanceAmount}>{formatAmount(balance)}</Text>
        </View>
      </LinearGradient>

      <View style={styles.actionsContainer}>
        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && { opacity: 0.8 }]}
          onPress={() => router.push({ pathname: '/add-transaction', params: { customerId: id, type: 'credit' } })}
        >
          <View style={[styles.actionIconWrap, { backgroundColor: Colors.primaryBg }]}>
            <Feather name="plus-circle" size={20} color={Colors.primary} />
          </View>
          <Text style={styles.actionLabel}>Add Credit</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && { opacity: 0.8 }]}
          onPress={() => router.push({ pathname: '/add-transaction', params: { customerId: id, type: 'payment' } })}
        >
          <View style={[styles.actionIconWrap, { backgroundColor: Colors.greenBg }]}>
            <Feather name="arrow-down" size={20} color={Colors.green} />
          </View>
          <Text style={styles.actionLabel}>Add Payment</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && { opacity: 0.8 }]}
          onPress={() => Alert.alert('Edit', 'Edit functionality coming soon.')}
        >
          <View style={[styles.actionIconWrap, { backgroundColor: Colors.infoBg }]}>
            <Feather name="edit" size={20} color={Colors.info} />
          </View>
          <Text style={styles.actionLabel}>Edit</Text>
        </Pressable>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Transaction History</Text>
        <Text style={styles.sectionCount}>{transactions.length} entries</Text>
      </View>
    </>
  );

  const ListFooter = () => {
    if (!isAdmin) return null;
    return (
      <Pressable
        style={({ pressed }) => [styles.deleteButton, pressed && { opacity: 0.8 }]}
        onPress={handleDelete}
      >
        <Feather name="trash-2" size={18} color={Colors.red} />
        <Text style={styles.deleteButtonText}>Delete Customer</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id.toString()}
        renderItem={renderTransaction}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xxl }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.white} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="inbox" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No transactions yet</Text>
            <Text style={styles.emptySub}>
              Opening balance: {formatAmount(customer.opening_balance)}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
    color: Colors.textMuted,
  },
  goBackBtn: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
  },
  goBackText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: Colors.white,
  },
  headerGradient: {
    paddingBottom: Spacing.xxxl,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
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
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    color: Colors.white,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  customerName: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    color: Colors.white,
    textAlign: 'center',
  },
  customerPhone: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: 'rgba(255,255,255,0.8)',
    marginTop: Spacing.xxs,
  },
  typeBadge: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BorderRadius.full,
  },
  typeBadgeText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    color: Colors.white,
  },
  balanceSection: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  balanceLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    marginBottom: Spacing.xxs,
  },
  balanceAmount: {
    fontSize: FontSize.xxxl,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginTop: -Spacing.xl,
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
    ...Shadow.medium,
  },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    color: Colors.text,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xxl,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: Colors.text,
  },
  sectionCount: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
  },
  txnCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    ...Shadow.small,
  },
  txnIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  txnContent: {
    flex: 1,
  },
  txnDesc: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
    color: Colors.text,
  },
  txnDate: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    marginTop: Spacing.xxs,
  },
  txnAmount: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    marginLeft: Spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxxl,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    color: Colors.textMuted,
  },
  emptySub: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xxl,
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.redBg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.red,
    gap: Spacing.sm,
  },
  deleteButtonText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: Colors.red,
  },
});
