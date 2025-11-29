/**
 * Checkout Screen - Review order and place order
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList, PaymentMethod } from '../types';
import { Button, EmptyState } from '../components';
import { COLORS, SPACING, TYPOGRAPHY, SIZES, SHADOWS, LAYOUT } from '../constants/theme';
import { formatCurrency, calculateOrderSummary, generateOrderId } from '../utils';
import { useCart } from '../context';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { cart, clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(
    PaymentMethod.CREDIT_CARD
  );
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const orderSummary = calculateOrderSummary(cart.total);

  const paymentMethods = [
    { id: PaymentMethod.CREDIT_CARD, icon: 'credit-card', label: 'Credit Card' },
    { id: PaymentMethod.DEBIT_CARD, icon: 'credit-card-outline', label: 'Debit Card' },
    { id: PaymentMethod.UPI, icon: 'cellphone', label: 'UPI' },
    { id: PaymentMethod.CASH_ON_DELIVERY, icon: 'cash', label: 'Cash on Delivery' },
  ];

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    
    // Simulate API call to place order
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderId = generateOrderId();
      clearCart();
      
      navigation.reset({
        index: 0,
        routes: [
          { name: 'MainTabs' },
          { name: 'OrderConfirmation', params: { orderId } },
        ],
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (cart.items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon="cart-outline"
          title="Your Cart is Empty"
          message="Add some products to your cart before checking out"
          actionLabel="Start Shopping"
          onAction={() => navigation.navigate('MainTabs')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {cart.items.map(item => (
            <View key={item.product.id} style={styles.orderItem}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.product.title}
              </Text>
              <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              <Text style={styles.itemPrice}>
                {formatCurrency(item.product.price * item.quantity)}
              </Text>
            </View>
          ))}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethods.map(method => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethod,
                selectedPayment === method.id && styles.selectedPaymentMethod,
              ]}
              onPress={() => setSelectedPayment(method.id)}>
              <Icon
                name={method.icon}
                size={24}
                color={
                  selectedPayment === method.id ? COLORS.primary : COLORS.textSecondary
                }
              />
              <Text
                style={[
                  styles.paymentMethodText,
                  selectedPayment === method.id && styles.selectedPaymentMethodText,
                ]}>
                {method.label}
              </Text>
              {selectedPayment === method.id && (
                <Icon name="check-circle" size={24} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(orderSummary.subtotal)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (8%)</Text>
              <Text style={styles.summaryValue}>{formatCurrency(orderSummary.tax)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>
                {orderSummary.shipping === 0 ? (
                  <Text style={styles.freeShipping}>FREE</Text>
                ) : (
                  formatCurrency(orderSummary.shipping)
                )}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(orderSummary.total)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalContainer}>
          <Text style={styles.bottomTotalLabel}>Total Amount</Text>
          <Text style={styles.bottomTotalValue}>
            {formatCurrency(orderSummary.total)}
          </Text>
        </View>
        <Button
          title="Place Order"
          onPress={handlePlaceOrder}
          variant="primary"
          loading={isPlacingOrder}
          style={styles.placeOrderButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  section: {
    padding: LAYOUT.screenPadding,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemName: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
  },
  itemQuantity: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    marginHorizontal: SPACING.md,
  },
  itemPrice: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    color: COLORS.text,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: SIZES.borderRadius,
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  selectedPaymentMethod: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '10',
  },
  paymentMethodText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
    marginLeft: SPACING.md,
  },
  selectedPaymentMethodText: {
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    color: COLORS.primary,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: SIZES.borderRadiusLg,
    ...SHADOWS.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  freeShipping: {
    color: COLORS.success,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  totalLabel: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
  },
  totalValue: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  bottomPadding: {
    height: SPACING['3xl'],
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: LAYOUT.screenPadding,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.lg,
  },
  totalContainer: {
    marginRight: SPACING.md,
  },
  bottomTotalLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  bottomTotalValue: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  placeOrderButton: {
    flex: 1,
  },
});

export default CheckoutScreen;

