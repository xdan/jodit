/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Bold plugin', () => {
	let jodit;
	beforeEach(() => {
		jodit = getJodit();
		jodit.focus();
		jodit.value = '<p>|<br></p>';
		setCursorToChar(jodit);
	});

	afterEach(() => {
		jodit.destruct();
	});

	describe('Click the bold button', () => {
		it('Should add an empty STRONG element', async () => {
			clickButton('bold', jodit);
			await jodit.async.requestIdlePromise();
			replaceCursorToChar(jodit);
			expect(jodit.value).eq('<p><strong>|</strong></p>');
		});

		describe('Twice', () => {
			it('Should work like native bold', async () => {
				jodit.value = '<p>test|</p>';

				setCursorToChar(jodit);
				clickButton('bold', jodit);
				await jodit.async.requestIdlePromise();
				jodit.s.insertHTML('start');
				await jodit.async.requestIdlePromise();
				replaceCursorToChar(jodit);
				expect(jodit.value).eq('<p>test<strong>start|</strong></p>');

				setCursorToChar(jodit);
				clickButton('bold', jodit);
				jodit.async.requestIdlePromise();
				jodit.s.insertHTML('pop');
				replaceCursorToChar(jodit);
				expect(jodit.value).eq('<p>test<strong>start</strong>pop|</p>');
			});
		});
	});

	describe('Apply bold command', () => {
		describe('Twice', () => {
			it('Should work like native bold', async () => {
				jodit.value = '<p>test|</p>';

				setCursorToChar(jodit);
				jodit.execCommand('bold');
				await jodit.async.requestIdlePromise();
				jodit.s.insertHTML('start');
				replaceCursorToChar(jodit);
				expect(jodit.value).eq('<p>test<strong>start|</strong></p>');

				setCursorToChar(jodit);
				jodit.execCommand('bold');
				await jodit.async.requestIdlePromise();
				jodit.s.insertHTML('pop');
				replaceCursorToChar(jodit);
				expect(jodit.value).eq('<p>test<strong>start</strong>pop|</p>');
			});
		});
	});

	describe('Click the subscript button', () => {
		it('Should add empty Subelement', async () => {
			clickButton('subscript', jodit);
			await jodit.async.requestIdlePromise();
			replaceCursorToChar(jodit);
			expect(jodit.value).eq('<p><sub>|</sub></p>');
		});

		describe('Inside sub tag', () => {
			it('Should move the cursor on the outside from the tag', async () => {
				jodit.value = '<p><sup>test|</sup></p>';
				setCursorToChar(jodit);
				clickButton('superscript', jodit);
				await jodit.async.requestIdlePromise();
				jodit.s.insertHTML('pop');
				replaceCursorToChar(jodit);
				expect(jodit.value).eq('<p><sup>test</sup>pop|</p>');
			});
		});
	});

	describe('Click superscript button', () => {
		it('Should add an empty SUP element', async () => {
			clickButton('superscript', jodit);
			await jodit.async.requestIdlePromise();
			replaceCursorToChar(jodit);
			expect(jodit.value).eq('<p><sup>|</sup></p>');
		});
	});

	describe('Subscript and superscript exclude each other, as in the browsers and Word (#1772)', () => {
		[
			['<p>x<sup>|2|</sup></p>', 'subscript', '<p>x<sub>2</sub></p>'],
			['<p>x<sub>|2|</sub></p>', 'superscript', '<p>x<sup>2</sup></p>'],
			[
				'<p>x<sup>|2|3</sup></p>',
				'subscript',
				'<p>x<sub>2</sub><sup>3</sup></p>'
			],
			[
				'<p>|ab<sup>2</sup>cd|</p>',
				'subscript',
				'<p><sub>ab2cd</sub></p>'
			],
			[
				'<p>x<sup><strong>|2|</strong></sup></p>',
				'subscript',
				'<p>x<strong><sub>2</sub></strong></p>'
			],
			['<p>x<sup>|2|</sup></p>', 'superscript', '<p>x2</p>']
		].forEach(([value, command, expected]) => {
			it(`${command} on ${value} should give ${expected}`, () => {
				jodit.value = value;
				setCursorToChar(jodit);
				jodit.execCommand(command);

				expect(sortAttributes(jodit.value)).eq(expected);
			});
		});

		it('should type a subscript after a superscript when the caret is at its end', () => {
			jodit.value = '<p>x<sup>2|</sup></p>';
			setCursorToChar(jodit);
			jodit.execCommand('subscript');
			jodit.s.insertHTML('y');

			expect(jodit.value).eq('<p>x<sup>2</sup><sub>y</sub></p>');
		});
	});
});
