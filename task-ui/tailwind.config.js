/** @type {import('tailwindcss').Config} */
module.exports = {
  safelist: [
    "border-red-500",
    "border-green-500",
    "border-blue-500",
    "border-pink-500",
    "border-teal-500",
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-pink-500",
    "bg-teal-500",
    "text-white",
    "text-gray-100",
    "text-gray-200",
    "text-gray-300",
    "text-gray-400",
  ],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontSize: {
        xsm: "12px",
      },
    },
  },
  plugins: [],
};
