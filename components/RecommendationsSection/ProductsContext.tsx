'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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

interface ProductsContextType {
  products: Product[]
  loading: boolean
  error: string | null
}

const ProductsContext = createContext<ProductsContextType>({
  products: [],
  loading: true,
  error: null
})

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/marketplace/holiday-products/featured?limit=7&shuffle=true`)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        if (data.products) {
          setProducts(data.products)
        }
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <ProductsContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  return useContext(ProductsContext)
}

// Helper to get specific products by index
export function useProduct(index: number) {
  const { products, loading, error } = useProducts()
  return {
    product: products[index] || null,
    loading,
    error
  }
}

// Helper to get range of products
export function useProductRange(startIndex: number, endIndex: number) {
  const { products, loading, error } = useProducts()
  return {
    products: products.slice(startIndex, endIndex),
    loading,
    error
  }
}
