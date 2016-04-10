
var _ = require('underscore');

function Util() {}
_.extend(Util, {
    isSubset: function(array, potentialSuperset) {
        return _.chain(array)
            .difference(potentialSuperset)
            .isEmpty()
            .value();
    }
});
_.extend(Util, {
    install: function(underscoreObj) { underscoreObj.mixin(this.underscoreMixins); return Util; },
    underscoreMixins: {
        'isSubset': Util.isSubset
    },
});

module.exports = Util;

if (require.main === module) {

}
