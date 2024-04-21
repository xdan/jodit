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

test.describe('Dialog screenshot testing', () => {
	test.beforeEach(async ({ page }) => {
		await mockRequest(page);
		await page.goto('/');
		await makeCeptJodit(page);
	});

	test.describe('Open alert dialog', () => {
		test('works', async ({ page }) => {
			await page.evaluate(() => {
				editor.alert('Hello world!');
			});

			await checkScreenshot(page, '[role="dialog"] .jodit-dialog__panel');
		});
	});

	test.describe('Open confirm dialog', () => {
		test('works', async function ({ page }) {
			await page.evaluate(() => {
				editor.confirm('Are you sure?', 'Its question', () => {});
			});

			await checkScreenshot(page, '[role="dialog"] .jodit-dialog__panel');
		});
	});

	test.describe('Open prompt dialog', () => {
		test('works', async function ({ page }) {
			await page.evaluate(() => {
				editor.prompt(
					'Enter your name',
					'Your name!',
					() => {},
					'Name',
					'John Doe'
				);
			});

			await checkScreenshot(page, '[role="dialog"] .jodit-dialog__panel');
		});
	});
});
