module.exports = function (grunt) {
    return {
        main: {
            options: {
                updateType: 'fail',        // Fail task if an outdated package was found.
                reportUpdated: false,      // don't report up-to-date packages
                semver: true,              // auto-update, but stay within semver when updating
                packages: {
                    devDependencies: true,
                    dependencies: true
                },
                packageJson: null,         // use matchdep default findup to locate package.json
                reportOnlyPkgs: []         // use updateType action on all packages
            }
        }
    };
};
