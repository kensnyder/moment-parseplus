var moment = require('moment');
require('../parseplus.js');
var expect = require("chai").expect;

describe("us-yearless date parser", function() {

	var may5th = '5 5 ' + (new Date().getFullYear());

	it("should parse dates like `05/05`", function() {
		expect(moment("05/05").format('M D YYYY')).to.equal(may5th);
	});
	it("should parse dates like `5/5`", function() {
		expect(moment("5/5").format('M D YYYY')).to.equal(may5th);
	});
	it("should parse dates like `05-05`", function() {
		expect(moment("05-05").format('M D YYYY')).to.equal(may5th);
	});
	it("should parse dates like `5-5`", function() {
		expect(moment("5-5").format('M D YYYY')).to.equal(may5th);
	});

})
