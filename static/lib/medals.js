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

						api.post('/plugins/medals/user', { uid: ajaxify.data.uid, uuid }, (err) => {
							if (err) {
								$(ui.draggable).detach().css({ top: 0, left: 0 }).appendTo($('#unassigned'));
								alerts.error('Something went wrong. Please check the console for details.', 2500);
								console.error(err.message);
							} else alerts.success('Medal successfully assigned.');
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
							} else alerts.success('Medal successfully unassigned.');
						});
					},
				});
			});
		}

		if (ajaxify.data.isSelf) {
			$('.btn-morph').off('click').on('click', function (ev) {
				$(this).toggleClass('plus').toggleClass('heart');

				if ($(this).find('b.drop').length === 0) {
					$(this).prepend('<b class="drop"></b>');
				}

				var drop = $(this).find('b.drop').removeClass('animate');
				var x = ev.pageX - (drop.width() / 2) - $(this).offset().left;
				var y = ev.pageY - (drop.height() / 2) - $(this).offset().top;

				drop.css({ top: y + 'px', left: x + 'px' }).addClass('animate');
			});

			$('.btn-morph').tooltip({
				placement: $(this).attr('title-placement') || 'top',
				title: $(this).attr('title'),
				container: '#content',
			});
		}
	};

	return Medals;
});
