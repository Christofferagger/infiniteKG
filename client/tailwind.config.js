/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./components/**/*.tsx', './pages/**/*.tsx'],
  content: [],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Lato', 'sans-serif'],
      },
      colors: {
        'blue-primary': '#00A1FC',
        'white-custom': '#f9f9f9',
      }
    },
  },
  plugins: [],
}

