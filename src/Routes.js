import React from 'react';
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Terms from './pages/Terms';
import NavAndFooterWrap from './components/NavAndFooterWrap';
import Careers from './pages/Careers';
import Photogrammetry from './pages/Photogrammetry';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';

function Routes() {
  return (
    <Router>
      <Switch>
        <Route path={['/about_us', '/terms', '/careers', '/photogrammetry_guide', '/privacy']}>
          <NavAndFooterWrap>
            <Route path="/about_us" component={AboutUs} />
            <Route path="/careers/:job?" component={Careers} />
            <Route path="/terms" component={Terms} />
            <Route path="/photogrammetry_guide" component={Photogrammetry} />
            <Route path="/privacy" component={Privacy} />
          </NavAndFooterWrap>
        </Route>
        <Route exact path="/" component={Home} />
        <Route exact path="*" component={NotFound} />
      </Switch>
    </Router>
  );
}

export default Routes;
