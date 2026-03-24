import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { addTransaction, getCustomer, type Customer } from '@/database';

type TxnType = 'credit' | 'payment';

export default function AddTransactionScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ customerId: string; type?: string }>();
  const customerId = parseInt(params.customerId || '0');
  const [type, setType] = useState<TxnType>((params.type as TxnType) || 'credit');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCustomer();
  }, [customerId]);

  const loadCustomer = async () => {
    if (customerId) {
      const c = await getCustomer(customerId);
      setCustomer(c);
    }
  };

  const handleSave = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      Alert.alert('Required', 'Please enter a valid amount');
      return;
    }
    if (!customerId) {
      Alert.alert('Error', 'Customer not found');
      return;
    }
    setSaving(true);
    try {
      const desc = description.trim() || (type === 'credit' ? 'Credit added' : 'Payment received');
      await addTransaction(customerId, type, amt, desc);
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const isCredit = type === 'credit';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>
          {isCredit ? 'Add Credit' : 'Record Payment'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {customer && (
        <View style={styles.customerCard}>
          <View style={[styles.custAvatar, { backgroundColor: Colors.primaryBg }]}>
            <Feather name="user" size={18} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.custName}>{customer.name}</Text>
            <Text style={styles.custBalance}>
              Balance: Rs {Math.abs(customer.current_balance).toLocaleString('en-PK')}
              {customer.current_balance > 0 ? ' (receivable)' : customer.current_balance < 0 ? ' (payable)' : ''}
            </Text>
          </View>
        </View>
      )}

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.typeToggle}>
            <Pressable
              style={[styles.typeBtn, isCredit && { backgroundColor: Colors.red }]}
              onPress={() => setType('credit')}
            >
              <Feather name="arrow-up-right" size={16} color={isCredit ? Colors.white : Colors.textSecondary} />
              <Text style={[styles.typeBtnText, isCredit && { color: Colors.white }]}>Credit (Udhar)</Text>
            </Pressable>
            <Pressable
              style={[styles.typeBtn, !isCredit && { backgroundColor: Colors.green }]}
              onPress={() => setType('payment')}
            >
              <Feather name="arrow-down-left" size={16} color={!isCredit ? Colors.white : Colors.textSecondary} />
              <Text style={[styles.typeBtnText, !isCredit && { color: Colors.white }]}>Payment</Text>
            </Pressable>
          </View>

          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>Amount</Text>
            <View style={styles.amountRow}>
              <Text style={[styles.rsBig, { color: isCredit ? Colors.red : Colors.green }]}>Rs</Text>
              <TextInput
                style={[styles.amountInput, { color: isCredit ? Colors.red : Colors.green }]}
                placeholder="0"
                placeholderTextColor={Colors.textLight}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                autoFocus
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description (optional)</Text>
            <View style={styles.inputRow}>
              <Feather name="edit-3" size={18} color={Colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder={isCredit ? 'e.g. Purchased fertilizer' : 'e.g. Cash payment'}
                placeholderTextColor={Colors.textMuted}
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </View>

          <View style={styles.infoCard}>
            <MaterialCommunityIcons
              name="information-outline"
              size={18}
              color={isCredit ? Colors.red : Colors.green}
            />
            <Text style={styles.infoText}>
              {isCredit
                ? `This will increase ${customer?.name || 'customer'}'s balance (they will owe more)`
                : `This will decrease ${customer?.name || 'customer'}'s balance (reducing their debt)`}
            </Text>
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
            colors={isCredit
              ? [Colors.dangerGradientStart, Colors.dangerGradientEnd]
              : [Colors.successGradientStart, Colors.successGradientEnd]}
            style={styles.saveBtnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Feather name={isCredit ? 'plus-circle' : 'check-circle'} size={20} color={Colors.white} />
            <Text style={styles.saveBtnText}>
              {saving ? 'SAVING...' : isCredit ? 'ADD CREDIT' : 'RECORD PAYMENT'}
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
  customerCard: {
    flexDirection: 'row', alignItems: 'center', margin: Spacing.lg,
    backgroundColor: Colors.white, borderRadius: BorderRadius.md,
    padding: Spacing.lg, gap: Spacing.md, ...Shadow.small,
  },
  custAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  custName: { fontSize: FontSize.md, fontFamily: FontFamily.semiBold, color: Colors.text },
  custBalance: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textSecondary, marginTop: 2 },
  content: { padding: Spacing.xl, gap: Spacing.xl },
  typeToggle: {
    flexDirection: 'row', backgroundColor: Colors.white, borderRadius: BorderRadius.md,
    padding: 3, ...Shadow.small,
  },
  typeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, paddingVertical: Spacing.md, borderRadius: BorderRadius.sm,
  },
  typeBtnText: { fontSize: FontSize.md, fontFamily: FontFamily.semiBold, color: Colors.textSecondary },
  amountCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.xxl, paddingHorizontal: Spacing.xl,
    alignItems: 'center', ...Shadow.medium,
  },
  amountLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.textMuted, marginBottom: Spacing.md },
  amountRow: { flexDirection: 'row', alignItems: 'baseline', gap: Spacing.sm },
  rsBig: { fontSize: FontSize.xxl, fontFamily: FontFamily.bold },
  amountInput: { fontSize: 48, fontFamily: FontFamily.bold, textAlign: 'center', minWidth: 100 },
  inputGroup: { gap: Spacing.sm },
  label: { fontSize: FontSize.sm, fontFamily: FontFamily.semiBold, color: Colors.text, marginLeft: Spacing.xs },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    borderRadius: BorderRadius.md, paddingHorizontal: Spacing.lg, height: 52,
    borderWidth: 1, borderColor: Colors.borderLight, gap: Spacing.md,
  },
  input: { flex: 1, fontSize: FontSize.md, fontFamily: FontFamily.regular, color: Colors.text, height: 52 },
  infoCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.infoBg, borderRadius: BorderRadius.md,
    padding: Spacing.lg, borderLeftWidth: 3, borderLeftColor: Colors.info,
  },
  infoText: { flex: 1, fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textSecondary, lineHeight: 18 },
  footer: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  saveBtn: { borderRadius: BorderRadius.md, ...Shadow.medium },
  saveBtnGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: Spacing.lg, borderRadius: BorderRadius.md, gap: Spacing.sm,
  },
  saveBtnText: { fontSize: FontSize.md, fontFamily: FontFamily.bold, color: Colors.white },
});
