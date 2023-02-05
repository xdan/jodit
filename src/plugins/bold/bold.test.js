/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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

	describe('Click bold button', () => {
		it('Should add empty STRONG element', async () => {
			clickButton('bold', jodit);
			jodit.async.requestIdlePromise();
			replaceCursorToChar(jodit);
			expect(jodit.value).eq('<p><strong>|</strong></p>');
		});
	});

	describe('Click subscript button', () => {
		it('Should add empty SUB element', async () => {
			clickButton('subscript', jodit);
			jodit.async.requestIdlePromise();
			replaceCursorToChar(jodit);
			expect(jodit.value).eq('<p><sub>|</sub></p>');
		});

		describe('Inside sub tag', () => {
			it('Should move cursor in the outside from the tag', async () => {
				jodit.value = '<p><sup>test|</sup></p>';
				setCursorToChar(jodit);
				clickButton('superscript', jodit);
				jodit.async.requestIdlePromise();
				jodit.s.insertHTML('pop');
				replaceCursorToChar(jodit);
				expect(jodit.value).eq('<p><sup>test</sup>pop|</p>');
			});
		});
	});

	describe('Click superscript button', () => {
		it('Should add empty SUP element', async () => {
			clickButton('superscript', jodit);
			jodit.async.requestIdlePromise();
			replaceCursorToChar(jodit);
			expect(jodit.value).eq('<p><sup>|</sup></p>');
		});
	});
});
