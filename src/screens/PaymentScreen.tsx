import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import colors from '../constants/colors';
import spacing from '../constants/spacing';
import {
  moderateScale,
  normalizeFont,
} from '../utils/responsive';

const PaymentScreen = () => {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [balance, setBalance] = useState(0);

  const paymentMethods = [
    {
      id: 'upi',
      icon: '📱',
      title: 'UPI',
      subtitle: 'Pay using UPI apps',
    },
    {
      id: 'card',
      icon: '💳',
      title: 'Credit / Debit Card',
      subtitle: 'Visa, Mastercard and RuPay',
    },
    {
      id: 'netbanking',
      icon: '🏦',
      title: 'Net Banking',
      subtitle: 'Pay directly through your bank',
    },
    {
      id: 'wallet',
      icon: '👛',
      title: 'Digital Wallet',
      subtitle: 'Pay using wallet balance',
    },
  ];

  const handleAddMoney = () => {
    Alert.alert(
      'Add Money',
      'Enter amount to add money into your EV wallet.',
      [
        {
          text: '₹100',
          onPress: () => setBalance(balance + 100),
        },
        {
          text: '₹500',
          onPress: () => setBalance(balance + 500),
        },
        {
          text: '₹1000',
          onPress: () => setBalance(balance + 1000),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  };

  const handleQuickAction = (action: string) => {
    if (action === 'transactions') {
      Alert.alert('Transactions', 'No transactions available yet.');
    } else if (action === 'scan') {
      Alert.alert('Scan QR', 'QR scanner will be added in the next step.');
    } else if (action === 'charge') {
      Alert.alert(
        'Pay for Charging',
        'Select a charging station first to continue.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.heading}>Payments</Text>
            <Text style={styles.subHeading}>
              Manage your EV payments
            </Text>
          </View>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => Alert.alert('Payment Settings')}>
            <Text style={styles.menuIcon}>⋮</Text>
          </TouchableOpacity>
        </View>

        {/* Wallet Balance */}
        <View style={styles.walletCard}>
          <View style={styles.walletTopRow}>
            <View>
              <Text style={styles.walletLabel}>EV Wallet Balance</Text>

              <Text style={styles.balanceAmount}>
                ₹{balance.toFixed(2)}
              </Text>
            </View>

            <View style={styles.walletIconContainer}>
              <Text style={styles.walletIcon}>⚡</Text>
            </View>
          </View>

          <View style={styles.walletDivider} />

          <View style={styles.walletBottomRow}>
            <View>
              <Text style={styles.walletSmallText}>
                Available for charging payments
              </Text>
            </View>

            <TouchableOpacity
              style={styles.addMoneyButton}
              onPress={handleAddMoney}>
              <Text style={styles.addMoneyText}>+ Add Money</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={handleAddMoney}>
            <View style={styles.quickIconContainer}>
              <Text style={styles.quickIcon}>＋</Text>
            </View>
            <Text style={styles.quickTitle}>Add Money</Text>
            <Text style={styles.quickSubtitle}>Recharge wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => handleQuickAction('scan')}>
            <View style={styles.quickIconContainer}>
              <Text style={styles.quickIcon}>▣</Text>
            </View>
            <Text style={styles.quickTitle}>Scan QR</Text>
            <Text style={styles.quickSubtitle}>Quick payment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => handleQuickAction('charge')}>
            <View style={styles.quickIconContainer}>
              <Text style={styles.quickIcon}>⚡</Text>
            </View>
            <Text style={styles.quickTitle}>Pay for Charging</Text>
            <Text style={styles.quickSubtitle}>Start charging</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => handleQuickAction('transactions')}>
            <View style={styles.quickIconContainer}>
              <Text style={styles.quickIcon}>↔</Text>
            </View>
            <Text style={styles.quickTitle}>Transactions</Text>
            <Text style={styles.quickSubtitle}>View payment history</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Methods */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>

          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Payment Methods',
                'Manage your saved payment methods.',
              )
            }>
            <Text style={styles.manageText}>Manage</Text>
          </TouchableOpacity>
        </View>

        {paymentMethods.map(method => {
          const isSelected = selectedMethod === method.id;

          return (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentCard,
                isSelected && styles.selectedCard,
              ]}
              activeOpacity={0.8}
              onPress={() => setSelectedMethod(method.id)}>

              <View style={styles.paymentIconContainer}>
                <Text style={styles.paymentIcon}>{method.icon}</Text>
              </View>

              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>
                  {method.title}
                </Text>

                <Text style={styles.paymentSubtitle}>
                  {method.subtitle}
                </Text>
              </View>

              <View
                style={[
                  styles.radioOuter,
                  isSelected && styles.radioSelected,
                ]}>
                {isSelected && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Add New Payment Method */}
        <TouchableOpacity
          style={styles.addPaymentButton}
          onPress={() =>
            Alert.alert(
              'Add Payment Method',
              'Payment gateway integration will be added soon.',
            )
          }>
          <Text style={styles.addPaymentIcon}>＋</Text>
          <Text style={styles.addPaymentText}>
            Add New Payment Method
          </Text>
        </TouchableOpacity>

        {/* Recent Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>

          <TouchableOpacity
            onPress={() => handleQuickAction('transactions')}>
            <Text style={styles.manageText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.emptyCard}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyIcon}>↔</Text>
          </View>

          <Text style={styles.emptyTitle}>No Transactions Yet</Text>

          <Text style={styles.emptyText}>
            Your charging payments and wallet activities will appear here.
          </Text>
        </View>

        {/* Security */}
        <View style={styles.securityCard}>
          <Text style={styles.securityIcon}>🔒</Text>

          <View style={styles.securityContent}>
            <Text style={styles.securityTitle}>
              Secure & Protected Payments
            </Text>

            <Text style={styles.securityText}>
              Your payment information is encrypted and securely protected.
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  heading: {
    fontSize: normalizeFont(27),
    fontWeight: '800',
    color: colors.textPrimary,
  },

  subHeading: {
    fontSize: normalizeFont(13),
    color: colors.textSecondary,
    marginTop: moderateScale(5),
  },

  menuButton: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuIcon: {
    fontSize: normalizeFont(25),
    color: colors.textPrimary,
    marginTop: moderateScale(-8),
  },

  walletCard: {
    backgroundColor: colors.primary,
    borderRadius: moderateScale(22),
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },

  walletTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  walletLabel: {
    color: colors.white,
    fontSize: normalizeFont(13),
    opacity: 0.85,
  },

  balanceAmount: {
    color: colors.white,
    fontSize: normalizeFont(32),
    fontWeight: '800',
    marginTop: moderateScale(7),
  },

  walletIconContainer: {
    width: moderateScale(58),
    height: moderateScale(58),
    borderRadius: moderateScale(29),
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  walletIcon: {
    fontSize: normalizeFont(28),
  },

  walletDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginVertical: spacing.md,
  },

  walletBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  walletSmallText: {
    color: colors.white,
    opacity: 0.8,
    fontSize: normalizeFont(11),
  },

  addMoneyButton: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: moderateScale(10),
  },

  addMoneyText: {
    color: colors.primary,
    fontSize: normalizeFont(12),
    fontWeight: '800',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  sectionTitle: {
    fontSize: normalizeFont(19),
    fontWeight: '800',
    color: colors.textPrimary,
  },

  manageText: {
    fontSize: normalizeFont(13),
    fontWeight: '700',
    color: colors.primary,
  },

  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },

  quickActionCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: moderateScale(16),
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },

  quickIconContainer: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(12),
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  quickIcon: {
    fontSize: normalizeFont(22),
    color: colors.primary,
  },

  quickTitle: {
    fontSize: normalizeFont(13),
    fontWeight: '700',
    color: colors.textPrimary,
  },

  quickSubtitle: {
    fontSize: normalizeFont(11),
    color: colors.textSecondary,
    marginTop: moderateScale(4),
  },

  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: moderateScale(16),
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },

  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: '#F0FFF5',
  },

  paymentIconContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(14),
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },

  paymentIcon: {
    fontSize: normalizeFont(22),
  },

  paymentInfo: {
    flex: 1,
  },

  paymentTitle: {
    fontSize: normalizeFont(15),
    fontWeight: '700',
    color: colors.textPrimary,
  },

  paymentSubtitle: {
    fontSize: normalizeFont(12),
    color: colors.textSecondary,
    marginTop: moderateScale(4),
  },

  radioOuter: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioSelected: {
    borderColor: colors.primary,
  },

  radioInner: {
    width: moderateScale(11),
    height: moderateScale(11),
    borderRadius: moderateScale(6),
    backgroundColor: colors.primary,
  },

  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: moderateScale(16),
    paddingVertical: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },

  addPaymentIcon: {
    fontSize: normalizeFont(22),
    color: colors.primary,
    marginRight: spacing.sm,
  },

  addPaymentText: {
    fontSize: normalizeFont(14),
    fontWeight: '700',
    color: colors.primary,
  },

  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: moderateScale(18),
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },

  emptyIconContainer: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  emptyIcon: {
    fontSize: normalizeFont(26),
    color: colors.textSecondary,
  },

  emptyTitle: {
    fontSize: normalizeFont(15),
    fontWeight: '800',
    color: colors.textPrimary,
  },

  emptyText: {
    fontSize: normalizeFont(12),
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: normalizeFont(18),
    marginTop: moderateScale(6),
  },

  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: moderateScale(16),
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  securityIcon: {
    fontSize: normalizeFont(24),
    marginRight: spacing.md,
  },

  securityContent: {
    flex: 1,
  },

  securityTitle: {
    fontSize: normalizeFont(14),
    fontWeight: '700',
    color: colors.textPrimary,
  },

  securityText: {
    fontSize: normalizeFont(11),
    color: colors.textSecondary,
    marginTop: moderateScale(4),
    lineHeight: normalizeFont(16),
  },
});