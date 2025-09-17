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

interface NextHoliday {
  date: string
  name: string
  daysUntil: number
}

const ProximoFeriado: React.FC = () => {
  const [nextHoliday, setNextHoliday] = useState<NextHoliday | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNextHoliday = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${API_URL}/widgets/proximoFeriado`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setNextHoliday(data)
      } catch (err) {
        console.error('Error fetching next holiday:', err)
        setError('Error al cargar el próximo feriado. Por favor, intente más tarde.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchNextHoliday()
  }, [])

  if (isLoading) return <div className="text-center">Cargando...</div>
  if (error) return <div className="text-center text-red-500">{error}</div>

  return (
    <div className="flex h-full w-full items-center p-4">
      {nextHoliday && (
        <div className="flex w-full justify-between gap-2">
          <aside className="flex flex-[4] flex-col justify-center">
            <h2 className="text-md font-semibold text-gray-800">Próximo feriado</h2>
            <p className="mt-1 text-sm text-gray-600">
              {dayjs(nextHoliday.date).format('DD [de] MMMM [de] YYYY')}
            </p>
          </aside>
          <p className="flex flex-[2] flex-col items-center justify-center text-3xl">
            <span className="text-sm">En</span> {nextHoliday.daysUntil}{' '}
            <span className="text-sm">{nextHoliday.daysUntil === 1 ? 'día' : 'días'}</span>
          </p>
        </div>
      )}
    </div>
  )
}

export default ProximoFeriado
