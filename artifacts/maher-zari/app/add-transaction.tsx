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
import { addTransaction, getCustomer, type Customer } from '@/database';

export default function AddTransactionScreen() {
  const { customerId, type } = useLocalSearchParams<{ customerId: string; type: string }>();
  const insets = useSafeAreaInsets();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const isCredit = type === 'credit';

  useEffect(() => {
    if (customerId) {
      getCustomer(parseInt(customerId)).then(setCustomer);
    }
  }, [customerId]);

  const handleSave = async () => {
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    setSaving(true);
    try {
      await addTransaction(
        parseInt(customerId!),
        type!,
        parsedAmount,
        description.trim() || (isCredit ? 'Credit Sale' : 'Payment Received'),
      );
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to save transaction.');
    }
    setSaving(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={[styles.headerBar, { backgroundColor: isCredit ? Colors.red : Colors.green }]}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
          onPress={() => router.back()}
        >
          <Feather name="x" size={22} color={Colors.white} />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{isCredit ? 'You Gave' : 'You Got'}</Text>
          <Text style={styles.headerSubtitle}>{customer?.name || ''}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Enter Amount</Text>
          <View style={styles.amountRow}>
            <Text style={[styles.rupeeSign, { color: isCredit ? Colors.red : Colors.green }]}>Rs</Text>
            <TextInput
              style={[styles.amountInput, { color: isCredit ? Colors.red : Colors.green }]}
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
              autoFocus
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder={isCredit ? "e.g. Sold 2 bags Urea" : "e.g. Cash payment"}
            placeholderTextColor={Colors.textMuted}
            multiline
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            { backgroundColor: isCredit ? Colors.red : Colors.green },
            pressed && { opacity: 0.9 },
            saving && { opacity: 0.5 },
          ]}
          onPress={handleSave}
          disabled={saving}
        >
          <Feather
            name={isCredit ? 'arrow-up-right' : 'arrow-down-left'}
            size={20}
            color={Colors.white}
          />
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : `SAVE ${isCredit ? 'CREDIT' : 'PAYMENT'}`}
          </Text>
        </Pressable>
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
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: 'rgba(255,255,255,0.8)',
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  amountCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    marginBottom: Spacing.xxl,
  },
  amountLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rupeeSign: {
    fontSize: FontSize.xxxl,
    fontFamily: FontFamily.bold,
    marginRight: Spacing.sm,
  },
  amountInput: {
    fontSize: 48,
    fontFamily: FontFamily.bold,
    minWidth: 100,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: Spacing.xxl,
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
    minHeight: 60,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  saveButtonText: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
});
