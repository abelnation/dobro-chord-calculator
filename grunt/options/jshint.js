module.exports = function(grunt) {
    return {
        gruntfile: {
            options: {
                jshintrc: '.jshintrc'
            },
            src: 'Gruntfile.js'
        },
        grunttasks: {
            options: {
                jshintrc: '.jshintrc'
            },
            src: [
                '<%= paths.grunt %>/**/*.js',
            ]
        },
        src: {
            options: {
                jshintrc: '<%= paths.src %>/.jshintrc'
            },
            src: [
                './index.js',
                '<%= paths.src %>/**/*.js',
                '!<%= paths.src %>/lib/*.js',
                '!<%= paths.src %>/**/lib/*.js',
            ]
        },
        tests: {
            options: {
                jshintrc: '<%= paths.tests %>/.jshintrc'
            },
            src: [
                '<%= paths.tests %>/**/*.js',
                '<%= paths.tests %>/**/lib/**',
            ]
        },
    };
};
