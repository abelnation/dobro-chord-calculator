module.exports = function(grunt) {
    return {
        coverage: {
            APP_DIR_FOR_CODE_COVERAGE: './<%= paths.coverage %>/src_inst/'
        }
    };
};
