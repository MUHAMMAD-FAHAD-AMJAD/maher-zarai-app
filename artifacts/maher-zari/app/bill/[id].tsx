import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  Linking,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import {
  getBill,
  getBillItems,
  getCustomer,
  updateBillPayment,
  type Bill,
  type BillItem,
  type Customer,
} from '@/database';

export default function BillDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { userRole } = useAuth();
  const isAdmin = userRole === 'admin';

  const [bill, setBill] = useState<Bill | null>(null);
  const [items, setItems] = useState<BillItem[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentInput, setPaymentInput] = useState('');

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const b = await getBill(parseInt(id));
      setBill(b);
      if (b) {
        const billItems = await getBillItems(b.id);
        setItems(billItems);
        if (b.customer_id) {
          const c = await getCustomer(b.customer_id);
          setCustomer(c);
        }
      }
    } catch (e) {
      console.error('Error loading bill:', e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return Colors.green;
      case 'partial':
        return Colors.warning;
      case 'unpaid':
      default:
        return Colors.red;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'paid':
        return Colors.greenBg;
      case 'partial':
        return Colors.warningBg;
      case 'unpaid':
      default:
        return Colors.redBg;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'partial':
        return 'Partial';
      case 'unpaid':
      default:
        return 'Unpaid';
    }
  };

  const handleRecordPayment = () => {
    if (!bill) return;
    setPaymentInput('');
    setPaymentModalVisible(true);
  };

  const confirmPayment = async () => {
    if (!bill) return;
    const amount = parseFloat(paymentInput);
    if (!isNaN(amount) && amount > 0) {
      const newPaid = bill.paid_amount + amount;
      await updateBillPayment(bill.id, newPaid);
      setPaymentModalVisible(false);
      loadData();
    }
  };

  const handleShareWhatsApp = () => {
    if (!bill) return;
    const customerName = customer?.name || 'Walk-in Customer';
    const dateStr = formatDate(bill.date);
    const itemLines = items
      .map(
        (item, i) =>
          `${i + 1}. ${item.product_name || 'Item'} - ${item.quantity} x Rs ${item.price.toLocaleString()} = Rs ${item.total.toLocaleString()}`
      )
      .join('\n');
    const balance = bill.total_amount - bill.paid_amount;
    const text = `*Bill #${bill.bill_number} - Maher Zarai Markaz*\n\nCustomer: ${customerName}\nDate: ${dateStr}\n\n_Items:_\n${itemLines}\n\n*Total: Rs ${bill.total_amount.toLocaleString()}*\n*Paid: Rs ${bill.paid_amount.toLocaleString()}*\n*Balance: Rs ${balance.toLocaleString()}*\n\nThank you for your business!`;
    Linking.openURL('whatsapp://send?text=' + encodeURIComponent(text));
  };

  if (loading) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!bill) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <LinearGradient
          colors={[Colors.headerGradientStart, Colors.headerGradientEnd]}
          style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}
        >
          <Pressable onPress={() => router.back()} style={styles.headerBtn}>
            <Feather name="arrow-left" size={22} color={Colors.white} />
          </Pressable>
          <Text style={styles.headerTitle}>Bill Not Found</Text>
          <View style={styles.headerBtn} />
        </LinearGradient>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="file-alert-outline" size={64} color={Colors.textMuted} />
          <Text style={styles.errorTitle}>Bill Not Found</Text>
          <Text style={styles.errorSubtitle}>This bill may have been deleted or doesn't exist.</Text>
          <Pressable style={styles.errorBtn} onPress={() => router.back()}>
            <Text style={styles.errorBtnText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const balance = bill.total_amount - bill.paid_amount;
  const statusColor = getStatusColor(bill.status);
  const statusBg = getStatusBg(bill.status);
  const statusLabel = getStatusLabel(bill.status);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.headerGradientStart, Colors.headerGradientEnd]}
        style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}
      >
        <Pressable onPress={() => router.back()} style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color={Colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Bill #{bill.bill_number}</Text>
        <Pressable onPress={handleShareWhatsApp} style={styles.headerBtn}>
          <Feather name="share-2" size={20} color={Colors.white} />
        </Pressable>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + Spacing.xxl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.statusBanner, { backgroundColor: statusBg }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>

        <View style={[styles.card, Shadow.medium]}>
          <View style={styles.cardHeader}>
            <Feather name="user" size={18} color={Colors.primary} />
            <Text style={styles.cardHeaderTitle}>Customer Info</Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.customerName}>{customer?.name || 'Walk-in Customer'}</Text>
            {customer?.phone ? (
              <View style={styles.infoRow}>
                <Feather name="phone" size={14} color={Colors.textSecondary} />
                <Text style={styles.infoText}>{customer.phone}</Text>
              </View>
            ) : null}
            <View style={styles.infoRow}>
              <Feather name="calendar" size={14} color={Colors.textSecondary} />
              <Text style={styles.infoText}>{formatDate(bill.date)}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, Shadow.medium]}>
          <View style={styles.cardHeader}>
            <Feather name="shopping-bag" size={18} color={Colors.primary} />
            <Text style={styles.cardHeaderTitle}>Items</Text>
          </View>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colItem]}>Item</Text>
            <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeaderText, styles.colPrice]}>Price</Text>
            <Text style={[styles.tableHeaderText, styles.colTotal]}>Total</Text>
          </View>
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              {index > 0 && <View style={styles.separator} />}
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.colItem]} numberOfLines={2}>
                  {item.product_name || 'Item'}
                </Text>
                <Text style={[styles.tableCell, styles.colQty]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, styles.colPrice]}>Rs {item.price.toLocaleString()}</Text>
                <Text style={[styles.tableCellBold, styles.colTotal]}>Rs {item.total.toLocaleString()}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        <View style={[styles.card, Shadow.medium]}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="receipt" size={18} color={Colors.primary} />
            <Text style={styles.cardHeaderTitle}>Summary</Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>Rs {bill.total_amount.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Paid Amount</Text>
              <Text style={[styles.summaryValue, { color: Colors.green }]}>
                Rs {bill.paid_amount.toLocaleString()}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabelBold}>Balance Due</Text>
              <Text
                style={[
                  styles.summaryValueBold,
                  { color: balance > 0 ? Colors.red : Colors.green },
                ]}
              >
                Rs {balance.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {isAdmin && (
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.actionBtn,
                styles.paymentBtn,
                pressed && styles.btnPressed,
              ]}
              onPress={handleRecordPayment}
            >
              <Feather name="dollar-sign" size={18} color={Colors.white} />
              <Text style={styles.actionBtnText}>Record Payment</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.actionBtn,
                styles.whatsappBtn,
                pressed && styles.btnPressed,
              ]}
              onPress={handleShareWhatsApp}
            >
              <MaterialCommunityIcons name="whatsapp" size={20} color={Colors.white} />
              <Text style={styles.actionBtnText}>Share on WhatsApp</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={paymentModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setPaymentModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <Text style={styles.modalTitle}>Record Payment</Text>
            {bill && (
              <Text style={styles.modalSubtitle}>
                Balance: Rs {(bill.total_amount - bill.paid_amount).toLocaleString()}
              </Text>
            )}
            <View style={styles.modalInputRow}>
              <Text style={styles.modalRs}>Rs</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter amount"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                value={paymentInput}
                onChangeText={setPaymentInput}
                autoFocus
              />
            </View>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setPaymentModalVisible(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, styles.modalBtnConfirm]}
                onPress={confirmPayment}
              >
                <Text style={styles.modalBtnConfirmText}>Record</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  cardHeaderTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  cardBody: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  customerName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  infoText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
  },
  tableHeaderText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  tableCell: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  tableCellBold: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  colItem: {
    flex: 3,
  },
  colQty: {
    flex: 1,
    textAlign: 'center',
  },
  colPrice: {
    flex: 2,
    textAlign: 'right',
  },
  colTotal: {
    flex: 2,
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: Spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  summaryLabelBold: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.text,
  },
  summaryValueBold: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
  },
  actions: {
    gap: Spacing.md,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  paymentBtn: {
    backgroundColor: Colors.primary,
  },
  whatsappBtn: {
    backgroundColor: '#25D366',
  },
  actionBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.white,
  },
  btnPressed: {
    opacity: 0.85,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxxl,
    gap: Spacing.md,
  },
  errorTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.text,
    marginTop: Spacing.md,
  },
  errorSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  errorBtn: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  errorBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxl,
    width: '100%',
    maxWidth: 360,
    ...Shadow.large,
  },
  modalTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  modalSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  modalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    height: 52,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  modalRs: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.primary,
  },
  modalInput: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.lg,
    color: Colors.text,
    height: 52,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnCancel: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalBtnConfirm: {
    backgroundColor: Colors.primary,
  },
  modalBtnCancelText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  modalBtnConfirmText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.white,
  },
});
