'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

interface Post {
  id: string
  slug: string
  title: string
  content: string
  excerpt: string | null
  category: string | null
  featured_image: string | null
  tags: string[]
  author_name: string | null
  author_bio: string | null
  published_at: string | null
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFoundState, setNotFoundState] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${API_URL}/api/public/posts/by-slug/${slug}`)
        if (response.status === 404) {
          setError('not_found')
          return
        }
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        setPost(data)
      } catch (err) {
        console.error('Error fetching post:', err)
        setError('Failed to load post')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [slug])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading) return <BlogPostSkeleton />
  if (error === 'not_found' || notFoundState) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Post no encontrado</h1>
        <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">Volver al inicio</Link>
      </div>
    )
  }
  if (error || !post) return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>

  return (
    <article className="container mx-auto max-w-4xl px-4 py-8">
      <Link href="/" className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900">
        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver al inicio
      </Link>

      {post.featured_image && (
        <div className="relative mb-8 h-[300px] w-full overflow-hidden rounded-lg md:h-[400px]">
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <header className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <time dateTime={post.published_at || ''}>{formatDate(post.published_at)}</time>
          {post.category && (
            <span className="rounded-full bg-gray-100 px-3 py-1">{post.category}</span>
          )}
        </div>
        {post.author_name && (
          <div className="mt-4">
            <span className="font-medium">{post.author_name}</span>
            {post.author_bio && <p className="text-sm text-gray-600">{post.author_bio}</p>}
          </div>
        )}
      </header>

      <div
        className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700"
        dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
      />

      {post.tags && post.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}

function formatContent(content: string): string {
  // Remove the first h1 heading if present (it's already shown in header)
  let processedContent = content
    .trim()
    .replace(/^#\s+.*\n*/, '') // Remove first # heading
    .trim()

  // Convert markdown-style headers to HTML
  let html = processedContent
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h2>$1</h2>') // Convert remaining h1 to h2
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')

  // Wrap in paragraph if not already HTML
  if (!html.startsWith('<')) {
    html = `<p>${html}</p>`
  }
  return html
}

function BlogPostSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Skeleton width={120} height={20} className="mb-6" />
      <Skeleton height={400} className="mb-8 rounded-lg" />
      <Skeleton height={40} className="mb-4" />
      <Skeleton width={200} height={20} className="mb-8" />
      <Skeleton count={10} height={20} className="mb-2" />
    </div>
  )
}
