import React from 'react';
import { HashRouter as Router, Route } from "react-router-dom";
import { connect } from 'react-redux';
import { actions as credsActions } from './reducers/creds';

import Austin from './pages/Austin';
import AustinClouds from './pages/AustinClouds';
import Boulder from './pages/Boulder';
import BoulderClouds from './pages/BoulderClouds';
import Home from './pages/Home';

const mapStateToProps = state => ({
  user: state.creds.user,
});

const mappedActions = {
  fetchCreds: credsActions.fetch,
};

class Routes extends React.Component {
  componentDidMount = async () => {
    await this.props.fetchCreds();
  }

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/austin" component={Austin} />
          <Route path="/austinclouds" component={AustinClouds} />
          <Route path="/boulderclouds" component={BoulderClouds} />
          <Route path="/boulder" component={Boulder} />
        </div>
      </Router>
    );
  }
}

export default connect(mapStateToProps, mappedActions)(Routes);
