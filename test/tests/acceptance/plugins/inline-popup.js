/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Text Inline Popup plugin', function () {
	describe('Image', function () {
		describe('Click on the image', function () {
			it('Should Open inline popup', function () {
				const editor = getJodit();

				editor.value = '<img alt="" src="../artio.jpg"/>';
				editor.s.focus();

				simulateEvent('click', editor.editor.querySelector('img'));

				const popup = getOpenedPopup(editor);

				expect(popup && popup.parentNode.parentNode != null).equals(
					true
				);
			});

			describe('and click in opened popup on pencil button', function () {
				it('Should Open edit image dialog', function () {
					const editor = getJodit();

					editor.value = '<img alt="" src="../artio.jpg"/>';
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

	describe('Link', function () {
		describe('Click on the link', function () {
			it('Should Open inline popup', function () {
				const editor = getJodit();

				editor.value = '<a href="../artio.jpg"/>test</a>';

				simulateEvent('click', editor.editor.querySelector('a'));

				const popup = getOpenedPopup(editor);

				expect(popup && popup.parentNode.parentNode != null).equals(
					true
				);
			});

			describe('and click in opened popup on pencil button', function () {
				it('Should Open edit link dialog', function () {
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

				describe('on different links', function () {
					it('Should Open edit link dialog with different values', function () {
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

	describe('Table', function () {
		describe('Table button', function () {
			describe('Select table cell', function () {
				it('Should Select table cell', function () {
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

				describe('and press brush button', function () {
					it('Should Select table cell and fill it in yellow', function () {
						const editor = getJodit();

						editor.value =
							'<table>' + '<tr><td>3</td></tr>' + '</table>';

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

						const popup = getOpenedPopup(editor);

						expect(popup && popup.parentNode.parentNode != null).is
							.true;

						clickTrigger('brush', popup);

						const popupColor = getOpenedPopup(editor);
						expect(
							popupColor &&
								window.getComputedStyle(popupColor).display
						).equals('block');

						simulateEvent(
							'mousedown',
							0,
							popupColor.querySelector('a')
						);

						expect(
							Jodit.modules.Helpers.normalizeColor(
								td.style.backgroundColor
							)
						).equals('#000000');
					});
				});
			});
		});

		it('Open inline popup after click inside the cell', function () {
			const editor = getJodit();

			editor.value = '<table>' + '<tr><td>1</td></tr>' + '</table>';

			const td = editor.editor.querySelector('td'),
				pos = Jodit.modules.Helpers.position(td);

			simulateEvent(['mousedown', 'mouseup', 'click'], 0, td, e => {
				Object.assign(e, {
					clientX: pos.left,
					clientY: pos.top
				});
			});

			const popup = getOpenedPopup(editor);

			expect(popup).is.not.null;
		});

		it('Select table cell and change it vertical align', function () {
			const editor = getJodit();

			editor.value =
				'<table>' +
				'<tr><td style="vertical-align: middle">3</td></tr>' +
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
			expect(popup && popup.parentNode.parentNode != null).is.true;

			clickTrigger('valign', popup);

			const popupColor = getOpenedPopup(editor);
			expect(popupColor).is.not.null;

			clickButton('Bottom', popupColor);

			expect(td.style.verticalAlign).equals('bottom');
		});

		it('Select table cell and split it by vertical', function () {
			const editor = getJodit();

			editor.value =
				'<table style="width: 300px;">' +
				'<tr><td>3</td></tr>' +
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
			clickButton('tablesplitv', list);

			expect(sortAttributes(editor.value)).equals(
				'<table style="width:300px"><tbody><tr><td style="width:49.83%">3</td><td style="width:49.83%"><br></td></tr></tbody></table>'
			);
		});

		it('Select table cell and split it by horizontal', function () {
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

		it('Select two table cells and merge then in one', function () {
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

		it('Select table cell add column before this', function () {
			const editor = getJodit();

			editor.value = '<table>' + '<tr><td>3</td></tr>' + '</table>';

			const td = editor.editor.querySelector('td'),
				pos = Jodit.modules.Helpers.position(td);

			simulateEvent(['mousedown', 'mouseup', 'click'], 0, td, e => {
				Object.assign(e, {
					clientX: pos.left,
					clientY: pos.top
				});
			});

			const popup = getOpenedPopup(editor);

			expect(popup && popup.parentNode.parentNode != null).is.true;

			clickTrigger('addcolumn', popup);

			const popupColor = getOpenedPopup(editor);
			expect(
				popupColor && window.getComputedStyle(popupColor).display
			).equals('block');

			simulateEvent('click', 0, popupColor.querySelector('button'));

			expect(sortAttributes(editor.value)).equals(
				'<table><tbody><tr><td></td><td>3</td></tr></tbody></table>'
			);
		});

		it('Select table cell and add row above this', function () {
			const editor = getJodit();

			editor.value = '<table>' + '<tr><td>3</td></tr>' + '</table>';

			const td = editor.editor.querySelector('td'),
				pos = Jodit.modules.Helpers.position(td);

			simulateEvent(['mousedown', 'mouseup', 'click'], 0, td, e => {
				Object.assign(e, {
					clientX: pos.left,
					clientY: pos.top
				});
			});

			const popup = getOpenedPopup(editor);

			expect(popup && popup.parentNode.parentNode != null).is.true;

			clickTrigger('addrow', popup);

			const popupColor = getOpenedPopup(editor);
			expect(
				popupColor && window.getComputedStyle(popupColor).display
			).equals('block');

			simulateEvent('click', 0, popupColor.querySelector('button'));

			expect(sortAttributes(editor.value)).equals(
				'<table><tbody><tr><td></td></tr><tr><td>3</td></tr></tbody></table>'
			);
		});

		it('Select table cell and remove it row', function () {
			const editor = getJodit();

			editor.value =
				'<table>' +
				'<tr><td>1</td></tr>' +
				'<tr><td>2</td></tr>' +
				'<tr><td>3</td></tr>' +
				'</table>';

			const td = editor.editor.querySelectorAll('td')[1],
				pos = Jodit.modules.Helpers.position(td);

			simulateEvent(['mousedown', 'mouseup', 'click'], 0, td, e => {
				Object.assign(e, {
					clientX: pos.left,
					clientY: pos.top
				});
			});

			const popup = getOpenedPopup(editor);

			expect(popup && popup.parentNode.parentNode != null).is.true;

			clickTrigger('delete', popup);

			const popupColor = getOpenedPopup(editor);
			expect(
				popupColor && window.getComputedStyle(popupColor).display
			).equals('block');

			simulateEvent('click', 0, popupColor.querySelectorAll('button')[1]);

			expect(editor.value).equals(
				'<table><tbody><tr><td>1</td></tr><tr><td>3</td></tr></tbody></table>'
			);
		});

		it('Select table cell and remove whole table should hide inline popup', function () {
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

			clickTrigger('delete', popup);

			const popupColor = getOpenedPopup(editor);
			expect(
				popupColor && window.getComputedStyle(popupColor).display
			).equals('block');

			simulateEvent('click', 0, popupColor.querySelector('button'));

			expect(editor.value).equals('');

			expect(popup && popup.parentNode).is.null;
		});

		describe('Link inside cell', function () {
			describe('Click on the link', function () {
				it('Should Open inline popup', function () {
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

	describe('when a string is passed to the popup config', function () {
		it('Should show the content of the string in the popup', function () {
			it('Should Open inline popup', function () {
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
});
