/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
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

	describe('Multiple editors in source mode', () => {
		it('Should not cause focus competition when switching between editors', () => {
			const editor1 = getJodit({
				defaultMode: Jodit.MODE_SOURCE,
				history: { defaultTimeout: 0 }
			});
			const editor2 = getJodit({
				defaultMode: Jodit.MODE_SOURCE,
				history: { defaultTimeout: 0 }
			});

			const mirror1 = editor1.container.querySelector(
				'textarea.jodit-source__mirror'
			);
			const mirror2 = editor2.container.querySelector(
				'textarea.jodit-source__mirror'
			);

			expect(mirror1).is.not.null;
			expect(mirror2).is.not.null;

			// Focus editor 1
			simulateEvent('focus', mirror1);
			expect(editor1.editorIsActive).is.true;

			// Focus editor 2 (should blur editor 1)
			simulateEvent('blur', mirror1);
			simulateEvent('focus', mirror2);

			expect(editor2.editorIsActive).is.true;
			expect(editor1.editorIsActive).is.false;
		});

		it('Should not call s.restore() when in source mode on focus', () => {
			const editor = getJodit({
				history: { defaultTimeout: 0 }
			});

			// Set some content and save selection in WYSIWYG mode
			editor.value = '<p>test</p>';
			editor.s.setCursorIn(editor.editor.firstChild);

			// Switch to source mode
			editor.setMode(Jodit.MODE_SOURCE);

			// Manually insert markers into WYSIWYG area to simulate leftover state
			const marker = editor.c.element('span', {
				'data-jodit-selection_marker': 'start',
				'data-jodit-temp': 'true',
				style: 'display:none;line-height:0'
			});
			editor.editor.appendChild(marker);

			expect(
				editor.editor.querySelectorAll(
					'span[data-jodit-selection_marker]'
				).length
			).eq(1);

			const mirror = editor.container.querySelector(
				'textarea.jodit-source__mirror'
			);

			// Focus the source textarea
			simulateEvent('focus', mirror);

			// Markers should still be in DOM (restore() was not called)
			expect(
				editor.editor.querySelectorAll(
					'span[data-jodit-selection_marker]'
				).length
			).eq(1);
		});
	});
});
