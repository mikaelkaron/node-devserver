exports = module.exports = function frontend() {
	"use strict";

	var send = require("send");
	var pause = require("pause");
	var url = require("url");
	var path = require("path");

	var RE_STRIP = /:\d+$/;
	var RE_HOST = /\./;

	var roots = Array.prototype.slice.call(arguments);

	return function (request, response, next) {
		var method = request.method;

		if (method !== "GET" && method !== "HEAD") {
			return next();
		}

		var paused = pause(request);
		var pathname = url.parse(request.url).pathname;
		var hostname_parts = request.headers.host.replace(RE_STRIP, "").split(RE_HOST);

		hostname_parts.forEach(function (candidate, index) {
			hostname_parts[index] = hostname_parts.slice(index).join(".");
		});

		hostname_parts.push("");

		var candidates = roots.map(function (root) {
			return hostname_parts.map(function (hostname) {
				return path.join(root, hostname);
			});
		}).reduce(function (a, b) {
			return a.concat(b);
		});

		function serve() {
			var candidate = candidates.shift();

			if (candidate) {
				send(request, pathname)
					.root(candidate)
					.on("error", serve)
					.pipe(response);
			}
			else {
				next();
				paused.resume();
			}
		}

		serve();
	};
};