/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': 'var(--color-background)',
        'accent': 'var(--color-accent)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'panel': 'var(--color-panel)',
        'panel-border': 'var(--color-panel-border)',

        // New comic theme colors
        'comic-yellow': '#ffde00',
        'comic-blue': '#004aad',
        'comic-pink': '#ff007a',
        'comic-black': '#000000',
        'comic-white': '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Bangers', 'cursive'],
      },
      boxShadow: {
        'comic': '5px 5px 0px 0px rgba(0,0,0,1)',
        'comic-sm': '3px 3px 0px 0px rgba(0,0,0,1)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'shake': {
          '10%, 90%': { transform: 'translateX(-1px)' },
          '20%, 80%': { transform: 'translateX(2px)' },
          '30%, 50%, 70%': { transform: 'translateX(-4px)' },
          '40%, 60%': { transform: 'translateX(4px)' },
        },
        'pulse-strong': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-in-up': 'slide-in-up 0.5s ease-out forwards',
        'shake': 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
        'pulse-strong': 'pulse-strong 2s ease-in-out infinite',
      },
      dropShadow: {
        'hard': '3px 3px 0 rgba(0, 0, 0, 1)',
      }
    },
  },
  plugins: [],
}