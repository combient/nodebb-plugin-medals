'use strict';

const MedalHelpers = require('./helpers');
const { controllerHelpers, User, accountHelpers } = require('./nodebb');

const API = {};

API.getMedals = async () => {
	const medals = await MedalHelpers.getAllMedals();
	return medals;
};

API.deleteMedal = async (req, res) => {
	try {
		const { uuid } = req.body;

		if (!uuid) throw new Error('No uuid provided');

		await MedalHelpers.deleteMedal(uuid);

		controllerHelpers.formatApiResponse(200, res, {});
	} catch (error) {
		throw new Error(error.message);
	}
};

API.saveMedals = async (req, res) => {
	try {
		const { medals } = req.body;

		const savedMedals = await MedalHelpers.saveMedals(medals);

		controllerHelpers.formatApiResponse(200, res, {
			medals: savedMedals,
		});
	} catch (error) {
		throw new Error(error.message);
	}
};

API.assignMedal = async (req, res) => {
	try {
		const { uid, uuid } = req.body;

		if (!uuid) throw new Error('No uuid provided');
		if (!uid) throw new Error('No user id provided');

		const isAdminOrGlobalMod = await User.isAdminOrGlobalMod(req.uid);

		if (!isAdminOrGlobalMod) return controllerHelpers.notAllowed(req, res);

		await MedalHelpers.assignMedalToUser(uuid, uid);

		controllerHelpers.formatApiResponse(200, res, {});
	} catch (error) {
		throw new Error(error.message);
	}
};

API.unassignMedal = async (req, res) => {
	try {
		const { uid, uuid } = req.body;
		console.log('🚀 ~ file: api.js ~ line 63 ~ API.unassignMedal= ~ uid, uuid', uid, uuid);

		if (!uuid) throw new Error('No uuid provided');
		if (!uid) throw new Error('No user id provided');

		const isAdminOrGlobalMod = await User.isAdminOrGlobalMod(req.uid);

		if (!isAdminOrGlobalMod) return controllerHelpers.notAllowed(req, res);

		await MedalHelpers.unassignMedalToUser(uuid, uid);

		controllerHelpers.formatApiResponse(200, res, {});
	} catch (error) {
		throw new Error(error.message);
	}
};

API.getUserMedals = async (req, res) => {
	try {
		const { userslug } = req.params;

		if (!userslug) throw new Error('No userslug provided');

		const isAdminOrGlobalMod = await User.isAdminOrGlobalMod(req.uid);

		if (!isAdminOrGlobalMod) return controllerHelpers.notAllowed(req, res);

		const userData = await accountHelpers.getUserDataByUserSlug(userslug, req.uid, []);
		const medals = await MedalHelpers.getUserMedals(userData.uid);

		controllerHelpers.formatApiResponse(200, res, { medals });
	} catch (error) {
		throw new Error(error.message);
	}
};

module.exports = API;
