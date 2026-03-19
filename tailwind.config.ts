import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0c0c0c',
          2: '#141414',
          3: '#1c1c1c',
          4: '#242424',
        },
        border: {
          DEFAULT: '#252525',
          2: '#303030',
          3: '#3a3a3a',
        },
        accent: {
          DEFAULT: '#22c55e',
          dim: '#15803d',
          bg: '#052e16',
          2: '#f59e0b',
          2bg: '#1c1000',
          3: '#3b82f6',
          3bg: '#0a1628',
          red: '#ef4444',
          redbg: '#1f0707',
        },
        txt: {
          DEFAULT: '#f0f0f0',
          2: '#999',
          3: '#555',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '10px',
        sm: '6px',
        lg: '14px',
        xl: '20px',
      }
    }
  },
  plugins: [],
}
export default config
