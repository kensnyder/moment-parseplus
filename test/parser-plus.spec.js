var moment = require('moment');
require('../parseplus.js');
var expect = require("chai").expect;

describe("plus date parser", function() {

	// due to daylight savings changes, it is simplest to just check a given range
	var hourPlus100ms = 60*60*1000 + 100;

	it("should parse times like `+5 hours`", function () {
		expect(+moment('+5 hours')).to.be.closeTo(+new Date()+5*60*60*1000, hourPlus100ms);
	});
	it("should parse times like `+ 20 days`", function () {
		expect(+moment('+ 20 days')).to.be.closeTo(+new Date()+20*24*60*60*1000, hourPlus100ms);
	});
	it("should parse times like `-1 day`", function () {
		expect(+moment('-1 day')).to.be.closeTo(+new Date()-24*60*60*1000, hourPlus100ms);
	});
	it("should parse times like `-3days`", function () {
		expect(+moment('-3days')).to.be.closeTo(+new Date()-3*24*60*60*1000, hourPlus100ms);
	});

});
