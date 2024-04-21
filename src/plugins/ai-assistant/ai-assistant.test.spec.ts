/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import {
	checkScreenshot,
	mockRequest
} from '../../../test/screenshots/mock.request';

import { test } from '@playwright/test';

test.describe('AI Assistant screenshot testing', () => {
	test.beforeEach(async ({ page }) => {
		await mockRequest(page);
		await page.goto('/');
		await page.evaluate(() => {
			// @ts-ignore
			window.editor = Jodit.make('#editor-area', {
				aiAssistant: {
					aiAssistantCallback: async (text: string, html: string) => {
						return `AI Assistant: ${text} ${html}`;
					}
				}
			});
		});
	});

	test.describe('Open Assistant dialog', () => {
		test('works', async function ({ page }) {
			await page.click('[data-ref="ai-assistant"]');
			await checkScreenshot(page, '[role="dialog"] .jodit-dialog__panel');
		});
	});
});
