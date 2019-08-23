import React from 'react';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import * as reducers from './reducers/index';
import Routes from './Routes';

const store = createStore(
  combineReducers(reducers),
  applyMiddleware(thunk)
);

function App() {
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
}

export default App;
