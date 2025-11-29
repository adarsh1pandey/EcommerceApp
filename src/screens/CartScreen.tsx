/**
 * Cart Screen - Display cart items and manage quantities
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList, CartItem } from '../types';
import { Button, EmptyState } from '../components';
import { COLORS, SPACING, TYPOGRAPHY, SIZES, SHADOWS, LAYOUT } from '../constants/theme';
import { formatCurrency } from '../utils';
import { useCart } from '../context';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CartScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { cart, updateQuantity, removeFromCart } = useCart();

  const handleIncrement = (productId: number, currentQuantity: number) => {
    updateQuantity(productId, currentQuantity + 1);
  };

  const handleDecrement = (productId: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    }
  };

  const handleRemove = (productId: number) => {
    removeFromCart(productId);
  };

  const handleCheckout = () => {
    navigation.navigate('Checkout');
  };

  const handleContinueShopping = () => {
    navigation.navigate('MainTabs');
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const { product, quantity } = item;
    const itemTotal = product.price * quantity;

    return (
      <View style={styles.cartItem}>
        <Image source={{ uri: product.thumbnail }} style={styles.productImage} />
        
        <View style={styles.itemDetails}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {product.title}
          </Text>
          <Text style={styles.productPrice}>{formatCurrency(product.price)}</Text>
          
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleDecrement(product.id, quantity)}>
              <Icon name="minus" size={18} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleIncrement(product.id, quantity)}>
              <Icon name="plus" size={18} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.itemActions}>
          <Text style={styles.itemTotal}>{formatCurrency(itemTotal)}</Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemove(product.id)}>
            <Icon name="delete-outline" size={24} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (cart.items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon="cart-outline"
          title="Your Cart is Empty"
          message="Add some products to your cart and they will appear here"
          actionLabel="Start Shopping"
          onAction={handleContinueShopping}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      <FlatList
        data={cart.items}
        keyExtractor={item => item.product.id.toString()}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Cart Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal ({cart.itemCount} items)</Text>
          <Text style={styles.summaryValue}>{formatCurrency(cart.total)}</Text>
        </View>
        
        <Button
          title="Proceed to Checkout"
          onPress={handleCheckout}
          variant="primary"
          fullWidth
          style={styles.checkoutButton}
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
  listContent: {
    padding: LAYOUT.screenPadding,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadiusLg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: SIZES.borderRadius,
    backgroundColor: COLORS.gray100,
  },
  itemDetails: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'space-between',
  },
  productTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    color: COLORS.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadius,
    paddingHorizontal: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    color: COLORS.text,
    marginHorizontal: SPACING.md,
    minWidth: 24,
    textAlign: 'center',
  },
  itemActions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginLeft: SPACING.sm,
  },
  itemTotal: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  removeButton: {
    padding: SPACING.sm,
  },
  summaryContainer: {
    backgroundColor: COLORS.white,
    padding: LAYOUT.screenPadding,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.text,
  },
  summaryValue: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  checkoutButton: {
    marginTop: SPACING.sm,
  },
});

export default CartScreen;

