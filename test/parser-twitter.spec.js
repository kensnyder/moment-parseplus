var moment = require('moment');
require('../parseplus.js');
var expect = require("chai").expect;

describe("twitter date parser", function() {

	it("should parse dates like `Tue Jun 22 17:47:27 +0000 2010`", function() {
		var input = 'Tue Jun 22 17:47:27 +0000 2010';
		expect(moment(input).format()).to.equal(moment(input, 'ddd MMM DD HH:mm:ss Z YYYY').format());
	});

})
