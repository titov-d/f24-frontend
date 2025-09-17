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

interface FeriadosLaboralesProps {
  year?: number
}

const FeriadosLaborales: React.FC<FeriadosLaboralesProps> = ({ year: propYear }) => {
  const [workdayHolidays, setWorkdayHolidays] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const year = propYear || dayjs().year()

  useEffect(() => {
    const fetchWorkdayHolidays = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${API_URL}/widgets/feriadosLaborales?year=${year}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setWorkdayHolidays(data.weekdayHolidays)
      } catch (err) {
        console.error('Error fetching workday holidays:', err)
        setError('Error al cargar los feriados en días laborales. Por favor, intente más tarde.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkdayHolidays()
  }, [year])

  if (isLoading) return <div className="text-center">Cargando...</div>
  if (error) return <div className="text-center text-red-500">{error}</div>

  return (
    <div className="flex h-full w-full items-center p-4">
      <aside className="flex-[4]">
        <h2 className="text-md mb-2 font-semibold text-[gray-800]">Feriados en días laborales</h2>
        <p className="mt-2 text-sm text-[gray-600]">
          Feriados que caen en días laborales en {year}
        </p>
      </aside>
      {workdayHolidays !== null && (
        <p className="flex flex-[2] items-center justify-center text-3xl">{workdayHolidays}</p>
      )}
    </div>
  )
}

export default FeriadosLaborales
