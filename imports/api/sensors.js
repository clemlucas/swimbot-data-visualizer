import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Sensors = new Mongo.Collection('sensors');

if (Meteor.isServer) {
	// This code only runs on the server
	Meteor.publish('sensors', function sensorsPublication() {
		return Sensors.find();
	});
}

Meteor.methods({
	'sensors.insert'(filename, data) {
		Sensors.insert({
			filename: filename,
			data: data,
			createdAt: new Date(),
		});
	},

	'sensors.getByFilename'(filename) {
		return Sensors.find({ filename: {$eq: filename }}).fetch();
	},

	'sensors.remove'(sensorId) {
		check(sensorId, String);

		Sensors.remove(taskId);
	},

	'sensors.removeAll'() {
		Sensors.remove({});
	}
});

Sensors.helpers({
	getAll: function() {
		return "hello";
	},
});
