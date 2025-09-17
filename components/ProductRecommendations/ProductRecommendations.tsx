'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

// Use the new FastAPI backend
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8001/api/v1'

interface ProductData {
  id: number
  name: string
  brand: string
  imageUrl: string
  originalPrice: number
  discountedPrice: number
  discountPercentage: number
  href: string
}

const ProductRecommendations: React.FC = () => {
  const [products, setProducts] = useState<ProductData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      

      try {
        const response = await fetch('https://www.fechaslibres.cl/api/randomProducts')

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setProducts(data)
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

const ProductCard: React.FC<{ product: ProductData }> = ({ product }) => (
  <Link
    href={product.href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex w-full flex-1 items-center gap-3 rounded-lg bg-gradient-to-br from-[#F3F2F5] to-[#EEEEEE] p-3"
  >
    <Image
      src={product.imageUrl}
      alt={product.name}
      width={100}
      height={100}
      className="h-[100px] w-auto mix-blend-darken"
    />
    <div>
      <h2 className="text-md max-w-[200px] font-semibold">{product.name}</h2>
      <h3 className="mb-1 text-sm text-gray-500">{product.brand}</h3>
      <div className="flex flex-col">
        <del className="text-sm font-semibold text-gray-400" aria-label="Precio original">
          <data value={product.originalPrice}>${product.originalPrice.toLocaleString()}</data>
        </del>
        <data value={product.discountedPrice} className="text-sm font-semibold">
          ${product.discountedPrice.toLocaleString()}{' '}
          <span
            className="relative bottom-[1px] rounded-md bg-red-600 bg-opacity-10 px-[6px] py-[2px] text-[10px] font-semibold text-red-500"
            aria-label="Porcentaje de descuento"
          >
            -{product.discountPercentage}%
          </span>
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
