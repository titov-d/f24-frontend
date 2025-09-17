'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Rating from '../Rating/Rating'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface TourData {
  id: number
  imageUrl: string
  rating: number
  price: number
  title: string
  description: string
  href: string
}

// Use the new FastAPI backend
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8001/api/v1'

const TourCard: React.FC = () => {
  const [tourData, setTourData] = useState<TourData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTourData = async () => {
      

      try {
        const response = await fetch('https://www.fechaslibres.cl/api/randomTour')

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setTourData(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching tour data:', error)
        setError('Failed to load tour data')
        setLoading(false)
      }
    }

    fetchTourData()
  }, [])

  if (loading) {
    return <TourCardSkeleton />
  }

  if (error || !tourData) {
    return <div>Error: {error || 'Failed to load tour data'}</div>
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  const truncatedTitle = truncateText(tourData.title, 64)
  const truncatedDescription = truncateText(tourData.description, 116)

  return (
    <Link
      href={tourData.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-full flex-col rounded-lg bg-gradient-to-br from-[#F3F2F5] to-[#EEEEEE] p-4"
    >
      <Image
        src={tourData.imageUrl}
        alt={tourData.title}
        width={326}
        height={110}
        className="max-h-[110px] w-full rounded-sm object-cover"
      />
      <div className="my-3 flex justify-between">
        <Rating value={tourData.rating} readonly={true} />
        <span className="text-sm font-semibold">${tourData.price.toLocaleString()}</span>
      </div>
      <h2 className="font-semibold">{truncatedTitle}</h2>
      <p className="mb-1 mt-2 text-sm text-gray-500">{truncatedDescription}</p>
    </Link>
  )
}

const TourCardSkeleton: React.FC = () => (
  <div className="flex h-full flex-col rounded-lg bg-gradient-to-br from-[#F3F2F5] to-[#EEEEEE] p-4">
    <Skeleton height={110} className="max-h-[110px] w-full rounded-sm" />
    <div className="my-3 flex justify-between">
      <Skeleton width={100} height={20} />
      <Skeleton width={60} height={20} />
    </div>
    <Skeleton height={24} width="80%" />
    <Skeleton height={40} className="mb-1 mt-2" />
  </div>
)

export default TourCard
