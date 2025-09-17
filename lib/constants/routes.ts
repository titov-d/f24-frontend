// Application routes
export const ROUTES = {
  home: '/',
  calendar: '/calendario',
  calendarYear: (year: number) => `/calendario/${year}`,
  calendarMonth: (year: number, month: string) => `/calendario/${year}/${month}`,
  widgets: '/test-widgets',
  api: {
    newsletter: '/api/newsletter',
  },
} as const;

// External links
export const EXTERNAL_LINKS = {
  github: 'https://github.com/titov-d/feriados24',
  twitter: 'https://twitter.com/feriados24',
  facebook: 'https://facebook.com/feriados24',
  instagram: 'https://instagram.com/feriados24',
} as const;