# moment-parseplus

[![Build Status](https://travis-ci.org/kensnyder/moment-parseplus.svg?branch=master&v0.1.0)](https://travis-ci.org/kensnyder/moment-parseplus)
[![Code Coverage](https://codecov.io/gh/kensnyder/moment-parseplus/branch/master/graph/badge.svg?v0.1.0)](https://codecov.io/gh/kensnyder/moment-parseplus)
[![MIT License](https://img.shields.io/npm/l/express.svg)](https://opensource.org/licenses/MIT)

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

## Supported formats

### US Short Date
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

### World Short Date
- 25.03.2016
- 25.03.16
- 25.3.2016
- 25.3.16
- 25.3

### Named Month
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

### Calculated
- +5 hours
- -2 weeks
- 3 months ago
- in 6 hours
- etc.

### Keyword
- now
- today
- tomorrow
- yesterday

## What is this sorcery?

moment provides a `moment.createFromInputFallback` method you can define
to create additional parsing rules. moment-parseplus implements that
function and gets invoked when moment fails to parse the given string.

## How do I add my own formats?

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
	matcher: /^(\d+) days into month (\d+) in year (\d{4})$/,
	replacer: '$1 $2 $3',
	format: 'DD MM YYYY'
});
```

### Handler Examples

A handler is a function that receives the match array and should return
a date object or a moment object.

#### Return a date object

```js
var parseplus = require('moment-parseplus');

parseplus.addParser({
	name: 'yesteryear',
	matcher: /^yesteryear$/,
	handler: function(match) {
		var date = new Date();
		return new Date(365*24*60*60*100 + date);
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
- `conversational` Named months such as "March 4, 2012"
- `in-time` Time in the future such as "in 4 weeks"
- `middle-month`
- `middle-month-yearless`
- `plus` Addition and subtraction such as "+5 months" or "-30 seconds"
- `time-ago` Time ago such as "5 months ago"
- `today` For the strings "now", "today", "tomorrow", "yesterday"
- `us`
- `us-yearless`
- `world`
- `world-yearless`
