'use strict';

define('forum/plugins/nodebb-plugin-medals/medals', ['nodebb-plugin-medals/helpers'], function (medalHelpers) {
	const Medals = {};

	Medals.init = () => {
		if (ajaxify.data.isAdminOrGlobalMod) {
			medalHelpers.loadJQueryUI(() => {
				$('.medal-container').draggable({
					revert: true,
				});

				$('#assigned').droppable({
					accept: '#unassigned .medal-container',
					classes: {
						'ui-droppable-active': 'active',
						'ui-droppable-hover': 'hover',
					},
					drop: function (event, ui) {
						console.log('🚀 ~ file: medals.js ~ line 15 ~ event, ui', event, ui);
						$(ui.draggable).detach().css({ top: 0, left: 0 }).appendTo(this);
					},
				});

				$('#unassigned').droppable({
					accept: '#assigned .medal-container',
					classes: {
						'ui-droppable-active': 'active',
						'ui-droppable-hover': 'hover',
					},
					drop: function (event, ui) {
						console.log('🚀 ~ file: medals.js ~ line 15 ~ event, ui', event, ui);
						$(ui.draggable).detach().css({ top: 0, left: 0 }).appendTo(this);
					},
				});
			});
		}
	};

	return Medals;
});
