/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

// eslint

describe('Clipboard text', function () {
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
