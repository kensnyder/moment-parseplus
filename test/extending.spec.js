var moment = require('moment');
var parseplus = require('../parseplus.js');
var expect = require("chai").expect;

describe("extending parseplus", function() {

	it("should add handler", function () {
		parseplus.addParser({
			name: 'test2',
			matcher: /^handle (\d+)$/,
			handler: function(match) {
				return new Date(1970,0,+match[1]);
			}
		});
		expect(moment('handle 12').valueOf()).to.equal(+new Date(1970,0,12));
		parseplus.removeParser('test2');
	});
	it("should remove handler", function () {
		parseplus.addParser({
			name: 'test3',
			matcher: /^test3 (\d+)$/,
			handler: function(match) {
				return new Date(1970,0,+match[1]);
			}
		});
		expect(moment('test3 12').valueOf()).to.equal(+new Date(1970,0,12));
		parseplus.removeParser('test3');
		expect(moment('test3 12').isValid()).to.equal(false);
	});
	it("should clear out parsers", function () {
		parseplus.addParser({
			name: 'test4',
			matcher: /^test4 (\d+)$/,
			handler: function(match) {
				return new Date(1970,0,+match[1]);
			}
		});
		expect(moment('test4 12').valueOf()).to.equal(+new Date(1970,0,12));
		var parsers = parseplus.parsers;
		parseplus.clearParsers();
		expect(moment('test4 12').isValid()).to.equal(false);
		parseplus.parsers = parsers;
		parseplus.removeParser('test4');
	});

});
