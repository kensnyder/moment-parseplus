# moment-parseplus

[![NPM Link](https://img.shields.io/npm/v/moment-parseplus?v=2.0.0)](https://npm.com/package/moment-parseplus)
[![Build Status](https://travis-ci.org/kensnyder/moment-parseplus.svg?branch=master&v=2.0.0)](https://travis-ci.org/kensnyder/moment-parseplus)
[![Code Coverage](https://codecov.io/gh/kensnyder/moment-parseplus/branch/master/graph/badge.svg?v=2.0.0)](https://codecov.io/gh/kensnyder/moment-parseplus)
[![ISC License](https://img.shields.io/npm/l/moment-parseplus.svg?v=2.0.0)](https://opensource.org/licenses/ISC)

An extensible date parsing plugin for [momentjs](http://momentjs.com).

_Note: The only breaking change from moment-parseplus 1.x to 2.x is the way you
add custom formats._

## Purpose

Add support to momentjs for parsing many different date formats with the ability
to easily add new formats.

## Installation

```bash
npm install moment-parseplus
```

## Usage

```js
const moment = require('moment');
require('moment-parseplus');

const date = moment('March 5th, 2016');
```

## Recognized Formats

- 24 hour time
- 12 hour time
- timezone offsets
- timezone abbreviations
- year month day
- year monthname day
- month day year
- monthname day year
- day month year
- day monthname year
- +/-/ago periods
- now/today/yesterday/tomorrow
- Twitter

moment-parseplus relies on
[any-date-format](https://www.npmjs.com/package/any-date-parser) which supports
even more formats. See the
[exhaustive list](https://www.npmjs.com/package/any-date-parser#exhaustive-list-of-date-formats).

## Adding Custom Formats

See
[any-date-format's instructions](https://www.npmjs.com/package/any-date-parser#adding-custom-formats).

Example:

```js
const parser = require('luxon-parser');

parser.addFormat(
	new parser.Format({
		matcher: /^Q([1-4]) (\d{4})$/,
		handler: function ([, quarter, year]) {
			const monthByQuarter = { 1: 1, 2: 4, 3: 7, 4: 10 };
			const month = monthByQuarter[quarter];
			return { year, month };
		},
	})
);
```

## Locale Support

The built-in parsers containing month and day names are automatically updated
when locale is changed using `moment.locale(name)`.

For example, setting locale to french (by including the locale file or calling
`moment.locale('fr')`), will allow parsing dates such as "15 septembre 2015".

## What is this sorcery?

moment provides a `moment.createFromInputFallback` method you can define to
create additional parsing rules. moment-parseplus implements that function and
gets invoked when moment fails to parse the given string.

## Unit Testing

moment-parseplus has 100% code coverage.

- To run tests, run `npm test`
- To check coverage, run `npm run coverage`

Unit tests require a global install of `full-icu` and `moment`. The test runner
will attempt to install these if absent.

## Contributing

Contributions are welcome. Please open a GitHub ticket for bugs or feature
requests. Please make a pull request for any fixes or new code you'd like to be
incorporated.
