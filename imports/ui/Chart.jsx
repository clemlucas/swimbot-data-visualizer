import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

export default class Chart extends Component {
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

    componentDidMount() {
        console.log("componentDidMount()");
        console.log(this.getId());
        var _this = this;

        //var chart = new CanvasJS.Chart(_this.getId(),
        //    {
        //        zoomEnabled: true,
        //        title:{
        //            text: _this.idToName()[_this.props.key]
        //        },
        //        animationEnabled: true,
        //        axisX:{
        //            labelAngle: 30
        //        },
        //        axisY :{
        //            includeZero:false
        //        },
        //        data: _this.props.sensor.data
        //    });

        //chart.render();
    }

    getId() {
        return ("chartContainer" + this.props.sensor.sensorId);
    }

    render() {
        return (<div id={this.getId()} className="chart"></div>);
    }
}

Chart.propTypes = {
    sensor: PropTypes.object.isRequired,
};
