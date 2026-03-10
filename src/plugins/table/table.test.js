/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test table plugin', () => {
	describe('Click button and click to some cell', () => {
		it('should create and insert new table', () => {
			const editor = getJodit({
				disablePlugins: ['wrapNodes']
			});
			editor.value = '<p>test|</p>';
			editor.focus();
			setCursorToChar(editor);

			clickButton('table', editor);
			const popup = getOpenedPopup(editor);
			simulateEvent(
				'mousedown',
				popup.querySelector('span[data-index="6"]')
			);

			const EXPECTED =
				'<p>test</p>' +
				'<table style="border-collapse:collapse;width:100%">' +
				'<tbody>' +
				'<tr>' +
				'<td style="width:14.28%"><br></td>' +
				'<td style="width:14.28%"><br></td>' +
				'<td style="width:14.28%"><br></td>' +
				'<td style="width:14.28%"><br></td>' +
				'<td style="width:14.28%"><br></td>' +
				'<td style="width:14.28%"><br></td>' +
				'<td style="width:14.28%"><br></td>' +
				'</tr>' +
				'</tbody></table><p><br></p>';

			const VALUE = sortAttributes(editor.value).replace(/[\n\t]/g, '');

			if (VALUE !== EXPECTED) {
				strCompare(VALUE, EXPECTED);
			}

			expect(VALUE).eq(EXPECTED);
			expect(editor.editor.firstChild.nodeName).eq('P');
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
			editor.value = '<p>test|</p>';
			setCursorToChar(editor);
			clickButton('table', editor);
			const popup = getOpenedPopup(editor);
			simulateEvent(
				'mousedown',
				popup.querySelector('span[data-index="2"]')
			);

			const EXPECTED =
				'<p>test</p><table style="border-collapse:collapse;width:100%"><tbody>\n<tr>\n\t<td style="color:red;width:33.33%"><br></td>\n\t<td style="color:red;width:33.33%"><br></td>\n\t<td style="color:red;width:33.33%"><br></td></tr></tbody></table><p><br></p>';
			const VALUE = sortAttributes(editor.value);

			if (VALUE !== EXPECTED) {
				strCompare(VALUE, EXPECTED);
			}

			expect(VALUE).eq(EXPECTED);
		});
	});

	describe('splitBlockOnInsertTable option', () => {
		describe('When splitBlockOnInsertTable is true (default)', () => {
			it('should split the current block when inserting table', () => {
				const editor = getJodit();
				editor.value = '<p>Hello |world</p>';
				setCursorToChar(editor);

				clickButton('table', editor);
				const popup = getOpenedPopup(editor);
				simulateEvent(
					'mousedown',
					popup.querySelector('span[data-index="0"]')
				);

				expect(editor.value).eq(
					'<p>Hello \n</p><table style="border-collapse:collapse;width: 100%;"><tbody>\n<tr>\n\t<td style="width: 100%;"><br></td></tr></tbody></table><p>world</p>'
				);
			});
		});

		describe('When splitBlockOnInsertTable is false', () => {
			it('should insert table after the current block without splitting', () => {
				const editor = getJodit({
					table: {
						splitBlockOnInsertTable: false
					}
				});
				editor.value = '<p>Hello world|</p>';
				setCursorToChar(editor);

				clickButton('table', editor);
				const popup = getOpenedPopup(editor);

				simulateEvent(
					'mousedown',
					popup.querySelector('span[data-index="0"]')
				);

				expect(editor.editor.querySelectorAll('p').length).eq(1);
				expect(editor.editor.querySelector('table')).is.not.null;
				expect(editor.editor.firstChild.nodeName).eq('P');
				expect(editor.editor.firstChild.nextElementSibling.nodeName).eq(
					'TABLE'
				);
			});
		});
	});
});
