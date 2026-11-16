/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
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

	// https://github.com/xdan/jodit/issues/1815
	test.describe('Move through the colors with the keyboard', () => {
		test('rings the focused color', async function ({ page }) {
			await page.click('[data-ref="brush"]');

			await page.waitForSelector('[role="popup"]');
			await page.evaluate(() => editor.async.requestIdlePromise());
			await page.focus('.jodit-color-picker__color-item[tabindex="0"]');
			await page.keyboard.press('ArrowRight');
			await page.keyboard.press('ArrowDown');
			await page.keyboard.press('ArrowDown');
			await checkScreenshot(page, '[role="popup"] .jodit-popup__content');
		});
	});
});
