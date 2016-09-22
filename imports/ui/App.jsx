import React, { Component } from 'react';
import { Navbar } from 'react-materialize';

import SensorsWrapper from './SensorsWrapper.jsx';

const styles = {
	title: {
		paddingLeft: '12px',
	},
};

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// App component - represents the whole app
export default class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<nav>
					<div className="nav-wrapper">
						<a href="#" className="brand-logo center">Swimbot</a>
						<ul id="nav-mobile" className="left hide-on-med-and-down">
						</ul>
					</div>
				</nav>

				<SensorsWrapper/>

			</div>
		);
	}
}
