'use strict';

define('forum/plugins/nodebb-plugin-medals/medals', ['api', 'alerts', 'nodebb-plugin-medals/helpers'], function (api, alerts, medalHelpers) {
	const Medals = {};

	Medals.init = () => {
		if (ajaxify.data.isAdminOrGlobalMod) {
			medalHelpers.loadJQueryUI(() => {
				$('.medal-container').draggable({
					revert: true,
					classes: {
						'ui-draggable-dragging': 'dragging',
					},
				});

				$('#assigned').droppable({
					accept: '#unassigned .medal-container',
					classes: {
						'ui-droppable-active': 'active',
						'ui-droppable-hover': 'hover',
					},
					drop: function (event, ui) {
						$(ui.draggable).detach().css({ top: 0, left: 0 }).appendTo(this);
						const $droppedMedal = $(ui.draggable);
						const uuid = $droppedMedal.data('uuid');
						console.log(`Assign ${uuid} to ${ajaxify.data.uid}`);

						api.post('/plugins/medals/user', { uid: ajaxify.data.uid, uuid }, (err) => {
							if (err) {
								$(ui.draggable).detach().css({ top: 0, left: 0 }).appendTo($('#unassigned'));
								alerts.error('Something went wrong. Please check the console for details.', 2500);
								console.error(err.message);
							}
						});
					},
				});

				$('#unassigned').droppable({
					accept: '#assigned .medal-container',
					classes: {
						'ui-droppable-active': 'active',
						'ui-droppable-hover': 'hover',
					},
					drop: function (event, ui) {
						$(ui.draggable).detach().css({ top: 0, left: 0 }).appendTo(this);
						const $droppedMedal = $(ui.draggable);
						const uuid = $droppedMedal.data('uuid');

						api.delete('/plugins/medals/user', { uid: ajaxify.data.uid, uuid }, (err) => {
							if (err) {
								$(ui.draggable).detach().css({ top: 0, left: 0 }).appendTo($('#assigned'));
								alerts.error('Something went wrong. Please check the console for details.', 2500);
								console.error(err.message);
							}
						});
					},
				});
			});
		}
	};

	return Medals;
});
