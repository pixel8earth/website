import React from 'react';
import { Link } from 'react-router-dom';

import pixel8Logo from '../assets/Logo.svg';
import p8Logo from '../assets/pixel8-logos-02.svg';
import mainStyles from '../styles';

function Logo(props) {
  const home = window.location.pathname === '/';

  if (props.noLink) {
    return (
      <div style={{ ...styles.main, cursor: home ? 'default' : 'pointer', ...props.style }} disabled={home}>
        {props.studio ? (
            <div >
              <div style={styles.fontLogo}>PIXEL8 <span style={{ fontFamily: 'LogoFontMed' }}>STUDIO</span></div>
            </div>
          )
          : <img
              src={props.p8 ? p8Logo : pixel8Logo}
              alt="Pixel8 Logo"
              style={{ ...(props.imgStyle || {}) }}
            />
        }
      </div>
    );
  }

  return (
    <Link to="/" style={{ ...styles.main, cursor: home ? 'default' : 'pointer', marginLeft: '0', ...props.style }} disabled={home}>
      {props.studio ? (
          <div style={{ display: 'flex', alignContent: 'center' }}>
            <div style={styles.fontLogo}>PIXEL8 <span style={{ fontFamily: 'HarmoniaSansW01-Regular, LogoFontMed' }}>STUDIO</span></div>
          </div>
        )
        : <img
            src={props.p8 ? p8Logo : pixel8Logo}
            alt="Pixel8 Logo"
            style={{ ...(props.imgStyle || {}) }}
          />
      }
    </Link>
  );
}

const styles = {
  main: {
    marginTop: '-6px',
    marginBottom: '-6px',
    marginLeft: mainStyles.spacing.normal
  },
  fontLogo: {
    fontFamily: 'LogoFont',
    letterSpacing: '3.5px',
    fontWeight: '500',
    fontSize: '42px',
    background: 'linear-gradient(to right, #5eb6fa, #00c6fc, #00d2e5, #00dab7, #33dd7b, #7bd552, #a9cb2a, #d0bd00, #dfa900, #eb9408, #f37f21, #f76834)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  studio: {
    // background: '-webkit-gradient(linear, left center, right center, from(#e99900), to(#e7413e))',
    color: '#e99900',
    fontFamily: 'LogoFont',
    letterSpacing: '3.5px',
    fontWeight: 'bold',
    fontSize: '42px'
  }
};

export default Logo;
