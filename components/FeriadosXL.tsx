// /components/FeriadosXL.tsx
'use client'
import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

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
}

interface WeekendDay {
  date: string
  dayOfWeek: number
  holiday: Holiday | null
}

interface LongWeekend {
  longestWeekend: number
  description: string
  dateRange: string
  year: number
}

interface FeriadosXLProps {
  year?: number
}

const FeriadosXL: React.FC<FeriadosXLProps> = ({ year: propYear }) => {
  const [longestWeekend, setLongestWeekend] = useState<LongWeekend | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const year = propYear || dayjs().year()

  useEffect(() => {
    const fetchLongestWeekend = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${API_URL}/widgets/feriadosXL?year=${year}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setLongestWeekend(data)
      } catch (err) {
        console.error('Error fetching longest weekend:', err)
        setError('Error al cargar los feriados XL. Por favor, intente más tarde.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchLongestWeekend()
  }, [year])

  const getDayName = (dayOfWeek: number): string => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    return days[dayOfWeek]
  }

  if (isLoading) return <div className="text-center">Cargando...</div>
  if (error) return <div className="text-center text-red-500">{error}</div>
  if (!longestWeekend) return null

  const [startStr, endStr] = longestWeekend.dateRange.split(' - ')
  const start = dayjs.tz(startStr, TIMEZONE)
  const end = dayjs.tz(endStr, TIMEZONE)
  const dayCount = longestWeekend.longestWeekend

  return (
    <div className="flex h-full w-full p-4">
      <aside className="flex flex-[8] flex-col justify-center md:flex-1">
        <h2 className="text-md mb-2 font-semibold leading-6 text-gray-800">
          Feriados más largos del año {year}
        </h2>
        <p className="mb-2 text-sm text-gray-600">
          {start.format('DD MMM')} - {end.format('DD MMM')}
        </p>
      </aside>
      <div className="flex flex-[4] flex-col items-center justify-center text-center md:flex-1">
        <p className="text-3xl">{dayCount}</p>
        <p className="text-xs">{longestWeekend.description}</p>
      </div>
    </div>
  )
}

export default FeriadosXL
