/**
 * Holiday-specific Product Recommendations
 * Wrapper component for different holiday contexts
 * Max 100 lines as per architecture requirements
 */

import React from 'react';
import ProductRecommendations from './ProductRecommendations';

interface HolidayProductsProps {
  holidayType: 'navidad' | 'ano-nuevo' | '18-septiembre' | 'general';
}

// Configuration for different holidays
const holidayConfigs = {
  'navidad': {
    title: 'Productos para Navidad 🎄',
    holiday: 'navidad',
    productTypes: ['regalos navidad', 'decoracion navideña', 'juguetes'],
  },
  'ano-nuevo': {
    title: 'Prepárate para Año Nuevo 🎉',
    holiday: 'año nuevo',
    productTypes: ['fiesta', 'decoracion', 'champagne'],
  },
  '18-septiembre': {
    title: 'Fiestas Patrias 🇨🇱',
    holiday: 'fiestas patrias',
    productTypes: ['parrilla', 'asado', 'bandera chile'],
  },
  'general': {
    title: 'Productos Recomendados',
    holiday: 'feriado',
    productTypes: ['camping', 'viaje', 'recreacion'],
  },
};

export default function HolidayProducts({
  holidayType = 'general',
}: HolidayProductsProps) {
  const config = holidayConfigs[holidayType];

  return (
    <ProductRecommendations
      title={config.title}
      holiday={config.holiday}
      productTypes={config.productTypes}
    />
  );
}

// Export individual holiday components for convenience
export function ChristmasProducts() {
  return <HolidayProducts holidayType="navidad" />;
}

export function NewYearProducts() {
  return <HolidayProducts holidayType="ano-nuevo" />;
}

export function PatrioticProducts() {
  return <HolidayProducts holidayType="18-septiembre" />;
}