'use strict';

var _ = require("underscore");
var timer = require("grunt-timer");

function loadConfig(grunt, path) {
    var glob = require('glob');
    var config = {};

    glob.sync('*', {cwd: path}).forEach(function(option) {
        grunt.log.debug("Loading config from: " + option);

        var result = require(path + option)(grunt);
        var key = option.replace(/\.js$/,'');

        if (_.has(result, '_multiconfig')) {
            _.each(result, function(value, innerKey) {
                grunt.log.debug("  key: " + innerKey);
                config[innerKey] = value;
            });
        } else {
            grunt.log.debug("  key: " + key);
            config[key] = result;
        }
    });

    return config;
}

module.exports = function (grunt) {

    // Project configuration.
    require("load-grunt-tasks")(grunt);

    // Enable task timer
    timer.init(grunt, { friendlyTime: true });

    // Load rest of tasks from ./grunt/tasks/*.js
    grunt.loadTasks('grunt/tasks');

    // generates banner from info in package.json
    var getBanner = require("./grunt/helpers/bannerHelper")(grunt);

    // our main app config file
    var pkg = grunt.file.readJSON('package.json');

    var config = {
        pkg: pkg,
        name: "<% pkg.title || pkg.name %>",
        banner: getBanner(),
        paths: pkg.paths,
        env: process.env,
    };

    // Load task config objects from ./grunt/options/*.js
    grunt.util._.extend(config, loadConfig(grunt, './grunt/options/'));
    grunt.initConfig(config);

    grunt.registerTask('default', [ 'build', 'watch' ]);
};
