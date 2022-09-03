/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

require('../../../test/screenshots/bootstrap.screenshot.js');
const expect = require('expect');

describe('Filebrowser screenshot testing', () => {
	describe('Open filebrowser', () => {
		it('works', async function () {
			await page.evaluate(() => {
				return editor.filebrowser.open();
			});

			await page.waitForSelector('[data-jodit-filebrowser-item="true"]');
			const dialog = await page.$('[role="dialog"] .jodit-dialog__panel');
			const screenshot = await dialog.screenshot();
			expect(screenshot).toMatchImageSnapshot(this);
		}).timeout(10000);
	});
});
