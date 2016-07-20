var moment = require('moment');
require('../parseplus.js');
var expect = require("chai").expect;

describe("conversational date parser", function() {

	it("should parse dates like `March 24, 2016`", function () {
		expect(+moment('March 24, 2016')).to.equal(+new Date(2016,2,24));
	});
	it("should parse dates like `March 24 2012`", function () {
		expect(+moment('March 24 2012')).to.equal(+new Date(2012,2,24));
	});
	it("should parse dates like `Mar 4 2012`", function () {
		expect(+moment('Mar 4 2012')).to.equal(+new Date(2012,2,4));
	});
	it("should parse dates like `Sun Mar 4 2012`", function () {
		expect(+moment('Sun Mar 4 2012')).to.equal(+new Date(2012,2,4));
	});
	it("should parse dates like `Sun, Mar 4 2012`", function () {
		expect(+moment('Sun, Mar 4 2012')).to.equal(+new Date(2012,2,4));
	});

});
