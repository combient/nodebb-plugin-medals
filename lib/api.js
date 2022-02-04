'use strict';

const MedalHelpers = require('./helpers');

const API = {};

API.saveMedals = async (req) => {
	try {
		const { medals } = req.body;

		const savedMedals = await MedalHelpers.saveMedals(medals);

		return savedMedals;
	} catch (error) {
		throw new Error(error.message);
	}
};

API.getMedals = async () => {
	const medals = await MedalHelpers.getMedals();
	return medals;
};

module.exports = API;
