/**
 * MercadoLibre API client service
 * Max 100 lines as per architecture requirements
 */

import {
  MercadoLibreProduct,
  ProductSearchResponse,
  SearchParams,
  HolidayRecommendationsParams,
} from '@/lib/types/mercadolibre';

// Use local backend in development, production in production
const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8001'
  : 'https://api.feriados24.cl';

/**
 * Search products on MercadoLibre
 */
export async function searchProducts(
  params: SearchParams
): Promise<ProductSearchResponse> {
  const queryParams = new URLSearchParams({
    q: params.q,
    ...(params.category && { category: params.category }),
    limit: (params.limit || 10).toString(),
    offset: (params.offset || 0).toString(),
  });

  const response = await fetch(
    `${API_BASE_URL}/api/v1/marketplace/search?${queryParams}`,
    {
      next: { revalidate: 3600 }, // Cache for 1 hour
    }
  );

  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Get holiday product recommendations
 */
export async function getHolidayRecommendations(
  params: HolidayRecommendationsParams
): Promise<MercadoLibreProduct[]> {
  const queryParams = new URLSearchParams({
    holiday: params.holiday,
    types: params.types,
  });

  const response = await fetch(
    `${API_BASE_URL}/api/v1/marketplace/holiday-products?${queryParams}`,
    {
      next: { revalidate: 3600 }, // Cache for 1 hour
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get recommendations: ${response.statusText}`);
  }

  const data = await response.json();
  return data.products || [];
}

/**
 * Get trending products
 */
export async function getTrendingProducts(
  limit: number = 10
): Promise<MercadoLibreProduct[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/marketplace/trending?limit=${limit}`,
    {
      next: { revalidate: 3600 }, // Cache for 1 hour
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get trending products: ${response.statusText}`);
  }

  const data = await response.json();
  return data.products || [];
}

/**
 * Format price for display
 */
export function formatPrice(price: string, currency: string): string {
  const numericPrice = parseFloat(price);

  if (currency === 'CLP') {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericPrice);
  }

  return `${currency} ${numericPrice.toLocaleString()}`;
}