import React from 'react';
import { render } from 'react-dom';
import { addResponsiveHandlers } from 'redux-responsive';
import configureStore from './store/configureStore';
import Root from './containers/Root';

const store = configureStore();

// Attach redux-responsive
addResponsiveHandlers(store);

render(
  <Root store={store} />,
  document.getElementById('root')
);
