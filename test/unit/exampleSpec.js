
function foo() {
    console.log("foo");
    return null;
}

function bar(x) {
    return x + 5;
}

describe("Example Functions", function() {

    beforeEach(function() {
        console.log("Starting a spec");
    });

    afterEach(function() {
        console.log("Finished spec");
    });

    describe("foo", function() {
        it("returns null", function() {
            expect(foo()).toBe(null);
        });
    });

    describe("bar", function() {
        it("adds 5", function() {
            expect(bar(1)).toEqual(1 + 5);
            expect(bar(2)).toEqual(2 + 5);
            expect(bar(3)).toEqual(3 + 5);
            expect(bar(4)).toEqual(4 + 5);
            expect(bar(5)).toEqual(5 + 5);
            expect(bar(6)).toEqual(6 + 5);
            expect(bar(7)).toEqual(7 + 5);
            expect(bar(8)).toEqual(8 + 5);
        });
    });

});
