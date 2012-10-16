module.exports = function backend(options) {
	var OBJECT_PROTOTYPE_TOSTRING = Object.prototype.toString;
	var TOSTRING_OBJECT = OBJECT_PROTOTYPE_TOSTRING.call(Object.prototype);
	var TOSTRING_ARRAY = OBJECT_PROTOTYPE_TOSTRING.call(Array.prototype);
	var TOSTRING_STRING = OBJECT_PROTOTYPE_TOSTRING.call(String.prototype);
	var REGEX = "regex";
	var PROXY = "proxy";

	var XRegExp = require("xregexp").XRegExp;

	Object.keys(options).forEach(function (key) {
		var option = options[key];

		if (!option.hasOwnProperty(PROXY)) {
			throw new Error("backend option.proxy required");
		}

		option[REGEX] = XRegExp(key);
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

	return function (request, response, proxy) {
		var url = request.headers["host"] + request.url;

		Object.keys(options).some(function (key) {
			var option = copy(options[key]);
			var matches = XRegExp.exec(url, option[REGEX]);

			if (matches) {
				transform(option, matches);

				proxy.proxyRequest(request, response, option[PROXY]);

				return true;
			}
		});
	}
};