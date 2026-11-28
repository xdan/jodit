/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test table plugin', () => {
	describe('Keyboard navigation in the table-size picker', () => {
		it('should move through the grid with arrow keys and insert with Enter', () => {
			const editor = getJodit({
				disablePlugins: ['wrapNodes']
			});
			editor.value = '<p>test|</p>';
			editor.focus();
			setCursorToChar(editor);

			clickButton('table', editor);
			const popup = getOpenedPopup(editor);
			const grid = popup.querySelector('.jodit-form__container');
			const firstCell = grid.querySelector('span[data-index="0"]');

			expect(grid.getAttribute('role')).eq('grid');
			expect(firstCell.getAttribute('role')).eq('gridcell');
			expect(firstCell.tabIndex).eq(0);
			expect(grid.querySelectorAll('span[tabindex="0"]').length).eq(1);

			firstCell.focus();
			simulateEvent('keydown', Jodit.KEY_RIGHT, firstCell);

			const secondCell = grid.querySelector('span[data-index="1"]');
			expect(editor.ownerDocument.activeElement).eq(secondCell);
			expect(secondCell.tabIndex).eq(0);
			expect(firstCell.tabIndex).eq(-1);

			simulateEvent('keydown', Jodit.KEY_DOWN, secondCell);

			const selectedCell = grid.querySelector('span[data-index="11"]');
			expect(editor.ownerDocument.activeElement).eq(selectedCell);
			expect(popup.querySelector('.jodit-form__center').textContent).eq(
				'2 × 2'
			);

			simulateEvent('keydown', Jodit.KEY_LEFT, selectedCell);
			const previousCell = grid.querySelector('span[data-index="10"]');
			expect(editor.ownerDocument.activeElement).eq(previousCell);

			simulateEvent('keydown', Jodit.KEY_UP, previousCell);
			expect(editor.ownerDocument.activeElement).eq(firstCell);

			simulateEvent('keydown', Jodit.KEY_LEFT, firstCell);
			simulateEvent('keydown', Jodit.KEY_UP, firstCell);
			expect(editor.ownerDocument.activeElement).eq(firstCell);

			simulateEvent('keydown', Jodit.KEY_RIGHT, firstCell);
			simulateEvent('keydown', Jodit.KEY_DOWN, secondCell);

			simulateEvent('keydown', Jodit.KEY_ENTER, selectedCell);

			expect(editor.editor.querySelectorAll('table td').length).eq(4);
			expect(getOpenedPopup(editor)).is.null;
		});

		it('should close the picker with Escape', () => {
			const editor = getJodit();

			clickButton('table', editor);
			const popup = getOpenedPopup(editor);
			const firstCell = popup.querySelector('span[data-index="0"]');

			firstCell.focus();
			simulateEvent('keydown', Jodit.KEY_ESC, firstCell);

			expect(getOpenedPopup(editor)).is.null;
		});
	});

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

			describe('Caret in a block that holds other blocks (#1603)', () => {
				const inserted =
					'<table style="border-collapse:collapse;width:100%"><tbody><tr><td style="width:100%"><br></td></tr></tbody></table>';

				[
					[
						'<table><tbody><tr><td>a|1</td><td>b1</td></tr></tbody></table>',
						`<table><tbody><tr><td>a${inserted}1</td><td>b1</td></tr></tbody></table>`
					],
					[
						'<table><tbody><tr><td><p>a|1</p></td><td>b1</td></tr></tbody></table>',
						`<table><tbody><tr><td><p>a</p>${inserted}<p>1</p></td><td>b1</td></tr></tbody></table>`
					],
					[
						'<table><tbody><tr><td>|<br></td><td>b1</td></tr></tbody></table>',
						`<table><tbody><tr><td>${inserted}<br></td><td>b1</td></tr></tbody></table>`
					],
					[
						'<ul><li>On|e</li><li>Two</li></ul>',
						`<ul><li>On${inserted}e</li><li>Two</li></ul>`
					],
					[
						'<ul><li><p>On|e</p></li></ul>',
						`<ul><li><p>On</p>${inserted}<p>e</p></li></ul>`
					],
					[
						'<div class="box"><p>Te|xt</p></div>',
						`<div class="box"><p>Te</p>${inserted}<p>xt</p></div>`
					],
					[
						'<div class="box"><table><tbody><tr><td>a|1</td></tr></tbody></table></div>',
						`<div class="box"><table><tbody><tr><td>a${inserted}1</td></tr></tbody></table></div>`
					],
					['<p>Te|xt</p>', `<p>Te</p>${inserted}<p>xt</p>`],
					[
						'<div>Te|xt</div>',
						`<div>Te</div>${inserted}<div>xt</div>`,
						{ enter: 'DIV' }
					],
					[
						'<div class="box"><div>Te|xt</div></div>',
						`<div class="box"><div>Te</div>${inserted}<div>xt</div></div>`,
						{ enter: 'DIV' }
					],
					[
						'<blockquote><p>Te|xt</p></blockquote>',
						`<blockquote><p>Te</p>${inserted}<p>xt</p></blockquote>`,
						{ dtd: { blockLimits: { blockquote: 1 } } }
					],
					[
						'<ul><li>On|e</li></ul>',
						`<ul><li>On</li></ul>${inserted}<ul><li>e</li></ul>`,
						{ dtd: { blockLimits: Jodit.atom({ div: 1, td: 1 }) } }
					]
				].forEach(([value, result, options = {}]) => {
					it(`should turn ${value} into ${result} with ${JSON.stringify(options)}`, () => {
						const editor = getJodit(options);
						editor.value = value;
						setCursorToChar(editor);

						clickButton('table', editor);
						const popup = getOpenedPopup(editor);
						simulateEvent(
							'mousedown',
							popup.querySelector('span[data-index="0"]')
						);

						expect(
							sortAttributes(editor.value).replace(/[\n\t]/g, '')
						).eq(result);

						expect(editor.s.range.startContainer).eq(
							editor.editor.querySelector('table[style] td')
						);
					});
				});

				it('should still split a table at a cursor between two rows', () => {
					const editor = getJodit();
					editor.value =
						'<table><tbody><tr><td>a</td></tr><tr><td>b</td></tr></tbody></table>';

					const range = editor.s.createRange();
					range.setStart(editor.editor.querySelector('tbody'), 1);
					editor.s.selectRange(range);

					clickButton('table', editor);
					const popup = getOpenedPopup(editor);
					simulateEvent(
						'mousedown',
						popup.querySelector('span[data-index="0"]')
					);

					expect(
						sortAttributes(editor.value).replace(/[\n\t]/g, '')
					).eq(
						`<table><tbody><tr><td>a</td></tr></tbody></table>${inserted}<table><tbody><tr><td>b</td></tr></tbody></table>`
					);
				});
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

			it('should insert table after the text of a list item without splitting it', () => {
				const editor = getJodit({
					table: {
						splitBlockOnInsertTable: false
					}
				});
				editor.value = '<ul><li>On|e</li><li>Two</li></ul>';
				setCursorToChar(editor);

				clickButton('table', editor);
				const popup = getOpenedPopup(editor);

				simulateEvent(
					'mousedown',
					popup.querySelector('span[data-index="0"]')
				);

				expect(sortAttributes(editor.value).replace(/[\n\t]/g, '')).eq(
					'<ul><li>One<table style="border-collapse:collapse;width:100%"><tbody><tr><td style="width:100%"><br></td></tr></tbody></table></li><li>Two</li></ul>'
				);
			});
		});
	});

	describe('leaveStylesToPage option', () => {
		const table =
			'<table><tbody><tr><th>1</th><td>2</td></tr></tbody></table>';

		const styleOf = (editor, selector) =>
			editor.ew.getComputedStyle(editor.editor.querySelector(selector));

		beforeEach(() => {
			applyGlobalStyle(
				'.page-content th,.page-content td{padding:1px;border:2px dotted rgb(1, 2, 3)}'
			);
		});

		describe('Disabled', () => {
			it("should style tables with Jodit's look over the page's own rules", () => {
				const editor = getJodit({ editorClassName: 'page-content' });
				editor.value = table;

				const tableStyle = styleOf(editor, 'table');
				expect(parseFloat(tableStyle.marginTop)).eq(
					parseFloat(tableStyle.fontSize)
				);

				['th', 'td'].forEach(cell => {
					const style = styleOf(editor, cell);
					expect(parseFloat(style.paddingTop)).is.closeTo(
						parseFloat(style.fontSize) * 0.4,
						0.1
					);
					expect(style.borderTopStyle).eq('solid');
					expect(style.borderTopWidth).eq('1px');
				});
			});
		});

		describe('Enabled', () => {
			it("should leave the look of tables to the page's stylesheet", () => {
				const editor = getJodit({
					editorClassName: 'page-content',
					table: { leaveStylesToPage: true }
				});
				editor.value = table;

				expect(styleOf(editor, 'table').marginTop).eq('0px');

				['th', 'td'].forEach(cell => {
					const style = styleOf(editor, cell);
					expect(style.paddingTop).eq('1px');
					expect(style.borderTopStyle).eq('dotted');
					expect(style.borderTopWidth).eq('2px');
				});
			});

			it('should keep the cells selectable', () => {
				const editor = getJodit({ table: { leaveStylesToPage: true } });
				editor.value = table;

				expect(styleOf(editor, 'tr').userSelect).eq('none');
				expect(styleOf(editor, 'td').userSelect).eq('text');
			});
		});

		describe('In iframe mode', () => {
			const getIframeJodit = options => {
				const editor = getJodit({
					iframe: true,
					iframeCSSLinks: Jodit.atom([]),
					...options
				});

				// Before the default iframeStyle, where iframeCSSLinks go
				const style = editor.ed.createElement('style');
				style.textContent =
					'table{border-collapse:separate}td{border:2px dotted rgb(1, 2, 3)}';
				editor.ed.head.prepend(style);

				editor.value = table;
				return editor;
			};

			it("should style tables with the default iframeStyle's look by default", () => {
				const editor = getIframeJodit({});

				expect(styleOf(editor, 'table').borderCollapse).eq('collapse');
				expect(styleOf(editor, 'td').borderTopStyle).eq('solid');
				expect(styleOf(editor, 'td').borderTopWidth).eq('1px');
			});

			it('should leave the look of tables to the iframeCSSLinks stylesheets', () => {
				const editor = getIframeJodit({
					table: { leaveStylesToPage: true }
				});

				expect(styleOf(editor, 'table').borderCollapse).eq('separate');
				expect(styleOf(editor, 'td').borderTopStyle).eq('dotted');
				expect(styleOf(editor, 'td').borderTopWidth).eq('2px');
				expect(styleOf(editor, 'td').userSelect).eq('text');
			});

			it('should keep its class out of the value with editHTMLDocumentMode', () => {
				const editor = getJodit({
					iframe: true,
					editHTMLDocumentMode: true,
					iframeCSSLinks: Jodit.atom([]),
					table: { leaveStylesToPage: true }
				});
				editor.value = '<p>test</p>';

				expect(editor.value).does.not.match(/<body[^>]*page-tables/);
			});
		});
	});
});
