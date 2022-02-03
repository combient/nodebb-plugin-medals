'use strict';

define('admin/plugins/medals', ['settings', 'uploader', 'iconSelect', 'components', 'alerts'], function (settings, uploader, iconSelect, components, alerts) {
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
			const uuid = $item.find('[name="uuid"]').val();
			const addedByUid = parseInt($item.find('[name="addedByUid"]').val(), 10);
			const timestamp = $item.find('[name="timestamp"]').val();
			const description = $item.find('[name="description"]').val();
			const className = $item.find('[name="className"]').val();
			const icon = $item.find('[name="icon"]').val();
			const medalColor = $item.find('[name="medalColor"]').val();
			const iconColor = $item.find('[name="iconColor"]').val();

			const medal = {
				name,
				uuid,
				description,
				className,
				icon,
				medalColor,
				iconColor,
				addedByUid,
				timestamp,
			};

			if (!name || !description || !icon || !uuid) {
				throw new Error('Not all required fields are filled out.');
			}

			collectedSettings.medals.push(medal);
		});

		return collectedSettings;
	}

	function saveSettings() {
		try {
			const values = collectSettings();

			socket.emit('admin.settings.set', {
				hash: 'medals',
				values,
			}, function (err) {
				if (err) {
					alerts.error(err.message, 2000);
				} else {
					alerts.success('[[admin/admin:changes-saved]]', 2000);
				}
			});
		} catch (error) {
			alerts.error(error.message, 2000);
			console.error(error);
		}
	}

	function setupInteraction() {
		components.get('nodebb-plugin-medals/add-medal-btn').off('click').on('click', () => {
			app.parseAndTranslate('admin/plugins/partials/medals-list/item', {
				uuid: utils.generateUUID(),
				iconColor: '#ffffff',
				medalColor: '#000000',
				addedByUid: config.uid,
				timestamp: Date.now(),
			}, (html) => {
				const $listItem = $(html);
				$('[data-type="medals-list"]').append($listItem);
				setupIconSelectors($listItem);
				setupColorInputs();
				setupInteraction();
			});
		});

		components.get('nodebb-plugin-medals/delete-medal').off('click').on('click', (ev) => {
			const $target = $(ev.target);
			const $item = $target.closest('[data-type="item"]');

			bootbox.confirm('Are you sure you want to remove this medal?', function (confirm) {
				if (confirm) {
					$item.remove();
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
