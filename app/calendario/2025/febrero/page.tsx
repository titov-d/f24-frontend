// /app/calendario/2024/page.tsx

import { genPageMetadata } from 'app/seo'

import YearStatisticsWidget from '@/components/YearStatisticsWidget'
import MonthlyHolidayList from '@/components/MonthlyHolidayList'
import NextHolidayCountdown from '@/components/NextHolidayCountdown'

const currentYear = 2025
const currentMes = 'febrero'

export const metadata = genPageMetadata({ title: 'Feriado' + ' ' + currentMes + ' ' + currentYear })

export default function Main() {
  return (
    <>
      <h1 className="mt-4 border-none pl-4 text-center text-4xl text-[#686868] lg:ml-0 lg:max-w-5xl xl:m-auto  xl:mt-16 xl:pl-0">
        Feriado {currentMes} {currentYear}
      </h1>

      <div className="fdGrid container mx-auto border-none lg:max-w-5xl xl:m-auto xl:mt-8 xl:pl-0">
        <h2 className="my-12 flex justify-center border-none pl-4 text-center text-2xl text-[#686868]">
          <NextHolidayCountdown />
        </h2>

        <MonthlyHolidayList startMonth={2} endMonth={2} year={currentYear} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="flex flex-col md:col-span-12">
            <YearStatisticsWidget year={currentYear} />
          </div>
        </div>
      </div>
    </>
  )
}
