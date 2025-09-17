// Application configuration constants
export const APP_CONFIG = {
  name: 'Feriados24.cl',
  description: 'Portal de feriados chilenos y fines de semana largos',
  url: 'https://www.feriados24.cl',
  api: {
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8001/api/v1',
    timeout: 30000, // 30 seconds
  },
  locale: 'es-CL',
  timezone: 'America/Santiago',
} as const;

// Page size configurations
export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],
} as const;

// Date format patterns
export const DATE_FORMATS = {
  display: 'DD/MM/YYYY',
  displayLong: 'D [de] MMMM [de] YYYY',
  dayMonth: 'D [de] MMMM',
  api: 'YYYY-MM-DD',
  time: 'HH:mm',
  datetime: 'DD/MM/YYYY HH:mm',
} as const;

// Breakpoints for responsive design
export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Animation durations
export const ANIMATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;