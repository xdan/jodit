/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

import { mockRequest } from '../../../test/screenshots/mock.request';

import { expect, test } from '@playwright/test';

declare const Jodit: typeof import('jodit/jodit').Jodit;

for (const theme of ['default', 'dark']) {
	test(`speechRecognize toolbar icon in ${theme} theme`, async ({ page }) => {
		await mockRequest(page);
		await page.goto('/');
		await page.evaluate(async theme => {
			const editor = Jodit.make('#editor-area', {
				theme,
				buttons: ['speechRecognize'],
				toolbarAdaptive: false,
				controls: {
					speechRecognize: {
						isVisible: (): boolean => true,
						isDisabled: (): boolean => false
					}
				}
			});
			await editor.async.requestIdlePromise();
		}, theme);

		const button = page.locator('[data-ref="speechRecognize"]');
		await expect(button.locator('svg path').first()).not.toHaveCSS(
			'stroke',
			'none'
		);
		await expect(button).toHaveScreenshot({ maxDiffPixels: 0 });
	});
}
