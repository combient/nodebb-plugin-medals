'use strict';

define('admin/plugins/medals', ['settings', 'uploader'], function (settings, uploader) {
	var ACP = {};

	ACP.init = function () {
		setupUploader();
		settings.load('medals', $('.medals-settings'), function () {
			setupColorInputs();
		});
		$('#save').on('click', saveSettings);
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

	function setupColorInputs() {
		var colorInputs = $('[data-settings="colorpicker"]');
		colorInputs.on('change', updateColors);
		updateColors();
	}

	function updateColors() {
		$('#preview').css({
			color: $('#color').val(),
			'background-color': $('#bgColor').val(),
		});
	}

	function setupUploader() {
		$('#content input[data-action="upload"]').each(function () {
			var uploadBtn = $(this);
			uploadBtn.on('click', function () {
				uploader.show({
					route: config.relative_path + '/api/admin/upload/file',
					params: {
						folder: 'medals',
					},
					accept: 'image/*',
				}, function (image) {
					$('#' + uploadBtn.attr('data-target')).val(image);
				});
			});
		});
	}

	return ACP;
});
