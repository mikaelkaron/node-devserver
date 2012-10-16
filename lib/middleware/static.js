module.exports = function static(options) {

	var send = require("send");
	var pause = require("pause");
	var url = require("url");
	var path = require("path");

	var RE_STRIP = /:\d+$/;
	var RE_HOST = /\./;
	var ROOT = "root";

	if (!options.hasOwnProperty(ROOT)) {
		throw new Error("static root required");
	}

	var root = options[ROOT];

	return function (request, response, next) {
		var method = request.method;

		if (method !== "GET" && method !== "HEAD") {
			return next();
		}

		var pathname = url.parse(request.url).pathname;
		var candidates = request.headers.host.replace(RE_STRIP, "").split(RE_HOST);
		var paused = pause(request);
		var i;
		var iMax;

		for (i = 0, iMax = candidates.length; i < iMax; i++) {
			candidates[i] = path.join(root, candidates.slice(i).join("."));
		}

		candidates.push(root);

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
	}
};