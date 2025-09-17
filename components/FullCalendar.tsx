'use client'
import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const TIMEZONE = 'America/Santiago'
dayjs.tz.setDefault(TIMEZONE)

interface Holiday {
  date: string
  name: string
  type?: string
  legalBasis?: string
  irrenunciable?: boolean
  beneficiaries?: string
}

interface CalendarDay {
  date: string
  dayOfWeek: number
  holiday: Holiday | null
  isWeekend: boolean
}

interface FullCalendar {
  [key: string]: CalendarDay[]
}

const API_URL = 'https://www.fechaslibres.cl/api/fullCalendar'

const FullHolidayCalendar: React.FC = () => {
  const [fullCalendar, setFullCalendar] = useState<FullCalendar>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFullCalendar = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(API_URL)
        if (!response.ok) {
          throw new Error('Failed to fetch full calendar')
        }
        const data: FullCalendar = await response.json()
        setFullCalendar(data)
      } catch (err) {
        setError('Error fetching full calendar. Please try again later.')
        console.error('Error fetching full calendar:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFullCalendar()
  }, [])

  const formatDate = (dateString: string, dayOfWeek: number) => {
    const date = dayjs.tz(dateString, TIMEZONE)
    const day = date.date()
    const weekdays = ['D', 'L', 'M', 'X', 'J', 'V', 'S']
    return `${day} ${weekdays[dayOfWeek]}`
  }

  const isDatePassed = (dateString: string) => {
    const now = dayjs().tz(TIMEZONE)
    return dayjs.tz(dateString, TIMEZONE).isBefore(now)
  }

  if (isLoading) {
    return <div>Cargando...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-2xl font-bold">Calendario Completo de Días Festivos</h2>
      {Object.entries(fullCalendar).map(([monthYear, days]) => (
        <div key={monthYear} className="mb-8">
          <h3 className="mb-3 text-xl font-semibold">{monthYear}</h3>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`rounded p-2 ${
                  day.holiday ? 'bg-yellow-100' : day.isWeekend ? 'bg-gray-100' : 'bg-white'
                } ${isDatePassed(day.date) ? 'text-gray-500' : ''}`}
              >
                <div className="text-sm font-semibold">{formatDate(day.date, day.dayOfWeek)}</div>
                {day.holiday && (
                  <div className="mt-1 text-xs text-gray-600">{day.holiday.name}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default FullHolidayCalendar
