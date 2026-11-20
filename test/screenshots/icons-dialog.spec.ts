/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

import { mockRequest } from './mock.request';

import { expect, test } from '@playwright/test';

declare const Jodit: typeof import('jodit/jodit').Jodit;

for (const theme of ['default', 'dark']) {
	test(`all icons dialog in ${theme} theme`, async ({ page }) => {
		await mockRequest(page);
		await page.goto('/');
		const count = await page.evaluate(async theme => {
			const { Icon, Dialog, Plugin, UIButton } = Jodit.modules;
			const names = (): string[] =>
				Object.keys(
					Reflect.get(Icon, 'icons') as Record<string, string>
				).sort();
			class IconsDialogPlugin extends Plugin {
				protected afterInit(): void {
					this.j.registerCommand('showAllIcons', () => {
						const dialog = new Dialog({
							theme,
							width: 1160,
							height: 'auto',
							resizable: false,
							draggable: false
						});
						const gallery = this.j.c.div();
						gallery.setAttribute('data-testid', 'all-icons');
						gallery.style.cssText =
							'display:grid;grid-template-columns:repeat(8,130px);gap:8px;padding:12px;';
						for (const name of names()) {
							const cell = this.j.c.div();
							cell.setAttribute('data-icon-name', name);
							cell.style.cssText =
								'height:64px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;';
							const button = new UIButton(dialog, {
								name,
								icon: { name }
							});
							cell.appendChild(button.container);
							const label = this.j.c.span();
							label.textContent = name;
							label.style.cssText =
								'font:11px Arial,sans-serif;max-width:130px;overflow-wrap:anywhere;text-align:center;';
							cell.appendChild(label);
							gallery.appendChild(cell);
						}

						this.j.e.on('beforeDestruct', () => dialog.destruct());
						dialog.open(gallery, `All icons (${names().length})`);
					});
				}
				protected beforeDestruct(): void {}
			}
			Jodit.plugins.add('iconsDialogGallery', IconsDialogPlugin);
			const editor = Jodit.make('#editor-area', {
				theme,
				toolbarAdaptive: false,
				buttons: ['showAllIcons'],
				controls: {
					showAllIcons: {
						text: 'All icons',
						exec: (editor): void => {
							editor.execCommand('showAllIcons');
						}
					}
				}
			});
			await editor.async.requestIdlePromise();
			return names().length;
		}, theme);
		expect(count).toBeGreaterThan(50);
		await page.setViewportSize({
			width: 1400,
			height: Math.max(900, Math.ceil(count / 8) * 72 + 200)
		});
		await page.locator('[data-ref="showAllIcons"] button').click();
		const gallery = page.getByTestId('all-icons');
		await expect(gallery.locator('[data-icon-name]')).toHaveCount(count);
		await expect(gallery.locator('.jodit-icon')).toHaveCount(count);
		const last = gallery.locator('[data-icon-name]').last();
		await expect(last).toBeInViewport();
		await page.mouse.move(0, 0);
		await expect(page.locator('.jodit-dialog__panel')).toHaveScreenshot({
			maxDiffPixels: 0
		});
	});
}
