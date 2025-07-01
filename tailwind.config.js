/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/*.{js,ts,jsx,tsx}",
    "./src/components/sidebar/*.tsx",

  ],
  theme: {
    extend: {
      colors: {
        primary: '#165DFF',
        secondary: '#7B61FF',
        dark: '#1E1E2E',
        darker: '#1A1A2E',
        light: '#F5F5F7',
      },
      backgroundColor: {
        'button-bg': '#f0f0f0', // 浅灰色按钮背景色
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}