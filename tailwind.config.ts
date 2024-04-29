/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      'gray': '#E9EDF4',
      'gray-2': '#EFEFF4',
      'dark-gray': '#CCC',
      'light-gray': '#9FA4BC',
      'white': '#FFFFFF',
      'black': '#000000',
      'blue': '#00A7FF',
      'orange': '#FE5C00',
      'yellow': '#FF9408',
      'transparent': 'transparent',
    },
    fontFamily: {
      'black': ['var(--font-ariblk)', 'Arial', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [],
}