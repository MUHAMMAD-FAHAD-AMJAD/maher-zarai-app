import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
  Share,
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
  const { userRole, logout, changePin } = useAuth();
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

  const handleChangePin = (role: 'admin' | 'viewer') => {
    const roleLabel = role === 'admin' ? 'Admin' : 'Viewer';
    if (Platform.OS === 'ios') {
      Alert.prompt(
        `Change ${roleLabel} PIN`,
        `Enter a new 6-digit PIN for ${roleLabel}:`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Save',
            onPress: async (newPin?: string) => {
              if (!newPin || newPin.length !== 6 || !/^\d+$/.test(newPin)) {
                Alert.alert('Invalid PIN', 'PIN must be exactly 6 digits.');
                return;
              }
              const success = await changePin(role, newPin);
              if (success) {
                Alert.alert('Success', `${roleLabel} PIN has been updated.`);
              } else {
                Alert.alert('Error', 'Failed to update PIN. Please try again.');
              }
            },
          },
        ],
        'plain-text',
        '',
        'number-pad'
      );
    } else if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'PIN change is available on mobile device only.');
    } else {
      Alert.alert(
        `Change ${roleLabel} PIN`,
        'Please use the PIN change feature on your device.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleBackup = () => {
    Alert.alert('Backup', 'Google Drive backup coming soon!', [{ text: 'OK' }]);
  };

  const handleExport = () => {
    Alert.alert('Export', 'Data export feature coming soon!', [{ text: 'OK' }]);
  };

  const handleShare = async () => {
    try {
      if (Platform.OS === 'web') {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          await navigator.clipboard.writeText('Check out Maher Zarai Markaz - A premium business management app!');
          Alert.alert('Copied', 'Link copied to clipboard');
        }
        return;
      }
      await Share.share({
        message: 'Check out Maher Zarai Markaz - A premium business management app!',
      });
    } catch (e) {
      console.error('Share failed:', e);
    }
  };

  const quickActions = [
    { icon: 'cloud', label: 'Backup', color: Colors.info, onPress: handleBackup },
    { icon: 'download', label: 'Export', color: Colors.green, onPress: handleExport },
    { icon: 'share-2', label: 'Share', color: Colors.primary, onPress: handleShare },
  ];

  const reports: MenuItem[] = [
    { icon: 'bar-chart-2', iconSet: 'feather', label: 'Daily Summary', subtitle: 'All activity for any day', color: Colors.primary, onPress: () => {} },
    { icon: 'users', iconSet: 'feather', label: 'Customer Report', subtitle: 'Full ledger for one customer', color: Colors.info, onPress: () => {} },
    { icon: 'package', iconSet: 'feather', label: 'Stock Report', subtitle: 'Current levels for all products', color: Colors.green, onPress: () => {} },
    { icon: 'calendar', iconSet: 'feather', label: 'Monthly Report', subtitle: 'This month sales & collections', color: Colors.warning, onPress: () => {} },
    { icon: 'trending-up', iconSet: 'feather', label: 'Outstanding Debt', subtitle: 'Customers sorted by debt', color: Colors.red, onPress: () => {} },
  ];

  const settings: MenuItem[] = [
    { icon: 'cloud-upload-outline', iconSet: 'mci', label: 'Google Drive Backup', subtitle: 'Automatic cloud backup', color: Colors.info, onPress: () => Alert.alert('Coming Soon', 'Google Drive backup will be available in a future update.', [{ text: 'OK' }]) },
    { icon: 'delete-outline', iconSet: 'mci', label: 'Recycle Bin', subtitle: 'Recover deleted items', color: Colors.red, onPress: () => router.push('/recycle-bin' as any) },
    { icon: 'lock-outline', iconSet: 'mci', label: 'Change Admin PIN', subtitle: 'Update admin access code', color: Colors.primary, onPress: () => handleChangePin('admin'), adminOnly: true },
    { icon: 'eye-outline', iconSet: 'mci', label: 'Change Viewer PIN', subtitle: 'Update viewer access code', color: Colors.textSecondary, onPress: () => handleChangePin('viewer'), adminOnly: true },
    { icon: 'information-outline', iconSet: 'mci', label: 'About App', subtitle: 'Version & developer info', color: Colors.textMuted, onPress: () => Alert.alert('Maher Zarai Markaz', 'Version 1.0.0\n\nA premium business management solution for Maher Zarai Markaz, Rawalpindi.\n\nBuilt with ❤️', [{ text: 'OK' }]) },
  ];

  const renderMenuItem = (item: MenuItem, index: number, array: MenuItem[]) => {
    if (item.adminOnly && !isAdmin) return null;

    const IconComponent = item.iconSet === 'mci' ? MaterialCommunityIcons : Feather;
    const isLast = index === array.length - 1 || (index < array.length - 1 && array[index + 1].adminOnly && !isAdmin);

    return (
      <Pressable
        key={item.label}
        style={({ pressed }) => [
          styles.menuItem,
          !isLast && styles.menuItemBorder,
          pressed && styles.menuItemPressed,
        ]}
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
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[Colors.headerGradientStart, Colors.headerGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileCard}
        >
          <View style={styles.profileCardInner}>
            <View style={styles.profileAvatar}>
              <MaterialCommunityIcons name="store" size={30} color={Colors.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Maher Zarai Markaz</Text>
              <View style={styles.locationRow}>
                <Feather name="map-pin" size={12} color="rgba(255,255,255,0.8)" />
                <Text style={styles.locationText}>Rawalpindi</Text>
              </View>
              <View style={[styles.roleBadge, { backgroundColor: isAdmin ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.2)' }]}>
                <Feather name={isAdmin ? 'shield' : 'eye'} size={12} color={Colors.white} />
                <Text style={styles.roleText}>
                  {isAdmin ? 'Admin' : 'Viewer'}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsRow}>
          {quickActions.map((action) => (
            <Pressable
              key={action.label}
              style={({ pressed }) => [styles.quickActionItem, pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }]}
              onPress={action.onPress}
            >
              <View style={[styles.quickActionCircle, { backgroundColor: `${action.color}15` }]}>
                <Feather name={action.icon as any} size={22} color={action.color} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Reports</Text>
        <View style={styles.menuGroup}>
          {reports.map((item, index, arr) => renderMenuItem(item, index, arr))}
        </View>

        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.menuGroup}>
          {settings.map((item, index, arr) => renderMenuItem(item, index, arr))}
        </View>

        <Pressable
          style={({ pressed }) => [styles.logoutButton, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={20} color={Colors.white} />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        <Text style={styles.versionText}>v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  profileCard: {
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.xxl,
    ...Shadow.large,
  },
  profileCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
    ...Shadow.small,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xxs,
  },
  locationText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: 'rgba(255,255,255,0.85)',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  roleText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    color: Colors.white,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xxl,
    ...Shadow.small,
  },
  quickActionItem: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  quickActionCircle: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
  },
  menuGroup: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xxl,
    overflow: 'hidden',
    ...Shadow.small,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 2,
  },
  menuItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },
  menuItemPressed: {
    backgroundColor: Colors.primaryBg,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
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
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.red,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    ...Shadow.medium,
  },
  logoutText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  versionText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
