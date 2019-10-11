/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  theme: {
    container: {
      center: true,
      padding: '2rem'
    },
    zIndex: {
      '9999': 9999
    }
  },
  variants: [
    'responsive',
    'group-hover',
    'focus-within',
    'hover',
    'focus',
    'active'
  ],
  plugins: [
    function({ addComponents }) {
      const arrows = {
        '.arrow-up': {
          width: '0px',
          height: '0px',
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderBottom: '5px solid black'
        },

        '.arrow-down': {
          width: '0',
          height: '0',
          borderLeft: '20px solid transparent',
          borderRight: '20px solid transparent',
          borderTop: '20px solid #f00'
        },

        '.arrow-right': {
          width: '0',
          height: '0',
          borderTop: '60px solid transparent',
          borderBottom: '60px solid transparent',
          borderLeft: '60px solid green'
        },

        '.arrow-left': {
          width: '0',
          height: '0',
          borderTop: '10px solid transparent',
          borderBottom: '10px solid transparent',
          borderRight: '10px solid blue'
        }
      }
      addComponents(arrows)
    }
  ]
}
