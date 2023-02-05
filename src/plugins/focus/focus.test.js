/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Focus test', () => {
	describe('Enable autofocus', () => {
		it('Should set focus inside editor after init', () => {
			const editor = getJodit({
				autofocus: true,
				history: {
					defaultTimeout: 0
				}
			});

			expect(editor.ew.getSelection().getRangeAt(0).startContainer).eq(
				editor.editor
			);
		});

		describe('Cursor position', () => {
			describe('By default', () => {
				it('Should set cursor after content', () => {
					const area = appendTestArea();

					area.value = '<p>test <span>text</span></p>';

					const editor = getJodit(
						{
							autofocus: true,
							history: {
								defaultTimeout: 0
							}
						},
						area
					);

					editor.s.insertHTML('pop');

					expect(editor.value).eq('<p>test <span>textpop</span></p>');
				});
			});

			describe('In the start', () => {
				it('Should set cursor before content', () => {
					const area = appendTestArea();

					area.value = '<p>test <span>text</span></p>';

					const editor = getJodit(
						{
							autofocus: true,
							cursorAfterAutofocus: 'start',
							history: {
								defaultTimeout: 0
							}
						},
						area
					);

					editor.s.insertHTML('pop');

					expect(editor.value).eq('<p>poptest <span>text</span></p>');
				});
			});
		});
	});

	describe('Save cursor position after blur', () => {
		describe('Enable', () => {
			it('Should append special markers on selection range', () => {
				const editor = getJodit();
				editor.value = '<p>t|es|t</p>';
				setCursorToChar(editor);
				simulateEvent('blur', editor);

				expect(
					editor.editor.querySelectorAll(
						'span[data-jodit-selection_marker]'
					).length
				).eq(2);

				expect(
					sortAttributes(editor.getNativeEditorValue()).replace(
						/[0-9]+_[0-9]+/g,
						''
					)
				).eq(
					'<p>t' +
						'<span data-jodit-selection_marker="start" data-jodit-temp="true" id="jodit-selection_marker_" style="display:none;line-height:0"></span>' +
						'es' +
						'<span data-jodit-selection_marker="end" data-jodit-temp="true" id="jodit-selection_marker_" style="display:none;line-height:0"></span>' +
						't</p>'
				);
			});
		});

		describe('Disable', () => {
			it('Should not append special markers on selection range', () => {
				const editor = getJodit({
					saveSelectionOnBlur: false
				});
				editor.value = '<p>t|es|t</p>';
				setCursorToChar(editor);
				simulateEvent('blur', editor);

				expect(
					editor.editor.querySelectorAll(
						'span[data-jodit-selection_marker]'
					).length
				).eq(0);
			});
		});
	});
});
