/*
 * node-devserver
 * https://github.com/mikaelkaron/node-devserver
 *
 * Copyright (c) 2013 Mikael Karon
 * Licensed under the MIT license.
 */
module.exports = function(grunt) {
	"use strict";

	grunt.initConfig({
		"jshint": {
			"all": [
				"Gruntfile.js",
				"lib/**/*.js"
			],
			"options": {
				"jshintrc": ".jshintrc"
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.registerTask("test", [ "jshint" ]);
	grunt.registerTask("default", [ "test" ]);
};
