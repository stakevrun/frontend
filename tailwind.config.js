/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // typography: ({ theme }) => ({
      //   // optionally add color theme here
      // }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

