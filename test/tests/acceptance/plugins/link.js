describe('Link plugin', function() {
	describe('Insert link', function() {
		describe('Insert simple link', function() {
			it('Should insert as simple link', function() {
				const editor = new Jodit(appendTestArea());

				simulatePaste(editor.editor, 'https://www.youtube.com');

				expect(editor.value).equal(
					'<a href="https://www.youtube.com">https://www.youtube.com</a><br>'
				);
			});

			describe('Disable', function() {
				describe('Disable any convert', function() {
					it('Should not change source link', function() {
						const editor = new Jodit(appendTestArea(), {
							link: {
								processPastedLink: false
							}
						});

						simulatePaste(editor.editor, 'https://www.youtube.com');
						expect(editor.value).equal('https://www.youtube.com');
					});
				});
			});
		});

		describe('Insert youtube link', function() {
			it('Should insert iframe with video', function() {
				const editor = new Jodit(appendTestArea());
				simulatePaste(
					editor.editor,
					'https://www.youtube.com/watch?v=8Qn_spdM5Zg'
				);
				expect(sortAttributes(editor.value)).equal(
					sortAttributes(
						'<iframe width="400" height="345" src="https://www.youtube.com/embed/8Qn_spdM5Zg" frameborder="0" allowfullscreen=""></iframe>'
					)
				);
			});

			describe('Disable', function() {
				describe('Disable any convert', function() {
					it('Should not change source link', function() {
						const editor = new Jodit(appendTestArea(), {
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
							'https://www.youtube.com/watch?v=8Qn_spdM5Zg'
						);
					});
				});

				describe('Disable video convert', function() {
					it('Should insert video link as simple link', function() {
						const editor = new Jodit(appendTestArea(), {
							link: {
								processVideoLink: false
							}
						});

						simulatePaste(
							editor.editor,
							'https://www.youtube.com/watch?v=8Qn_spdM5Zg'
						);
						expect(editor.value).equal(
							'<a href="https://www.youtube.com/watch?v=8Qn_spdM5Zg">https://www.youtube.com/watch?v=8Qn_spdM5Zg</a><br>'
						);
					});
				});
			});
		});
	});

	describe('Toolbar link', function() {
		describe('Click link button', function() {
			describe('Edit exists link', function() {
				describe('Content input was not changed', function() {
					it('Should save link content', function() {
						const editor = new Jodit(appendTestArea());

						editor.value =
							'<p>test <a href="#somelink">link <strong>strong</strong></a> open</p>';

						const range = editor.selection.createRange();
						range.setStart(
							editor.editor.querySelector('a').firstChild,
							4
						);
						range.collapse(true);
						editor.selection.selectRange(range);

						simulateEvent(
							'mousedown',
							0,
							editor.editor.querySelector('a')
						);

						const inlinePopup = document.querySelector(
							'.jodit_toolbar_popup-inline[data-editor_id=' +
								editor.id +
								']'
						);
						expect(inlinePopup).is.not.null;

						clickButton('link', inlinePopup);

						const popup = inlinePopup.querySelector(
							'.jodit_toolbar_popup'
						);

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
				});

				describe('Content input was changed', function() {
					it('Should replace link content', function() {
						const editor = new Jodit(appendTestArea());

						editor.value =
							'<p>test <a href="#somelink">link <strong>strong</strong></a> open</p>';

						const range = editor.selection.createRange();
						range.setStart(
							editor.editor.querySelector('a').firstChild,
							4
						);
						range.collapse(true);
						editor.selection.selectRange(range);

						simulateEvent(
							'mousedown',
							0,
							editor.editor.querySelector('a')
						);

						const inlinePopup = document.querySelector(
							'.jodit_toolbar_popup-inline[data-editor_id=' +
								editor.id +
								']'
						);

						clickButton('link', inlinePopup);

						const popup = inlinePopup.querySelector(
							'.jodit_toolbar_popup'
						);

						const content = popup.querySelector(
							'[ref=content_input]'
						);

						content.value = 'some text';

						simulateEvent('submit', 0, popup.querySelector('form'));

						expect(editor.value).equals(
							'<p>test <a href="#somelink">some text</a> open</p>'
						);
					});

					describe('Content stay clear', function() {
						it('Should replace link content to url', function() {
							const editor = new Jodit(appendTestArea());

							editor.value =
								'<p>test <a href="#somelink">link <strong>strong</strong></a> open</p>';

							const range = editor.selection.createRange();
							range.setStart(
								editor.editor.querySelector('a').firstChild,
								4
							);
							range.collapse(true);
							editor.selection.selectRange(range);

							simulateEvent(
								'mousedown',
								0,
								editor.editor.querySelector('a')
							);

							const inlinePopup = document.querySelector(
								'.jodit_toolbar_popup-inline[data-editor_id=' +
									editor.id +
									']'
							);

							clickButton('link', inlinePopup);

							const popup = inlinePopup.querySelector(
								'.jodit_toolbar_popup'
							);

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

				describe('Select some text inside link', function() {
					describe('Content input was not changed', function() {
						it("Should open edit popup with full link's content", function() {
							const editor = new Jodit(appendTestArea());

							editor.value =
								'<p>test <a href="#somelink">link <strong>strong</strong></a> open</p>';

							const range = editor.selection.createRange();
							range.setStart(
								editor.editor.querySelector('a').firstChild,
								2
							);
							range.setEnd(
								editor.editor.querySelector('a').firstChild,
								4
							);
							editor.selection.selectRange(range);

							simulateEvent(
								'mousedown',
								0,
								editor.editor.querySelector('a')
							);

							const inlinePopup = document.querySelector(
								'.jodit_toolbar_popup-inline[data-editor_id=' +
									editor.id +
									']'
							);

							clickButton('link', inlinePopup);

							const popup = inlinePopup.querySelector(
								'.jodit_toolbar_popup'
							);

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

					describe('Content input was changed', function() {
						it("Should open edit popup with full link's content and after submit should replace full link's content", function() {
							const editor = new Jodit(appendTestArea());

							editor.value =
								'<p>test <a href="#somelink">link <strong>strong</strong></a> open</p>';

							const range = editor.selection.createRange();
							range.setStart(
								editor.editor.querySelector('a').firstChild,
								2
							);
							range.setEnd(
								editor.editor.querySelector('a').firstChild,
								4
							);
							editor.selection.selectRange(range);

							simulateEvent(
								'mousedown',
								0,
								editor.editor.querySelector('a')
							);

							const inlinePopup = document.querySelector(
								'.jodit_toolbar_popup-inline[data-editor_id="' +
									editor.id +
									'"]'
							);

							clickButton('link', inlinePopup);

							const popup = inlinePopup.querySelector(
								'.jodit_toolbar_popup'
							);

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

			describe('Open LINK insert dialog and insert new link', function() {
				it('Should insert new link', function() {
					let popup_opened = 0;

					const editor = new Jodit(appendTestArea(), {
						events: {
							/**
							 * @param {Node} target
							 * @param {ControlType} control
							 * @param {ToolbarPopup} popup
							 * @return false | undefined - if return false - popup will not be shown
							 */
							beforeLinkOpenPopup: function(
								target,
								control,
								popup
							) {
								popup_opened += 1;
							},
							/**
							 *
							 * @param {HTMLElement} popup_container
							 */
							afterLinkOpenPopup: function(popup_container) {
								popup_opened += 1;
							}
						},
						observer: {
							timeout: 0
						}
					});

					editor.value = '';

					simulateEvent(
						'mousedown',
						0,
						editor.container.querySelector(
							'.jodit_toolbar_btn.jodit_toolbar_btn-link'
						)
					);

					const list = editor.container.querySelector(
						'.jodit_toolbar_popup'
					);

					expect(popup_opened).equals(2);
					expect(
						editor.ownerWindow.getComputedStyle(list).display
					).equals('block');
					expect(
						editor.container.querySelector(
							'.jodit_toolbar_btn.jodit_toolbar_btn-link .jodit_unlink_button'
						).style.display
					).equals('none');

					const url = editor.container.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-link input[name=url]'
					);
					expect(url).is.not.null;

					url.focus();
					url.value = ''; // try wrong url
					editor.container.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-link input[name=text]'
					).value = '123';
					simulateEvent(
						'submit',
						0,
						editor.container.querySelector(
							'.jodit_toolbar_btn.jodit_toolbar_btn-link .jodit_form'
						)
					);

					expect(url.classList.contains('jodit_error')).is.true;

					url.focus();
					url.value = 'tests/artio.jpg';
					simulateEvent(
						'submit',
						0,
						editor.container.querySelector(
							'.jodit_toolbar_btn.jodit_toolbar_btn-link .jodit_form'
						)
					);

					expect(sortAttributes(editor.value)).equals(
						'<a href="tests/artio.jpg">123</a>'
					);

					simulateEvent('mousedown', 0, editor.editor);

					expect(list.parentNode).is.null;
				});

				describe('Set custom popup template', function() {
					it('Should show this template inside popup', function() {
						const tpl =
							'<form class="form_url"><input ref="url_input" type="url"><button>save</button></form>';

						const editor = new Jodit(appendTestArea(), {
							link: {
								formTemplate: function() {
									return tpl;
								}
							}
						});

						editor.value = '123';
						editor.selection.select(editor.editor.firstChild);

						clickButton('link', editor);

						const popup = editor.container.querySelector(
							'.jodit_toolbar_popup'
						);

						expect(
							sortAttributes(
								popup.querySelector('form').outerHTML
							)
						).equals(tpl);

						const url = editor.container.querySelector(
							'[ref=url_input]'
						);
						expect(url).is.not.null;

						url.focus();
						url.value = 'tests/artio.jpg';

						simulateEvent('submit', 0, popup.querySelector('form'));

						expect(sortAttributes(editor.value)).equals(
							'<a href="tests/artio.jpg">123</a>'
						);
					});

					describe('Add class name in form', function() {
						it('Should show form with this class', function() {
							const editor = new Jodit(appendTestArea(), {
								link: {
									formClassName: 'bootstrap_form'
								}
							});

							clickButton('link', editor);

							const form = editor.container.querySelector(
								'.jodit_toolbar_popup form'
							);

							expect(form).is.not.null;
							expect(form.classList.contains('bootstrap_form')).is
								.true;
						});
					});
				});

				describe('On selected content', function() {
					describe('Selected text', function() {
						it('Should wrap selected text in link', function() {
							const editor = new Jodit(appendTestArea(), {
								toolbarAdaptive: false
							});

							editor.value = 'test <span style="color: #ccc;">select </span> stop';

							const range = editor.selection.createRange();

							range.setStart(
								editor.editor.querySelector('span').firstChild,
								0
							);
							range.setEnd(
								editor.editor.querySelector('span').firstChild,
								6
							);

							editor.selection.selectRange(range);

							simulateEvent(
								'mousedown',
								0,
								editor.container.querySelector(
									'.jodit_toolbar_btn.jodit_toolbar_btn-link'
								)
							);

							const popup = editor.container.querySelector(
								'.jodit_toolbar_popup'
							);
							expect(popup).is.not.null;

							expect(
								editor.ownerWindow.getComputedStyle(popup)
									.display
							).equals('block');

							expect(
								editor.container.querySelector(
									'.jodit_toolbar_btn.jodit_toolbar_btn-link .jodit_unlink_button'
								).style.display
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
								editor.container.querySelector(
									'.jodit_toolbar_btn.jodit_toolbar_btn-link .jodit_form'
								)
							);

							expect(sortAttributes(editor.value)).equals(
								'test <span style="color:#ccc"><a href="tests/artio.jpg">select</a> </span> stop'
							);

							simulateEvent('mousedown', 0, editor.editor);

							expect(popup.parentNode).is.null;
						});
					});

					describe('Selected image', function() {
						describe('On open popup', function() {
							it('Should hide text input', function() {
								const editor = new Jodit(appendTestArea(), {
									toolbarAdaptive: false,
									observer: {
										timeout: 0
									}
								});

								editor.value =
									'test <img style="width: 100px;height: 100px" src="https://xdsoft.net/jodit/build/images/artio.jpg" alt=""> stop';

								editor.selection.select(
									editor.editor.querySelector('img')
								);

								simulateEvent(
									'mousedown',
									0,
									editor.container.querySelector(
										'.jodit_toolbar_btn.jodit_toolbar_btn-link'
									)
								);

								const popup = editor.container.querySelector(
									'.jodit_toolbar_popup'
								);

								const text = popup.querySelector(
									'[ref=content_input_box]'
								);

								expect(
									editor.ownerWindow.getComputedStyle(text)
										.display
								).equals('none');
							});
						});

						it('Should wrap selected image in link', function() {
							const editor = new Jodit(appendTestArea(), {
								toolbarAdaptive: false,
								observer: {
									timeout: 0
								}
							});

							editor.value =
								'test <img style="width: 100px;height: 100px" src="https://xdsoft.net/jodit/build/images/artio.jpg" alt=""> stop';

							editor.selection.select(
								editor.editor.querySelector('img')
							);

							simulateEvent(
								'mousedown',
								0,
								editor.container.querySelector(
									'.jodit_toolbar_btn.jodit_toolbar_btn-link'
								)
							);

							const popup = editor.container.querySelector(
								'.jodit_toolbar_popup'
							);
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
								editor.container.querySelector(
									'.jodit_toolbar_btn.jodit_toolbar_btn-link .jodit_form'
								)
							);

							expect(sortAttributes(editor.value)).equals(
								'test <a href="tests/artio.jpg"><img alt="" src="https://xdsoft.net/jodit/build/images/artio.jpg" style="height:100px;width:100px"></a> stop'
							);

							simulateEvent('mousedown', 0, editor.editor);

							expect(popup.parentNode).is.null;
						});
					});
				});

				it('Should restore source text after user clicked on Unlink button', function() {
					const editor = new Jodit(appendTestArea(), {
						observer: {
							timeout: 0
						}
					});

					editor.value =
						'<a target="_blank" rel="nofollow" href="#test">test</a>';

					const sel = editor.selection.sel,
						range = editor.selection.createRange();

					range.selectNode(editor.editor.firstChild);
					sel.removeAllRanges();
					sel.addRange(range);

					simulateEvent(
						'mousedown',
						0,
						editor.container.querySelector(
							'.jodit_toolbar_btn.jodit_toolbar_btn-link'
						)
					);

					expect(
						editor.container.querySelector(
							'.jodit_toolbar_btn.jodit_toolbar_btn-link input[name=url]'
						).value
					).equals('#test');

					expect(
						editor.container.querySelector(
							'.jodit_toolbar_btn.jodit_toolbar_btn-link input[name=target]'
						).checked
					).is.true;

					expect(
						editor.container.querySelector(
							'.jodit_toolbar_btn.jodit_toolbar_btn-link input[name=nofollow]'
						).checked
					).is.true;

					expect(
						editor.container.querySelector(
							'.jodit_toolbar_btn.jodit_toolbar_btn-link .jodit_unlink_button'
						).style.display
					).does.not.equal('none');

					expect(
						editor.container.querySelector(
							'.jodit_toolbar_btn.jodit_toolbar_btn-link [ref=insert]'
						).innerHTML
					).equals(editor.i18n('Update'));

					simulateEvent(
						'click',
						0,
						editor.container.querySelector(
							'.jodit_toolbar_btn.jodit_toolbar_btn-link [ref=unlink]'
						)
					);

					expect(sortAttributes(editor.value)).equals('test');
				});
			});

			describe('Was selected part of text', function() {
				it('Should show dialog form with this text', function() {
					const editor = new Jodit(appendTestArea());

					editor.value = '<p>one green bottle hanging under wall</p>';
					const range = editor.selection.createRange();
					range.setStart(editor.editor.firstChild.firstChild, 10);
					range.setEnd(editor.editor.firstChild.firstChild, 16);
					editor.selection.selectRange(range);

					clickButton('link', editor);

					const popup = editor.container.querySelector(
						'.jodit_toolbar_popup'
					);

					const textInput = popup.querySelector(
						'input[ref=content_input]'
					);
					expect(textInput).is.not.null;

					expect(textInput.value).equals('bottle');
				});
			});

			describe('Was selected part of html', function() {
				it('Should show dialog form with selection text content from this HTML', function() {
					const editor = new Jodit(appendTestArea());

					editor.value =
						'<p>one green <strong>bottle hanging</strong> under wall</p>' +
						'<p>two green <em>bottles hanging</em> under wall</p>';

					const range = editor.selection.createRange();
					range.setStart(editor.editor.firstChild.firstChild, 4);
					range.setEnd(editor.editor.lastChild.lastChild, 6);
					editor.selection.selectRange(range);

					clickButton('link', editor);

					const popup = editor.container.querySelector(
						'.jodit_toolbar_popup'
					);

					const textInput = popup.querySelector(
						'input[ref=content_input]'
					);
					expect(textInput).is.not.null;

					expect(textInput.value).equals(
						'green bottle hanging under wall two green bottles hanging under'
					);
				});

				describe('Was selected image', function() {
					describe('Image had not anchor parent', function() {
						it('Should show dialog without content input and after submit wrap this image', function() {
							const editor = new Jodit(appendTestArea());

							editor.value =
								'<p>one green <img src="https://xdsoft.net/jodit/build/images/artio.jpg" alt="test"> under wall</p>';

							editor.selection.select(
								editor.editor.querySelector('img')
							);

							clickButton('link', editor);

							const popup = editor.container.querySelector(
								'.jodit_toolbar_popup'
							);

							const textInput = popup.querySelector(
								'input[ref=content_input]'
							);

							expect(
								textInput.parentElement.style.display
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
								0,
								popup.querySelector('form')
							);

							expect(sortAttributes(editor.value)).equals(
								'<p>one green <a href="https://xdsoft.net"><img alt="test" src="https://xdsoft.net/jodit/build/images/artio.jpg"></a> under wall</p>'
							);
						});
					});
				});

				describe('After submit this part', function() {
					it('should be wrapped inside anchor', function() {
						const editor = new Jodit(appendTestArea());

						editor.value =
							'<p>one green <strong>bottle hanging</strong> under wall</p>' +
							'<p>two green <em>bottles hanging</em> under wall</p>';

						const range = editor.selection.createRange();
						range.setStart(editor.editor.firstChild.firstChild, 4);
						range.setEnd(editor.editor.lastChild.lastChild, 6);
						editor.selection.selectRange(range);

						clickButton('link', editor);

						const popup = editor.container.querySelector(
							'.jodit_toolbar_popup'
						);

						const form = popup.querySelector('.jodit_form');
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
});
