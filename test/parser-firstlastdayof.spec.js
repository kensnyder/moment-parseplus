var moment = require('moment');
require('../parseplus.js');
var expect = require("chai").expect;

describe("first day / last day parser", function() {

	it("should parse dates times like `first day of this week`", function () {
		expect(+moment('first day of this week')).to.be.closeTo(+moment().startOf('week'), 1000);
	});

	it("should parse dates times like `last day of this week`", function () {
		expect(+moment('last day of this week')).to.be.closeTo(+moment().endOf('week'), 1000);
	});

	it("should parse dates times like `first day of this month`", function () {
		expect(+moment('first day of this month')).to.be.closeTo(+moment().startOf('month'), 1000);
	});

	it("should parse dates times like `last day of this month`", function () {
		expect(+moment('last day of this month')).to.be.closeTo(+moment().endOf('month'), 1000);
	});

	it("should parse dates times like `first day of next month`", function () {
		expect(+moment('first day of next month')).to.be.closeTo(+moment().add(1, 'month').startOf('month'), 1000);
	});


	it("should parse dates times like `first day of next week`", function () {
		expect(+moment('first day of next week')).to.be.closeTo(+moment().add(1, 'week').startOf('week'), 1000);
	});

	it("should parse dates times like `last day of next week`", function () {
		expect(+moment('last day of next week')).to.be.closeTo(+moment().add(1, 'week').endOf('week'), 1000);
	});

	it("should parse dates times like `last day of next month`", function () {
		expect(+moment('last day of next month')).to.be.closeTo(+moment().add(1, 'month').endOf('month'), 1000);
	});

	it("should parse dates times like `first day of last month`", function () {
		expect(+moment('first day of last month')).to.be.closeTo(+moment().add(-1, 'month').startOf('month'), 1000);
	});

	it("should parse dates times like `last day of last month`", function () {
		expect(+moment('last day of last month')).to.be.closeTo(+moment().add(-1, 'month').endOf('month'), 1000);
	});

	it("should parse dates times like `first day of this year`", function () {
		expect(+moment('first day of this year')).to.be.closeTo(+moment().startOf('year'), 1000);
	});

	it("should parse dates times like `last day of this year`", function () {
		expect(+moment('last day of this year')).to.be.closeTo(+moment().endOf('year'), 1000);
	});

	it("should parse dates times like `first day of next year`", function () {
		expect(+moment('first day of next year')).to.be.closeTo(+moment().add(1, 'year').startOf('year'), 1000);
	});

	it("should parse dates times like `last day of next year`", function () {
		expect(+moment('last day of next year')).to.be.closeTo(+moment().add(1, 'year').endOf('year'), 1000);
	});

	it("should parse dates times like `first day of last year`", function () {
		expect(+moment('first day of last year')).to.be.closeTo(+moment().add(-1, 'year').startOf('year'), 1000);
	});

	it("should parse dates times like `last day of last year`", function () {
		expect(+moment('last day of last year')).to.be.closeTo(+moment().add(-1, 'year').endOf('year'), 1000);
	});

});
