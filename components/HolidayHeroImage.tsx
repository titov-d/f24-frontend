'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(duration)

// Use the new FastAPI backend
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8001/api/v1'

interface Holiday {
  date: string
  name: string
  type: string
  irrenunciable: boolean
  hero_image_url?: string
}

const HolidayHeroImage: React.FC = () => {
  const [holidayToShow, setHolidayToShow] = useState<Holiday | null>(null)
  const [isCurrentHoliday, setIsCurrentHoliday] = useState<boolean>(false)
  const [timeUntilHoliday, setTimeUntilHoliday] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const isWeekend = (date: string): boolean => {
    const day = dayjs(date).day()
    return day === 0 || day === 6 // 0 - воскресенье, 6 - суббота
  }

  const getCountdown = (date: string): { days: number; hours: number } => {
    const now = dayjs().tz('America/Santiago')
    const eventDate = dayjs(date).tz('America/Santiago')
    const diff = eventDate.diff(now, 'hour')
    if (diff < 0) {
      return { days: 0, hours: 0 }
    }
    const days = Math.floor(diff / 24)
    const hours = diff % 24
    return { days, hours }
  }

  const getHolidayText = (name: string, timeUntil: string): string => {
    if (name.length <= 24) {
      return `Faltan ⏱️ ${timeUntil} para ${name}`
    } else {
      return `Faltan ⏱️ ${timeUntil} para\u00A0próximo\u00A0feriado`
    }
  }

  useEffect(() => {
    const fetchHoliday = async () => {
      try {
        const response = await fetch(`${API_URL}/holidays-simple/next`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (!data || !data.holidays || data.holidays.length === 0) {
          throw new Error('No holidays found')
        }

        const now = dayjs().tz('America/Santiago')
        const holidays = data.holidays

        // Find the first non-weekend holiday
        const nextHoliday = holidays.find((holiday: Holiday) => !isWeekend(holiday.date))

        if (nextHoliday) {
          const holidayDate = dayjs(nextHoliday.date).tz('America/Santiago')
          const isCurrent = holidayDate.isSame(now, 'day')

          setHolidayToShow(nextHoliday)
          setIsCurrentHoliday(isCurrent)

          if (!isCurrent) {
            const { days, hours } = getCountdown(nextHoliday.date)
            setTimeUntilHoliday(`${days}d ${hours}h`)
          }
        } else {
          setHolidayToShow(null)
        }
        setLoading(false)
      } catch (err) {
        console.error('Error fetching holiday data:', err)
        setError(
          `Failed to fetch holiday data: ${err instanceof Error ? err.message : String(err)}`
        )
        setLoading(false)
      }
    }
    fetchHoliday()
    const interval = setInterval(fetchHoliday, 60000) // Обновляем каждую минуту
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="mx-auto mb-2 mt-6 xl:max-w-4xl">
        <Skeleton height={200} />
      </div>
    )
  }

  if (error) {
    return <div className="mx-auto mb-10 mt-6 text-center text-red-500 xl:max-w-4xl">{error}</div>
  }

  if (!holidayToShow) {
    return (
      <div className="mx-auto mb-10 mt-6 text-center xl:max-w-4xl">
        No hay feriados programados en días laborales
      </div>
    )
  }

  return (
    <div className="mx-auto mb-4 mt-6 w-full text-center xl:max-w-4xl">
      <Image
        src={holidayToShow.hero_image_url || '/images/holidays/default-holiday.webp'}
        alt={holidayToShow.name}
        width={300}
        height={200}
        style={{ width: '100%', height: 'auto' }}
        priority
      />
      <h1 className="mt-8 text-xl font-semibold uppercase text-[#333]">Feriados Chile 2024</h1>
      <h2 className="mt-6 px-2 text-center text-xl text-[#686868] md:px-8 md:text-2xl lg:mb-10 lg:px-0">
        {isCurrentHoliday
          ? `Hoy celebramos ${holidayToShow.name} 🎉`
          : getHolidayText(holidayToShow.name, timeUntilHoliday)}
      </h2>
    </div>
  )
}

export default HolidayHeroImage
