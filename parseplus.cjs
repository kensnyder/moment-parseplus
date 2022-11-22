const moment = require('moment');
const parser = require('any-date-parser');

/**
 * Define the function moment uses to fallback to other formats
 * @param {Object} config  The config object with info on the input
 */
moment.createFromInputFallback = function (config) {
	const date = Date.fromString(config._i, moment.locale());
	if (date instanceof Date) {
		config._d = date;
	} else {
		config._isValid = false;
	}
};

moment.fn.foobar = () => 'foobar';

/*
 * Add a new parser that handles phrases such as
 * - first day of this month
 * - last day of next month
 * - first day of this week
 * - last day of last week
 * - first day of the year
 * - last day of last year
 */
parser.addFormat(
	new parser.Format({
		matcher: /^(first|last) day of (last|this|the|next) (week|month|year)/i,
		handler: function (match) {
			const firstLast = match[1].toLowerCase();
			const lastNext = match[2].toLowerCase();
			const monthYear = match[3].toLowerCase();
			const date = moment();
			// move forward or backward one week
			if (lastNext === 'last') {
				date.subtract(1, monthYear);
			} else if (lastNext === 'next') {
				date.add(1, monthYear);
			}
			// go to start or end of the given period
			if (firstLast === 'first') {
				date.startOf(monthYear);
			} else {
				date.endOf(monthYear);
			}
			// cast to any-date-parser object
			const obj = date.toObject();
			return {
				year: obj.years,
				month: obj.months + 1,
				day: obj.date,
				hour: obj.hours,
				minute: obj.minutes,
				second: obj.seconds,
				millisecond: obj.milliseconds,
			};
		},
	})
);

// for convenience, allow importing moment directly
parser.moment = moment;

module.exports = parser;
