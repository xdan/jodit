/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

require('../../../test/screenshots/bootstrap.screenshot.js');
const expect = require('expect');

describe('Filebrowser screenshot testing', () => {
	describe('Open filebrowser', () => {
		it('works', async function () {
			await page.evaluate(() => {
				return editor.filebrowser.open();
			});

			await page.waitForSelector('[data-jodit-filebrowser-item="true"]');
			const dialog = await page.$('[role="dialog"] .jodit-dialog__panel');
			const screenshot = await dialog.screenshot();
			expect(screenshot).toMatchImageSnapshot(this);
		}).timeout(10000);
	});

	describe('Hide edit buttons', () => {
		it('works', async function () {
			await page.evaluate(() => {
				editor.destruct();
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

			await page.waitForSelector('[data-jodit-filebrowser-item="true"]');
			await page.evaluate(() => {
				const item = document.querySelector(
					'[data-jodit-filebrowser-item="true"]'
				);
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
			const dialog = await page.$('[role="dialog"] .jodit-dialog__panel');
			await page.waitForSelector('.jodit-context-menu[role="popup"]');
			const screenshot = await dialog.screenshot();
			expect(screenshot).toMatchImageSnapshot(this);
		}).timeout(10000);
	});
});
