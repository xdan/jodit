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

test.describe('Image properties screenshot testing', () => {
	test.beforeEach(async ({ page }) => {
		await mockRequest(page);
		await page.goto('/');
		await makeCeptJodit(page);
		await page.evaluate(async () => {
			editor.value =
				'<p><a target="_blank" href="https://xdsoft.net/jodit/files/th.jpg"><img alt="test image" title="test title" id="some_id" style="border: 1px solid red;margin: 23px 10px;border-radius: 16px;" class="some-class" src="https://xdsoft.net/jodit/files/th.jpg"></a></p>';
			const img = editor.editor.querySelector('img')!;
			await img.decode();
		});
	});

	test.describe('Open image properties', () => {
		test('works', async function ({ page }) {
			await page.dblclick('img');
			await checkScreenshot(page, '[role="dialog"] .jodit-dialog__panel');
		});

		test.describe('Second tab', () => {
			test('show correct image styles', async function ({ page }) {
				await page.dblclick('img');
				await page.click('[data-ref="Advanced"]');
				await checkScreenshot(
					page,
					'[role="dialog"] .jodit-dialog__panel'
				);
			});
		});
	});
});
