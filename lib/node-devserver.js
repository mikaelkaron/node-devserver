module.exports = function DEVServer() {
	var server = require("connect")();

	Array.prototype.slice.apply(arguments).forEach(function (middleware) {
		server.use(require(middleware.module).apply(null, middleware.arguments));
	});

	return server;
};