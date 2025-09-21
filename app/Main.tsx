import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'

import LongWeekendsTimeline from '@/components/LongWeekendsTimeline/LongWeekendsTimeline'
import HolidayHeroImage from '@/components/HolidayHeroImage'
import HolidayList from '@/components/HolidayList/HolidayList'

import TourCard from '@/components/TourCard/TourCard'
import YouTubeRecommendations from '@/components/YouTubeRecommendations/YouTubeRecommendations'
import AmazonPrimeRecommendation from '@/components/AmazonPrimeRecommendation/AmazonPrimeRecommendation'
// Use the new MercadoLibre-powered component
import ProductRecommendations from '@/components/ProductRecommendations'
import HolidayProductCards from '@/components/HolidayProductCards'

// import LatestPostWidgetContainer from '@/components/LatestPostWidgetContainer' // Removed - contentlayer not used
import FeriadosPerdidos from '@/components/FeriadosPerdidos'
import TotalFeriados from '@/components/TotalFeriados'
import FeriadosXL from '@/components/FeriadosXL'
import FeriadosLaborales from '@/components/FeriadosLaborales'
import TotalDiasLibres from '@/components/TotalDiasLibres'
import ProximoFeriado from '@/components/ProximoFeriado'

const MAX_DISPLAY = 5

interface MainProps {
  posts: Array<{
    slug: string;
    date: string;
    title: string;
    summary?: string;
    tags?: string[];
  }>;
}

export default function Main({ posts }: MainProps) {
  return (
    <>
      <div className="divide-y divide-gray-200">
        <HolidayHeroImage />

        <HolidayList />

        <HolidayProductCards />

        <h2 className="mt-4 border-none pl-4 text-2xl text-[#686868] lg:ml-0 lg:max-w-5xl xl:m-auto xl:mt-8 xl:max-w-7xl xl:pl-0">
          Recomendaciónes
        </h2>
        <section className="recomendaciones m-auto max-w-7xl border-none px-4 pt-4 lg:px-0">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-12 lg:grid-cols-12 lg:gap-3">
            <div className="h-full lg:col-span-3">
              {/* <TourCard /> */}
            </div>
            <div className="h-full lg:col-span-3">
              {/* <YouTubeRecommendations /> */}
            </div>
            <div className="h-full sm:col-span-1 lg:col-span-2">
              {/* <AmazonPrimeRecommendation /> */}
            </div>
            <div className="h-full sm:col-span-1 lg:col-span-4">
              <ProductRecommendations />
            </div>
          </div>
        </section>

        <div className="fdGrid container mx-auto border-none lg:max-w-5xl xl:m-auto xl:mt-8 xl:max-w-7xl xl:pl-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            {/* Noticia */}
            <div className="flex flex-col md:col-span-4">
              <h2 className="my-4 border-none pl-4 text-2xl text-[#686868] lg:ml-0 xl:pl-0">
                Crónica de Fiestas
              </h2>
              <div className="m-2 flex h-full items-center justify-center rounded-lg bg-gradient-to-br from-[#F3F2F5] to-[#EEEEEE] md:m-0">
                {/* <LatestPostWidgetContainer /> */}
              </div>
            </div>

            {/* 6 widgets */}
            <div className="flex flex-col md:col-span-8">
              <h2 className="my-4 border-none pl-4 text-2xl text-[#686868] lg:ml-0 xl:pl-0">
                Tu Año 2024 en Números
              </h2>
              <ul className="homeWidgets m-2 grid grid-cols-1  gap-2  md:m-0 md:grid-cols-3 md:gap-4">
                <li>
                  <TotalFeriados year={2025} />
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

        <LongWeekendsTimeline />
      </div>
    </>
  )
}
