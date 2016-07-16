var moment = require('moment');
var parseplus = require('../parseplus.js');
var expect = require("chai").expect;

describe("parseplus internals", function() {

	it("should attempt to parse invalid dates with replacers", function () {
		var parsers = parseplus.parsers;
		parseplus.clearParsers();
		parseplus.addParser({
			name: 'moo',
			matcher: /^moo$/,
			replacer: '$0',
			format: 'MM/DD/YYY'
		});
		expect(parseplus.attemptToParse('moo')).to.equal(undefined);
		parseplus.clearParsers();
		parseplus.parsers = parsers;
	});
	it("should attempt to parse invalid dates with handlers", function () {
		var parsers = parseplus.parsers;
		parseplus.clearParsers();
		parseplus.addParser({
			name: 'moo',
			matcher: /^moo$/,
			handler: function(match) {
				return {
					input: 'abc',
					format: 'MM/DD/YYYY'
				};
			}
		});
		expect(parseplus.attemptToParse('moo')).to.equal(undefined);
		parseplus.clearParsers();
		parseplus.parsers = parsers;
	});
	it("should attempt to parse invalid dates with handlers 2", function () {
		var parsers = parseplus.parsers;
		parseplus.clearParsers();
		parseplus.addParser({
			name: 'moo',
			matcher: /^moo$/,
			handler: function(match) {
				moment('moonpies');
			}
		});
		expect(parseplus.attemptToParse('moo')).to.equal(undefined);
		parseplus.clearParsers();
		parseplus.parsers = parsers;
	});
	it("should ignore invalid handlers", function () {
		var parsers = parseplus.parsers;
		parseplus.clearParsers();
		parseplus.addParser({
			name: 'moo',
			matcher: /^moo$/
		});
		expect(parseplus.attemptToParse('moo')).to.equal(undefined);
		parseplus.clearParsers();
		parseplus.parsers = parsers;
	});
	it("should parse formats", function () {
		expect(+parseplus.attemptFormat([1,2,2016],'MM DD YYYY')).to.equal(+new Date(2016,0,2));
	});
	it("should parse formats with stars", function () {
		expect(+parseplus.attemptFormat([1,2,null,2016],'MM DD * YYYY')).to.equal(+new Date(2016,0,2));
	});
	it("should compile regexp", function () {
		parseplus.regexes.TEST = 'compile! \\d+';
		var compiled = parseplus.compile('^ABC (_TEST_) DEF$');
		delete parseplus.regexes.TEST;
		var expected = /^ABC (compile! \d+) DEF$/i;
		expect(compiled).to.be.instanceOf(RegExp);
		expect(compiled.toString()).to.equal(expected.toString());
	});

});
