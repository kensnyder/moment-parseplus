var moment = require('moment');
require('../parseplus.js');
var expect = require("chai").expect;

describe("us-yearless date parser", function() {

	var may15th = '5 15 ' + (new Date().getFullYear());

	it("should parse dates like `05/15`", function() {
		expect(moment("05/15").format('M D YYYY')).to.equal(may15th);
	});
	it("should parse dates like `5/15`", function() {
		expect(moment("5/15").format('M D YYYY')).to.equal(may15th);
	});
	it("should parse dates like `05-15`", function() {
		expect(moment("05-15").format('M D YYYY')).to.equal(may15th);
	});
	it("should parse dates like `5-15`", function() {
		expect(moment("5-15").format('M D YYYY')).to.equal(may15th);
	});

})
