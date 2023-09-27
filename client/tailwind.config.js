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
        'black-primary': '#212121',
        'blue-primary': '#00A1FC',
        'white-custom': '#f9f9f9',
        'border-purple': '#BA7CFF',
        'border-blue': '#3AD0FF'
      },
      borderWidth: {
        '1.5': '1.5px',
      }
    },
  },
  plugins: [],
}

