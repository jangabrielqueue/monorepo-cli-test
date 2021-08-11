import { createUseStyles } from 'react-jss'

const GlobalStyles = createUseStyles({
  '@global': {
    '@font-face': [
      {
        fontFamily: 'ProductSansRegular',
        src: 'url(/fonts/ProductSans-Regular.ttf) format("truetype")',
        fontDisplay: 'swap'
      },
      {
        fontFamily: 'ProductSansBold',
        src: 'url(/fonts/ProductSans-Bold.ttf) format("truetype")',
        fontDisplay: 'swap'
      },
      {
        fontFamily: 'ProductSansMedium',
        src: 'url(/fonts/ProductSans-Medium-500.ttf) format("truetype")',
        fontDisplay: 'swap'
      }
    ],

    html: {
      lineHeight: 1.25,
      height: '100%'
    },

    body: {
      backgroundColor: '#ffffff',
      color: '#767676',
      fontFamily: 'ProductSansRegular',
      fontSize: '16px',
      height: '100%',
      margin: 0
    },

    'input:-webkit-autofill': {
      '-webkit-box-shadow': '0 0 0 30px white inset !important',

      '&:hover': {
        '-webkit-box-shadow': '0 0 0 30px white inset !important'
      },
      '&:focus': {
        '-webkit-box-shadow': '0 0 0 30px white inset !important'
      },
      '&:active': {
        '-webkit-box-shadow': '0 0 0 30px white inset !important'
      }
    },

    '#root': {
      height: '100%'
    },

    'input[type=text]': {
      borderBottom: '1px solid #ccc',
      borderLeft: 0,
      borderRight: 0,
      borderTop: 0,
      color: 'rgba(0, 0, 0, 0.65) !important',
      fontSize: '16px',
      height: '40px',
      width: '100%',

      '&:focus': {
        outline: 'none'
      }
    },
    'input[type=number]': {
      borderBottom: '1px solid #ccc',
      borderLeft: 0,
      borderRight: 0,
      borderTop: 0,
      color: 'rgba(0, 0, 0, 0.65) !important',
      fontSize: '16px',
      height: '40px',
      width: '100%',
      '-moz-appearance': 'textfield',

      '&:focus': {
        outline: 'none'
      }
    },
    'input[type=password]': {
      borderBottom: '1px solid #ccc',
      borderLeft: 0,
      borderRight: 0,
      borderTop: 0,
      color: 'rgba(0, 0, 0, 0.65) !important',
      fontSize: '16px',
      height: '40px',
      width: '100%',

      '&:focus': {
        outline: 'none'
      }
    },
    select: {
      borderBottom: '1px solid #ccc',
      borderLeft: 0,
      borderRight: 0,
      borderTop: 0,
      color: 'rgba(0, 0, 0, 0.65)',
      fontSize: '16px',
      height: '40px',
      width: '100%',

      '&:focus': {
        fontSize: '16px',
        outline: 'none'
      }
    },

    button: {
      outline: 'none'
    },

    'input::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    },
    'input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    },

    label: {
      fontSize: '14px'
    },

    '.input-errors': {
      color: '#f5222d',
      fontSize: '14px',
      height: '21px',
      margin: '2px 0 0'
    },

    '.loading::after': {
      border: '.1rem solid #767676',
      borderRightColor: 'transparent',
      borderTopColor: 'transparent'
    },

    '@keyframes zoomInAndOut': {
      '0%': {
        transform: 'scale(1, 1)'
      },
      '50%': {
        transform: 'scale(1.2, 1.2)'
      },
      '100%': {
        transform: 'scale(1, 1)'
      }
    },

    '@keyframes fadeIn': {
      from: { opacity: 0 },
      to: { opacity: 1 }
    }
  }
})

export default GlobalStyles
