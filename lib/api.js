'use strict';

const MedalHelpers = require('./helpers');
const { controllerHelpers, User, accountHelpers, Events } = require('./nodebb');

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

		controllerHelpers.formatApiResponse(200, res);
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

		const canAssign = await MedalHelpers.canAssignMedals(req.uid);

		if (!canAssign) return controllerHelpers.notAllowed(req, res);

		await MedalHelpers.assignMedalToUser(uuid, uid, req.uid);

		controllerHelpers.formatApiResponse(200, res);
	} catch (error) {
		throw new Error(error.message);
	}
};

API.unassignMedal = async (req, res) => {
	try {
		const { uid, uuid } = req.body;

		if (!uuid) throw new Error('No uuid provided');
		if (!uid) throw new Error('No user id provided');

		const canAssign = await MedalHelpers.canAssignMedals(req.uid);

		if (!canAssign) return controllerHelpers.notAllowed(req, res);

		await MedalHelpers.unassignMedalToUser(uuid, uid, req.uid);

		controllerHelpers.formatApiResponse(200, res);
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

API.setUserMedalFavourite = async (req, res) => {
	try {
		const { uid, uuid, favourite } = req.body;

		const canFavourite = await MedalHelpers.canFavouriteMedals(req.uid);

		if (!canFavourite && uid !== req.uid) return controllerHelpers.notAllowed(req, res);

		const favouriteFunc = favourite ? MedalHelpers.favouriteMedal : MedalHelpers.unfavouriteMedal;
		
		await favouriteFunc(uuid, uid);
		
		if (favourite) {
			const medals = await MedalHelpers.getUserMedals(uid);
			for await (const medal of medals) {
				if (medal.uuid !== uuid) await MedalHelpers.unfavouriteMedal(medal.uuid, uid);
			}
		}

		await Events.log({
			type: `nodebb-plugin-medals:${favourite ? 'favourite' : 'unfavourite'}`,
			uid: callerUid,
			uuid,
		});

		controllerHelpers.formatApiResponse(200, res);
	} catch (error) {
		throw new Error(error.message);
	}
};

API.getUserFavouriteMedal = async (req, res) => {
	try {
		const { uid } = req.params;
		if (!uid) throw new Error('Missing parameter uid');

		const userMedals = await MedalHelpers.getUserMedals(uid);

		const favourite = userMedals.find(medal => medal.favourite);

		controllerHelpers.formatApiResponse(200, res, { favourite });
	} catch (error) {
		throw new Error(error.message);
	}
};

module.exports = API;
