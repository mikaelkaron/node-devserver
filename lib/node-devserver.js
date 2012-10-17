module.exports = function DEVServer(middlewares) {
	return require("http-proxy").createServer.apply(null, middlewares.map(function (middleware) {
		return require(middleware.module).apply(null, middleware.arguments);
	}));
};