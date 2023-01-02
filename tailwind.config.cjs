const config = {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./index.html"
  ],

  theme: {
    extend: {
        colors: {
          primary: '#1e3a8a', //blue-900
          primary_light: '#FAFAFA', //neutral-50
          neutral_light: '#e5e5e5', // neutral-200
          neutral_dark: '#262626', // neutral-800
          secondary: '#6B21A8', // purple-800
          // primary_medium: '#60A5FA', //blue-400
          gradOne: '#DBEAFE', //blue-100
          gradTwo: '#F3E8FF', //purple-100
        },
    },
    fontFamily: {
      sans: ['Gentium Plus', 'sans'],
      serif: ['Libre Franklin', 'serif']
    }
  },

  plugins: [],
};

module.exports = config;
