/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

require('../../../test/screenshots/bootstrap.screenshot.js');
const expect = require('expect');

describe('Dialog screenshot testing', () => {
	describe('Open alert dialog', () => {
		it('works', async function () {
			await page.evaluate(() => {
				editor.alert('Hello world!');
			});

			await page.waitForSelector('[role="dialog"] .jodit-dialog__panel');
			const dialog = await page.$('[role="dialog"] .jodit-dialog__panel');
			const screenshot = await dialog.screenshot();
			expect(screenshot).toMatchImageSnapshot(this);
		}).timeout(10000);
	});

	describe('Open confirm dialog', () => {
		it('works', async function () {
			await page.evaluate(() => {
				editor.confirm('Are you sure?');
			});

			await page.waitForSelector('[role="dialog"] .jodit-dialog__panel');
			const dialog = await page.$('[role="dialog"] .jodit-dialog__panel');
			const screenshot = await dialog.screenshot();
			expect(screenshot).toMatchImageSnapshot(this);
		}).timeout(10000);
	});

	describe('Open prompt dialog', () => {
		it('works', async function () {
			await page.evaluate(() => {
				editor.prompt(
					'Enter your name',
					'Your name!',
					() => {},
					'Name',
					'John Doe'
				);
			});

			await page.waitForSelector('[role="dialog"] .jodit-dialog__panel');
			const dialog = await page.$('[role="dialog"] .jodit-dialog__panel');
			const screenshot = await dialog.screenshot();
			expect(screenshot).toMatchImageSnapshot(this);
		}).timeout(10000);
	});
});
