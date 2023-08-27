/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test paste plugin', () => {
	describe('Paste HTML', function () {
		it('Should show paste html dialog', function () {
			const editor = getJodit({
				defaultActionOnPaste: Jodit.INSERT_AS_HTML
			});

			const pastedText = '<p>test</p>';

			const emulatePasteEvent = function (data) {
				data.clipboardData = {
					types: ['text/html'],
					getData: function () {
						return pastedText;
					}
				};
			};

			simulateEvent('paste', editor.editor, emulatePasteEvent);

			expect(editor.value).equals('');

			const dialog = getOpenedDialog(editor);
			expect(dialog).is.not.null;
		});

		describe('Two times', function () {
			const pastedText = '<p>test</p>';

			const emulatePasteEvent = data => {
				data.clipboardData = {
					types: ['text/html'],
					getData: () => {
						return pastedText;
					}
				};
			};

			describe('Enable memorizeChoiceWhenPasteFragment', () => {
				it('Should not show dialog again', function () {
					const editor = getJodit({
						memorizeChoiceWhenPasteFragment: true
					});

					simulateEvent('paste', editor.editor, emulatePasteEvent);

					expect(editor.value).equals('');

					const dialog = getOpenedDialog(editor);
					expect(dialog).is.not.null;

					clickButton('keep', dialog);

					simulateEvent('paste', editor.editor, emulatePasteEvent);

					expect(getOpenedDialog(editor)).is.null;
				});
			});

			describe('Disable memorizeChoiceWhenPasteFragment', () => {
				it('Should not show dialog again', function () {
					const editor = getJodit({
						memorizeChoiceWhenPasteFragment: false
					});

					simulateEvent('paste', editor.editor, emulatePasteEvent);

					expect(editor.value).equals('');

					const dialog = getOpenedDialog(editor);
					expect(dialog).is.not.null;

					clickButton('keep', dialog);

					simulateEvent('paste', editor.editor, emulatePasteEvent);

					const dialog2 = getOpenedDialog(editor);
					expect(dialog2).is.not.null;

					clickButton('keep', dialog2);

					expect(getOpenedDialog(editor)).is.null;
				});
			});

			it('Should fire afterPaste two times', function () {
				const editor = getJodit({
					defaultActionOnPaste: Jodit.INSERT_AS_HTML
				});

				let counter = 0;
				editor.e.on('afterPaste', function () {
					counter += 1;
				});

				const pastedText = '<p>test</p>';

				const emulatePasteEvent = function (data) {
					data.clipboardData = {
						types: ['text/html'],
						getData: function () {
							return pastedText;
						}
					};
				};

				simulateEvent('paste', editor.editor, emulatePasteEvent);
				const dialog = getOpenedDialog(editor);
				clickButton('keep', dialog);

				simulateEvent('paste', editor.editor, emulatePasteEvent);

				expect(counter).equals(2);
			});

			describe('In one pasting', function () {
				it('Should open only one dialog', () => {
					const editor = getJodit();

					simulateEvent('paste', editor.editor, emulatePasteEvent);
					simulateEvent('paste', editor.editor, emulatePasteEvent);

					const dialog = getOpenedDialog(editor);
					expect(dialog).is.not.null;

					clickButton('keep', dialog);

					expect(getOpenedDialog(editor)).is.null;
				});
			});
		});

		describe('Paste HTML from Twitter', function () {
			const pastedText =
					'<blockquote class="twitter-tweet"><p lang="ru" dir="ltr">Нет слов, конечно <a href="https://t.co/VEAi634acb">https://t.co/VEAi634acb</a></p>— Vasily Oblomov (@VS_Oblomov) <a href="https://twitter.com/VS_Oblomov/status/1279467342213324801?ref_src=twsrc%5Etfw">July 4, 2020</a></blockquote> <script async="" src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>',
				pastedHTML =
					'<meta charset=\'utf-8\'><span style="color: rgb(136, 153, 166); font-family: &quot;Helvetica Neue&quot;, sans-serif; font-size: 12px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: center; text-indent: 0px; text-transform: none; white-space: nowrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">&lt;blockquote class="twitter-tweet"&gt;&lt;p lang="ru" dir="ltr"&gt;Нет слов, конечно &lt;a href="https://t.co/VEAi634acb"&gt;https://t.co/VEAi634acb&lt;/a&gt;&lt;/p&gt;&amp;mdash; Vasily Oblomov (@VS_Oblomov) &lt;a href="https://twitter.com/VS_Oblomov/status/1279467342213324801?ref_src=twsrc%5Etfw"&gt;July 4, 2020&lt;/a&gt;&lt;/blockquote&gt; &lt;script async src="https://platform.twitter.com/widgets.js" charset="utf-8"&gt;&lt;/script&gt;</span>';

			// eslint-disable-next-line no-unused-vars
			const emulatePasteEvent = function (data) {
				data.clipboardData = {
					types: ['text/plain', 'text/html'],
					getData: function (type) {
						return type === 'text/plain' ? pastedText : pastedHTML;
					}
				};
			};
		});

		describe('Paste HTML from Word', function () {
			const pastedText =
					'LOREM IPSUM DOLOR SIT AMET\n' +
					'\n' +
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ___________________________________________________\n' +
					'"',
				pastedHTML = window.WORD_EXAMPLE;

			const emulatePasteEvent = function (data) {
				data.clipboardData = {
					types: ['text/plain', 'text/html'],
					getData: function (type) {
						return type === 'text/plain' ? pastedText : pastedHTML;
					}
				};
			};

			describe('Keep format', function () {
				it('Should paste as is', function () {
					const editor = getJodit({
						disablePlugins: ['WrapNodes']
					});

					simulateEvent('paste', editor.editor, emulatePasteEvent);

					expect(editor.value).equals('');

					const dialog = getOpenedDialog(editor);
					simulateEvent('click', getButton('keep', dialog));

					expect(sortAttributes(editor.value)).equals(
						'<h1 align="center" style="break-after:avoid;color:#2E74B5;font-family:Calibri Light,sans-serif;font-size:21px;font-weight:normal;line-height:normal;margin:0px;text-align:center"><span lang="EN-US" style="color:#C45911;font-family:Arial,sans-serif;font-size:16px">LOREM IPSUM DOLOR SIT AMET</span></h1>'
					);
				});
			});
		});

		describe('Prevent show dialog', function () {
			it('Should not show paste html dialog if beforeOpenPasteDialog returned false', function () {
				const editor = getJodit({
					events: {
						beforeOpenPasteDialog: function () // msg,
						// title,
						// callback,
						// clearButton,
						// clear2Button
						{
							return false;
						}
					}
				});

				const pastedText = '<p>test</p>';

				const emulatePasteEvent = function (data) {
					data.clipboardData = {
						types: ['text/html'],
						getData: function () {
							return pastedText;
						}
					};
				};

				simulateEvent('paste', 0, editor.editor, emulatePasteEvent);

				expect(editor.value).equals('');
				const dialog = getOpenedDialog(editor);
				expect(dialog).is.null;
			});

			describe('Change dialog in afterOpenPasteDialog', function () {
				it('Should change dialog', function () {
					const editor = getJodit({
						events: {
							afterOpenPasteDialog: function (
								dialog
								// msg,
								// title,
								// callback,
								// clearButton,
								// clear2Button
							) {
								dialog.container.style.left = '10px';
							}
						}
					});

					const pastedText = '<p>test</p>';

					const emulatePasteEvent = function (data) {
						data.clipboardData = {
							types: ['text/html'],
							getData: function () {
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

	describe('Paste simple text', function () {
		it('Should not show paste html dialog', function () {
			const editor = getJodit({
				defaultActionOnPaste: Jodit.INSERT_AS_HTML
			});

			const pastedText = 'test';

			const emulatePasteEvent = function (data) {
				data.clipboardData = {
					types: ['text/html'],
					getData: function () {
						return pastedText;
					}
				};
			};

			simulateEvent('paste', editor.editor, emulatePasteEvent);

			expect(editor.value).equals('<p>test</p>');

			const dialog = getOpenedDialog(editor);
			expect(dialog).is.null;
		});

		describe('nl2brInPlainText enable', function () {
			describe('Enable', function () {
				it('Should replace \n to BR element', function () {
					const editor = getJodit({
						nl2brInPlainText: true
					});

					const pastedText = 'test\ntest\ntest';

					simulateEvent('paste', editor.editor, function (data) {
						data.clipboardData = {
							types: ['text/plain'],
							getData: function () {
								return pastedText;
							}
						};
					});

					expect(editor.value).equals('<p>test<br>test<br>test</p>');
				});
			});

			describe('Disable', function () {
				it('Should not replace all \n to <BR>', function () {
					const editor = getJodit({
						nl2brInPlainText: false
					});

					const pastedText = 'test\ntest\ntest';

					simulateEvent('paste', editor.editor, function (data) {
						data.clipboardData = {
							types: ['text/plain'],
							getData: function () {
								return pastedText;
							}
						};
					});

					expect(editor.value).equals('<p>test\ntest\ntest</p>');
				});
			});
		});
	});

	describe('Paste', function () {
		describe('HTML text', function () {
			describe('Insert only text', function () {
				it('Should insert only text from pasted html', function () {
					const editor = getJodit({
							askBeforePasteHTML: false,
							askBeforePasteFromWord: false,
							defaultActionOnPaste: Jodit.INSERT_ONLY_TEXT
						}),
						pastedText = '<p>test</p>',
						emulatePasteEvent = function (data) {
							data.clipboardData = {
								types: ['text/html'],
								getData: function () {
									return pastedText;
								}
							};
						};

					simulateEvent('paste', editor.editor, emulatePasteEvent);

					expect(editor.value).equals('<p>test</p>');
				});

				describe('For not empty editor', function () {
					it('Should insert text on the cursor place', function () {
						// https://github.com/xdan/jodit/issues/522
						const editor = getJodit({
								askBeforePasteHTML: false,
								askBeforePasteFromWord: false,
								defaultActionOnPaste: Jodit.INSERT_ONLY_TEXT
							}),
							pastedText = '<strong>editor</strong>',
							emulatePasteEvent = function (data) {
								data.clipboardData = {
									types: ['text/html'],
									getData: function () {
										return pastedText;
									}
								};
							};

						editor.value = '<p>Jodit is awesome |</p>';

						setCursorToChar(editor);
						simulateEvent(
							'paste',
							editor.editor,
							emulatePasteEvent
						);
						replaceCursorToChar(editor);

						expect(editor.value).equals(
							'<p>Jodit is awesome editor|</p>'
						);
					});
				});
			});

			describe('Insert as text', function () {
				it('Should insert only text from pasted html', function () {
					const editor = getJodit({
						askBeforePasteHTML: false,
						askBeforePasteFromWord: false,
						defaultActionOnPaste: Jodit.INSERT_AS_TEXT
					});
					const pastedText = '<p>test</p>';

					const emulatePasteEvent = function (data) {
						data.clipboardData = {
							types: ['text/html'],
							getData: function () {
								return pastedText;
							}
						};
					};

					simulateEvent('paste', 0, editor.editor, emulatePasteEvent);
					expect(editor.value).equals(
						'<p>&lt;p&gt;test&lt;/p&gt;</p>'
					);
				});
			});

			describe('Insert as html', function () {
				it('Should insert pasted html like html', function () {
					const editor = getJodit({
						askBeforePasteHTML: false,
						askBeforePasteFromWord: false,
						defaultActionOnPaste: Jodit.INSERT_AS_HTML
					});

					const pastedText = '<p>test</p>';

					const emulatePasteEvent = function (data) {
						data.clipboardData = {
							types: ['text/html'],
							getData: function () {
								return pastedText;
							}
						};
					};

					simulateEvent('paste', 0, editor.editor, emulatePasteEvent);
					expect(editor.value).equals('<p>test</p>');
				});
			});

			describe('Insert clear html', function () {
				it('Should insert pasted and cleared html', function () {
					const editor = getJodit({
						askBeforePasteHTML: false,
						askBeforePasteFromWord: false,
						defaultActionOnPaste: Jodit.INSERT_CLEAR_HTML
					});

					const pastedText =
						'<p style="color:red;" data-text="1">test</p>';

					const emulatePasteEvent = function (data) {
						data.clipboardData = {
							types: ['text/html'],
							getData: function () {
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
			it('`Should Insert text with <br> instead of \\n', function () {
				const editor = getJodit(),
					pastedText = 'test\r\ntest\ntest\ntest\ntest\n',
					emulatePasteEvent = function (data) {
						data.clipboardData = {
							types: ['text/plain'],
							getData: function () {
								return pastedText;
							}
						};
					};

				simulateEvent('paste', editor.editor, emulatePasteEvent);

				expect(editor.value).equals(
					'<p>test<br>test<br>test<br>test<br>test<br><br></p>'
				);
			});
		});

		describe('Scroll position', () => {
			it('should scroll editor to pasted content', () => {
				const editor = getJodit({
					defaultActionOnPaste: Jodit.INSERT_AS_HTML,
					height: 300
				});

				editor.value = '<p>test</p>\n'.repeat(20) + '<p>test|</p>';
				setCursorToChar(editor);

				const pastedText = '<p>pop</p>';

				const emulatePasteEvent = function (data) {
					data.clipboardData = {
						types: ['text/html'],
						getData: function () {
							return pastedText;
						}
					};
				};

				expect(editor.editor.scrollTop).eq(0);

				simulateEvent('paste', editor.editor, emulatePasteEvent);
				const dialog = getOpenedDialog(editor);
				clickButton('keep', dialog);

				replaceCursorToChar(editor);

				expect(editor.editor.scrollTop).above(500);
				expect(sortAttributes(editor.value)).eq(
					'<p>test</p>\n'.repeat(20) + '<p>test</p>' + '<p>pop|</p>'
				);
			});
		});
	});
});
