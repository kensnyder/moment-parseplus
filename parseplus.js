(function (root, factory) {
	/* istanbul ignore next */
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
		root.parseplus = factory(root.moment);
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

	/**
	 * The parseplus object including methods addMatcher and removeMatcher.
	 * Also contains all other methods and values parseplus uses internally.
	 * @type {Object}
	 */
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
				// this parser cannot parse this date string
				continue;
			}
			if (parser.handler) {
				// a handler function that should return moment or Date
				obj = parser.handler(match, input);
				if (obj instanceof moment && obj.isValid()) {
					return obj.toDate();
				}
				else if (obj instanceof Date) {
					return obj;
				}
			}
			else if (parser.format) {
				// a handler format which will pass a parse string to moment
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
		// go through each format string and line up to match
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
		var compiled = code.replace(/_([A-Z][A-Z0-9]+)_/g, function($0, $1) {
			return parseplus.regexes[$1];
		});
		return new RegExp(compiled, 'i');
	};

	/**
	 * Update all the parser regexes with new locale data
	 */
	parseplus.updateMatchers = function() {
		try {
			parseplus.regexes.MONTHNAME = moment.months().join('|') + '|' + moment.monthsShort().join('|');
			parseplus.regexes.DAYNAME = moment.weekdays().join('|') + '|' + moment.weekdaysShort().join('|');
			var config = moment.localeData()._config;
			parseplus.regexes.AMPM = config.meridiemParse.source;
			var ordinalParse = config.ordinalParse || config.dayOfMonthOrdinalParse;
			parseplus.regexes.ORDINAL = ordinalParse.source.replace(/.*\(([^)]+)\).*/, '$1');
			parseplus.parsers.forEach(function (parser) {
				if (parser.template) {
					parser.matcher = parseplus.compile(parser.template);
				}
			});
		}
		catch (e) {
			// moment has changed its internal handling of localeData
		}
	};

	/**
	 * The strings used to generate regexes for parses
	 * @type {Object}
	 */
	parseplus.regexes = {
		YEAR: "[1-9]\\d{3}|\\d{2}",
		MONTH: "1[0-2]|0?[1-9]",
		MONTH2: "1[0-2]|0[1-9]",
		MONTHNAME: "jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|september|oct|october|nov|november|dec|december",
		DAYNAME: "mon|monday|tue|tuesday|wed|wednesday|thu|thursday|fri|friday|sat|saturday|sun|sunday",
		DAY: "3[01]|[12]\\d|0?[1-9]",
		DAY2: "3[01]|[12]\\d|0[1-9]",
		TIMEZONE: "[+-][01]\\d\\:?[0-5]\\d",
		TZABBR: "[A-Z]{3,10}",
		H24: "[01]\\d|2[0-3]",
		H12: "0?[1-9]|1[012]",
		AMPM: "[ap]\\.?m?\\.?",
		MIN: "[0-5]\\d",
		SEC: "[0-5]\\d",
		MS: "\\d{3,}",
		UNIT: "year|month|week|day|hour|minute|second|millisecond",
		ORDINAL: "st|nd|rd|th"
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
		if (spec.template) {
			spec.matcher = parseplus.compile(spec.template);
		}
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
			// lots of 24h time such as "23:59", "T23:59:59+0700", "23:59:59 GMT-05:00", "23:59:59 CST", "T23:59:59Z"
			name: '24h',
			//              $1            $2        $3           $4           $5                   $6             $7
			template: "^(?:(.+?)(?: |T))?(_H24_)\\:(_MIN_)(?:\\:(_SEC_)(?:\\.(_MS_))?)? ?(?:GMT)? ?(_TIMEZONE_)? ?(_TZABBR_)?$",
			handler: function(match) {
				var date, mo;
				if (match[1]) {
					date = parseplus.attemptToParse(match[1]);
					// console.log(['24h parse', match[1], 'into', moment(date).toString()]);
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
				if (!match[6] && match[7]) {
					match[6] = parseplus.tzabbrs[match[7]];
					match[7] = '';
				}
				var parts = [mo.year(), mo.month()+1, mo.date()].concat(match.slice(2));
				parts[5] = parts[5] || '00';
				parts[6] = parts[6] || '000';
				parts.pop(); // remove 9th item
				return moment(parts.join('|'), 'YYYY|MM|DD|HH|mm|ss|SSS|ZZ');
			}
		})
		// 12-hour time
		.addParser({
			name: '12h',
			//              $1     $2           $3           $4           $5
			template: "^(?:(.+) )?(_H12_)(?:\\:(_MIN_)(?:\\:(_SEC_))?)? ?(_AMPM_)$",
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
				return moment(
					[mo.year(), mo.month()+1, mo.date()].concat(match.slice(2)).join(' '),
					'YYYY MM DD h mm ss a'
				);
			}
		})
		// date such as "3-15-2010" and "3/15/2010"
		.addParser({
			name: 'us',
			//           $1       $2        $3      $4
			template: "^(_MONTH_)([\\/-])(_DAY_)\\2(_YEAR_)$",
			format: 'MM * DD YYYY'
		})
		// date such as "3-15" and "3/15"
		.addParser({
			name: 'us-yearless',
			//           $1             $2
			template: "^(_MONTH_)[\\/-](_DAY_)$",
			handler: function(match) {
				return moment(
					[match[1], match[2], new Date().getFullYear()].join(' '),
					'MM DD YYYY'
				);
			}
		})
		// date such as "15.03.2010" and "15/3/2010"
		.addParser({
			name: 'world',
			//           $1     $2        $3          $4
			template: "^(_DAY_)([\\/\\.])(_MONTH_)\\2(_YEAR_)$",
			format: 'DD * MM YYYY'
		})
		// date such as "15.03" and "15/3"
		.addParser({
			name: 'world-yearless',
			//           $1             $2
			template: "^(_DAY_)[\\/\\.](_MONTH_)$",
			handler: function(match) {
				return moment(
					[match[1], match[2], new Date().getFullYear()].join(' '),
					'DD MM YYYY'
				);
			}
		})
		// date such as "15-Mar-2010", "8 Dec 2011", "Thu, 8 Dec 2011"
		.addParser({
			name: 'rfc-2822',
			//                                    $1                   $2                        $3
			template: "^(?:(?:_DAYNAME_)\\.?,? )?(_DAY_)(?:_ORDINAL_)?([ -])(_MONTHNAME_)\\.?\\2(_YEAR_)$",
			format: 'DD * MMM YYYY'
		})
		// date such as "15-Mar", "8 Dec", "Thu, 8 Dec"
		.addParser({
			name: 'rfc-2822-yearless',
			//                                    $1                       $2
			template: "^(?:(?:_DAYNAME_)\\.?,? )?(_DAY_)(?:_ORDINAL_)?[ -](_MONTHNAME_)\\.?$",
			handler: function(match) {
				return moment(
					[match[1], match[2], new Date().getFullYear()].join(' '),
					'DD MMM YYYY'
				);
			}
		})
		// date such as "March 4, 2012", "Mar 4 2012", "Sun Mar 4 2012"
		.addParser({
			name: 'conversational',
			//                                    $1                $2                      $3
			template: "^(?:(?:_DAYNAME_)\\.?,? )?(_MONTHNAME_)\\.? (_DAY_)(?:_ORDINAL_)?,? (_YEAR_)$",
			replacer: '$1 $2 $3',
			format: 'MMM DD YYYY'
		})
		// date such as "March 4", "Mar 4", "Sun Mar 4"
		.addParser({
			name: 'conversational-yearless',
			//                                    $1                $2
			template: "^(?:(?:_DAYNAME_)\\.?,? )?(_MONTHNAME_)\\.? (_DAY_)(?:_ORDINAL_)?$",
			handler: function (match) {
				return moment(
					[match[1], match[2], new Date().getFullYear()].join(' '),
					'MMM DD YYYY'
				);
			}
		})
		// date such as "Tue Jun 22 17:47:27 +0000 2010"
		.addParser({
			name: 'twitter',
			//                             $1                   $2      $3         $4      $5          $6           $7
			template: "^(?:_DAYNAME_)\\.? (_MONTHNAME_)\\.?\.? (_DAY_) (_H24_)?\\:(_MIN_)?(\\:_SEC_)? (_TIMEZONE_) (_YEAR_)$",
			format: 'MMM DD HH mm ss ZZ YYYY'
		})
		.addParser({
			name: 'ago',
			template: "^([\\d.]+) (_UNIT_)s? ago$",
			handler: function(match) {
				return moment().subtract(parseFloat(match[1]), match[2]);
			}
		})
		.addParser({
			name: 'in',
			template: "^in ([\\d.]+) (_UNIT_)s?$",
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
			template: "^([+-]) ?([\\d.]+) ?(_UNIT_)s?$",
			handler: function(match) {
				var mult = match[1] == '-' ? -1 : 1;
				return moment().add(mult * parseFloat(match[2]), match[3]);
			}
		})
		.addParser({
			name: 'firstlastdayof',
			matcher: /^(first|last) day of (last|this|the|next) (week|month|year)/i,
			handler: function(match) {
				var firstlast = match[1].toLowerCase();
				var lastnext = match[2].toLowerCase();
				var monthyear = match[3].toLowerCase();
				var date = moment();
				if (lastnext == 'last') {
					date.subtract(1, monthyear);
				}
				else if (lastnext == 'next') {
					date.add(1, monthyear);
				}
				if (firstlast == 'first') {
					return date.startOf(monthyear);
				}
				return date.endOf(monthyear);
				
			}
		})
	    .addParser({
	    	name: 'startOfNTimeAgo',
  			template: "^(start|end) of ([\\d]+) ([_UNIT_]+) ago$",
  			handler: function(match) {
				var n = match[2];
				var unit = match[3].toLowerCase();
				var startOrEnd = match[1].toLowerCase();
  				var date = moment().subtract(parseFloat(n), unit);
				if(startOrEnd === 'start') {
					return date.startOf(unit);
				}
				return date.endOf(unit);			
			}
		})
	;

	/**
	 * A lookup of Timezone offset string by abbreviation. In some cases
	 * multiple timezones have the same abbreviation. In those cases
	 * the more US-centric one is used
	 * @type {Object}
	 */
	parseplus.tzabbrs = {
		"ACDT": "+10:30", // Australian Central Daylight Savings Time
		"ACST": "+09:30", // Australian Central Standard Time
		// "ACT": "-05:00", // Acre Time
		"ACT": "+08:00", // ASEAN Common Time
		"ADT": "-03:00", // Atlantic Daylight Time
		"AEDT": "+11:00", // Australian Eastern Daylight Savings Time
		"AEST": "+10:00", // Australian Eastern Standard Time
		"AFT": "+04:30", // Afghanistan Time
		"AKDT": "-08:00", // Alaska Daylight Time
		"AKST": "-09:00", // Alaska Standard Time
		"AMST": "-03:00", // Amazon Summer Time (Brazil)[1]
		"AMT": "-04:00", // Amazon Time (Brazil)[2]
		// "AMT": "+04:00", // Armenia Time
		"ART": "-03:00", // Argentina Time
		"AST": "+03:00", // Arabia Standard Time
		// "AST": "-04:00", // Atlantic Standard Time
		"AWDT": "+09:00", // Australian Western Daylight Time
		"AWST": "+08:00", // Australian Western Standard Time
		"AZOST": "-01:00", // Azores Standard Time
		"AZT": "+04:00", // Azerbaijan Time
		// "BDT": "+08:00", // Brunei Time
		"BDT": "+06:00", // Bangladesh Daylight Time (Bangladesh Daylight saving time keeps UTC+06 offset) [3]
		"BIOT": "+06:00", // British Indian Ocean Time
		"BIT": "-12:00", // Baker Island Time
		"BOT": "-04:00", // Bolivia Time
		"BRST": "-02:00", // Brasilia Summer Time
		"BRT": "-03:00", // Brasilia Time
		// "BST": "+06:00", // Bangladesh Standard Time
		// "BST": "+11:00", // Bougainville Standard Time[4]
		"BST": "+01:00", // British Summer Time (British Standard Time from Feb 1968 to Oct 1971)
		"BTT": "+06:00", // Bhutan Time
		"CAT": "+02:00", // Central Africa Time
		"CCT": "+06:30", // Cocos Islands Time
		"CDT": "-05:00", // Central Daylight Time (North America)
		// "CDT": "-04:00", // Cuba Daylight Time[5]
		"CEDT": "+02:00", // Central European Daylight Time
		"CEST": "+02:00", // Central European Summer Time (Cf. HAEC)
		"CET": "+01:00", // Central European Time
		"CHADT": "+13:45", // Chatham Daylight Time
		"CHAST": "+12:45", // Chatham Standard Time
		"CHOT": "+08:00", // Choibalsan
		"ChST": "+10:00", // Chamorro Standard Time
		"CHUT": "+10:00", // Chuuk Time
		"CIST": "-08:00", // Clipperton Island Standard Time
		"CIT": "+08:00", // Central Indonesia Time
		"CKT": "-10:00", // Cook Island Time
		"CLST": "-03:00", // Chile Summer Time
		"CLT": "-04:00", // Chile Standard Time
		"COST": "-04:00", // Colombia Summer Time
		"COT": "-05:00", // Colombia Time
		"CST": "-06:00", // Central Standard Time (North America)
		// "CST": "+08:00", // China Standard Time
		// "CST": "+09:30", // Central Standard Time (Australia)
		// "CST": "+10:30", // Central Summer Time (Australia)
		// "CST": "-05:00", // Cuba Standard Time
		"CT": "+08:00", // China time
		"CVT": "-01:00", // Cape Verde Time
		"CWST": "+08:45", // Central Western Standard Time (Australia) unofficial
		"CXT": "+07:00", // Christmas Island Time
		"DAVT": "+07:00", // Davis Time
		"DDUT": "+10:00", // Dumont d'Urville Time
		"DFT": "+01:00", // AIX specific equivalent of Central European Time[6]
		"EASST": "-05:00", // Easter Island Standard Summer Time
		"EAST": "-06:00", // Easter Island Standard Time
		"EAT": "+03:00", // East Africa Time
		// "ECT": "-04:00", // Eastern Caribbean Time (does not recognise DST)
		"ECT": "-05:00", // Ecuador Time
		"EDT": "-04:00", // Eastern Daylight Time (North America)
		"EEDT": "+03:00", // Eastern European Daylight Time
		"EEST": "+03:00", // Eastern European Summer Time
		"EET": "+02:00", // Eastern European Time
		"EGST": "+00:00", // Eastern Greenland Summer Time
		"EGT": "-01:00", // Eastern Greenland Time
		"EIT": "+09:00", // Eastern Indonesian Time
		"EST": "-05:00", // Eastern Standard Time (North America)
		// "EST": "+10:00", // Eastern Standard Time (Australia)
		"FET": "+03:00", // Further-eastern European Time
		"FJT": "+12:00", // Fiji Time
		"FKST": "-03:00", // Falkland Islands Standard Time
		// "FKST": "-03:00", // Falkland Islands Summer Time
		"FKT": "-04:00", // Falkland Islands Time
		"FNT": "-02:00", // Fernando de Noronha Time
		"GALT": "-06:00", // Galapagos Time
		"GAMT": "-09:00", // Gambier Islands
		"GET": "+04:00", // Georgia Standard Time
		"GFT": "-03:00", // French Guiana Time
		"GILT": "+12:00", // Gilbert Island Time
		"GIT": "-09:00", // Gambier Island Time
		"GMT": "+00:00", // Greenwich Mean Time
		"GST": "-02:00", // South Georgia and the South Sandwich Islands
		// "GST": "+04:00", // Gulf Standard Time
		"GYT": "-04:00", // Guyana Time
		"HADT": "-09:00", // Hawaii-Aleutian Daylight Time
		"HAEC": "+02:00", // Heure Avancée d'Europe Centrale francised name for CEST
		"HAST": "-10:00", // Hawaii-Aleutian Standard Time
		"HKT": "+08:00", // Hong Kong Time
		"HMT": "+05:00", // Heard and McDonald Islands Time
		"HOVT": "+07:00", // Khovd Time
		"HST": "-10:00", // Hawaii Standard Time
		"IBST": "+00:00", // International Business Standard Time
		"ICT": "+07:00", // Indochina Time
		"IDT": "+03:00", // Israel Daylight Time
		"IOT": "+03:00", // Indian Ocean Time
		"IRDT": "+04:30", // Iran Daylight Time
		"IRKT": "+08:00", // Irkutsk Time
		"IRST": "+03:30", // Iran Standard Time
		// "IST": "+05:30", // Indian Standard Time
		// "IST": "+01:00", // Irish Standard Time[7]
		"IST": "+02:00", // Israel Standard Time
		"JST": "+09:00", // Japan Standard Time
		"KGT": "+06:00", // Kyrgyzstan time
		"KOST": "+11:00", // Kosrae Time
		"KRAT": "+07:00", // Krasnoyarsk Time
		"KST": "+09:00", // Korea Standard Time
		"LHST": "+10:30", // Lord Howe Standard Time
		// "LHST": "+11:00", // Lord Howe Summer Time
		"LINT": "+14:00", // Line Islands Time
		"MAGT": "+12:00", // Magadan Time
		"MART": "-09:30", // Marquesas Islands Time
		"MAWT": "+05:00", // Mawson Station Time
		"MDT": "-06:00", // Mountain Daylight Time (North America)
		"MET": "+01:00", // Middle European Time Same zone as CET
		"MEST": "+02:00", // Middle European Summer Time Same zone as CEST
		"MHT": "+12:00", // Marshall Islands
		"MIST": "+11:00", // Macquarie Island Station Time
		"MIT": "-09:30", // Marquesas Islands Time
		"MMT": "+06:30", // Myanmar Time
		"MSK": "+03:00", // Moscow Time
		// "MST": "+08:00", // Malaysia Standard Time
		"MST": "-07:00", // Mountain Standard Time (North America)
		// "MST": "+06:30", // Myanmar Standard Time
		"MUT": "+04:00", // Mauritius Time
		"MVT": "+05:00", // Maldives Time
		"MYT": "+08:00", // Malaysia Time
		"NCT": "+11:00", // New Caledonia Time
		"NDT": "-02:30", // Newfoundland Daylight Time
		"NFT": "+11:00", // Norfolk Time
		"NPT": "+05:45", // Nepal Time
		"NST": "-03:30", // Newfoundland Standard Time
		"NT": "-03:30", // Newfoundland Time
		"NUT": "-11:00", // Niue Time
		"NZDT": "+13:00", // New Zealand Daylight Time
		"NZST": "+12:00", // New Zealand Standard Time
		"OMST": "+06:00", // Omsk Time
		"ORAT": "+05:00", // Oral Time
		"PDT": "-07:00", // Pacific Daylight Time (North America)
		"PET": "-05:00", // Peru Time
		"PETT": "+12:00", // Kamchatka Time
		"PGT": "+10:00", // Papua New Guinea Time
		"PHOT": "+13:00", // Phoenix Island Time
		"PKT": "+05:00", // Pakistan Standard Time
		"PMDT": "-02:00", // Saint Pierre and Miquelon Daylight time
		"PMST": "-03:00", // Saint Pierre and Miquelon Standard Time
		"PONT": "+11:00", // Pohnpei Standard Time
		"PST": "-08:00", // Pacific Standard Time (North America)
		// "PST": "+08:00", // Philippine Standard Time
		"PYST": "-03:00", // Paraguay Summer Time (South America)[8]
		"PYT": "-04:00", // Paraguay Time (South America)[9]
		"RET": "+04:00", // Réunion Time
		"ROTT": "-03:00", // Rothera Research Station Time
		"SAKT": "+11:00", // Sakhalin Island time
		"SAMT": "+04:00", // Samara Time
		"SAST": "+02:00", // South African Standard Time
		"SBT": "+11:00", // Solomon Islands Time
		"SCT": "+04:00", // Seychelles Time
		"SGT": "+08:00", // Singapore Time
		"SLST": "+05:30", // Sri Lanka Standard Time
		"SRET": "+11:00", // Srednekolymsk Time
		"SRT": "-03:00", // Suriname Time
		// "SST": "-11:00", // Samoa Standard Time
		"SST": "+08:00", // Singapore Standard Time
		"SYOT": "+03:00", // Showa Station Time
		"TAHT": "-10:00", // Tahiti Time
		"THA": "+07:00", // Thailand Standard Time
		"TFT": "+05:00", // Indian/Kerguelen
		"TJT": "+05:00", // Tajikistan Time
		"TKT": "+13:00", // Tokelau Time
		"TLT": "+09:00", // Timor Leste Time
		"TMT": "+05:00", // Turkmenistan Time
		"TOT": "+13:00", // Tonga Time
		"TVT": "+12:00", // Tuvalu Time
		"UCT": "+00:00", // Coordinated Universal Time
		"ULAT": "+08:00", // Ulaanbaatar Time
		"USZ1": "+02:00", // Kaliningrad Time
		"UTC": "+00:00", // Coordinated Universal Time
		"UYST": "-02:00", // Uruguay Summer Time
		"UYT": "-03:00", // Uruguay Standard Time
		"UZT": "+05:00", // Uzbekistan Time
		"VET": "-04:00", // Venezuelan Standard Time
		"VLAT": "+10:00", // Vladivostok Time
		"VOLT": "+04:00", // Volgograd Time
		"VOST": "+06:00", // Vostok Station Time
		"VUT": "+11:00", // Vanuatu Time
		"WAKT": "+12:00", // Wake Island Time
		"WAST": "+02:00", // West Africa Summer Time
		"WAT": "+01:00", // West Africa Time
		"WEDT": "+01:00", // Western European Daylight Time
		"WEST": "+01:00", // Western European Summer Time
		"WET": "+00:00", // Western European Time
		"WIT": "+07:00", // Western Indonesian Time
		"WST": "+08:00", // Western Standard Time
		"YAKT": "+09:00", // Yakutsk Time
		"YEKT": "+05:00", // Yekaterinburg Time
		"Z": "+00:00" // Zulu Time (Coordinated Universal Time)
	};

	return parseplus;

}));
