/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

require('../../../test/screenshots/bootstrap.screenshot.js');
const expect = require('expect');

describe('Messages screenshot testing', () => {
	it('works', async function () {
		await page.evaluate(async () => {
			editor.value = '<p>Some text</p>'.repeat(10);
			editor.message.info('Hello world! This is info message');
			editor.message.success('Hello Mars! This is success message');
			editor.message.error('Hello Venus! This is error message');
			await editor.async.delay(400);
		});

		await page.waitForSelector('.jodit-ui-message');
		const dialog = await page.$('.jodit');
		const screenshot = await dialog.screenshot();
		expect(screenshot).toMatchImageSnapshot(this);
	}).timeout(10000);
});
