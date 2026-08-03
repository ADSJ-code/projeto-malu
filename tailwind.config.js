/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        malu: {
          bg: '#f8f5f0',
          darkbg: '#1a1f1c',
          card: '#ffffff',
          darkcard: '#242a27',
          green: {
            light: '#d2dacb',
            DEFAULT: '#526658',
            dark: '#394a3e',
          },
          lilac: {
            DEFAULT: '#9f8db3',
            light: '#e6e1ed',
          },
          text: {
            main: '#2c3531',
            darkmain: '#e8e6e1',
            muted: '#7a857f'
          }
        }
      }
    }
  },
  plugins: [],
}