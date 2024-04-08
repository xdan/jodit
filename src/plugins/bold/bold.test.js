/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
});
