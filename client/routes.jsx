import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

// route components
import AppLayout from '../imports/ui/AppLayout.jsx';

export const renderRoutes = () => (
	<Router history={browserHistory}>
		<Route path="/" component={AppLayout}>
		</Route>
	</Router>
);
