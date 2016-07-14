var moment = require('moment');
var moparse = require('../parseplus.js');
var expect = require("chai").expect;
console.log(moment.locale());

describe("world date parser", function() {

	it("should handle dots - two digits", function() {
		expect(moment("05.03.2016").valueOf()).to.equal(+new Date(2016,2,5));
	});
	it("should handle dots - one digit", function() {
		expect(moment("5.3.2016").valueOf()).to.equal(+new Date(2016,2,5));
	});
	it("should handle slashes - two digits", function() {
		expect(moment("15/03/2016").valueOf()).to.equal(+new Date(2016,2,15));
	});
	it("should handle slashes - one digit", function() {
		expect(moment("15/3/2016").valueOf()).to.equal(+new Date(2016,2,15));
	});
	it("should ignore out-of-range values", function() {
		expect(moment("15/13/2016").isValid()).to.equal(false);
	});
	it("should ignore out-of-range values", function() {
		expect(moment("15.13.2016").isValid()).to.equal(false);
	});

});

/*
 equal($D('12-01-2006')+'', new Date(2006, 11, 1)+'', 'parsing `12-01-2006`');
 equal($D('12-1-2006')+'', new Date(2006, 11, 1)+'', 'parsing `12-1-2006`');
 equal($D('13.1.2006')+'', new Date(2006, 0, 13)+'', 'parsing `13.1.2006`');
 equal($D('13.01.2006')+'', new Date(2006, 0, 13)+'', 'parsing `13.01.2006`');
 */
