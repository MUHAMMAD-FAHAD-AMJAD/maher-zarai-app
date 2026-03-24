import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
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
  Linking,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import Colors from '@/constants/colors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { getCustomer, getTransactions, softDeleteCustomer, type Customer, type Transaction } from '@/database';

export default function CustomerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { userRole } = useAuth();
  const isAdmin = userRole === 'admin';

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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

  const handleWhatsApp = () => {
    if (!customer?.phone) {
      Alert.alert('No Phone Number', 'This customer does not have a phone number saved.');
      return;
    }
    const phone = customer.phone.startsWith('92') ? customer.phone : `92${customer.phone}`;
    const message = `Assalam o Alaikum! Your current balance at Maher Zarai Markaz is Rs ${Math.abs(customer.current_balance).toLocaleString('en-PK')}. Thank you.`;
    Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Customer',
      `Are you sure you want to delete "${customer?.name}"? You can recover from Recycle Bin.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (customer) {
              await softDeleteCustomer(customer.id);
              if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              router.back();
            }
          },
        },
      ]
    );
  };

  const formatAmount = (amount: number) => `Rs ${Math.abs(amount).toLocaleString('en-PK')}`;
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: '2-digit' });
    } catch {
      return dateStr;
    }
  };
  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  if (!customer) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  const balance = customer.current_balance;
  const isOwed = balance > 0;

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.txnRow}>
      <View style={styles.txnDateCol}>
        <Text style={styles.txnDate}>{formatDate(item.date)}</Text>
        <Text style={styles.txnTime}>{formatTime(item.date)}</Text>
      </View>
      <View style={styles.txnMidCol}>
        <Text style={styles.txnDesc} numberOfLines={1}>
          {item.description || (item.type === 'credit' ? 'Credit Sale' : 'Payment Received')}
        </Text>
        <View style={[
          styles.txnBadge,
          { backgroundColor: item.type === 'payment' ? Colors.greenBg : Colors.redBg }
        ]}>
          <Text style={[
            styles.txnBadgeText,
            { color: item.type === 'payment' ? Colors.green : Colors.red }
          ]}>
            {item.type === 'payment' ? 'Cash In' : 'You Gave'}
          </Text>
        </View>
      </View>
      <Text style={[
        styles.txnAmount,
        { color: item.type === 'payment' ? Colors.green : Colors.red }
      ]}>
        {formatAmount(item.amount)}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.headerBar}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={22} color={Colors.text} />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName} numberOfLines={1}>{customer.name}</Text>
          <Text style={styles.headerType}>
            {customer.type === 'supplier' ? 'Supplier' : 'Customer'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          {customer.phone ? (
            <Pressable style={styles.headerActionBtn} onPress={handleWhatsApp}>
              <MaterialCommunityIcons name="whatsapp" size={22} color={Colors.green} />
            </Pressable>
          ) : null}
          {isAdmin && (
            <Pressable style={styles.headerActionBtn} onPress={handleDelete}>
              <Feather name="trash-2" size={18} color={Colors.red} />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>
          {isOwed ? 'You Will Get' : balance < 0 ? 'You Will Give' : 'Balance'}
        </Text>
        <Text style={[styles.balanceValue, {
          color: isOwed ? Colors.red : balance < 0 ? Colors.green : Colors.textMuted
        }]}>
          {formatAmount(balance)}
        </Text>
        {customer.phone ? (
          <Text style={styles.phoneText}>{customer.phone}</Text>
        ) : null}
      </View>

      <View style={styles.actionRow}>
        <Pressable style={styles.actionBtn} onPress={() => {}}>
          <Feather name="bar-chart-2" size={18} color={Colors.primary} />
          <Text style={styles.actionBtnText}>Report</Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={handleWhatsApp}>
          <MaterialCommunityIcons name="whatsapp" size={18} color={Colors.green} />
          <Text style={styles.actionBtnText}>WhatsApp</Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={() => {}}>
          <Feather name="clock" size={18} color={Colors.warning} />
          <Text style={styles.actionBtnText}>History</Text>
        </Pressable>
      </View>

      <View style={styles.txnHeader}>
        <Text style={styles.txnHeaderText}>Transactions</Text>
        <Text style={styles.txnCount}>{transactions.length} entries</Text>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={item => item.id.toString()}
        renderItem={renderTransaction}
        contentContainerStyle={[styles.txnList, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyTxn}>
            <Feather name="inbox" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyTxnText}>No transactions yet</Text>
            <Text style={styles.emptyTxnSub}>
              Opening balance: {formatAmount(customer.opening_balance)}
            </Text>
          </View>
        }
      />

      {isAdmin && (
        <View style={[styles.bottomButtons, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 16) }]}>
          <Pressable
            style={({ pressed }) => [styles.gaveBtn, pressed && { opacity: 0.9 }]}
            onPress={() => router.push({ pathname: '/add-transaction', params: { customerId: id, type: 'credit' } })}
          >
            <Feather name="arrow-up-right" size={18} color={Colors.white} />
            <Text style={styles.bottomBtnText}>YOU GAVE Rs</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.gotBtn, pressed && { opacity: 0.9 }]}
            onPress={() => router.push({ pathname: '/add-transaction', params: { customerId: id, type: 'payment' } })}
          >
            <Feather name="arrow-down-left" size={18} color={Colors.white} />
            <Text style={styles.bottomBtnText}>YOU GOT Rs</Text>
          </Pressable>
        </View>
      )}
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
  },
  loadingText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
    color: Colors.textMuted,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: Colors.text,
  },
  headerType: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: Colors.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadow.medium,
  },
  balanceLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
  },
  balanceValue: {
    fontSize: FontSize.display,
    fontFamily: FontFamily.bold,
    marginTop: Spacing.xs,
  },
  phoneText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
    ...Shadow.small,
  },
  actionBtnText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    color: Colors.text,
  },
  txnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  txnHeaderText: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: Colors.text,
  },
  txnCount: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
  },
  txnList: {
    paddingHorizontal: Spacing.lg,
  },
  txnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.small,
  },
  txnDateCol: {
    width: 60,
  },
  txnDate: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    color: Colors.text,
  },
  txnTime: {
    fontSize: 10,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
  },
  txnMidCol: {
    flex: 1,
    marginHorizontal: Spacing.sm,
  },
  txnDesc: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.text,
  },
  txnBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginTop: 3,
  },
  txnBadgeText: {
    fontSize: 10,
    fontFamily: FontFamily.semiBold,
  },
  txnAmount: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
  },
  emptyTxn: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxxl,
    gap: Spacing.md,
  },
  emptyTxnText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
    color: Colors.textMuted,
  },
  emptyTxnSub: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
  },
  gaveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.red,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    ...Shadow.small,
  },
  gotBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.green,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    ...Shadow.small,
  },
  bottomBtnText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
});
