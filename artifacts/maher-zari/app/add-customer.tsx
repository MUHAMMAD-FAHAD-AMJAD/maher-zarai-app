import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
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
import { addCustomer } from '@/database';

type CustomerType = 'customer' | 'supplier';

export default function AddCustomerScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState<CustomerType>('customer');
  const [openingBalance, setOpeningBalance] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter a name');
      return;
    }
    setSaving(true);
    try {
      const balance = parseFloat(openingBalance) || 0;
      await addCustomer(name.trim(), phone.trim(), type, balance);
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Add {type === 'supplier' ? 'Supplier' : 'Customer'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.typeToggle}>
            {(['customer', 'supplier'] as CustomerType[]).map(t => (
              <Pressable
                key={t}
                style={[styles.typeBtn, type === t && styles.typeBtnActive]}
                onPress={() => setType(t)}
              >
                <Feather
                  name={t === 'customer' ? 'user' : 'truck'}
                  size={16}
                  color={type === t ? Colors.white : Colors.textSecondary}
                />
                <Text style={[styles.typeBtnText, type === t && styles.typeBtnTextActive]}>
                  {t === 'customer' ? 'Customer' : 'Supplier'}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name *</Text>
            <View style={styles.inputRow}>
              <Feather name="user" size={18} color={Colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Enter full name"
                placeholderTextColor={Colors.textMuted}
                value={name}
                onChangeText={setName}
                autoFocus
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputRow}>
              <Feather name="phone" size={18} color={Colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="03XX XXXXXXX"
                placeholderTextColor={Colors.textMuted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Opening Balance (Rs)</Text>
            <View style={styles.inputRow}>
              <Text style={styles.rsPrefix}>Rs</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={Colors.textMuted}
                value={openingBalance}
                onChangeText={setOpeningBalance}
                keyboardType="numeric"
              />
            </View>
            <Text style={styles.hint}>
              {type === 'customer' ? 'Positive = they owe you' : 'Positive = you owe them'}
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
            colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
            style={styles.saveBtnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Feather name="check" size={20} color={Colors.white} />
            <Text style={styles.saveBtnText}>{saving ? 'SAVING...' : 'SAVE'}</Text>
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
  content: { padding: Spacing.xl, gap: Spacing.xl },
  typeToggle: {
    flexDirection: 'row', backgroundColor: Colors.white, borderRadius: BorderRadius.md,
    padding: 3, ...Shadow.small,
  },
  typeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, paddingVertical: Spacing.md, borderRadius: BorderRadius.sm,
  },
  typeBtnActive: { backgroundColor: Colors.primary },
  typeBtnText: { fontSize: FontSize.md, fontFamily: FontFamily.semiBold, color: Colors.textSecondary },
  typeBtnTextActive: { color: Colors.white },
  inputGroup: { gap: Spacing.sm },
  label: { fontSize: FontSize.sm, fontFamily: FontFamily.semiBold, color: Colors.text, marginLeft: Spacing.xs },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    borderRadius: BorderRadius.md, paddingHorizontal: Spacing.lg, height: 52,
    borderWidth: 1, borderColor: Colors.borderLight, gap: Spacing.md,
  },
  rsPrefix: { fontSize: FontSize.md, fontFamily: FontFamily.bold, color: Colors.primary },
  input: { flex: 1, fontSize: FontSize.md, fontFamily: FontFamily.regular, color: Colors.text, height: 52 },
  hint: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted, marginLeft: Spacing.xs },
  footer: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  saveBtn: { borderRadius: BorderRadius.md, ...Shadow.medium },
  saveBtnGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: Spacing.lg, borderRadius: BorderRadius.md, gap: Spacing.sm,
  },
  saveBtnText: { fontSize: FontSize.md, fontFamily: FontFamily.bold, color: Colors.white },
});
