import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Sensors } from '../api/sensors.js';
import { Button, Icon, Col, Row, Preloader } from 'react-materialize';
import { Link } from 'react-router';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import SensorsCharts from './SensorsCharts.jsx';

// Sensors.find({}, { sort: {createdAt: -1} }).fetch()

export default class SensorsWrapper extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedSensorIndex: 0,
			selectedSensorId: -1,
			sensors: []
		};
	}

	componentWillMount() {
		var _this = this;
		Meteor.subscribe('sensors', function() {
			console.log("Data is loaded");
			_this.setState({ sensors: Sensors.find({}, { sort: {createdAt: -1} }).fetch()});
		});

		if (this.state.sensors.length > 0) {
			this.setState({
				selectedSensorId: this.state.sensors[0]._id,
			});
		}
	}

	handleSelectChange(event, index, value) {
		this.setState({
			selectedSensorIndex: index,
			selectedSensorId: this.state.sensors[index]._id
		});
	};

	renderFilesHistoryList() {
		let list = [];

		for (let i = 0; i < this.state.sensors.length; i++) {
			list.push(<MenuItem className='menu-item' value={i} key={i} primaryText={this.state.sensors[i].filename} />)
		};

		return list;
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
					console.log("New entry: " + filename);
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
						<input ref="fileUpload" type="file" accept=".csv" name="file" style={{"display" : "none"}} onChange={this.handleChange.bind(this)}/>
					</Button>
				</Button>

				<div id='horizontal-flexbox'>
					<div id='vertical-flexbox'>
						<Link to={'/sensor/' + encodeURIComponent(this.state.selectedSensorId)}><Button>Load</Button></Link>

						<SelectField className="file-select" value={this.state.selectedSensorIndex} onChange={this.handleSelectChange.bind(this)}>
							{this.renderFilesHistoryList()}
						</SelectField>
					</div>

					{this.props.children || <h4>Select a file from the list</h4>}
				</div>

			</div>
		);
	}
}
