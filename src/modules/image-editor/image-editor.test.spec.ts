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

test.describe('Image editor screenshot testing', () => {
	test.beforeEach(async ({ page }) => {
		await mockRequest(page);
		await page.goto('/');
		await makeCeptJodit(page);
	});

	test.describe('Open image editor', () => {
		test('works', async function ({ page }) {
			await page.evaluate(() => {
				return editor
					.getInstance('ImageEditor')
					.open('https://xdsoft.net/jodit/files/artio.jpg');
			});

			await checkScreenshot(page, '[role="dialog"] .jodit-dialog__panel');
		});

		test.describe('Crop mode', () => {
			test('Crop mode', async function ({ page }) {
				await page.evaluate(() => {
					return editor
						.getInstance('ImageEditor')
						.open('https://xdsoft.net/jodit/files/artio.jpg');
				});

				await page.click('[data-area="crop"] > div');

				await checkScreenshot(
					page,
					'[role="dialog"] .jodit-dialog__panel'
				);
			});
		});
	});
});
