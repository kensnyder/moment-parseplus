var moment = require('moment');
var parseplus = require('../parseplus.js');
var expect = require("chai").expect;

describe("parseplus internals", function() {

	it("should parse formats", function () {
		expect(+parseplus.attemptFormat([1,2,2016],'MM DD YYYY')).to.equal(+new Date(2016,0,2));
	});
	it("should parse formats with stars", function () {
		expect(+parseplus.attemptFormat([1,2,null,2016],'MM DD * YYYY')).to.equal(+new Date(2016,0,2));
	});
	it("should compile regexp", function () {
		parseplus.regexes.TEST = 'compile! \\d+';
		var compiled = parseplus.compile('^ABC (_TEST_) DEF$');
		var expected = /^ABC (compile! \d+) DEF$/i;
		expect(compiled).to.be.instanceOf(RegExp);
		expect(compiled.toString()).to.equal(expected.toString());
	});

});
