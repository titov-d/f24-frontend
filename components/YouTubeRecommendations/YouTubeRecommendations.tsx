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

const YouTubeRecommendations: React.FC = () => {
  // Get products at indices 1, 2, 3 from shared context
  const { products, loading, error } = useProductRange(1, 4)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL').format(price)
  }

  if (error) return null

  return (
    <div className="flex h-full flex-col gap-2">
      {loading ? (
        <>
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </>
      ) : (
        products.map((product) => (
          <ProductCard key={product.id} product={product} formatPrice={formatPrice} />
        ))
      )}
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
    className="flex w-full flex-1 items-center gap-3 rounded-md bg-gradient-to-br from-[#F3F2F5] to-[#EEEEEE] p-3"
  >
    <div className="relative h-[59px] w-[81px] flex-shrink-0 overflow-hidden rounded bg-transparent">
      {product.thumbnail_url && (
        <Image
          src={product.thumbnail_url}
          alt={product.title}
          fill
          className="object-contain p-1 mix-blend-darken"
          sizes="81px"
        />
      )}
    </div>
    <div className="min-w-0 flex-1">
      <h2 className="line-clamp-2 text-sm font-semibold">
        {product.title}
      </h2>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-sm font-semibold">${formatPrice(product.price)}</span>
        {product.discount_percentage && product.discount_percentage > 0 && (
          <span className="rounded bg-green-500 px-1 py-0.5 text-[10px] font-semibold text-white">
            -{product.discount_percentage}%
          </span>
        )}
      </div>
      {product.shipping_free && (
        <span className="text-xs text-green-600">Envio gratis</span>
      )}
    </div>
  </Link>
)

const ProductCardSkeleton: React.FC = () => (
  <div className="flex w-full min-w-[270px] flex-1 items-center gap-3 rounded-md bg-gradient-to-br from-[#F3F2F5] to-[#EEEEEE] p-3">
    <Skeleton width={81} height={59} />
    <div className="min-w-0 flex-1">
      <Skeleton width="80%" height={16} />
      <Skeleton width="60%" height={14} className="mt-1" />
    </div>
  </div>
)

export default YouTubeRecommendations
