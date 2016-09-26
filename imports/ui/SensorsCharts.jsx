import React, { Component, PropTypes } from 'react';
import autoBind from 'react-autobind';
import Chart from './Chart.jsx';
import { _ } from 'meteor/underscore';
import { Sensors } from '../api/sensors.js';

export default class SensorsCharts extends Component {
	constructor(props) {
		super(props);
		autoBind(this);
	}

	loadSensorData(sensorId) {
		if (sensorId === -1) {
			return;
		}
		var sensor = Sensors.findOne(sensorId);
		this.setState({currSensor: sensor});
	}
	// Handle when User navigates from / to /sensor/:sensorId
	componentWillMount() {
		this.loadSensorData(this.props.params.sensorId);
	}

	// Handle when User navigates between conversations
	componentWillReceiveProps(nextProps) {
		this.loadSensorData(nextProps.params.sensorId);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (this.state.currSensor._id !== nextState.currSensor._id);
	}

	renderCharts() {
		if (_.isEmpty(this.state.currSensor)) {
			return null;
		} else {
			return (
				<div className="container">
					<Chart name='acc' sensor={this.state.currSensor.data[1]}/>
					<Chart name='magn' sensor={this.state.currSensor.data[2]}/>
					<Chart name='gyro' sensor={this.state.currSensor.data[4]}/>
					<Chart name='lacc' sensor={this.state.currSensor.data[10]}/>
				</div>
			);
		}
	}

	render() {
		return (this.renderCharts());
	}
}
