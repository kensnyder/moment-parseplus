var moment = require('moment');
require('../parseplus.js');
var expect = require("chai").expect;

describe("12h date parser", function() {

	it("should parse times like `8:42pm` without dates", function () {
		var y = new Date().getFullYear();
		var m = new Date().getMonth();
		var d = new Date().getDate();
		expect(+moment('8:42pm')).to.equal(+new Date(y,m,d,20,42));
	});
	it("should parse times like `8:42pm`", function () {
		expect(+moment('March 4, 2012 8:42pm')).to.equal(+new Date(2012,2,4,20,42));
	});
	it("should parse times like `8:42 pm`", function () {
		expect(+moment('4 Mar 2012 8:42 pm')).to.equal(+new Date(2012,2,4,20,42));
	});
	it("should fail on times like `moo 8:42 pm`", function () {
		expect(moment('moo 8:42 pm').isValid()).to.equal(false);
	});

});
