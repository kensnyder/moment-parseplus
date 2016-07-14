var moment = require('moment');
require('../parseplus.js');
var expect = require("chai").expect;

describe("US date parser", function() {

	it("should parse dates like `05/05/2016`", function() {
		expect(+moment("05/05/2016")).to.equal(+new Date(2016, 4, 5));
	});
	it("should parse dates like `5/5/2016`", function() {
		expect(+moment("5/5/2016")).to.equal(+new Date(2016, 4, 5));
	});
	it("should parse dates like `05-05-2016`", function() {
		expect(+moment("05-05-2016")).to.equal(+new Date(2016, 4, 5));
	});
	it("should parse dates like `5-5-2016`", function() {
		expect(+moment("5-5-2016")).to.equal(+new Date(2016, 4, 5));
	});

})
