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

interface YearStatisticsProps {
  year?: number
}

interface YearStatistics {
  year: number
  totalHolidays: number
  holidaysOnWeekdays: number
  holidaysOnWeekends: number
  totalFreeDays: number
  irrenunciableCount: number
  religiousCount: number
  nationalCount: number
  regionalCount: number
  longestWeekend: {
    days: number
    dates: string
  }
  longWeekendsCount: number
  nextHoliday: {
    name: string
    date: string
    daysUntil: number
    type: string
    irrenunciable: boolean
  }
}

const YearStatisticsWidget: React.FC<YearStatisticsProps> = ({ year: propYear }) => {
  const [year] = useState(propYear || dayjs().year())
  const [statistics, setStatistics] = useState<YearStatistics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${API_URL}/widgets/yearInNumbers?year=${year}`)

        if (!response.ok) {
          throw new Error('Failed to fetch statistics')
        }

        const data = await response.json()
        setStatistics(data)
      } catch (err) {
        setError('Error cargando estadísticas')
        console.error('Error fetching statistics:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatistics()
  }, [year])

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Cargando estadísticas...
      </div>
    )
  }

  if (error || !statistics) {
    return (
      <div className="p-8 text-center text-red-500">
        {error || 'Error cargando datos'}
      </div>
    )
  }

  // Format longest weekend dates for display
  const formatLongestWeekend = () => {
    if (!statistics.longestWeekend.dates) return ''
    const [start, end] = statistics.longestWeekend.dates.split(' to ')
    const startDate = dayjs(start).format('D [de] MMM')
    const endDate = dayjs(end).format('D [de] MMM')
    return `${startDate} - ${endDate}`
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Tu Año {year} en Números
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total de feriados */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total de feriados</h3>
              <p className="text-xs text-gray-500 mt-1">
                Número total de días festivos en {year}
              </p>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {statistics.totalHolidays}
            </div>
          </div>
        </div>

        {/* Feriados perdidos */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Feriados perdidos</h3>
              <p className="text-xs text-gray-500 mt-1">
                Que caen en fin de semana en {year}
              </p>
            </div>
            <div className="text-3xl font-bold text-orange-600">
              {statistics.holidaysOnWeekends}
            </div>
          </div>
        </div>

        {/* Feriados más largos */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-600">
                Feriados más largos del año {year}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {formatLongestWeekend()}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-3xl font-bold text-green-600">
                {statistics.longestWeekend.days}
              </div>
              <div className="text-xs text-gray-500">días seguidos</div>
            </div>
          </div>
        </div>

        {/* Feriados en días laborales */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-600">
                Feriados en días laborales
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Feriados que caen en días laborales en {year}
              </p>
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {statistics.holidaysOnWeekdays}
            </div>
          </div>
        </div>

        {/* Total de días libres */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total de días libres</h3>
              <p className="text-xs text-gray-500 mt-1">
                Incluyendo fines de semana y feriados en {year}
              </p>
            </div>
            <div className="text-3xl font-bold text-indigo-600">
              {statistics.totalFreeDays}
            </div>
          </div>
        </div>

        {/* Próximo feriado */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Próximo feriado</h3>
              <p className="text-xs text-gray-500 mt-1">
                {statistics.nextHoliday.name}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {dayjs(statistics.nextHoliday.date).format('D [de] MMMM [de] YYYY')}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-sm text-gray-500">En</div>
              <div className="text-3xl font-bold text-red-600">
                {statistics.nextHoliday.daysUntil}
              </div>
              <div className="text-xs text-gray-500">
                {statistics.nextHoliday.daysUntil === 1 ? 'día' : 'días'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-700">
            {statistics.irrenunciableCount}
          </div>
          <div className="text-xs text-gray-500">Irrenunciables</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-700">
            {statistics.religiousCount}
          </div>
          <div className="text-xs text-gray-500">Religiosos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-700">
            {statistics.nationalCount}
          </div>
          <div className="text-xs text-gray-500">Nacionales</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-700">
            {statistics.longWeekendsCount}
          </div>
          <div className="text-xs text-gray-500">Fines de semana largos</div>
        </div>
      </div>
    </div>
  )
}

export default YearStatisticsWidget