import React from 'react';

import { api } from '../front_config';


class Login extends React.Component {

  render() {
    const { loginStyle = {} } = this.props;

    return (
      <div
        className={`btnP8Outline ${this.props.dark ? 'dark' : ''}`}
        style={{ ...loginStyle }}
        onClick={() => window.location = `${api.replace('/api/v1', '')}/#login`}
      >
        Sign In
      </div>
    );
  }
}

export default Login;
