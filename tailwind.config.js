export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#2D0A54',
          DEFAULT: '#6A1B9A',
          light: '#E040FB',
        },
        accent: {
          teal: '#26A69A',
          coral: '#FF6B6B',
        },
        lavender: '#E0B0FF',
      },
      animation: {
        'bounce-in': 'bounce-in 0.5s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'ripple': 'ripple 1s ease-out',
        'slide-right': 'slide-right 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
};