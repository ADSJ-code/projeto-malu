/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Fonte base moderna e limpa
        serif: ['"Playfair Display"', 'Georgia', 'serif'], // Fonte elegante para Títulos (como nas imagens)
      },
      colors: {
        // Paleta "Wellness & Healing" extraída das referências
        malu: {
          bg: '#f8f5f0',       // Fundo Bege/Areia muito suave (Base)
          card: '#ffffff',     // Branco puro para destacar conteúdo
          green: {
            light: '#d2dacb',  // Verde pastoso para fundos de botões/tags
            DEFAULT: '#526658', // Verde Floresta/Sálvia (Exato da referência "Izzy Waite")
            dark: '#394a3e',   // Verde profundo para Hover e Títulos
          },
          lilac: {
            DEFAULT: '#9f8db3', // Toque espiritual do Reiki
            light: '#e6e1ed',
          },
          text: {
            main: '#2c3531',   // Preto carvão, macio de ler
            muted: '#7a857f'   // Texto descritivo mais suave
          }
        }
      }
    },
  },
  plugins: [],
}