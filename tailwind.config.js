/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.{html,js}",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e3a8a', // Navy blue
          light: '#2d4eaa',
          dark: '#152a66'
        },
        secondary: {
          DEFAULT: '#0d9488', // Teal
          light: '#14b8a6',
          dark: '#0f766e'
        },
        accent: {
          DEFAULT: '#f97316', // Orange
          light: '#fb923c',
          dark: '#ea580c'
        },
        neutral: {
          light: '#f8fafc',
          DEFAULT: '#e2e8f0',
          dark: '#64748b'
        }
      }
    },
  },
  plugins: [],
}