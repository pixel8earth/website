import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import mainStyles from '../styles';

function NotFound(props) {
  return (
    <div style={{
        height: props.projectPage ? '100%' : '100vh',
        width: '100%',
        backgroundColor: mainStyles.colors.light,
        textAlign: 'center',
        padding: '25vh 25vw'
      }}
    >
      <div style={{ fontSize: '64px', fontWeight: 'bold', color: mainStyles.colors.primary }}>404</div>
      <div style={{ fontSize: '24px' }}>I'm sorry this page does not exist.</div>
      <div style={{ paddingTop: mainStyles.spacing.normal }}>
        { props.projectPage ?
          <div
            style={{
              fontSize: '18px',
              color: mainStyles.colors.secondary,
              cursor: 'pointer'
            }}
            onClick={props.history.goBack}
          >Return to previous page</div>
          :
          <Link style={{ fontSize: '18px' }} to="/">Pixel8Earth</Link>
        }
      </div>
    </div>
  );
}

export default withRouter(NotFound);
