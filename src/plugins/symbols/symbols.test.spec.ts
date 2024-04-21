/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import {
	checkScreenshot,
	makeCeptJodit,
	mockRequest
} from '../../../test/screenshots/mock.request';

import { test } from '@playwright/test';

test.describe('Symbols screenshot testing', () => {
	test.beforeEach(async ({ page }) => {
		await mockRequest(page);
		await page.goto('/');
		await makeCeptJodit(page);
	});

	test.describe('Open symbols dialog', () => {
		test('works', async function ({ page }) {
			await page.click('[data-ref="symbols"]');
			await checkScreenshot(page, '[role="dialog"] .jodit-dialog__panel');
		});
	});
});
