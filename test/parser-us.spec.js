var moment = require('moment');
require('../parseplus.js');
var expect = require("chai").expect;

describe("US date parser", function() {

	it("should parse dates like `05/15/2016`", function() {
		expect(+moment("05/15/2016")).to.equal(+new Date(2016, 4, 15));
	});
	it("should parse dates like `5/15/2016`", function() {
		expect(+moment("5/15/2016")).to.equal(+new Date(2016, 4, 15));
	});
	it("should parse dates like `5/15/16`", function() {
		expect(+moment("5/15/16")).to.equal(+new Date(2016, 4, 15));
	});
	it("should parse dates like `05-15-2016`", function() {
		expect(+moment("05-15-2016")).to.equal(+new Date(2016, 4, 15));
	});
	it("should parse dates like `5-15-2016`", function() {
		expect(+moment("5-15-2016")).to.equal(+new Date(2016, 4, 15));
	});
	it("should parse dates like `5-15-16`", function() {
		expect(+moment("5-15-16")).to.equal(+new Date(2016, 4, 15));
	});

})
