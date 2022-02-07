'use strict';

const MedalHelpers = require('./helpers');
const { accountHelpers, controllerHelpers, User } = require('./nodebb');

const Controllers = {};

Controllers.renderAdminPage = async (req, res) => {
	const medals = await MedalHelpers.getMedals();
	res.render('admin/plugins/medals', {
		medals: medals || [],
	});
};

Controllers.renderMedalsPage = async (req, res, next) => {
	const userData = await accountHelpers.getUserDataByUserSlug(req.params.userslug, req.uid, req.query);
	if (!userData) {
		return next();
	}

	const medals = await MedalHelpers.getMedals();

	const isAdminOrGlobalMod = await User.isAdminOrGlobalMod(req.uid);

	res.render('plugins/nodebb-plugin-medals/medals', {
		...userData,
		title: `${userData.displayname}'s medals`,
		breadcrumbs: controllerHelpers.buildBreadcrumbs([{ text: userData.displayname, url: `/user/${userData.userslug}` }, { text: 'medals', url: `/user/${userData.userslug}/medals` }]),
		isAdminOrGlobalMod,
		medals: medals,
		assignedMedals: medals,
		unassignedMedals: medals,
	});
};

module.exports = Controllers;
