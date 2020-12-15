import React from 'react';

import NavBar from './NavBar';
import Footer from './Footer';
import mainStyles from '../styles';

export default function NavAndFooterWrap(props) {
  return (
    <div style={{ background: 'linear-gradient(180deg, #FAFAFA 25%, #FFFFFF 100%)' }}>
      <NavBar links={['about', 'blog', 'careers']} maxWidth="1440" />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        fontFamily: mainStyles.font,
        maxWidth: '1440px',
        width: '100%',
        marginRight: 'auto',
        marginLeft: 'auto'
      }}>
        {props.children}
      </div>
      <Footer />
    </div>
  );
}
