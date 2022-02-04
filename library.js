'use strict';

const controllers = require('./lib/controllers');
const api = require('./lib/api');
const { routeHelpers } = require('./lib/nodebb');
const MedalHelpers = require('./lib/helpers');

const plugin = {};

plugin.init = async (params) => {
	const { router, middleware } = params;

	routeHelpers.setupAdminPageRoute(router, '/admin/plugins/medals', middleware, [], controllers.renderAdminPage);
	routeHelpers.setupPageRoute(router, '/user/:userslug/medals', middleware, [], controllers.renderMedalsPage);
};

plugin.addRoutes = async ({ router, middleware, helpers }) => {
	routeHelpers.setupApiRoute(router, 'get', '/medals/:userslug', [], (req, res) => {
		helpers.formatApiResponse(200, res, {
			userslug: req.params.userslug,
		});
	});

	const adminMiddlewares = [
		middleware.ensureLoggedIn,
		middleware.admin.checkPrivileges,
	];

	// API routes
	routeHelpers.setupApiRoute(router, 'get', '/medals', [], api.getMedals);
	routeHelpers.setupApiRoute(router, 'put', '/medals', adminMiddlewares, async (req, res) => {
		try {
			const { medals } = req.body;

			const savedMedals = await MedalHelpers.saveMedals(medals);

			helpers.formatApiResponse(200, res, {
				medals: savedMedals,
			});
		} catch (error) {
			throw new Error(error.message);
		}
	});
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
