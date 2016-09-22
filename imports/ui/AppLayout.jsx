
import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './App.jsx';

export default class AppLayout extends Component {
	render() {
		return(
			<MuiThemeProvider>
				<App/>
			</MuiThemeProvider>
		);
	}
}
