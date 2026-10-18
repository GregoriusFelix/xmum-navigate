import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        panel: '#F7F3EA',
        'panel-alt': '#FFFFFF',
        'brand-dark': '#173F35',
        'brand-dark-hover': '#0F2E26',
        accent: '#C4684A',
        'accent-hover': '#AE5739',
        ink: '#111111',
        'ink-soft': '#5F5F5F',
        'ink-muted': '#8A8A8A',
        'on-dark-primary': '#FFFFFF',
        'on-dark-secondary': 'rgba(255,255,255,0.85)',
        'on-accent': '#FFFFFF',
        'partner-logo': '#8C8C84',
        'icon-chip': '#F2EEE6',
        'ghost-icon': '#9A9A9A',
        'footer-overlay': 'rgba(14, 52, 44, 0.85)',
      },
      fontFamily: {
        sans: ['var(--font-primary)', 'Manrope', 'Inter', 'system-ui', 'sans-serif'],
        script: ['var(--font-script)', 'Homemade Apple', 'cursive'],
      },
      borderRadius: {
        panel: '28px',
        hero: '24px',
        card: '20px',
        pill: '9999px',
      },
      boxShadow: {
        panel: '0 20px 60px rgba(0,0,0,0.25)',
        float: '0 12px 32px rgba(0,0,0,0.18)',
        card: '0 8px 24px rgba(0,0,0,0.15)',
        button: '0 4px 12px rgba(0,0,0,0.15)',
      },
      spacing: {
        '18': '72px',
      },
      maxWidth: {
        panel: '1400px',
        search: '920px',
      },
      transitionTimingFunction: {
        ds: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '250ms',
        slow: '500ms',
        carousel: '400ms',
        reveal: '600ms',
      },
      backgroundImage: {
        'hero-scrim':
          'linear-gradient(to right, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 60%)',
        'card-scrim':
          'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 100%)',
        'footer-tint':
          'linear-gradient(to bottom, rgba(10,40,35,0) 0%, rgba(14,52,44,0.85) 100%)',
      },
    },
  },
  plugins: [],
}

export default config
