// /components/LongWeekendsTimeline/LongWeekendsTimeline.tsx
'use client'
import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import styles from './LongWeekendsTimeline.module.css'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('es')

const TIMEZONE = 'America/Santiago'
dayjs.tz.setDefault(TIMEZONE)

// Use the new FastAPI backend
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8001/api/v1'

interface Holiday {
  date: string
  name: string
  type?: string
  legalBasis?: string
  irrenunciable?: boolean
  beneficiaries?: string[]
}

interface WeekendDay {
  date: string
  dayOfWeek: number
  holiday: Holiday | null
}

interface LongWeekend {
  start: string
  end: string
  days: WeekendDay[]
}

interface GroupedLongWeekends {
  [key: string]: LongWeekend[]
}

const LongWeekendsTimeline: React.FC = () => {
  const [groupedLongWeekends, setGroupedLongWeekends] = useState<GroupedLongWeekends>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLongWeekends = async () => {
      try {
        setIsLoading(true)
        const currentYear = dayjs().year()
        const nextYear = currentYear + 1

        // Fetch current year and next year in parallel
        const [currentYearRes, nextYearRes] = await Promise.all([
          fetch(`${API_URL}/widgets/longWeekends?year=${currentYear}`),
          fetch(`${API_URL}/widgets/longWeekends?year=${nextYear}`)
        ])

        if (!currentYearRes.ok || !nextYearRes.ok) {
          throw new Error('HTTP error fetching long weekends')
        }

        const currentYearData: GroupedLongWeekends = await currentYearRes.json()
        const nextYearData: GroupedLongWeekends = await nextYearRes.json()

        // Merge both years
        setGroupedLongWeekends({ ...currentYearData, ...nextYearData })
      } catch (err) {
        setError('Error cargando feriados largos. Por favor intente más tarde.')
        console.error('Error fetching long weekends:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLongWeekends()
  }, [])

  const getDayName = (dayOfWeek: number): string => {
    // Backend uses Python weekday (0=Monday, 6=Sunday)
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    return days[dayOfWeek] || ''
  }

  const getCountdown = (date: string): string => {
    const now = dayjs().tz(TIMEZONE)
    const eventDate = dayjs(date).tz(TIMEZONE)
    const diff = eventDate.diff(now, 'hour')

    if (diff < 0) {
      return 'Evento pasado'
    }

    const days = Math.floor(diff / 24)
    const hours = diff % 24
    return `${days}d ${hours}h`
  }

  const renderLongWeekendCard = (
    weekend: LongWeekend,
    index: number,
    isPastEvent: boolean = false,
    isGlowing: boolean = false
  ) => {
    const start = dayjs.tz(weekend.start, TIMEZONE)
    const end = dayjs.tz(weekend.end, TIMEZONE)
    const now = dayjs().tz(TIMEZONE)
    const isCurrent = now.isAfter(start) && now.isBefore(end)

    const countdown = getCountdown(weekend.start)

    const uniqueDays = weekend.days.filter(
      (day, index, self) => index === self.findIndex((t) => t.date === day.date)
    )

    const dayCount = end.diff(start, 'day') + 1

    const cardClasses = `eventCard mb-4 w-[378px] flex-shrink-0 rounded-[8px] bg-white p-5 shadow-lg ${
      isPastEvent ? 'opacity-50' : ''
    } ${isGlowing ? styles.glowCard : ''}`

    return (
      <div key={index} className={cardClasses}>
        <p className="text-[30px] text-[#686868]">
          {start.format('DD MMM')} - {end.format('DD MMM')}
        </p>
        <p className="flex items-center justify-between text-[18px] text-[#686868]">
          {dayCount} {dayCount === 1 ? 'día' : 'días'} seguidos
          {isCurrent ? (
            <span className="rounded bg-green-100 px-2 py-1 text-sm font-semibold text-green-600">
              En curso
            </span>
          ) : (
            <span className="text-[16px] font-semibold text-[#D16F00]">
              {isPastEvent ? 'Evento pasado' : countdown}
            </span>
          )}
        </p>
        <hr className="my-2 border-[#f7f5f5]" />
        <ul>
          {uniqueDays.map((day, idx) => (
            <li key={idx} className="text-[16px] text-[#667]">
              + {day.holiday ? day.holiday.name : getDayName(day.dayOfWeek)}
            </li>
          ))}
        </ul>
        {uniqueDays.length !== dayCount && (
          <p className="mt-2 text-sm text-red-500">
            Nota: Hay una discrepancia entre el número de días y los eventos listados.
          </p>
        )}
      </div>
    )
  }

  const renderLongWeekends = () => {
    const now = dayjs().tz(TIMEZONE)
    let previousYear: number | null = null
    const renderedWeekends: JSX.Element[] = []

    const allWeekends = Object.values(groupedLongWeekends).flat()
    const pastWeekends = allWeekends.filter((weekend) =>
      dayjs.tz(weekend.end, TIMEZONE).isBefore(now)
    )
    const futureWeekends = allWeekends.filter(
      (weekend) => !dayjs.tz(weekend.end, TIMEZONE).isBefore(now)
    )

    const lastPastWeekend = pastWeekends.length > 0 ? pastWeekends[pastWeekends.length - 1] : null

    const currentWeekend = futureWeekends.find((weekend) => {
      const start = dayjs.tz(weekend.start, TIMEZONE)
      const end = dayjs.tz(weekend.end, TIMEZONE)
      return now.isAfter(start) && now.isBefore(end)
    })

    const glowingWeekend = currentWeekend || futureWeekends[0]

    if (lastPastWeekend) {
      renderedWeekends.push(renderLongWeekendCard(lastPastWeekend, -1, true))
      previousYear = dayjs(lastPastWeekend.end).year()
    }

    futureWeekends.forEach((weekend, index) => {
      const weekendYear = dayjs(weekend.start).year()

      if (previousYear !== null && weekendYear !== previousYear) {
        renderedWeekends.push(
          <div
            key={`year-separator-${weekendYear}`}
            className="relative hidden items-end border-l border-dashed border-gray-300 md:flex"
          >
            <span className="absolute -bottom-4 -left-[18px] z-10 font-semibold text-gray-500">
              {weekendYear}
            </span>
          </div>
        )
      }

      renderedWeekends.push(
        renderLongWeekendCard(weekend, index, false, weekend === glowingWeekend)
      )
      previousYear = weekendYear
    })

    return renderedWeekends
  }

  if (isLoading) return <div className="text-center">Cargando...</div>
  if (error) return <div className="text-center text-red-500">{error}</div>

  return (
    <div className="border-none">
      <h2 className="mt-4 border-none pl-4 text-2xl text-[#686868] lg:ml-0 lg:max-w-5xl xl:m-auto xl:mt-12 xl:max-w-7xl xl:pl-0">
        Feriados largos
      </h2>
      <div className={`mt-6 flex gap-6 overflow-x-auto pb-4 ${styles.scrollContainer}`}>
        {renderLongWeekends()}
      </div>
    </div>
  )
}

export default LongWeekendsTimeline
