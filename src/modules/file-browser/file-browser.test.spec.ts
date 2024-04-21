/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit } from '../../types';
import {
	checkScreenshot,
	mockRequest
} from '../../../test/screenshots/mock.request';

import { test } from '@playwright/test';

declare let editor: IJodit;

test.describe('Filebrowser screenshot testing', () => {
	test.beforeEach(async ({ page }) => {
		await mockRequest(page);
		await page.goto('/');
	});

	test.describe('Open filebrowser', () => {
		test('works', async function ({ page }) {
			await page.evaluate(() => {
				// @ts-ignore
				editor = Jodit.make('#editor-area', {
					filebrowser: {
						ajax: {
							url: 'https://xdsoft.net/jodit/finder/'
						}
					}
				});
				return editor.filebrowser.open();
			});

			await page.waitForSelector('[data-jodit-file-browser-item="true"]');
			await checkScreenshot(page, '[role="dialog"] .jodit-dialog__panel');
		});
	});

	test.describe('Hide edit buttons', () => {
		test('works', async function ({ page }) {
			await page.evaluate(() => {
				// @ts-ignore
				editor = Jodit.make('#editor-area', {
					filebrowser: {
						permissionsPresets: {
							allowFiles: false,
							allowFileMove: false,
							allowFileUpload: false,
							allowFileUploadRemote: false,
							allowFileRemove: false,
							allowFileRename: false,
							allowFolders: false,
							allowFolderCreate: false,
							allowFolderMove: false,
							allowFolderRemove: false,
							allowFolderRename: false,
							allowImageResize: false,
							allowImageCrop: false
						},
						ajax: {
							url: 'https://xdsoft.net/jodit/finder/'
						}
					}
				});
				return editor.filebrowser.open();
			});

			await page.waitForSelector('[data-jodit-file-browser-item="true"]');
			await page.evaluate(() => {
				const item = document.querySelector(
					'[data-jodit-file-browser-item="true"]'
				)!;
				const evt = new MouseEvent('contextmenu', {
					bubbles: true,
					cancelable: true,
					view: window,
					clientX: item.getBoundingClientRect().left,
					clientY: item.getBoundingClientRect().top,
					buttons: 2
				});
				item.dispatchEvent(evt);
			});
			await page.waitForSelector('.jodit-context-menu[role="popup"]');
			await checkScreenshot(page, '[role="dialog"] .jodit-dialog__panel');
		});
	});
});
