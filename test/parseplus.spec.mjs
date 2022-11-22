import moment from 'moment';
import '../parseplus.mjs';

describe('first day / last day parser', function () {
	it('should parse dates times like `first day of this week`', function () {
		const actual = moment('first day of this week');
		const expected = moment().startOf('week');
		expect(actual.format()).toEqual(expected.format());
	});
	it('should parse dates times like `last day of this week`', function () {
		const actual = moment('last day of this week');
		const expected = moment().endOf('week');
		expect(actual.format()).toEqual(expected.format());
	});
	it('should parse dates times like `first day of this month`', function () {
		const actual = moment('first day of this month');
		const expected = moment().startOf('month');
		expect(actual.format()).toEqual(expected.format());
	});
	it('should parse dates times like `last day of this month`', function () {
		const actual = moment('last day of this month');
		const expected = moment().endOf('month');
		expect(actual.format()).toEqual(expected.format());
	});
	it('should parse dates times like `last day of this year`', function () {
		const actual = moment('last day of this year');
		const expected = moment().endOf('year');
		expect(actual.format()).toEqual(expected.format());
	});
	it('should parse dates times like `first day of next year`', function () {
		const actual = moment('first day of next year');
		const expected = moment().add(1, 'year').startOf('year');
		expect(actual.format()).toEqual(expected.format());
	});
	it('should parse dates times like `first day of last year`', function () {
		const actual = moment('first day of last year');
		const expected = moment().subtract(1, 'year').startOf('year');
		expect(actual.format()).toEqual(expected.format());
	});
	it('should parse dates times like `first day of the year`', function () {
		const actual = moment('first day of the year');
		const expected = moment().startOf('year');
		expect(actual.format()).toEqual(expected.format());
	});
	it('should parse dates times like `today`', function () {
		const actual = moment('today');
		const expected = moment().startOf('day');
		expect(actual.format()).toEqual(expected.format());
	});
	it('should parse dates times like `-3 days`', function () {
		const actual = moment('-3 days').startOf('day');
		const expected = moment().subtract(3, 'day').startOf('day');
		expect(actual.format()).toEqual(expected.format());
	});
});

describe('invalid date', () => {
	it('should be invalid "that\'s unpossible"', () => {
		const actual = moment("that's unpossible");
		const expected = moment({
			month: 13,
		});
		expect(actual.format()).toEqual(expected.format());
	});
});

describe('twitter time parser', () => {
	it('should handle "Fri Apr 09 12:53:54 +0000 2010"', () => {
		const actual = moment('Fri Apr 09 12:53:54 +0000 2010');
		const expected = moment({
			month: 3,
			day: 9,
			hour: 12,
			minute: 53,
			second: 54,
			year: 2010,
		});
		expect(actual.format()).toEqual(expected.format());
	});
});

describe('y-m-d parser', () => {
	it('should handle "2021-04-16"', () => {
		const actual = moment('2021-04-16');
		const expected = moment({
			year: 2021,
			month: 3,
			day: 16,
			hour: 0,
			minute: 0,
			second: 0,
		});
		expect(actual.format()).toEqual(expected.format());
	});
});

describe('i18n parsing', () => {
	it('should handle French', () => {
		moment.locale('fr-FR');
		const actual = moment('24 août 2020');
		const expected = moment({
			year: 2020,
			month: 7,
			day: 24,
			hour: 0,
			minute: 0,
			second: 0,
		});
		expect(actual.format()).toEqual(expected.format());
	});
	it('should handle Swedish', () => {
		moment.locale('sv-SE');
		const actual = moment('24 augusti 2020');
		const expected = moment({
			year: 2020,
			month: 7,
			day: 24,
			hour: 0,
			minute: 0,
			second: 0,
		});
		expect(actual.format()).toEqual(expected.format());
	});
	it('should handle Russian', () => {
		moment.locale('ru-RU');
		const actual = moment('28 февраля 2021');
		const expected = moment({
			year: 2021,
			month: 1,
			day: 28,
			hour: 0,
			minute: 0,
			second: 0,
		});
		expect(actual.format()).toEqual(expected.format());
	});
	it('should handle German', () => {
		moment.locale('de');
		const actual = moment('Dienstag, 22. Januar 2021');
		const expected = moment({
			year: 2021,
			month: 0,
			day: 22,
			hour: 0,
			minute: 0,
			second: 0,
		});
		expect(actual.format()).toEqual(expected.format());
	});
});
