'use strict';

define('admin/plugins/medals', ['settings', 'uploader', 'iconSelect', 'components', 'alerts', 'api'], function (settings, uploader, iconSelect, components, alerts, api) {
	var ACP = {};

	ACP.init = function () {
		setupIconSelectors();
		setupColorInputs();
		setupInteraction();

		$('#save').on('click', saveSettings);
	};

	function collectSettings() {
		const collectedSettings = {
			medals: [],
		};

		$('[data-type="item"]').each((index, element) => {
			const $item = $(element);

			const name = $item.find('[name="name"]').val();
			const addedByUid = parseInt($item.find('[name="addedByUid"]').val(), 10);
			const description = $item.find('[name="description"]').val();
			const className = $item.find('[name="className"]').val();
			const icon = $item.find('[name="icon"]').val();
			const medalColor = $item.find('[name="medalColor"]').val();
			const iconColor = $item.find('[name="iconColor"]').val();
			const uuid = $item.find('[name="uuid"]').val();
			const timestamp = parseInt($item.find('[name="timestamp"]').val(), 10);

			const medal = {
				name,
				description,
				className,
				icon,
				medalColor,
				iconColor,
				addedByUid,
				uuid,
				timestamp,
			};

			if (!name || !description || !icon) {
				throw new Error('Not all required fields are filled out.');
			}

			collectedSettings.medals.push(medal);
		});

		return collectedSettings;
	}

	function saveSettings() {
		try {
			$('#save').prop('disabled', true);
			const values = collectSettings();

			api.put('/plugins/medals', { medals: values.medals }, (err, response) => {
				$('#save').prop('disabled', false);
				if (err) {
					alerts.error(err.message, 2500);
					console.error(err);
					return;
				}
				app.parseAndTranslate('admin/plugins/partials/medals-list/list', {
					medals: response.medals,
				}, (html) => {
					const $listItems = $(html);
					$('[data-type="item"]').remove();
					$('[data-type="medals-list"]').html($listItems);
					setupIconSelectors();
					setupColorInputs();
					setupInteraction();
					alerts.success('Medals saved', 1500);
				});
			});
		} catch (error) {
			alerts.error(error.message, 2000);
			console.error(error);
		}
	}

	function setupInteraction() {
		components.get('nodebb-plugin-medals/add-medal-btn').off('click').on('click', () => {
			components.get('nodebb-plugin-medals/add-medal-btn').prop('disabled', true);
			app.parseAndTranslate('admin/plugins/partials/medals-list/item', {
				iconColor: '#ffffff',
				medalColor: '#000000',
				addedByUid: config.uid,
			}, (html) => {
				const $listItem = $(html);
				$('[data-type="medals-list"]').append($listItem);
				setupIconSelectors($listItem);
				setupColorInputs();
				setupInteraction();
				components.get('nodebb-plugin-medals/add-medal-btn').prop('disabled', false);
			});
		});

		components.get('nodebb-plugin-medals/delete-medal').off('click').on('click', (ev) => {
			const $target = $(ev.target);
			$target.prop('disabled', true);
			const $item = $target.closest('[data-type="item"]');

			bootbox.confirm('Are you sure you want to remove this medal?', function (confirm) {
				if (confirm) {
					const uuid = $item.find('[name="uuid"]').val();

					if (uuid) {
						api.delete('/plugins/medal', { uuid }, (err) => {
							if (err) {
								alerts.error(err.message, 2500);
								$target.prop('disabled', false);
								return;
							}
							alerts.success('Medal deleted', 1500);
							$item.remove();
						});
					} else {
						$item.remove();
					}
				}
			});
		});
	}

	function setupIconSelectors(newItem) {
		const clickTarget = newItem || $('[data-type="item"]');
		clickTarget.off('click', '.medal-icon').on('click', '.medal-icon', function () {
			const $iconEl = $(this).find('i');

			iconSelect.init($iconEl, function (el) {
				const $iconInput = $(el).parent().siblings('[name="icon"]');
				const newIconClass = el.attr('value');

				$iconInput.val(newIconClass);
			});
		});
	}

	function setupColorInputs() {
		$('[data-settings="colorpicker"]').each((index, element) => {
			const $colorInput = $(element);
			$colorInput.off('change', updateColors).on('change', updateColors);
			updateColors($colorInput);
		});
	}

	function updateColors(event) {
		const pickerElement = event.target || event;
		const $picker = $(pickerElement);
		const item = $picker.closest('[data-type="item"]');
		const $icon = item.find('.medal-icon');
		const color = $picker.val();
		const name = $picker.attr('name');

		if (name.indexOf('medal') > -1) $icon.css('background-color', color);
		else $icon.css('color', color);
	}

	return ACP;
});
