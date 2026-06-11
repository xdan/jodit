/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

// eslint

describe('Clipboard text', function () {
	describe('Copy a selection inside a formatted text node (#1202)', function () {
		['copy', 'cut'].forEach(function (command) {
			it(
				'Should keep the inline formatting context on ' + command,
				() => {
					const editor = getJodit({
						history: { timeout: 0 }
					});

					editor.value =
						'<p>plain <strong><em>bolditalic</em></strong> tail</p>';

					// select "oldita" — entirely inside the text node of <em>
					const textNode =
						editor.editor.querySelector('em').firstChild;
					const range = editor.s.createRange();
					range.setStart(textNode, 1);
					range.setEnd(textNode, 7);
					editor.s.selectRange(range);

					simulateEvent(command, editor.editor);

					expect(editor.buffer.get('clipboard')).equals(
						'<strong><em>oldita</em></strong>'
					);
				}
			);
		});

		it('Should not add extra wrappers when the selection spans blocks', () => {
			const editor = getJodit({
				history: { timeout: 0 }
			});

			editor.value = '<p>one</p><p>two</p>';

			const range = editor.s.createRange();
			range.setStart(editor.editor.firstChild.firstChild, 0);
			range.setEnd(editor.editor.lastChild.firstChild, 3);
			editor.s.selectRange(range);

			simulateEvent('copy', editor.editor);

			expect(editor.buffer.get('clipboard')).equals(
				'<p>one</p><p>two</p>'
			);
		});
	});

	describe('Cut and Copy', function () {
		describe('After cut or copy commands', function () {
			['copy', 'cut'].forEach(function (command) {
				describe(
					'For ' + command + ' command. In Jodit.buffer',
					function () {
						it('should be selected text', () => {
							const editor = getJodit({
								toolbarAdaptive: false,
								history: {
									timeout: 0
								}
							});

							const html = '<p>test<strong>bold</strong></p>';

							editor.value = html;

							editor.s.focus();
							editor.execCommand('selectall');
							simulateEvent(command, editor.editor);

							expect(editor.buffer.get('clipboard')).equals(html);

							editor.value = html;
							editor.s.focus();

							editor.s.select(
								editor.editor.querySelector('strong')
							);
							simulateEvent(command, editor.editor);

							expect(editor.buffer.get('clipboard')).equals(
								'<strong>bold</strong>'
							);

							if (command === 'cut') {
								expect(editor.value).equals('<p>test</p>');
							}
						});
					}
				);
			});
		});
	});
});
