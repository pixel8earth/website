import { combineReducers } from 'redux';

const StorageKey = '@Pixel8Earth:AuthKey';

export const types = {
  CREDS: 'USER/SET',
  CREDS_ERROR: 'USER/AUTH/ERROR'
};

const initialState = {
  user: null,
  error: null
};

export const actions = {
  fetch: () => async dispatch => {
    let creds = window.localStorage.getItem(StorageKey);
    creds = JSON.parse(creds);
    return dispatch({ type: types.CREDS, payload: creds });
  },
  signIn: user => async dispatch => {
    // send user/pw to server, send back user info...
    const url = 'https://api.pixel8.earth/auth/signin';
    const options = {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(user)
    };
    const result = await fetch(url, options)
      .then(r => r.json())
      .then( r => {
        if (r.error) throw r.error;
        return r;
      })
      .catch( err => {
        dispatch({ type: types.CREDS_ERROR, payload: err });
        return null;
      });

    if (result) {
      window.localStorage.setItem(StorageKey, JSON.stringify(result));
      return dispatch({ type: types.CREDS, payload: result });
    }
  },
  signOut: () => dispatch => {
    window.localStorage.removeItem(StorageKey);
    return dispatch({ type: types.CREDS, payload: null });
  },
  checkIfTokenExpired: () => (dispatch, getState) => {
    const { creds: { user } } = getState();
    if (!user) return true;
    return false;
  }
};

const credsReducers = {
  user: ( state = initialState.user, action ) => {
    switch ( action.type ) {
      case types.CREDS:
        return action.payload;
      case types.CREDS_ERROR:
        return null;
      default:
        return state;
    }
  },
  error: ( state = initialState.error, action ) => {
    switch ( action.type ) {
      case types.CREDS:
        return false;
      case types.CREDS_ERROR:
        return action.payload;
      default:
        return state;
    }
  }
};

export default combineReducers(credsReducers);
