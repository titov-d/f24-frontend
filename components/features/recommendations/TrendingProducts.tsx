/**
 * Trending Products Component
 * Shows trending products from MercadoLibre API
 * Max 200 lines as per architecture requirements
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTrendingProducts, formatPrice } from '@/lib/api/mercadolibre';
import { MercadoLibreProduct } from '@/lib/types/mercadolibre';

export default function TrendingProducts() {
  const [products, setProducts] = useState<MercadoLibreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrendingProducts();
  }, []);

  const fetchTrendingProducts = async () => {
    try {
      setLoading(true);
      const data = await getTrendingProducts(8);
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching trending products:', err);
      setError('No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">🔥 Productos en Tendencia</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg border bg-gray-100 p-4">
                <div className="mb-4 h-48 w-full rounded bg-gray-200"></div>
                <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="h-6 w-1/2 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">🔥 Productos en Tendencia</h2>
          <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-6 text-center">
            <p className="text-yellow-800 text-lg">
              No hay productos disponibles en este momento
            </p>
            <p className="text-yellow-600 text-sm mt-2">
              Por favor, intente más tarde o verifique la conexión con MercadoLibre
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">🔥 Productos en Tendencia</h2>
          <button
            onClick={fetchTrendingProducts}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Actualizar
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-lg"
            >
              {/* Product Image */}
              <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={product.thumbnail || 'https://via.placeholder.com/300'}
                  alt={product.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                {product.condition === 'new' && (
                  <span className="absolute left-2 top-2 rounded bg-green-500 px-2 py-1 text-xs font-semibold text-white">
                    NUEVO
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="line-clamp-2 text-sm font-medium text-gray-900">
                  {product.title}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(product.price, product.currency)}
                  </span>
                  {product.original_price && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.original_price, product.currency)}
                    </span>
                  )}
                </div>

                {/* Discount Badge */}
                {product.discount_percentage && (
                  <span className="inline-block rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
                    -{product.discount_percentage}% OFF
                  </span>
                )}

                {/* Shipping */}
                {product.shipping_free && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <span>🚚 Envío gratis</span>
                  </div>
                )}

                {/* Stock */}
                {product.available_quantity && product.available_quantity < 10 && (
                  <p className="text-xs text-orange-600">
                    ¡Solo quedan {product.available_quantity} unidades!
                  </p>
                )}

                {/* CTA Button */}
                <Link
                  href={product.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  🛒 Ver en MercadoLibre
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}