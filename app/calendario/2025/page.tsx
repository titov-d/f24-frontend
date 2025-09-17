// /app/calendario/2024/page.tsx

import { genPageMetadata } from 'app/seo'

import FeriadosPerdidos from '@/components/FeriadosPerdidos'
import TotalFeriados from '@/components/TotalFeriados'
import FeriadosXL from '@/components/FeriadosXL'
import FeriadosLaborales from '@/components/FeriadosLaborales'
import TotalDiasLibres from '@/components/TotalDiasLibres'
import ProximoFeriado from '@/components/ProximoFeriado'
import MonthlyHolidayList from '@/components/MonthlyHolidayList'
import NextHolidayCountdown from '@/components/NextHolidayCountdown'

const currentYear = 2025

export const metadata = genPageMetadata({ title: 'Feriados ' + currentYear })

export default function Main() {
  return (
    <>
      <h1 className="mt-4 border-none pl-4 text-center text-4xl text-[#686868] lg:ml-0 lg:max-w-5xl xl:m-auto  xl:mt-16 xl:pl-0">
        Feriados {currentYear}
      </h1>

      <div className="fdGrid container mx-auto border-none lg:max-w-5xl xl:m-auto xl:mt-8 xl:pl-0">
        <h2 className="my-12 flex justify-center border-none pl-4 text-center text-2xl text-[#686868]">
          <NextHolidayCountdown />
        </h2>

        <div className="px-10 text-center leading-loose">
          <h2>¡{currentYear}: El Año de las Celebraciones en Chile! 🇨🇱🎉</h2>
          <p>23 feriados, 16 en días laborales, y un mega puente de 5 días en septiembre</p>
        </div>

        <MonthlyHolidayList startMonth={1} endMonth={12} year={currentYear} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* 6 widgets */}
          <div className="flex flex-col md:col-span-12">
            <h2 className="my-4 border-none pl-4 text-2xl text-[#686868] lg:ml-0 xl:pl-0">
              Tu Año {currentYear} en Números
            </h2>
            <ul className="homeWidgets m-2 grid grid-cols-1  gap-2  md:m-0 md:grid-cols-3 md:gap-4">
              <li>
                <TotalFeriados />
              </li>
              <li>
                <FeriadosPerdidos />
              </li>
              <li>
                <FeriadosXL />
              </li>
              <li>
                <FeriadosLaborales />
              </li>
              <li>
                <TotalDiasLibres />
              </li>
              <li>
                <ProximoFeriado />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
