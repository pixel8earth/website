import React from 'react';
import { connect } from 'react-redux';
import { actions as credsActions } from '../reducers/creds';
import { TextField, Button } from '@material-ui/core';

const mapStateToProps = state => ({
  error: state.creds.error
});
const mappedActions = {
  login: credsActions.signIn
};

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      showLoginForm: false,
      username: '',
      password: '',
      usernameError: null,
      passwordError: null,
      success: false
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateField = (event) => {
    const { target: { name, value } } = event;
    const { usernameError, passwordError } = this.state;
    let state = {};
    if (name === 'username') {
      if (usernameError && value.length > 0) state.usernameError = null;
      state.username = value;
    }
    if (name === 'password') {
      if (passwordError && value.length > 0) state.passwordError = null;
      state.password = value;
    }
    this.setState( state );
  }

  beginLogin = () => {
    this.setState({ showLoginForm: true });
  }

  cancelLogin = (e) => {
    if (e) e.preventDefault();
    this.setState({ showLoginForm: false, username: '', password: '' });
  }

  submitLogin = (event) => {
    if (this.state.username === '') {
      this.setState({ usernameError: 'A username is required to log in!' });
    }
    if (this.state.password === '') {
      this.setState({ passwordError: 'A password is required to log in!' });
    }
    if (event) event.preventDefault();
    this.props.login({ username: this.state.username, password: this.state.password })
      .then(() => {
        if (!this.props.error) {
          if (this.mounted) this.setState({ success: true });
          if (this.mounted) setTimeout(() => this.setState({ showLoginForm: false, username: '', password: '' }), 1500);
        }
      });
  }

  render() {
    const { showLoginForm, username, password, usernameError, passwordError, success } = this.state;

    return (
      <React.Fragment>
        { !showLoginForm &&
          <div style={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: '#000', position: 'absolute', top: '12px', right: '12px' }}>
            <div style={{ cursor: 'pointer', padding: '12px', color: '#63ADF2' }} onClick={this.beginLogin}>login</div>
          </div>
        }
        <div style={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: '#000' }}>
          { showLoginForm &&
            <form style={styles.loginForm} onSubmit={this.submitLogin}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <TextField
                  value={username}
                  type="text"
                  label="username"
                  name="username"
                  onChange={this.updateField}
                  error={!!usernameError}
                  helperText={usernameError}
                ></TextField>
                <TextField
                  value={password}
                  label="password"
                  type="password"
                  name="password"
                  onChange={this.updateField}
                  error={!!passwordError}
                  helperText={passwordError}
                ></TextField>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: '12px' }}>
                <Button
                  onClick={this.cancelLogin}
                  style={styles.cancelButton}
                  type="button"
                >Cancel</Button>
                <Button
                  onClick={this.submitLogin}
                  style={styles.button}
                  type="submit"
                >Submit</Button>
              </div>
              { this.props.error &&
                <div style={styles.serverError}>{this.props.error}</div>
              }
              { success &&
                <div style={styles.success}>Success!</div>
              }
            </form>
          }
        </div>
      </React.Fragment>
    );
  }
}

const styles = {
  loginForm: {
    width: '300px',
    padding: '12px',
    position: 'absolute',
    top: '9px',
    right: '12px',
    backgroundColor: '#fff',
    borderRadius: '6px'
  },
  button: {
    color: '#fff',
    textTransform: 'none',
    letterSpacing: 0,
    lineHeight: 1,
    fontWeight: 'bold',
    backgroundColor: '#63ADF2'
  },
  cancelButton: {
    color: '#fff',
    textTransform: 'none',
    letterSpacing: 0,
    lineHeight: 1,
    fontWeight: 'bold',
    backgroundColor: '#f44336', // '#AF4141'
    marginRight: '12px'
  },
  serverError: {
    margin: '12px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#f44336'
  },
  success: {
    margin: '12px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#76B041'
  }
};

export default connect(mapStateToProps, mappedActions)(Login);
