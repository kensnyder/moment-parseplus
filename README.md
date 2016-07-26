# moment-parseplus

[![Build Status](https://travis-ci.org/kensnyder/moment-parseplus.svg?branch=master&v=1.0.1)](https://travis-ci.org/kensnyder/moment-parseplus)
[![Code Coverage](https://codecov.io/gh/kensnyder/moment-parseplus/branch/master/graph/badge.svg?v=1.0.1)](https://codecov.io/gh/kensnyder/moment-parseplus)
[![MIT License](https://img.shields.io/npm/l/express.svg?v=1.0.1)](https://opensource.org/licenses/MIT)

An extensible date parsing plugin for [momentjs](http://momentjs.com)

## Purpose

Add support to momentjs for parsing many different date formats with
 the ability to easily add new formats.

## Usage

Include moment-parseplus and pass a supported date to momentjs.

```js
var moment = require('moment');
require('moment-parseplus');

var date = moment('March 5th, 2016');
```

## Supported format examples

#### 12- and 24-hour Time _(preceded by any date format)_
- 8:00:00 pm
- 08:00p.m.
- 8:00pm
- 8:00p
- 8:00am
- 8:00a
- 8am
- 22:00:00.000
- 22:00:00
- 22:00

#### US Short Date
- 03/25/2016
- 03/25/16
- 3/25/2016
- 3/25/16
- 03/25
- 3/25
- 03-25-2016
- 03-25-16
- 3-25-2016
- 3-25-16
- 03-25
- 3-25

#### World Short Date
- 25.03.2016
- 25.03.16
- 25.3.2016
- 25.3.16
- 25.3

#### Named Month
- March 25, 2016
- 25th of March, 2016
- Mar 25 2016
- Mar 25
- 25 Mar 2016
- 25 Mar 16
- 25 Mar
- 25-Mar-2016
- 25-Mar-16
- 25-Mar

#### Calculated
- +5 hours
- -2 weeks
- +8day
- 3 months ago
- in 6 hours
- etc.

#### Keyword
- now
- today
- tomorrow
- yesterday

#### Twitter
- Tue Jun 22 17:47:27 +0000 2010

## Locale Support

The built-in parsers containing month and day names are automatically
updated when locale is changed using `moment.locale(name)`.

For example, setting locale to french (by including the locale file
or calling `moment.locale('fr')`), will allow parsing dates such as
"15 septembre 2015".

## What is this sorcery?

moment provides a `moment.createFromInputFallback` method you can define
to create additional parsing rules. moment-parseplus implements that
function and gets invoked when moment fails to parse the given string.

## How do I add my own formats?

parseplus has an `addParser()` function to add a custom parser.

Parsers need to have a `name` and a `matcher`. The `name` allows
removing the parser later. The `matcher` is a RegExp that finds the
dates it supports.

There are two different types of parsers. The first is a replacer.
It provides `replacer` and `format` properties that define how to
interpret the pattern matches returned by the `matcher`.

### Replacer Example

```js
var parseplus = require('moment-parseplus');

parseplus.addParser({
	name: 'clicks',
	matcher: /^(\d+) days? into month (\d+) in year (\d{4})$/,
	replacer: '$1 $2 $3',
	format: 'DD MM YYYY'
});
```

### Handler Examples

A handler is a function that receives the match array and should return
a date object or a moment object. Two examples are below.

#### Return a date object

```js
var parseplus = require('moment-parseplus');

parseplus.addParser({
	name: 'yesteryear',
	matcher: /^yesteryear$/,
	handler: function(match) {
		var date = new Date();
		return new Date(-1*365*24*60*60*1000 + date);
	}
});
```

#### Return a moment object

```js
var parseplus = require('moment-parseplus');

parseplus.addParser({
	name: 'nights',
	matcher: /^(\d+) nights? ago$/,
	handler: function(match) {
		return moment().subtract(match[1] - 0.5, 'days');
	}
});
```

### Removing Parsing Rules

To remove support for a certain parsing rule, use `removeParser()`

```js
var parseplus = require('moment-parseplus');

parseplus.removeParser('us');
```

#### Built-in Parser Names

- `12h` 12-hour time
- `24h` 24-hour time
- `ago` Time ago such as "5 months ago"
- `conversational` Named months such as "March 14, 2012"
- `conversational-yearless` Named months such as "March 14"
- `in` Time in the future such as "in 4 weeks"
- `rfc-2822` Date such as "15-Mar-2010", "8 Dec 2011", "Thu, 8 Dec 2011"
- `rfc-2822-yearless` Date such as "15-Mar", "8 Dec", "Thu, 8 Dec"
- `plus` Addition and subtraction such as "+5 months" or "-30 seconds"
- `today` For the strings "now", "today", "tomorrow", "yesterday"
- `twitter` Date such as "Tue Jun 22 17:47:27 +0000 2010"
- `us` Date such as "3-15-2010" and "3/15/2010"
- `us-yearless` Date such as "3-15" and "3/15"
- `world` Date such as "15.03.2010" and "15/3/2010"
- `world-yearless` Date such as "15.03" and "15/3"

### Full Documentation

Full documentation is available [on doclets.io](https://doclets.io/kensnyder/moment-parseplus/master)

## Testing

After cloning this repo and running `npm install` you can run unit tests
on node or in the browser.

### Unit Tests on Node

Powered by mocha

```bash
npm run test
```

### Unit Tests in the Browser

Also powered by mocha

```bash
npm run test-browser
```

Or open `./test/index.html` in any browser.

## Test Coverage

Use Istanbul to see how much of the code is covered by unit tests

```bash
npm run coverage
```

## Contributing

Contributions are welcome. Please open a GitHub ticket for bugs or
feature requests. Please make a pull request for any fixes or
new code you'd like to be incorporated.
