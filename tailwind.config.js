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
      }
    },
  },
  plugins: [],
}
