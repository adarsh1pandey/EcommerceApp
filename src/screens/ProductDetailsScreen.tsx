/**
 * Product Details Screen - Display product information and add to cart
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList, Product } from '../types';
import { ProductService } from '../api';
import { Button, LoadingSpinner, CartButton } from '../components';
import { COLORS, SPACING, TYPOGRAPHY, SIZES, SHADOWS, LAYOUT } from '../constants/theme';
import { formatCurrency, formatRating, isLowStock, isOutOfStock } from '../utils';
import { useCart } from '../context';

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = 350;

type RouteProps = RouteProp<RootStackParamList, 'ProductDetails'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProductDetailsScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { productId } = route.params;
  const { cart, addToCart, isInCart, getCartItemQuantity, updateQuantity } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const data = await ProductService.getProductById(productId);
      setProduct(data);
      // Set initial quantity if already in cart
      const cartQty = getCartItemQuantity(productId);
      if (cartQty > 0) {
        setQuantity(cartQty);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleIncrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const navigateToCart = () => {
    navigation.navigate('Cart');
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading product details..." />;
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  const inCart = isInCart(product.id);
  const lowStock = isLowStock(product.stock);
  const outOfStock = isOutOfStock(product.stock);
  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View style={styles.imageCarouselContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={event => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width
              );
              setCurrentImageIndex(index);
            }}>
            {images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.productImage}
              />
            ))}
          </ScrollView>

          {/* Image Indicators */}
          {images.length > 1 && (
            <View style={styles.imageIndicators}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    currentImageIndex === index && styles.activeIndicator,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Discount Badge */}
          {product.discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                {Math.round(product.discountPercentage)}% OFF
              </Text>
            </View>
          )}
        </View>

        {/* Product Information */}
        <View style={styles.detailsContainer}>
          {/* Category */}
          <Text style={styles.category}>{product.category}</Text>

          {/* Title */}
          <Text style={styles.title}>{product.title}</Text>

          {/* Rating and Stock */}
          <View style={styles.metaContainer}>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={20} color={COLORS.secondary} />
              <Text style={styles.rating}>{formatRating(product.rating)}</Text>
            </View>
            <View style={styles.stockContainer}>
              <Icon
                name={outOfStock ? 'close-circle' : 'check-circle'}
                size={18}
                color={outOfStock ? COLORS.error : lowStock ? COLORS.warning : COLORS.success}
              />
              <Text
                style={[
                  styles.stockText,
                  outOfStock && styles.outOfStockText,
                  lowStock && styles.lowStockText,
                ]}>
                {outOfStock
                  ? 'Out of Stock'
                  : lowStock
                  ? `Only ${product.stock} left`
                  : 'In Stock'}
              </Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatCurrency(product.price)}</Text>
            {product.brand && (
              <View style={styles.brandBadge}>
                <Text style={styles.brandText}>{product.brand}</Text>
              </View>
            )}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Quantity Selector */}
          {!outOfStock && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quantity</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={handleDecrementQuantity}
                  disabled={quantity <= 1}>
                  <Icon name="minus" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={handleIncrementQuantity}
                  disabled={quantity >= product.stock}>
                  <Icon name="plus" size={24} color={COLORS.text} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>
            {formatCurrency(product.price * quantity)}
          </Text>
        </View>
        <Button
          title={inCart ? 'Update Cart' : 'Add to Cart'}
          onPress={handleAddToCart}
          variant="primary"
          disabled={outOfStock}
          style={styles.addButton}
        />
        <TouchableOpacity style={styles.cartIconButton} onPress={navigateToCart}>
          <CartButton itemCount={cart.itemCount} onPress={navigateToCart} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageCarouselContainer: {
    position: 'relative',
  },
  productImage: {
    width: width,
    height: IMAGE_HEIGHT,
    resizeMode: 'cover',
    backgroundColor: COLORS.gray100,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: SPACING.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    opacity: 0.5,
    marginHorizontal: 4,
  },
  activeIndicator: {
    opacity: 1,
    width: 24,
  },
  discountBadge: {
    position: 'absolute',
    top: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: SIZES.borderRadius,
    ...SHADOWS.md,
  },
  discountText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  detailsContainer: {
    padding: LAYOUT.screenPadding,
  },
  category: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    color: COLORS.text,
    marginLeft: 6,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.success,
    marginLeft: 6,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  outOfStockText: {
    color: COLORS.error,
  },
  lowStockText: {
    color: COLORS.warning,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  price: {
    fontSize: TYPOGRAPHY.fontSize['4xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  brandBadge: {
    backgroundColor: COLORS.gray100,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: SIZES.borderRadius,
  },
  brandText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.fontSize.base * TYPOGRAPHY.lineHeight.relaxed,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadius,
    ...SHADOWS.sm,
  },
  quantityButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginHorizontal: SPACING.xl,
    minWidth: 40,
    textAlign: 'center',
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
  totalLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  totalPrice: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
  },
  addButton: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  cartIconButton: {
    padding: 0,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textSecondary,
  },
});

export default ProductDetailsScreen;

