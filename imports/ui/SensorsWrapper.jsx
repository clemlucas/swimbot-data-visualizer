import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Sensors } from '../api/sensors.js';
import { Button, Icon, Col, Row } from 'react-materialize';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import SensorsCharts from './SensorsCharts.jsx';

export default class SensorsWrapper extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedSensorIndex: 0,
			selectedSensor: {}
		};
	}

	handleSelectChange(event, index, value) {
		console.log(index, value);

		this.setState({
			selectedSensorIndex: index,
		});
	};

	renderFilesHistoryList() {
		let list = [];

		for (let i = 0; i < this.props.sensors.length; i++) {
			list.push(<MenuItem className='menu-item' value={i} key={i} primaryText={this.props.sensors[i].filename} />)
		};

		return list;
	}

	loadChart() {
			this.setState({
				selectedSensor: this.props.sensors[this.state.selectedSensorIndex]
			})
	}

	openFileDialog() {
		var fileUploadDom = ReactDOM.findDOMNode(this.refs.fileUpload);
		fileUploadDom.click();
	}

	handleChange(e) {
		var _this = this;
		var sensors = {};
		var firstTimeValue = 0;

		for(var i = 0, file; file = e.target.files[i]; i++) {
			const filename = file['name'];
			Papa.parse(file, {
				step: function(row) {
					var sensorRow = row.data[0];
					var sensorID = sensorRow.splice(0, 1)[0];

					if (sensorRow[0] !== '0' && firstTimeValue === 0)
					firstTimeValue = parseFloat(sensorRow[0]);
					sensorRow[0] = parseFloat(sensorRow[0]) - firstTimeValue;
					sensorRow[0] = Math.round(sensorRow[0]/100000);
					for (var i=1; i < sensorRow.length; i++)
					sensorRow[i] = parseFloat(sensorRow[i]);

					if (sensors[sensorID] === undefined)
					sensors[sensorID] = [];
					sensors[sensorID].push(sensorRow);
				},
				complete: function() {
					delete sensors[""]; // Delete empty id
					Meteor.call('sensors.insert', filename, sensors);
				}
			});
		}
	}

	render() {
		const buttonStyle = {
			margin: 12,
		};

		return (
			<div>
				<Button floating fab='horizontal' icon='add' className='red' large style={{bottom: '45px', right: '24px'}}>
					<Button floating icon='publish' className='green' onClick={this.openFileDialog.bind(this)}>
						<input ref="fileUpload" type="file" name="file" style={{"display" : "none"}} onChange={this.handleChange.bind(this)}/>
					</Button>
				</Button>

				<div id='main-flexbox'>
					<div id='loading-file-flexbox'>
						<Button onClick={this.loadChart.bind(this)}>Load</Button>
						<SelectField className="file-select" value={this.state.selectedSensorIndex} onChange={this.handleSelectChange.bind(this)}>
							{this.renderFilesHistoryList()}
						</SelectField>
					</div>

					<SensorsCharts sensor={this.state.selectedSensor}/>
				</div>

			</div>
		);
	}
}

SensorsWrapper.propTypes = {
	sensors: PropTypes.array.isRequired,
};

export default createContainer(() => {
	Meteor.subscribe('sensors');

	return {
		sensors: Sensors.find({}, { sort: {createdAt: -1} }).fetch(),
	};
}, SensorsWrapper);
