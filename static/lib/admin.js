'use strict';

define('admin/plugins/medals', ['settings', 'uploader', 'iconSelect', 'components', 'translator'], function (settings, uploader, iconSelect, components, translator) {
	var ACP = {};

	ACP.init = function () {
		// settings.load('medals', $('.medals-settings'), function () {

		// });
		$('#save').on('click', saveSettings);
		setupUploader();
		setupInteraction();
		setupColorInputs();
	};

	function saveSettings() {
		settings.save('medals', $('.medals-settings'), function () {
			app.alert({
				type: 'success',
				alert_id: 'medals-saved',
				title: 'Settings Saved',
				message: 'Please reload your NodeBB to apply these settings',
				clickfn: function () {
					socket.emit('admin.reload');
				},
			});
		});
	}

	function setupInteraction() {
		components.get('add-medal-btn').off('click').on('click', () => {
			app.parseAndTranslate('admin/plugins/partials/medals-list/item', {}, (html) => {
				console.log(html);
				const listItem = $(html);
				$('[data-type="medals-list"]').append(listItem);
				console.log(listItem);
				setupIconSelectors(listItem);
				setupColorInputs();
			});
		});
	}

	function setupIconSelectors(newItem) {
		const clickTarget = newItem || $('[data-type="item"]');
		clickTarget.off('click', '.medal-icon').on('click', '.medal-icon', function () {
			console.log(this);
			const iconEl = $(this).find('i');
			iconSelect.init(iconEl, function (el) {
				const newIconClass = el.attr('value');
				$(el).data('icon', newIconClass);
				// const index = iconEl.parents('[data-index]').attr('data-index');
				// $('#active-navigation [data-index="' + index + '"] i.nav-icon').attr('class', 'fa fa-fw ' + newIconClass);
				// iconEl.siblings('[name="iconClass"]').val(newIconClass);
				// iconEl.siblings('.change-icon-link').toggleClass('hidden', !!newIconClass);
			});
		});
	}

	function setupColorInputs() {
		$('[data-type="item"]').each((index, element) => {
			const colorInput = $(element).find('[data-settings="colorpicker"]');
			colorInput.off('change', updateColors).on('change', updateColors);
			updateColors(colorInput);
		});
	}

	function updateColors(event) {
		const pickerElement = event.target || event;
		const picker = $(pickerElement);
		const item = picker.closest('[data-type="item"]');
		const icon = item.find('.medal-icon');
		const color = picker.val();
		const name = picker.attr('name');

		if (name.indexOf('medal') > -1) icon.css('background-color', color);
		else icon.css('color', color);
	}

	function setupUploader() {
		$('[data-type="item"] input[data-action="upload"]').each(() => {
			console.log(this);
			var uploadBtn = $(this);

			const uploadHandler = () => {
				uploader.show({
					route: config.relative_path + '/api/admin/upload/file',
					params: {
						folder: 'medals',
					},
					accept: 'image/*',
				}, (image) => {
					$('#' + uploadBtn.attr('data-target')).val(image);
				});
			};

			uploadBtn.off('click', uploadHandler).on('click', uploadHandler);
		});
	}

	return ACP;
});
