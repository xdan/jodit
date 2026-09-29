/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Text Inline Popup plugin', () => {
	describe('Image', () => {
		// https://github.com/xdan/jodit/issues/1516
		describe('Vertical align', () => {
			it('Should be disabled for a floated or block image, and enabled for one in the line', () => {
				const editor = getJodit();

				editor.value =
					'<p>text <img alt="" src="tests/artio.jpg" style="float: left">' +
					' text <img alt="" src="tests/artio.jpg" style="display: block; margin-left: auto; margin-right: auto">' +
					' text <img alt="" src="tests/artio.jpg"> text</p>';

				const valign = img => {
					simulateEvent('click', img);
					return getButton('valign', getOpenedPopup(editor));
				};

				const [floated, block, inline] =
					editor.editor.querySelectorAll('img');

				expect(valign(floated).hasAttribute('disabled')).is.true;
				expect(valign(block).hasAttribute('disabled')).is.true;
				expect(valign(inline).hasAttribute('disabled')).is.false;
			});
		});

		// https://github.com/xdan/jodit/issues/1517
		describe('Horizontal align button', () => {
			const icon = button =>
				button.querySelector('svg').getAttribute('class');

			it("Should show the image's alignment and mark it in the list", async () => {
				const editor = getJodit({ defaultTimeout: 0 });

				editor.value =
					'<p>text <img alt="" src="tests/artio.jpg" style="float: right">' +
					' text <img alt="" src="tests/artio.jpg"> text</p>';

				const [right, normal] = editor.editor.querySelectorAll('img');
				editor.s.focus();

				simulateEvent('click', right);
				await editor.async.requestIdlePromise();
				const popup = getOpenedPopup(editor);
				const button = getButton('left', popup);

				expect(icon(button)).contains('jodit-icon_right');
				expect(button.getAttribute('aria-pressed')).eq('true');

				clickTrigger('left', popup);
				const list = getOpenedPopup(editor);

				expect(
					getButton('Right', list).getAttribute('aria-pressed')
				).eq('true');
				expect(getButton('Left', list).getAttribute('aria-pressed')).eq(
					'false'
				);

				simulateEvent('click', normal);
				await editor.async.requestIdlePromise();
				const normalButton = getButton('left', getOpenedPopup(editor));

				expect(icon(normalButton)).contains('jodit-icon_left');
				expect(normalButton.getAttribute('aria-pressed')).eq('false');
			});

			it('Should follow a change of alignment', async () => {
				const editor = getJodit({ defaultTimeout: 0 });

				editor.value =
					'<p>text <img alt="" src="tests/artio.jpg"> text</p>';

				const img = editor.editor.querySelector('img');
				editor.s.focus();

				simulateEvent('click', img);
				const popup = getOpenedPopup(editor);
				clickTrigger('left', popup);
				clickButton('Center', getOpenedPopup(editor));
				await editor.async.requestIdlePromise();

				expect(img.style.display).eq('block');
				expect(icon(getButton('left', popup))).contains(
					'jodit-icon_center'
				);
			});
		});

		// https://github.com/xdan/jodit/issues/1518
		describe('Horizontal align with imageAlignClasses', () => {
			const imageAlignClasses = {
				left: 'align-left',
				right: 'align-right',
				center: 'align-center block',
				normal: 'in-line'
			};

			it('Should swap the classes instead of setting float and margins', () => {
				const editor = getJodit({
					defaultTimeout: 0,
					imageAlignClasses
				});

				editor.value =
					'<p>text <img alt="" src="tests/artio.jpg" style="float: left"> text</p>';
				editor.s.focus();

				const img = editor.editor.querySelector('img');
				const align = label => {
					simulateEvent('click', img);
					clickTrigger('left', getOpenedPopup(editor));
					clickButton(label, getOpenedPopup(editor));
				};

				align('Right');
				expect(sortAttributes(editor.value)).eq(
					'<p>text <img alt="" class="align-right" src="tests/artio.jpg"> text</p>'
				);

				align('Center');
				expect(sortAttributes(editor.value)).eq(
					'<p>text <img alt="" class="align-center block" src="tests/artio.jpg"> text</p>'
				);

				align('Normal');
				expect(sortAttributes(editor.value)).eq(
					'<p>text <img alt="" class="in-line" src="tests/artio.jpg"> text</p>'
				);
			});

			it('Should read the alignment from the classes', async () => {
				const editor = getJodit({
					defaultTimeout: 0,
					imageAlignClasses
				});

				editor.value =
					'<p>text <img alt="" class="block align-center" src="tests/artio.jpg"> text</p>';
				editor.s.focus();

				simulateEvent('click', editor.editor.querySelector('img'));
				await editor.async.requestIdlePromise();

				expect(
					getButton('left', getOpenedPopup(editor))
						.querySelector('svg')
						.getAttribute('class')
				).contains('jodit-icon_center');
			});
		});

		describe('Click on the image', () => {
			it('Should Open inline popup', () => {
				const editor = getJodit();

				editor.value = '<img alt="" src="tests/artio.jpg"/>';
				editor.s.focus();

				simulateEvent('click', editor.editor.querySelector('img'));

				const popup = getOpenedPopup(editor);

				expect(popup && popup.parentNode.parentNode != null).equals(
					true
				);
			});

			describe('and click in opened popup on pencil button', () => {
				it('Should Open edit image dialog', () => {
					const editor = getJodit();

					editor.value = '<img alt="" src="tests/artio.jpg"/>';
					editor.s.focus();

					simulateEvent('click', editor.editor.querySelector('img'));

					const popup = getOpenedPopup(editor);

					expect(popup && popup.parentNode.parentNode != null).is
						.true;

					clickButton('pencil', popup);

					const dialog = editor.ownerDocument.querySelector(
						'.jodit.jodit-dialog[data-editor_id=' + editor.id + ']'
					);

					expect(dialog).is.not.null;
				});
			});
		});
	});

	describe('Link', () => {
		describe('Click on the link', () => {
			it('Should Open inline popup', () => {
				const editor = getJodit();

				editor.value = '<a href="../artio.jpg"/>test</a>';

				simulateEvent('click', editor.editor.querySelector('a'));

				const popup = getOpenedPopup(editor);

				expect(popup && popup.parentNode.parentNode != null).equals(
					true
				);
			});

			describe('and click in opened popup on pencil button', () => {
				it('Should Open edit link dialog', () => {
					const editor = getJodit();

					editor.value = '<a href="../artio.jpg"/>test</a>';
					simulateEvent('click', editor.editor.querySelector('a'));

					const popup = getOpenedPopup(editor);

					expect(popup && popup.parentNode.parentNode != null).is
						.true;

					clickButton('link', popup);

					const linkEditor = getOpenedPopup(editor);

					expect(linkEditor).is.not.null;

					expect(
						linkEditor.querySelector('[data-ref="url_input"]').value
					).equals('../artio.jpg');
				});

				describe('on different links', () => {
					it('Should Open edit link dialog with different values', () => {
						const editor = getJodit();

						editor.value =
							'<a href="#test1"/>test</a><br>' +
							'<a href="#test2"/>test</a>';

						simulateEvent(
							'click',
							editor.editor.querySelector('a')
						);

						const popup = getOpenedPopup(editor);

						clickButton('link', popup);

						const linkEditor = getOpenedPopup(editor);

						expect(
							linkEditor.querySelector('[data-ref="url_input"]')
								.value
						).equals('#test1');

						simulateEvent(
							['mousedown', 'mouseup', 'click'],
							editor.editor.querySelectorAll('a')[1]
						);

						const popup2 = getOpenedPopup(editor);

						clickButton('link', popup2);

						const linkEditor2 = getOpenedPopup(editor);

						expect(
							linkEditor2.querySelector('[data-ref="url_input"]')
								.value
						).equals('#test2');
					});
				});
			});
		});
	});

	describe('Nested popup position with allowTabNavigation', () => {
		// https://github.com/jodit/jodit-react/issues/290
		[true, false].forEach(allowTabNavigation => {
			it(`Should open near its trigger button when allowTabNavigation=${allowTabNavigation}`, () => {
				const editor = getJodit({ allowTabNavigation });

				editor.value =
					'<table><tbody><tr><td>cell</td></tr></tbody></table>';

				const td = editor.editor.querySelector('td');
				const pos = Jodit.modules.Helpers.position(td);

				simulateEvent(['mousedown', 'mouseup', 'click'], 0, td, e => {
					Object.assign(e, {
						clientX: pos.left,
						clientY: pos.top
					});
				});

				const popup = getOpenedPopup(editor);
				expect(popup).is.not.null;

				const trigger = getButton('brushCell', popup);
				expect(trigger).is.not.null;

				simulateEvent('click', trigger);

				const nested = getOpenedPopup(editor);
				expect(nested).is.not.null;
				expect(nested).does.not.equal(popup);

				const btnRect = trigger.getBoundingClientRect();
				const popRect = nested.getBoundingClientRect();

				const distance = Math.min(
					Math.abs(popRect.top - btnRect.bottom),
					Math.abs(popRect.bottom - btnRect.top)
				);

				expect(distance).is.below(50);
			});
		});
	});

	describe('Table', () => {
		describe('Table button', () => {
			describe('Select table cell', () => {
				it('Should Select table cell', () => {
					const editor = getJodit();

					editor.value =
						'<table>' + '<tr><td>2</td></tr>' + '</table>';

					const td = editor.editor.querySelector('td'),
						pos = Jodit.modules.Helpers.position(td);

					simulateEvent(
						['mousedown', 'mouseup', 'click'],
						0,
						td,
						e => {
							Object.assign(e, {
								clientX: pos.left,
								clientY: pos.top
							});
						}
					);

					expect([td]).deep.equals(
						editor.getInstance('Table').getAllSelectedCells()
					);
				});

				describe('and press brush button', () => {
					it('Should Select table cell and fill it in yellow', () => {
						const editor = getJodit();

						editor.value =
							'<table>' + '<tr><td>3</td></tr>' + '</table>';

						const td = editor.editor.querySelector('td'),
							pos = Jodit.modules.Helpers.position(td);

						simulateEvent(
							['mousedown', 'mouseup', 'click'],
							td,
							e => {
								Object.assign(e, {
									clientX: pos.left,
									clientY: pos.top
								});
							}
						);

						const popup = getOpenedPopup(editor);

						expect(popup && popup.parentNode.parentNode != null).is
							.true;

						clickButton('brushCell', popup);

						const popupColor = getOpenedPopup(editor);

						expect(
							popupColor &&
								window.getComputedStyle(popupColor).display
						).equals('block');

						simulateEvent(
							['mousedown', 'mouseup', 'click'],
							popupColor.querySelector('[data-color="#0000FF"]')
						);

						expect(
							Jodit.modules.Helpers.normalizeColor(
								td.style.backgroundColor
							)
						).equals('#0000FF');

						expect(popupColor.parentNode).is.null;
					});
				});
			});
		});

		it('Open inline popup after click inside the cell', () => {
			const editor = getJodit();

			editor.value = '<table><tbody><tr><td>1</td></tr></tbody></table>';

			const td = editor.editor.querySelector('td'),
				pos = Jodit.modules.Helpers.position(td);

			simulateEvent('focus', editor.editor);
			simulateEvent(
				['mousedown', 'selectstart', 'mouseup', 'click'],
				td,
				e => {
					Object.assign(e, {
						clientX: pos.left,
						clientY: pos.top
					});
				}
			);

			const popup = getOpenedPopup(editor);
			expect(popup).is.not.null;
		});

		describe('Select table cell', () => {
			it('Select table cell and change it vertical align', () => {
				const editor = getJodit();

				editor.value =
					'<table>' +
					'<tr><td style="vertical-align: middle">3</td></tr>' +
					'</table>';

				const td = editor.editor.querySelector('td');
				const pos = Jodit.modules.Helpers.position(td);

				simulateEvent(['mousedown', 'mouseup', 'click'], td, e => {
					Object.assign(e, {
						clientX: pos.left,
						clientY: pos.top
					});
				});

				const popup = getOpenedPopup(editor);
				expect(popup && popup.parentNode.parentNode != null).is.true;

				clickTrigger('valign', popup);

				const popupColor = getOpenedPopup(editor);
				expect(popupColor).is.not.null;

				clickButton('Bottom', popupColor);

				expect(td.style.verticalAlign).equals('bottom');
			});

			it('Select table cell and split it by vertical', () => {
				const editor = getJodit();

				editor.value =
					'<table style="width: 300px;">' +
					'<tr><td>3</td></tr>' +
					'</table>';

				const td = editor.editor.querySelector('td'),
					pos = Jodit.modules.Helpers.position(td);

				simulateEvent(['mousedown', 'mouseup', 'click'], td, e => {
					Object.assign(e, {
						clientX: pos.left,
						clientY: pos.top
					});
				});
				const popup = getOpenedPopup(editor);
				clickTrigger('splitv', popup);

				const list = getOpenedPopup(editor);
				expect(list).is.not.null;
				clickButton('tablesplitv', list);

				expect(sortAttributes(editor.value)).equals(
					'<table style="width:300px"><tbody><tr><td style="width:49.83%">3</td><td style="width:49.83%"><br></td></tr></tbody></table>'
				);
			});

			it('Select table cell and split it by horizontal', () => {
				const editor = getJodit();

				editor.value =
					'<table style="width: 300px;">' +
					'<tr><td>5</td></tr>' +
					'</table>';

				const td = editor.editor.querySelector('td'),
					pos = Jodit.modules.Helpers.position(td);

				simulateEvent(['mousedown', 'mouseup', 'click'], 0, td, e => {
					Object.assign(e, {
						clientX: pos.left,
						clientY: pos.top
					});
				});

				const popup = getOpenedPopup(editor);

				clickTrigger('splitv', popup);
				const list = getOpenedPopup(editor);
				expect(list).is.not.null;
				clickButton('tablesplitg', list);

				expect(sortAttributes(editor.value)).equals(
					'<table style="width:300px"><tbody><tr><td>5</td></tr><tr><td><br></td></tr></tbody></table>'
				);
			});

			it('Select two table cells and merge then in one', () => {
				const editor = getJodit();

				editor.value =
					'<table style="width: 300px;">' +
					'<tr><td>5</td><td>6</td></tr>' +
					'</table>';

				const td = editor.editor.querySelector('td'),
					next = editor.editor.querySelectorAll('td')[1];

				simulateEvent('mousedown', td);

				simulateEvent(['mousemove', 'mouseup'], next);

				const popup = getOpenedPopup(editor);

				clickButton('merge', popup);

				expect(sortAttributes(editor.value)).equals(
					'<table style="width:300px"><tbody><tr><td>5<br>6</td></tr></tbody></table>'
				);
			});

			describe('Add', () => {
				let editor, popup;

				beforeEach(() => {
					editor = getJodit();

					editor.value =
						'<table>' + '<tr><td>3</td></tr>' + '</table>';

					const td = editor.editor.querySelector('td'),
						pos = Jodit.modules.Helpers.position(td);

					simulateEvent(['mousedown', 'mouseup', 'click'], td, e => {
						Object.assign(e, {
							clientX: pos.left,
							clientY: pos.top
						});
					});

					popup = getOpenedPopup(editor);

					expect(popup && popup.parentNode.parentNode != null).is
						.true;
				});

				describe('Click on icon', () => {
					describe('Add column', () => {
						it('Should just open popup', () => {
							clickButton('addcolumn', popup);

							const popupColor = getOpenedPopup(editor);
							expect(popupColor).does.not.eq(popup);
						});
					});

					describe('Add row', () => {
						it('Should just open popup', () => {
							clickButton('addrow', popup);

							const popupColor = getOpenedPopup(editor);
							expect(popupColor).does.not.eq(popup);
						});
					});
				});

				describe('column before', () => {
					it('Should add column before this', () => {
						clickTrigger('addcolumn', popup);

						const popupColor = getOpenedPopup(editor);

						clickButton('Insert column before', popupColor);

						expect(sortAttributes(editor.value)).equals(
							'<table><tbody><tr><td></td><td>3</td></tr></tbody></table>'
						);
					});
				});

				describe('row above', () => {
					it('Should add row above this', () => {
						clickTrigger('addrow', popup);

						const popupColor = getOpenedPopup(editor);

						clickButton('Insert row above', popupColor);

						expect(sortAttributes(editor.value)).equals(
							'<table><tbody><tr><td></td></tr><tr><td>3</td></tr></tbody></table>'
						);
					});
				});
			});

			describe('Remove', () => {
				let editor = null,
					popup;
				beforeEach(() => {
					editor = getJodit();

					editor.value =
						'<table>' +
						'<tr><td>1</td><td>4</td></tr>' +
						'<tr><td>2</td><td>5</td></tr>' +
						'<tr><td>3</td><td>6</td></tr>' +
						'</table>';

					const td = editor.editor.querySelectorAll('td')[1],
						pos = Jodit.modules.Helpers.position(td);

					simulateEvent(['mousedown', 'mouseup', 'click'], td, e => {
						Object.assign(e, {
							clientX: pos.left,
							clientY: pos.top
						});
					});

					popup = getOpenedPopup(editor);

					expect(popup && popup.parentNode.parentNode != null).is
						.true;
				});

				describe('Row', () => {
					it('should remove it row', () => {
						clickTrigger('deleteTable', popup);

						const popupColor = getOpenedPopup(editor);
						expect(
							popupColor &&
								window.getComputedStyle(popupColor).display
						).equals('block');

						clickButton('Delete row', popupColor);

						expect(editor.value).equals(
							'<table><tbody><tr><td>2</td><td>5</td></tr><tr><td>3</td><td>6</td></tr></tbody></table>'
						);
					});
				});

				describe('Column', () => {
					it('should remove whole table', () => {
						clickTrigger('deleteTable', popup);

						const popupColor = getOpenedPopup(editor);

						clickButton('Delete column', popupColor);

						expect(editor.value).equals(
							'<table><tbody><tr><td>1</td></tr><tr><td>2</td></tr><tr><td>3</td></tr></tbody></table>'
						);
					});
				});

				describe('Table', () => {
					it('should remove whole table', () => {
						clickTrigger('deleteTable', popup);

						const popupColor = getOpenedPopup(editor);

						clickButton('Delete table', popupColor);

						expect(editor.value).equals('');
					});
				});

				describe('Click on the trash button', () => {
					it('should just open trigger', () => {
						clickButton('deleteTable', popup);

						const popupColor = getOpenedPopup(editor);
						expect(popupColor).does.not.eq(popup);
					});
				});
			});

			it('Select table cell and remove whole table should hide inline popup', () => {
				const editor = getJodit();

				editor.value =
					'<table>' +
					'<tr><td>1</td></tr>' +
					'<tr><td>2</td></tr>' +
					'<tr><td>3</td></tr>' +
					'</table>';

				const td = editor.editor.querySelectorAll('td')[1];

				const pos = Jodit.modules.Helpers.position(td);

				simulateEvent(['mousedown', 'mouseup', 'click'], 0, td, e => {
					Object.assign(e, {
						clientX: pos.left,
						clientY: pos.top
					});
				});

				const popup = getOpenedPopup(editor);

				expect(popup && popup.parentNode.parentNode != null).is.true;

				clickTrigger('deleteTable', popup);

				const popupColor = getOpenedPopup(editor);
				expect(
					popupColor && window.getComputedStyle(popupColor).display
				).equals('block');

				simulateEvent('click', 0, popupColor.querySelector('button'));

				expect(editor.value).equals('');

				expect(popup && popup.parentNode).is.null;
			});
		});

		describe('Starting to change text', () => {
			it('Should hide inline popup', () => {
				const editor = getJodit();

				editor.value = '<table><tr><td>1</td></tr></table>';

				const td = editor.editor.querySelector('td'),
					pos = Jodit.modules.Helpers.position(td);

				simulateEvent(['mousedown', 'mouseup', 'click'], td, e => {
					Object.assign(e, {
						clientX: pos.left,
						clientY: pos.top
					});
				});

				const popup = getOpenedPopup(editor);

				expect(popup && popup.parentNode.parentNode != null).is.true;

				editor.e.fire('change');
				editor.e.fire('change');

				expect(popup && popup.parentNode).is.null;
			});
		});

		// https://github.com/xdan/jodit/issues/1058
		describe('Selection toolbar in iframe mode (#1058)', () => {
			it('Should open the popup next to the selection, not at the iframe-local coordinates', async () => {
				// push the editor down so the iframe offset is significant —
				// without the offset correction the popup opens at the
				// iframe-local (small) coordinates far above the editor
				const spacer = document.createElement('div');
				spacer.style.height = '700px';
				document.body.insertBefore(spacer, document.body.firstChild);

				const editor = getJodit({
					iframe: true,
					toolbarInlineForSelection: true,
					history: { timeout: 0 }
				});

				editor.value = '<p>|some selected text|</p>';
				editor.container.scrollIntoView({ block: 'center' });

				const p = editor.editor.querySelector('p');

				simulateEvent('mousedown', p);
				setCursorToChar(editor);
				simulateEvent(['mouseup', 'selectionchange'], p);

				await delay(editor.defaultTimeout + 50);

				const popup = getOpenedPopup(editor);
				expect(popup).is.not.null;

				// position() compensates the iframe offset — the popup must
				// sit within a sane distance of the paragraph in the host
				// document coordinates
				const pPos = Jodit.modules.Helpers.position(p, editor);
				const popupRect = popup.getBoundingClientRect();

				expect(
					Math.abs(popupRect.top - pPos.top),
					`popup.top=${popupRect.top} p.top=${pPos.top}`
				).is.below(200);

				spacer.remove();
			});
		});

		describe('Click a button in the selection toolbar (#1238)', () => {
			it('Should keep the toolbar open while the selection persists', async () => {
				const editor = getJodit({
					toolbarInlineForSelection: true
				});

				editor.value = '<p>|some text|</p>';

				const p = editor.editor.querySelector('p');

				simulateEvent('mousedown', p);
				setCursorToChar(editor);
				simulateEvent(['mouseup', 'selectionchange'], p);

				const popup = getOpenedPopup(editor);
				expect(popup && popup.parentNode.parentNode != null).is.true;

				// the buttons live inside the popup — the browser fires
				// mousedown there before the button click
				const boldButton = getButton('bold', popup);
				simulateEvent('mousedown', boldButton);
				clickButton('bold', popup);

				await delay(editor.defaultTimeout + 50);

				expect(editor.value).equals(
					'<p><strong>some text</strong></p>'
				);

				// the selection is still there — the toolbar must be reopened
				expect(editor.s.isCollapsed()).is.false;
				const popupAfter = getOpenedPopup(editor);
				expect(popupAfter).is.not.null;
				expect(getButton('italic', popupAfter)).is.not.null;
			});
		});

		describe('Select text inside table cell', () => {
			it('Should show popup for text selection', () => {
				const editor = getJodit({
					toolbarInlineForSelection: true
				});

				editor.value =
					'<table>' +
					'<tr><td>text |inside| cell</td></tr>' +
					'</table>';

				const td = editor.editor.querySelector('td');

				simulateEvent(['mousedown'], td);
				setCursorToChar(editor);
				simulateEvent(['mouseup', 'selectionchange'], td);

				const popup = getOpenedPopup(editor);
				expect(popup && popup.parentNode.parentNode != null).is.true;
				expect(getButton('bold', popup)).is.not.null;
			});
		});

		describe('Link inside cell', () => {
			describe('Click on the link', () => {
				it('Should Open inline popup', () => {
					const editor = getJodit();

					editor.value =
						'<table style="width: 100%;">' +
						'<tbody>' +
						'<tr>' +
						'<td><a href="http://localhost:8000/">href</a></td>' +
						'<td><br></td>' +
						'</tr>' +
						'</tbody>' +
						'</table>';

					simulateEvent('click', editor.editor.querySelector('a'));

					simulateEvent(
						'mousedown',
						editor.editor.querySelector('a')
					);
					simulateEvent('mouseup', editor.editor.querySelector('a'));
					simulateEvent('click', editor.editor.querySelector('a'));

					const popup = getOpenedPopup(editor);

					expect(popup && popup.parentNode.parentNode != null).equals(
						true
					);

					clickButton('link', popup);

					const linkEditor = getOpenedPopup(editor);

					expect(linkEditor).is.not.null;

					const input = linkEditor.querySelector(
						'[data-ref="url_input"]'
					);

					expect(input.value).equals('http://localhost:8000/');

					simulateEvent('mousedown', input);
					simulateEvent('mouseup', input);
					simulateEvent('click', input);

					input.focus();

					expect(popup && popup.parentNode.parentNode != null).equals(
						true
					);

					linkEditor.querySelector('[data-ref="url_input"]').value =
						'https://xdsoft.net';
				});
			});
		});
	});

	describe('toolbarInlineDisabledButtons', () => {
		it('Should not show disabled buttons in inline popup for images', () => {
			const editor = getJodit({
				toolbarInlineDisabledButtons: ['pencil']
			});

			editor.value = '<img alt="" src="tests/artio.jpg"/>';
			editor.s.focus();

			simulateEvent('click', editor.editor.querySelector('img'));

			const popup = getOpenedPopup(editor);

			expect(popup).is.not.null;
			expect(getButton('pencil', popup)).is.null;
		});

		it('Should not show disabled buttons in inline popup for links', () => {
			const editor = getJodit({
				toolbarInlineDisabledButtons: ['link']
			});

			editor.value = '<a href="../artio.jpg"/>test</a>';

			simulateEvent('click', editor.editor.querySelector('a'));

			const popup = getOpenedPopup(editor);

			expect(popup).is.not.null;
			expect(getButton('link', popup)).is.null;
		});

		describe('Disabled/Enabled buttons', () => {
			it('Should still show buttons not in the disabled list', () => {
				const editor = getJodit({
					toolbarInlineDisabledButtons: ['pencil']
				});

				editor.value = '<img alt="" src="tests/artio.jpg"/>';
				editor.s.focus();

				simulateEvent('click', editor.editor.querySelector('img'));

				const popup = getOpenedPopup(editor);

				expect(popup).is.not.null;
				expect(getButton('pencil', popup)).is.null;
				expect(getButton('delete', popup)).is.not.null;
			});

			it('Should still show all buttons not in the disabled list', () => {
				const editor = getJodit({});

				editor.value = '<img alt="" src="tests/artio.jpg"/>';
				editor.s.focus();

				simulateEvent('click', editor.editor.querySelector('img'));

				const popup = getOpenedPopup(editor);

				expect(popup).is.not.null;
				expect(getButton('pencil', popup)).is.not.null;
				expect(getButton('delete', popup)).is.not.null;
			});
		});
	});

	describe('when a string is passed to the popup config', () => {
		it('Should show the content of the string in the popup', () => {
			it('Should Open inline popup', () => {
				const editor = getJodit({
					popup: {
						a: '<div class="custom-popup-test">foo</div>'
					}
				});

				editor.value = '<a href="../artio.jpg"/>test</a>';

				simulateEvent('click', editor.editor.querySelector('a'));

				const popup = getOpenedPopup(editor);

				expect(
					popup.getElementsByClassName('.custom-popup-test').length
				).equals(1);
			});
		});
	});

	describe('Custom cell popup buttons', () => {
		it('Should resolve cell button names from controls when using string names in popup.cells', () => {
			const editor = getJodit({
				popup: {
					cells: Jodit.atom([
						'valign',
						'splitv',
						'merge',
						'addcolumn',
						'addrow',
						'deleteTable'
					])
				}
			});

			editor.value =
				'<table><tr><td>test</td><td>test2</td></tr></table>';

			const td = editor.editor.querySelector('td');
			const pos = Jodit.modules.Helpers.position(td);

			simulateEvent(['mousedown', 'mouseup', 'click'], td, e => {
				Object.assign(e, {
					clientX: pos.left,
					clientY: pos.top
				});
			});

			const popup = getOpenedPopup(editor);
			expect(popup).is.not.null;

			const buttons = popup.querySelectorAll('.jodit-toolbar-button');

			// deleteTable button should have an SVG icon (bin), not just text
			const deleteBtn = Array.from(buttons).find(
				btn => btn.getAttribute('data-ref') === 'deleteTable'
			);
			expect(deleteBtn).is.not.undefined;
			const svg = deleteBtn.querySelector('svg');
			expect(svg, 'deleteTable button should have SVG icon').is.not.null;

			// Valign button should exist and have a tooltip
			const valignBtn = Array.from(buttons).find(
				btn => btn.getAttribute('data-ref') === 'valign'
			);
			expect(valignBtn).is.not.undefined;
		});
	});
});
