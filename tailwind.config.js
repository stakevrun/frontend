/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        vrun: {
          1: "#e3ffff",
          2: "#99f5fd",
          3: "#44b9ec",
          4: "#37a7dc",
          5: "#175d8e",
          6: "#095386",
          7: "#283d4a",
          8: "#0b2032",
          9: "#031523",
          neutral: {
            1: "#fefefc",
            2: "#f8f5e9",
            3: "#f8f5e9",
          }
        }
      },
      typography(theme) {
        return {
          dark: {
            css: {
              color: theme("colors.slate.400"),
              opacity: 0.9,
              fontWeight: 100,
              '[class~="lead"]': { color: theme("colors.slate.400") },
              a: { color: theme("colors.slate.300") },
              strong: { color: theme("colors.slate.100") },
              "ul > li::before": { backgroundColor: theme("colors.slate.700") },
              "ol >li::marker": { color: theme("colors.slate.300") },
              hr: { borderColor: theme("colors.slate.800") },
              blockquote: {
                color: theme("colors.slate.300"),
                borderLeftColor: theme("colors.slate.800"),
              },
              h1: { color: theme("colors.slate.200") },
              h2: { color: theme("colors.slate.100") },
              h3: { color: theme("colors.slate.100") },
              h4: { color: theme("colors.slate.100") },
            }
          }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

