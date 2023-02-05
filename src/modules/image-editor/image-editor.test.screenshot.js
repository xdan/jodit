/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

require('../../../test/screenshots/bootstrap.screenshot.js');
const expect = require('expect');

describe('Image editor screenshot testing', () => {
	describe('Open image editor', () => {
		it('works', async function () {
			await page.evaluate(() => {
				return editor
					.getInstance('ImageEditor')
					.open('https://xdsoft.net/jodit/files/artio.jpg');
			});

			await page.waitForSelector('[role="dialog"] .jodit-dialog__panel');
			const dialog = await page.$('[role="dialog"] .jodit-dialog__panel');
			const screenshot = await dialog.screenshot();
			expect(screenshot).toMatchImageSnapshot(this);
		}).timeout(10000);
	});
});
