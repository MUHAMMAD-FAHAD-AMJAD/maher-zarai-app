import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

type MenuItem = {
  icon: string;
  iconSet: 'feather' | 'mci';
  label: string;
  subtitle?: string;
  color: string;
  onPress: () => void;
  adminOnly?: boolean;
};

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const { userRole, logout } = useAuth();
  const isAdmin = userRole === 'admin';

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const reports: MenuItem[] = [
    { icon: 'bar-chart-2', iconSet: 'feather', label: 'Daily Summary', subtitle: 'All activity for any day', color: Colors.primary, onPress: () => {} },
    { icon: 'file-text', iconSet: 'feather', label: 'Customer Report', subtitle: 'Full ledger for one customer', color: Colors.info, onPress: () => {} },
    { icon: 'package', iconSet: 'feather', label: 'Stock Report', subtitle: 'Current levels for all products', color: Colors.green, onPress: () => {} },
    { icon: 'calendar', iconSet: 'feather', label: 'Monthly Report', subtitle: 'This month sales & collections', color: Colors.warning, onPress: () => {} },
    { icon: 'trending-up', iconSet: 'feather', label: 'Outstanding Debt', subtitle: 'Customers sorted by debt', color: Colors.red, onPress: () => {} },
  ];

  const settings: MenuItem[] = [
    { icon: 'cloud-upload-outline', iconSet: 'mci', label: 'Google Drive Backup', subtitle: 'Automatic cloud backup', color: Colors.info, onPress: () => {} },
    { icon: 'delete-outline', iconSet: 'mci', label: 'Recycle Bin', subtitle: 'Recover deleted items', color: Colors.red, onPress: () => {} },
    { icon: 'lock-outline', iconSet: 'mci', label: 'Change Admin PIN', color: Colors.primary, onPress: () => {}, adminOnly: true },
    { icon: 'eye-outline', iconSet: 'mci', label: 'Change Viewer PIN', color: Colors.textSecondary, onPress: () => {}, adminOnly: true },
    { icon: 'information-outline', iconSet: 'mci', label: 'About App', subtitle: 'Version 1.0.0', color: Colors.textMuted, onPress: () => {} },
  ];

  const renderMenuItem = (item: MenuItem) => {
    if (item.adminOnly && !isAdmin) return null;

    const IconComponent = item.iconSet === 'mci' ? MaterialCommunityIcons : Feather;

    return (
      <Pressable
        key={item.label}
        style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
        onPress={item.onPress}
      >
        <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
          <IconComponent name={item.icon as any} size={20} color={item.color} />
        </View>
        <View style={styles.menuInfo}>
          <Text style={styles.menuLabel}>{item.label}</Text>
          {item.subtitle && <Text style={styles.menuSubtitle}>{item.subtitle}</Text>}
        </View>
        <Feather name="chevron-right" size={18} color={Colors.textMuted} />
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>More</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <MaterialCommunityIcons name="store" size={32} color={Colors.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Maher Zarai Markaz</Text>
            <View style={styles.roleBadge}>
              <Feather name={isAdmin ? 'shield' : 'eye'} size={12} color={isAdmin ? Colors.primary : Colors.textSecondary} />
              <Text style={[styles.roleText, { color: isAdmin ? Colors.primary : Colors.textSecondary }]}>
                {isAdmin ? 'Admin' : 'Viewer'}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Reports</Text>
        <View style={styles.menuGroup}>
          {reports.map(renderMenuItem)}
        </View>

        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.menuGroup}>
          {settings.map(renderMenuItem)}
        </View>

        <Pressable
          style={({ pressed }) => [styles.logoutButton, pressed && { opacity: 0.8 }]}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={20} color={Colors.red} />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    color: Colors.text,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadow.medium,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: Colors.text,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  roleText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  menuGroup: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
    ...Shadow.small,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.divider,
  },
  menuItemPressed: {
    backgroundColor: Colors.primaryBg,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  menuInfo: {
    flex: 1,
  },
  menuLabel: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: Colors.text,
  },
  menuSubtitle: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    marginTop: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.redBg,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  logoutText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: Colors.red,
  },
});
