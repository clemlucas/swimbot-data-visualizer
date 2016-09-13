import '../imports/api/sensors.js';

import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
    // code to run on server at startup
    Meteor.call('sensors.removeAll');
});
