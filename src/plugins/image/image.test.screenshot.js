/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

require('../../../test/screenshots/bootstrap.screenshot.js');
const expect = require('expect');

describe('Image popup screenshot testing', () => {
	describe('Open image popup', () => {
		it('works', async function () {
			await page.evaluate(async () => {
				editor.value = '<p><br/></p>';

				clickButton('image', editor);
			});

			await page.waitForSelector('.jodit-popup');
			const element = await page.$('.jodit-popup');
			const screenshot = await element.screenshot();
			expect(screenshot).toMatchImageSnapshot(this);
		}).timeout(10000);
	});
});
