/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Source code test', function () {
	// https://github.com/xdan/jodit/issues/1526
	describe('HTML beautifier loaded when the source view opens', function () {
		function openWithBeautifier(beautify) {
			unmockPromise();

			const editor = getJodit({
				sourceEditor: 'area',
				beautifyHTML: true,
				beautifyHTMLCDNUrlsJS: [
					`data:text/javascript,window.html_beautify=${encodeURIComponent(beautify)}`
				]
			});

			editor.value = '<p>Old text</p>';
			editor.setMode(Jodit.MODE_SOURCE);

			return editor;
		}

		async function beautifierLoaded() {
			while (typeof window.html_beautify !== 'function') {
				await delay(10);
			}

			await delay(10);
		}

		afterEach(() => {
			delete window.html_beautify;
		});

		it('should format the untouched source view as soon as it arrives', async function () {
			const editor = openWithBeautifier(
				"html => '<!-- formatted -->' + html"
			);

			await beautifierLoaded();

			expect(
				editor.container.querySelector('.jodit-source__mirror').value
			).equals('<!-- formatted --><p>Old text</p>');
		});

		it('should not replace what was typed into the source view before it arrived', async function () {
			const editor = openWithBeautifier('html => html');
			const mirror = editor.container.querySelector(
				'.jodit-source__mirror'
			);

			mirror.value = '<p>Typed before the beautifier arrived</p>';
			await beautifierLoaded();

			expect(mirror.value).equals(
				'<p>Typed before the beautifier arrived</p>'
			);
		});
	});

	describe('Lazy ACE', function () {
		// The textarea shown while ACE loads hands its text over: what was
		// typed there — synced or not, complete markup or not — is what ACE
		// shows, with the caret where it was
		it('should hand what was typed into the textarea over to ACE', function (done) {
			unmockPromise();

			const timeout = /*ok*/ setTimeout(() => {
				done(new Error('Timeout error'));
			}, 15000);

			let hadFocus = false;

			const editor = getJodit({
				sourceEditor: 'ace',
				beautifyHTML: false,
				events: {
					sourceEditorReady: function (jodit) {
						try {
							expect(
								jodit.container.querySelector(
									'.jodit-source__mirror-fake'
								)
							).is.not.null;
							expect(
								jodit.container.querySelector(
									'textarea.jodit-source__mirror'
								)
							).is.null;

							const ace = jodit.ow.ace.edit(
								jodit.container.querySelector(
									'.jodit-source__mirror-fake'
								)
							);
							expect(ace.getValue()).equals(
								'<p>Old text</p><p>Typed while loading <b'
							);
							expect(
								ace
									.getSession()
									.doc.positionToIndex(
										ace.getCursorPosition()
									)
							).equals(
								'<p>Old text</p><p>Typed while loading <b'
									.length
							);
							// Headless Firefox does not always give the
							// textarea focus in the first place, and ACE
							// reports its own focus a tick later
							/*ok*/ setTimeout(() => {
								try {
									// ACE's own `isFocused()` lags behind in
									// headless Firefox; the document knows
									if (hadFocus) {
										expect(
											jodit.container
												.querySelector(
													'.jodit-source__mirror-fake'
												)
												.contains(
													document.activeElement
												)
										).is.true;
									}
									done();
								} catch (e) {
									done(e);
								} finally {
									clearTimeout(timeout);
								}
							}, 100);
						} catch (e) {
							clearTimeout(timeout);
							done(e);
						}
					}
				}
			});

			editor.value = '<p>Old text</p>';
			editor.setMode(Jodit.MODE_SOURCE);

			const area = editor.container.querySelector(
				'textarea.jodit-source__mirror'
			);
			expect(area).is.not.null;

			area.focus();
			hadFocus = document.activeElement === area;
			area.value = '<p>Old text</p><p>Typed while loading <b';
			area.setSelectionRange(area.value.length, area.value.length);
			simulateEvent('input', area);
		}).timeout(20000);

		it('should not initialize ACE in WYSIWYG mode until the source view is opened', function (done) {
			unmockPromise();

			const timeout = /*ok*/ setTimeout(() => {
				done(new Error('Timeout error'));
			}, 15000);

			const editor = getJodit({
				sourceEditor: 'ace',
				events: {
					sourceEditorReady: function (jodit) {
						try {
							expect(
								jodit.container.querySelectorAll(
									'.jodit-source__mirror-fake'
								).length
							).equals(1);
							expect(jodit.getMode()).equals(Jodit.MODE_SOURCE);
							done();
						} catch (e) {
							done(e);
						} finally {
							clearTimeout(timeout);
						}
					}
				}
			});

			expect(
				editor.container.querySelectorAll('.jodit-source__mirror-fake')
					.length
			).equals(0);

			editor.setMode(Jodit.MODE_SOURCE);
		}).timeout(20000);
	});

	describe('Init', function () {
		it('After init container must has source editor container', function (done) {
			unmockPromise();

			let isDone = false;
			const timeout = /*ok*/ setTimeout(() => {
				done(new Error('Timeout error'));
			}, 15000);

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
		}).timeout(20000);

		describe('Set value in source mode', function () {
			it('Should set value in editor and in source', function (done) {
				unmockPromise();

				const timeout = /*ok*/ setTimeout(function () {
					done(new Error('Timeout error'));
				}, 15000);

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
			}).timeout(20000);
		});

		describe('Complex scripts in ACE (Thai, Arabic, Hebrew…)', function () {
			// https://xdsoft.net/jodit/pro/ tracker f6facc24: in old ACE
			// builds complex-script text was rendered misaligned and
			// selection/copy lost characters
			it('Should keep a Thai value lossless through the source mode round-trip', function (done) {
				unmockPromise();

				const THAI = 'การแจ้งเตือนรหัสผ่านหมดอายุ';

				const timeout = /*ok*/ setTimeout(function () {
					done(new Error('Timeout error'));
				}, 15000);

				const editor = getJodit({
					defaultMode: Jodit.MODE_SOURCE,
					sourceEditor: 'ace',
					beautifyHTML: false,
					events: {
						beforeDestruct: function () {
							return false;
						},
						sourceEditorReady: function (editor) {
							editor.async.setTimeout(() => {
								try {
									const ace =
										editor.__plugins.source.sourceEditor;

									// the model keeps every UTF-16 unit
									expect(ace.getValue()).equals(
										'<p>' + THAI + '</p>'
									);

									// select all inside ACE — the selection
									// must cover the full string, nothing lost
									ace.selectAll();
									expect(
										ace.getSelectionEnd() -
											ace.getSelectionStart()
									).equals(('<p>' + THAI + '</p>').length);

									// and the value survives switching back
									editor.setMode(Jodit.MODE_WYSIWYG);
									expect(editor.value).equals(
										'<p>' + THAI + '</p>'
									);

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

				editor.value = '<p>' + THAI + '</p>';
			}).timeout(20000);

			it('Should have the automatic bidi handler active (modern ACE)', function (done) {
				unmockPromise();

				const timeout = /*ok*/ setTimeout(function () {
					done(new Error('Timeout error'));
				}, 15000);

				getJodit({
					defaultMode: Jodit.MODE_SOURCE,
					sourceEditor: 'ace',
					events: {
						beforeDestruct: function () {
							return false;
						},
						sourceEditorReady: function (editor) {
							try {
								// ace.edit() returns the existing instance
								// attached to the element
								const instance = editor.ownerWindow.ace.edit(
									editor.container.querySelector(
										'.jodit-source__mirror-fake'
									)
								);

								// modern ACE processes RTL fragments
								// (Arabic, Hebrew…) per line out of the box —
								// the 1.4.x builds had no working bidi layer
								expect(Boolean(instance.session.$bidiHandler))
									.is.true;

								done();
							} catch (e) {
								done(e);
							} finally {
								clearTimeout(timeout);
							}
						}
					}
				});
			}).timeout(20000);

			// https://github.com/xdan/jodit/issues/1285
			it('Should forward extra native ACE options like fontSize', function (done) {
				unmockPromise();

				const timeout = /*ok*/ setTimeout(function () {
					done(new Error('Timeout error'));
				}, 15000);

				getJodit({
					defaultMode: Jodit.MODE_SOURCE,
					sourceEditor: 'ace',
					sourceEditorNativeOptions: {
						fontSize: '30px'
					},
					events: {
						beforeDestruct: function () {
							return false;
						},
						sourceEditorReady: function (editor) {
							try {
								const instance =
									editor.__plugins.source.sourceEditor
										.instance;

								expect(instance.getOption('fontSize')).equals(
									'30px'
								);

								done();
							} catch (e) {
								done(e);
							} finally {
								clearTimeout(timeout);
							}
						}
					}
				});
			}).timeout(20000);

			it('Should use a modern ACE build by default', function () {
				const m = Jodit.defaultOptions.sourceEditorCDNUrlsJS[0].match(
					/ace\/(\d+)\.(\d+)\.(\d+)\/ace\.js/
				);

				expect(m).is.not.null;
				// 1.43+ — older builds (1.4.x) break complex scripts/bidi
				expect(
					parseInt(m[1], 10) * 10000 + parseInt(m[2], 10)
				).is.above(10042);
			});
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
			}).timeout(20000);
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
						afterInit: function (jodit) {
							try {
								jodit.s.focus();
								jodit.value =
									'<p>test <span>test|</span> test</p>';

								jodit.e.on('sourceEditorReady', async () => {
									try {
										expect(jodit.value).equals(
											'<p>test <span>testloop</span> test</p>'
										);
										mockPromise();

										done();
									} catch (e) {
										done(e);
									}
								});
								setCursorToChar(jodit);
								jodit.setMode(Jodit.MODE_SOURCE);
								jodit.s.insertHTML('loop');
							} catch (e) {
								console.error(e);
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

		describe('Add <script> width cleanHTML: { allowTags: { script: true } }', () => {
			describe('And change mode', () => {
				it('Should not remove script tag', async () => {
					const editor = getJodit({
						cleanHTML: {
							allowTags: {
								p: true,
								script: true
							}
						}
					});

					editor.value =
						'<p>some text<script type="text/javascript" id="cr-embed-c8ea384249b100dd506fab87" src="https://post.crowdriff.com/js/crowdriff.js" async></script></p>';

					await editor.async.requestIdlePromise();
					editor.setMode(Jodit.MODE_SOURCE);
					await editor.async.requestIdlePromise();
					expect(
						sortAttributes(editor.value).replace(/\n/g, '')
					).equals(
						'<p>some text<script async="" id="cr-embed-c8ea384249b100dd506fab87" src="https://post.crowdriff.com/js/crowdriff.js" type="text/javascript"></script></p>'
					);

					await editor.async.requestIdlePromise();
					editor.setMode(Jodit.MODE_WYSIWYG);
					await editor.async.requestIdlePromise();

					expect(
						sortAttributes(editor.value).replace(/\n/g, '')
					).equals(
						'<p>some text<script async="" id="cr-embed-c8ea384249b100dd506fab87" src="https://post.crowdriff.com/js/crowdriff.js" type="text/javascript"></script></p>'
					);
				});
			});
		});
	});
});
