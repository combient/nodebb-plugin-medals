'use strict';

const MedalHelpers = require('./helpers');
const { controllerHelpers } = require('./nodebb');

const API = {};

API.getMedals = async () => {
	const medals = await MedalHelpers.getMedals();
	return medals;
};

API.deleteMedal = async (req, res) => {
	try {
		const { uuid } = req.body;

		if (!uuid) throw new Error('');

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

module.exports = API;
