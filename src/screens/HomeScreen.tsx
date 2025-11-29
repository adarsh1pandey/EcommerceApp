/**
 * Home Screen - Display banners and product listings
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Product } from '../types';
import { ProductService } from '../api';
import { LoadingSpinner, ProductCard, CartButton } from '../components';
import { COLORS, SPACING, TYPOGRAPHY, LAYOUT } from '../constants/theme';
import { BANNER_DATA } from '../constants';
import { useCart } from '../context';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 180;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { cart } = useCart();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (page: number = 0, append: boolean = false) => {
    try {
      if (!append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const limit = 10;
      const skip = page * limit;
      const response = await ProductService.getProducts(limit, skip);

      if (append) {
        setProducts(prev => [...prev, ...response.products]);
      } else {
        setProducts(response.products);
        // Set featured products (first 5)
        setFeaturedProducts(response.products.slice(0, 5));
        // Set trending products (products 5-10 or high-rated products)
        const trending = response.products
          .slice(5, 10)
          .sort((a, b) => b.rating - a.rating);
        setTrendingProducts(trending);
      }

      // Check if there are more products to load
      setHasMore(skip + response.products.length < response.total);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchProducts(currentPage + 1, true);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setCurrentPage(0);
    setHasMore(true);
    await fetchProducts(0, false);
    setRefreshing(false);
  }, []);

  const navigateToProduct = useCallback(
    (productId: number) => {
      navigation.navigate('ProductDetails', { productId });
    },
    [navigation],
  );

  const navigateToCart = useCallback(() => {
    navigation.navigate('Cart');
  }, [navigation]);

  const renderBanner = ({ item }: { item: any }) => (
    <View style={styles.bannerContainer}>
      <Image source={{ uri: item.image }} style={styles.bannerImage} />
      <View style={styles.bannerOverlay}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        {item.description && (
          <Text style={styles.bannerDescription}>{item.description}</Text>
        )}
      </View>
    </View>
  );

  const renderProductSection = (
    title: string,
    productList: Product[],
    horizontal: boolean = false,
  ) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {horizontal ? (
        <FlatList
          data={productList}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigateToProduct(item.id)}
              horizontal
            />
          )}
          contentContainerStyle={styles.horizontalList}
        />
      ) : null}
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <LoadingSpinner message="Loading more products..." />
      </View>
    );
  };

  const renderProductItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard product={item} onPress={() => navigateToProduct(item.id)} />
    ),
    [navigateToProduct],
  );

  const keyExtractor = useCallback(
    (item: Product, index: number) => `product-${item.id}-${index}`,
    [],
  );

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading products..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>Welcome to</Text>
          <Text style={styles.headerTitle}>EcommerceApp</Text>
        </View>
        <CartButton itemCount={cart.itemCount} onPress={navigateToCart} />
      </View>

      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={keyExtractor}
        renderItem={renderProductItem}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <>
            {/* Banner Carousel */}
            <FlatList
              data={BANNER_DATA}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id.toString()}
              renderItem={renderBanner}
              onMomentumScrollEnd={event => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / width,
                );
                setCurrentBannerIndex(index);
              }}
              style={styles.bannerCarousel}
            />

            {/* Banner Dots */}
            <View style={styles.dotsContainer}>
              {BANNER_DATA.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentBannerIndex === index && styles.activeDot,
                  ]}
                />
              ))}
            </View>

            {/* Featured Products */}
            {renderProductSection('Featured Products', featuredProducts, true)}

            {/* Trending Products */}
            {trendingProducts.length > 0 &&
              renderProductSection('Trending Products', trendingProducts, true)}

            {/* All Products Section Title */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>All Products</Text>
            </View>
          </>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: LAYOUT.screenPadding,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  bannerCarousel: {
    marginTop: SPACING.md,
  },
  bannerContainer: {
    width: width,
    height: BANNER_HEIGHT,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  bannerTitle: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
    marginBottom: 4,
  },
  bannerDescription: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.white,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gray300,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
  section: {
    marginTop: SPACING.lg,
    paddingHorizontal: LAYOUT.screenPadding,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  horizontalList: {
    paddingRight: LAYOUT.screenPadding,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: LAYOUT.screenPadding,
  },
  listContent: {
    paddingBottom: SPACING['3xl'],
  },
  footerLoader: {
    paddingVertical: SPACING.xl,
  },
});

export default HomeScreen;
