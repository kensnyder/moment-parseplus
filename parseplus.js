const moment = require('moment');
const parser = require('any-date-parser');

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

moment.createFromInputFallback = function (config) {
	const date = Date.fromString(config._i, moment.locale());
	if (date instanceof Date) {
		config._d = date;
	} else {
		config._isValid = false;
	}
};

module.exports = parser;
