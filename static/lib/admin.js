'use strict';

define('admin/plugins/medals', ['settings', 'uploader', 'iconSelect', 'components', 'alerts'], function (settings, uploader, iconSelect, components, alerts) {
	var ACP = {};

	ACP.init = function () {
		socket.emit('admin.settings.get', {
			hash: 'medals',
		}, function (err, values) {
			if (err) {
				alerts.error('Could not load settings. Please open the console for details.', 2500);
				console.error(err.message, err);
				return;
			}
			loadSettings(values);

			setupInteraction();
			setupColorInputs();
		});

		$('#save').on('click', saveSettings);
	};

	function loadSettings(data) {
		console.log(data);
	}

	function collectSettings() {
		const collectedSettings = {
			medals: [],
		};

		$('[data-type="item"]').each((index, element) => {
			const $item = $(element);

			const name = $item.find('[name="name"]').val();
			const description = $item.find('[name="description"]').val();
			const className = $item.find('[name="className"]').val();
			const icon = $item.find('[name="icon"]').val();
			const medalColor = $item.find('[name="medalColor"]').val();
			const iconColor = $item.find('[name="iconColor"]').val();

			if (!name || !description || !icon) {
				throw new Error('Not all required fields are filled out.');
			}

			collectedSettings.medals.push({
				name,
				description,
				className,
				icon,
				medalColor,
				iconColor,
			});
		});

		return collectedSettings;
	}

	function saveSettings() {
		try {
			const values = collectSettings();
			console.log('🚀 ~ file: admin.js ~ line 25 ~ saveSettings ~ values', values);

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
			app.parseAndTranslate('admin/plugins/partials/medals-list/item', {}, (html) => {
				const $listItem = $(html);
				$('[data-type="medals-list"]').append($listItem);
				setupIconSelectors($listItem);
				setupColorInputs();
				setupInteraction();
			});
		});

		components.get('nodebb-plugin-medals/delete-medal').off('click').on('click', (ev) => {
			const $target = $(ev.target);
			console.log($target);
			const medalId = $target.siblings('[name="medal-id"]').val();
            console.log('🚀 ~ file: admin.js ~ line 96 ~ components.get ~ medalId', medalId);
		});
	}

	function setupIconSelectors(newItem) {
		const clickTarget = newItem || $('[data-type="item"]');
		clickTarget.off('click', '.medal-icon').on('click', '.medal-icon', function () {
			console.log(this);
			const iconEl = $(this).find('i');
			iconSelect.init(iconEl, function (el) {
				const newIconClass = el.attr('value');
				$(iconEl).data('icon', newIconClass);
			});
		});
	}

	function setupColorInputs() {
		$('[data-type="item"]').each((index, element) => {
			const $colorInput = $(element).find('[data-settings="colorpicker"]');
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
