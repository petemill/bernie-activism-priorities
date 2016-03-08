import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import App from './components/App';
import ActivismPrioritiesApp from './containers/ActivismPrioritiesApp/ActivismPrioritiesApp';
import NotFoundView from './views/NotFoundView';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={ActivismPrioritiesApp} />
    <Route path="404" component={NotFoundView} />
    <Redirect from="*" to="404" />
  </Route>
);
