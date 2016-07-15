var moment = require('moment');
require('../parseplus.js');
var expect = require("chai").expect;

describe("day.month.year yearless parser", function() {

	var march5th = '5 3 ' + (new Date().getFullYear());
	var march15th = '15 3 ' + (new Date().getFullYear());

	it("should parse dates like `05.03`", function() {
		expect(moment("05.03").format('D M YYYY')).to.equal(march5th);
	});
	it("should parse dates like `5.3`", function() {
		expect(moment("5.3").format('D M YYYY')).to.equal(march5th);
	});
	it("should parse dates like `15/03`", function() {
		expect(moment("15/03").format('D M YYYY')).to.equal(march15th);
	});
	it("should parse dates like `15/3`", function() {
		expect(moment("15/3").format('D M YYYY')).to.equal(march15th);
	});

});
