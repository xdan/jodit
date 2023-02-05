/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

require('../../../test/screenshots/bootstrap.screenshot.js');
const expect = require('expect');

describe('Search screenshot testing', () => {
	describe('Open search popup', () => {
		it('works', async function () {
			await page.evaluate(() => {
				clickButton('find', editor);
				document.activeElement.blur();
			});

			await page.waitForSelector('.jodit-ui-search input');
			const element = await page.$('.jodit-ui-search__box');
			const screenshot = await element.screenshot();
			expect(screenshot).toMatchImageSnapshot(this, {
				failureThreshold: 0.2,
				failureThresholdType: 'percent'
			});
		});

		describe('Replace popup', () => {
			it('works', async function () {
				await page.evaluate(() => {
					clickTrigger('find', editor);
					const popup = getOpenedPopup(editor);
					clickButton('replace', popup);
					document.activeElement.blur();
				});

				await page.waitForSelector('.jodit-ui-search');
				const element = await page.$('.jodit-ui-search__box');
				const screenshot = await element.screenshot();
				expect(screenshot).toMatchImageSnapshot(this);
			}).timeout(10000);
		});
	});
});
