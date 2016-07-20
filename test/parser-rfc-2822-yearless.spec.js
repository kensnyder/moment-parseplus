var moment = require('moment');
require('../parseplus.js');
var expect = require("chai").expect;

describe("middle-month-yearless date parser", function() {

	var currentYear = new Date().getFullYear();

	it("should parse dates like `15-Mar`", function() {
		expect(+moment('15-Mar')).to.equal(+new Date(currentYear,2,15));
	});
	it("should parse dates like `15 Mar`", function() {
		expect(+moment('15 Mar')).to.equal(+new Date(currentYear,2,15));
	});
	it("should parse dates like `Mon, 15 March`", function() {
		expect(+moment('Mon, 15 March')).to.equal(+new Date(currentYear,2,15));
	});

})
