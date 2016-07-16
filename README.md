# moment-parseplus

[![Build Status](https://travis-ci.org/kensnyder/moment-parseplus.svg?branch=master)](https://travis-ci.org/kensnyder/moment-parseplus)
[![Code Coverage](https://codecov.io/gh/kensnyder/moment-parseplus/branch/master/graph/badge.svg)](https://codecov.io/gh/kensnyder/moment-parseplus)
[![MIT License](https://img.shields.io/npm/l/express.svg)](https://opensource.org/licenses/MIT)

An extensible date parsing plugin for [momentjs](http://momentjs.com)

## Purpose

Add support to momentjs for parsing many different date formats with
 the ability to easily add new formats.

## Usage

Include moment-parseplus pass a supported date to momentjs.

```js
var moment = require('moment');
require('moment-parseplus');

var date = moment('March 5th, 2016');
```

## Supported formats


## What is this sorcery?


## How do I add my own formats?

Parsers need to have a `name` and a `matcher`. The `name` allows
removing the parser later. The `matcher` is a RegExp that finds the
dates it supports.

There are two different types of parsers. The first is a replacer.
It provides `replacer` and `format` properties that define how to
interpret the pattern matches returned by the `matcher`.

```js
var parseplus = require('moment-parseplus');

parseplus.addParser({
	name: 'clicks',
	matcher: /^(\d+) days into month (\d+) in year (\d{4})$/,
	replacer: '$1 $2 $3',
	format: 'DD MM YYYY',
});
```
