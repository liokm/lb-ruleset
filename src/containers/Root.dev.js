import React, { Component } from 'react';
import debug from 'debug';
import { Provider } from 'react-redux';
import App from './App';
import DevTools from './DevTools';

if (typeof window != 'undefined') {
  debug.enable('app:*');
  window.debog = debug;
}

export default class Root extends Component {
  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <div>
          <App />
          <DevTools />
        </div>
      </Provider>
    );
  }
}
