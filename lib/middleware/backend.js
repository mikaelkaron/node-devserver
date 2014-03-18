exports = module.exports = function backend() {
	"use strict";

	var OBJECT_PROTOTYPE_TOSTRING = Object.prototype.toString;
	var TOSTRING_OBJECT = OBJECT_PROTOTYPE_TOSTRING.call(Object.prototype);
	var TOSTRING_ARRAY = OBJECT_PROTOTYPE_TOSTRING.call(Array.prototype);
	var TOSTRING_STRING = OBJECT_PROTOTYPE_TOSTRING.call(String.prototype);
	var REGEXP = "regexp";
	var PROXY = "proxy";

	var XRegExp = require("xregexp").XRegExp;
	var httpProxy = require("http-proxy");
	var proxy = new httpProxy.RoutingProxy();

	var options = Array.prototype.map.call(arguments, function (option) {
		[ REGEXP, PROXY].forEach(function (property) {
			if (!option.hasOwnProperty(property)) {
				throw new Error(property + " is required");
			}
		});

		option[REGEXP] = XRegExp(option[REGEXP]);

		return option;
	});

	function copy(source) {
		var target;

		switch (OBJECT_PROTOTYPE_TOSTRING.call(source)) {
			case TOSTRING_OBJECT :
				target = {};

				Object.keys(source).forEach(function (key) {
					target[key] = copy(source[key]);
				});
				break;

			case TOSTRING_ARRAY :
				target = [];

				source.forEach(function (value, index) {
					target[index] = copy(value);
				});
				break;

			default :
				target = source;
		}

		return target;
	}

	function transform(target, matches) {
		switch (OBJECT_PROTOTYPE_TOSTRING.call(target)) {
			case TOSTRING_OBJECT :
				Object.keys(target).forEach(function (key) {
					target[key] = transform(target[key], matches);
				});
				break;

			case TOSTRING_ARRAY :
				target.forEach(function (value, index) {
					target[index] = transform(value, matches);
				});
				break;

			case TOSTRING_STRING :
				target = target.replace(/\${(\w+)}/, function (original, match) {
					return matches.hasOwnProperty(match)
						? matches[match]
						: original;
				});
				break;
		}

		return target;
	}

	return function (request, response, next) {
		var url = request.headers["host"] + request.url;

		if(!options.some(function (option) {
			var matches = XRegExp.exec(url, option[REGEXP]);

			if (matches) {
				option = transform(copy(option), matches);
				proxy.proxyRequest(request, response, option[PROXY]["target"]);

				return true;
			}
		})) {
			next();
		}
	};
};
