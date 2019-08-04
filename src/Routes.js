import React from 'react';
import { HashRouter as Router, Route } from "react-router-dom";
import { connect } from 'react-redux';
import { actions as credsActions } from './reducers/creds';

import Austin from './components/Austin';
import AustinClouds from './components/AustinClouds';
import Boulder from './components/Boulder';
import BoulderClouds from './components/BoulderClouds';
import Home from './components/Home';

const mapStateToProps = state => ({
  user: state.creds.user,
});

const mappedActions = {};

class Routes extends React.Component {
  render() {
    const { user } = this.props;

    return ( user ?
      (<Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/austin" component={Austin} />
          <Route path="/austinclouds" component={AustinClouds} />
          <Route path="/boulderclouds" component={BoulderClouds} />
          <Route path="/boulder" component={Boulder} />
        </div>
      </Router>)
      :
      (<Router>
        <div>
          <Route exact path="/" component={Home} />
        </div>
      </Router>)
    );
  }
}

export default connect(mapStateToProps, mappedActions)(Routes);
