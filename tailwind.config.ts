import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#C8102E',
          dark: '#0F0F0F',
          steel: '#2A2A2A',
          gold: '#D4A017',
          blue: '#1A3A6B',
          'blue-light': '#2563EB',
        },
      },
      fontFamily: {
        heading: ['var(--font-russo)', 'sans-serif'],
        body: ['var(--font-ibm-plex)', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0px',
      },
    },
  },
  plugins: [],
}

export default config
