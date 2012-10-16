module.exports = function DEVServer(options) {
	var middlewares = [{
		"name" : "frontend",
		"module" : require("./middleware/frontend")
	}, {
		"name" : "backend",
		"module" : require("./middleware/backend")
	}]
		.map(function (middleware) {
			var name = middleware.name;

			return options.hasOwnProperty(name)
				? middleware.module(options[name])
				: null;
		})
		.filter(function (middleware) {
			return middleware !== null;
		});

	var server = require("http-proxy");

	return server.createServer.apply(server, middlewares);
};