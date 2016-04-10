
var _ = require('underscore');
var Combinatorics = require('./combinatorics').install(_);
var Notes = require('./notes').install(_);
var Util = require('./util').install(_);

// Arpeggios specified as sequence of intervals
var arpeggios = {
    'maj':     [ 4, 3, 5 ],
    'maj7':    [ 4, 3, 4, 1 ],
    'maj6':    [ 4, 3, 2, 3 ],
    'maj9':    [ 2, 2, 3, 4, 1 ],
    'min':     [ 3, 4, 5 ],
    'minmaj7': [ 3, 4, 4, 1 ],
    'm7':      [ 3, 4, 3, 2 ],
    'm6':      [ 3, 4, 2, 3 ],
    'm69':     [ 2, 1, 4, 2, 3 ],
    'm9':      [ 3, 4, 3, 4 ],
    'm7b5':    [ 3, 3, 4, 2 ],
    '7':       [ 4, 3, 3, 2 ],
    '9':       [ 2, 2, 3, 3, 2 ],
    '11':      [ 4, 3, 3, 4, 3 ],
    '13':      [ 4, 3, 2, 1, 2 ],
    '13(9)':   [ 2, 2, 3, 2, 1, 2 ],
    '7b5':     [ 4, 2, 4, 2 ],
    '7#5':     [ 4, 4, 2, 2 ],
    '7b9':     [ 1, 3, 3, 3, 2 ],
    '7#9':     [ 4, 3, 3, 5 ],
    '13b9':    [ 4, 3, 3, 3, 4, 4 ],
    // '13b9':    [ ],
    // 'b13b9':   [ ],
    'dim':     [ 3, 3, 6 ],
    'dim7':    [ 3, 3, 3, 3 ],

    'aug':     [ 4, 4, 4 ],

};

function Chords() {}
_.extend(Chords, {

    tonesFromChordIntervals: function(chord, root) {
        var intervals = chord
        if(_.isObject(intervals) && !_.isArray(intervals)) {
            intervals = chord.intervals;
        } else if (!_.isObject(intervals) && !_.isArray(intervals)) {
            return null;
        }

        root = root ? Notes.noteIndexFromString(root) : 0;

        var tones = _.chain(intervals)
            .reduce(function(result, intervalVal) {
                if (_.isEmpty(result)) { result.push(root); }
                result.push(_.last(result) + intervalVal);
                return result;
            }, [])
            .uniqueTones()
            .map(Notes.noteStrFromIndex)
            .value();

        var chord = {
            'root': root,
            'tones': tones,
            'intervals': intervals
        };
        chord.degrees = Chords.toneDegreesFromTones(chord, root);
        return chord;
    },

    tonesFromChordType: function(chordType, root) {
        if (!_.has(arpeggios, chordType)) { return []; }
        return Chords.tonesFromChordIntervals(arpeggios[chordType], root);
    },

    toneDegreesFromTones: function(chord, root) {
        var tones = chord
        root = root ? Notes.noteIndexFromString(root) : 0;
        if(_.isObject(tones) && !_.isArray(tones)) {
            tones = chord.tones;
            root = Notes.noteIndexFromString(chord.root);
        } else if (!_.isObject(tones) && !_.isArray(tones)) {
            return null;
        }

        var degrees = _.chain(tones)
            .map(function(tone) {
                return ((Notes.noteIndexFromString(tone) + Notes.numNotes - root) % Notes.numNotes);
            })
            .value().sort();

        return degrees;
    },

    chordTypesFromTones: function(chord, matchAllNotes) {
        var tones = chord
        if(_.isObject(tones) && !_.isArray(tones)) {
            tones = chord.tones;
        } else if (!_.isObject(tones) && !_.isArray(tones)) {
            return null;
        }

        tones = Notes.getUniqueTones(tones);
        return _.chain(_.range(Notes.numNotes))
            // get arpeggio tones
            .map(function(rootTone) {
                return _.map(arpeggios, function(intervals, chordType) {
                    return [chordType, Chords.tonesFromChordIntervals(intervals, rootTone), tones];
                })
            })
            .flatten(true)
            .map(function(pair) {
                return {
                    root: Notes.noteStrFromIndex(pair[1].root),
                    type: pair[0],
                    tones: pair[2],
                    fullChord: pair[1].tones,
                    fullChordIntervals: pair[1].intervals
                };
            })
            .filter(function(chord) {

                if (matchAllNotes) {
                    return (Chords.isSubsetOfChord(chord.fullChord, chord.tones) &&
                            Chords.isSubsetOfChord(chord.tones, chord.fullChord));
                } else {
                    // TODO: not sure this logic does anything
                    return Chords.isSubsetOfChord(chord.tones, chord.fullChord);
                }
            })
            .value();
    },

    isSubsetOfChord: function(chord, potentialSuperset) {
        chord = _.map(chord, Notes.noteIndexFromString);
        potentialSuperset = _.map(potentialSuperset, Notes.noteIndexFromString);

        return Util.isSubset(chord, potentialSuperset);
    },

    isInterestingChord: function(chord) {

        if (!chord.degrees) {
            // console.log(chord);
            chord.degrees = Chords.toneDegreesFromTones(chord);
        }

        var hasRoot = (chord.degrees.indexOf(0) > -1);
        var hasFifth = (chord.degrees.indexOf(7) > -1 || chord.degrees.indexOf(6) > -1);
        var hasThird = (chord.degrees.indexOf(3) > -1 || chord.degrees.indexOf(4) > -1);
        var hasSixthSeventh = (
            chord.degrees.indexOf(8) > -1 ||
            chord.degrees.indexOf(9) > -1 ||
            chord.degrees.indexOf(10) > -1 ||
            chord.degrees.indexOf(11) > -1
        );
        var hasSecondFourth = (
            chord.degrees.indexOf(1) > -1 ||
            chord.degrees.indexOf(2) > -1 ||
            chord.degrees.indexOf(5) > -1
        );

        if (chord.fullChord.length === 3) {
            return hasRoot && hasThird;
        } else if (chord.fullChord.length > 3) {
            return hasRoot && hasThird && (hasSixthSeventh || hasSecondFourth);
        } else {
            return false;
        }

        return true;
    },

});
_.extend(Chords, {
    install: function(underscoreObj) { underscoreObj.mixin(Chords.underscoreMixins); return Chords; },
    underscoreMixins: {
        'isSubsetChord': Chords.isSubsetOfChord,
        'chordTypes': Chords.chordTypesFromTones,
    },
});

module.exports = Chords;

if (require.main === module) {
    Chords.install(_);
    console.log(_.isSubsetChord([ 1, 2, 3 ], [ 1, 2 ]));

    console.log(_.isSubsetChord([ 1, "d", 3 ], [ "c#", 2, 3 ]));
    console.log(_.isSubsetChord([ 1, 2, 3 ], [ 1, 2, 3, 4, 5 ]));

    console.log(_.isSubsetChord([ 1, 2, 3 ], [ 1, 2, 4, 5 ]));

    console.log(Chords.tonesFromChordType("maj"));
    console.log(Chords.tonesFromChordType("maj9"));

    console.log(Chords.tonesFromChordIntervals([1, 1, 1]));

    console.log(Chords.chordTypesFromTones([0, 4, 7]));
    console.log(Chords.chordTypesFromTones([0, 4, 7, 9], true));

    console.log(Chords.chordTypesFromTones(["c", "e", "g"], true));
    console.log(Chords.chordTypesFromTones(["c", "e", "g"], false));

}
