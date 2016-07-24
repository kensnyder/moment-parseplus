var moment = require('moment');
require('../node_modules/moment/locale/fr.js');
require('../parseplus.js');
var expect = require("chai").expect;

// since we included the fr locale, moment's
// locale is now set to fr. Set it back to en
// so that our other tests do not fail
moment.locale('en');

describe("moment.locale()", function() {

	afterEach(function() {
		// always set locale back to en after each test
		// even if a test throws an exception
		moment.locale('en');
	});
	it("should return current locale string when given no arguments", function () {
		expect(moment.locale()).to.equal('en');
	});
	it("should set french locale and parse dates in french", function () {
		moment.locale('fr');
		expect(moment('14-janv.-2016').format('YYYY-MM-DD')).to.equal('2016-01-14');
		expect(moment('15 septembre 2015').format('YYYY-MM-DD')).to.equal('2015-09-15');
	});

});
