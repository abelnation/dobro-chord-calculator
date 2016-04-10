module.exports = function(grunt) {
    return {
        watch: {
            options: {
              port: 8084,
              base: './',
              debug: true,
              livereload: true,
              keepalive: true,
              // open: true
            },
        },

        jasmine: {
            options: {
              port: 8083,
              base: './',

              // NOTE: this is used to running connect:test multiple times in a task
              //       doesn't fail the task
              useAvailablePort: true,
              debug: true,
            }
        },

        casperjs: {
            options: {
              port: 8083,
              base: './',

              // NOTE: this is used to running connect:test multiple times in a task
              //       doesn't fail the task
              useAvailablePort: true,
              debug: true,
            }
        },

    };
};
