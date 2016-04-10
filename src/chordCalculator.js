
var _ = require('underscore');
var Combinatorics = require('./combinatorics').install(_);

var canonicalNotes =[
    "c", "c#", "d", "d#",
    "e", "f", "f#", "g",
    "g#", "a", "a#", "b"
];
var numTones = canonicalNotes.length;

function ChordCalculator() {}
_.extend(ChordCalculator.prototype, {

});

function GuitarChordCalculator(tuning) {
    this.tuning = tuning;
}
_.extend(GuitarChordCalculator.prototype, {

    generateAllBarChords: function() {
        return _.combinations([0, "n", "x"], this.tuning.length);
    },

    chordForAbstractChordAtFret: function(abstractChord, fret) {
        return _.chain(abstractChord)
            .map(function(chordFret) { return (_.isString(chordFret) && /x/i.test(chordFret)) ? null : chordFret })
            .map(function(chordFret) {
                return _.isString(chordFret) ? chordFret.replace("n", fret) : chordFret;
            })
            .map(function(chordFret) {
                return ((_.isString(chordFret)) ? eval(chordFret) : chordFret);
            })
            .filter(function(chordFret) { return !_.contains([null, undefined, "x", "X" ], chordFret); })
            .value();
    },

    chordsForAbstractChord: function(abstractChord, maxFret) {
        var self = this;

        maxFret = maxFret ? maxFret : 12;

        if (abstractChord.length != this.tuning.length) {
            throw new Error("fretValues doesn't have same length as tuning: " + JSON.stringify(fretValues));
        }

        return _.chain(_.range(maxFret))
            .map(function(baseFret) {
                return self.chordForAbstractChordAtFret(abstractChord, baseFret);
            })
            .value();
    },

    notesFromFretValues: function(fretValues) {
        if (fretValues.length != this.tuning.length) {
            throw new Error("fretValues doesn't have same length as tuning: " + JSON.stringify(fretValues));
        }

        return _.chain(fretValues)
            .zip(this.tuning)
            .filter(function(pair) { return !_.contains([null, undefined, "x", "X" ], pair[0]); })
            .map(function(pair) {
                return pair[1] + pair[0];
            })
            .value();
    },

    isSubsetOfChord: function(chord, candidate) {
        return _.chain(candidate)
            .difference(chord)
            .isEmpty()
            .value();
    }
});

module.exports = {
    GuitarChordCalculator: GuitarChordCalculator,
    ChordCalculator: ChordCalculator
}

var gcc = new GuitarChordCalculator([ 2, 9, 2, 6, 9, 2 ]);

// console.log(gcc.notesFromFretValues([ 0, 0, 0, 0, 0, 0 ]));
// console.log(gcc.notesFromFretValues([ 0, "X", 0, "x", 0, 0 ]));
// console.log(gcc.notesFromFretValues([ 0, null, 0, null, 0, 0 ]));
// console.log(gcc.notesFromFretValues([ 5, 5, 5, 5, 5, 5 ]));

console.log(gcc.generateAllBarChords());
