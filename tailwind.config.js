/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                gold: '#d4af37',
                dark: '#0a0a0a',
                accent: '#1a1a1a',
            },
        },
    },
    plugins: [],
}
