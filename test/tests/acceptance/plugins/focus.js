/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Focus test', () => {
	describe('Enable autofocus', () => {
		it('Should set focus inside editor after init', () => {
			const editor = getJodit({
				autofocus: true,
				observer: {
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
							observer: {
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
							observer: {
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
});
