/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import {
	checkScreenshot,
	makeCeptJodit,
	mockRequest
} from '../test/screenshots/mock.request';

import { expect, test } from '@playwright/test';

test('Smoke test', async ({ page }) => {
	await mockRequest(page);
	await page.goto('/');
	await expect(page).toHaveTitle(/Document/);

	await makeCeptJodit(page);
	await checkScreenshot(page, '.jodit-container');
});
