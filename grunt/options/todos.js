'use strict';

module.exports = function(grunt) {
    return {
        options: {},
        js: {
            src: [
                "<%= jshint.src.src %>",
            ],
        },
        json: {
            src: [
                "./package.json",
            ],
        },
        test: {
            src: [
                "<%= jshint.tests.src %>",
            ],
        },
        grunt: {
            src: [
                "./Gruntfile.js",
                "./grunt/options/*.js",
                "./grunt/tasks/*.js",
                "!./grunt/tasks/todos.js"
            ],
        },
    };
};
