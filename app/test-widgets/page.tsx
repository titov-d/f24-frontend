'use client'
import React from 'react'
import ProximoFeriado from '@/components/ProximoFeriado'
import FeriadosXL from '@/components/FeriadosXL'
import TotalDiasLibres from '@/components/TotalDiasLibres'
import FeriadosLaborales from '@/components/FeriadosLaborales'
import FeriadosPerdidos from '@/components/FeriadosPerdidos'

export default function TestWidgets() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Widget Test Page</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Próximo Feriado</h2>
          <ProximoFeriado />
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Feriados XL</h2>
          <FeriadosXL />
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Total Días Libres</h2>
          <TotalDiasLibres />
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Feriados Laborales</h2>
          <FeriadosLaborales />
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Feriados Perdidos</h2>
          <FeriadosPerdidos />
        </div>
      </div>
    </div>
  )
}