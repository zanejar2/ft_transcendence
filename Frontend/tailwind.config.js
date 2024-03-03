/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { theme: { fontFamily: { body : ['Poppins', 'sans-serif'], manda : ['Mandali', 'serif'], press : ['Press_Start_2P', 'serif']} } },
  },
  plugins: [],
}