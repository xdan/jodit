/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Bold plugin', () => {
	let jodit;
	beforeEach(() => {
		jodit = getJodit();
		jodit.value = '<p>|<br></p>';
		setCursorToChar(jodit);
	});

	describe('Click bold button', () => {
		it('Should add empty STRONG element', async () => {
			clickButton('bold', jodit);
			jodit.async.requestIdlePromise();
			replaceCursorToChar(jodit);
			expect(jodit.value).eq('<p><strong>|</strong></p>');
		});
	});
});
