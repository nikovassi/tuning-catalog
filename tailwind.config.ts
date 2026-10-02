import type { Config } from 'tailwindcss';

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    container: { center: true, padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' }, screens: { '2xl': '1360px' } },
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        'surface-2': token('surface-2'),
        line: token('line'),
        'line-strong': token('line-strong'),
        fg: token('fg'),
        muted: token('muted'),
        subtle: token('subtle'),
        accent: token('accent'),
        'accent-fg': token('accent-fg'),
        'accent-text': token('accent-text'),
        inverse: token('inverse'),
        'inverse-fg': token('inverse-fg'),
        success: token('success'),
        danger: token('danger'),
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Inter Tight Variable"', '"Inter Variable"', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      borderRadius: { xl: '0.875rem', '2xl': '1.125rem' },
      boxShadow: {
        card: '0 1px 2px rgb(var(--shadow) / 0.06), 0 1px 1px rgb(var(--shadow) / 0.04)',
        lift: '0 12px 32px -12px rgb(var(--shadow) / 0.22), 0 2px 6px -2px rgb(var(--shadow) / 0.08)',
        pop: '0 24px 60px -20px rgb(var(--shadow) / 0.35)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'fade-up': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'none' } },
        'slide-in-right': { from: { transform: 'translateX(100%)' }, to: { transform: 'none' } },
        'slide-in-left': { from: { transform: 'translateX(-100%)' }, to: { transform: 'none' } },
        'scale-in': { from: { opacity: '0', transform: 'scale(.97)' }, to: { opacity: '1', transform: 'none' } },
      },
      animation: {
        'fade-in': 'fade-in .2s ease-out both',
        'fade-up': 'fade-up .45s cubic-bezier(.2,.7,.2,1) both',
        'slide-in-right': 'slide-in-right .28s cubic-bezier(.2,.7,.2,1) both',
        'slide-in-left': 'slide-in-left .28s cubic-bezier(.2,.7,.2,1) both',
        'scale-in': 'scale-in .18s ease-out both',
      },
    },
  },
  plugins: [],
} satisfies Config;
