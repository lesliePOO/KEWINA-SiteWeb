/** Tokens du design system KEWINA — « Lumière sur l'étoffe ». */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        noir: '#0b0b0b',
        brun: '#241510',
        bronze: '#c9943a',
        'or-lumiere': '#e6b36a',
        terracotta: '#b66a3c',
        'terracotta-encre': '#8f4a26',
        carmin: '#8a2a1f',
        creme: '#f5efe5',
        'blanc-casse': '#fffcf7',
        'encre-douce': '#6e5b4d',
        sable: '#b8ac9c',
        ligne: '#e3d8c8',
        'bord-controle': '#9a8574',
        'ligne-nuit': '#3a2a20',
        dispo: '#3d5a3a',
        'stock-faible': '#8a5a12',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Cormorant', 'Georgia', 'serif'],
        ui: ['Jost', 'Futura', '"Century Gothic"', 'sans-serif'],
      },
      letterSpacing: {
        surtitre: '0.24em',
        bouton: '0.18em',
        label: '0.14em',
      },
      transitionTimingFunction: {
        etoffe: 'cubic-bezier(0.22, 1, 0.36, 1)',
        rideau: 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
      transitionDuration: {
        rapide: '180ms',
        base: '320ms',
        lente: '640ms',
        scene: '1200ms',
      },
      keyframes: {
        apparition: {
          '0%': { opacity: '0', transform: 'translateY(16px)', clipPath: 'inset(0 0 100% 0)' },
          '100%': { opacity: '1', transform: 'none', clipPath: 'inset(0 0 0 0)' },
        },
      },
      animation: {
        apparition: 'apparition 900ms cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      boxShadow: {
        voile: '0 24px 60px rgba(11, 11, 11, 0.16)',
      },
    },
  },
  plugins: [],
};
