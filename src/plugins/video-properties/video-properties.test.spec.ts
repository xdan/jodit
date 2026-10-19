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

// One 32x18 frame
const clip =
	'data:video/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQJChYECGFOAZwEAAAAAAAHWEU2bdLpNu4tTq4QVSalmU6yBoU27i1OrhBZUrmtTrIHGTbuMU6uEElTDZ1OsggEiTbuMU6uEHFO7a1OsggHA7AEAAAAAAABZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmoCrXsYMPQkBNgIRMYXZmV0GETGF2ZkSJiECPQAAAAAAAFlSua9euAQAAAAAAAE7XgQFzxYgAAAAAAAAAAZyBACK1nIN1bmSIgQCGhVZfVlA4g4EBI+ODhDuaygDgkLCBILqBEpqBAlWwhFW5gQFV7oEA7AEAAAAAAAACAAASVMNn0HNzzWPAi2PFiAAAAAAAAAABZ8iYRaOHRU5DT0RFUkSHi0xhdmMgbGlidnB4Z8ihRaOIRFVSQVRJT05Eh5MwMDowMDowMS4wMDAwMDAwMDAAH0O2dcTngQCjv4EAAIAQAwCdASogABIAAkcIhYWImYSIDIICdbokgH8AQWxuICwA/vEKj/+QTYEPAH/8ZU8ZU8ZU/4vsPupnMBxTu2uRu4+zgQC3iveBAfGCAXfwgQM=';

test.describe('Video properties screenshot testing', () => {
	test.beforeEach(async ({ page }) => {
		await mockRequest(page);
		await page.goto('/');
		await makeCeptJodit(
			page,
			{ uploader: { url: 'https://xdsoft.net/jodit/connector/' } },
			`<p><video autoplay loop poster="https://xdsoft.net/jodit/files/th.jpg" src="${clip}" style="width: 320px; height: 180px"></video></p>`
		);
		await page.waitForSelector('jodit-media video');
	});

	test('Open video properties', async ({ page }) => {
		await page.click('jodit-media');
		await page.click('.jodit-popup .jodit-toolbar-button_pencil button');
		await checkScreenshot(page, '[role="dialog"] .jodit-dialog__panel');
	});
});
