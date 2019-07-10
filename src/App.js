import React from 'react';
import { HashRouter as Router, Route } from "react-router-dom";

import Austin from './components/Austin';
import Boulder from './components/Boulder';
import Home from './components/Home';
import './App.css';

/**
  TODO List

  1. source all data providers
  2. animate ground level things... move along a path etc

*/

function App() {
  return (
    <Router>
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/austin" component={Austin} />
        <Route path="/boulder" component={Boulder} />
      </div>
    </Router>
  );
}

export default App;
