module.exports = function(grunt) {

    var pkg = grunt.file.readJSON('./package.json');
    var variants;

    var result = {
        options: {
            stdout: true,
            stderr: true,
        },
        env: {
            // Sets shell env var so other shell scripts can access them
            command: "export NODE_ENV=<%= grunt.task.current.args[0] %>",
        },
        setup: {
            // runs standard setup script. add custom setup commands to that file
            command: '<%= paths.script %>/setup.sh'
        }
    };
    return result;
};
