'use strict';

define('forum/medals', function () {
	var module = {};
	module.init = function () {
		$('#last-p').text('medals.js loaded!');
	};
	return module;
});
