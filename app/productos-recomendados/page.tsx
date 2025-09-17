/**
 * Product recommendations demo page
 * Shows MercadoLibre products for different holidays
 */

import { ChristmasProducts, NewYearProducts, PatrioticProducts } from '@/components/features/recommendations/HolidayProducts';
import ProductRecommendations from '@/components/features/recommendations/ProductRecommendations';
import TrendingProducts from '@/components/features/recommendations/TrendingProducts';

export const metadata = {
  title: 'Productos Recomendados - Feriados Chile 2025',
  description: 'Encuentra los mejores productos para cada feriado en Chile',
};

export default function ProductosRecomendados() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        Productos Recomendados para Feriados
      </h1>

      {/* Trending Products Section - First */}
      <div className="mb-12">
        <TrendingProducts />
      </div>

      <div className="mb-12">
        <ChristmasProducts />
      </div>

      <div className="mb-12">
        <NewYearProducts />
      </div>

      <div className="mb-12">
        <PatrioticProducts />
      </div>

      <div className="mb-12">
        <ProductRecommendations
          title="Para tu próximo fin de semana largo"
          holiday="fin de semana largo"
          productTypes={['camping', 'parrilla', 'cooler']}
        />
      </div>
    </div>
  );
}