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

interface TotalDiasLibresProps {
  year?: number
}

const TotalDiasLibres: React.FC<TotalDiasLibresProps> = ({ year: propYear }) => {
  const [totalFreeDays, setTotalFreeDays] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const year = propYear || dayjs().year()

  useEffect(() => {
    const fetchTotalFreeDays = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${API_URL}/widgets/totalDiasLibres?year=${year}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setTotalFreeDays(data.totalFreeDays)
      } catch (err) {
        console.error('Error fetching total free days:', err)
        setError('Error al cargar el total de días libres. Por favor, intente más tarde.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTotalFreeDays()
  }, [year])

  if (isLoading) return <div className="text-center">Cargando...</div>
  if (error) return <div className="text-center text-red-500">{error}</div>

  return (
    <div className="flex h-full w-full items-center p-4">
      <aside className="flex-[4]">
        <h2 className="text-md mb-2 font-semibold text-gray-800">Total de días libres</h2>
        <p className="mt-2 text-sm text-gray-600">
          Incluyendo fines de semana y feriados en {year}
        </p>
      </aside>
      {totalFreeDays !== null && (
        <p className="flex flex-[2] items-center justify-center text-3xl">{totalFreeDays}</p>
      )}
    </div>
  )
}

export default TotalDiasLibres
