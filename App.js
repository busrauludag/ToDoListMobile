import React from 'react';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import themeReducer from './redux/themeReducer';

import Home from './components/Home';

const store = createStore(combineReducers({
  themeReducer
}), applyMiddleware(thunk));

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Home />
      </Provider>
    );
  }
}
