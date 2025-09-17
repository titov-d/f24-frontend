'use client'
import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import ErrorMessage from './ErrorMessage'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('es')

const TIMEZONE = 'America/Santiago'
dayjs.tz.setDefault(TIMEZONE)

// Use the new FastAPI backend
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8001/api/v1'

interface TotalFeriadosProps {
  year?: number
}

interface HolidayData {
  totalHolidays: number
  year: number
}

const TotalFeriados: React.FC<TotalFeriadosProps> = ({ year: propYear }) => {
  const [year, setYear] = useState(propYear || dayjs().year())
  const [holidayData, setHolidayData] = useState<HolidayData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    setYear(propYear || dayjs().year())
  }, [propYear])

  useEffect(() => {
    const fetchTotalHolidays = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${API_URL}/widgets/totalFeriados?year=${year}`)
        if (!response.ok) {
          throw new Error('Failed to fetch total holidays')
        }
        const data = await response.json()
        setHolidayData(data)
      } catch (err) {
        setError(true)
        console.error('Error fetching holiday data:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTotalHolidays()
  }, [year])

  if (isLoading) return <div className="text-center">Cargando...</div>
  if (error) return <ErrorMessage />

  return (
    <div className="flex h-full w-full items-center p-4">
      <aside className="flex-[4]">
        <h2 className="text-md mb-2 font-semibold text-gray-800">Total de feriados</h2>
        <p className="mt-2 text-sm text-gray-600">
          Número total de días festivos en {holidayData?.year || year}
        </p>
      </aside>
      {holidayData && (
        <p className="flex flex-[2] items-center justify-center text-3xl">
          {holidayData.totalHolidays}
        </p>
      )}
    </div>
  )
}

export default TotalFeriados
