import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Sensors } from '../api/sensors.js';
import { Button, Icon } from 'react-materialize';

import Chart from './Chart.jsx';

const idSensor = {
  "acc": "1",
  "magn": "2",
  "gyro": "4",
  "lacc": "10",
};

export default class SensorsWrapper extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("this.props", this.props.sensors.length);
    console.log("nextProps", nextProps.sensors.length);
    return (this.props.sensors.length !== nextProps.sensors.length);
  }

  nanoToMili(pNano) {
    return Math.round(pNano/100000);
  }

  renderCharts() {
    if (this.props.sensors.length === 0) {
      return (
        <div className="container">
          <h2>Import a sensors file</h2>
        </div>
      );
    }

    let lastSensors = this.props.sensors[0].data;

    return (
      <div className="container">
        <Chart name='acc' sensor={lastSensors[1]}/>
        <Chart name='magn' sensor={lastSensors[2]}/>
        <Chart name='gyro' sensor={lastSensors[4]}/>
        <Chart name='lacc' sensor={lastSensors[10]}/>
      </div>
    );
  }

  openFileDialog() {
    var fileUploadDom = ReactDOM.findDOMNode(this.refs.fileUpload);
    fileUploadDom.click();
  }

  handleChange(e) {
    console.log("Handle change");

    var _this = this;
    var sensors = {};
    var firstTimeValue = 0;

    for(var i = 0, file; file = e.target.files[i]; i++) {
      Papa.parse(file, {
        step: function(row) {
          var sensorRow = row.data[0];
          var sensorID = sensorRow.splice(0, 1)[0];

          if (sensorRow[0] !== '0' && firstTimeValue === 0)
          firstTimeValue = parseFloat(sensorRow[0]);
          sensorRow[0] = parseFloat(sensorRow[0]) - firstTimeValue;
          sensorRow[0] = _this.nanoToMili(sensorRow[0]);

          for (var i=1; i < sensorRow.length; i++)
          sensorRow[i] = parseFloat(sensorRow[i]);

          if (sensors[sensorID] === undefined)
          sensors[sensorID] = [];
          sensors[sensorID].push(sensorRow);
        },
        complete: function() {
          delete sensors[""]; // Delete empty id
          Meteor.call('sensors.insert', sensors);
          // _this.handleNewSensors(sensors);
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

        {this.renderCharts()}

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
