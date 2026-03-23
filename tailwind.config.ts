import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        base: 'var(--color-base)',
        panel: 'var(--color-panel)',
        panelStrong: 'var(--color-panel-strong)',
        line: 'var(--color-line)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        accent: {
          purple: 'var(--color-accent-purple)',
          blue: 'var(--color-accent-blue)',
          pink: 'var(--color-accent-pink)',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(130, 87, 230, 0.22), 0 20px 60px rgba(49, 130, 246, 0.16)',
        panel: '0 18px 40px rgba(4, 10, 24, 0.45)',
      },
      backgroundImage: {
        'hero-grid': 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
        'panel-sheen': 'linear-gradient(135deg, rgba(129, 140, 248, 0.18), rgba(59, 130, 246, 0.08) 45%, rgba(236, 72, 153, 0.12))',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      maxWidth: {
        '8xl': '90rem',
      },
      letterSpacing: {
        techno: '0.18em',
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        pulseSoft: 'pulseSoft 4s ease-in-out infinite',
        sweep: 'sweep 6s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '0.95' },
        },
        sweep: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(120%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
