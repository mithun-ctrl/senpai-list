/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'spin-reverse': 'spin-reverse 2s linear infinite',
      },
      keyframes: {
        shine: {
          'from': { transform: 'translateX(-100%)' },
          'to': { transform: 'translateX(100%)' }
        },
        'spin-reverse': {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(-360deg)' },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)' }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        slideIn: {
          '0%': { 
            transform: 'translateX(100%)',
            opacity: 0 
          },
          '100%': { 
            transform: 'translateX(0)',
            opacity: 1 
          },
        },
        slideOut: {
          '0%': { 
            transform: 'translateX(0)',
            opacity: 1 
          },
          '100%': { 
            transform: 'translateX(100%)',
            opacity: 0 
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slideIn": "slideIn 0.3s ease-out forwards",
        "slideOut": "slideOut 0.3s ease-in forwards",
        'shine': 'shine 2s infinite',
        'float': 'float 5s infinite ease-in-out'
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}