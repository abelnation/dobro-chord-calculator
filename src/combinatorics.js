
var _ = require('underscore');

function Combinatorics() {}
_.extend(Combinatorics, {
    prependValueToArrays: function(value, arrays) {
        if (!arrays || arrays.length === 0) {
            return [ [ value ] ];
        }

        return _.chain(arrays)
            .map(function(array) {
                return Array.prototype.concat([ value ], array);
            })
            .value();
    },

    arrayWithoutElementAt: function(arr, index) {
        return arr.slice(0, index).concat(arr.slice(index+1));
    },

    generatePermutations: function(choices) {
        if (choices.length === 0) {
            return [];
        } else {
            return _.chain(choices)
                .map(function(choice, idx) {
                    // TODO: without removes all instances of choice
                    var suffixes = Combinatorics.generatePermutations(Combinatorics.arrayWithoutElementAt(choices, idx));
                    var prepended = Combinatorics.prependValueToArrays(choice, suffixes);
                    return prepended
                })
                .flatten(true)
                .value();
        }
    },

    generateCombinations: function(choices, length) {
        if (!length) {
            return [[]];
        }

        return _.chain(choices)
            .map(function(choice) {
                // TODO: without removes all instances of choice
                var suffixes = Combinatorics.generateCombinations(choices, length - 1);
                var prepended = Combinatorics.prependValueToArrays(choice, suffixes);
                return prepended
            })
            .flatten(true)
            .value();
    }
});

_.extend(Combinatorics, {
    install: function(underscoreObj) { underscoreObj.mixin(this.underscoreMixins); },
    underscoreMixins: {
        'combinations': Combinatorics.generateCombinations,
        'permutations': Combinatorics.generatePermutations
    }
});

module.exports = Combinatorics;

if (require.main === module) {
    console.log("arrayWithoutElementAt");
    var x = [ 1, 2, 3, 4, 5 ];
    for (var i = 0; i<x.length; i++) {
        console.log(Combinatorics.arrayWithoutElementAt(x, i));
    }

    console.log("Permutations");
    console.log(Combinatorics.generatePermutations([ ]));
    console.log(Combinatorics.generatePermutations([ 1 ]));
    console.log(Combinatorics.generatePermutations([ 1, 2 ]));
    console.log(Combinatorics.generatePermutations([ 1, 2, 3 ]));

    console.log(Combinatorics.generatePermutations([ "n", 0, 0, 0, 0, 0 ]));

    console.log("Combinatorics");
    console.log(Combinatorics.generateCombinations([ ], 3));
    console.log(Combinatorics.generateCombinations([ 1 ], 3));
    console.log(Combinatorics.generateCombinations([ 1, 2 ], 3));
    console.log(Combinatorics.generateCombinations([ 1, 2, 3 ], 3));
}
