/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cyano: {
          50: "#f2fff3",
          100: "#e6ffe7",
          200: "#c9f7cb",
          300: "#9fe8a4",
          400: "#69d06f",
          500: "#41b649",
          600: "#2f9737",
          700: "#24772b",
          800: "#1f5e25",
          900: "#1b4d20"
        }
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #000',
        'brutal-sm': '2px 2px 0px 0px #000',
        'brutal-lg': '6px 6px 0px 0px #000',
        'brutal-xl': '8px 8px 0px 0px #000',
      }
    },
  },
  plugins: [],
}
