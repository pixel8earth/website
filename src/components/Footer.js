import React from 'react';
import { Link } from 'react-router-dom';
import { MDBIcon, MDBFooter, MDBContainer, MDBRow } from "mdbreact";

import Logo from './Logo';
import mainStyles from '../styles';


class Footer extends React.Component {

  componentDidMount() {
    window.addEventListener('popstate', this.setHash, false);
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.setHash);
  }

  setHash = () => {
    this.forceUpdate();
  }
  
  render() {
    const props = this.props;

    return (
      <MDBFooter style={{ ...styles.main, ...(props.style || {}) }}>
        <MDBContainer className=".container-fluid" style={{ ...styles.container, maxWidth: props.fullWidth ? '100%' : '1440px' }}>
          <MDBRow className="footerRow" style={{ padding: '0 64px' }}>
            <Logo
              imgStyle={{
                height: '56px',
                margin: '10px 0',
              }}
              studio={props.studio}
            />
            <div className="footerLinks">
              <Link
                to="/terms"
                style={styles.link}
                className={`footerLinkMargin${window.location.hash === '#/terms' ? ' is-active': ''}`}
              >Terms of Use</Link>
              <Link
                to="/privacy"
                style={styles.link}
                className={`${window.location.hash === '#/privacy' ? ' is-active': ''}`}
              >Privacy Policy</Link>
            </div>
            <div className="footerSocial">
              <a
                href="https://twitter.com/pixel8earth"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.anchor}
              >
                <MDBIcon fab icon="twitter" style={styles.socialIcons} className="footerSocialIcon1" size="lg" />
              </a>
              <a
                href="https://medium.com/@pixel8earth"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.anchor}
              >
                <MDBIcon fab icon="medium-m" style={styles.socialIcons} className="footerSocialIcon2" size="lg" />
              </a>
            </div>
          </MDBRow>
        </MDBContainer>
      </MDBFooter>
    );
  }
}

const styles = {
  main: {
    backgroundColor: '#fff',
    color: '#3f3f3f',
    display: 'flex',
    fontFamily: mainStyles.font,
    fontSize: '18px',
    lineHeight: '24px',
    alignItems: 'center',
    filter: 'drop-shadow(0px -20px 20px rgba(227, 227, 227, 0.2))',
    zIndex: 2,
    minHeight: '76px',
    justifyContent: 'center'
  },
  container: {
    margin: 0,
    maxWidth: '1440px',
    width: '100%'
  },
  anchor: {
    margin: `0px ${mainStyles.spacing.medium}`
  },
  link: {
    color: '#3f3f3f',
    textDecoration: 'none',
    margin: '16px 12px'
  },
  start: {
    display: 'flex',
    justifyContent: 'flex-start'
  },
  end: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  links: {
    display: 'flex',
    justifyContent: 'space-evenly'
  },
  socialIcons: {
    color: '#3f3f3f'
  },
  fontLogo: {
    fontFamily: 'LogoFont',
    letterSpacing: '3.5px',
    fontWeight: '500',
    fontSize: '30px',
    background: mainStyles.gradients.logo.background,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  }
};

export default Footer;
