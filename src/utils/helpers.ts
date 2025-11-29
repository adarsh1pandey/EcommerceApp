/**
 * Utility helper functions
 */

import { TAX_RATE, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from '../constants';
import { OrderSummary } from '../types';

/**
 * Format currency value
 */
export const formatCurrency = (value: number): string => {
  return `$${value.toFixed(2)}`;
};

/**
 * Calculate order summary including tax and shipping
 */
export const calculateOrderSummary = (
  subtotal: number,
  discountAmount: number = 0,
): OrderSummary => {
  const discount = discountAmount;
  const subtotalAfterDiscount = subtotal - discount;
  const tax = subtotalAfterDiscount * TAX_RATE;
  const shipping =
    subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotalAfterDiscount + tax + shipping;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    shipping: parseFloat(shipping.toFixed(2)),
    discount: parseFloat(discount.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  };
};

/**
 * Generate random product tags
 */
export const getRandomTags = (tags: string[], count: number = 2): string[] => {
  const shuffled = [...tags].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Get deterministic tag based on product ID (prevents re-renders)
 */
export const getProductTag = (productId: number, tags: string[]): string => {
  // Use product ID to deterministically select a tag
  const index = productId % tags.length;
  return tags[index];
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Generate a unique order ID
 */
export const generateOrderId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `ORD-${timestamp}-${random}`;
};

/**
 * Debounce function for search
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Format rating to one decimal place
 */
export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

/**
 * Check if product is low in stock
 */
export const isLowStock = (stock: number, threshold: number = 10): boolean => {
  return stock > 0 && stock <= threshold;
};

/**
 * Check if product is out of stock
 */
export const isOutOfStock = (stock: number): boolean => {
  return stock === 0;
};
