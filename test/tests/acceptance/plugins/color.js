/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Color plugin', function () {
	it('Open colorpicker set background and color. After this click in another any place. White when popap will be closed. Open again and remove all styles.', function () {
		const editor = getJodit();

		editor.value = 'text2text';

		const range = editor.s.createRange();

		range.setStart(editor.editor.firstChild.firstChild, 3);
		range.setEnd(editor.editor.firstChild.firstChild, 6);

		editor.s.selectRange(range);

		clickButton('brush', editor);

		const popup = getOpenedPopup(editor);

		expect(window.getComputedStyle(popup).display).equals('block');

		simulateEvent(
			'mousedown',
			popup.querySelector('[data-color="#F9CB9C"]')
		);

		expect(editor.value).equals(
			'<p>tex<span style="background-color: rgb(249, 203, 156);">t2t</span>ext</p>'
		);

		// simulateEvent('mousedown', 0, editor.editor)
		expect(popup.parentNode).is.null;

		range.selectNodeContents(editor.editor.querySelector('span'));
		// range.collapse(true);
		editor.s.selectRange(range);

		clickButton('brush', editor);

		const popup2 = getOpenedPopup(editor);
		expect(popup2).is.null;
	});

	describe('Show native color picker', function () {
		describe('Enable', function () {
			describe('Select all content by edges', function () {
				it('Should apply style to all elements', function () {
					const editor = getJodit();

					editor.value = '<p><br></p><p>test</p>';
					const range = editor.s.createRange(true);

					range.setStart(editor.editor.firstChild, 0);
					range.setEnd(editor.editor.lastChild.firstChild, 4);
					editor.s.selectRange(range);

					clickButton('brush', editor);

					const popup = getOpenedPopup(editor);

					expect(popup).is.not.null;

					simulateEvent(
						'mousedown',
						popup.querySelector('[data-color="#F9CB9C"]')
					);

					expect(sortAttributes(editor.value)).equals(
						'<p><span style="background-color:#F9CB9C"><br></span></p>' +
							'<p><span style="background-color:#F9CB9C">test</span></p>'
					);
				});
			});

			it('should open color picker with button - native color picker', function () {
				const editor = getJodit({
					showBrowserColorPicker: true
				});

				editor.value = 'text2text';

				clickTrigger('brush', editor);

				const list = getOpenedPopup(editor);

				// In two tabs text-color and background-color
				expect(
					list.querySelectorAll('input[type="color"]').length
				).equals(2);
			});
		});

		describe('Disable', function () {
			it('should open color picker without button - native color picker', function () {
				const editor = getJodit({
					showBrowserColorPicker: false
				});

				editor.value = 'text2text';

				clickTrigger('brush', editor);

				const list = getOpenedPopup(editor);

				expect(
					list.querySelectorAll('input[type="color"]').length
				).equals(0);
			});
		});
	});

	describe('Buttons', function () {
		describe('In brush popup', function () {
			it('Should be also only text', function () {
				const editor = getJodit({
					textIcons: true
				});

				clickTrigger('brush', editor);

				const popup = getOpenedPopup(editor);

				expect(popup).is.not.null;

				expect(popup.querySelectorAll('svg, img').length).equals(0);
			});
		});
	});

	describe('State', function () {
		describe('First click on the button', function () {
			it('Should open popup', function () {
				const editor = getJodit();

				clickButton('brush', editor);

				const popup = getOpenedPopup(editor);

				expect(popup).is.not.null;
			});

			describe('Second click on the button', function () {
				it('Should apply previous choice', function () {
					const editor = getJodit();

					editor.value = 'text2text';

					const range = editor.s.createRange(true);

					range.setStart(editor.editor.firstChild.firstChild, 3);
					range.setEnd(editor.editor.firstChild.firstChild, 6);

					clickButton('brush', editor);

					const popup = getOpenedPopup(editor);

					expect(popup).is.not.null;

					simulateEvent(
						'mousedown',
						popup.querySelector('[data-color="#F9CB9C"]')
					);

					expect(editor.value).equals(
						'<p>tex<span style="background-color: rgb(249, 203, 156);">t2t</span>ext</p>'
					);

					const range2 = editor.s.createRange(true);

					range2.setStartAfter(editor.editor.firstChild);

					clickButton('brush', editor);

					const popup2 = getOpenedPopup(editor);

					expect(popup2).is.null;

					expect(editor.value).equals(
						'<p>tex<span style="background-color: rgb(249, 203, 156);">t2t</span>ext</p><p><span style="background-color: rgb(249, 203, 156);"></span></p>'
					);
				});
			});
		});
	});
});
