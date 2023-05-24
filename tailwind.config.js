/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                "ink-light-grey": "#1B1E25",
                "ink-medium-grey": "#0F1014",
                "ink-dark-grey": "#0B0C10",
                "ink-white": "#FFFFFF",

                "ink-blue": "#2474E4",
                "ink-light-blue": "$BFD8FB",
                "ink-dark-light-blue": "#778CA9",

                "ink-transparent": "transparent",
            },
            fontFamily: {
                "ink-libre": "Libre Baskerville, serif",
                "ink-fira": "Fira Sans, sans-serif",
                "ink-catamaran": "Catamaran, sans-serif",
            },
        },
    },
    plugins: [],
};
