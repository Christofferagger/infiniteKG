/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./components/**/*.tsx', './pages/**/*.tsx'],
  content: [],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Lato', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

