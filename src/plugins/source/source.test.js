/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Source code test', function () {
	describe('Init', function () {
		it('After init container must has source editor container', function (done) {
			unmockPromise();

			let isDone = false;
			const timeout = /*ok*/ setTimeout(() => {
				done(new Error('Timeout error'));
			}, 3000);

			getJodit(
				{
					defaultMode: Jodit.MODE_SOURCE,
					sourceEditor: 'ace',
					events: {
						beforeDestruct: function () {
							return false;
						},
						sourceEditorReady: function (editor) {
							try {
								expect(
									editor.container.querySelectorAll(
										'.jodit-source__mirror-fake'
									).length
								).equals(1);
								done();
							} catch (e) {
								done(e);
							} finally {
								clearTimeout(timeout);
							}
						}
					}
				}
				// area
			);
		}).timeout(6000);

		describe('Set value in source mode', function () {
			it('Should set value in editor and in source', function (done) {
				unmockPromise();

				const timeout = /*ok*/ setTimeout(function () {
					done(new Error('Timeout error'));
				}, 5000);

				const editor = getJodit({
					defaultMode: Jodit.MODE_SOURCE,
					sourceEditor: 'ace',
					events: {
						beforeDestruct: function () {
							return false;
						},
						sourceEditorReady: function (editor) {
							editor.async.setTimeout(() => {
								try {
									expect(
										editor.__plugins.source.sourceEditor.getValue()
									).equals('<p>pop</p>');
									editor.value = '<p>test</p>';
									expect(
										editor.__plugins.source.sourceEditor.getValue()
									).equals('<p>test</p>');
									done();
								} catch (e) {
									done(e);
								} finally {
									clearTimeout(timeout);
								}
							}, 300);
						}
					}
				});

				editor.value = '<p>pop</p>';
			}).timeout(6000);
		});

		describe('Split mode', function () {
			it('Should shoe source and wysiwyg in same time', function () {
				const editor = getJodit({
					defaultMode: Jodit.MODE_SPLIT,
					sourceEditor: 'area'
				});

				expect(
					editor.ew.getComputedStyle(editor.editor).display
				).equals('block');
				expect(
					editor.ew.getComputedStyle(
						editor.container.querySelector('.jodit-source')
					).display
				).equals('block');
			}).timeout(6000);
		});
	});

	describe('Change mode', function () {
		describe('Several times', function () {
			it('Should restore collapsed selection when user change mode - from WYSIWYG to TEXTAREA', function () {
				const editor = getJodit();

				editor.value = '<p>te|st</p>';

				setCursorToChar(editor);

				editor.setMode(Jodit.MODE_SOURCE);

				const mirror = editor.container.querySelector(
					'textarea.jodit-source__mirror'
				);

				expect(mirror.value).equals('<p>test</p>');
				expect(mirror.selectionStart).equals(5);
				expect(mirror.selectionEnd).equals(5);
			});

			it('Should restore collapsed selection when user change mode - from WYSIWYG to TEXTAREA for long string', function (done) {
				unmockPromise();

				const timeout = /*ok*/ setTimeout(function () {
					done(new Error('Timeout error'));
				}, 140100);

				getJodit({
					defaultMode: Jodit.MODE_SOURCE,
					sourceEditor: 'ace',
					beautifyHTML: false,
					events: {
						sourceEditorReady: function (jodit) {
							try {
								jodit.setMode(Jodit.MODE_WYSIWYG);
								jodit.setEditorValue(
									(
										'<p>' +
										'test '.repeat(50) +
										'</p>'
									).repeat(1)
								);

								const sel = jodit.ew.getSelection(),
									range = jodit.ed.createRange();

								range.selectNodeContents(
									jodit.editor.querySelector('p')
								);

								range.collapse(false);
								sel.removeAllRanges();
								sel.addRange(range);

								jodit.s.insertHTML('hello');

								jodit.setMode(Jodit.MODE_SOURCE);

								const ace =
									jodit.__plugins.source.sourceEditor
										.instance;

								expect(ace).not.null;

								expect(
									ace.getSelectionRange().start.column
								).equals(258);

								expect(
									ace.getSelectionRange().start.row
								).equals(0);

								ace.session.insert(
									ace.getCursorPosition(),
									' world'
								);

								expect(
									jodit.__plugins.source.sourceEditor.getValue()
								).equals(
									'<p>' +
										'test '.repeat(49) +
										'test hello world</p>'
								);

								done();
							} catch (e) {
								done(e);
							} finally {
								mockPromise();
								clearTimeout(timeout);
							}
						}
					}
				});
			}).timeout(116000);

			describe('from TEXTAREA to WYSIWYG', () => {
				describe('Collapsed', () => {
					it('Should restore collapsed selection when user change mode - from TEXTAREA to WYSIWYG', function () {
						const editor = getJodit({
							useAceEditor: false,
							defaultMode: Jodit.MODE_SOURCE
						});
						editor.value = '<p>test</p>';

						const mirror = editor.container.querySelector(
							'textarea.jodit-source__mirror'
						);
						mirror.setSelectionRange(5, 5);

						editor.setMode(Jodit.MODE_WYSIWYG);
						editor.s.insertNode(editor.createInside.text(' a '));

						expect(editor.value).equals('<p>te a st</p>');
					});
				});

				describe('Not collapsed', () => {
					it('Should restore selection when user change mode - from TEXTAREA to WYSIWYG', function () {
						const editor = getJodit({
							useAceEditor: false,
							defaultMode: Jodit.MODE_SOURCE
						});
						editor.value = '<p>test<strong>start</strong>post</p>';

						const mirror = editor.container.querySelector(
							'textarea.jodit-source__mirror'
						);
						mirror.setSelectionRange(29, 33);

						editor.setMode(Jodit.MODE_WYSIWYG);
						replaceCursorToChar(editor);

						expect(editor.value).equals(
							'<p>test<strong>start</strong>|post|</p>'
						);
					});

					describe('Wrong selection', () => {
						it('Should move range in normal place', function () {
							const editor = getJodit({
								useAceEditor: false,
								defaultMode: Jodit.MODE_SOURCE
							});

							editor.value =
								'<p>test<strong>start</strong>post</p>';

							const mirror = editor.container.querySelector(
								'textarea.jodit-source__mirror'
							);
							mirror.setSelectionRange(24, 33);

							editor.setMode(Jodit.MODE_WYSIWYG);
							replaceCursorToChar(editor);

							expect(editor.value).equals(
								'<p>test<strong>start|</strong>post|</p>'
							);
						});
					});
				});

				describe('Inside SCRIPT/STYLE/IFRAME', () => {
					describe('Script', () => {
						it('Should restore selection before these tag', function () {
							const editor = getJodit({
								useAceEditor: false,
								defaultMode: Jodit.MODE_SOURCE
							});
							editor.value =
								'<p>test</p><script>alert(1)</script>';

							const mirror = editor.container.querySelector(
								'textarea.jodit-source__mirror'
							);
							mirror.setSelectionRange(25, 25);

							editor.setMode(Jodit.MODE_WYSIWYG);
							editor.s.insertNode(
								editor.createInside.text(' a ')
							);

							expect(editor.value).equals(
								'<p>test a </p><script>alert(1)</script>'
							);
						});
					});

					describe('Style', () => {
						it('Should restore selection before these tag', function () {
							const editor = getJodit({
								useAceEditor: false,
								defaultMode: Jodit.MODE_SOURCE
							});
							editor.value =
								'<p>test</p><style>body {color: red}</style>';

							const mirror = editor.container.querySelector(
								'textarea.jodit-source__mirror'
							);
							mirror.setSelectionRange(25, 25);

							editor.setMode(Jodit.MODE_WYSIWYG);
							editor.s.insertNode(
								editor.createInside.text(' a ')
							);

							expect(editor.value).equals(
								'<p>test a </p><style>body {color: red}</style>'
							);
						});
					});

					describe('Iframe', () => {
						it('Should restore selection before these tag', function () {
							const editor = getJodit({
								useAceEditor: false,
								defaultMode: Jodit.MODE_SOURCE
							});
							editor.value =
								'<p>test</p><iframe>body {color: red}</iframe>';

							const mirror = editor.container.querySelector(
								'textarea.jodit-source__mirror'
							);
							mirror.setSelectionRange(25, 25);

							editor.setMode(Jodit.MODE_WYSIWYG);
							editor.s.insertNode(
								editor.createInside.text(' a ')
							);

							expect(editor.value).equals(
								'<p>test a </p><iframe>body {color: red}</iframe>'
							);
						});
					});
				});
			});

			it('Should restore non collapsed selection when user change mode - from WYSIWYG to TEXTAREA', function () {
				const editor = getJodit({
					useAceEditor: false
				});
				editor.value = '<p>t|es|t</p>';
				setCursorToChar(editor);
				editor.setMode(Jodit.MODE_SOURCE);

				const mirror = editor.container.querySelector(
					'textarea.jodit-source__mirror'
				);

				expect(mirror.value).equals('<p>test</p>');
				expect(mirror.selectionStart).equals(4);
				expect(mirror.selectionEnd).equals(6);
			});

			describe('Problem', function () {
				it('Should restore non collapsed selection when user change mode - from TEXTAREA to WYSIWYG', function () {
					const editor = getJodit({
						useAceEditor: false,
						defaultMode: Jodit.MODE_SOURCE
					});
					editor.s.focus();
					editor.value = '<p>test</p>';

					const mirror = editor.container.querySelector(
						'textarea.jodit-source__mirror'
					);
					mirror.setSelectionRange(2, 8);

					editor.setMode(Jodit.MODE_WYSIWYG);

					expect(editor.s.isCollapsed()).is.false;

					editor.s.insertNode(editor.createInside.text(' a '));
					expect(editor.value).equals('<p> a </p>');
				});
			});

			it('Should restore collapsed selection inside empty element - from TEXTAREA to WYSIWYG', function () {
				const editor = getJodit({
					useAceEditor: false,
					defaultMode: Jodit.MODE_SOURCE
				});
				editor.value = '<p><a>11</a></p>';

				const mirror = editor.container.querySelector(
					'textarea.jodit-source__mirror'
				);
				mirror.setSelectionRange(7, 7);

				editor.setMode(Jodit.MODE_WYSIWYG);
				expect(editor.s.isCollapsed()).is.true;
				editor.s.insertNode(editor.createInside.text(' a '));
				expect(editor.value).equals('<p><a>1 a 1</a></p>');
			});
		});

		describe('In WYSIWYG mode isEditorMode', function () {
			it('Should return true', function () {
				const editor = getJodit();
				expect(editor.isEditorMode()).is.true;
				editor.toggleMode();
				expect(editor.isEditorMode()).is.false;
			});
		});

		it('Should not fire Change event', function () {
			const editor = getJodit({
				useAceEditor: false // because onChange can be fired after aceInited
			});

			const defaultValue = '<p>test</p>';
			let count = 0;

			editor.value = defaultValue;

			editor.events.on('change', function (value, oldvalue) {
				expect(oldvalue).does.not.equal(value);
				expect(defaultValue).does.not.equal(value);
				count++;
			});

			editor.s.setCursorAfter(editor.editor.firstChild.firstChild);
			editor.setMode(Jodit.MODE_SOURCE);
			editor.setMode(Jodit.MODE_WYSIWYG);
			editor.value = defaultValue;
			editor.value = '<p>another</p>';

			expect(1).equals(count);
		});

		describe('After change mode to source mode and use insertHTML method', function () {
			it('Should insert text on caret position', function (done) {
				unmockPromise();

				getJodit({
					sourceEditor: 'ace',
					beautifyHTML: false,
					events: {
						sourceEditorReady: function (jodit) {
							try {
								jodit.s.focus();
								jodit.value =
									'<p>test <span>test|</span> test</p>';
								setCursorToChar(jodit);
								jodit.setMode(Jodit.MODE_SOURCE);

								jodit.s.insertHTML('loop');

								expect(jodit.value).equals(
									'<p>test <span>testloop</span> test</p>'
								);
								mockPromise();

								done();
							} catch (e) {
								done(e);
							}
						}
					}
				});
			}).timeout(4000);

			describe('Without ace', function () {
				it('Should insert text on caret position', function () {
					const editor = getJodit({
						useAceEditor: false
					});

					editor.value = '<p>one <span>two</span> three</p>';
					const range = editor.s.createRange();
					range.selectNodeContents(
						editor.editor.querySelector('span')
					);
					range.collapse(false);
					editor.s.selectRange(range);

					editor.s.insertHTML('stop');
					expect(editor.value).equals(
						'<p>one <span>twostop</span> three</p>'
					);

					editor.setMode(Jodit.MODE_SOURCE);

					editor.s.insertHTML('loop');
					expect(editor.value).equals(
						'<p>one <span>twostoploop</span> three</p>'
					);
				});
			});
		});
	});
});
