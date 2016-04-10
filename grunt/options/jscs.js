module.exports = function(grunt) {
    return {
        options: {
          config: "<%= paths.src %>/.jscs.jquery.json",
        },
        src: {
            files: {
                src: [
                    "<%= jshint.src.src %>",
                ]
            }
        },
    };
};
