import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
var Dropzone = require('react-dropzone');

import Chart from './Chart.jsx';
import { Sensors } from '../api/sensors.js';

// App component - represents the whole app
class App extends Component {
    constructor(props) {
        super(props);
    }

    nanoToMili(pNano) {
        return Math.round(pNano/100000);
    }

    onDrop(files) {
        var _this = this;
        var sensors = {};
        var firstTimeValue = 0;

        files.forEach(
            function(file) {
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
                        for (var key in sensors) {
                            Meteor.call('sensors.insert', key, sensors[key]);
                        }
                    }
                });
            }, this);
    }

    renderCharts() {
        console.log("renderCharts()");
        return this.props.sensors.map((sensor) => {
            if (sensor.sensorId !== "-1" && sensor.sensorId !== "-2")
            return (
                        <Chart
                          key={sensor._id}
                          sensor={sensor}
                        />
            );
        });
    }

    render() {
        return (
            <div>
                <header>
                <h1>Ynoapp</h1>
                </header>

                <Dropzone onDrop={this.onDrop.bind(this)} className="dropzone">
                <div className="dropzone-text">Try dopping some files here, or click to select files to uplaod</div>
                </Dropzone>

                <ul>
                {this.renderCharts()}
                </ul>
            </div>
        );
    }
}

App.propTypes = {
    sensors: PropTypes.array.isRequired,
    sensorsCount: PropTypes.number.isRequired,
};

export default createContainer(() => {
    Meteor.subscribe('sensors');
    
    console.log(Sensors.find({}).fetch());
    return {
        sensors: Sensors.find({}).fetch(),
        sensorsCount: Sensors.find({}).count(),
    };
}, App);
