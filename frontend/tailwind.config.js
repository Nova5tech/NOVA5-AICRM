/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        skybg: {
          50: '#F0F9FF',
          100: '#E0F2FE', // Light Ice Blue Main BG
          200: '#BAE6FD',
          300: '#7DD3FC',
          500: '#0EA5E9',
          600: '#0284C7',
          900: '#0C4A6E',
        },
        brand: {
          500: '#3B82F6', // Electric Royal Blue
          600: '#2563EB',
          700: '#1D4ED8',
        },
        indigo: {
          500: '#6366F1',
          600: '#4F46E5',
        },
        cyan: {
          500: '#06B6D4',
        },
        emerald: {
          500: '#10B981',
          600: '#059669',
        },
        purple: {
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        rose: {
          500: '#F43F5E',
        }
      },
      backdropBlur: {
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        'sky-glass': '0 8px 32px 0 rgba(14, 165, 233, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.7)',
        'sky-glass-hover': '0 12px 40px 0 rgba(14, 165, 233, 0.22), inset 0 0 0 1px rgba(255, 255, 255, 0.9)',
        'sky-glow': '0 0 20px -3px rgba(14, 165, 233, 0.4)',
      },
      backgroundImage: {
        'sky-page-bg': 'linear-gradient(135deg, #E0F2FE 0%, #EFF6FF 50%, #F0F9FF 100%)',
        'sky-glass-card': 'linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(240, 249, 255, 0.6) 100%)',
        'sky-glass-active': 'linear-gradient(135deg, rgba(14, 165, 233, 0.18) 0%, rgba(99, 102, 241, 0.12) 100%)',
        'vibrant-sky-gradient': 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 50%, #7C3AED 100%)',
      }
    },
  },
  plugins: [],
}
