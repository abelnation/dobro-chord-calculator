
var _ = require('underscore');

var canonicalNotes = [
    "c", "c#", "d", "d#",
    "e", "f", "f#", "g",
    "g#", "a", "a#", "b"
];

var noteValues = {
    'c':   { rootIndex: 0, intVal: 0 },
    'cn':  { rootIndex: 0, intVal: 0 },
    'c#':  { rootIndex: 0, intVal: 1 },
    'c##': { rootIndex: 0, intVal: 2 },
    'cb':  { rootIndex: 0, intVal: 11 },
    'cbb': { rootIndex: 0, intVal: 10 },
    'd':   { rootIndex: 1, intVal: 2 },
    'dn':  { rootIndex: 1, intVal: 2 },
    'd#':  { rootIndex: 1, intVal: 3 },
    'd##': { rootIndex: 1, intVal: 4 },
    'db':  { rootIndex: 1, intVal: 1 },
    'dbb': { rootIndex: 1, intVal: 0 },
    'e':   { rootIndex: 2, intVal: 4 },
    'en':  { rootIndex: 2, intVal: 4 },
    'e#':  { rootIndex: 2, intVal: 5 },
    'e##': { rootIndex: 2, intVal: 6 },
    'eb':  { rootIndex: 2, intVal: 3 },
    'ebb': { rootIndex: 2, intVal: 2 },
    'f':   { rootIndex: 3, intVal: 5 },
    'fn':  { rootIndex: 3, intVal: 5 },
    'f#':  { rootIndex: 3, intVal: 6 },
    'f##': { rootIndex: 3, intVal: 7 },
    'fb':  { rootIndex: 3, intVal: 4 },
    'fbb': { rootIndex: 3, intVal: 3 },
    'g':   { rootIndex: 4, intVal: 7 },
    'gn':  { rootIndex: 4, intVal: 7 },
    'g#':  { rootIndex: 4, intVal: 8 },
    'g##': { rootIndex: 4, intVal: 9 },
    'gb':  { rootIndex: 4, intVal: 6 },
    'gbb': { rootIndex: 4, intVal: 5 },
    'a':   { rootIndex: 5, intVal: 9 },
    'an':  { rootIndex: 5, intVal: 9 },
    'a#':  { rootIndex: 5, intVal: 10 },
    'a##': { rootIndex: 5, intVal: 11 },
    'ab':  { rootIndex: 5, intVal: 8 },
    'abb': { rootIndex: 5, intVal: 7 },
    'b':   { rootIndex: 6, intVal: 11 },
    'bn':  { rootIndex: 6, intVal: 11 },
    'b#':  { rootIndex: 6, intVal: 0 },
    'b##': { rootIndex: 6, intVal: 1 },
    'bb':  { rootIndex: 6, intVal: 10 },
    'bbb': { rootIndex: 6, intVal: 9 }
};

var numNotes = canonicalNotes.length;
var noteIndices = _.reduce(canonicalNotes, function(result, noteStr, noteIndex) {
    result[noteStr] = noteIndex;
    return result;
}, {});

function Notes() {}
_.extend(Notes, {
    numNotes: canonicalNotes.length,
    noteStrFromIndex: function (noteIndex) {
        return (_.isNumber(noteIndex) ? canonicalNotes[ (noteIndex % numNotes) ] : noteIndex);
    },
    noteIndexFromString: function (noteStr) {
        return (_.isString(noteStr) ? noteValues[noteStr.toLowerCase()].intVal : noteStr);
    },
    getUniqueTones: function(noteValues) {
        return _.chain(noteValues)
            .map(Notes.noteIndexFromString)
            .map(Notes.noteStrFromIndex)
            .reduce(function(result, noteStr, idx) {
                result[noteStr] = true;
                return result;
            }, {})
            .keys()
            // .map(Notes.noteIndexFromString)
            .value();
    },
    sortByToneAtRoot: function(root) {
        root = Notes.noteIndexFromString(root);

        return function(noteA, noteB) {
            noteA = (Notes.noteIndexFromString(noteA) + Notes.numNotes - root) % Notes.numNotes;
            noteB = (Notes.noteIndexFromString(noteB) + Notes.numNotes - root) % Notes.numNotes;
            if (noteA === noteB) { return 0; }
            return noteA < noteB ? -1 : 1;
        };
    }
});
_.extend(Notes, {
    install: function(underscoreObj) { underscoreObj.mixin(Notes.underscoreMixins); return Notes; },
    underscoreMixins: {
        'uniqueTones': Notes.getUniqueTones
    },
});

module.exports = Notes;

if (require.main === module) {
    Notes.install(_);
    console.log(_.uniqueTones([0, 1, 2, 3, 12, 13, 14, 15]));
}
