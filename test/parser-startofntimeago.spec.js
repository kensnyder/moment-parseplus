var moment = require('moment');
require('../parseplus.js');
var expect = require("chai").expect;

describe("in time parser", function() {

	it("should parse dates times like `start of 5 days ago`", function () {
		expect(+moment('start of 5 days ago')).to.be.closeTo(+moment().subtract(5, 'days').startOf('months'), 1000);
	});
	it("should parse dates times like `end of 5 months ago`", function () {
		expect(+moment('end of 5 months ago')).to.be.closeTo(+moment().subtract(5, 'months').endOf('months'), 1000);
	});

});
