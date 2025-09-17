'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface VideoData {
  id: number
  title: string
  imageUrl: string
  channel: string
  duration: string
  likes: string
  href?: string // Make href optional
}

// Use the new FastAPI backend
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8001/api/v1'

const YouTubeRecommendations: React.FC = () => {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVideos = async () => {
      

      try {
        const response = await fetch(`${API_URL}/widgets/recommendations`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setVideos(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching video data:', error)
        setError('Failed to load video data')
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  return (
    <div className="flex h-full flex-col gap-2">
      {loading ? (
        <>
          <VideoCardSkeleton />
          <VideoCardSkeleton />
          <VideoCardSkeleton />
        </>
      ) : (
        videos.map((video) => <VideoCard key={video.id} video={video} />)
      )}
    </div>
  )
}

const VideoCard: React.FC<{ video: VideoData }> = ({ video }) => (
  <Link
    href={video.href || '#'} // Use '#' as fallback if href is undefined
    target="_blank"
    rel="noopener noreferrer"
    className="flex w-full flex-1 items-center gap-3 rounded-md bg-gradient-to-br from-[#F3F2F5] to-[#EEEEEE] p-3"
  >
    <Image
      src={video.imageUrl}
      alt={video.title}
      width={81}
      height={59}
      className="h-[59px] w-auto mix-blend-darken"
    />
    <div className="min-w-0 flex-1">
      <h2 className="truncate font-semibold" title={video.title}>
        {video.title}
      </h2>
      <h3 className="truncate text-sm text-gray-500">{video.channel}</h3>
      <div className="mt-1 flex gap-2">
        <VideoMetadata icon="clock" value={video.duration} />
        <VideoMetadata icon="thumbs-up" value={video.likes} />
      </div>
    </div>
  </Link>
)

const VideoCardSkeleton: React.FC = () => (
  <div className="flex w-full min-w-[270px] flex-1 items-center gap-3 rounded-md bg-gradient-to-br from-[#F3F2F5] to-[#EEEEEE] p-3">
    <Skeleton width={81} height={59} />
    <div className="min-w-0 flex-1">
      <Skeleton width="80%" height={16} />
      <Skeleton width="60%" height={14} />
      <div className="mt-1 flex gap-2">
        <Skeleton width={40} height={14} />
        <Skeleton width={40} height={14} />
      </div>
    </div>
  </div>
)

const VideoMetadata: React.FC<{ icon: 'clock' | 'thumbs-up'; value: string }> = ({
  icon,
  value,
}) => (
  <data className="flex items-center gap-1">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="#8A8A8A"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icon === 'clock' ? (
        <>
          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
          <path d="M12 12h3.5" />
          <path d="M12 7v5" />
        </>
      ) : (
        <path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3" />
      )}
    </svg>
    <span className="text-xs">{value}</span>
  </data>
)

export default YouTubeRecommendations
