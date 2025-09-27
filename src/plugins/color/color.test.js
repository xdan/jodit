/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
('colorPlugin' in window.skipTest ? describe.skip : describe)(
	'Color plugin',
	function () {
		it('Open color picker set background and color. After this, click in another any place. White when popap will be closed. Open again and remove all styles.', function () {
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
				it('should open color picker without a button - native color picker', function () {
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

		describe('Disable/Enable plugin', () => {
			describe('Disable', () => {
				let editor;
				beforeEach(() => {
					editor = getJodit({
						disablePlugins: ['color']
					});
					editor.value = '<table><tr><td>test</td></tr></table>';
				});

				it('should not show brush button', () => {
					expect(getButton('brush', editor)).is.null;
				});

				it('should not show brush button inside inline popup', () => {
					const td = editor.editor.querySelector('td');
					const pos = Jodit.modules.Helpers.position(td);

					simulateEvent(['mousedown', 'mouseup', 'click'], td, e => {
						Object.assign(e, {
							clientX: pos.left,
							clientY: pos.top
						});
					});

					const popup = getOpenedPopup(editor);
					expect(getButton('brushCell', popup)).is.null;
				});
			});

			describe('Enable', () => {
				let editor;
				beforeEach(() => {
					editor = getJodit();
					editor.value = '<table><tr><td>test</td></tr></table>';
				});

				it('should not show brush button', () => {
					expect(getButton('brush', editor)).is.not.null;
				});

				it('should not show brush button inside inline popup', () => {
					const td = editor.editor.querySelector('td');
					const pos = Jodit.modules.Helpers.position(td);

					simulateEvent(['mousedown', 'mouseup', 'click'], td, e => {
						Object.assign(e, {
							clientX: pos.left,
							clientY: pos.top
						});
					});

					const popup = getOpenedPopup(editor);
					expect(getButton('brushCell', popup)).is.not.null;
				});
			});
		});
		describe('Issue #1281: HTML structure preservation with foreColor', function () {
			describe('Case 1: Styled div with span should not break structure', function () {
				it('Should change text color but preserve HTML structure (TDD test - currently FAILS)', function () {
					const editor = getJodit({
						colorPickerDefaultTab: 'text' // Force text color tab by default
					});

					// Set up the problematic HTML structure from the issue
					editor.value =
						'<div style="font-family: Arial, sans-serif; color: #333;"><span>Merci de planifier cette intervention dans les meilleurs délais</span></div>';

					const range = editor.s.createRange();
					const spanElement = editor.editor.querySelector('span');
					const textNode = spanElement.firstChild;

					// Select "intervention" text (position 25-37 in the text)
					range.setStart(textNode, 25);
					range.setEnd(textNode, 37);
					editor.s.selectRange(range);

					clickButton('brush', editor);
					const popup = getOpenedPopup(editor);

					expect(popup).is.not.null;

					// Click on red color to apply foreColor (text color)
					simulateEvent(
						'mousedown',
						popup.querySelector('[data-color="#FF0000"]')
					);

					const result = editor.value;

					// 1. BASIC FUNCTIONALITY: Text color should change (this should work)
					expect(result).to.include('color: rgb(255, 0, 0)'); // Must apply red color
					expect(result).to.include('intervention'); // Must preserve the text

					// 2. STRUCTURE PRESERVATION: Should NOT create multiple divs (this currently FAILS)
					expect(result).to.not.include('</div><div'); // Should not break structure

					// 3. EXPECTED BEHAVIOR: Should create nested span instead
					expect(result).to.include(
						'<span>Merci de planifier cette <span style="color: rgb(255, 0, 0);">intervention</span> dans les meilleurs délais</span>'
					);
				});
			});

			describe('Case 2: Simple div should work correctly', function () {
				it('Should work correctly with simple div structure', function () {
					const editor = getJodit({
						colorPickerDefaultTab: 'text' // Force text color tab by default
					});

					// Set up the working HTML structure from the issue
					editor.value = '<div><span>Same text here</span></div>';

					const range = editor.s.createRange();
					const spanElement = editor.editor.querySelector('span');
					const textNode = spanElement.firstChild;

					// Select "text" word
					range.setStart(textNode, 5);
					range.setEnd(textNode, 9);
					editor.s.selectRange(range);

					clickButton('brush', editor);
					const popup = getOpenedPopup(editor);

					expect(popup).is.not.null;

					// Apply red color
					simulateEvent(
						'mousedown',
						popup.querySelector('[data-color="#FF0000"]')
					);

					const result = editor.value;

					// This should work correctly (as mentioned in the issue)
					expect(result).to.include(
						'<div><span>Same <span style="color:'
					); // Should create nested span
					expect(result).to.include('text'); // Should preserve the text
					expect(result).to.include('here</span></div>'); // Should preserve structure
				});
			});
		});
	}
);
