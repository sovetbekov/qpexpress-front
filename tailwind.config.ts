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

      "gray-50": "#f9fafb",
      "gray-100": "#f3f4f6",
      "gray-200": "#e5e7eb",
      "gray-300": "#d1d5db",
      "gray-400": "#9ca3af",
      "gray-500": "#6b7280",
      "gray-600": "#4b5563",
      "gray-700": "#374151",
      "gray-800": "#1f2937",
      "gray-900": "#111827",

      "blue-50": "#EFF6FF",
      "blue-100": "#DBEAFE",
      "blue-200": "#BFDBFE",
      "blue-300": "#93C5FD",
      "blue-400": "#60A5FA",
      "blue-500": "#3B82F6",
      "blue-600": "#2563EB",
      "blue-700": "#1D4ED8",
      "blue-800": "#1E40AF",
      "blue-900": "#1E3A8A",

      "red-50": "#ffedee",
      "red-100": "#f7cac9",
      "red-200": "##f59e92",
      "red-300": "#f46e52",
      "red-400": "#e42424",
      "red-500": "#dc2626",
      "red-600": "#b91c1c",
      "red-700": "#991b1b",
      "red-800": "#7f1d1d",
      "red-900": "#631717"
    },
    fontFamily: {
      'black': ['var(--font-ariblk)', 'Arial', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [],
}