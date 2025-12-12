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

const AmazonPrimeRecommendation: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Get 5th product (index 4)
        const response = await fetch(`${API_URL}/api/marketplace/holiday-products/featured?limit=5&shuffle=true`)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        if (data.products && data.products.length > 4) {
          setProduct(data.products[4])
        }
      } catch (err) {
        console.error('Error fetching product:', err)
        setError('Failed to load')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL').format(price)
  }

  if (loading) return <MovieCardSkeleton />
  if (error || !product) return null

  return (
    <div className="h-full rounded-lg bg-gradient-to-br from-[#F3F2F5] to-[#EEEEEE] p-3">
      <Link
        href={product.permalink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full flex-col"
      >
        <div className="relative h-[180px] w-full overflow-hidden rounded-md bg-transparent">
          {product.thumbnail_url && (
            <Image
              src={product.thumbnail_url}
              alt={product.title}
              fill
              className="object-contain p-2 mix-blend-darken"
              sizes="152px"
            />
          )}
          {product.discount_percentage && product.discount_percentage > 0 && (
            <span className="absolute right-1 top-1 rounded bg-green-500 px-1.5 py-0.5 text-xs font-semibold text-white">
              -{product.discount_percentage}%
            </span>
          )}
        </div>
        <div className="mt-3 flex flex-col gap-1">
          <h2 className="line-clamp-2 text-sm font-semibold">{product.title}</h2>
          <div className="flex items-center gap-2">
            <span className="font-semibold">${formatPrice(product.price)}</span>
          </div>
          {product.shipping_free && (
            <span className="text-xs text-green-600">Envio gratis</span>
          )}
        </div>
      </Link>
    </div>
  )
}

const MovieCardSkeleton: React.FC = () => (
  <div className="h-full rounded-lg bg-gradient-to-br from-[#F3F2F5] to-[#EEEEEE] p-3">
    <div className="flex w-full flex-col">
      <Skeleton width="100%" height={180} />
      <div className="mt-3 flex flex-col gap-1">
        <Skeleton width="80%" height={16} />
        <Skeleton width="60%" height={14} />
      </div>
    </div>
  </div>
)

export default AmazonPrimeRecommendation
