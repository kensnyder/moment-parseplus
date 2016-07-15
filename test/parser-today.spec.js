var moment = require('moment');
require('../parseplus.js');
var expect = require("chai").expect;

describe("today date parser", function() {

	it("should parse times like `today`", function () {
		expect(+moment('today')).to.be.closeTo(+new Date(), 100);
	});
	it("should parse times like `now`", function () {
		expect(+moment('now')).to.be.closeTo(+new Date(), 100);
	});
	it("should parse times like `tomorrow`", function () {
		expect(+moment('tomorrow')).to.be.closeTo(+new Date()+24*60*60*1000, 100);
	});
	it("should parse times like `yesterday`", function () {
		expect(+moment('yesterday')).to.be.closeTo(+new Date()-24*60*60*1000, 100);
	});

});
