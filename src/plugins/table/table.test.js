/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test table plugin', () => {
	describe('Click button and click to some cell', () => {
		it('should create and insert new table', () => {
			const editor = getJodit();
			clickButton('table', editor);
			const popup = getOpenedPopup(editor);
			simulateEvent(
				'mousedown',
				popup.querySelector('span[data-index="6"]')
			);
			expect(sortAttributes(editor.value)).eq(
				'<table style="border-collapse:collapse;width:100%"><tbody>\n<tr>\n\t<td style="width:14.28%"><br></td>\n\t<td style="width:14.28%"><br></td>\n\t<td style="width:14.28%"><br></td>\n\t<td style="width:14.28%"><br></td>\n\t<td style="width:14.28%"><br></td>\n\t<td style="width:14.28%"><br></td>\n\t<td style="width:14.28%"><br></td></tr></tbody></table>'
			);
		});
	});

	describe('Set different cell style', () => {
		it('should create cells with that style', () => {
			const editor = getJodit({
				createAttributes: {
					td: {
						style: 'color: red;'
					}
				}
			});
			clickButton('table', editor);
			const popup = getOpenedPopup(editor);
			simulateEvent(
				'mousedown',
				popup.querySelector('span[data-index="2"]')
			);
			expect(sortAttributes(editor.value)).eq(
				'<table style="border-collapse:collapse;width:100%"><tbody>\n<tr>\n\t<td style="color:red;width:33.33%"><br></td>\n\t<td style="color:red;width:33.33%"><br></td>\n\t<td style="color:red;width:33.33%"><br></td></tr></tbody></table>'
			);
		});
	});
});
