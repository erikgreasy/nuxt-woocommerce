const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
    theme: {
        extend: {
            container: {
                center: true,
                padding: '1rem',
                screens: {
                    '2xl': '1140px',
                }
            },
            colors: {
                primary: '#4F46E5'
            },
            fontFamily: {
                sans: ['Inter']
            }
        }
    },
    plugins: [
        require('@tailwindcss/forms'),
    ]
}