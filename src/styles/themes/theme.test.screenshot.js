/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

require('../../../test/screenshots/bootstrap.screenshot.js');
const expect = require('expect');

describe('Theme screenshot testing', () => {
	it('should render usual theme', async function () {
		await page.evaluate(async () => {
			editor.value = '<p>Some text</p>'.repeat(3);
		});

		const container = await page.$('.jodit');
		const screenshot = await container.screenshot();
		expect(screenshot).toMatchImageSnapshot(this, {
			failureThreshold: 0.1,
			failureThresholdType: 'percent'
		});
	}).timeout(10000);

	describe('Dark theme', () => {
		it('should render dark theme', async function () {
			await page.evaluate(async () => {
				editor.destruct();
				editor = Jodit.make('#editor-area', {
					theme: 'dark'
				});
				editor.value = '<p>Some text</p>'.repeat(3);
			});

			const container = await page.$('.jodit');
			const screenshot = await container.screenshot();
			expect(screenshot).toMatchImageSnapshot(this, {
				failureThreshold: 0.1,
				failureThresholdType: 'percent'
			});
		}).timeout(10000);

		describe('Dialog theme', () => {
			it('should render with same theme', async function () {
				await page.evaluate(async () => {
					editor.destruct();
					editor = Jodit.make('#editor-area', {
						theme: 'dark'
					});
					editor.alert('Test');
				});

				const container = await page.$(
					'[role="dialog"] .jodit-dialog__panel'
				);
				const screenshot = await container.screenshot();
				expect(screenshot).toMatchImageSnapshot(this);
			}).timeout(10000);
		});
	});
});
