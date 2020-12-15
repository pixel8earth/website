const mainStyles = {
  font: 'HarmoniaSansW01-Regular, LogoFontMed, Sans-Serif',
  boldFont: 'HarmoniaSansW01-Bold, LogoFont, Sans-Serif',
  spacing: {
    small: '4px',
    normal: '8px',
    medium: '16px',
    medLarge: '24px',
    large: '32px',
    xl: '48px',
    xxl: '64px'
  },
  colors: {
    light: '#f2f4f5',
    lighterGray: '#f7f9fa',//'#f0f0f0',
    lightGray: '#d6d6d6',
    gray: '#636363',
    dark: '#1C2331',
    softDark: '#424242',
    primary: '#000A1D',//'#0d47a1',
    primaryDisabled: 'rgba(13, 71, 161, .75)',
    secondary: '#4285F4',
    secondaryDisabled: 'rbga(66, 134, 244, .75)',
    success: '#2bad00',
    successHover: '#249100',
    error: '#e33d3d',
    errorHover: '#b32e2e',
    warning: '#edb42f',
    default: '#2bbbad',
    darkBaseMap: '#090909',
    gradientBlue: '#278edb', //OLD '#3890d4',
    gradientGreen: '#06d48a', //OLD '#8dc677',
    buttonHover: '#03a977',
    buttonDisabled: 'rgba(31, 72, 81, 0.2)',
    buttonDisabledText: 'rgba(31, 72, 81, 0.24)',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    flexBasis: '100%',
    flex: 1,
    padding: '16px'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width:' 100%',
    alignItems: 'center'
  },
  input: {
    fontFamily: 'HarmoniaSansW01-Regular, LogoFontMed',
    fontStyle: 'normal',
    fontWeight: 'bold',
    lineHeight: '24px',
    fontSize: '16px',
    textTransform: 'inherit',
    borderRadius: '8px',
    margin: '8px',
    padding: '10px 20px',
    backgroundColor: '#fff',
    width: '100%'
  },
  btnXSmall: {
    fontFamily: 'HarmoniaSansW01-Bold',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'inherit',
    borderRadius: '8px',
    padding: '4px 6px',
    margin: '4px',
    cursor: 'pointer',
    color: '#fff',
    backgroundColor: '#06d48a',
    width: 'fit-content',
    boxShadow: 'none',
    filter: 'drop-shadow(0px 0px 16px rgba(1, 87, 56, 0.08))'
  },
  btnXSmallOutline: {
    fontFamily: 'HarmoniaSansW01-Bold',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'inherit',
    border: '1px solid #06d48a',
    backgroundColor: 'transparent',
    color: '#06d48a',
    borderRadius: '8px',
    padding: '3px 6px',
    margin: '4px',
    cursor: 'pointer',
    width: 'fit-content',
    boxShadow: 'none',
    filter: 'drop-shadow(0px 0px 16px rgba(1, 87, 56, 0.08))'
  },
  btnSmall: {
    fontFamily: 'HarmoniaSansW01-Bold',
    fontSize: '14px',
    fontWeight: 'bold',
    textTransform: 'inherit',
    borderRadius: '8px',
    padding: '6px 16px',
    margin: '8px',
    cursor: 'pointer',
    color: '#fff',
    backgroundColor: '#06d48a',
    width: 'fit-content',
    boxShadow: 'none',
    filter: 'drop-shadow(0px 0px 16px rgba(1, 87, 56, 0.08))'
  },
  btnSmallOutline: {
    fontFamily: 'HarmoniaSansW01-Bold',
    fontSize: '14px',
    fontWeight: 'bold',
    textTransform: 'inherit',
    border: '1px solid #06d48a',
    backgroundColor: 'transparent',
    color: '#06d48a',
    borderRadius: '8px',
    padding: '6px 16px',
    margin: '8px',
    cursor: 'pointer',
    width: 'fit-content',
    boxShadow: 'none',
    filter: 'drop-shadow(0px 0px 16px rgba(1, 87, 56, 0.08))'
  },
  btn: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    fontFamily: 'HarmoniaSansW01-Bold',
    fontStyle: 'normal',
    fontWeight: 'bold',
    lineHeight: '24px',
    fontSize: '16px',
    textTransform: 'inherit',
    borderRadius: '8px',
    margin: '8px',
    padding: '10px 20px',
    cursor: 'pointer',
    color: '#fff',
    backgroundColor: '#06d48a',
    width: 'fit-content',
    boxShadow: 'none',
    filter: 'drop-shadow(0px 0px 16px rgba(1, 87, 56, 0.08))'
  },
  btnOutline: {
    display: 'inline-flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    fontFamily: 'HarmoniaSansW01-Bold',
    fontSize: '16px',
    fontWeight: 'bold',
    textTransform: 'inherit',
    border: '1px solid #06d48a',
    backgroundColor: 'transparent',
    color: '#06d48a',
    borderRadius: '8px',
    padding: '9px 19px',
    margin: '8px 12px',
    cursor: 'pointer',
    width: 'fit-content',
    boxShadow: 'none',
    filter: 'drop-shadow(0px 0px 16px rgba(1, 87, 56, 0.08))'
  },
  btnLarge: {
    fontFamily: 'HarmoniaSansW01-Bold',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'inherit',
    padding: '16px',
    margin: '16px',
    cursor: 'pointer',
    borderRadius: '8px',
    color: '#fff',
    backgroundColor: '#06d48a',
    width: 'fit-content',
    boxShadow: 'none',
    filter: 'drop-shadow(0px 0px 16px rgba(1, 87, 56, 0.08))'
  },
  btnLargeOutline: {
    fontFamily: 'HarmoniaSansW01-Bold',
    fontWeight: 'bold',
    fontSize: '12px',
    textTransform: 'inherit',
    border: '1px solid #06d48a',
    backgroundColor: 'transparent',
    color: '#06d48a',
    padding: '15px',
    margin: '16px',
    cursor: 'pointer',
    borderRadius: '8px',
    width: 'fit-content',
    boxShadow: 'none',
    filter: 'drop-shadow(0px 0px 16px rgba(1, 87, 56, 0.08))'
  },
  paragraph: {
    fontWeight: '500',
    fontSize: '20px'
  },
  boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12)',
  gradients: {
    logo: {
      background: 'linear-gradient(89.24deg, #278EDB 0%, #55BDDE 29.46%, #2FDC9D 76.2%, #06D48A 100%)'//'-webkit-gradient(linear, left center, right center, from(#3890d4), to(#8dc677))'
    },
    home: {
      backgroundImage: 'linear-gradient(to right, #3890d4, #009fd7, #00add4, #00bacc, #2cc5c1, #45c9b7, #5bcdad, #71d0a3, #77ce98, #7ecc8d, #85c982, #8dc677)'
    },
    btn: {
      backgroundImage: 'linear-gradient(to right bottom, #322275 0%, #0055a7 30%, #0082bb 50%, #00aab6 70%, #30cfa4 100%)',
    },
    btnHover: {
      backgroundImage: 'linear-gradient(to right bottom, #2d1e69 0%, #004e99 30%, #0079ad 50%, #009da8 70%, #2dc298 100%)',
    },
    btnDisabled: {
      backgroundImage: 'linear-gradient(to right bottom, #584e82 0%, #5182b0 30%, #4a9abd 50%, #60a6ab 70%, #7eccb7 100%)',
    },
    btnInverted: {
      backgroundImage: 'linear-gradient(to left top, #322275 0%, #0055a7 30%, #0082bb 50%, #00aab6 70%, #30cfa4 100%)'
    },
    btnNorth: {
      backgroundImage: 'linear-gradient(to top, #322275 0%, #0055a7 30%, #0082bb 50%, #00aab6 70%, #30cfa4 100%)'
    },
    btnSouth: {
      backgroundImage: 'linear-gradient(to bottom, #322275 0%, #0055a7 30%, #0082bb 50%, #00aab6 70%, #30cfa4 100%)'
    },
    btnEast: {
      backgroundImage: 'linear-gradient(to right, #322275 0%, #0055a7 30%, #0082bb 50%, #00aab6 70%, #30cfa4 100%)'
    },
    btnWest: {
      backgroundImage: 'linear-gradient(to left, #322275 0%, #0055a7 30%, #0082bb 50%, #00aab6 70%, #30cfa4 100%)'
    }
    //background-image: linear-gradient(to right top, #322275, #a7056d, #e7413e, #e99900, #a8eb12);
  }
};

export default mainStyles;
