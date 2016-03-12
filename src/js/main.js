import 'berniestrap/dist/css/bootstrap.min.css';
import '../styles/styles.scss';
const jquery = require('jquery');
require('imports?jQuery=jquery!berniestrap/dist/js/bootstrap.min.js');

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore  from './store/configureStore';
import ActivismPrioritiesApp from './containers/ActivismPrioritiesApp/ActivismPrioritiesApp';

const store = configureStore();
const rootElement = document.getElementById('app');

let ComponentEl;

if (process.env.NODE_ENV !== 'production') {
  const DevTools = require('./containers/DevTools').default;

  // If using routes
  ComponentEl = (
    <div>
      <ActivismPrioritiesApp />
      <DevTools />
    </div>
  );
} else {
  ComponentEl = (
    <div>
      <ActivismPrioritiesApp />
    </div>
  );
}

// Render the React application to the DOM
ReactDOM.render(
  <Provider store={store}>
    {ComponentEl}
  </Provider>,
  rootElement
);
