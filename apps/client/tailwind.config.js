module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3300FF",
        },
        dark: {
          DEFAULT: "#0F0F10",
          500: "#1A1A21",
        },
        border: {
          dark: "#2B2B33",
          "dark-active": "#4C4C5E",
          light: "#EFEFF2",
          "light-active": "#EFEFF2",
        },
        danger: {
          DEFAULT: "#FD0E39",
        },
        text: {
          DEFAULT: "#000000",
          300: "#3D3D49",
          200: "#7E7E8B",
          dark: {
            DEFAULT: "#FFFFFF",
            300: "#9E9EA9",
            200: "#646472",
          },
        },
      },
    },
  },
  plugins: [],
};
