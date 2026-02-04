/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a5f',
        accent: '#c6a87c',
        background: '#fdfbf7',
      },
      fontFamily: {
        sans: ['system-ui', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(30, 58, 95, 0.08)',
        'card': '0 4px 20px rgba(30, 58, 95, 0.1)',
        'card-hover': '0 8px 28px rgba(30, 58, 95, 0.14)',
        'nav': '0 2px 10px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      transitionDuration: {
        250: '250ms',
        350: '350ms',
      },
      animation: {
        'toast-in': 'toastIn 0.35s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        toastIn: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
