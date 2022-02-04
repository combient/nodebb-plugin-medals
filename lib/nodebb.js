'use strict';

module.exports = {
	db: require.main.require('./src/database'),
	Settings: require.main.require('./src/settings'),
	User: require.main.require('./src/user'),
	winston: require.main.require('winston'),
	routeHelpers: require.main.require('./src/routes/helpers'),
	utils: require.main.require('./src/utils'),
};
