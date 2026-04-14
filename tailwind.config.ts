import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
    './dictionaries/**/*.{ts,tsx}',
    './types/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.25rem',
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(210 22% 89%)',
        input: 'hsl(210 22% 89%)',
        ring: 'hsl(214 32% 45%)',
        background: 'hsl(45 33% 98%)',
        foreground: 'hsl(215 28% 18%)',
        primary: {
          DEFAULT: 'hsl(214 35% 24%)',
          foreground: 'hsl(42 33% 98%)',
        },
        secondary: {
          DEFAULT: 'hsl(200 22% 93%)',
          foreground: 'hsl(214 35% 24%)',
        },
        muted: {
          DEFAULT: 'hsl(210 22% 95%)',
          foreground: 'hsl(215 16% 42%)',
        },
        accent: {
          DEFAULT: 'hsl(28 34% 89%)',
          foreground: 'hsl(214 35% 24%)',
        },
        card: {
          DEFAULT: 'hsla(0, 0%, 100%, 0.8)',
          foreground: 'hsl(215 28% 18%)',
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 10px 40px rgba(15, 23, 42, 0.08)',
        glow: '0 20px 80px rgba(59, 130, 246, 0.12)',
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle at top, rgba(164, 188, 212, 0.24), transparent 40%), radial-gradient(circle at bottom right, rgba(219, 203, 184, 0.22), transparent 32%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
