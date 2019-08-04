import React from 'react';
import { connect } from 'react-redux';
import { actions as credsActions } from '../reducers/creds';
import { TextField, Button } from '@material-ui/core';
import '../App.css';

const mapStateToProps = state => ({
  user: state.creds.user,
  error: state.creds.error
});
const mappedActions = {
  login: credsActions.signIn
};

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      showLoginForm: false,
      username: '',
      password: ''
    };
  }

  beginLogin = () => {
    this.setState({ showLoginForm: true });
  }

  cancelLogin = (e) => {
    if (e) e.preventDefault();
    this.setState({ showLoginForm: false, username: '', password: '' });
  }

  submitLogin = (event) => {
    if (event) event.preventDefault();
    this.props.login({ username: this.state.username, password: this.state.password });
    this.setState({ showLoginForm: false, username: '', password: '' });
  }

  render() {
    const { showLoginForm, username, password } = this.state;

    return (
      <div className="App">
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
                  onChange={({ target: { value } }) => this.setState({ username: value })}
                ></TextField>
                <TextField
                  value={password}
                  label="password"
                  type="password"
                  onChange={({ target: { value } }) => this.setState({ password: value })}
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
            </form>
          }
        </div>
        <header className="App-header">
          <img src="/pixel8.jpg" alt="Future home of Pixel8.earth" width={400}/>
          Future home of Pixel8.earth
        </header>
      </div>
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
    backgroundColor: '#AF4141',
    marginRight: '12px'
  }
};

export default connect(mapStateToProps, mappedActions)(Home);
