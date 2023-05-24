/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                "ink-light-grey": "#7B7C7F",
                "ink-medium-grey": "#0F1014",
                "ink-dark-grey": "#0B0C10",
                "ink-white": "#FFFFFF",

                "ink-blue": "#2474E4",
                "ink-light-blue": "$BFD8FB",
                "ink-dark-light-blue": "#778CA9",

                "ink-red": "#E53838",

                "ink-transparent": "transparent",
            },
            fontFamily: {
                "ink-libre": "Libre Baskerville, serif",
                "ink-fira": "Fira Sans, sans-serif",
                "ink-catamaran": "Catamaran, sans-serif",
            },
            letterSpacing: {
                "cfm-0": "0",
                "cfm-1": "0.1em",
                "cfm-2": "0.2em",
                "cfm-3": "0.3em",
                "cfm-4": "0.4em",
            },
            textIndent: {
                "cfm-0": "0",
                "cfm-1": "0.1em",
                "cfm-2": "0.2em",
                "cfm-3": "0.3em",
                "cfm-4": "0.4em",
            },
            fontSize: {
                xxs: "0.7rem",
            },
        },
    },
    plugins: [],
};
