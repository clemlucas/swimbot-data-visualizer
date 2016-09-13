import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Sensors = new Mongo.Collection('sensors');

 
if (Meteor.isServer) {
    // This code only runs on the server
     Meteor.publish('sensors', function sensorsPublication() {
         let find = Sensors.find();
         return find;
     });
}

Meteor.methods({
    'sensors.insert'(sensorId, data) {
        Sensors.insert({
            sensorId: sensorId,
            data: data
        });
    },

    'sensors.remove'(sensorId) {
        check(sensorId, String);

        Sensors.remove(taskId);
    },

    'sensors.removeAll'() {
        Sensors.remove({});
    }
});
