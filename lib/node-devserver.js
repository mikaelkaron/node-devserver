module.exports = function DEVServer(options) {
	var STATIC = "static";
	var BACKEND = "backend";

	if (!options.hasOwnProperty(STATIC)) {
		throw new Error("node-devserver options.static required");
	}

	if (!options.hasOwnProperty(BACKEND)) {
		throw new Error("node-devserver options.backend required");
	}

	console.log(options);
	return require("http-proxy").createServer(require("./middleware/static")(options[STATIC]), require("./middleware/backend")(options[BACKEND]));
};