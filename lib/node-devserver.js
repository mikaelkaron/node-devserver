var path = require('path');
exports = module.exports = function devserver(config) {
	"use strict";

	var connect = require("connect");
	var server = connect();

	Object.keys(config).forEach(function(module) {
		var middleware = require('./' + path.join('middleware', module));
		server.use(middleware.apply(null, config[module]));
	});

	return server;
};
