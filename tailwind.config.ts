import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
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
        // Semantic theme tokens (backed by CSS custom properties)
        'bg-page':    'rgb(var(--bg-page) / <alpha-value>)',
        'bg-card':    'rgb(var(--bg-card) / <alpha-value>)',
        'bg-muted':   'rgb(var(--bg-muted) / <alpha-value>)',
        'ui-border':  'rgb(var(--ui-border) / <alpha-value>)',
        'text-base':  'rgb(var(--text-base) / <alpha-value>)',
        'text-dim':   'rgb(var(--text-dim) / <alpha-value>)',
        'text-ghost': 'rgb(var(--text-ghost) / <alpha-value>)',
      },
      fontFamily: {
        heading: ['var(--font-russo)', 'sans-serif'],
        body: ['var(--font-ibm-plex)', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
      },
      borderColor: {
        DEFAULT: 'rgb(var(--ui-border) / <alpha-value>)',
      },
      borderRadius: {
        DEFAULT: '0px',
      },
    },
  },
  plugins: [],
}

export default config
