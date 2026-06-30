/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10B981',
        'primary-dark': '#059669',
        secondary: '#F59E0B',
        accent: '#EF4444',
        'dark-bg': '#0F172A',
        'dark-card': '#1E293B',
        'dark-border': '#334155',
      },
      fontFamily: {
        alexandria: ['Alexandria', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        herfa: {
          primary: '#10B981',
          'primary-content': '#FFFFFF',
          secondary: '#F59E0B',
          accent: '#EF4444',
          neutral: '#1E293B',
          'base-100': '#FFFFFF',
          'base-200': '#F8FAFC',
          'base-300': '#E2E8F0',
          info: '#3B82F6',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
        },
      },
    ],
  },
}
