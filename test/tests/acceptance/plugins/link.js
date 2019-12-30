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
		describe('Click LINk button', function() {
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

					expect(popup_opened).to.equal(2);
					expect(
						editor.ownerWindow.getComputedStyle(list).display
					).to.equal('block');
					expect(
						editor.container.querySelector(
							'.jodit_toolbar_btn.jodit_toolbar_btn-link .jodit_unlink_button'
						).style.display
					).to.equal('none');

					const url = editor.container.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-link input[name=url]'
					);
					expect(url).to.be.not.equal(null);

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

					expect(url.classList.contains('jodit_error')).to.be.true;

					url.focus();
					url.value = 'tests/artio.jpg';
					simulateEvent(
						'submit',
						0,
						editor.container.querySelector(
							'.jodit_toolbar_btn.jodit_toolbar_btn-link .jodit_form'
						)
					);

					expect(sortAttributes(editor.value)).to.equal(
						'<a href="tests/artio.jpg">123</a>'
					);

					simulateEvent('mousedown', 0, editor.editor);

					expect(list.parentNode).to.equal(null);
				});

				describe('On selected content', function() {
					describe('Selected text', function() {
						it('Should wrap selected text in link', function() {
							const editor = new Jodit(appendTestArea(), {
								toolbarAdaptive: false,
								observer: {
									timeout: 0
								}
							});

							editor.value = 'test <span>select</span> stop';

							const range = editor.editorDocument.createRange();
							range.selectNodeContents(
								editor.editor.querySelector('span')
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
							expect(popup).to.be.not.equal(null);

							expect(
								editor.ownerWindow.getComputedStyle(popup)
									.display
							).to.equal('block');

							expect(
								editor.container.querySelector(
									'.jodit_toolbar_btn.jodit_toolbar_btn-link .jodit_unlink_button'
								).style.display
							).to.equal('none');

							const url = popup.querySelector('[ref=url_input]');
							expect(url).to.be.not.equal(null);

							const text = popup.querySelector(
								'[ref=content_input]'
							);
							expect(text).to.be.not.equal(null);

							expect(text.value).to.equal('select');

							url.focus();
							url.value = 'tests/artio.jpg';
							simulateEvent(
								'submit',
								0,
								editor.container.querySelector(
									'.jodit_toolbar_btn.jodit_toolbar_btn-link .jodit_form'
								)
							);

							expect(sortAttributes(editor.value)).to.equal(
								'test <a href="tests/artio.jpg">select</a> stop'
							);

							simulateEvent('mousedown', 0, editor.editor);

							expect(popup.parentNode).to.equal(null);
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
								).to.equal('none');
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
							expect(popup).to.be.not.equal(null);
							expect(
								editor.ownerWindow.getComputedStyle(popup)
									.display
							).to.equal('block');

							const url = popup.querySelector('[ref=url_input]');
							const text = popup.querySelector(
								'[ref=content_input]'
							);

							expect(text.value).to.equal('');

							url.focus();
							url.value = 'tests/artio.jpg';

							simulateEvent(
								'submit',
								0,
								editor.container.querySelector(
									'.jodit_toolbar_btn.jodit_toolbar_btn-link .jodit_form'
								)
							);

							expect(sortAttributes(editor.value)).to.equal(
								'test <a href="tests/artio.jpg"><img alt="" src="https://xdsoft.net/jodit/build/images/artio.jpg" style="height:100px;width:100px"></a> stop'
							);

							simulateEvent('mousedown', 0, editor.editor);

							expect(popup.parentNode).to.equal(null);
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

					const sel = editor.editorWindow.getSelection(),
						range = editor.editorDocument.createRange();

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
					).to.equal('#test');

					expect(
						editor.container.querySelector(
							'.jodit_toolbar_btn.jodit_toolbar_btn-link input[name=target]'
						).checked
					).to.equal(true);

					expect(
						editor.container.querySelector(
							'.jodit_toolbar_btn.jodit_toolbar_btn-link input[name=nofollow]'
						).checked
					).to.equal(true);

					expect(
						editor.container.querySelector(
							'.jodit_toolbar_btn.jodit_toolbar_btn-link .jodit_unlink_button'
						).style.display
					).to.be.not.equal('none');

					expect(
						editor.container.querySelector(
							'.jodit_toolbar_btn.jodit_toolbar_btn-link [ref=insert]'
						).innerHTML
					).to.equal(editor.i18n('Update'));

					simulateEvent(
						'click',
						0,
						editor.container.querySelector(
							'.jodit_toolbar_btn.jodit_toolbar_btn-link [ref=unlink]'
						)
					);

					expect(sortAttributes(editor.value)).to.equal('test');
				});
			});
		});
	});
});
