'use strict';

const controllers = require('./lib/controllers');
const api = require('./lib/api');
const { routeHelpers } = require('./lib/nodebb');

const plugin = {};

plugin.init = async (params) => {
	const { router, middleware } = params;

	routeHelpers.setupAdminPageRoute(router, '/admin/plugins/medals', middleware, [], controllers.renderAdminPage);
	routeHelpers.setupPageRoute(router, '/user/:userslug/medals', middleware, [], controllers.renderMedalsPage);
};

plugin.addRoutes = async ({ router, middleware }) => {
	const adminMiddlewares = [
		middleware.ensureLoggedIn,
		middleware.admin.checkPrivileges,
	];

	// API routes
	routeHelpers.setupApiRoute(router, 'get', '/medals', [], api.getMedals);
	routeHelpers.setupApiRoute(router, 'put', '/medals', adminMiddlewares, api.saveMedals);
	routeHelpers.setupApiRoute(router, 'delete', '/medal', adminMiddlewares, api.deleteMedal);
};

plugin.addAdminNavigation = (header) => {
	header.plugins.push({
		route: '/plugins/medals',
		icon: 'fa-tint',
		name: 'Medals',
	});

	return header;
};

module.exports = plugin;
