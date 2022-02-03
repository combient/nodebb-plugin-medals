'use strict';

const { Meta } = require('./nodebb');

const Controllers = {};

Controllers.renderAdminPage = async (req, res) => {
	const medalsSettings = await Meta.settings.get('medals');
	res.render('admin/plugins/medals', {
		medals: medalsSettings.medals || [],
	});
};

Controllers.renderMedalsPage = async (req, res) => {
	res.render('medals', {
		title: 'Medals',
	});
};

module.exports = Controllers;
