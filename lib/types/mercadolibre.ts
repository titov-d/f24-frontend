/**
 * MercadoLibre API types
 * Max 100 lines as per architecture requirements
 */

export interface MercadoLibreProduct {
  id: string;
  title: string;
  price: string;
  currency: string;
  thumbnail: string;
  permalink: string;
  seller_id?: string | null;
  category_id?: string | null;
  condition?: string;
  available_quantity?: number;
  sold_quantity?: number | null;
  shipping_free: boolean;
  original_price?: string | null;
  discount_percentage?: number | null;
  attributes?: Record<string, any>;
}

export interface ProductSearchResponse {
  query: string;
  total_results: number;
  products: MercadoLibreProduct[];
  paging: {
    offset: number;
    limit: number;
    total: number;
  };
  filters?: any[] | null;
  sort?: string | null;
}

export interface SearchParams {
  q: string;
  category?: string;
  limit?: number;
  offset?: number;
}

export interface HolidayRecommendationsParams {
  holiday: string;
  types: string;
}