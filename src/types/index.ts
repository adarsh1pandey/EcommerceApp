/**
 * Type definitions for the E-commerce App
 */

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  tags?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface Banner {
  id: number;
  title: string;
  image: string;
  description?: string;
}

export enum PaymentMethod {
  CREDIT_CARD = 'Credit Card',
  DEBIT_CARD = 'Debit Card',
  CASH_ON_DELIVERY = 'Cash on Delivery',
  UPI = 'UPI',
}

export interface OrderSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  summary: OrderSummary;
  paymentMethod: PaymentMethod;
  createdAt: Date;
}

// Navigation Types
export type RootStackParamList = {
  MainTabs: undefined;
  ProductDetails: { productId: number };
  Cart: undefined;
  Checkout: undefined;
  OrderConfirmation: { orderId: string };
};

export type MainTabsParamList = {
  Home: undefined;
  Search: undefined;
  Cart: undefined;
};

