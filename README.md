# moment-parseplus

[![NPM Link](https://img.shields.io/npm/v/moment-parseplus?v=2.0.0)](https://npm.com/package/moment-parseplus)
[![Build Status](https://ci.appveyor.com/api/projects/status/github/kensnyder/moment-parseplus?branch=master&svg=true&v=2.0.0)](https://ci.appveyor.com/project/kensnyder/moment-parseplus)
[![Code Coverage](https://codecov.io/gh/kensnyder/moment-parseplus/branch/master/graph/badge.svg?v=2.0.0)](https://codecov.io/gh/kensnyder/moment-parseplus)
[![ISC License](https://img.shields.io/npm/l/moment-parseplus.svg?v=2.0.0)](https://opensource.org/licenses/ISC)

A comprehensive and extensible date parsing plugin for
[Moment.js](http://momentjs.com). It allows passing a wide variety of date
formats to the `moment` constructor. Most locales are supported automatically.

_Note: The only breaking change from `moment-parseplus` 1.x to 2.x is the way
you [add custom formats](#adding-custom-formats)._

## Table of Contents

- [Motivation](#motivation)
- [Installation](#installation)
- [Usage](#usage)
- [Recognized Formats](#recognized-formats)
- [Adding Custom Formats](#adding-custom-formats)
- [Locale Support](#locale-support)
- [What is this sorcery?](#what-is-this-sorcery)
- [Sister Packages](#sister-packages)
- [Unit Testing](#unit-testing)
- [Contributing](#contributing)

## Motivation

1. The APIs I consume have a lot of different date formats
1. I want to create REST APIs that accept all major formats
1. I want to handle user-input dates
1. I want to support dates in other languages according to JavaScript's new
   `Intl` global object

## Installation

```bash
npm install moment-parseplus
```

## Usage

```js
const moment = require('moment');
require('moment-parseplus');

const date1 = moment('March 5th, 2016 at 7:05pm');
const date2 = moment('9 days ago');
const date3 = moment('2016-03-05 23:59:59 CST');
```

Or, for convenience, you can just import `moment` from `moment-parseplus`:

```js
import { moment } from 'moment-parseplus';

const date1 = moment('March 5th, 2016 at 7:05pm');
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

`moment-parseplus` relies on
[any-date-parser](https://www.npmjs.com/package/any-date-parser) which supports
even more formats. See the
[exhaustive list](https://www.npmjs.com/package/any-date-parser#exhaustive-list-of-date-formats).

## Adding Custom Formats

See
[any-date-format's instructions](https://www.npmjs.com/package/any-date-parser#adding-custom-formats).

Example:

```js
const parser = require('moment-parseplus');

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

console.log(moment('Q4 2020'));
```

## Locale Support

The built-in parsers containing month and day names are automatically updated
when locale is changed using `moment.locale(name)`.

For example, setting locale to French (by including the locale file or calling
`moment.locale('fr')`), will allow parsing dates such as "15 septembre 2015".

## What is this sorcery?

Moment.js provides a `moment.createFromInputFallback` method you can define to
create additional parsing rules. `moment-parseplus` implements that function and
gets invoked when Moment.js fails to parse the given string.

## Sister Packages

- Standalone Parser:
  [any-date-parser](http://npmjs.com/packages/any-date-parser)
- DayJS: [dayjs-parser](http://npmjs.com/package/dayjs-parser)
- Luxon: [luxon-parser](http://npmjs.com/package/luxon-parser)

## Unit Testing

`moment-parseplus` has 100% code coverage.

- To run tests, run `npm test`
- To check coverage, run `npm run coverage`

Unit tests require a global install of `full-icu` and `moment`. The test runner
will attempt to install these if absent.

## Contributing

Contributions are welcome. Please open a GitHub ticket for bugs or feature
requests. Please make a pull request for any fixes or new code you'd like to be
incorporated.
