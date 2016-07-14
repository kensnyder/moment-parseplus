var moment = require('moment');
require('../parseplus.js');
var expect = require("chai").expect;

describe("day.month.year parser", function() {

	it("should parse dates like `05.03.2016`", function() {
		expect(+moment("05.03.2016")).to.equal(+new Date(2016,2,5));
	});
	it("should parse dates like `5.3.2016`", function() {
		expect(+moment("5.3.2016")).to.equal(+new Date(2016,2,5));
	});
	it("should parse dates like `15/03/2016`", function() {
		expect(+moment("15/03/2016")).to.equal(+new Date(2016,2,15));
	});
	it("should parse dates like `15/3/2016`", function() {
		expect(+moment("15/3/2016")).to.equal(+new Date(2016,2,15));
	});
	it("should ignore out-of-range values with slashes", function() {
		expect(moment("15/13/2016").isValid()).to.equal(false);
	});
	it("should ignore out-of-range values with dots", function() {
		expect(moment("15.13.2016").isValid()).to.equal(false);
	});

});
