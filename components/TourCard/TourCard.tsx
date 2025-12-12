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

const TourCard: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/api/marketplace/holiday-products/featured?limit=1&shuffle=true`)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        if (data.products && data.products.length > 0) {
          setProduct(data.products[0])
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

  if (loading) return <TourCardSkeleton />
  if (error || !product) return null

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  return (
    <Link
      href={product.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-full flex-col rounded-lg bg-gradient-to-br from-[#F3F2F5] to-[#EEEEEE] p-4"
    >
      <div className="relative h-[110px] w-full overflow-hidden rounded-sm bg-transparent">
        {product.thumbnail_url && (
          <Image
            src={product.thumbnail_url}
            alt={product.title}
            fill
            className="object-contain p-2 mix-blend-darken"
            sizes="326px"
          />
        )}
        {product.discount_percentage && product.discount_percentage > 0 && (
          <span className="absolute right-1 top-1 rounded bg-green-500 px-1.5 py-0.5 text-xs font-semibold text-white">
            -{product.discount_percentage}%
          </span>
        )}
      </div>
      <div className="my-3 flex justify-between">
        {product.shipping_free && (
          <span className="text-xs text-green-600">Envio gratis</span>
        )}
        <span className="ml-auto text-sm font-semibold">${formatPrice(product.price)}</span>
      </div>
      <h2 className="font-semibold">{truncateText(product.title, 64)}</h2>
      {product.original_price && product.original_price > product.price && (
        <p className="mb-1 mt-2 text-sm text-gray-400 line-through">
          ${formatPrice(product.original_price)}
        </p>
      )}
    </Link>
  )
}

const TourCardSkeleton: React.FC = () => (
  <div className="flex h-full flex-col rounded-lg bg-gradient-to-br from-[#F3F2F5] to-[#EEEEEE] p-4">
    <Skeleton height={110} className="max-h-[110px] w-full rounded-sm" />
    <div className="my-3 flex justify-between">
      <Skeleton width={60} height={20} />
      <Skeleton width={60} height={20} />
    </div>
    <Skeleton height={24} width="80%" />
    <Skeleton height={20} width="40%" className="mt-2" />
  </div>
)

export default TourCard
