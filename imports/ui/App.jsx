import React, { Component } from 'react';
import { Navbar } from 'react-materialize';

import SensorsWrapper from './SensorsWrapper.jsx';

const styles = {
  title: {
    cursor: 'pointer',
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
        <Navbar brand=' Ynoapp' right>
        </Navbar>

        <SensorsWrapper/>

      </div>
    );
  }
}
