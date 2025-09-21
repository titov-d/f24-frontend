'use client'

/**
 * Holiday Product Cards Component
 * Displays 6-8 product cards in the style of AmazonPrimeRecommendation
 * Shows products relevant to upcoming Chilean holidays
 */

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import styles from './HolidayProductCards.module.css'

interface HolidayProduct {
  id: string
  title: string
  price: number
  original_price?: number
  thumbnail_url?: string
  permalink: string
  discount_percentage?: number
  shipping_free: boolean
  currency: string
}

interface HolidayProductsData {
  success: boolean
  holiday: string
  holiday_name: string
  products: HolidayProduct[]
  total: number
}

export default function HolidayProductCards() {
  const [data, setData] = useState<HolidayProductsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    fetchHolidayProducts()
  }, [])

  useEffect(() => {
    const checkScroll = () => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
        setCanScrollLeft(scrollLeft > 0)
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)
      }
    }

    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener('scroll', checkScroll)
      checkScroll()
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener('scroll', checkScroll)
      }
    }
  }, [data])

  const fetchHolidayProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'}/api/marketplace/holiday-products/featured?limit=8`
      )

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setData(data)
    } catch (err) {
      console.error('Failed to fetch holiday products:', err)
      setError('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const cardWidth = 180 // ширина карточки + gap
      const cardsToScroll = 3 // прокручиваем по 3 карточки
      const scrollAmount = cardWidth * cardsToScroll
      const currentScroll = carouselRef.current.scrollLeft
      const newScroll = direction === 'left'
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount

      carouselRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      })
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando productos...</div>
      </div>
    )
  }

  if (error || !data || !data.products.length) {
    return null // Don't show the section if there's an error or no products
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Productos para {data.holiday_name}
        </h2>
        <span className={styles.subtitle}>
          Ofertas especiales para la temporada
        </span>
      </div>

      <div className={styles.carouselContainer}>
        <button
          className={`${styles.navigationButton} ${styles.prevButton}`}
          onClick={() => scrollCarousel('left')}
          disabled={!canScrollLeft}
          aria-label="Anterior"
        >
          <span className={styles.navigationIcon}>‹</span>
        </button>

        <div className={styles.carouselWrapper} ref={carouselRef}>
          {data.products.map((product) => (
            <Link
              key={product.id}
              href={product.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              <div className={styles.imageContainer}>
                {product.thumbnail_url ? (
                  <img
                    src={product.thumbnail_url}
                    alt={product.title}
                    className={styles.image}
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    <span>Sin imagen</span>
                  </div>
                )}
                {product.discount_percentage && (
                  <span className={styles.discount}>
                    -{product.discount_percentage}%
                  </span>
                )}
                {product.shipping_free && (
                  <span className={styles.freeShipping}>
                    Envío
                  </span>
                )}
              </div>

              <div className={styles.content}>
                <h3 className={styles.productTitle}>
                  {product.title}
                </h3>

                <div className={styles.priceContainer}>
                  <span className={styles.price}>
                    {formatPrice(product.price)}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className={styles.originalPrice}>
                      {formatPrice(product.original_price)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <button
          className={`${styles.navigationButton} ${styles.nextButton}`}
          onClick={() => scrollCarousel('right')}
          disabled={!canScrollRight}
          aria-label="Siguiente"
        >
          <span className={styles.navigationIcon}>›</span>
        </button>
      </div>
    </div>
  )
}