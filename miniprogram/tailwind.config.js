/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,vue}"],
  theme: {
    container: {
      center: true,
    },
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}