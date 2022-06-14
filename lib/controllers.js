'use strict';

const MedalHelpers = require('./helpers');
const { accountHelpers, controllerHelpers, _ } = require('./nodebb');

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

	const canFavourite = await MedalHelpers.canFavouriteMedals(req.uid);

	let notAssignedMedals = [];

	const canAssign = await MedalHelpers.canAssignMedals(req.uid);

	if (canAssign) {
		const unassignedUuids = medalUuids.reduce((list, uuid) => {
			if (userMedalUuids.indexOf(uuid) === -1) list.push(uuid);
			return list;
		}, []);

		notAssignedMedals = await MedalHelpers.getMedals(unassignedUuids);
	}

	res.render('plugins/nodebb-plugin-medals/medals', {
		...userData,
		title: `${userData.displayname}'s medals`,
		breadcrumbs: controllerHelpers.buildBreadcrumbs([{ text: userData.displayname, url: `/user/${userData.userslug}` }, { text: 'Medals', url: `/user/${userData.userslug}/medals` }]),
		canAssign,
		assignedMedals,
		notAssignedMedals,
		canFavourite: canFavourite || userData.isSelf,
		groupings: _.uniq(medals.map(medal => medal.grouping)).filter(grouping => !!grouping),
	});
};

module.exports = Controllers;
