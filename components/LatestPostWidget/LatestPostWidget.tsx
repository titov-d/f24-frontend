'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface Post {
  id: string
  slug: string
  title: string
  excerpt: string | null
  category: string | null
  featured_image: string | null
  published_at: string | null
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

// Placeholder images for posts without featured_image
const PLACEHOLDER_IMAGES = [
  '/static/images/holidays/navidad.webp',
  '/static/images/holidays/ano-nuevo.webp',
  '/static/images/holidays/fiestas-patrias.webp',
]

const LatestPostWidget: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${API_URL}/api/public/posts/recent?limit=1`)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        if (data && data.length > 0) {
          setPost(data[0])
        }
      } catch (err) {
        console.error('Error fetching latest post:', err)
        setError('Failed to load')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading) return <LatestPostSkeleton />
  if (error || !post) return null

  // Use featured_image or fallback to placeholder
  const imageUrl = post.featured_image || PLACEHOLDER_IMAGES[0]

  // Link to blog post - for now disabled since blog routes don't exist
  const postUrl = '#' // `/blog/${post.slug || post.id}`

  return (
    <div className="flex h-full w-full flex-col rounded-lg xl:flex-row">
      {/* Image - top on mobile, left on desktop */}
      <div className="relative h-[200px] w-full overflow-hidden rounded-t-lg xl:h-full xl:w-1/2 xl:rounded-l-lg xl:rounded-tr-none">
        <Image
          src={imageUrl}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 1280px) 100vw, 200px"
        />
      </div>

      {/* Content - bottom on mobile, right on desktop */}
      <div className="flex flex-1 flex-col p-5">
        <h2 className="mb-2 text-base font-semibold tracking-tight text-gray-900">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mb-3 text-sm font-normal text-gray-700">
            {post.excerpt.length > 120 ? `${post.excerpt.substring(0, 120)}...` : post.excerpt}
          </p>
        )}
        <p className="mt-auto text-sm text-gray-500">
          {formatDate(post.published_at)}
        </p>
      </div>
    </div>
  )
}

const LatestPostSkeleton: React.FC = () => (
  <div className="flex h-full w-full flex-col xl:flex-row">
    <div className="h-[200px] w-full xl:h-full xl:w-1/2">
      <Skeleton height="100%" />
    </div>
    <div className="flex flex-1 flex-col p-5">
      <Skeleton height={20} className="mb-2" />
      <Skeleton count={2} height={14} className="mb-1" />
      <Skeleton width={100} height={14} className="mt-auto" />
    </div>
  </div>
)

export default LatestPostWidget
