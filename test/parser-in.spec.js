var moment = require('moment');
require('../parseplus.js');
var expect = require("chai").expect;

describe("in parser", function() {

	it("should parse dates times like `in 5 days`", function () {
		expect(+moment('in 5 days')).to.be.closeTo(+moment().add(5, 'days'), 1000);
	});
	it("should parse dates times like `in 5.5 months`", function () {
		expect(+moment('in 5.5 months')).to.be.closeTo(+moment().add(5.5, 'months'), 1000);
	});

});
