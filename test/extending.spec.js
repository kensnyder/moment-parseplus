var moment = require('moment');
var parseplus = require('../parseplus.js');
var expect = require("chai").expect;

describe("extending parseplus", function() {

	it("should add replacer", function () {
		parseplus.addParser({
			name: 'test1',
			matcher: /^replace (\d+)$/,
			replacer: '01/$1/1970'
		});
		expect(moment('replace 12').valueOf()).to.equal(+new Date(1970,0,12));
		parseplus.removeParser('test1');
	});
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

});
