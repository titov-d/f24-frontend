import { genPageMetadata } from 'app/seo'
import KanbanCalendar from '@/components/features/calendar/KanbanCalendar'

export const metadata = genPageMetadata({
  title: 'Calendario Feriados Chile 2025',
  description: 'Calendario completo de feriados en Chile 2025. Vista Kanban con todos los días festivos organizados por mes.'
})

export default function CalendarioPage() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-6">
        <div className="mx-auto max-w-screen-2xl">
          <h1 className="text-3xl font-bold text-gray-800">
            Calendario de Feriados {currentYear}
          </h1>
          <p className="mt-2 text-gray-500">
            Visualiza todos los feriados del año en un tablero Kanban
          </p>
        </div>
      </div>

      {/* Year selector */}
      <div className="border-b border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-screen-2xl items-center gap-4">
          <span className="text-sm font-medium text-gray-600">Año:</span>
          <div className="flex gap-2">
            <a
              href="/calendario?year=2024"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              2024
            </a>
            <span className="rounded-lg border-2 border-blue-500 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              {currentYear}
            </span>
            <a
              href="/calendario?year=2026"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              2026
            </a>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="py-6">
        <KanbanCalendar year={currentYear} />
      </div>

      {/* Legend */}
      <div className="border-t border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-gray-600">Leyenda:</span>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                Irrenunciable
              </span>
              <span className="text-xs text-gray-500">Descanso obligatorio</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-600">
                Fin de semana
              </span>
              <span className="text-xs text-gray-500">Cae sábado o domingo</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                Pasado
              </span>
              <span className="text-xs text-gray-500">Ya ocurrió</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded border-2 border-blue-400 bg-blue-50"></div>
              <span className="text-xs text-gray-500">Mes actual</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
