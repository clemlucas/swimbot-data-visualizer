import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

// route components
import App from '../imports/ui/App.jsx';
import SensorsWrapper from '../imports/ui/SensorsWrapper.jsx';
import SensorsCharts from '../imports/ui/SensorsCharts.jsx';

export const renderRoutes = () => (
	<Router history={browserHistory}>
		<Route component={App}>
			<Route path='/' component={SensorsWrapper}>
				<Route path='/sensor/:sensorId' component={SensorsCharts}/>
			</Route>
		</Route>
	</Router>
);
