'use strict';

module.exports = {
	db: require.main.require('./src/database'),
	Settings: require.main.require('./src/settings'),
	Meta: require.main.require('./src/meta'),
	User: require.main.require('./src/user'),
	winston: require.main.require('winston'),
	routeHelpers: require.main.require('./src/routes/helpers'),
};
