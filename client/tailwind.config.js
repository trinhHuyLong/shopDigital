// tailwind.config.js

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // Đảm bảo Tailwind tìm kiếm tất cả các file trong thư mục src
  ],
  theme: {
    extend: {
      fontFamily: {
        main: ["Poppins", "sans-serif"], // Sử dụng font Poppins
      },
      width: {
        main: '1220px'
      },
      backgroundColor: {
        main: '#ee3131'
      },
      colors: {
        main: '#ee3131'
      },
      keyframes : {
        'slide-top':{
          '0%': {
            '-webkit-transform': 'translateY(40px);',
            'transform': 'translateY(40px);'
          },
          '100%': {
            '-webkit-transform': 'translateY(0);',
            'transform': 'translateY(0);'
          }
        }
      },
      animation: {
        'slide-top': 'slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;'
      },
      
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
