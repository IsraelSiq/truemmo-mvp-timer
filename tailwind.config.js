/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Ragnarok-inspired dark theme palette
        rag: {
          bg:       '#0d0e14',
          surface:  '#13151f',
          surface2: '#1a1d2e',
          border:   '#2a2d42',
          accent:   '#c0392b',   // deep red — MVP danger
          gold:     '#f1c40f',   // loot gold
          blue:     '#2980b9',   // water/ice
          green:    '#27ae60',   // safe / alive
          orange:   '#e67e22',   // warning / window opening
          text:     '#e8e8e8',
          muted:    '#8892a4',
        },
      },
      fontFamily: {
        display: ['"Press Start 2P"', 'monospace'],
        body:    ['"Exo 2"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
