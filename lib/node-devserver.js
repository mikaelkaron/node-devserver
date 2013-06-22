var RE_MODULE = /^((?:.*[\/\\])?[^\.]+)(?:\.(.*))?/;
var RE_SEPARATOR = /\./;

function getModule(name) {
	var matches = RE_MODULE.exec(name);
	var module_root = matches[1];
	var module_parts = matches[2];
	var result = require(module_root);

	if (module_parts) {
		module_parts.split(RE_SEPARATOR).forEach(function (part) {
			result = result[part];
		});
	}

	return result;
}

exports = module.exports = function devserver() {
	"use strict";

	var connect = require("connect");
	var server = connect();

	Array.prototype.slice.apply(arguments).forEach(function (middleware) {
		server.use(getModule(middleware.module).apply(null, middleware.arguments));
	});

	return server;
};

[ "frontend", "backend" ].forEach(function (name) {
	exports.__defineGetter__(name, function load() {
		return require("./middleware/" + name);
	});
});
