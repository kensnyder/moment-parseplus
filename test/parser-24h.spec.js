var moment = require('moment');
require('../parseplus.js');
var expect = require("chai").expect;

describe("24h date parser", function() {

	it("should parse times like `20:42`", function () {
		var date = new Date();
		date.setHours(20);
		date.setMinutes(42);
		date.setSeconds(0);
		date.setMilliseconds(0);
		expect(+moment('20:42')).to.be.closeTo(+date, 100);
	});
	it("should parse times like `20:42`", function () {
		expect(+moment('March 4, 2012 20:42')).to.equal(+new Date(2012,2,4,20,42));
	});
	it("should parse times like `20:42:42`", function () {
		expect(+moment('March 4, 2012 20:42:42')).to.equal(+new Date(2012,2,4,20,42,42));
	});
	it("should parse times like `20:42:42+0000`", function () {
		var input = '4 Mar 2012 20:42:42+0000';
		expect(moment(input).format()).to.equal(moment(input, 'D MMM YYYY HH:mm:ssZ').format());
	});
	it("should parse times like `20:42:42+00:00`", function () {
		var input = '4-Mar-2012 20:42:42+00:00';
		expect(moment(input).format()).to.equal(moment(input, 'D-MMM-YYYY HH:mm:ssZ').format());
	});
	it("should parse times like `4.3.2012 20:42:42 GMT+0000`", function () {
		var input = '4.3.2012 20:42:42 GMT+0000';
		expect(moment(input).format()).to.equal(moment(input, 'D.M.YYYY HH:mm:ss Z').format());
	});
	it("should parse times like `4.3.2012 20:42:42 GMT+0000 (UTC)`", function () {
		var input = '4.3.2012 20:42:42 GMT+0000 (UTC)';
		expect(moment(input).format()).to.equal(moment(input, 'D.M.YYYY HH:mm:ss Z').format());
	});
	it("should parse times like `March 24th, 2012 20:42:42 GMT+00:00`", function () {
		var input = 'March 24th, 2012 20:42:42 GMT+00:00';
		expect((+moment(input)-+moment(input, 'MMM DD, YYYY HH:mm:ss ZZ'))/1000/3600).to.be.closeTo(0, 100);
	});
	it("should parse times like `20:42:42.321`", function () {
		expect(+moment('March 24, 2012 20:42:42.321')).to.equal(+new Date(2012,2,24,20,42,42,321));
	});
	it("should parse times like `March 24th, 2016 20:42:42 MDT`", function () {
		var input = 'March 24th, 2016 20:42:42';
		expect(moment(input + ' MDT').format()).to.equal(moment(input + ' -06:00', 'MMM DD, YYYY HH:mm:ss Z').format());
	});
	it("should parse times like `20:42:42 NST`", function () {
		var input = 'March 27th, 2016 20:42:42';
		expect(moment(input + ' NST').format()).to.equal(moment(input + ' -03:30', 'MMM DD, YYYY HH:mm:ss Z').format());
	});
	it("should fail on times like `coolbeans 20:42:42`", function () {
		expect(moment('coolbeans 20:42:42').isValid()).to.equal(false);
	});

});
