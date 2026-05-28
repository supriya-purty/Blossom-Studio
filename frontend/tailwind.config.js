export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#fff8ed",
        beige: "#eadac7",
        blush: "#f6c6d5",
        lavender: "#d9cef8",
        cocoa: "#7d5a50",
        petal: "#fff1f5"
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 70px rgba(125, 90, 80, 0.16)"
      }
    }
  },
  plugins: []
};
