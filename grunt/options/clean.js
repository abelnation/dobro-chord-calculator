module.exports = function(grunt) {

    var pkg = grunt.file.readJSON('./package.json');
    var paths = pkg.domains;

    return {
        testresults: [ '<%= paths.test_results %>/' ],
    };
};
