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
					getData: function(type) {
						return pastedText;
					}
				};
			};

			simulateEvent('paste', 0, editor.editor, emulatePasteEvent);

			expect(editor.value).equals('');

			const dialog = getOpenedDialog(editor);
			expect(dialog).is.not.null;
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
					expect(editor.value).equals('<p>test</p><p><br></p>');
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
					expect(editor.value).equals('<p>test</p><p><br></p>');
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
						simulateEvent(command, 0, editor.editor, function (p){});

						expect(editor.buffer.get('clipboard')).equals(html);

						editor.value = html;
						editor.s.focus();

						editor.s.select(editor.editor.querySelector('strong'));
						simulateEvent(command, 0, editor.editor, function (p){});

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
