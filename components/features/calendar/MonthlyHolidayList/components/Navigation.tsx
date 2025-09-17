import React from 'react';
import Link from 'next/link';
import { getNavigationLinks, getMonthName } from '../utils/dateUtils';

interface NavigationProps {
  currentMonth: number;
  year: number;
}

export const Navigation: React.FC<NavigationProps> = ({ currentMonth, year }) => {
  const links = getNavigationLinks(currentMonth, year);
  const prevMonthName = getMonthName(currentMonth - 1 || 12);
  const nextMonthName = getMonthName(currentMonth + 1 > 12 ? 1 : currentMonth + 1);

  return (
    <div className="mt-8 flex justify-center gap-4">
      <Link
        href={links.prev}
        className="rounded-md bg-gray-100 px-4 py-2 capitalize transition-colors hover:bg-gray-200"
      >
        ← {prevMonthName}
      </Link>
      <Link
        href={links.current}
        className="rounded-md bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200"
      >
        {year}
      </Link>
      <Link
        href={links.next}
        className="rounded-md bg-gray-100 px-4 py-2 capitalize transition-colors hover:bg-gray-200"
      >
        {nextMonthName} →
      </Link>
    </div>
  );
};