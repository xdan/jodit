/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

require('../../../test/screenshots/bootstrap.screenshot.js');
const expect = require('expect');

describe('Search screenshot testing', () => {
	describe('Open search popup', () => {
		it('works', async function () {
			await page.evaluate(() => {
				return clickButton('find', editor);
			});

			await page.waitForSelector('.jodit-ui-search');
			const element = await page.$('.jodit-ui-search__box');
			const screenshot = await element.screenshot();
			expect(screenshot).toMatchImageSnapshot(this);
		});

		describe('Replace popup', () => {
			it('works', async function () {
				await page.evaluate(() => {
					clickTrigger('find', editor);
					const popup = getOpenedPopup(editor);
					clickButton('replace', popup);
				});

				await page.waitForSelector('.jodit-ui-search');
				const element = await page.$('.jodit-ui-search__box');
				const screenshot = await element.screenshot();
				expect(screenshot).toMatchImageSnapshot(this);
			}).timeout(10000);
		});
	});
});
