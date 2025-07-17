/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // azul tecnológico
          dark: '#1e40af',
          light: '#3b82f6',
        },
        secondary: {
          DEFAULT: '#0f172a', // cinza escuro
          light: '#334155',
        },
        accent: {
          DEFAULT: '#06b6d4', // ciano
        },
        background: {
          DEFAULT: '#f8fafc', // fundo claro
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
      },
      boxShadow: {
        card: '0 4px 24px 0 rgba(30, 64, 175, 0.08)',
      },
    },
  },
  plugins: [],
};
