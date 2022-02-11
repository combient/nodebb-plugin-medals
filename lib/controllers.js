'use strict';

const MedalHelpers = require('./helpers');
const { accountHelpers, controllerHelpers, User } = require('./nodebb');

const Controllers = {};

Controllers.renderAdminPage = async (req, res) => {
	const medals = await MedalHelpers.getAllMedals();

	const usersList = await Promise.all(medals.map(medal => MedalHelpers.getMedalUsers(medal.uuid)));

	medals.forEach((medal, index) => {
		medal.users = usersList[index];
	});

	res.render('admin/plugins/medals', {
		medals: medals || [],
	});
};

Controllers.renderMedalsPage = async (req, res, next) => {
	const userData = await accountHelpers.getUserDataByUserSlug(req.params.userslug, req.uid, req.query);
	if (!userData) {
		return next();
	}

	const medals = await MedalHelpers.getAllMedals();
	const assignedMedals = await MedalHelpers.getUserMedals(userData.uid);

	const medalUuids = medals.map(medal => medal.uuid);
	const userMedalUuids = assignedMedals.map(medal => medal.uuid);

	const isAdminOrGlobalMod = await User.isAdminOrGlobalMod(req.uid);

	let unassignedMedals = [];

	if (isAdminOrGlobalMod) {
		const unassignedUuids = medalUuids.reduce((list, uuid) => {
			if (userMedalUuids.indexOf(uuid) === -1) list.push(uuid);
			return list;
		}, []);

		unassignedMedals = await MedalHelpers.getMedals(unassignedUuids);
	}

	res.render('plugins/nodebb-plugin-medals/medals', {
		...userData,
		title: `${userData.displayname}'s medals`,
		breadcrumbs: controllerHelpers.buildBreadcrumbs([{ text: userData.displayname, url: `/user/${userData.userslug}` }, { text: 'Medals', url: `/user/${userData.userslug}/medals` }]),
		isAdminOrGlobalMod,
		assignedMedals,
		unassignedMedals,
	});
};

module.exports = Controllers;
