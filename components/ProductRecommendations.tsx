'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

interface ProductData {
  id: string
  title: string
  price: number
  original_price?: number
  discount_percentage?: number
  thumbnail_url: string
  permalink: string
  seller_name?: string
  shipping_free?: boolean
}

const ProductRecommendations: React.FC = () => {
  const [products, setProducts] = useState<ProductData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch recommended products from backend - limit to 2 for testing
        const response = await fetch(`${API_URL}/api/marketplace/products?limit=2&min_discount=10`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        // API returns array directly, limit to 2 products
        const limitedProducts = Array.isArray(data) ? data.slice(0, 2) : []
        setProducts(limitedProducts)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching product data:', error)
        setError('Failed to load product data')
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="flex h-full flex-col gap-2">
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  return (
    <div className="flex h-full flex-col gap-2">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

const ProductCard: React.FC<{ product: ProductData }> = ({ product }) => {
  // Use prices directly from database
  // price = current/discounted price
  // original_price = original price before discount (if exists)
  const discountPercentage = product.discount_percentage || 0
  const currentPrice = product.price
  const originalPrice = product.original_price || currentPrice

  return (
    <Link
      href={product.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full flex-1 items-center gap-3 rounded-lg bg-gradient-to-br from-[#F3F2F5] to-[#EEEEEE] p-3"
    >
      <Image
        src={product.thumbnail_url}
        alt={product.title}
        width={100}
        height={100}
        className="h-[100px] w-auto mix-blend-darken"
      />
      <div>
        <h2 className="text-md max-w-[200px] font-semibold">{product.title}</h2>
        <h3 className="mb-1 text-sm text-gray-500">{product.seller_name || 'MercadoLibre'}</h3>
        <div className="flex flex-col">
          {discountPercentage > 0 && (
            <del className="text-sm font-semibold text-gray-400" aria-label="Precio original">
              <data value={originalPrice}>${originalPrice.toLocaleString('es-CL')}</data>
            </del>
          )}
          <data value={currentPrice} className="text-sm font-semibold">
            ${currentPrice.toLocaleString('es-CL')}{' '}
            {discountPercentage > 0 && (
              <span
                className="relative bottom-[1px] rounded-md bg-red-600 bg-opacity-10 px-[6px] py-[2px] text-[10px] font-semibold text-red-500"
                aria-label="Porcentaje de descuento"
              >
                -{Math.round(discountPercentage)}%
              </span>
            )}
          </data>
        </div>
      </div>
    </Link>
  )
}

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
