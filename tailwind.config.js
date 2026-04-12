/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0D1216',
          ink: '#16161D',
          'ink-body': '#45454A',
          'ink-muted': '#737377',
          light: '#F5F7F8',
          purple: '#A88EFF', // Canonical Lavender
          teal: '#00C2A3',   // Green Variant 2 (Experimental)
          blue: '#56C6FF',   // Canonical Sky Blue
          orange: '#CE4D35', // Canonical Burnt Orange
          highlight: '#FFDE21', // Intro Highlight Yellow
          white: '#FFFFFF',

          black: '#050508', // Ultra dark

          // Light hover variants for accessibility on dark backgrounds
          'purple-light': '#D6CAFF',
          'teal-light': '#66E0C8',
          'blue-light': '#94DAFF',
          'orange-light': '#FF9A85',


          // Deep Variants
          soundDeep: '#001F1B',
          screensDeep: '#04101A',
          stageDeep: '#1e1433',
          experimentsDeep: '#220806',
        }
      },
      borderRadius: {
        'theme-sm': '7px',
        'theme-md': '14px',
      },
      fontFamily: {
        sans: ['"Public Sans"', 'sans-serif'], // Sets Public Sans as default body font
        outfit: ['Outfit', 'sans-serif'],
        public: ['"Public Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
