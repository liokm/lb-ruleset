import React from 'react';
import { render } from 'react-dom';
import configureStore from './store/configureStore';
import Root from './containers/Root';
import { addResponsiveHandlers } from 'redux-responsive';

const store = configureStore();

// redux-responsive
addResponsiveHandlers(store);

render(
  <Root store={store} />,
  document.getElementById('root')
);
