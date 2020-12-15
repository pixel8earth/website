import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import Login from '../components/Login';
import Logo from './Logo';
import mainStyles from '../styles';
import { api } from '../front_config';


function NavBar(props) {
  let styles = {
    wrap: {
      backgroundColor: '#fff'
    },
    main: {
      ...mainStyles.row,
      justifyContent: 'space-between',
      alignContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      color: mainStyles.colors.primary,
      fontFamily: mainStyles.font,
      zIndex: 500,
      position: 'relative',
      minHeight: '68px',
      padding: props.studio ? '0 12px' : '12px 64px'
    },
    borderedMain: {
      borderBottom: `1px solid ${mainStyles.colors.lightGray}`
    },
    tagLine: {
      textAlign: 'center',
      color: mainStyles.colors.lightGray,
      fontSize: '1.2em'
    },
    link: {
      margin: '0 5.55%',
      color: '#3f3f3f',
      fontSize: '18px',
      lineHeight: '24px'
    }
  };

  if (props.maxWidth && props.maxWidth === '1440') {
    styles.main.maxWidth = '1440px';
    styles.main.margin = '0 auto';
  }

  if (props.dark) {
    styles.main.backgroundColor = mainStyles.colors.softDark;
    styles.main.color = mainStyles.colors.light;
    styles.borderedMain.borderColor = mainStyles.colors.darkBaseMap;
    styles.tagLine.color= mainStyles.colors.gray;
  }

  return (
    <div style={styles.wrap}>
      <div style={(props.border && !props.progressBorder)
        ? { ...styles.main, ...styles.borderedMain, ...props.style }
        : { ...styles.main, ...props.style }
      }>
        <Logo
          imgStyle={{
            height: '56px',
            position: 'relative',
            ...props.logoStyle
          }}
          studio={props.studio}
        />
        {props.links && props.links.indexOf('about') > -1 &&
          <Link
            to="/about_us"
            style={styles.link}
            className={window.location.pathname === '/about_us' ? 'is-active' : ''}
          >
            About Us
          </Link>
        }
        {props.links && props.links.indexOf('blog') > -1 &&
          <a
            href="https://medium.com/@pixel8earth"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            Blog
          </a>
        }
        {props.links && props.links.indexOf('careers') > -1 &&
          <Link
            to="/careers"
            style={styles.link}
            className={~window.location.pathname.indexOf('/careers') ? 'is-active' : ''}
          >
            Careers
          </Link>
        }
        <div>
          <Login loginStyle={{ marginRight: '32px', fontSize: '20px', lineHeight: '24px' }} dark={props.dark} />
          <div
            className="btnP8"
            style={{ fontSize: '20px', lineHeight: '24px', color: props.dark ? mainStyles.colors.softDark : '#fff' }}
            onClick={() => window.location = `${api.replace('/api/v1', '')}/#signup`}
          >
            Wait List
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(NavBar);
