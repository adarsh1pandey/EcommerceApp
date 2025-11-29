/**
 * Search Screen - Product search functionality
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Product } from '../types';
import { ProductService } from '../api';
import {
  SearchBar,
  ProductCard,
  LoadingSpinner,
  EmptyState,
  CartButton,
} from '../components';
import { COLORS, LAYOUT, SPACING, TYPOGRAPHY } from '../constants/theme';
import { debounce } from '../utils';
import { useCart } from '../context';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { cart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  const performSearch = useCallback(
    async (query: string, page: number = 0, append: boolean = false) => {
      if (!query.trim()) {
        setSearchResults([]);
        setHasSearched(false);
        setHasMore(false);
        return;
      }

      try {
        if (!append) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        setHasSearched(true);

        const limit = 10;
        const skip = page * limit;
        const response = await ProductService.searchProducts(
          query,
          limit,
          skip,
        );

        if (append) {
          setSearchResults(prev => [...prev, ...response.products]);
        } else {
          setSearchResults(response.products);
        }

        setTotalResults(response.total);
        setHasMore(skip + response.products.length < response.total);
        setCurrentPage(page);
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchResults([]);
        setHasMore(false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && searchQuery.trim()) {
      performSearch(searchQuery, currentPage + 1, true);
    }
  };

  // Debounced search
  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        setCurrentPage(0);
        setHasMore(true);
        performSearch(query, 0, false);
      }, 500),
    [performSearch],
  );

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setCurrentPage(0);
    setHasMore(false);
  };

  const navigateToProduct = useCallback(
    (productId: number) => {
      navigation.navigate('ProductDetails', { productId });
    },
    [navigation],
  );

  const navigateToCart = useCallback(() => {
    navigation.navigate('Cart');
  }, [navigation]);

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <LoadingSpinner message="Loading more..." />
      </View>
    );
  }, [loadingMore]);

  const renderProductItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard product={item} onPress={() => navigateToProduct(item.id)} />
    ),
    [navigateToProduct],
  );

  const keyExtractor = useCallback(
    (item: Product, index: number) => `search-${item.id}-${index}`,
    [],
  );

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner message="Searching..." fullScreen />;
    }

    if (!hasSearched) {
      return (
        <EmptyState
          icon="magnify"
          title="Search Products"
          message="Start typing to search for products by name, brand, or category"
        />
      );
    }

    if (searchResults.length === 0) {
      return (
        <EmptyState
          icon="package-variant-closed"
          title="No Results Found"
          message={`We couldn't find any products matching "${searchQuery}"`}
        />
      );
    }

    return (
      <FlatList
        data={searchResults}
        numColumns={2}
        keyExtractor={keyExtractor}
        renderItem={renderProductItem}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={
          totalResults > 0 ? (
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsText}>
                Found {totalResults} result{totalResults !== 1 ? 's' : ''}
              </Text>
            </View>
          ) : null
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header with Search Bar */}
      <View style={styles.header}>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearchChange}
          onClear={handleClearSearch}
          style={styles.searchBar}
          autoFocus
        />
        <CartButton itemCount={cart.itemCount} onPress={navigateToCart} />
      </View>

      {/* Search Results */}
      {renderContent()}
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
    alignItems: 'center',
    paddingHorizontal: LAYOUT.screenPadding,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchBar: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  listContent: {
    padding: LAYOUT.screenPadding,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  footerLoader: {
    paddingVertical: SPACING.xl,
  },
  resultsHeader: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  resultsText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
});

export default SearchScreen;
