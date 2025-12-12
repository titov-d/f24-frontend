'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

const YouTubeRecommendations: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Skip first product (used by TourCard), get next 3
        const response = await fetch(`${API_URL}/api/marketplace/holiday-products/featured?limit=4&shuffle=true`)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        if (data.products && data.products.length > 1) {
          setProducts(data.products.slice(1, 4)) // Get products 2, 3, 4
        }
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Failed to load')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

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
