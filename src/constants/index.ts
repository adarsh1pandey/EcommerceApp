/**
 * Application constants
 */

export * from './theme';

export const API_BASE_URL = 'https://dummyjson.com';

export const ENDPOINTS = {
  PRODUCTS: '/products',
  PRODUCT_SEARCH: '/products/search',
  PRODUCT_CATEGORIES: '/products/categories',
  CARTS: '/carts',
  AUTH: '/auth',
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  PRODUCTS_PER_PAGE: 10,
} as const;

export const TAX_RATE = 0.08; // 8% tax
export const SHIPPING_COST = 5.99;
export const FREE_SHIPPING_THRESHOLD = 50;

export const BANNER_DATA = [
  {
    id: 1,
    title: 'Summer Sale',
    image:
      'https://dummyjson.com/image/400x200/008080/ffffff?text=Summer+Sale+50%25+OFF',
    description: 'Up to 50% off on selected items',
  },
  {
    id: 2,
    title: 'New Arrivals',
    image:
      'https://dummyjson.com/image/400x200/6366F1/ffffff?text=New+Arrivals',
    description: 'Check out our latest products',
  },
  {
    id: 3,
    title: 'Free Shipping',
    image:
      'https://dummyjson.com/image/400x200/10B981/ffffff?text=Free+Shipping',
    description: 'On orders above $50',
  },
];

export const PRODUCT_TAGS = [
  'Free Delivery',
  'Selling Fast',
  'Limited Stock',
  'Best Seller',
  'Hot Deal',
  'New Arrival',
];
