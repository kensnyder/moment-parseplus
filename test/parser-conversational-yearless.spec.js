var moment = require('moment');
require('../parseplus.js');
var expect = require("chai").expect;

describe("conversational-yearless date parser", function() {

	var march14th = '3 14 ' + (new Date().getFullYear());

	it("should parse dates like `March 14`", function () {
		expect(moment('March 14').format('M D YYYY')).to.equal(march14th);
	});
	it("should parse dates like `Mar 14`", function () {
		expect(moment('Mar 14').format('M D YYYY')).to.equal(march14th);
	});
	it("should parse dates like `Sun Mar 14`", function () {
		expect(moment('Sun Mar 14').format('M D YYYY')).to.equal(march14th);
	});
	it("should parse dates like `Sun, Mar 14`", function () {
		expect(moment('Sun, Mar 14').format('M D YYYY')).to.equal(march14th);
	});
	it("should parse dates like `Sun, Mar. 14`", function () {
		expect(moment('Sun, Mar. 14').format('M D YYYY')).to.equal(march14th);
	});
	it("should parse dates like `Sun., Mar 14`", function () {
		expect(moment('Sun., Mar 14').format('M D YYYY')).to.equal(march14th);
	});

});
