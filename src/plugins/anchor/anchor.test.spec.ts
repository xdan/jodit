/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

import {
	checkScreenshot,
	makeCeptJodit,
	mockRequest
} from '../../../test/screenshots/mock.request';

import { test } from '@playwright/test';

const VALUE = '<p>School fees<a id="fees"></a> for 2027</p>';

test.describe('Anchor screenshot testing', () => {
	test.beforeEach(async ({ page }) => {
		await mockRequest(page);
		await page.goto('/');
	});

	test('should draw the marker in the icon colour', async function ({
		page
	}) {
		await makeCeptJodit(
			page,
			{ disablePlugins: ['speech-recognize'] },
			VALUE
		);

		await checkScreenshot(page, '.jodit-wysiwyg');
	});

	test('should draw the marker in the dark theme icon colour', async function ({
		page
	}) {
		await makeCeptJodit(
			page,
			{ theme: 'dark', disablePlugins: ['speech-recognize'] },
			VALUE
		);

		await checkScreenshot(page, '.jodit-wysiwyg');
	});
});
