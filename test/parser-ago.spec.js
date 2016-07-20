var moment = require('moment');
require('../parseplus.js');
var expect = require("chai").expect;

describe("in time parser", function() {

	it("should parse dates times like `5 days ago`", function () {
		expect(+moment('5 days ago')).to.be.closeTo(+moment().subtract(5, 'days'), 1000);
	});
	it("should parse dates times like `5.5 months ago`", function () {
		expect(+moment('5.5 months ago')).to.be.closeTo(+moment().subtract(5.5, 'months'), 1000);
	});

});
