require("fs").readFile("example.config.json", function (err, data) {
	if (err) {
		throw new Error(err);
	}

	require("./lib/node-devserver").apply(null, JSON.parse(data.toString())).listen(8080);
});
