// tailwind.config.js

module.exports = {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}', // Đảm bảo Tailwind tìm kiếm tất cả các file trong thư mục src
    ],
    theme: {
        listStyleType: {
            square: 'square',
        },
        extend: {
            fontFamily: {
                main: ['Poppins', 'sans-serif'], // Sử dụng font Poppins
            },
            width: {
                main: '1220px',
            },
            backgroundColor: {
                main: '#ee3131',
            },
            colors: {
                main: '#ee3131',
                transparent: 'rgba(0, 0, 0, 0.5)',
                transparent1: 'rgba(0, 0, 0, 0.1)',
            },
            flex: {
                2: '2 2 0%',
                3: '3 3 0%',
                4: '4 4 0%',
                5: '5 5 0%',
                6: '6 6 0%',
                7: '7 7 0%',
                8: '8 8 0%',
            },
            keyframes: {
                'slide-top': {
                    '0%': {
                        '-webkit-transform': 'translateY(40px);',
                        transform: 'translateY(20px);',
                    },
                    '100%': {
                        '-webkit-transform': 'translateY(0);',
                        transform: 'translateY(0);',
                    },
                },
                'slide-top-sm': {
                    '0%': {
                        '-webkit-transform': 'translateY(3px);',
                        transform: 'translateY(3px);',
                    },
                    '100%': {
                        '-webkit-transform': 'translateY(0);',
                        transform: 'translateY(0);',
                    },
                },
                'slide-right': {
                    '0%': {
                        '-webkit-transform': 'translateX(-100px)',
                        transform: 'translateX(-100px)',
                    },
                    '100%': {
                        '-webkit-transform': 'translateX(0)',
                        transform: 'translateX(0)',
                    },
                },
                'slide-fwd-center': {
                    '0%': {
                        '-webkit-transform': 'translateZ(-50px)',
                        transform: 'translateZ(-50px)',
                    },
                    '100%': {
                        '-webkit-transform': 'translateZ(0px)',
                        transform: 'translateZ(0px)',
                    },
                },
            },
            animation: {
                'slide-top': 'slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
                'slide-top-sm': 'slide-top-sm 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
                'slide-right': 'slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
                'slide-fwd-center':
                    'slide-fwd-center 0.8s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
            },
        },
    },
    plugins: [require('@tailwindcss/line-clamp')],
};
