'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useProductRange } from '../RecommendationsSection/ProductsContext'

interface Product {
  id: string
  title: string
  price: number
  original_price?: number
  thumbnail_url?: string
  permalink: string
  discount_percentage?: number
  shipping_free: boolean
}

const ProductRecommendations: React.FC = () => {
  // Get products at indices 5 and 6 from shared context
  const { products, loading, error } = useProductRange(5, 7)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL').format(price)
  }

  if (loading) {
    return (
      <div className="flex h-full flex-col gap-2">
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </div>
    )
  }

  if (error || products.length === 0) return null

  return (
    <div className="flex h-full flex-col gap-2">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} formatPrice={formatPrice} />
      ))}
    </div>
  )
}

const ProductCard: React.FC<{ product: Product; formatPrice: (p: number) => string }> = ({
  product,
  formatPrice
}) => (
  <Link
    href={product.permalink}
    target="_blank"
    rel="noopener noreferrer"
    className="flex w-full flex-1 items-center gap-3 rounded-lg bg-gradient-to-br from-[#F3F2F5] to-[#EEEEEE] p-3"
  >
    <div className="relative h-[100px] w-[100px] flex-shrink-0 overflow-hidden rounded bg-transparent">
      {product.thumbnail_url && (
        <Image
          src={product.thumbnail_url}
          alt={product.title}
          fill
          className="object-contain p-1 mix-blend-darken"
          sizes="100px"
        />
      )}
    </div>
    <div>
      <h2 className="line-clamp-2 text-md max-w-[200px] font-semibold">{product.title}</h2>
      {product.shipping_free && (
        <span className="text-xs text-green-600">Envio gratis</span>
      )}
      <div className="mt-1 flex flex-col">
        {product.original_price && product.original_price > product.price && (
          <del className="text-sm font-semibold text-gray-400" aria-label="Precio original">
            ${formatPrice(product.original_price)}
          </del>
        )}
        <data value={product.price} className="text-sm font-semibold">
          ${formatPrice(product.price)}{' '}
          {product.discount_percentage && product.discount_percentage > 0 && (
            <span className="relative bottom-[1px] rounded-md bg-red-600 bg-opacity-10 px-[6px] py-[2px] text-[10px] font-semibold text-red-500">
              -{product.discount_percentage}%
            </span>
          )}
        </data>
      </div>
    </div>
  </Link>
)

const ProductCardSkeleton: React.FC = () => (
  <div className="flex w-full flex-1 items-center gap-3 rounded-lg bg-gradient-to-br from-[#F3F2F5] to-[#EEEEEE] p-3">
    <Skeleton width={100} height={100} />
    <div className="flex-1">
      <Skeleton width="80%" height={16} />
      <Skeleton width="40%" height={14} />
      <div className="mt-1">
        <Skeleton width="60%" height={14} />
        <Skeleton width="70%" height={16} />
      </div>
    </div>
  </div>
)

export default ProductRecommendations
