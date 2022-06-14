'use strict';

const controllers = require('./lib/controllers');
const api = require('./lib/api');
const { routeHelpers, Events } = require('./lib/nodebb');
const medalHelpers = require('./lib/helpers');

const plugin = {};

plugin.init = async (params) => {
	const { router, middleware } = params;

	routeHelpers.setupAdminPageRoute(router, '/admin/plugins/medals', middleware, [], controllers.renderAdminPage);
	routeHelpers.setupPageRoute(router, '/user/:userslug/medals', middleware, [], controllers.renderMedalsPage);

	// Custom plugin events
	Events.types.push('nodebb-plugin-medals:assign');
	Events.types.push('nodebb-plugin-medals:unassign');
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

	routeHelpers.setupApiRoute(router, 'get', '/medals/user/:userslug', [], api.getUserMedals);
	routeHelpers.setupApiRoute(router, 'post', '/medals/user', [middleware.ensureLoggedIn], api.assignMedal);
	routeHelpers.setupApiRoute(router, 'delete', '/medals/user', [middleware.ensureLoggedIn], api.unassignMedal);
	
	routeHelpers.setupApiRoute(router, 'post', '/medals/user/favourite', [middleware.ensureLoggedIn], api.setUserMedalFavourite);
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

	templateData.medals = templateData.medals.sort((a, b) => {
		if (a.favourite && !b.favourite) return -1;
		else if (!a.favourite && b.favourite) return 1;
		return 0;
	});

	return data;
};

plugin.getUserMedals = async (data) => {
	data.medals = [];

	const { uid } = data;

	if (uid) {
		const medals = await medalHelpers.getUserMedals(uid);
		if (medals) data.medals = medals;
	}

	return data;
};

plugin.getUsersMedals = async (data) => {
	data.medals = [];

	const { uids } = data;

	if (uids) {
		const medals = await medalHelpers.getUsersMedals(uids);
		if (medals) data.medals = medals;
	}

	return data;
};

plugin.addPrivsHuman = async (data) => {
	data.push({
		name: '[[nodebb-plugin-medals:admin.assign-medals]]'
	});

	data.push({
		name: '[[nodebb-plugin-medals:admin.favourite-medals]]'
	});

	return data;
};

plugin.addPrivs = async (data) => {
	data.push('plugin_medals:assign');
	data.push('plugin_medals:favourite');

	return data;
};

module.exports = plugin;
