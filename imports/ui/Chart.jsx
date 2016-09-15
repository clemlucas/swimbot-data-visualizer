import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import {Tabs, Tab} from 'material-ui/Tabs';

const tabStyles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

export default class Chart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sensor: this.props.sensor
    }
  }

  idToName() {
    return {
      "-2":"CalibHorizonal",
      "-1":"CalibVertical",
      "1":"Acc",
      "2":"Magn",
      "4":"Gyro",
      "10":"LAcc",
      "11":"Rotation"
    }
  }

  renderAxis(sensor, axisStr, index) {
    var _this = this;
    var axisData = [];

    sensor.forEach(function(row) {

      axisData.push({
        x: new Date(row[0]),
        y: row[index]
      });
    });

    var data = [];
    var dataSeries = {
      type: "line",
    };

    dataSeries.dataPoints = axisData;
    data.push(dataSeries);

    var chart = new CanvasJS.Chart(_this.getDivId(axisStr),
    {
      zoomEnabled: true,
      title:{
        text: _this.props.name + '_' + axisStr
      },
      animationEnabled: true,
      axisX:{
        valueFormatString: 'mm:ss',
        labelAngle: 30
      },
      axisY :{
        includeZero: false
      },
      data: data
    });

    chart.render();
  }

  renderSensor(currSensor) {
    this.renderAxis(currSensor, 'x', 1);
    this.renderAxis(currSensor, 'y', 2);
    this.renderAxis(currSensor, 'z', 3);
  }

  componentWillReceiveProps(props) {
    this.renderSensor(props.sensor);
  }

  componentDidMount() {
    this.renderSensor(this.props.sensor);
  }

  getDivId(axisStr) {
    return ("chartContainer" + this.props.name + axisStr);
  }

  render() {
    return (
      <Tabs>
        <Tab label={this.props.name.toUpperCase() + " X"} >
          <div id={this.getDivId('x')} className="chart"></div>
        </Tab>
        <Tab label={this.props.name.toUpperCase() + " Y"} >
          <div id={this.getDivId('y')} className="chart"></div>
        </Tab>
        <Tab label={this.props.name.toUpperCase() + " Z"}>
          <div id={this.getDivId('z')} className="chart"></div>
        </Tab>
      </Tabs>
    );
  }
}

Chart.propTypes = {
  name: PropTypes.string.isRequired,
  sensor: PropTypes.array.isRequired,
};
