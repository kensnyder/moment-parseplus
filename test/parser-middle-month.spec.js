var moment = require('moment');
require('../parseplus.js');
var expect = require("chai").expect;

describe("US date parser", function() {

	it("should parse dates like `15-Mar-2010`", function() {
		expect(+moment('15-Mar-2010')).to.equal(+new Date(2010,2,15));
	});
	it("should parse dates like `15 Mar 2010`", function() {
		expect(+moment('15 Mar 2010')).to.equal(+new Date(2010,2,15));
	});
	it("should parse dates like `Mon, 15 Mar 2010`", function() {
		expect(+moment('Mon, 15 Mar 2010')).to.equal(+new Date(2010,2,15));
	});

})
