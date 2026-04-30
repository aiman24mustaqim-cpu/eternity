// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF7F2',
        champagne: '#E8D5B7',
        gold: { DEFAULT: '#C9A96E', light: '#E2C99A', dark: '#A07840' },
        sage: { DEFAULT: '#8A9E8C', light: '#B5C4B6' },
        blush: '#E8C4B8',
        dusty: '#C4847A',
        charcoal: '#2C2825',
        'warm-gray': '#6B6560',
      },
      fontFamily: {
        cormorant: ['var(--font-cormorant)', 'serif'],
        'dm-sans': ['var(--font-dm-sans)', 'sans-serif'],
        'great-vibes': ['var(--font-great-vibes)', 'cursive'],
      },
    },
  },
  plugins: [],
}