'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

// Use the new FastAPI backend
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8001/api/v1'

interface MovieData {
  id: number
  title: string
  posterUrl: string
  subtitle: string
  href: string
}

const AmazonPrimeRecommendation: React.FC = () => {
  const [movie, setMovie] = useState<MovieData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMovie = async () => {
      

      try {
        const response = await fetch('https://www.fechaslibres.cl/api/randomMovie')

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setMovie(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching movie data:', error)
        setError('Failed to load movie data')
        setLoading(false)
      }
    }

    fetchMovie()
  }, [])

  if (loading) return <MovieCardSkeleton />
  if (error) return <div>Error: {error}</div>

  return (
    <div className="h-full rounded-lg bg-gradient-to-br from-[#F3F2F5] to-[#EEEEEE] p-3">
      {movie ? (
        <Link
          href={movie.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full flex-col"
        >
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            width={152}
            height={180}
            className="w-full rounded-md object-contain"
          />
          <div className="mt-3 flex flex-col gap-1">
            <h2 className="text-sm font-semibold lg:max-w-[150px]">{movie.title}</h2>
            <p className="text-sm text-gray-500">{movie.subtitle}</p>
          </div>
        </Link>
      ) : (
        <div>No movie data available</div>
      )}
    </div>
  )
}

const MovieCardSkeleton: React.FC = () => (
  <div className="flex w-full flex-col">
    <Skeleton width="100%" height={180} />
    <div className="mt-3 flex flex-col gap-1">
      <Skeleton width="80%" height={16} />
      <Skeleton width="60%" height={14} />
    </div>
  </div>
)

export default AmazonPrimeRecommendation
