module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');
    return {
        coverage: {
            options: {
                failTask: true,
                branches: 90,
                functions: 90,
                statements: 90,
                lines: 90
            },
            excludes: [ "**/tests/**" ],
        },
        options: {
            forceExit: true,
            match: '.',
            matchall: false,
            extensions: 'js',
            specNameMatcher: 'Spec',
            junitreport: {
                report: true,
                savePath : "./<%= paths.test_results %>/unit/jasmine/",
                useDotNotation: true,
                consolidate: true
            }
        },
        unit: [ '<%= paths.tests %>/unit/' ],
        functional: [ '<%= paths.tests %>/functional/' ],
    };
};
