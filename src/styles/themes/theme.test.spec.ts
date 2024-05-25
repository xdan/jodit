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

test.describe('Theme screenshot testing', () => {
	test.beforeEach(async ({ page }) => {
		await mockRequest(page);
		await page.goto('/');
	});

	test('should render usual theme', async function ({ page }) {
		await makeCeptJodit(page, {
			disablePlugins: ['speech-recognize']
		});

		await page.evaluate(async () => {
			editor.value = '<p>Some text</p>'.repeat(3);
		});

		await checkScreenshot(page, '.jodit-container');
	});

	test.describe('Dark theme', () => {
		test('should render dark theme', async function ({ page }) {
			await makeCeptJodit(page, {
				theme: 'dark',
				disablePlugins: ['speech-recognize']
			});

			await page.evaluate(async () => {
				editor.value = '<p>Some text</p>'.repeat(3);
			});

			await checkScreenshot(page, '.jodit-container');
		});

		test.describe('Dialog theme', () => {
			test('should render with same theme', async function ({ page }) {
				await makeCeptJodit(page, {
					theme: 'dark'
				});

				await page.evaluate(async () => {
					editor.alert('Test');
				});

				await checkScreenshot(
					page,
					'[role="dialog"] .jodit-dialog__panel'
				);
			});
		});
	});
});
