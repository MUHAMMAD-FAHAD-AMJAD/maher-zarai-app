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
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { getDeletedCustomers, restoreCustomer, type Customer } from '@/database';

export default function RecycleBinScreen() {
  const insets = useSafeAreaInsets();
  const { userRole } = useAuth();
  const [deletedCustomers, setDeletedCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const customers = await getDeletedCustomers();
      setDeletedCustomers(customers);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleRestore = async (customer: Customer) => {
    Alert.alert(
      'Restore Customer',
      `Are you sure you want to restore "${customer.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          onPress: async () => {
            await restoreCustomer(customer.id);
            loadData();
          },
        },
      ]
    );
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const renderItem = ({ item }: { item: Customer }) => (
    <View style={styles.itemCard}>
      <View style={[styles.avatar, { backgroundColor: Colors.redBg }]}>
        <Feather name="user-x" size={18} color={Colors.red} />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemMeta}>
          {item.type === 'supplier' ? 'Supplier' : 'Customer'} · Deleted {formatDate(item.deleted_at)}
        </Text>
      </View>
      {userRole === 'admin' && (
        <Pressable
          style={({ pressed }) => [styles.restoreBtn, pressed && { opacity: 0.7 }]}
          onPress={() => handleRestore(item)}
        >
          <Feather name="rotate-ccw" size={16} color={Colors.green} />
          <Text style={styles.restoreBtnText}>Restore</Text>
        </Pressable>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Recycle Bin</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={deletedCustomers}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <MaterialCommunityIcons name="delete-empty-outline" size={56} color={Colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>Recycle Bin is Empty</Text>
            <Text style={styles.emptyText}>Deleted customers will appear here and can be restored</Text>
          </View>
        }
      />
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
  listContent: { padding: Spacing.lg, gap: Spacing.sm },
  itemCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    borderRadius: BorderRadius.md, padding: Spacing.lg, gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    alignItems: 'center', justifyContent: 'center',
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: FontSize.md, fontFamily: FontFamily.semiBold, color: Colors.text },
  itemMeta: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted, marginTop: 2 },
  restoreBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    backgroundColor: Colors.greenBg, borderRadius: BorderRadius.sm,
  },
  restoreBtnText: { fontSize: FontSize.xs, fontFamily: FontFamily.semiBold, color: Colors.green },
  emptyState: { alignItems: 'center', paddingVertical: Spacing.jumbo * 2, gap: Spacing.md },
  emptyIconWrap: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md,
  },
  emptyTitle: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.text },
  emptyText: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted, textAlign: 'center', paddingHorizontal: Spacing.xxxl },
});
