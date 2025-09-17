'use client'
import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('es')

// Use the new FastAPI backend
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8001/api/v1'

interface Holiday {
  date: string
  name: string
  description: string
  irrenunciable?: boolean
}

const isWeekend = (date: string): boolean => {
  const day = dayjs(date).day()
  return day === 0 || day === 6
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

const NextHolidayCountdown: React.FC = () => {
  const [nextHoliday, setNextHoliday] = useState<Holiday | null>(null)
  const [countdown, setCountdown] = useState<{ days: number; hours: number }>({ days: 0, hours: 0 })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNextHoliday = async () => {
      try {
        const response = await fetch(`${API_URL}/widgets/proximoFeriado`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        if (data.name && data.date) {
          setNextHoliday({
            date: data.date,
            name: data.name,
            description: data.name,
            irrenunciable: data.irrenunciable
          })
          setCountdown(getCountdown(data.date))
        }
      } catch (error) {
        console.error('Error fetching next holiday:', error)
        setError('Error cargando próximo feriado')
      }
    }

    fetchNextHoliday()

    // Обновляем обратный отсчет каждый час
    const intervalId = setInterval(() => {
      if (nextHoliday) {
        setCountdown(getCountdown(nextHoliday.date))
      }
    }, 3600000) // 1 час в миллисекундах

    return () => clearInterval(intervalId)
  }, [])

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  if (!nextHoliday) {
    return null
  }

  return (
    <div className="rounded-full px-10 text-2xl leading-loose md:px-0">
      Faltan{' '}
      <span className="mx-2 rounded-full bg-[#28C76F] bg-opacity-15 px-2 py-2 font-semibold text-[#28C76F]">
        ⏱️ {countdown.days} <span className="font-normal">dias</span> {countdown.hours}{' '}
        <span className="font-normal">horas</span>{' '}
      </span>{' '}
      para próximo feriado
    </div>
  )
}

export default NextHolidayCountdown
