import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from '../imports/ui/App.jsx';

const AppLayout = () => (
    <MuiThemeProvider>
        <App/>
    </MuiThemeProvider>
);

Meteor.startup(() => {
    render(<AppLayout/>, document.getElementById('render-target'));
});
