
var util = require('util');
var _ = require('underscore');
var Combinatorics = require('./combinatorics').install(_);
var Notes = require('./notes').install(_);
var Chords = require('./chords').install(_);
var Frets = require('./frets').install(_);

function Dobro() {}
_.extend(Dobro, {
    generateAllOneNoteBarChordShapes: function(numStrings) {
        numStrings = numStrings || 6;
        fretValues = [ "n" ];
        for (var i = 0; i < numStrings-1; i++) {
            fretValues.push(0);
        }

        var result = _.chain(fretValues)
            .permutations()
            .value();

        return result;
    },

    generateAllBarChordShapes: function(numStrings) {
        numStrings = numStrings || 6;

        return _.chain([0, "n", "x"])
            .combinations(numStrings)
            .filter(Dobro.isValidStraightBarShape)
            .value();
    },

    isValidStraightBarShape: function(chordShape) {
        // conditions
        var needsFret = _.indexOf(chordShape, "n") > -1;

        // state vars
        var barEnded = false;
        var sawFretValue = false;
        var isValid = true;

        _.each(chordShape, function(fretValue) {
            if (fretValue === 0) { barEnded = true; }
            if (fretValue === 'n') {
                if (barEnded) { isValid = false; }
                sawFretValue = true;
            }
        });
        if (!sawFretValue) { isValid = false; }

        return isValid;
    },
});
_.extend(Dobro, {
    install: function(underscoreObj) { underscoreObj.mixin(Dobro.underscoreMixins); return Dobro; },
    underscoreMixins: {},
});

module.exports = Dobro;

if (require.main === module) {
    var fs = require('fs');
    var repl = require("repl");
    var catalogue = {
        'byType': {},
        'byShape': {},
    };
    Dobro.install(_);


    var catalogueFilepath = "./dobro_catalogue.json";
    if (fs.existsSync(catalogueFilepath)) {
        catalogue = require("../" + catalogueFilepath);
    } else {

        chordShapes = []
            .concat(Dobro.generateAllBarChordShapes())
            .concat(Dobro.generateAllOneNoteBarChordShapes());

        console.log(JSON.stringify(chordShapes));

        catalogue = _.chain(chordShapes)
            .map(function(barChordShape) {
                return _.map(_.range(11), function(fret) {
                    return Frets.placeChordShape(barChordShape, fret);
                });
            })
            .flatten(true)
            // Place chord shape at a fret
            .map(function(chordShape) { return Frets.placeChordShape(chordShape, 3); })
            // Fret chord shape on our tuning
            .map(function(chordShape) {
                return [
                    chordShape,
                    Frets.fret(Frets.tuning("dobro_open_g"), chordShape)
                ];
            })
            // Get chords from tones of fretted chord
            .map(function(pair) {
                chordShape = pair[0];
                chordTones = pair[1];
                return [
                    chordShape,
                    Chords.chordTypesFromTones(chordTones, true)
                ];
            })
            // Remove empty chords
            .filter(function(pair) {
                chordShape = pair[0];
                chords = pair[1];
                return chords.length > 0;
            })
            // filter chords by expressiveness
            .map(function(pair) {
                pair[1] = _.filter(pair[1], Chords.isInterestingChord);
                return pair;
            })
            // Create catalogue
            .reduce(function(result, pair) {
                chordShape = pair[0];
                chords = pair[1];

                chordStr = chordShape.join('');

                // fill in catalogue by shape
                if (!result['byShape'][chordStr]) { result['byShape'][chordStr] = []; }
                result['byShape'][chordStr] = Array.prototype.concat(result['byShape'][chordStr], chords);

                // fill in catalogue by type
                _.each(chords, function(chord) {
                    if (!result['byType'][chord.type]) { result['byType'][chord.type] = []; }
                    result['byType'][chord.type].push({
                        'root': chord.root,
                        'type': chord.type,
                        'tones': chord.tones,
                        'shape': chordShape,
                        'shapeStr': chordStr,
                    });
                });
                return result;
            }, catalogue)
            .tap(function(obj) { console.log(util.inspect(obj, { showHidden: false, depth: 4 })); })
            .value()
        fs.writeFileSync(catalogueFilepath, JSON.stringify(catalogue, null, 4));
    }

    global.catalogue = catalogue;
    global.chordsFor = function(query) {
        return _.chain(_.keys(catalogue.byType))
            // Get chord types that match query
            .filter(function(chordType) { return (new RegExp(query)).test(chordType); })
            // Return chordset for each type
            .map(function(chordType) {
                return {
                    type: chordType,
                    chords: catalogue.byType[chordType]
                };
            })
            // Map over each chord types' chords and reduce them to "superset" chords
            .map(function(chordList) {
                var result = [];
                // for each chord in our huge chord list
                _.map(chordList.chords, function(chord) {
                    var wasInserted = false;
                    // map over all chords in the result catalogue
                    _.each(result, function(parentChord, index) {
                        if (Frets.isSubsetChord(parentChord.shape, chord.shape)) {
                            result[index] = chord;
                            wasInserted = true;
                        } else if (Frets.isSubsetChord(chord.shape, parentChord.shape)) {
                            wasInserted = true;
                        }
                    });
                    if(!wasInserted) { result.push(chord); }
                });

                chordList.chords = result;
                return chordList;
            })
            // Map over chord types' chords and print in a pretty fashion
            .map(function(chordList) {
                return _.map(chordList.chords, function(chord) {
                    var chordName = chord.root.toUpperCase() + chord.type;
                    return chordName + Array(12 - chordName.length).join(" ") + // chordType
                        chord.shapeStr + "  " +
                        chord.tones
                            .sort(Notes.sortByToneAtRoot(chord.root))
                            .map(function(note) { return note.toUpperCase(); })
                            .join(" ");
                });
            })
            .flatten()
            .uniq()
            .value().sort();
    };

    console.log( util.inspect(chordsFor(''), { showHidden: false, depth: 4 }) );

    repl.start({
        prompt: "dobro> ",
        input: process.stdin,
        output: process.stdout,
        global: true,
        writer: function(obj) { return util.inspect(obj, { showHidden: false, depth: 4 }); }
        // eval: eval,
    });
}
