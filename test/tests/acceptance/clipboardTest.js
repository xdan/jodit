/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Clipboard text', function() {
	describe('Paste HTML', function() {
		it('Should show paste html dialog', function() {
			const editor = getJodit({
				defaultActionOnPaste: Jodit.INSERT_AS_HTML
			});

			const pastedText = '<p>test</p>';

			const emulatePasteEvent = function(data) {
				data.clipboardData = {
					types: ['text/html'],
					getData: function() {
						return pastedText;
					}
				};
			};

			simulateEvent('paste', 0, editor.editor, emulatePasteEvent);

			expect(editor.value).equals('');

			const dialog = getOpenedDialog(editor);
			expect(dialog).is.not.null;
		});

		describe('Paste HTML from Twitter', function() {
			const
				pastedText = '<blockquote class="twitter-tweet"><p lang="ru" dir="ltr">Нет слов, конечно <a href="https://t.co/VEAi634acb">https://t.co/VEAi634acb</a></p>— Vasily Oblomov (@VS_Oblomov) <a href="https://twitter.com/VS_Oblomov/status/1279467342213324801?ref_src=twsrc%5Etfw">July 4, 2020</a></blockquote> <script async="" src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>',
				pastedHTML = '<meta charset=\'utf-8\'><span style="color: rgb(136, 153, 166); font-family: &quot;Helvetica Neue&quot;, sans-serif; font-size: 12px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: center; text-indent: 0px; text-transform: none; white-space: nowrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">&lt;blockquote class="twitter-tweet"&gt;&lt;p lang="ru" dir="ltr"&gt;Нет слов, конечно &lt;a href="https://t.co/VEAi634acb"&gt;https://t.co/VEAi634acb&lt;/a&gt;&lt;/p&gt;&amp;mdash; Vasily Oblomov (@VS_Oblomov) &lt;a href="https://twitter.com/VS_Oblomov/status/1279467342213324801?ref_src=twsrc%5Etfw"&gt;July 4, 2020&lt;/a&gt;&lt;/blockquote&gt; &lt;script async src="https://platform.twitter.com/widgets.js" charset="utf-8"&gt;&lt;/script&gt;</span>';

			const emulatePasteEvent = function(data) {
				data.clipboardData = {
					types: ["text/plain", "text/html"],
					getData: function(type) {
						return type === 'text/plain' ? pastedText : pastedHTML;
					}
				};
			};

			// it('Should paste as is', function() {
			// 	const editor = getJodit({
			// 		disablePlugins: ['WrapTextNodes']
			// 	});
			//
			// 	simulateEvent('paste', 0, editor.editor, emulatePasteEvent);
			//
			// 	expect(editor.value).equals('');
			//
			// 	const dialog = getOpenedDialog(editor);
			//
			// 	simulateEvent('click', dialog.querySelectorAll('button.jodit-ui-button')[1]);
			//
			// 	expect(sortAttributes(editor.value).replace(/<br>$/, '')).equals(pastedText);
			// });
		});

		describe('Prevent show dialog', function() {
			it('Should not show paste html dialog if beforeOpenPasteDialog returned false', function() {
				const editor = getJodit({
					events: {
						beforeOpenPasteDialog: function(
							msg,
							title,
							callback,
							clearButton,
							clear2Button
						) {
							return false;
						}
					}
				});

				const pastedText = '<p>test</p>';

				const emulatePasteEvent = function(data) {
					data.clipboardData = {
						types: ['text/html'],
						getData: function(type) {
							return pastedText;
						}
					};
				};

				simulateEvent('paste', 0, editor.editor, emulatePasteEvent);

				expect(editor.value).equals('');
				const dialog = getOpenedDialog(editor);
				expect(dialog).is.null;
			});

			describe('Change dialog in afterOpenPasteDialog', function() {
				it('Should change dialog', function() {
					const editor = getJodit({
						events: {
							afterOpenPasteDialog: function(
								dialog,
								msg,
								title,
								callback,
								clearButton,
								clear2Button
							) {
								dialog.container.style.left = '10px';
							}
						}
					});

					const pastedText = '<p>test</p>';

					const emulatePasteEvent = function(data) {
						data.clipboardData = {
							types: ['text/html'],
							getData: function(type) {
								return pastedText;
							}
						};
					};

					simulateEvent('paste', 0, editor.editor, emulatePasteEvent);

					expect(editor.value).equals('');

					const dialog = getOpenedDialog(editor);
					expect(dialog).is.not.null;
					expect(parseInt(dialog.style.left, 10)).equals(10);
				});
			});
		});
	});

	describe('Paste simple text', function() {
		it('Should not show paste html dialog', function() {
			const editor = getJodit({
				defaultActionOnPaste: Jodit.INSERT_AS_HTML
			});

			const pastedText = 'test';

			const emulatePasteEvent = function(data) {
				data.clipboardData = {
					types: ['text/html'],
					getData: function(type) {
						return pastedText;
					}
				};
			};

			simulateEvent('paste', 0, editor.editor, emulatePasteEvent);

			expect(editor.value).equals('<p>test</p>');

			const dialog = getOpenedDialog(editor);
			expect(dialog).is.null;
		});
	});

	describe('Paste', function() {
		describe('HTML text', function () {
			describe('Insert only text', function() {
				it('Should insert only text from pasted html', function() {
					const
						editor = getJodit({
							askBeforePasteHTML: false,
							askBeforePasteFromWord: false,
							defaultActionOnPaste: Jodit.INSERT_ONLY_TEXT
						}),

						pastedText = '<p>test</p>',

						emulatePasteEvent = function(data) {
							data.clipboardData = {
								types: ['text/html'],
								getData: function(type) {
									return pastedText;
								}
							};
						};

					simulateEvent('paste', 0, editor.editor, emulatePasteEvent);

					expect(editor.value).equals('<p>test</p>');
				});
			});

			describe('Insert as text', function() {
				it('Should insert only text from pasted html', function() {
					const editor = getJodit({
						askBeforePasteHTML: false,
						askBeforePasteFromWord: false,
						defaultActionOnPaste: Jodit.INSERT_AS_TEXT
					});
					const pastedText = '<p>test</p>';

					const emulatePasteEvent = function(data) {
						data.clipboardData = {
							types: ['text/html'],
							getData: function(type) {
								return pastedText;
							}
						};
					};

					simulateEvent('paste', 0, editor.editor, emulatePasteEvent);
					expect(editor.value).equals('<p>&lt;p&gt;test&lt;/p&gt;</p>');
				});
			});

			describe('Insert as html', function() {
				it('Should insert pasted html like html', function() {
					const editor = getJodit({
						askBeforePasteHTML: false,
						askBeforePasteFromWord: false,
						defaultActionOnPaste: Jodit.INSERT_AS_HTML
					});

					const pastedText = '<p>test</p>';

					const emulatePasteEvent = function(data) {
						data.clipboardData = {
							types: ['text/html'],
							getData: function(type) {
								return pastedText;
							}
						};
					};

					simulateEvent('paste', 0, editor.editor, emulatePasteEvent);
					expect(editor.value).equals('<p>test</p>');
				});
			});

			describe('Insert clear html', function() {
				it('Should insert pasted and cleared html', function() {
					const editor = getJodit({
						askBeforePasteHTML: false,
						askBeforePasteFromWord: false,
						defaultActionOnPaste: Jodit.INSERT_CLEAR_HTML
					});

					const pastedText = '<p style="color:red;" data-text="1">test</p>';

					const emulatePasteEvent = function(data) {
						data.clipboardData = {
							types: ['text/html'],
							getData: function(type) {
								return pastedText;
							}
						};
					};

					simulateEvent('paste', 0, editor.editor, emulatePasteEvent);
					expect(editor.value).equals('<p>test</p>');
				});
			});
		});

		describe('plain text', function () {
			it('Should Insert text with <br> instead of \\n', function() {
				const
					editor = getJodit(),
					pastedText = 'test\ntest\ntest\ntest\ntest\n',

					emulatePasteEvent = function(data) {
						data.clipboardData = {
							types: ['text/plain'],
							getData: function(type) {
								return pastedText;
							}
						};
					};

				simulateEvent('paste', 0, editor.editor, emulatePasteEvent);

				expect(editor.value).equals('<p>test<br>\ntest<br>\ntest<br>\ntest<br>\ntest<br>\n</p>');
			});
		});
	});

	describe('Cut and Copy', function() {
		describe('After cut or copy commands', function() {
			['copy', 'cut'].forEach(function (command) {
				describe('For ' + command + ' command. In Jodit.buffer', function() {
					it('should be selected text', () => {
						const editor = getJodit({
							toolbarAdaptive: false,
							observer: {
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

						editor.s.select(editor.editor.querySelector('strong'));
						simulateEvent(command, editor.editor);

						expect(editor.buffer.get('clipboard')).equals('<strong>bold</strong>');

						if (command === 'cut') {
							expect(editor.value).equals('<p>test</p>');
						}

					});
				});
			});
		});
	});
});
