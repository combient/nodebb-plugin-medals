'use strict';

const MedalHelpers = require('./helpers');
const { accountHelpers, controllerHelpers } = require('./nodebb');

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
	userData.title = `${userData.displayname}'s medals`;
	userData.breadcrumbs = controllerHelpers.buildBreadcrumbs([{ text: userData.displayname, url: `/user/${userData.userslug}` }, { text: 'medals', url: `/user/${userData.userslug}/medals` }]);

	res.render('medals', {
		...userData,
		medals: [],
	});
};

module.exports = Controllers;
