/**
 * Product Recommendations Component
 * Server Component - fetches data from MercadoLibre API
 * Max 100 lines as per architecture requirements
 */

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { getHolidayRecommendations, formatPrice } from '@/lib/api/mercadolibre';
import type { MercadoLibreProduct } from '@/lib/types/mercadolibre';

interface ProductRecommendationsProps {
  title?: string;
  holiday?: string;
  productTypes?: string[];
}

// Server Component - can be async and fetch data
export default async function ProductRecommendations({
  title = 'Productos Recomendados',
  holiday = 'feriado',
  productTypes = ['regalo', 'decoracion'],
}: ProductRecommendationsProps) {
  let products: MercadoLibreProduct[] = [];

  try {
    // Fetch products from MercadoLibre API
    products = await getHolidayRecommendations({
      holiday,
      types: productTypes.join(','),
    });

    // Limit to 6 products for display
    products = products.slice(0, 6);
  } catch (error) {
    console.error('Error fetching products:', error);
    // Component will render with empty products array
  }

  if (products.length === 0) {
    return null; // Don't render if no products
  }

  return (
    <section className="py-8">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">{title}</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} variant="outlined">
            <CardContent className="p-0">
              <div className="relative h-48 w-full">
                <Image
                  src={product.thumbnail || '/images/placeholder-product.jpg'}
                  alt={product.title}
                  fill
                  className="rounded-t-lg object-cover"
                  unoptimized // For external images
                />
                {product.shipping_free && (
                  <span className="absolute right-2 top-2 rounded bg-green-600 px-2 py-1 text-xs text-white">
                    Envío gratis
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900">
                  {product.title}
                </h3>
                <div className="mb-3">
                  <p className="text-lg font-bold text-blue-600">
                    {formatPrice(product.price, product.currency)}
                  </p>
                  {product.original_price && (
                    <p className="text-sm text-gray-500 line-through">
                      {formatPrice(product.original_price, product.currency)}
                    </p>
                  )}
                </div>
                {product.available_quantity && (
                  <p className="mb-2 text-sm text-gray-600">
                    {product.available_quantity > 5
                      ? 'Disponible'
                      : `¡Últimas ${product.available_quantity} unidades!`}
                  </p>
                )}
                <a
                  href={product.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                  Ver en MercadoLibre
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}