/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(20px) translateX(-10px) rotate(0deg)' },
          '100%': { transform: 'translateY(-20px) translateX(10px) rotate(10deg)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
      animation: {
        float: 'float 20s infinite alternate',
        'float-slow': 'float 25s infinite alternate',
        'fade-in-up': 'fadeInUp 0.6s ease-out both',
        shimmer: 'shimmer 2s linear infinite',
        glow: 'glow 3s ease-in-out infinite',
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.04)',
        'glass-lg': '0 8px 40px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};