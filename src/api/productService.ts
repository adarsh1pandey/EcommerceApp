/**
 * Product API Service
 */

import { Product } from '../types';
import { ENDPOINTS, PAGINATION } from '../constants';
import { apiClient } from './apiClient';

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

interface SearchResponse extends ProductsResponse {}

export class ProductService {
  /**
   * Fetch all products with pagination
   */
  static async getProducts(
    limit: number = PAGINATION.PRODUCTS_PER_PAGE,
    skip: number = 0
  ): Promise<ProductsResponse> {
    try {
      const response = await apiClient.get<ProductsResponse>(
        `${ENDPOINTS.PRODUCTS}?limit=${limit}&skip=${skip}`
      );
      return response;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Fetch a single product by ID
   */
  static async getProductById(id: number): Promise<Product> {
    try {
      const response = await apiClient.get<Product>(`${ENDPOINTS.PRODUCTS}/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  /**
   * Search products by query with pagination
   */
  static async searchProducts(
    query: string,
    limit: number = PAGINATION.PRODUCTS_PER_PAGE,
    skip: number = 0
  ): Promise<SearchResponse> {
    try {
      const response = await apiClient.get<SearchResponse>(
        `${ENDPOINTS.PRODUCT_SEARCH}?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`
      );
      return response;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(
    category: string,
    limit: number = PAGINATION.PRODUCTS_PER_PAGE
  ): Promise<ProductsResponse> {
    try {
      const response = await apiClient.get<ProductsResponse>(
        `${ENDPOINTS.PRODUCTS}/category/${category}?limit=${limit}`
      );
      return response;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }

  /**
   * Get all product categories
   */
  static async getCategories(): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>(
        ENDPOINTS.PRODUCT_CATEGORIES
      );
      return response;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Mock delay to simulate loading state
   */
  static async mockDelay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

