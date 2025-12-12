import LongWeekendsTimeline from '@/components/LongWeekendsTimeline/LongWeekendsTimeline'
import HolidayHeroImage from '@/components/HolidayHeroImage'
import HolidayList from '@/components/HolidayList/HolidayList'
import TourCard from '@/components/TourCard/TourCard'
import YouTubeRecommendations from '@/components/YouTubeRecommendations/YouTubeRecommendations'
import AmazonPrimeRecommendation from '@/components/AmazonPrimeRecommendation/AmazonPrimeRecommendation'
import ProductRecommendations from '@/components/ProductRecommendations/ProductRecommendations'
import { ProductsProvider } from '@/components/RecommendationsSection/ProductsContext'
import LatestPostWidget from '@/components/LatestPostWidget/LatestPostWidget'
import FeriadosPerdidos from '@/components/FeriadosPerdidos'
import TotalFeriados from '@/components/TotalFeriados'
import FeriadosXL from '@/components/FeriadosXL'
import FeriadosLaborales from '@/components/FeriadosLaborales'
import TotalDiasLibres from '@/components/TotalDiasLibres'
import ProximoFeriado from '@/components/ProximoFeriado'

interface MainProps {
  posts: Array<{
    slug: string;
    date: string;
    title: string;
    summary?: string;
    tags?: string[];
  }>;
}

export default function Main({ posts: _posts }: MainProps) {
  return (
    <>
      <div className="divide-y divide-gray-200">
        <HolidayHeroImage />

        <HolidayList />

        {/* TODO: Re-enable when product cards are ready
        <HolidayProductCards />
        */}

        <h2 className="mt-4 border-none pl-4 text-2xl text-[#686868] lg:ml-0 lg:max-w-5xl xl:m-auto xl:mt-8 xl:max-w-7xl xl:pl-0">
          Ofertas Destacadas
        </h2>
        <ProductsProvider>
          <section className="recomendaciones m-auto max-w-7xl border-none px-4 pt-4 lg:px-0">
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-12 lg:gap-3">
              <div className="col-span-1 lg:col-span-3">
                <TourCard />
              </div>
              <div className="col-span-1 lg:col-span-3">
                <YouTubeRecommendations />
              </div>
              <div className="col-span-1 lg:col-span-2">
                <AmazonPrimeRecommendation />
              </div>
              <div className="col-span-1 lg:col-span-4">
                <ProductRecommendations />
              </div>
            </div>
          </section>
        </ProductsProvider>

        <div className="fdGrid container mx-auto border-none lg:max-w-5xl xl:m-auto xl:mt-8 xl:max-w-7xl xl:pl-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            {/* Noticia */}
            <div className="flex flex-col md:col-span-4">
              <h2 className="my-4 border-none pl-4 text-2xl text-[#686868] lg:ml-0 xl:pl-0">
                Crónica de Fiestas
              </h2>
              <div className="m-2 flex h-full items-center justify-center rounded-lg bg-gradient-to-br from-[#F3F2F5] to-[#EEEEEE] md:m-0">
                <LatestPostWidget />
              </div>
            </div>

            {/* 6 widgets */}
            <div className="flex flex-col md:col-span-8">
              <h2 className="my-4 border-none pl-4 text-2xl text-[#686868] lg:ml-0 xl:pl-0">
                Tu Año {new Date().getFullYear() + 1} en Números
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
