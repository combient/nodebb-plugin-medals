'use strict';

define('nodebb-plugin-medals/helpers', [], () => {
	const Helpers = {};

	Helpers.loadJQueryUI = async (callback) => {
		require([
			'jquery-ui/widgets/sortable',
			'jquery-ui/widgets/draggable',
			'jquery-ui/widgets/droppable',
		], function () {
			callback();
		});
	};

	return Helpers;
});
