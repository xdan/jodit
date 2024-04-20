/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test image', function () {
	it('Double-click on image then openOnDblClick=false should select image', function () {
		const editor = getJodit({
			image: { openOnDblClick: false }
		});
		editor.value = '<img src="tests/artio.jpg" alt="artio"/>';

		simulateEvent('dblclick', editor.editor.querySelector('img'));

		const dialog = getOpenedDialog(editor);

		expect(dialog).is.null;

		expect(editor.s.current().tagName).equals('IMG');
	});

	describe('One click on image', function () {
		it('should show resizer', function () {
			const editor = getJodit();
			editor.value = '<img src="tests/artio.jpg"/>';

			const img = editor.editor.querySelector('img');

			simulateEvent('click', img);

			const resizer = editor.ownerDocument.querySelector(
				'.jodit-resizer[data-editor_id=' + editor.id + ']'
			);

			expect(resizer).is.not.null;
		});

		describe('in full size mode', function () {
			it('should show resizer and set mmaximum zIndex', function () {
				const editor = getJodit({
					fullsize: true
				});

				editor.value = '<img src="tests/artio.jpg"/>';

				const img = editor.editor.querySelector('img');

				simulateEvent('click', img);

				const resizer = document.querySelector(
					'.jodit-resizer[data-editor_id=' + editor.id + ']'
				);

				expect(resizer).is.not.null;
				expect(resizer.style.zIndex).equals(
					window.getComputedStyle(editor.container).zIndex
				);
			});
		});
	});

	it('One click inside table cell should show resizer', function () {
		const editor = getJodit();
		editor.value = '<table><tr><td>1</td></tr></table>';

		const td = editor.editor.querySelector('td');

		simulateEvent('click', 0, td);

		const resizer = document.querySelector(
			'.jodit-resizer[data-editor_id=' + editor.id + ']'
		);

		expect(resizer).is.not.null;
	});

	describe('Popup box', function () {
		describe('In relative object', function () {
			it('should be under image', function () {
				const div = document.createElement('div');
				div.innerHTML =
					'<div style="width:800px; margin:auto; border:1px solid red;">\n' +
					'        wrong image selection\n' +
					'        <div style="position:relative;text-align: left">\n' +
					'            <textarea id="text__area0"> <img src="https://xdsoft.net/jodit/files/artio.jpg" style="border:1px solid red;width:100px;height:100px;"/><br/><br/><br/><br/><br/><br/></textarea>\n' +
					'        </div>\n' +
					'    </div>';

				document.body.appendChild(div);
				const editor = new Jodit('#text__area0', {
					history: {
						timeout: 0
					}
				});
				window.scrollTo(0, offset(div).top);
				simulateEvent('click', editor.editor.querySelector('img'));

				const popup = getOpenedPopup(editor);

				expect(popup.parentNode.parentNode != null).is.true;

				const positionPopup = Jodit.modules.Helpers.position(popup);
				const positionImg = Jodit.modules.Helpers.position(
					editor.editor.querySelector('img')
				);

				expect(Math.abs(positionPopup.left - positionImg.left) < 20).is
					.true;

				expect(
					Math.abs(
						positionPopup.top -
							(positionImg.top + positionImg.height)
					) < 20
				).is.true;

				editor.destruct();
				document.body.removeChild(div);
			});
		});

		describe('Click on button', function () {
			describe('H Align', function () {
				describe('Right', function () {
					it('Should change img H align to right', function () {
						const editor = getJodit();
						editor.value =
							'<p><img style="width:100px; height: 100px;" src="tests/artio.jpg"/></p>';

						simulateEvent(
							'click',
							editor.editor.querySelector('img')
						);

						const popup = getOpenedPopup(editor);
						clickTrigger('left', popup);
						const list = getOpenedPopup(editor);

						clickButton('Right', list);

						expect(sortAttributes(editor.value)).equals(
							'<p><img src="tests/artio.jpg" style="float:right;height:100px;width:100px"></p>'
						);
					});
				});

				describe('Left', function () {
					it('Should change img H align to left', function () {
						const editor = getJodit();
						editor.value =
							'<p><img style="width:100px; height: 100px;" src="tests/artio.jpg"/></p>';

						simulateEvent(
							'click',
							editor.editor.querySelector('img')
						);

						const popup = getOpenedPopup(editor);
						clickTrigger('left', popup);
						const list = getOpenedPopup(editor);

						clickButton('Left', list);

						expect(sortAttributes(editor.value)).equals(
							'<p><img src="tests/artio.jpg" style="float:left;height:100px;width:100px"></p>'
						);
					});
				});

				describe('Center', function () {
					it('Should change img H align to center', function () {
						const editor = getJodit();
						editor.value =
							'<p><img style="width:100px; height: 100px;" src="tests/artio.jpg"/></p>';

						simulateEvent(
							'click',
							editor.editor.querySelector('img')
						);

						const popup = getOpenedPopup(editor);
						clickTrigger('left', popup);
						const list = getOpenedPopup(editor);

						clickButton('Center', list);

						expect(sortAttributes(editor.value)).equals(
							'<p><img src="tests/artio.jpg" style="display:block;height:100px;margin-left:auto;margin-right:auto;width:100px"></p>'
						);
					});
				});

				describe('Normal', function () {
					it('Should change img H align to center', function () {
						const editor = getJodit();
						editor.value =
							'<p><img style="width:100px; height: 100px; float: right" src="tests/artio.jpg"/></p>';

						simulateEvent(
							'click',
							editor.editor.querySelector('img')
						);

						const popup = getOpenedPopup(editor);
						clickTrigger('left', popup);
						const list = getOpenedPopup(editor);

						clickButton('Normal', list);

						expect(sortAttributes(editor.value)).equals(
							'<p><img src="tests/artio.jpg" style="height:100px;width:100px"></p>'
						);
					});
				});
			});

			describe('V Align', function () {
				describe('Top', function () {
					it('Should change img V align to top', function () {
						const editor = getJodit();
						editor.value =
							'<p><img style="width:100px; height: 100px;" src="tests/artio.jpg"/></p>';

						simulateEvent(
							'click',
							editor.editor.querySelector('img')
						);

						const popup = getOpenedPopup(editor);

						clickTrigger('valign', popup);
						const list = getOpenedPopup(editor);

						clickButton('Top', list);

						expect(sortAttributes(editor.value)).equals(
							'<p><img src="tests/artio.jpg" style="height:100px;vertical-align:top;width:100px"></p>'
						);
					});
				});

				describe('Bottom', function () {
					it('Should change img V align to bottom', function () {
						const editor = getJodit();
						editor.value =
							'<p><img style="width:100px; height: 100px;" src="tests/artio.jpg"/></p>';

						simulateEvent(
							'click',
							editor.editor.querySelector('img')
						);

						const popup = getOpenedPopup(editor);

						clickTrigger('valign', popup);
						const list = getOpenedPopup(editor);

						clickButton('Bottom', list);

						expect(sortAttributes(editor.value)).equals(
							'<p><img src="tests/artio.jpg" style="height:100px;vertical-align:bottom;width:100px"></p>'
						);
					});
				});

				describe('Middle', function () {
					it('Should change img V align to Middle', function () {
						const editor = getJodit();
						editor.value =
							'<p><img style="width:100px; height: 100px;" src="tests/artio.jpg"/></p>';

						simulateEvent(
							'click',
							editor.editor.querySelector('img')
						);

						const popup = getOpenedPopup(editor);

						clickTrigger('valign', popup);
						const list = getOpenedPopup(editor);

						clickButton('Middle', list);

						expect(sortAttributes(editor.value)).equals(
							'<p><img src="tests/artio.jpg" style="height:100px;vertical-align:middle;width:100px"></p>'
						);
					});
				});

				describe('Normal', function () {
					it('Should change img V align to Normal', function () {
						const editor = getJodit();
						editor.value =
							'<p><img style="width:100px; vertical-align:middle; height: 100px;" src="tests/artio.jpg"/></p>';

						simulateEvent(
							'click',
							editor.editor.querySelector('img')
						);

						const popup = getOpenedPopup(editor);

						clickTrigger('valign', popup);
						const list = getOpenedPopup(editor);

						clickButton('Normal', list);

						expect(sortAttributes(editor.value)).equals(
							'<p><img src="tests/artio.jpg" style="height:100px;width:100px"></p>'
						);
					});
				});
			});
		});
	});

	describe('Replace data:base64 to blob-object-uri', () => {
		const source =
			'<p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII="></p>';

		const fix = value =>
			value
				.replace(/(127\.0\.0\.1|localhost):[0-9]+/, 'localhost:2000')
				.replace(
					/[0-9abcdef-]{36}/,
					'03377cf0-6260-4351-82ad-8a8901ea104f'
				);

		describe('set imageProcessor.replaceDataURIToBlobIdInView', () => {
			describe('to true', () => {
				it('should replace data:base64 to blob-object-uri', () => {
					const editor = getJodit({
						sourceEditor: 'area'
					});

					editor.value = source;
					editor.setMode(Jodit.MODE_SOURCE);

					const mirror = editor.container.querySelector(
						'textarea.jodit-source__mirror'
					);

					expect(fix(mirror.value)).eq(
						'<p><img src="blob:http://localhost:2000/03377cf0-6260-4351-82ad-8a8901ea104f"></p>'
					);

					expect(fix(editor.getNativeEditorValue())).eq(
						'<p><img src="blob:http://localhost:2000/03377cf0-6260-4351-82ad-8a8901ea104f"></p>'
					);

					expect(sortAttributes(editor.value)).eq(source);

					expect(sortAttributes(editor.getElementValue())).eq(source);
				});
			});

			describe('to false', () => {
				it('should replace data:base64 to blob-object-uri', () => {
					const editor = getJodit({
						imageProcessor: {
							replaceDataURIToBlobIdInView: false
						}
					});
					editor.value = source;

					expect(sortAttributes(editor.value)).eq(source);

					editor.setMode(Jodit.MODE_SOURCE);

					const mirror = editor.container.querySelector(
						'textarea.jodit-source__mirror'
					);

					expect(fix(mirror.value)).eq(source);

					expect(fix(editor.getNativeEditorValue())).eq(source);

					expect(sortAttributes(editor.getElementValue())).eq(source);
				});
			});
		});
	});
});
