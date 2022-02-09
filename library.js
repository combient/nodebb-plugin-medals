'use strict';

const controllers = require('./lib/controllers');
const api = require('./lib/api');
const { routeHelpers } = require('./lib/nodebb');
const medalHelpers = require('./lib/helpers');

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
	routeHelpers.setupApiRoute(router, 'delete', '/medals', adminMiddlewares, api.deleteMedal);

	routeHelpers.setupApiRoute(router, 'get', '/medals/user/:userslug', [middleware.ensureLoggedIn], api.getUserMedals);
	routeHelpers.setupApiRoute(router, 'post', '/medals/user', [middleware.ensureLoggedIn], api.assignMedal);
	routeHelpers.setupApiRoute(router, 'delete', '/medals/user', [middleware.ensureLoggedIn], api.unassignMedal);
};

plugin.addAdminNavigation = (header) => {
	header.plugins.push({
		route: '/plugins/medals',
		icon: 'fa-tint',
		name: 'Medals',
	});

	return header;
};

plugin.addProfileItem = async (data) => {
	data.links.push({
		id: 'medals',
		route: 'medals',
		icon: 'fa-trophy',
		name: 'Medals',
		visibility: {
			self: true,
			other: true,
			moderator: true,
			globalMod: true,
			admin: true,
		},
	});

	return data;
};

plugin.appendMedalsToProfile = async (data) => {
	const { templateData } = data;

	templateData.medals = await medalHelpers.getUserMedals(templateData.uid);

	return data;
};

module.exports = plugin;
