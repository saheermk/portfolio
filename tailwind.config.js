/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        offwhite: '#f2f2f2',
        blackbg: '#0a0a0a',
        accent: '#FF4D00',
        card: '#1a1a1a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        display: ['Impact', 'sans-serif'], // For the massive headers (A-chen style)
        serif: ['"Playfair Display"', 'serif'], // Maielamin style
        cormorant: ['"Cormorant Garamond"', 'serif'],
        italiana: ['Italiana', 'serif'],
        geist: ['Geist', 'sans-serif'],
        kode: ['KodeMono', 'monospace'],
      },
      gridTemplateColumns: {
        'bento': 'repeat(auto-fit, minmax(300px, 1fr))',
      }
    },
  },
  plugins: [],
}
