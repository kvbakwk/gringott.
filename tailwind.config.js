/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      roboto: ["Roboto", "sans-serif"],
    },
    extend: {
      screens: {
        sm: "600px",
        md: "905px",
        lg: "1240px",
        xl: "1440px",
      },
      colors: {
        'primary': '#79590C',
        'surface': '#FFF8F3',
        'surface-container': '#F7ECDF',
        'on-surface-variant': '#4E4639'
      },
      fontSize: {
        lg: "57px"
      },
      boxShadow: {
        none: "0px 0px 0px 0px rgba(0, 0, 0, 0.1)",
        xs: "0px 4px 10px 0px rgba(0, 0, 0, 0.1)",
        sm: "0px 4px 20px 0px rgba(0, 0, 0, 0.1)",
        md: "0px 4px 30px 0px rgba(0, 0, 0, 0.1)",
        lg: "0px 4px 40px 0px rgba(0, 0, 0, 0.1)",
        xl: "0px 4px 50px 0px rgba(0, 0, 0, 0.1)",
      },
      borderWidth: {
        0: "0px",
        1: "1px",
        2: "2px",
      },
      transitionProperty: {
        radius: "border-radius",
      },
    },
  },
  plugins: [],
};
