'use strict';

define('forum/plugins/nodebb-plugin-medals/medals', ['nodebb-plugin-medals/helpers'], function (medalHelpers) {
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
						console.log(`Unassign ${uuid} from ${ajaxify.data.uid}`);
					},
				});
			});
		}
	};

	return Medals;
});
