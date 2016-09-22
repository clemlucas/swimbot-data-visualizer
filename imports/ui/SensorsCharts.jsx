import React, { Component, PropTypes } from 'react';
import Chart from './Chart.jsx';
import { _ } from 'meteor/underscore';

export default class SensorsCharts extends Component {
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (this.props.sensor._id !== nextProps.sensor._id);
	}

	renderCharts() {
		if (_.isEmpty(this.props.sensor)) {
			return null;
		} else {
			return (
				<div className="container">
					<Chart name='acc' sensor={this.props.sensor.data[1]}/>
					<Chart name='magn' sensor={this.props.sensor.data[2]}/>
					<Chart name='gyro' sensor={this.props.sensor.data[4]}/>
					<Chart name='lacc' sensor={this.props.sensor.data[10]}/>
				</div>
			);
		}
	}

	render() {
		return (this.renderCharts());
	}
}

SensorsCharts.PropTypes = {
	sensor: PropTypes.object.isRequired
};
