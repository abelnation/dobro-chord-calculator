
var _ = require('underscore');
var Notes = require('./notes').install(_);
var Chords = require('./chords').install(_);

var tunings = {
    "guitar":        [ "E", "A", "D", "G", "B", "e" ],
    "guitar_drop_d": [ "D", "A", "D", "G", "B", "e" ],
    "banjo":         [ "g", "D", "G", "B", "D" ],
    "dobro_open_g":  [ "G", "B", "D", "G", "B", "d" ],
    "dobro_open_d":  [ "D", "A", "D", "F#", "A", "d" ],
    "dobro_open_d_minor":  [ "D", "A", "D", "F", "A", "d" ],
    "dobro_jazzy":  [ "E", "B", "D", "G", "B", "d" ],
}

function Frets() {}
_.extend(Frets, {

    tuning: function(tuning) {
        if (_.isString(tuning)) {
            return _.map(tunings[tuning], function(str) { return str.toLowerCase(); });
        } else {
            return tuning;
        }
    },

    placeChordShape: function(chordShape, chordFret) {
        chordFret = chordFret || 0;
        return _.chain(chordShape)
            .map(function(fret) {
                return (_.isString(fret) ? fret.replace("n", chordFret) : fret);
            })
            .map(function(fret) {
                return (_.isString(fret) && !/x/i.test(fret) ? eval(fret) : fret);
            })
            .value();
    },

    fret: function(tuning, chordShape, chordFret) {
        chordFret = chordFret || 0;
        if (chordShape.length !== tuning.length) {
            throw new Error("chordShape doesn't have same length as tuning to be fretted: " + JSON.stringify(chordShape));
        }

        chordShape = Frets.placeChordShape(chordShape, chordFret);

        return _.chain(chordShape)
            // match fret value with tuning value
            .zip(tuning)
            // get rid of muted strings
            .filter(function(pair) { return !_.contains([null, undefined, "x", "X" ], pair[0]); })
            // calculate tone of each fretted note
            .map(function(pair) {
                return Notes.noteIndexFromString(pair[1]) + pair[0];
            })
            .uniqueTones()
            .value();
    },


    isSubsetChord: function(subsetCandidate, supersetCandidate) {
        var result = true;
        _.each(supersetCandidate, function(fret, index) {
            if (/x/i.test(subsetCandidate[index]) || subsetCandidate[index] === fret) {
                // no-op
            } else {
                result = false;
            }
        });
        return result;
    }

});
_.extend(Frets, {
    install: function(underscoreObj) { underscoreObj.mixin(Frets.underscoreMixins); return Frets; },
    underscoreMixins: {
        'fret': Frets.fret,
        'placeChordShape': Frets.placeChordShape,
    },
});

module.exports = Frets;

if (require.main === module) {
    Frets.install(_);
    console.log(Frets.tuning("guitar"));
    console.log(Frets.tuning("dobro_open_d"));

    console.log(
        _.chain(Frets.tuning("dobro_open_d"))
            .fret([0, 0, 0, 0, 0, 0])
            .value()
    );

    console.log(
        _.chain(Frets.tuning("dobro_open_d"))
            .fret([ 5, 5, 5, 5, 5, 5 ])
            .value()
    );

    console.log(
        _.chain(Frets.tuning("dobro_open_d"))
            .fret([ 5, 5, 5, 5, 5, 5 ])
            .value()
    );

    console.log("= = = = = =");

    // console.log(
    //     _.chain(Frets.tuning("guitar"))
    //         .fret([ "n", "n+2", "n+2", "n+1", "n", "n" ], 3)
    //         .value()
    // );
    // console.log(
    //     _.chain(Frets.tuning("guitar"))
    //         .fret([ "n", "n+2", "n+2", "n", "n", "n" ], 0)
    //         .chordTypes(true)
    //         .value()
    // );

    console.log(
        Frets.placeChordShape([ "n", "n+2", "n+2", "n", "x", "n" ], 0)
    );
    console.log(
        Frets.placeChordShape([ "n", "n+2", "n+2", "n", "x", "n" ], 0)
    );

    var chord1 = [ 0, 0, 0, 0, 0, 0 ];
    var chord2 = [ 0, "x", 0, "x", 0, 0 ];
    console.log("" + chord1 + " > " + chord2 + " = " + Frets.isSubsetChord(chord2, chord1));
    console.log("" + chord2 + " > " + chord1 + " = " + Frets.isSubsetChord(chord1, chord2));

    var chord3 = [ 0, 2, 2, 0, 0, 0 ];
    var chord4 = [ 0, 2, "x", 1, 0, 0 ];
    var chord5 = [ 0, 2, "x", 0, "x", "x" ];
    console.log("" + chord3 + " > " + chord4 + " = " + Frets.isSubsetChord(chord4, chord3));
    console.log("" + chord4 + " > " + chord3 + " = " + Frets.isSubsetChord(chord3, chord4));
    console.log("" + chord3 + " > " + chord5 + " = " + Frets.isSubsetChord(chord5, chord3));

}
