/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */
('iframe' in window.skipTest ? describe.skip : describe)(
	'Iframe mode',
	function () {
		describe('Create editor with iframe mode', function () {
			it('Should create editable area in another document', function (done) {
				unmockPromise();

				getJodit({
					iframe: true,
					events: {
						afterConstructor: function (editor) {
							expect(editor.ownerDocument).does.not.equal(
								editor.ed
							);
							expect('true').equals(
								editor.ed.body.getAttribute('contenteditable')
							);
							done();
						}
					}
				});
			});

			describe('Set iframeSandbox', () => {
				it('Should set sandbox attribute to iframe', done => {
					unmockPromise();

					getJodit({
						iframe: true,
						iframeSandbox: 'allow-same-origin',
						events: {
							afterConstructor: function (editor) {
								expect(
									editor.iframe.getAttribute('sandbox')
								).equals('allow-same-origin');
								done();
							}
						}
					});
				});
			});

			describe('And exec command', function () {
				it('Should use body like editor area', function (done) {
					unmockPromise();
					getJodit({
						iframe: true,
						events: {
							afterConstructor: function (editor) {
								mockPromise();
								editor.value = 'test test stop';

								expect(editor.ed.body.innerHTML).equals(
									'<p>test test stop</p>'
								);

								const range = editor.s.createRange();
								range.selectNodeContents(editor.ed.body);
								editor.s.selectRange(range);

								editor.execCommand('bold');

								expect(editor.ed.body.innerHTML).equals(
									'<p><strong>test test stop</strong></p>'
								);

								done();
							}
						}
					});
				});
			});

			describe('Set value right after construct', function () {
				it('Should set/get value without some trouble', function () {
					const area = appendTestArea();

					area.value = 'stop';

					const editor = Jodit.make(area, {
						iframe: true
					});

					expect(editor.value).equals('<p>stop</p>');
					editor.value = 'test1';
					expect(editor.value).equals('<p>test1</p>');
				});
			});

			describe('Enable editHTMLDocumentMode', function () {
				describe('With DIV source element', function () {
					it('Should throw error', function () {
						const div = appendTestDiv();

						expect(function () {
							Jodit.make(div, {
								iframe: true,
								editHTMLDocumentMode: true
							});
						}).throws(TypeError);
					});
				});

				describe('With AREA source element', function () {
					const opt = {
						iframe: true,
						iframeTitle: 'Hi',
						disablePlugins: ['size'],
						height: 300,
						iframeStyle: '',
						iframeCSSLinks: [],
						editHTMLDocumentMode: true
					};

					it('Should work fine', function () {
						const area = appendTestArea();

						expect(function () {
							Jodit.make(area, opt);
						}).does.not.throws(TypeError);
					});

					describe('editor.value', function () {
						it('Should return entire HTML', function () {
							const editor = Jodit.make(appendTestArea(), opt);

							expect(
								sortAttributes(
									editor.value
										.replace(/[\t\n]/g, '')
										.replace(/<br>/g, '')
								)
							).equals(
								'<!DOCTYPE html><html lang="en">' +
									'<head><title>Hi</title></head>' +
									'<body spellcheck="false"></body>' +
									'</html>'
							);
						});

						describe('Set some part of HTML', function () {
							it('Should insert this part inside BODY', function () {
								const editor = Jodit.make(
									appendTestArea(),
									opt
								);
								editor.value = '<strong>Test</strong>';

								expect(
									sortAttributes(
										editor.value
											.replace(/[\t\n]/g, '')
											.replace(/<br>/g, '')
									)
								).equals(
									'<!DOCTYPE html><html lang="en">' +
										'<head><title>Hi</title></head>' +
										'<body spellcheck="false">' +
										'<p><strong>Test</strong></p></body></html>'
								);
							});
						});

						describe('Set entire HTML', function () {
							it('Should replace entire document', function () {
								const editor = Jodit.make(
									appendTestArea(),
									opt
								);
								editor.value =
									'<!DOCTYPE html><html lang="en"><head><title>Hi</title></head><body><strong>Test1</strong></body></html>';

								expect(
									sortAttributes(
										editor.value
											.replace(/[\t\n]/g, '')
											.replace(/ {2,}/g, ' ')
											.replace(/[\s]+>/g, '>')
									)
								).equals(
									'<!DOCTYPE html><html lang="en"><head><title>Hi</title></head><body spellcheck="false"><p><strong>Test1</strong></p></body></html>'
								);
							});
						});
					});
				});

				describe('Security', function () {
					const opt = {
						iframe: true,
						editHTMLDocumentMode: true,
						iframeStyle: '',
						iframeCSSLinks: []
					};

					beforeEach(function () {
						window.__joditXssProbe = false;
					});

					afterEach(function () {
						delete window.__joditXssProbe;
					});

					it('Should not execute inline scripts of a full document (GHSA-w3xv-x3fm-59ph)', async function () {
						const editor = Jodit.make(appendTestArea(), opt);

						editor.value =
							'<!DOCTYPE html><html><head><title>Attacker</title>' +
							'<script>parent.__joditXssProbe = true;</script></head>' +
							'<body><script>parent.__joditXssProbe = true;</script>' +
							'<p>Attacker-controlled document</p></body></html>';

						await delay(300);

						expect(window.__joditXssProbe).is.false;
						// the body script is dropped by `denyTags` afterwards
						expect(editor.editor.querySelector('script')).is.null;
						expect(editor.value).includes(
							'<p>Attacker-controlled document</p>'
						);
					});

					it('Should strip event handlers of a full document before it reaches the live iframe', async function () {
						const editor = Jodit.make(appendTestArea(), opt);

						editor.value =
							'<html><head></head><body onload="parent.__joditXssProbe = true">' +
							'<img src="/does-not-exist.png" onerror="parent.__joditXssProbe = true">' +
							'<svg onload="parent.__joditXssProbe = true"></svg>' +
							'<p>text</p></body></html>';

						await delay(300);

						expect(window.__joditXssProbe).is.false;
						expect(editor.value).does.not.include(
							'__joditXssProbe'
						);
						expect(editor.value).includes('<p>text</p>');
					});

					it('Should sanitize a partial value before it is assigned to the document body', async function () {
						const editor = Jodit.make(appendTestArea(), opt);

						editor.value =
							'<img src="/does-not-exist.png" onerror="parent.__joditXssProbe = true"><p>text</p>';

						await delay(300);

						expect(window.__joditXssProbe).is.false;
						expect(editor.value).does.not.include('onerror');
						expect(editor.value).includes('<p>text</p>');
					});

					it('Should keep the document attributes and content', function () {
						const editor = Jodit.make(appendTestArea(), opt);

						editor.value =
							'<!DOCTYPE html><html lang="de" dir="rtl"><head><title>Doc</title></head>' +
							'<body><h1>Title</h1><p>Body</p></body></html>';

						const doc = editor.iframe.contentWindow.document;
						expect(doc.documentElement.getAttribute('lang')).equals(
							'de'
						);
						expect(doc.documentElement.getAttribute('dir')).equals(
							'rtl'
						);
						expect(doc.title).equals('Doc');
						expect(editor.editor).equals(doc.body);
						expect(
							editor.editor.querySelector('h1').textContent
						).equals('Title');
						expect(editor.value).includes(
							'<h1>Title</h1><p>Body</p>'
						);
					});
				});

				describe('Change event', function () {
					it('should work like in usual case', function () {
						const editor = getJodit({
							editHTMLDocumentMode: true,
							iframe: true,
							iframeStyle: '',
							iframeCSSLinks: Jodit.atom([])
						});
						editor.value = 'Some text';

						let changeCounter = 0;
						const onChange = function () {
							changeCounter += 1;
						};

						editor.e.on('change', onChange);
						editor.value = 'Some text2';
						expect(changeCounter).equals(1);
					});

					describe('Change mode', function () {
						it('should work like in usual case', function () {
							const editor = getJodit({
								editHTMLDocumentMode: true,
								sourceEdiotor: 'area',
								iframe: true,
								iframeStyle: '',
								iframeCSSLinks: Jodit.atom([])
							});
							editor.value = '<p>Some text|</p>';
							setCursorToChar(editor);

							let changeCounter = 0;
							const onChange = function () {
								changeCounter += 1;
							};

							editor.e.on('change', onChange);
							editor.s.insertHTML('Some text1');
							editor.s.insertHTML('Some text2');

							expect(changeCounter).equals(2);

							editor.toggleMode();
							expect(changeCounter).equals(3);

							editor.__plugins.source.sourceEditor.instance.value =
								'Some text3';
							editor.e.fire(
								'change',
								editor.__plugins.source.sourceEditor.instance
							);
							expect(changeCounter).equals(4);

							editor.toggleMode();
							editor.editor.appendChild(
								editor.createInside.text('x')
							);
							editor.synchronizeValues();
							simulateEvent('keydown', 'x', editor.editor);

							expect(changeCounter).above(4);
						});
					});
				});
			});
		});

		describe('Define document for iframe from some site', function () {
			it('Should work perfect', function (done) {
				unmockPromise();

				const area = appendTestArea();

				area.value = '<p>start value</p>';

				Jodit.make(area, {
					iframe: true,
					events: {
						afterConstructor: function (jodit) {
							expect(
								jodit.editor.getAttribute('secret-attribute')
							).equals('435'); // loaded from index.html
							expect(Jodit.ns.Helpers.trim(jodit.value)).equals(
								'<p>test 435</p>'
							); // loaded from index.html

							done();
						},
						beforeSetValueToEditor: function () {
							return false;
						},
						['generateDocumentStructure.iframe']: function (
							doc,
							jodit
						) {
							jodit.events.stopPropagation(
								'generateDocumentStructure.iframe'
							);

							return new Promise(resolve => {
								jodit.iframe.onload = function () {
									resolve();
								};

								jodit.async.setTimeout(function () {
									resolve();
								}, 4000);

								jodit.iframe.src = 'test.index.html';
							});
						}
					}
				});
			}).timeout(5000);
		});
	}
);

describe('Editor inside iframe', function () {
	describe('In creator doc field', function () {
		it('Should be iframe.contentDocument', function () {
			const iframe = document.createElement('iframe');
			iframe.style.width = '900px';
			getBox().appendChild(iframe);

			const win = iframe.contentWindow;
			const doc = win.document;
			doc.open();
			doc.write(
				'<html lang="en"><body><textarea id="editor"></textarea></body></html>'
			);
			doc.close();

			const editor = Jodit.make('#editor', {
				ownerWindow: win,
				ownerDocument: doc
			});

			expect(editor.create.doc).does.not.equal(document);
			expect(editor.create.doc).equals(doc);
			expect(editor.createInside.doc).equals(doc);

			editor.destruct();
			Jodit.modules.Dom.safeRemove(iframe);
		});
	});
});
