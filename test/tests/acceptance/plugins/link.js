/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Link plugin', function () {
	describe('Insert link', function () {
		describe('Insert simple link', function () {
			it('Should insert as simple link', function () {
				const editor = getJodit();

				simulatePaste(
					editor.editor,
					'https://www.youtube.com',
					'text/plain'
				);

				expect(editor.value).equal(
					'<p><a href="https://www.youtube.com">https://www.youtube.com</a></p>'
				);
			});

			describe('Disable', function () {
				describe('Disable any convert', function () {
					it('Should not change source link', function () {
						const editor = getJodit({
							link: {
								processPastedLink: false
							}
						});

						simulatePaste(editor.editor, 'https://www.youtube.com');
						expect(editor.value).equal(
							'<p>https://www.youtube.com</p>'
						);
					});
				});
			});
		});

		describe('Insert youtube link', function () {
			[
				[
					'https://www.youtube.com/watch?v=Cy1qd16VDhM&ab_channel=КонстантинСёмин',
					'https://www.youtube.com/embed/Cy1qd16VDhM'
				],
				[
					'https://www.youtube.com/watch?v=8Qn_spdM5Zg',
					'https://www.youtube.com/embed/8Qn_spdM5Zg'
				]
			].forEach(function (lnk) {
				describe('Insert link ' + lnk[0], function () {
					it(
						'Should insert iframe with video ' + lnk[1],
						function () {
							const editor = getJodit();

							simulatePaste(editor.editor, lnk[0]);

							expect(sortAttributes(editor.value)).equal(
								sortAttributes(
									'<iframe width="400" height="345" src="' +
										lnk[1] +
										'" frameborder="0" allowfullscreen=""></iframe>'
								)
							);
						}
					);
				});
			});

			describe('Disable', function () {
				describe('Disable any convert', function () {
					it('Should not change source link', function () {
						const editor = getJodit({
							link: {
								processPastedLink: false,
								processVideoLink: false
							}
						});

						simulatePaste(
							editor.editor,
							'https://www.youtube.com/watch?v=8Qn_spdM5Zg'
						);
						expect(editor.value).equal(
							'<p>https://www.youtube.com/watch?v=8Qn_spdM5Zg</p>'
						);
					});
				});

				describe('Disable video convert', function () {
					it('Should insert video link as simple link', function () {
						const editor = getJodit({
							link: {
								processVideoLink: false
							}
						});

						simulatePaste(
							editor.editor,
							'https://www.youtube.com/watch?v=8Qn_spdM5Zg'
						);
						expect(editor.value).equal(
							'<p><a href="https://www.youtube.com/watch?v=8Qn_spdM5Zg">https://www.youtube.com/watch?v=8Qn_spdM5Zg</a></p>'
						);
					});
				});
			});
		});
	});

	describe('Toolbar link', function () {
		describe('Click link button', function () {
			describe('Edit exists link', function () {
				describe('Content input was not changed', function () {
					it('Should save link content', function () {
						const editor = getJodit();

						editor.value =
							'<p>test <a href="#somelink">link <strong>strong</strong></a> open</p>';

						const range = editor.s.createRange();
						range.setStart(
							editor.editor.querySelector('a').firstChild,
							4
						);
						range.collapse(true);
						editor.s.selectRange(range);

						simulateEvent(
							'click',
							editor.editor.querySelector('a')
						);

						const inlinePopup = getOpenedPopup(editor);
						expect(inlinePopup).is.not.null;

						clickButton('link', inlinePopup);

						const popup = getOpenedPopup(editor);
						expect(popup).is.not.null;

						const content = popup.querySelector(
							'[ref=content_input]'
						);
						expect(content).is.not.null;
						expect(content.value).equals('link strong');

						const url = popup.querySelector('[ref=url_input]');
						expect(url).is.not.null;
						expect(url.value).equals('#somelink');

						url.value = 'https://xdan.ru';

						simulateEvent('submit', 0, popup.querySelector('form'));

						expect(editor.value).equals(
							'<p>test <a href="https://xdan.ru">link <strong>strong</strong></a> open</p>'
						);
					});

					describe('For relative link', function () {
						it('Should work same way', function () {
							const editor = getJodit();

							editor.value =
								'<p>test <a href="#somelink">|link <strong>strong</strong></a> open</p>';

							setCursorToChar(editor);

							simulateEvent(
								'click',
								editor.editor.querySelector('a')
							);

							const inlinePopup = getOpenedPopup(editor);
							clickButton('link', inlinePopup);

							const popup = getOpenedPopup(editor);

							const url = popup.querySelector('[ref=url_input]');
							expect(url.value).equals('#somelink');

							url.value = '/jodit/docs/';

							simulateEvent(
								'submit',
								popup.querySelector('form')
							);

							expect(editor.value).equals(
								'<p>test <a href="/jodit/docs/">link <strong>strong</strong></a> open</p>'
							);
						});
					});
				});

				describe('Content input was changed', function () {
					it('Should replace link content', function () {
						const editor = getJodit();

						editor.value =
							'<p>test <a href="#somelink">link <strong>strong</strong></a> open</p>';

						const range = editor.s.createRange();
						range.setStart(
							editor.editor.querySelector('a').firstChild,
							4
						);
						range.collapse(true);
						editor.s.selectRange(range);

						simulateEvent(
							'click',
							editor.editor.querySelector('a')
						);

						const inlinePopup = getOpenedPopup(editor);

						clickButton('link', inlinePopup);

						const popup = getOpenedPopup(editor);

						const content = popup.querySelector(
							'[ref=content_input]'
						);

						content.value = 'some text';

						simulateEvent('submit', 0, popup.querySelector('form'));

						expect(editor.value).equals(
							'<p>test <a href="#somelink">some text</a> open</p>'
						);
					});

					describe('Content stay clear', function () {
						it('Should replace link content to url', function () {
							const editor = getJodit();

							editor.value =
								'<p>test <a href="#somelink">link <strong>strong</strong></a> open</p>';

							const range = editor.s.createRange();
							range.setStart(
								editor.editor.querySelector('a').firstChild,
								4
							);
							range.collapse(true);
							editor.s.selectRange(range);

							simulateEvent(
								'click',
								editor.editor.querySelector('a')
							);

							const inlinePopup = getOpenedPopup(editor);

							clickButton('link', inlinePopup);

							const popup = getOpenedPopup(editor);

							const content = popup.querySelector(
								'[ref=content_input]'
							);

							content.value = '';

							simulateEvent(
								'submit',
								0,
								popup.querySelector('form')
							);

							expect(editor.value).equals(
								'<p>test <a href="#somelink">#somelink</a> open</p>'
							);
						});
					});
				});

				describe('Select some text inside link', function () {
					describe('Content input was not changed', function () {
						it("Should open edit popup with full link's content", function () {
							const editor = getJodit();

							editor.value =
								'<p>test <a href="#somelink">link <strong>strong</strong></a> open</p>';

							const range = editor.s.createRange();
							range.setStart(
								editor.editor.querySelector('a').firstChild,
								2
							);
							range.setEnd(
								editor.editor.querySelector('a').firstChild,
								4
							);
							editor.s.selectRange(range);

							simulateEvent(
								'click',
								editor.editor.querySelector('a')
							);

							const inlinePopup = getOpenedPopup(editor);

							clickButton('link', inlinePopup);

							const popup = getOpenedPopup(editor);

							const content = popup.querySelector(
								'[ref=content_input]'
							);

							expect(content.value).equals('link strong');

							const url = popup.querySelector('[ref=url_input]');
							expect(url).is.not.null;
							expect(url.value).equals('#somelink');

							url.value = 'https://xdan.ru';

							simulateEvent(
								'submit',
								0,
								popup.querySelector('form')
							);

							expect(editor.value).equals(
								'<p>test <a href="https://xdan.ru">link <strong>strong</strong></a> open</p>'
							);
						});
					});

					describe('Content input was changed', function () {
						it("Should open edit popup with full link's content and after submit should replace full link's content", function () {
							const editor = getJodit();

							editor.value =
								'<p>test <a href="#somelink">link <strong>strong</strong></a> open</p>';

							const range = editor.s.createRange();
							range.setStart(
								editor.editor.querySelector('a').firstChild,
								2
							);
							range.setEnd(
								editor.editor.querySelector('a').firstChild,
								4
							);
							editor.s.selectRange(range);

							simulateEvent(
								'click',
								editor.editor.querySelector('a')
							);

							const inlinePopup = getOpenedPopup(editor);

							clickButton('link', inlinePopup);

							const popup = getOpenedPopup(editor);

							const content = popup.querySelector(
								'[ref=content_input]'
							);

							expect(content.value).equals('link strong');

							content.value = 'https://xdan.ru';

							simulateEvent(
								'submit',
								0,
								popup.querySelector('form')
							);

							expect(editor.value).equals(
								'<p>test <a href="#somelink">https://xdan.ru</a> open</p>'
							);
						});
					});
				});
			});

			describe('In dialog', function () {
				describe('Edit exists link', function () {
					describe('Content input was not changed', function () {
						it('Should save link content', function () {
							const editor = getJodit();

							editor.value =
								'<p>test <a href="#somelink">link| <strong>strong</strong></a> open</p>';

							setCursorToChar(editor);

							simulateEvent(
								'keydown',
								'k',
								editor.editor,
								function (opt) {
									opt.ctrlKey = true;
								}
							);

							const dialog = getOpenedDialog(editor);
							expect(dialog).is.not.null;

							const content = dialog.querySelector(
								'[ref=content_input]'
							);
							expect(content).is.not.null;
							expect(content.value).equals('link strong');

							const url = dialog.querySelector('[ref=url_input]');
							expect(url).is.not.null;
							expect(url.value).equals('#somelink');

							url.value = 'https://xdan.ru';

							simulateEvent(
								'submit',
								0,
								dialog.querySelector('form')
							);

							expect(editor.value).equals(
								'<p>test <a href="https://xdan.ru">link <strong>strong</strong></a> open</p>'
							);
						});
					});
				});
			});

			describe('Open LINK insert dialog and insert new link', function () {
				it('Should insert new link', function () {
					let popup_opened = 0;

					const editor = getJodit({
						events: {
							beforeLinkOpenPopup: function () {
								popup_opened += 1;
							},
							/**
							 *
							 * @param {HTMLElement} popup_container
							 */
							afterLinkOpenPopup: function () {
								popup_opened += 1;
							}
						},
						observer: {
							timeout: 0
						}
					});

					editor.value = '';

					clickButton('link', editor);

					const list = getOpenedPopup(editor);

					expect(popup_opened).equals(2);
					expect(
						editor.ownerWindow.getComputedStyle(list).display
					).equals('block');

					expect(
						list.querySelector('[ref="unlink"]').style.display
					).equals('none');

					const url = list.querySelector('[ref=url_input]');
					expect(url).is.not.null;

					url.focus();
					url.value = ''; // try wrong url
					list.querySelector('[ref=content_input]').value = '123';

					simulateEvent('submit', list.querySelector('form'));

					expect(
						Boolean(url.closest('.jodit-ui-input_has-error_true'))
					).is.true;

					url.focus();
					url.value = 'tests/artio.jpg';
					simulateEvent('submit', 0, list.querySelector('form'));

					expect(sortAttributes(editor.value)).equals(
						'<p><a href="tests/artio.jpg">123</a></p>'
					);

					simulateEvent('mousedown', 0, editor.editor);

					expect(list.parentNode).is.null;
				});

				it('Should fire change event', function () {
					let change = 0;

					const editor = getJodit({
						events: {
							change: function () {
								change += 1;
							}
						}
					});

					editor.value = '';

					clickButton('link', editor);

					const list = getOpenedPopup(editor);
					const url = list.querySelector('input[ref=url_input]');
					url.value = 'tests/artio.jpg';
					simulateEvent('submit', 0, list.querySelector('form'));

					expect(sortAttributes(editor.value)).equals(
						'<p><a href="tests/artio.jpg">tests/artio.jpg</a></p>'
					);

					expect(change).equals(1);
				});

				describe('Set custom popup template', function () {
					it('Should show this template inside popup', function () {
						const tpl =
							'<form class="form_url"><input ref="url_input" type="url"><button>save</button></form>';

						const editor = getJodit({
							link: {
								formTemplate: function () {
									return tpl;
								}
							}
						});

						editor.value = '123';
						editor.s.select(editor.editor.firstChild);

						clickButton('link', editor);

						const popup = getOpenedPopup(editor);

						expect(
							sortAttributes(
								popup.querySelector('form').outerHTML
							)
						).equals(tpl);

						const url = popup.querySelector('[ref=url_input]');
						expect(url).is.not.null;

						url.focus();
						url.value = 'tests/artio.jpg';

						simulateEvent('submit', 0, popup.querySelector('form'));

						expect(sortAttributes(editor.value)).equals(
							'<p><a href="tests/artio.jpg">123</a></p>'
						);
					});

					describe('Use data-ref instead ref', function () {
						it('Should show this template inside popup', function () {
							const tpl =
								'<form class="form_url"><input data-ref="url_input" type="url"><button>save</button></form>';

							const editor = getJodit({
								link: {
									formTemplate: function () {
										return tpl;
									}
								}
							});

							editor.value = '123';
							editor.s.select(editor.editor.firstChild);

							clickButton('link', editor);

							const popup = getOpenedPopup(editor);

							expect(
								sortAttributes(
									popup.querySelector('form').outerHTML
								)
							).equals(tpl);

							const url = popup.querySelector(
								'[data-ref=url_input]'
							);
							expect(url).is.not.null;

							url.focus();
							url.value = 'tests/artio.jpg';

							simulateEvent(
								'submit',
								0,
								popup.querySelector('form')
							);

							expect(sortAttributes(editor.value)).equals(
								'<p><a href="tests/artio.jpg">123</a></p>'
							);
						});
					});

					describe('Add class name in form', function () {
						it('Should show form with this class', function () {
							const editor = getJodit({
								link: {
									formClassName: 'bootstrap_form'
								}
							});

							clickButton('link', editor);

							const form =
								getOpenedPopup(editor).querySelector('form');

							expect(form).is.not.null;
							expect(form.classList.contains('bootstrap_form')).is
								.true;
						});
					});
				});

				describe('On selected content', function () {
					describe('Selected text', function () {
						it('Should wrap selected text in link', function () {
							const editor = getJodit({
								toolbarAdaptive: false
							});

							editor.value =
								'test <span style="color: #ccc;">select </span> stop';

							const range = editor.s.createRange();

							range.setStart(
								editor.editor.querySelector('span').firstChild,
								0
							);
							range.setEnd(
								editor.editor.querySelector('span').firstChild,
								6
							);

							editor.s.selectRange(range);

							clickButton('link', editor);

							const popup = getOpenedPopup(editor);
							expect(popup).is.not.null;

							expect(
								editor.ownerWindow.getComputedStyle(popup)
									.display
							).equals('block');

							expect(
								popup.querySelector('[ref="unlink"]').style
									.display
							).equals('none');

							const url = popup.querySelector('[ref=url_input]');
							expect(url).is.not.null;

							const text = popup.querySelector(
								'[ref=content_input]'
							);
							expect(text).is.not.null;

							expect(text.value).equals('select');

							url.focus();
							url.value = 'tests/artio.jpg';
							simulateEvent(
								'submit',
								0,
								popup.querySelector('form')
							);

							expect(sortAttributes(editor.value)).equals(
								'<p>test <span style="color:#ccc"><a href="tests/artio.jpg">select</a> </span> stop</p>'
							);

							simulateEvent('mousedown', 0, editor.editor);

							expect(popup.parentNode).is.null;
						});
					});

					describe('Selected image', function () {
						describe('On open popup', function () {
							it('Should hide text input', function () {
								const editor = getJodit({
									toolbarAdaptive: false,
									observer: {
										timeout: 0
									}
								});

								editor.value =
									'test <img style="width: 100px;height: 100px" src="https://xdsoft.net/jodit/build/images/artio.jpg" alt=""> stop';

								editor.s.select(
									editor.editor.querySelector('img')
								);

								clickButton('link', editor);

								const popup = getOpenedPopup(editor);

								const text = popup.querySelector(
									'[ref=content_input_box]'
								);

								expect(
									editor.ownerWindow.getComputedStyle(text)
										.display
								).equals('none');
							});
						});

						it('Should wrap selected image in link', function () {
							const editor = getJodit({
								toolbarAdaptive: false,
								observer: {
									timeout: 0
								}
							});

							editor.value =
								'test <img style="width: 100px;height: 100px" src="https://xdsoft.net/jodit/build/images/artio.jpg" alt=""> stop';

							editor.s.select(editor.editor.querySelector('img'));

							clickButton('link', editor);

							const popup = getOpenedPopup(editor);
							expect(popup).is.not.null;
							expect(
								editor.ownerWindow.getComputedStyle(popup)
									.display
							).equals('block');

							const url = popup.querySelector('[ref=url_input]');
							const text = popup.querySelector(
								'[ref=content_input]'
							);

							expect(text.value).equals('');

							url.focus();
							url.value = 'tests/artio.jpg';

							simulateEvent(
								'submit',
								0,
								popup.querySelector('form')
							);

							expect(sortAttributes(editor.value)).equals(
								'<p>test <a href="tests/artio.jpg"><img alt="" src="https://xdsoft.net/jodit/build/images/artio.jpg" style="height:100px;width:100px"></a> stop</p>'
							);

							simulateEvent('mousedown', 0, editor.editor);

							expect(popup.parentNode).is.null;
						});
					});
				});

				it('Should restore source text after user clicked on Unlink button', function () {
					const editor = getJodit({
						observer: {
							timeout: 0
						}
					});

					editor.value =
						'<a target="_blank" rel="nofollow" href="#test">test</a>';

					const sel = editor.s.sel,
						range = editor.s.createRange();

					range.selectNode(editor.editor.firstChild);
					sel.removeAllRanges();
					sel.addRange(range);

					clickButton('link', editor);

					const popup = getOpenedPopup(editor);

					expect(popup.querySelector('input[name=url]').value).equals(
						'#test'
					);

					expect(popup.querySelector('input[name=target]').checked).is
						.true;

					expect(popup.querySelector('input[name=nofollow]').checked)
						.is.true;

					expect(
						popup.querySelector('[ref="unlink"]').style.display
					).does.not.equal('none');

					expect(
						popup.querySelector('[ref=insert]').innerHTML
					).equals(editor.i18n('Update'));

					simulateEvent(
						'click',
						0,
						popup.querySelector('[ref=unlink]')
					);

					expect(sortAttributes(editor.value)).equals('<p>test</p>');
				});
			});

			describe('Was selected part of text', function () {
				it('Should show dialog form with this text', function () {
					const editor = getJodit();

					editor.value = '<p>one green bottle hanging under wall</p>';
					const range = editor.s.createRange();
					range.setStart(editor.editor.firstChild.firstChild, 10);
					range.setEnd(editor.editor.firstChild.firstChild, 16);
					editor.s.selectRange(range);

					clickButton('link', editor);

					const popup = getOpenedPopup(editor);

					const textInput = popup.querySelector(
						'input[ref=content_input]'
					);
					expect(textInput).is.not.null;

					expect(textInput.value).equals('bottle');
				});
			});

			describe('Was selected part of html', function () {
				it('Should show dialog form with selection text content from this HTML', function () {
					const editor = getJodit();

					editor.value =
						'<p>one green <strong>bottle hanging</strong> under wall</p>' +
						'<p>two green <em>bottles hanging</em> under wall</p>';

					const range = editor.s.createRange();
					range.setStart(editor.editor.firstChild.firstChild, 4);
					range.setEnd(editor.editor.lastChild.lastChild, 6);
					editor.s.selectRange(range);

					clickButton('link', editor);

					const popup = getOpenedPopup(editor);

					const textInput = popup.querySelector(
						'input[ref=content_input]'
					);
					expect(textInput).is.not.null;

					expect(textInput.value).equals(
						'green bottle hanging under wall two green bottles hanging under'
					);
				});

				describe('Was selected image', function () {
					describe('Image was inside the Table', function () {
						describe('Edit with contect menu', function () {
							it('Should wrap selected image inside the link', function () {
								const editor = getJodit({
									popup: {
										img: ['link', 'unlink']
									}
								});

								editor.value =
									'<p>test</p>' +
									'<table>' +
									'<tbody>' +
									'<tr>' +
									'<td><img src="https://xdsoft.net/jodit/build/images/artio.jpg" alt="test"></td>' +
									'</tr>' +
									'</tbody>' +
									'</table>';

								editor.s.select(
									editor.editor.querySelector('img')
								);

								simulateEvent(
									'click',
									editor.editor.querySelector('img')
								);

								const inline = getOpenedPopup(editor);

								clickButton('link', inline);

								const popup = getOpenedPopup(editor);

								const textInput = popup.querySelector(
									'input[ref=content_input]'
								);

								expect(
									textInput.closest('.jodit-ui-block').style
										.display
								).equals('none');

								expect(textInput.value).equals('');

								const urlInput = popup.querySelector(
									'input[ref=url_input]'
								);

								expect(urlInput).is.not.null;
								urlInput.focus();
								urlInput.value = './shapiro';
								urlInput.select();

								simulateEvent(
									'submit',
									popup.querySelector('form')
								);

								expect(sortAttributes(editor.value)).equals(
									'<p>test</p>' +
										'<table>' +
										'<tbody>' +
										'<tr>' +
										'<td><a href="./shapiro"><img alt="test" src="https://xdsoft.net/jodit/build/images/artio.jpg"></a></td>' +
										'</tr>' +
										'</tbody>' +
										'</table>'
								);
							});
						});
					});

					describe('Image had not anchor parent', function () {
						it('Should show dialog without content input and after submit wrap this image', function () {
							const editor = getJodit();

							editor.value =
								'<p>one green <img src="https://xdsoft.net/jodit/build/images/artio.jpg" alt="test"> under wall</p>';

							editor.s.select(editor.editor.querySelector('img'));

							clickButton('link', editor);

							const popup = getOpenedPopup(editor);

							const textInput = popup.querySelector(
								'input[ref=content_input]'
							);

							expect(
								textInput.closest('.jodit-ui-block').style
									.display
							).equals('none');

							expect(textInput.value).equals('');

							const urlInput = popup.querySelector(
								'input[ref=url_input]'
							);

							expect(urlInput).is.not.null;
							urlInput.focus();
							urlInput.value = 'https://xdsoft.net';
							urlInput.select();

							simulateEvent(
								'submit',
								popup.querySelector('form')
							);

							expect(sortAttributes(editor.value)).equals(
								'<p>one green <a href="https://xdsoft.net"><img alt="test" src="https://xdsoft.net/jodit/build/images/artio.jpg"></a> under wall</p>'
							);
						});
					});

					describe('Image had anchor parent', function () {
						it('Should show dialog without content input and after submit wrap this image', function () {
							const editor = getJodit();

							editor.value =
								'<p>one green <a href="https://xdan.ru"><img src="https://xdsoft.net/jodit/build/images/artio.jpg" alt="test"></a> under wall</p>';

							editor.s.focus({ preventScroll: false });
							editor.s.select(editor.editor.querySelector('img'));

							clickButton('link', editor);

							const popup = getOpenedPopup(editor);

							const textInput = popup.querySelector(
								'input[ref=content_input]'
							);

							expect(
								textInput.closest('.jodit-ui-block').style
									.display
							).equals('none');

							expect(textInput.value).equals('');

							const urlInput = popup.querySelector(
								'input[ref=url_input]'
							);

							expect(urlInput).is.not.null;
							expect(urlInput.value).equals('https://xdan.ru');

							urlInput.focus();
							urlInput.value = 'https://xdsoft.net';
							urlInput.select();

							simulateEvent(
								'submit',
								popup.querySelector('form')
							);

							expect(sortAttributes(editor.value)).equals(
								'<p>one green <a href="https://xdsoft.net"><img alt="test" src="https://xdsoft.net/jodit/build/images/artio.jpg"></a> under wall</p>'
							);
						});
					});
				});

				describe('After submit this part', function () {
					it('should be wrapped inside anchor', function () {
						const editor = getJodit();

						editor.value =
							'<p>one green <strong>bottle hanging</strong> under wall</p>' +
							'<p>two green <em>bottles hanging</em> under wall</p>';

						const range = editor.s.createRange();
						range.setStart(editor.editor.firstChild.firstChild, 4);
						range.setEnd(editor.editor.lastChild.lastChild, 6);
						editor.s.selectRange(range);

						clickButton('link', editor);

						const popup = getOpenedPopup(editor);

						const form = popup.querySelector('.jodit-ui-form');
						expect(form).is.not.null;

						const input = form.querySelector(
							'input[ref=url_input]'
						);

						expect(input).is.not.null;

						input.value = 'https://xdsoft.net/jodit/';

						simulateEvent('submit', 0, form);

						expect(editor.value).equals(
							'<p>one <a href="https://xdsoft.net/jodit/">green <strong>bottle hanging</strong> under wall</a></p>' +
								'<p><a href="https://xdsoft.net/jodit/">two green <em>bottles hanging</em> under</a> wall</p>'
						);
					});
				});
			});
		});
	});

	describe('Link with class name (modeClassName=input/default)', function () {
		describe('Add class name on link', function () {
			it('Should insert new link with a class name', function () {
				const editor = getJodit();

				editor.value =
					'<p>one green <strong>bottle hanging</strong> under wall</p>' +
					'<p>two green <em>bottles hanging</em> under wall</p>';

				const range = editor.s.createRange();
				range.setStart(editor.editor.firstChild.firstChild, 4);
				range.setEnd(editor.editor.lastChild.lastChild, 6);
				editor.s.selectRange(range);

				clickButton('link', editor);

				const popup = getOpenedPopup(editor);

				const form = popup.querySelector('.jodit-ui-form');
				expect(form).is.not.null;

				const input = form.querySelector('input[ref=url_input]');

				expect(input).is.not.null;

				input.value = 'https://xdsoft.net/jodit/';

				const className_input = form.querySelector(
					'input[ref=className_input]'
				);

				expect(className_input).is.not.null;

				className_input.value = 'test';

				simulateEvent('submit', 0, form);

				expect(editor.value).equals(
					'<p>one <a href="https://xdsoft.net/jodit/" class="test">green <strong>bottle hanging</strong> under wall</a></p>' +
						'<p><a href="https://xdsoft.net/jodit/" class="test">two green <em>bottles hanging</em> under</a> wall</p>'
				);
			});
		});

		describe('Vérify class name on link', function () {
			it('Should have link with a class name', function () {
				const editor = getJodit();

				editor.value =
					'<p>one <a href="https://xdsoft.net/jodit/" class="test">green <strong>bottle hanging</strong> under wall</a></p>' +
					'<p><a href="https://xdsoft.net/jodit/" class="test">two green <em>bottles hanging</em> under</a> wall</p>';

				const range = editor.s.createRange();
				range.setStart(editor.editor.querySelector('a').firstChild, 4);
				range.collapse(true);
				editor.s.selectRange(range);

				clickButton('link', editor);

				const popup = getOpenedPopup(editor);

				const form = popup.querySelector('.jodit-ui-form');
				expect(form).is.not.null;

				const className_input = form.querySelector(
					'input[ref=className_input]'
				);

				expect(className_input).is.not.null;
				expect(className_input.value).equals('test');
			});
		});

		describe('Modify class name on link', function () {
			it('Should modify link with a new class name', function () {
				const editor = getJodit();

				editor.value =
					'<p>one <a href="https://xdsoft.net/jodit/" class="test">green <strong>bottle hanging</strong> under wall</a></p>' +
					'<p><a href="https://xdsoft.net/jodit/" class="test">two green <em>bottles hanging</em> under</a> wall</p>';

				const range = editor.s.createRange();
				range.setStart(editor.editor.querySelector('a').firstChild, 4);
				range.collapse(true);
				editor.s.selectRange(range);

				clickButton('link', editor);

				const popup = getOpenedPopup(editor);

				const form = popup.querySelector('.jodit-ui-form');
				expect(form).is.not.null;

				const className_input = form.querySelector(
					'input[ref=className_input]'
				);

				expect(className_input).is.not.null;

				className_input.value = 'test2';

				simulateEvent('submit', 0, form);

				expect(editor.value).equals(
					'<p>one <a href="https://xdsoft.net/jodit/" class="test2">green <strong>bottle hanging</strong> under wall</a></p>' +
						'<p><a href="https://xdsoft.net/jodit/" class="test">two green <em>bottles hanging</em> under</a> wall</p>'
				);
			});
		});

		describe('Delete class name on link', function () {
			it('Should modify link witout class name', function () {
				const editor = getJodit();

				editor.value =
					'<p>one <a href="https://xdsoft.net/jodit/" class="test">green <strong>bottle hanging</strong> under wall</a></p>' +
					'<p><a href="https://xdsoft.net/jodit/" class="test">two green <em>bottles hanging</em> under</a> wall</p>';

				const range = editor.s.createRange();
				range.setStart(editor.editor.querySelector('a').firstChild, 4);
				range.collapse(true);
				editor.s.selectRange(range);

				clickButton('link', editor);

				const popup = getOpenedPopup(editor);

				const form = popup.querySelector('.jodit-ui-form');
				expect(form).is.not.null;

				const className_input = form.querySelector(
					'input[ref=className_input]'
				);

				expect(className_input).is.not.null;

				className_input.value = '';

				simulateEvent('submit', 0, form);

				expect(editor.value).equals(
					'<p>one <a href="https://xdsoft.net/jodit/">green <strong>bottle hanging</strong> under wall</a></p>' +
						'<p><a href="https://xdsoft.net/jodit/" class="test">two green <em>bottles hanging</em> under</a> wall</p>'
				);
			});
		});
	});

	describe('Link with class name (modeClassName=select)', function () {
		describe('Add class name on link', function () {
			it('Should insert new link with a class name', function () {
				const editor = getJodit({
					link: {
						modeClassName: 'select',
						selectOptionsClassName: [
							{ value: '', text: '' },
							{ value: 'val1', text: 'text1' },
							{ value: 'val2', text: 'text2' },
							{ value: 'val3', text: 'text3' }
						]
					}
				});

				editor.value =
					'<p>one green <strong>bottle hanging</strong> under wall</p>' +
					'<p>two green <em>bottles hanging</em> under wall</p>';

				const range = editor.s.createRange();
				range.setStart(editor.editor.firstChild.firstChild, 4);
				range.setEnd(editor.editor.lastChild.lastChild, 6);
				editor.s.selectRange(range);

				clickButton('link', editor);

				const popup = getOpenedPopup(editor);

				const form = popup.querySelector('.jodit-ui-form');
				expect(form).is.not.null;

				const input = form.querySelector('input[ref=url_input]');

				expect(input).is.not.null;

				input.value = 'https://xdsoft.net/jodit/';

				const className_select = form.querySelector(
					'select[ref=className_select]'
				);

				expect(className_select).is.not.null;

				for (let i = 0; i < className_select.options.length; i++) {
					let option = className_select.options.item(i);
					option.selected = option.value === 'val1';
				}

				simulateEvent('submit', 0, form);

				expect(editor.value).equals(
					'<p>one <a href="https://xdsoft.net/jodit/" class="val1">green <strong>bottle hanging</strong> under wall</a></p>' +
						'<p><a href="https://xdsoft.net/jodit/" class="val1">two green <em>bottles hanging</em> under</a> wall</p>'
				);
			});
		});

		describe('Vérify class name on link', function () {
			it('Should have link with a class name', function () {
				const editor = getJodit({
					link: {
						modeClassName: 'select',
						selectOptionsClassName: [
							{ value: '', text: '' },
							{ value: 'val1', text: 'text1' },
							{ value: 'val2', text: 'text2' },
							{ value: 'val3', text: 'text3' }
						]
					}
				});

				editor.value =
					'<p>one <a href="https://xdsoft.net/jodit/" class="val1">green <strong>bottle hanging</strong> under wall</a></p>' +
					'<p><a href="https://xdsoft.net/jodit/" class="val1">two green <em>bottles hanging</em> under</a> wall</p>';

				const range = editor.s.createRange();
				range.setStart(editor.editor.querySelector('a').firstChild, 4);
				range.collapse(true);
				editor.s.selectRange(range);

				clickButton('link', editor);

				const popup = getOpenedPopup(editor);

				const form = popup.querySelector('.jodit-ui-form');
				expect(form).is.not.null;

				const className_select = form.querySelector(
					'select[ref=className_select]'
				);

				expect(className_select).is.not.null;

				for (let i = 0; i < className_select.options.length; i++) {
					let option = className_select.options.item(i);
					expect(option.selected).equals(option.value === 'val1');
				}
			});
		});

		describe('Modify class name on link', function () {
			it('Should modify link with a new class name', function () {
				const editor = getJodit({
					link: {
						modeClassName: 'select',
						selectOptionsClassName: [
							{ value: '', text: '' },
							{ value: 'val1', text: 'text1' },
							{ value: 'val2', text: 'text2' },
							{ value: 'val3', text: 'text3' }
						]
					}
				});

				editor.value =
					'<p>one <a href="https://xdsoft.net/jodit/" class="val1">green <strong>bottle hanging</strong> under wall</a></p>' +
					'<p><a href="https://xdsoft.net/jodit/" class="val1">two green <em>bottles hanging</em> under</a> wall</p>';

				const range = editor.s.createRange();
				range.setStart(editor.editor.querySelector('a').firstChild, 4);
				range.collapse(true);
				editor.s.selectRange(range);

				clickButton('link', editor);

				const popup = getOpenedPopup(editor);

				const form = popup.querySelector('.jodit-ui-form');
				expect(form).is.not.null;

				const className_select = form.querySelector(
					'select[ref=className_select]'
				);

				expect(className_select).is.not.null;

				for (let i = 0; i < className_select.options.length; i++) {
					let option = className_select.options.item(i);
					option.selected = option.value === 'val2' ? true : false;
				}

				simulateEvent('submit', 0, form);

				expect(editor.value).equals(
					'<p>one <a href="https://xdsoft.net/jodit/" class="val2">green <strong>bottle hanging</strong> under wall</a></p>' +
						'<p><a href="https://xdsoft.net/jodit/" class="val1">two green <em>bottles hanging</em> under</a> wall</p>'
				);
			});
		});

		describe('Delete class name on link', function () {
			it('Should modify link witout class name', function () {
				const editor = getJodit({
					link: {
						modeClassName: 'select',
						selectOptionsClassName: [
							{ value: '', text: '' },
							{ value: 'val1', text: 'text1' },
							{ value: 'val2', text: 'text2' },
							{ value: 'val3', text: 'text3' }
						]
					}
				});

				editor.value =
					'<p>one <a href="https://xdsoft.net/jodit/" class="val1">green <strong>bottle hanging</strong> under wall</a></p>' +
					'<p><a href="https://xdsoft.net/jodit/" class="val1">two green <em>bottles hanging</em> under</a> wall</p>';

				const range = editor.s.createRange();
				range.setStart(editor.editor.querySelector('a').firstChild, 4);
				range.collapse(true);
				editor.s.selectRange(range);

				clickButton('link', editor);

				const popup = getOpenedPopup(editor);

				const form = popup.querySelector('.jodit-ui-form');
				expect(form).is.not.null;

				const className_select = form.querySelector(
					'select[ref=className_select]'
				);

				expect(className_select).is.not.null;

				for (let i = 0; i < className_select.options.length; i++) {
					let option = className_select.options.item(i);
					option.selected = false;
				}

				simulateEvent('submit', 0, form);

				expect(editor.value).equals(
					'<p>one <a href="https://xdsoft.net/jodit/">green <strong>bottle hanging</strong> under wall</a></p>' +
						'<p><a href="https://xdsoft.net/jodit/" class="val1">two green <em>bottles hanging</em> under</a> wall</p>'
				);
			});
		});
	});

	describe('Link with class name (modeClassName="select", selectMultipleClassName=true)', function () {
		describe('Add class name on link', function () {
			it('Should insert new link with a class name', function () {
				const editor = getJodit({
					link: {
						modeClassName: 'select',
						selectMultipleClassName: true,
						selectOptionsClassName: [
							{ value: '', text: '' },
							{ value: 'val1', text: 'text1' },
							{ value: 'val2', text: 'text2' },
							{ value: 'val3', text: 'text3' }
						]
					}
				});

				editor.value =
					'<p>one green <strong>bottle hanging</strong> under wall</p>' +
					'<p>two green <em>bottles hanging</em> under wall</p>';

				const range = editor.s.createRange();
				range.setStart(editor.editor.firstChild.firstChild, 4);
				range.setEnd(editor.editor.lastChild.lastChild, 6);
				editor.s.selectRange(range);

				clickButton('link', editor);

				const popup = getOpenedPopup(editor);

				const form = popup.querySelector('.jodit-ui-form');
				expect(form).is.not.null;

				const input = form.querySelector('input[ref=url_input]');

				expect(input).is.not.null;

				input.value = 'https://xdsoft.net/jodit/';

				const className_select = form.querySelector(
					'select[ref=className_select]'
				);

				expect(className_select).is.not.null;

				for (let i = 0; i < className_select.options.length; i++) {
					let option = className_select.options.item(i);
					option.selected =
						option.value === 'val1' || option.value === 'val3';
				}

				simulateEvent('submit', 0, form);

				expect(editor.value).equals(
					'<p>one <a href="https://xdsoft.net/jodit/" class="val1 val3">green <strong>bottle hanging</strong> under wall</a></p>' +
						'<p><a href="https://xdsoft.net/jodit/" class="val1 val3">two green <em>bottles hanging</em> under</a> wall</p>'
				);
			});
		});

		describe('Vérify class name on link', function () {
			it('Should have link with a class name', function () {
				const editor = getJodit({
					link: {
						modeClassName: 'select',
						selectMultipleClassName: true,
						selectOptionsClassName: [
							{ value: '', text: '' },
							{ value: 'val1', text: 'text1' },
							{ value: 'val2', text: 'text2' },
							{ value: 'val3', text: 'text3' }
						]
					}
				});

				editor.value =
					'<p>one <a href="https://xdsoft.net/jodit/" class="val1 val3">green <strong>bottle hanging</strong> under wall</a></p>' +
					'<p><a href="https://xdsoft.net/jodit/" class="val1 val3">two green <em>bottles hanging</em> under</a> wall</p>';

				const range = editor.s.createRange();
				range.setStart(editor.editor.querySelector('a').firstChild, 4);
				range.collapse(true);
				editor.s.selectRange(range);

				clickButton('link', editor);

				const popup = getOpenedPopup(editor);

				const form = popup.querySelector('.jodit-ui-form');
				expect(form).is.not.null;

				const className_select = form.querySelector(
					'select[ref=className_select]'
				);

				expect(className_select).is.not.null;

				for (let i = 0; i < className_select.options.length; i++) {
					let option = className_select.options.item(i);
					expect(option.selected).equals(
						option.value === 'val1' || option.value === 'val3'
					);
				}
			});
		});

		describe('Modify class name on link', function () {
			it('Should modify link with a new class name', function () {
				const editor = getJodit({
					link: {
						modeClassName: 'select',
						selectMultipleClassName: true,
						selectOptionsClassName: [
							{ value: '', text: '' },
							{ value: 'val1', text: 'text1' },
							{ value: 'val2', text: 'text2' },
							{ value: 'val3', text: 'text3' }
						]
					}
				});

				editor.value =
					'<p>one <a href="https://xdsoft.net/jodit/" class="val1 val3">green <strong>bottle hanging</strong> under wall</a></p>' +
					'<p><a href="https://xdsoft.net/jodit/" class="val1 val3">two green <em>bottles hanging</em> under</a> wall</p>';

				const range = editor.s.createRange();
				range.setStart(editor.editor.querySelector('a').firstChild, 4);
				range.collapse(true);
				editor.s.selectRange(range);

				clickButton('link', editor);

				const popup = getOpenedPopup(editor);

				const form = popup.querySelector('.jodit-ui-form');
				expect(form).is.not.null;

				const className_select = form.querySelector(
					'select[ref=className_select]'
				);

				expect(className_select).is.not.null;

				for (let i = 0; i < className_select.options.length; i++) {
					let option = className_select.options.item(i);
					option.selected =
						option.value === 'val1' || option.value === 'val2'
							? true
							: false;
				}

				simulateEvent('submit', 0, form);

				expect(editor.value).equals(
					'<p>one <a href="https://xdsoft.net/jodit/" class="val1 val2">green <strong>bottle hanging</strong> under wall</a></p>' +
						'<p><a href="https://xdsoft.net/jodit/" class="val1 val3">two green <em>bottles hanging</em> under</a> wall</p>'
				);
			});
		});

		describe('Delete class name on link', function () {
			it('Should modify link witout class name', function () {
				const editor = getJodit({
					link: {
						modeClassName: 'select',
						selectMultipleClassName: true,
						selectOptionsClassName: [
							{ value: '', text: '' },
							{ value: 'val1', text: 'text1' },
							{ value: 'val2', text: 'text2' },
							{ value: 'val3', text: 'text3' }
						]
					}
				});

				editor.value =
					'<p>one <a href="https://xdsoft.net/jodit/" class="val1 val3">green <strong>bottle hanging</strong> under wall</a></p>' +
					'<p><a href="https://xdsoft.net/jodit/" class="val1 val3">two green <em>bottles hanging</em> under</a> wall</p>';

				const range = editor.s.createRange();
				range.setStart(editor.editor.querySelector('a').firstChild, 4);
				range.collapse(true);
				editor.s.selectRange(range);

				clickButton('link', editor);

				const popup = getOpenedPopup(editor);

				const form = popup.querySelector('.jodit-ui-form');
				expect(form).is.not.null;

				const className_select = form.querySelector(
					'select[ref=className_select]'
				);

				expect(className_select).is.not.null;

				for (let i = 0; i < className_select.options.length; i++) {
					let option = className_select.options.item(i);
					option.selected = false;
				}

				simulateEvent('submit', 0, form);

				expect(editor.value).equals(
					'<p>one <a href="https://xdsoft.net/jodit/">green <strong>bottle hanging</strong> under wall</a></p>' +
						'<p><a href="https://xdsoft.net/jodit/" class="val1 val3">two green <em>bottles hanging</em> under</a> wall</p>'
				);
			});
		});
	});
});
