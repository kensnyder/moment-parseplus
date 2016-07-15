(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['moment'], function (moment) {
			return (root.returnExportsGlobal = factory(moment));
		});
	}
	else if (typeof module === 'object' && module.exports) {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory(require('moment'));
	}
	else {
		// Browser globals
		root.returnExportsGlobal = factory(root.moment);
	}
}(this, function (moment) {

	/**
	 * Hook that moment triggers when the date cannot be parsed
	 * @param {Object} config  moment passes an object with info about the instantiation
	 * @property {String} _i  The input string that was passed to the constructor
	 * @property {Date} _d  Populate this property with a valid date
	 * @property {Boolean} _isValid  Set to false if date still cannot be parsed
	 */
	moment.createFromInputFallback = function(config) {
		var date = parseplus.attemptToParse(config._i);
		if (date instanceof Date) {
			config._d = date;
		}
		else {
			config._isValid = false;
		}
	};

	(function(locale) {
		/**
		 * Monkeypatch moment.locale to update our parser regexes with new locale info
		 * @param {String|Array} [names]
		 * @param {Object} [object]
		 * @returns {String}
		 */
		moment.locale = function(names, object) {
			if (arguments.length === 0) {
				return locale.call(moment);
			}
			var currName = locale.call(moment);
			var result = locale.call(moment, names, object);
			var newName = locale.call(moment);
			if (currName != newName) {
				parseplus.updateMatchers();
			}
			return result;
		};
	})(moment.locale);

	var parseplus = {};

	/**
	 * Try to parse the given input string. Return a Date if parsing was successful
	 * @param {String} input
	 * @returns {Date|undefined}
	 */
	parseplus.attemptToParse = function(input) {
		var match;
		var parser;
		var i = 0;
		var obj;
		var mo;
		while ((parser = parseplus.parsers[i++])) {
			if (!(match = input.match(parser.matcher))) {
				continue;
			}
			if (parser.handler) {
				obj = parser.handler(match, input);
				if (obj instanceof moment && obj.isValid()) {
					return obj.toDate();
				}
				else if (obj instanceof Date) {
					return obj;
				}
				else if (obj.input && obj.format) {
					mo = parseplus.attemptFormat(obj.input, obj.format);
					if (mo.isValid()) {
						return mo.toDate();
					}
				}
			}
			else if (parser.format) {
				mo = parseplus.attemptFormat(match.slice(1), parser.format);
				if (mo.isValid()) {
					return mo.toDate();
				}
			}
		}
	};

	/**
	 * Attempt to format the given array of date parts with the given string
	 * @param {Array} match  A list of date parts
	 * @param {String} format  A space-delimited list of what each date part means
	 * @returns {moment}
	 */
	parseplus.attemptFormat = function(match, format) {
		var formatArr = [];
		var dateStrs = [];
		format.split(' ').forEach(function(f, idx) {
			if (f != '*' && match[idx] !== '') {
				dateStrs.push(match[idx]);
				formatArr.push(f);
			}
		});
		return moment(dateStrs.join('|'), formatArr.join('|'));
	};

	/**
	 * Compile a string into a regex where things like _MONTH_ are auto replace
	 * @param {String} code
	 * @returns {RegExp}
	 */
	parseplus.compile = function(code) {
		code = code.replace(/_([A-Z][A-Z0-9]+)_/g, function($0, $1) {
			return parseplus.regexes[$1];
		});
		var matcher = new RegExp(code, 'i');
		matcher.parseTpl = code;
		return matcher;
	};

	/**
	 * Update all the parser regexes with new locale data
	 */
	parseplus.updateMatchers = function() {
		regexes.MONTHNAME = moment.months().join('|') + '|' + moment.monthsShort().join('|');
		regexes.DAYNAME = moment.weekdays().join('|') + '|' + moment.weekdaysShort().join('|');
		regexes.AMPM = moment.localeData().meridiemParse.source;
		parsers.forEach(function(parser) {
			if (parser.matcher.parseTpl) {
				parser.matcher = compile(parser.matcher.parseTpl);
			}
		});
	};

	/**
	 * The strings used to generate regexes for parses
	 * @type {Object}
	 */
	parseplus.regexes = {
		YEAR: "[1-9]\\d{3}",
		MONTH: "1[0-2]|0?[1-9]",
		MONTH2: "1[0-2]|0[1-9]",
		MONTHNAME: "jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|september|oct|october|nov|november|dec|december",
		DAYNAME: "mon|monday|tue|tuesday|wed|wednesday|thu|thursday|fri|friday|sat|saturday|sun|sunday",
		DAY: "3[01]|[12]\\d|0?[1-9]",
		DAY2: "3[01]|[12]\\d|0[1-9]",
		TIMEZONE: "[+-][01]\\d\\:?[0-5]\\d",
		H24: "[01]\\d|2[0-3]",
		H12: "0?[1-9]|1[012]",
		AMPM: "am|pm",
		MIN: "[0-5]\\d",
		SEC: "[0-5]\\d",
		MS: "\\d{3,}",
		UNIT: "year|month|week|day|hour|minute|second|millisecond"
	};

	/**
	 * The list of parsers
	 * @type {Array}
	 */
	parseplus.parsers = [];

	/**
	 * Add a parser with the given specification
	 * @param {Object} spec  Should contain name, matcher, and replacer or handler
	 * @returns {parseplus}
	 */
	parseplus.addParser = function (spec) {
		parseplus.parsers.push(spec);
		return this;
	};

	/**
	 * Remove the parser with the given name
	 * @param {String} name
	 * @returns {parseplus}
	 */
	parseplus.removeParser = function (name) {
		parseplus.parsers.some(function(parser, i) {
			if (parser.name == name) {
				parseplus.parsers.splice(i, 1);
				return true;
			}
		});
		return this;
	};

	/**
	 * Remove all parsers
	 * @returns {parseplus}
	 */
	parseplus.clearParsers = function () {
		parseplus.parsers = [];
		return this;
	};

	// Register our built-in parsers!
	parseplus
		// 24 hour time
		.addParser({
			name: '24h',
			//                               $1            $2        $3           $4           $5                  $6
			matcher: parseplus.compile("^(?:(.+?)(?: |T))?(_H24_)\\:(_MIN_)(?:\\:(_SEC_)(?:\\.(_MS_))?)? ?(?:GMT)?(_TIMEZONE_)?(?: \\([A-Z]+\\))?$"),
			handler: function(match) {
				var date, mo;
				if (match[1]) {
					date = parseplus.attemptToParse(match[1]);
					if (date) {
						mo = moment(date);
					}
					else {
						return;
					}
				}
				else {
					// today plus the given time
					mo = moment();
				}
				return {
					input: [mo.year(), mo.month()+1, mo.date()].concat(match.slice(2)),
					format: 'YYYY MM DD hh mm ss SSS ZZ'
				};
			}
		})
		// 12-hour time
		.addParser({
			name: '12h',
			//                               $1     $2           $3           $4           $5
			matcher: parseplus.compile("^(?:(.+) )?(_H12_)(?:\\:(_MIN_)(?:\\:(_SEC_))?)? ?(_AMPM_)$"),
			handler: function(match) {
				var date, mo;
				if (match[1]) {
					date = parseplus.attemptToParse(match[1]);
					if (date) {
						mo = moment(date);
					}
					else {
						return;
					}
				}
				else {
					// today plus the given time
					mo = moment();
				}
				return {
					input: [mo.year(), mo.month()+1, mo.date()].concat(match.slice(2)),
					format: 'YYYY MM DD h mm ss a'
				}
			}
		})
		// date such as "3-15-2010" and "3/15/2010"
		.addParser({
			name: 'us',
			//                            $1       $2        $3      $4
			matcher: parseplus.compile("^(_MONTH_)([\\/-])(_DAY_)\\2(_YEAR_)$"),
			format: 'MM * DD YYYY'
		})
		// date such as "3-15" and "3/15"
		.addParser({
			name: 'us-yearless',
			//                            $1             $2
			matcher: parseplus.compile("^(_MONTH_)[\\/-](_DAY_)$"),
			handler: function(match) {
				return {
					input: [match[1], match[2], new Date().getFullYear()],
					format: 'MM DD YYYY'
				};
			}
		})
		// date such as "15.03.2010" and "15/3/2010"
		.addParser({
			name: 'world',
			//                            $1     $2        $3          $4
			matcher: parseplus.compile("^(_DAY_)([\\/\\.])(_MONTH_)\\2(_YEAR_)$"),
			format: 'DD * MM YYYY'
		})
		// date such as "15.03" and "15/3"
		.addParser({
			name: 'world-yearless',
			//                            $1             $2
			matcher: parseplus.compile("^(_DAY_)[\\/\\.](_MONTH_)$"),
			handler: function(match) {
				return {
					input: [match[1], match[2], new Date().getFullYear()],
					format: 'DD MM YYYY'
				};
			}
		})
		// date such as "15-Mar-2010", "8 Dec 2011", "Thu, 8 Dec 2011"
		.addParser({
			name: 'middle-month',
			//                                       $1           $2              $3
			matcher: parseplus.compile("^(?:(?:_DAYNAME_),? )?(_DAY_)([ -])(_MONTHNAME_)\\2(_YEAR_)$"),
			format: 'DD * MMM YYYY'
		})
		// date such as "March 4, 2012", "Mar 4 2012", "Sun Mar 4 2012"
		.addParser({
			name: 'conversational',
			//                                       $1            $2        $3
			matcher: parseplus.compile("^(?:(?:_DAYNAME_),? )?(_MONTHNAME_) (_DAY_),? (_YEAR_)$"),
			replacer: '$1 $2 $3',
			format: 'MMM DD YYYY'
		})
		// date such as "Tue Jun 22 17:47:27 +0000 2010"
		.addParser({
			name: 'dangling-year',
			//                                          $1            $2      $3         $4      $5          $6           $7
			matcher: parseplus.compile("^(?:_DAYNAME_) (_MONTHNAME_) (_DAY_) (_H24_)?\\:(_MIN_)?(\\:_SEC_)? (_TIMEZONE_) (_YEAR_)$"),
			format: 'MMM DD HH mm ss ZZ YYYY'
		})
		.addParser({
			name: 'ago',
			matcher: parseplus.compile("^([\\d.]+) (_UNIT_)s? ago$"),
			handler: function(match) {
				return moment().subtract(parseFloat(match[1]), match[2]);
			}
		})
		.addParser({
			name: 'in',
			matcher: parseplus.compile("^in ([\\d.]+) (_UNIT_)s?$"),
			handler: function(match) {
				return moment().add(parseFloat(match[1]), match[2]);
			}
		})
		.addParser({
			name: 'today',
			matcher: /^(today|now|tomorrow|yesterday)/i,
			handler: function(match) {
				switch (match[1].toLowerCase()) {
					case 'today':
					case 'now':
						return moment();
					case 'tomorrow':
						return moment().add(1, 'day');
					case 'yesterday':
						return moment().subtract(1, 'day');
				}
			}
		})
		.addParser({
			name: 'plus',
			matcher: parseplus.compile("^([+-]) ?([\\d.]+) (_UNIT_)s?$"),
			handler: function(match) {
				var mult = match[1] == '-' ? -1 : 1;
				return moment().add(mult * parseFloat(match[2]), match[3]);
			}
		})
	;

	return parseplus;

}));
//
// // RFC-2616
// //
//
// Date.create.patterns = [
//
// 	// 2 weeks after today, 3 months after 3-5-2008
// 	[
// 		'weeks_months_before_after',
// 		Date.create.makePattern("^(\\d+) (_UNIT_)s? (before|from|after) (.+)$"),
// 		function(match) {
// 			var fromDate = Date.create(match[4]);
// 			if (fromDate instanceof Date) {
// 				return fromDate.add((match[3].toLowerCase() == 'before' ? -1 : 1) * match[1], match[2]);
// 			}
// 			return false;
// 		}
// 	],
//
//
// 	// this/next/last january, next thurs
// 	[
// 		'this_next_last',
// 		Date.create.makePattern("^(this|next|last) (?:(_UNIT_)s?|(_MONTHNAME_)|(_DAYNAME_))$"),
// 		function(match) {
// 			// $1 = this/next/last
// 			var multiplier = match[1].toLowerCase() == 'last' ? -1 : 1;
// 			var now = Date.current();
// 			var i;
// 			var diff;
// 			var month;
// 			var weekday;
// 			// $2 = interval name
// 			if (match[2]) {
// 				return now.add(multiplier, match[2]);
// 			}
// 			// $3 = month name
// 			else if (match[3]) {
// 				month = Date.getMonthByName(match[3]) - 1;
// 				diff = 12 - (now.getMonth() - month);
// 				diff = diff > 12 ? diff - 12 : diff;
// 				return now.add(multiplier * diff, 'month');
// 			}
// 			// $4 = weekday name
// 			else if (match[4]) {
// 				weekday = Date.getWeekdayByName(match[4]);
// 				diff = now.getDay() - weekday + 7;
// 				return now.add(multiplier * (diff == 0 ? 7 : diff), 'day');
// 			}
// 			return false;
// 		}
// 	],
//
// 	// January 4th, July the 4th
// 	[
// 		'conversational_sans_year',
// 		Date.create.makePattern("^(_MONTHNAME_) (?:the )?(\\d+)(?:st|nd|rd|th)?$"),
// 		function(match) {
// 			var d = Date.current();
// 			if (match[1]) {
// 				d.setMonth( Date.getMonthByName(match[1]) - 1 );
// 			}
// 			d.setDate(match[2]);
// 			return d;
// 		}
// 	]
// ];
