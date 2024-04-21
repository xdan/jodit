/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit } from '../../types';
import {
	checkScreenshot,
	makeCeptJodit,
	mockRequest
} from '../../../test/screenshots/mock.request';

import { test } from '@playwright/test';

declare let editor: IJodit;

test.describe('Messages screenshot testing', () => {
	test.beforeEach(async ({ page }) => {
		await mockRequest(page);
		await page.goto('/');
		await makeCeptJodit(page);
	});

	test('works', async function ({ page }) {
		await page.evaluate(async () => {
			editor.value = '<p>Some text</p>'.repeat(10);
			editor.message.info('Hello world! This is info message');
			editor.message.success('Hello Mars! This is success message');
			editor.message.error('Hello Venus! This is error message');
			await editor.async.delay(400);
		});

		await page.waitForSelector('.jodit-ui-message');
		await checkScreenshot(page, '.jodit-container');
	});
});
