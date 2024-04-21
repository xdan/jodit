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

test.describe('Color picker screenshot testing', () => {
	test.beforeEach(async ({ page }) => {
		await mockRequest(page);
		await page.goto('/');
		await makeCeptJodit(page);
	});

	test.describe('Open color picker', () => {
		test('works', async function ({ page }) {
			await page.click('[data-ref="brush"]');

			await page.waitForSelector('[role="popup"]');
			await page.evaluate(() => editor.async.requestIdlePromise());
			await checkScreenshot(page, '[role="popup"] .jodit-popup__content');
		});
	});
});
