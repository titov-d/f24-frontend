export interface Holiday {
  id: string;
  date: string;
  name: string;
  description: string;
  type: HolidayType;
  irrenunciable: boolean;
  legal_basis?: string;
  beneficiaries?: string;
  hero_image_url?: string;
}

export enum HolidayType {
  NACIONAL = 'nacional',
  RELIGIOSO = 'religioso',
  CIVIL = 'civil',
  REGIONAL = 'regional',
}

export interface LongWeekend {
  id: string;
  start_date: string;
  end_date: string;
  days_count: number;
  holidays: Holiday[];
}

export interface HolidayStatistics {
  total_holidays: number;
  total_long_weekends: number;
  lost_holidays: number; // Holidays that fall on weekends
  working_days: number;
  vacation_days: number;
}