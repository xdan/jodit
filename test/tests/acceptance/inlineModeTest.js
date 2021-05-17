/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test Inline mode', function () {
	describe('init with inline option', function () {
		describe('For TEXTAREA', function () {
			it('Should hide textarea like standart mode', function () {
				const area = appendTestArea(),
					editor = new Jodit(area, {
						inline: true
					});

				expect(editor.container).does.not.equal(area);
				expect(editor.container.classList.contains('jodit_inline')).is
					.true;
				expect(editor.container.nextSibling).equals(area);
				expect(area.style.display).equals('none');
				expect(area.value).equals(editor.value);
			});
		});

		describe('For DIV', function () {
			it('Should use this element like container', function () {
				const div = appendTestDiv(),
					value = '<p>HTML</p>';

				div.innerHTML = value;

				const editor = new Jodit(div, {
					inline: true,
					observer: {
						timeout: 0
					}
				});

				expect(editor.container).equals(div);
				expect(editor.container.classList.contains('jodit_inline')).is
					.true;
				expect(editor.container.querySelector('.jodit-workplace')).is
					.not.null;
				expect(editor.container.querySelector('.jodit-wysiwyg')).is.not
					.null;
				expect(editor.ownerWindow.getComputedStyle(div).display).equals(
					'block'
				);
				expect(value).equals(editor.value);
			});
		});

		describe('For H1', function () {
			it('Should use this element like container', function () {
				const div = document.createElement('h1'),
					value = 'HTML';

				div.innerHTML = value;

				getBox().appendChild(div);

				const editor = new Jodit(div, {
					disablePlugins: ['WrapTextNodes'],
					inline: true,
					observer: {
						timeout: 0
					}
				});

				expect(editor.container).equals(div);
				expect(editor.container.classList.contains('jodit_inline')).is
					.true;
				expect(editor.container.querySelector('.jodit-workplace')).is
					.not.null;
				expect(editor.container.querySelector('.jodit-wysiwyg')).is.not
					.null;
				expect(editor.ownerWindow.getComputedStyle(div).display).equals(
					'block'
				);
				expect(value).equals(editor.value);

				div.parentNode.removeChild(div);
			});
		});
	});

	describe('Destruct Jodit', function () {
		describe('For TEXTAREA', function () {
			it('Should show textarea like standart mode', function () {
				const area = appendTestArea(),
					editor = new Jodit(area, {
						inline: true
					});

				editor.destruct();
				expect(area.style.display).does.not.equal('none');
			});
		});
		describe('For DIV', function () {
			it('Should remove all extra classes and remove all extra elements', function () {
				const div = appendTestDiv(),
					value = '<p>HTML</p>';

				div.style.display = 'block';
				div.innerHTML = value;

				const editor = new Jodit(div, {
					inline: true,
					observer: {
						timeout: 0
					}
				});

				editor.destruct();

				expect(editor.ownerWindow.getComputedStyle(div).display).equals(
					'block'
				);

				expect(div.innerHTML).equals(value);
				expect(div.className.toString()).equals('');
			});
		});
	});

	describe('Inline popups', function () {
		describe('Click on Image', function () {
			it('Should show inline popup', function () {
				const editor = getJodit();

				editor.value = '<p>test <img/> test</p>';
				const img = editor.editor.querySelector('img');
				simulateEvent('click', 0, img);

				const popup = getOpenedPopup(editor);
				expect(popup).is.not.null;
			});

			describe('Disable toolbarInline = false', function () {
				it('Should show inline popup', function () {
					const editor = getJodit({
						toolbarInline: false
					});

					editor.value = '<p>test <img/> test</p>';
					const img = editor.editor.querySelector('img');
					simulateEvent('click', 0, img);
					const popup = getOpenedPopup(editor);

					expect(popup).is.null;
				});
			});

			describe('Click in the right side of editor', function () {
				it('Should open inline-popup with float by right editor side', function () {
					getBox().style.width = 'auto';

					const editor = getJodit({
						disablePlugins: 'mobile'
					});

					editor.value =
						'<p>test <img style="width: 30px; float: right"/> test</p>';
					editor.s.focus();

					simulateEvent(
						'click',
						0,
						editor.editor.querySelector('img')
					);

					const popup = getOpenedPopup(editor);

					expect(popup).not.null;

					const positionPopup = offset(popup);
					const positionContainer = offset(editor.container);

					expect(
						Math.abs(
							positionPopup.left +
								positionPopup.width -
								(positionContainer.left +
									positionContainer.width)
						) < 20
					).is.true;
				});

				describe('Click in the right side of editor in window with scroll', function () {
					it('Should open inline-popup with float by right editor side', function () {
						getBox().style.width = 'auto';
						const brs = [];

						for (let i = 0; i < 100; i += 1) {
							const br = document.createElement('br');
							document.body.appendChild(br);
							brs.push(br);
						}

						const editor = getJodit({
							disablePlugins: 'mobile'
						});

						editor.value =
							'<p>test <img style="width: 30px; float: right"/> test</p>';
						editor.s.focus();

						simulateEvent(
							'click',
							0,
							editor.editor.querySelector('img')
						);

						const popup = getOpenedPopup(editor);

						expect(popup).to.not.null;

						const positionPopup = offset(popup);
						const positionContainer = offset(editor.container);

						expect(
							Math.abs(
								positionPopup.left +
									positionPopup.width -
									(positionContainer.left +
										positionContainer.width)
							) < 20
						).to.true;

						brs.forEach(function (br) {
							br.parentNode && br.parentNode.removeChild(br);
						});
					});
				});
			});

			describe('Recalculate position after Scroll', function () {
				it('Should reacalc inline popup position', function () {
					const editor = getJodit({
						height: 500
					});

					editor.value =
						'<p>test' +
						'<br>'.repeat(20) +
						' <img style="width:100px;height:100px;" src="tests/artio.jpg"/> ' +
						'<br>'.repeat(20) +
						'test</p>';

					const img = editor.editor.querySelector('img');
					img.scrollIntoView();

					simulateEvent('click', 0, img);
					const popup = getOpenedPopup(editor);
					expect(popup).is.not.null;

					let imgPosition = offset(img);
					let popupPosition = offset(popup);

					expect(
						Math.abs(
							popupPosition.top -
								(imgPosition.top + imgPosition.height) -
								10
						) < 20
					).is.true;

					editor.editor.scrollTop = editor.editor.scrollTop + 50;
					simulateEvent('scroll', 0, editor.editor);

					imgPosition = offset(img);
					popupPosition = offset(popup);

					expect(
						Math.abs(
							popupPosition.top -
								(imgPosition.top + imgPosition.height) -
								10
						) < 20
					).is.true;
				});
			});

			describe('Popup position outside of editor', function () {
				it('Should hide inline popup', function () {
					const editor = getJodit({
						height: 500
					});
					editor.value =
						'<p>test' +
						'<br>'.repeat(20) +
						' <img style="width:100px;height:100px;" src="tests/artio.jpg"/> ' +
						'<br>'.repeat(120) +
						'test</p>';

					const img = editor.editor.querySelector('img');
					img.scrollIntoView();
					simulateEvent('click', 0, img);
					const popup = getOpenedPopup(editor);
					expect(popup).is.not.null;

					const imgPosition = offset(img);
					const popupPosition = offset(popup);

					expect(
						Math.abs(
							popupPosition.top -
								(imgPosition.top + imgPosition.height) -
								10
						) < 20
					).is.true;

					editor.editor.scrollTop += 1000;
					simulateEvent('scroll', 0, editor.editor);

					expect(popup.parentNode).is.not.null;

					img.scrollIntoView();
					simulateEvent('scroll', 0, editor.editor);

					expect(popup.parentNode).is.not.null;
				});
			});
		});

		describe('Click on link', function () {
			it('Should show inline popup', function () {
				const editor = new Jodit(appendTestDiv());
				editor.value = '<p>test <a href="#test">test</a> test</p>';
				const a = editor.editor.querySelector('a');
				simulateEvent('click', 0, a);
				const popup = getOpenedPopup(editor);
				expect(popup).is.not.null;
			});

			describe('Disable with toolbarInlineDisableFor', function () {
				describe('Option like string', function () {
					it('Should now show inline popup for link', function () {
						const editor = new Jodit(appendTestDiv(), {
							toolbarInline: true,
							toolbarInlineDisableFor: 'a,IMG'
						});

						editor.value =
							'<table><tr><td>1</td></tr></table><p>test <a href="#test">test</a> <img style="width:30px" src="tests/artio.jpg">> test</p>';
						const a = editor.editor.querySelector('a');
						const img = editor.editor.querySelector('img');
						const td = editor.editor.querySelector('td');
						simulateEvent('click', a);

						let popup = getOpenedPopup(editor);
						expect(popup).is.null;

						simulateEvent('click', img);
						popup = getOpenedPopup(editor);

						expect(popup).is.null;

						simulateEvent('click', td);
						popup = getOpenedPopup(editor);

						expect(popup).is.null;
					});
				});

				describe('Option like array', function () {
					it('Should now show inline popup for link', function () {
						const editor = new Jodit(appendTestDiv(), {
							toolbarInline: true,
							toolbarInlineDisableFor: ['A', 'cells']
						});

						editor.value =
							'<table><tr><td>1</td></tr></table><p>test <a href="#test">test</a> <img style="width:30px;height:30px;" src="tests/artio.jpg">> test</p>';

						const a = editor.editor.querySelector('a');
						const img = editor.editor.querySelector('img');
						const td = editor.editor.querySelector('td');

						simulateEvent('click', a);

						let popup = getOpenedPopup(editor);
						expect(popup).is.null;

						simulateEvent('click', img);
						popup = getOpenedPopup(editor);

						expect(popup).is.not.null;

						simulateEvent('click', editor.editor);

						simulateEvent(['mousedown', 'mouseup', 'click'], td);

						popup = getOpenedPopup(editor);

						expect(popup).is.null;
					});
				});
			});
		});

		describe('Click on table cell', function () {
			it('Should show inline popup', function () {
				const editor = getJodit();
				editor.value =
					'<table><tr><td>test test</a> test</td></tr></table>';

				const td = editor.editor.querySelector('td');
				simulateEvent(['mousedown', 'mouseup', 'click'], 0, td);

				const popup = getOpenedPopup(editor);
				expect(popup).is.not.null;
			});
		});

		describe('Selection some text inside the editor', function () {
			it('Should show inline popup', function () {
				const editor = new Jodit(appendTestDiv(), {
					preset: 'inline'
				});

				editor.value = 'test<br>test';

				simulateEvent('mousedown', editor.ed);
				editor.s.select(editor.editor.firstChild);
				simulateEvent('mouseup', editor.ed);

				const popup = getOpenedPopup(editor);
				expect(popup).is.not.null;
			});

			describe('In readonly mode', function () {
				it('Should not show inline popup', function () {
					const editor = new Jodit(appendTestDiv(), {
						preset: 'inline',
						readonly: true
					});
					editor.value = 'test<br>test';
					simulateEvent('mousedown', editor.ed);
					editor.s.select(editor.editor.firstChild);
					simulateEvent('mouseup', editor.ed);
					const popup = getOpenedPopup(editor);
					expect(popup).is.null;
				});

				describe('After disable readonly mode', function () {
					it('Should show inline popup', function () {
						const editor = new Jodit(appendTestDiv(), {
							preset: 'inline',
							readonly: true
						});
						editor.value = 'test<br>test';
						simulateEvent('mousedown', editor.ed);
						editor.s.select(editor.editor.firstChild);
						simulateEvent('mouseup', editor.ed);

						let popup = getOpenedPopup(editor);
						expect(popup).is.null;

						editor.setReadOnly(false);

						simulateEvent('mousedown', editor.ed);
						editor.s.select(editor.editor.firstChild);
						simulateEvent('mouseup', editor.ed);
						popup = getOpenedPopup(editor);
						expect(popup).is.not.null;

						expect(
							editor.ownerWindow.getComputedStyle(popup).display
						).equals('block');
					});
				});
			});

			describe('After then selection was collapsed', function () {
				it('Should hide inline popup', function () {
					const editor = new Jodit(appendTestDiv(), {
						preset: 'inline'
					});
					editor.value = 'test<br>test';

					simulateEvent('mousedown', editor.ed);
					editor.s.select(editor.editor.firstChild);
					simulateEvent('mouseup', editor.ed);

					const popup = getOpenedPopup(editor);
					expect(popup).is.not.null;
					const range = editor.s.createRange();
					range.setStart(editor.editor.firstChild, 0);
					range.collapse(true);
					editor.s.selectRange(range);
					simulateEvent('click', editor.editor);
					expect(popup.parentNode).is.null;
				});
			});

			describe('Select some text in one editor and after this select focus in another', function () {
				it('Should hide inline popup in first', function () {
					const editor = new Jodit(appendTestDiv(), {
							preset: 'inline',
							observer: {
								timeout: 0
							}
						}),
						editor2 = new Jodit(appendTestDiv(), {
							preset: 'inline',
							observer: {
								timeout: 0
							}
						});

					expect(editor.async).does.not.equal(editor2.async);

					editor.value = 'test<br>test';
					editor2.value = 'test<br>test';

					simulateEvent('mousedown', editor.ed);
					editor.s.select(editor.editor.firstChild);
					simulateEvent('mouseup', editor.ed);

					const popup = getOpenedPopup(editor);
					expect(popup).is.not.null;
					expect(popup.parentNode).is.not.null;

					const range = editor2.ed.createRange();
					range.setStart(editor2.editor.firstChild, 0);
					range.collapse(true);
					editor2.s.selectRange(range);
					simulateEvent('click', editor2.ownerWindow);

					expect(popup.parentNode).is.null;
				});
			});

			describe('Click on `link` button in this popup', function () {
				it('Should show second popup', function (done) {
					const editor = getJodit(
						{
							preset: 'inline'
						},
						appendTestDiv()
					);

					editor.value = '<p>|test <img/> test|</p>';
					setCursorToChar(editor);

					simulateEvent('mousedown', editor.ed);
					editor.s.select(editor.editor.firstChild);
					simulateEvent('mouseup', editor.ed);

					const popup = getOpenedPopup(editor);
					expect(popup).is.not.null;

					clickButton('link', popup);
					const linkPopup = getOpenedPopup(editor);
					expect(linkPopup).is.not.null;
					expect(linkPopup).does.not.eq(popup);

					const input = linkPopup.querySelector(
							'[data-ref="url_input"]'
						),
						button = linkPopup.querySelector('[data-ref="insert"]');

					simulateEvent(
						['mousedown', 'mouseup', 'click', 'focus'],
						input
					);

					input.focus();

					simulateEvent('selectionchange', editor.editor);

					simulateEvent('mouseup', input);

					setTimeout(function () {
						expect(getOpenedPopup(editor)).eq(linkPopup);

						input.value = 'https://xdsoft.net/jodit/';

						button.click();
						expect(getOpenedPopup(editor)).eq(popup);

						expect(sortAttributes(editor.value)).eq(
							'<p><a href="https://xdsoft.net/jodit/">test <img> test</a></p>'
						);

						done();
					}, 1000);
				});
			});
		});
	});

	describe('In iframe mode', function () {
		describe('Inline popups', function () {
			describe('Click on Image', function () {
				it('Should show inline popup', function (done) {
					unmockPromise();

					Jodit.make(appendTestDiv(), {
						iframe: true,
						events: {
							afterConstructor: function (editor) {
								editor.value = '<p>test <img/> test</p>';
								const img = editor.editor.querySelector('img');

								simulateEvent('click', 0, img);
								const popup = getOpenedPopup(editor);
								expect(popup).is.not.null;
								done();
							}
						}
					});
				});

				describe('Disable toolbarInline = false', function () {
					it('Should show inline popup', function (done) {
						unmockPromise();
						Jodit.make(appendTestDiv(), {
							toolbarInline: false,
							iframe: true,
							events: {
								afterConstructor: function (editor) {
									editor.value = '<p>test <img/> test</p>';
									const img =
										editor.editor.querySelector('img');
									simulateEvent('click', 0, img);
									const popup = getOpenedPopup(editor);
									expect(popup).is.null;
									done();
								}
							}
						});
					});
				});
			});

			describe('Click on Image', function () {
				describe('On mobile', function () {
					it('Should show inline popup', function (done) {
						unmockPromise();
						Jodit.make(appendTestDiv(), {
							iframe: true,
							events: {
								afterConstructor: function (editor) {
									editor.value = '<p>test <img/> test</p>';
									const img =
										editor.editor.querySelector('img');
									simulateEvent('click', 0, img);
									const popup = getOpenedPopup(editor);
									expect(popup).is.not.null;
									done();
								}
							}
						});
					});
				});
			});

			describe('Click on link', function () {
				it('Should show inline popup', function (done) {
					unmockPromise();
					Jodit.make(appendTestDiv(), {
						iframe: true,
						events: {
							afterConstructor: function (editor) {
								editor.value =
									'<p>test <a href="#test">test</a> test</p>';
								const a = editor.editor.querySelector('a');
								simulateEvent('click', 0, a);
								const popup = getOpenedPopup(editor);
								expect(popup).is.not.null;
								done();
							}
						}
					});
				});

				describe('Disable with toolbarInlineDisableFor', function () {
					describe('Option like string', function () {
						it('Should not show inline popup for link', function (done) {
							unmockPromise();
							Jodit.make(appendTestDiv(), {
								iframe: true,
								toolbarInline: true,
								toolbarInlineDisableFor: 'a,IMG',
								events: {
									afterConstructor: function (editor) {
										editor.value =
											'<table><tr><td>1</td></tr></table><p>test <a href="#test">test</a> <img style="width:30px" src="tests/artio.jpg">> test</p>';

										const a =
											editor.editor.querySelector('a');
										const img =
											editor.editor.querySelector('img');
										const td =
											editor.editor.querySelector('td');

										simulateEvent('click', 0, a);

										let popup = getOpenedPopup(editor);
										expect(popup).is.null;

										simulateEvent('click', 0, img);
										popup = getOpenedPopup(editor);

										expect(popup).is.null;

										simulateEvent('click', editor.editor); // hide previous popup
										simulateEvent(
											['mousedown', 'mouseup', 'click'],
											td
										);
										popup = getOpenedPopup(editor);

										expect(popup).is.not.null;
										done();
									}
								}
							});
						});
					});

					describe('Option like array', function () {
						it('Should not show inline popup for link', function (done) {
							unmockPromise();
							Jodit.make(appendTestDiv(), {
								iframe: true,
								toolbarInline: true,
								toolbarInlineDisableFor: ['A', 'cells'],
								events: {
									afterConstructor: function (editor) {
										editor.value =
											'<table><tr><td>1</td></tr></table><p>test <a href="#test">test</a> <img style="width:30px" src="tests/artio.jpg">> test</p>';
										const a =
											editor.editor.querySelector('a');
										const img =
											editor.editor.querySelector('img');
										const td =
											editor.editor.querySelector('td');
										simulateEvent('click', a);

										let popup = getOpenedPopup(editor);
										expect(popup).is.null;

										simulateEvent('click', img);
										popup = getOpenedPopup(editor);

										expect(popup).is.not.null;

										simulateEvent('click', editor.editor); // hide previous popup

										simulateEvent(
											['mousedown', 'mouseup', 'click'],
											td
										);
										popup = getOpenedPopup(editor);

										expect(popup).is.null;

										done();
									}
								}
							});
						});
					});
				});
			});

			describe('Click on table cell', function () {
				it('Should show inline popup', function (done) {
					unmockPromise();
					Jodit.make(appendTestDiv(), {
						iframe: true,
						events: {
							afterConstructor: function (editor) {
								editor.value =
									'<table><tr><td>test test</a> test</td></tr></table>';

								const td = editor.editor.querySelector('td'),
									pos = Jodit.modules.Helpers.position(td);

								simulateEvent(
									['mousedown', 'mouseup', 'click'],
									td,
									function (o) {
										o.clientX = pos.left + 5;
										o.clientY = pos.top + 5;
									}
								);

								const popup = getOpenedPopup(editor);
								expect(popup).is.not.null;

								done();
							}
						}
					});
				});
			});

			describe('Selection some text inside the editor', function () {
				it('Should show inline popup', function (done) {
					unmockPromise();
					Jodit.make(appendTestDiv(), {
						preset: 'inline',
						iframe: true,
						events: {
							afterConstructor: function (editor) {
								editor.value = 'test<br>test';

								simulateEvent('mousedown', editor.ed);
								editor.s.select(editor.editor.firstChild);
								simulateEvent('mouseup', editor.ed);

								const popup = getOpenedPopup(editor);
								expect(popup).is.not.null;
								done();
							}
						}
					});
				});
			});
		});
	});
});
