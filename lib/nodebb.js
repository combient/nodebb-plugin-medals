'use strict';

module.exports = {
	db: require.main.require('./src/database'),
	Settings: require.main.require('./src/settings'),
	User: require.main.require('./src/user'),
	Notifications: require.main.require('./src/notifications'),
	Plugins: require.main.require('./src/plugins'),
	winston: require.main.require('winston'),
	routeHelpers: require.main.require('./src/routes/helpers'),
	utils: require.main.require('./src/utils'),
	controllerHelpers: require.main.require('./src/controllers/helpers'),
	accountHelpers: require.main.require('./src/controllers/accounts/helpers'),
	Events: require.main.require('./src/events'),
	_: require.main.require('lodash')
};
