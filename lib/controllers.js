'use strict';

const MedalHelpers = require('./helpers');

const Controllers = {};

Controllers.renderAdminPage = async (req, res) => {
	const medals = await MedalHelpers.getMedals();
	res.render('admin/plugins/medals', {
		medals: medals || [],
	});
};

Controllers.renderMedalsPage = async (req, res) => {
	res.render('medals', {
		title: 'Medals',
	});
};

module.exports = Controllers;
