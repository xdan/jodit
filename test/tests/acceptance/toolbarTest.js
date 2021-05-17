/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Toolbar', function () {
	it('Should have buttons', function () {
		const editor = getJodit({
			toolbarAdaptive: true
		});

		expect(
			editor.toolbar.container.querySelectorAll('.jodit-toolbar-button')
				.length
		).equals(37);
	});

	describe('Custom buttons', function () {
		it('should create normal button in toolbar', function () {
			const editor = getJodit({
				toolbarAdaptive: false,
				buttons: [
					'image',
					{
						name: 'alert_some',
						iconURL:
							'https://xdsoft.net/jodit/build/images/icons/045-copy.png',
						exec: function () {
							alert('test');
						}
					}
				]
			});

			const btns = Array.from(
				editor.toolbar.container.querySelectorAll('[role="listitem"]')
			);

			expect(btns.length).equals(2);

			btns.forEach(function (btn) {
				const icon = btn.querySelector('.jodit-icon');

				expect(icon).is.not.null;

				const style = window.getComputedStyle(icon),
					height = parseInt(style.height),
					width = parseInt(style.width);

				expect(width).to.be.above(5);
				expect(height).to.be.above(5);
			});
		});

		describe('Use controls', function () {
			it('should create normal button in toolbar', function () {
				const editor = getJodit({
					toolbarAdaptive: false,
					controls: {
						alert_some: {
							name: 'alert_some',
							iconURL:
								'https://xdsoft.net/jodit/build/images/icons/045-copy.png',
							exec: function () {
								editor.s.insertHTML(
									'<p><span>indigo</span></p>'
								);
							}
						}
					},
					buttons: ['image', 'alert_some']
				});

				expect(editor.toolbar.getButtonsNames().toString()).equals(
					'image,alert_some'
				);

				clickButton('alert_some', editor);

				expect(editor.value).equals('<p><span>indigo</span></p>');
			});
		});
	});

	describe('Custom icons', function () {
		describe('By default for unknown icons', function () {
			it('should create button as text mode', function () {
				const editor = getJodit({
					toolbarAdaptive: false,
					buttons: ['rect']
				});

				expect(
					sortAttributes(getButton('rect', editor).innerHTML)
				).equals(
					'<span class="jodit-toolbar-button__icon"></span><span class="jodit-toolbar-button__text">rect</span>'
				);
			});
		});

		describe('Use getIcon event', function () {
			it('should create buttons with custom icons', function () {
				const editor = getJodit({
					toolbarAdaptive: false,
					buttons: ['image', 'redo', 'about'],
					events: {
						getIcon: function (name, control, clearName) {
							var code = clearName;

							switch (clearName) {
								case 'redo':
									code = 'rotate-right';
									break;
								case 'about':
									code = 'question';
									break;
							}

							return (
								'<i style="font-size:14px" class="fa fa-' +
								code +
								' fa-xs"></i>'
							);
						}
					}
				});

				expect(editor.toolbar.getButtonsNames().toString()).equals(
					'image,redo,about'
				);

				expect(
					sortAttributes(getButton('image', editor).innerHTML)
				).equals(
					'<span class="jodit-toolbar-button__icon">' +
						'<i class="fa fa-image fa-xs jodit-icon_image jodit-icon" style="font-size:14px"></i>' +
						'</span><span class="jodit-toolbar-button__text"></span>'
				);

				expect(
					sortAttributes(getButton('redo', editor).innerHTML)
				).equals(
					'<span class="jodit-toolbar-button__icon">' +
						'<i class="fa fa-rotate-right fa-xs jodit-icon_redo jodit-icon" style="font-size:14px"></i>' +
						'</span><span class="jodit-toolbar-button__text"></span>'
				);

				expect(
					sortAttributes(getButton('about', editor).innerHTML)
				).equals(
					'<span class="jodit-toolbar-button__icon">' +
						'<i class="fa fa-question fa-xs jodit-icon_about jodit-icon" style="font-size:14px"></i>' +
						'</span><span class="jodit-toolbar-button__text"></span>'
				);
			});
		});

		const rect =
				'<svg width="400" height="110"><rect width="300" height="100"/></svg>',
			rectResult =
				'<span class="jodit-toolbar-button__icon">' +
				'<svg class="jodit-icon_rect jodit-icon" height="110" width="400"><rect height="100" width="300"></rect></svg>' +
				'</span><span class="jodit-toolbar-button__text"></span>';

		describe('Use extraButtons options', function () {
			it('should create buttons with custom icons', function () {
				const editor = getJodit({
					toolbarAdaptive: false,
					buttons: [
						{
							name: 'rect'
						}
					],
					extraIcons: {
						rect: rect
					}
				});

				expect(editor.toolbar.getButtonsNames().toString()).equals(
					'rect'
				);

				expect(
					sortAttributes(getButton('rect', editor).innerHTML)
				).equals(rectResult);
			});
		});

		describe('Use Icon module', function () {
			it('should create buttons with custom icons', function () {
				Jodit.modules.Icon.set('rect', rect);
				const editor = getJodit({
					toolbarAdaptive: false,
					buttons: [
						{
							name: 'rect'
						}
					]
				});

				expect(
					sortAttributes(getButton('rect', editor).innerHTML)
				).equals(rectResult);
			});
		});

		describe('Use svg in icon', function () {
			it('should create buttons with custom icons', function () {
				const editor = getJodit({
					toolbarAdaptive: false,
					buttons: [
						{
							name: 'rect',
							icon: rect
						}
					]
				});

				expect(
					sortAttributes(getButton('rect', editor).innerHTML)
				).equals(rectResult.replace('jodit-icon_rect ', ''));
			});
		});
	});

	describe('Set toolbar options to false', function () {
		it('Should hide toolbar', function () {
			const editor = getJodit({
				toolbar: false
			});

			expect(null).equals(
				editor.container.querySelector('.jodit_toolbar')
			);
		});
	});

	describe('Set toolbar options to css selector', function () {
		it('Should render toolbar in different container', function () {
			const div = appendTestDiv(),
				editor = getJodit(
					{
						toolbar: div
					},
					appendTestArea()
				);

			const toolbar = document.querySelector(
				'.jodit-toolbar-editor-collection'
			);
			const defaultContainer = editor.container.querySelector(
				'.jodit-toolbar__box'
			);

			expect(toolbar).is.not.null;
			expect(div).equals(toolbar.parentElement);
			expect(defaultContainer).does.not.equal(toolbar.parentElement);
		});

		describe('After enable Fullsize mode', function () {
			it('Should render toolbar in default container', function () {
				const div = appendTestDiv(),
					editor = Jodit.make(appendTestArea(), {
						toolbar: div
					});

				const toolbar = editor.toolbar.container;
				const defaultContainer = editor.defaultToolbarContainer;

				editor.toggleFullSize(true);
				expect(defaultContainer).equals(toolbar.parentElement);

				editor.toggleFullSize(false);
				expect(div).equals(toolbar.parentElement);
			});
		});

		describe('Change toolbar container dynamically', function () {
			it('Should render toolbar in different containers every call setPanel', function () {
				const div1 = appendTestDiv(),
					div2 = appendTestDiv(),
					div3 = appendTestDiv(),
					editor = getJodit();

				const toolbar = editor.toolbar.container;
				expect(toolbar).is.not.null;

				const defaultContainer = editor.toolbarContainer;
				expect(defaultContainer).is.not.null;

				expect(defaultContainer).equals(toolbar.parentElement);

				editor.setPanel(div1);
				expect(defaultContainer).not.equals(toolbar.parentElement);
				expect(div1).equals(toolbar.parentElement);

				editor.setPanel(div2);
				expect(div2).equals(toolbar.parentElement);

				editor.setPanel(div3);
				expect(div3).equals(toolbar.parentElement);
			});
		});
	});

	describe('Popups', function () {
		describe('Click on dots buttons in mobile size', function () {
			it('Should open popup with several buttons', function () {
				getBox().style.width = '300px';
				const editor = getJodit();

				clickButton('dots', editor);

				const popup = getOpenedPopup(editor);

				expect(popup).is.not.null;

				clickButton('video', popup);

				const popup2 = getOpenedPopup(editor);
				expect(popup2).is.not.null;
				getBox().style.width = 'auto';
			});
		});

		describe('Click on some link', function () {
			describe('in the left side of editor', function () {
				it('Should open inline popup with float by left editor side', function () {
					const editor = getJodit({});

					editor.value = 'asas <a href="#">test</a>';

					simulateEvent('click', editor.editor.querySelector('a'));

					const popup = getOpenedPopup(editor);

					expect(popup).is.not.null;

					const positionPopup = offset(popup);
					const positionContainer = offset(editor.container);

					expect(true).equals(
						positionPopup.left >= positionContainer.left
					);
				});
			});
		});

		describe('Click on some button with defined popup field', function () {
			it('Should open popup in toolbar', function () {
				const editor = getJodit({
					disablePlugins: 'mobile'
				});

				clickButton('video', editor);

				const popup = getOpenedPopup(editor);

				expect(popup).is.not.null;
			});

			describe('in the left side', function () {
				it('Should open popup in toolbar with float by left editor side', function () {
					const editor = getJodit({
						buttons: ['video'],
						disablePlugins: 'mobile'
					});

					clickButton('video', editor);

					const popup = getOpenedPopup(editor);

					expect(popup).is.not.null;

					const positionPopup = offset(popup);
					const positionContainer = offset(editor.container);

					expect(true).equals(
						positionPopup.left >= positionContainer.left
					);
				});
			});

			describe('in the right side', function () {
				it('Should open popup in toolbar with float by left editor side', function () {
					const editor = getJodit({
						width: 306,
						buttons: [
							'video',
							'video',
							'video',
							'video',
							'video',
							'video',
							'video',
							'video'
						],
						disablePlugins: 'mobile'
					});

					clickButton('video', editor, 'button', true);

					const popup = getOpenedPopup(editor);

					expect(popup).is.not.null;

					const positionPopup = offset(popup);
					const positionContainer = offset(editor.container);

					expect(
						Math.abs(
							positionPopup.left +
								positionPopup.width -
								(positionContainer.left +
									positionContainer.width)
						) < 10
					).is.true;
				});
			});
		});

		getBox().style.width = 'auto';

		it('Open and close popup after clicking in another place', function () {
			const editor = getJodit({
				disablePlugins: 'mobile'
			});

			clickButton('video', editor);

			const popup = editor.ownerDocument.querySelector(
				'[role="popup"][data-editor_id="' + editor.id + '"]'
			);
			expect(popup).is.not.null;

			simulateEvent('mousedown', 0, window);

			expect(popup && popup.parentNode == null).is.true;
		});

		describe('Open list', function () {
			it('Should Open list in toolbar', function () {
				const editor = getJodit({
					toolbarAdaptive: false
				});

				clickTrigger('font', editor);

				const list = getOpenedPopup(editor);

				expect(
					list &&
						window.getComputedStyle(list).display === 'block' &&
						list.parentNode != null
				).is.true;
			});

			describe('Change default list', function () {
				it('Should change default FONT list in toolbar', function () {
					const editor = getJodit({
						toolbarAdaptive: false,
						controls: {
							font: {
								list: {
									'font-family: -apple-system,BlinkMacSystemFont,Segoe WPC,Segoe UI,HelveticaNeue-Light,Ubuntu,Droid Sans,sans-serif;':
										'Custom',
									'Helvetica,sans-serif': 'Helvetica',
									'Arial,Helvetica,sans-serif': 'Arial',
									'Georgia,serif': 'Georgia',
									'Impact,Charcoal,sans-serif': 'Impact',
									'Tahoma,Geneva,sans-serif': 'Tahoma',
									"'Times New Roman',Times,serif":
										'Times New Roman',
									'Verdana,Geneva,sans-serif': 'Verdana'
								}
							}
						}
					});

					clickTrigger('font', editor);

					const list = getOpenedPopup(editor);

					expect(
						list &&
							window.getComputedStyle(list).display === 'block' &&
							list.parentNode != null
					).is.true;

					expect(list.textContent.match('Custom')).is.not.null;
				});

				it('Should change default FONT size list in toolbar', function () {
					const editor = getJodit({
						toolbarAdaptive: false,
						controls: {
							fontsize: {
								list: Jodit.atom('8,9,10'.split(','))
							}
						}
					});

					clickTrigger('fontsize', editor);

					const list = getOpenedPopup(editor);

					expect(list.getElementsByTagName('button').length).equals(
						3
					);
				});
			});
		});

		it('Open and close list after clicking in another place', function () {
			const editor = getJodit();

			clickTrigger('fontsize', editor);

			const list = getOpenedPopup(editor);

			expect(list && window.getComputedStyle(list).display === 'block').is
				.true;

			simulateEvent('mousedown', 0, window);

			expect(list && list.parentNode == null).is.true;
		});

		it('Open format list set H1 for current cursor position. Restore selection after that', function () {
			const editor = getJodit();

			editor.value = 'text2text';

			const range = editor.s.createRange();

			range.setStart(editor.editor.firstChild.firstChild, 3);
			range.setEnd(editor.editor.firstChild.firstChild, 6);
			editor.s.selectRange(range);

			clickTrigger('paragraph', editor);

			const list = getOpenedPopup(editor);

			expect(window.getComputedStyle(list).display).equals('block');

			clickButton('h1', list);

			expect(editor.value).equals('<h1>text2text</h1>');

			simulateEvent('mousedown', 0, editor.editor);

			expect(list.parentNode).is.null;

			editor.s.insertNode(editor.createInside.text(' a '));

			expect(editor.value).equals('<h1>tex a ext</h1>');
		});

		it('Open video dialog and insert video by url from youtube.', function () {
			const editor = getJodit({
				disablePlugins: 'mobile'
			});

			editor.value = '';

			clickButton('video', editor);

			const popup = getOpenedPopup(editor);

			popup.querySelector('input[name=url]').value =
				'sddhttps://www.youtube.com/watch?v=7CcEYRfxUOQ'; // try wrong url

			simulateEvent('submit', popup.querySelector('.jodit-ui-form'));

			expect(
				popup.querySelectorAll(
					'.jodit-ui-input.jodit-ui-input_has-error_true'
				).length
			).equals(1);

			popup.querySelector('input[name=url]').value =
				'https://www.youtube.com/watch?v=7CcEYRfxUOQ';

			simulateEvent('submit', popup.querySelector('.jodit-ui-form'));

			expect(sortAttributes(editor.value)).equals(
				'<iframe allowfullscreen="" frameborder="0" height="345" src="https://www.youtube.com/embed/7CcEYRfxUOQ" width="400"></iframe>'
			);

			simulateEvent('mousedown', 0, editor.editor);

			expect(popup.parentNode).is.null;
		});

		it('Open align list and choose Right align.', function () {
			const editor = getJodit();

			editor.value = 'Test';

			clickTrigger('left', editor);

			const list = getOpenedPopup(editor);

			expect(window.getComputedStyle(list).display).equals('block');

			clickButton('right', list);

			expect(sortAttributes(editor.value)).equals(
				'<p style="text-align:right">Test</p>'
			);

			simulateEvent('mousedown', 0, editor.editor);

			expect(list.parentNode).is.null;
		});

		describe('Click inside the link', function () {
			it('Should open link popup', function () {
				const editor = getJodit({
					observer: {
						timeout: 0
					}
				});

				editor.value = 'test test <a href="#">test</a>';

				simulateEvent('click', editor.editor.querySelector('a'));

				const popup = getOpenedPopup(editor);

				expect(popup).is.not.null;
			});

			describe('Click on pencil', function () {
				it('Should open edit link popup', function () {
					const editor = getJodit({
						observer: {
							timeout: 0
						}
					});

					editor.value = 'test test <a href="#">test</a>';

					simulateEvent('click', editor.editor.querySelector('a'));

					const popup = getOpenedPopup(editor);

					expect(popup).is.not.null;

					const pencil = getButton('link', popup);
					expect(pencil).is.not.null;

					simulateEvent('click', pencil);
					const subpopup = getOpenedPopup(editor);

					expect(subpopup).is.not.null;
					expect(window.getComputedStyle(subpopup).display).equals(
						'block'
					);
					expect(popup.parentNode.parentNode.parentNode).is.not.null;
				});
			});
		});

		describe('Create table', function () {
			describe('Mouse move', function () {
				it('Should highlight cells in table-creator', function () {
					const editor = getJodit();
					clickButton('table', editor);

					const list = getOpenedPopup(editor);

					expect(window.getComputedStyle(list).display).equals(
						'block'
					);

					simulateEvent(
						'mousemove',
						list.querySelectorAll('.jodit-form__container span')[14]
					);

					expect(
						list.querySelectorAll(
							'.jodit-form__container span.jodit_hovered'
						).length
					).equals(10);
				});

				describe('In iframe mode', function () {
					it('Should works same way', function () {
						const editor = getJodit({
							iframe: true
						});

						clickButton('table', editor);

						const list = getOpenedPopup(editor);

						expect(window.getComputedStyle(list).display).equals(
							'block'
						);

						const divs = list.querySelectorAll(
							'.jodit-form__container span'
						);

						expect(divs.length).to.be.above(10);

						simulateEvent('mousemove', 0, divs[14]);

						expect(
							list.querySelectorAll(
								'.jodit-form__container span.jodit_hovered'
							).length
						).equals(10);
					});
				});
			});
		});
	});

	describe('Buttons', function () {
		describe('Buttons list', function () {
			it('Should allow get flat buttons list', function () {
				const editor = getJodit({
					buttons: [
						{
							group: 'source1',
							buttons: ['source', 'selectall']
						},
						{
							group: 'font-style1',
							buttons: ['bold', 'italic']
						},
						'\n',
						{
							group: 'history1',
							buttons: ['redo', 'undo']
						}
					]
				});
				console.log(editor.toolbar.getButtonsNames());

				expect(editor.toolbar.getButtonsNames()).deep.eq([
					'source',
					'selectall',
					'bold',
					'italic',
					'redo',
					'undo'
				]);
			});
		});

		describe('Text mode', function () {
			it('Should work i18n', function () {
				const editor = getJodit({
						textIcons: true,
						language: 'ru'
					}),
					editor2 = getJodit({
						textIcons: true,
						language: 'en'
					});

				const label1 = getButton('source', editor).textContent,
					label2 = getButton('source', editor2).textContent;

				expect(label1).does.not.equal(label2);
			});

			it('Should create buttons with text', function () {
				const editor = getJodit({
					textIcons: true
				});

				expect(getButton('source', editor)).is.not.null;

				expect(
					getButton('source', editor).querySelectorAll('svg').length
				).equals(0);
			});

			it("Should add jodit_text_icons class to editor's container", function () {
				const editor = getJodit({
					textIcons: true
				});

				expect(
					getButton(
						'source',
						editor
					).parentElement.className.includes('text-icons_true')
				).is.true;
			});

			it('Should set font-size more them 0', function () {
				const editor = getJodit({
					textIcons: true
				});

				expect(
					parseInt(
						editor.ownerWindow.getComputedStyle(
							getButton('source', editor)
						).fontSize,
						10
					)
				).to.be.above(10);
			});

			describe('In tabs', function () {
				it('Should be also only text', function () {
					const editor = getJodit({
						textIcons: true
					});

					clickButton('image', editor);

					const popup = getOpenedPopup(editor);

					expect(popup).is.not.null;

					expect(popup.querySelectorAll('svg, img').length).equals(0);
				});
			});

			describe('In video popup', function () {
				it('Should be also only text', function () {
					const editor = getJodit({
						textIcons: true,
						toolbarAdaptive: false
					});

					clickButton('video', editor);

					const popup = getOpenedPopup(editor);

					expect(popup).is.not.null;

					expect(popup.querySelectorAll('svg, img').length).equals(0);
				});
			});
		});

		describe('Set empty Jodit.atom', function () {
			it('Should remove all buttons', function () {
				const editor = getJodit({
					buttons: []
				});

				expect(getButton('source', editor)).is.null;
				editor.destruct();

				const editor2 = getJodit({
					buttons: Jodit.atom([])
				});

				expect(getButton('source', editor2)).is.null;
			});
		});

		it('Remove default buttons functionality', function () {
			const editor = getJodit();
			expect(getButton('source', editor)).is.not.null;
			editor.destruct();

			const editor2 = getJodit({
				removeButtons: ['source']
			});

			expect(getButton('source', editor2)).is.null;
		});

		it('Add own button', function () {
			const editor = getJodit({
				disablePlugins: ['mobile'],
				buttons: Jodit.defaultOptions.buttons.concat([
					{
						name: 'insertDate',
						iconURL: 'http://xdsoft.net/jodit/images/logo.png',
						exec: function (editor) {
							editor.s.insertHTML(
								new Date('2016/03/16').toDateString()
							);
						}
					}
				])
			});

			const button = getButton('insertDate', editor);

			expect(button).is.not.null;

			editor.value = '';

			simulateEvent('click', 0, button);
			expect(editor.value).equals('<p>Wed Mar 16 2016</p>');
		});

		it('When cursor inside STRONG tag, Bold button should be selected', function () {
			const editor = getJodit({
					observer: {
						timeout: 0 // disable delay
					}
				}),
				bold = getButton('bold', editor),
				italic = getButton('italic', editor);

			editor.value =
				'<strong>test</strong><em>test2</em><i>test3</i><b>test3</b>';
			editor.s.focus();

			const sel = editor.s.sel,
				range = editor.s.createRange();

			range.setStart(editor.editor.firstChild.firstChild.firstChild, 2);
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);

			simulateEvent('mousedown', 0, editor.editor);

			expect(bold.getAttribute('aria-pressed')).equals('true');

			range.setStart(
				editor.editor.firstChild.firstChild.nextSibling.firstChild,
				2
			);
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);

			simulateEvent('mousedown', 0, editor.editor);

			expect(bold.getAttribute('aria-pressed')).equals('false');

			expect(italic.getAttribute('aria-pressed')).equals('true');

			range.setStart(
				editor.editor.firstChild.firstChild.nextSibling.nextSibling
					.firstChild,
				2
			);
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);

			simulateEvent('mousedown', 0, editor.editor);

			expect(bold.getAttribute('aria-pressed')).equals('false');
			expect(italic.getAttribute('aria-pressed')).equals('true');

			range.setStart(
				editor.editor.firstChild.firstChild.nextSibling.nextSibling
					.nextSibling.firstChild,
				2
			);
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);

			simulateEvent('mousedown', 0, editor.editor);

			expect(bold.getAttribute('aria-pressed')).equals('true');
			expect(italic.getAttribute('aria-pressed')).equals('false');
		});

		describe('Disable for mode', function () {
			it('Should disable buttons which can not be used in that mode', function () {
				const editor = getJodit({
					observer: {
						timeout: 0 // disable delay
					}
				});

				editor.value =
					'<strong>test</strong><em>test2</em><i>test3</i><b>test3</b>';

				editor.setMode(Jodit.MODE_SOURCE);

				expect(getButton('bold', editor).hasAttribute('disabled')).is
					.true;
				expect(getButton('source', editor).hasAttribute('disabled')).is
					.false;

				editor.setMode(Jodit.MODE_WYSIWYG);

				expect(getButton('bold', editor).hasAttribute('disabled')).is
					.false;
				expect(getButton('source', editor).hasAttribute('disabled')).is
					.false;
			});

			describe('For list', function () {
				describe('enable', function () {
					it('Should enable buttons which can be used in this mode', function () {
						const editor = getJodit({
							observer: {
								timeout: 0 // disable delay
							},
							defaultMode: Jodit.MODE_SOURCE,
							buttons: [
								{
									name: 'list_test',
									mode: Jodit.MODE_SPLIT,
									list: {
										h1: 'insert Header 1',
										h2: 'insert Header 2',
										clear: 'Empty editor'
									},
									exec: function (editor) {
										const key = this.args[0];

										if (key === 'clear') {
											this.val('');
											return;
										}

										editor.s.insertHTML(
											'&nbsp;{{test' + key + '}}&nbsp;'
										);
									},
									childTemplate: function (key, value) {
										return '<div>' + value + '</div>';
									}
								}
							]
						});

						const btn = getButton('list_test', editor);
						expect(btn).is.not.null;

						expect(btn.hasAttribute('disabled')).to.be.false;

						clickTrigger('list_test', editor);

						const list = getOpenedPopup(editor);
						expect(list).is.not.null;

						expect(
							list.querySelectorAll('.jodit_disabled').length
						).equals(0);
					});
				});

				describe('disable', function () {
					it('Should disable buttons which can not be used in that mode', function () {
						const editor = getJodit({
							observer: {
								timeout: 0 // disable delay
							},
							defaultMode: Jodit.MODE_SOURCE,
							buttons: [
								{
									name: 'list_test',
									mode: Jodit.MODE_WYSIWYG,
									list: {
										h1: 'insert Header 1',
										h2: 'insert Header 2',
										clear: 'Empty editor'
									},
									exec: function (editor) {
										const key = this.args[0];

										if (key === 'clear') {
											this.val('');
											return;
										}

										editor.s.insertHTML(
											'&nbsp;{{test' + key + '}}&nbsp;'
										);
									},
									childTemplate: function (key, value) {
										return '<div>' + value + '</div>';
									}
								}
							]
						});

						const btn = getButton('list_test', editor);
						expect(btn).is.not.null;

						expect(btn.hasAttribute('disabled')).to.be.true;

						simulateEvent('mousedown', 0, btn);

						const list = btn.querySelector('.jodit_toolbar_list');
						expect(list).is.null;
					});
				});
			});
		});

		describe('Set size', function () {
			it('Should add modification to button', function () {
				const editor = getJodit({
					toolbarButtonSize: 'small'
				});

				expect(
					getButton(
						'source',
						editor
					).parentElement.classList.contains(
						'jodit-toolbar-button_size_small'
					)
				).is.true;
			});

			describe('For list', function () {
				describe('enable', function () {
					it('Should enable buttons which can be used in this mode', function () {
						const editor = getJodit({
							observer: {
								timeout: 0 // disable delay
							},
							defaultMode: Jodit.MODE_SOURCE,
							buttons: [
								{
									name: 'list_test',
									mode: Jodit.MODE_SPLIT,
									list: {
										h1: 'insert Header 1',
										h2: 'insert Header 2',
										clear: 'Empty editor'
									},
									exec: function (editor) {
										const key = this.args[0];

										if (key === 'clear') {
											this.val('');
											return;
										}

										editor.s.insertHTML(
											'&nbsp;{{test' + key + '}}&nbsp;'
										);
									},
									childTemplate: function (key, value) {
										return '<div>' + value + '</div>';
									}
								}
							]
						});

						const btn = getButton('list_test', editor);
						expect(btn).is.not.null;

						expect(btn.hasAttribute('disabled')).to.be.false;

						clickTrigger('list_test', editor);

						const list = getOpenedPopup(editor);
						expect(list).is.not.null;

						expect(
							list.querySelectorAll('.jodit_disabled').length
						).equals(0);
					});
				});

				describe('disable', function () {
					it('Should disable buttons which can not be used in that mode', function () {
						const editor = getJodit({
							observer: {
								timeout: 0 // disable delay
							},
							defaultMode: Jodit.MODE_SOURCE,
							buttons: [
								{
									name: 'list_test',
									mode: Jodit.MODE_WYSIWYG,
									list: {
										h1: 'insert Header 1',
										h2: 'insert Header 2',
										clear: 'Empty editor'
									},
									exec: function (editor) {
										const key = this.args[0];

										if (key === 'clear') {
											this.val('');
											return;
										}

										editor.s.insertHTML(
											'&nbsp;{{test' + key + '}}&nbsp;'
										);
									},
									childTemplate: function (key, value) {
										return '<div>' + value + '</div>';
									}
								}
							]
						});

						const btn = getButton('list_test', editor);
						expect(btn).is.not.null;

						expect(btn.hasAttribute('disabled')).to.be.true;

						simulateEvent('mousedown', 0, btn);

						const list = btn.querySelector('.jodit_toolbar_list');
						expect(list).is.null;
					});
				});
			});
		});

		describe('Allow tab navigation', function () {
			describe('Enable', function () {
				it('Should set tabindex=0 for all buttons', function () {
					const editor = getJodit({
						allowTabNavigation: true
					});

					expect(
						getButton('source', editor).getAttribute('tabindex')
					).equals('0');
				});
			});

			describe('Disable', function () {
				it('Should set tabindex=-1 for all buttons', function () {
					const editor = getJodit({
						allowTabNavigation: false // default
					});

					expect(
						getButton('source', editor).getAttribute('tabindex')
					).equals('-1');
				});
			});
		});

		it('When cursor inside SPAN tag with style="font-weight: bold" or style="font-weight: 700", Bold button should be selected', function () {
			const editor = getJodit({
					observer: {
						timeout: 0 // disable delay
					}
				}),
				bold = getButton('bold', editor);

			editor.value = '<span style="font-weight: bold">test</span>';
			editor.s.focus();

			const sel = editor.s.sel,
				range = editor.s.createRange();
			range.setStart(editor.editor.firstChild.firstChild.firstChild, 2);
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);

			simulateEvent('mousedown', 0, editor.editor);

			expect(bold.getAttribute('aria-pressed')).equals('true');
		});

		describe('Check Redo Undo functionality', function () {
			it('Should change disable in icon then then can not be executed', function () {
				const area = appendTestArea();
				area.value = 'top';
				const editor = new Jodit(area, {
					observer: {
						timeout: 0 // disable delay
					}
				});

				editor.value = 'Test';

				expect(getButton('undo', editor).hasAttribute('disabled')).is
					.false;
				expect(getButton('redo', editor).hasAttribute('disabled')).is
					.true;

				clickButton('undo', editor);

				expect(getButton('undo', editor).hasAttribute('disabled')).is
					.true;
				expect(getButton('redo', editor).hasAttribute('disabled')).is
					.false;

				expect(editor.value).equals('<p>top</p>');
			});
		});

		it('Full size button', function () {
			const editor = getJodit({
				observer: {
					timeout: 0 // disable delay
				}
			});

			clickButton('fullsize', editor);

			let node = editor.container.parentNode;

			while (node && node.nodeType !== Node.DOCUMENT_NODE) {
				expect(
					node.classList.contains('jodit_fullsize-box_true')
				).equals(true);
				node = node.parentNode;
			}
		});

		describe('Extra buttons', function () {
			describe('Options extraButtons', function () {
				it('Should add extra buttons', function () {
					const editor = getJodit({
						extraButtons: [
							{
								name: 'adddate',
								exec: function (editor) {
									const a = editor.createInside.text('111');
									editor.s.insertNode(a);
								}
							}
						]
					});

					editor.value = '';

					expect(getButton('adddate', editor)).is.not.null;

					clickButton('adddate', editor);

					expect(editor.value).equals('<p>111</p>');
				});

				describe('extraButtons always append in the end', function () {
					it('Should add extra buttons on postion by buttons potions', function () {
						const editor = getJodit({
							buttons: [
								'indent',
								'outdent',
								'bold',
								'adddate',
								'dots'
							],
							disablePlugins: 'mobile',
							extraButtons: [
								{
									name: 'adddate',
									exec: function (editor) {
										const a =
											editor.createInside.text('111');
										editor.s.insertNode(a);
									}
								}
							]
						});

						expect(
							editor.toolbar.getButtonsNames().toString()
						).equals('indent,outdent,bold,adddate,dots,adddate');
					});
				});
			});
		});

		describe('Add button', function () {
			it('Should create buttons in toolbar', function () {
				const editor = getJodit({
					buttons: ['indent', 'outdent', 'bold', 'customxxx'],
					disablePlugins: 'mobile'
				});

				expect(getButton('indent', editor)).is.not.null;
				expect(getButton('outdent', editor)).is.not.null;
				expect(getButton('bold', editor)).is.not.null;
				expect(getButton('customxxx', editor)).is.not.null;
				expect(getButton('source', editor)).is.null;
			});
		});

		describe('Button Bold', function () {
			describe('In collapsed selection', function () {
				it('Should reactivate Bold button after second click and move cursor out of Strong element', function () {
					const editor = getJodit({
						buttons: ['bold']
					});

					editor.value = '<p>test</p>';
					editor.s.setCursorAfter(
						editor.editor.firstChild.firstChild
					);

					clickButton('bold', editor);
					editor.s.insertHTML('text');
					clickButton('bold', editor);
					editor.s.insertHTML('text');

					expect(editor.value).equals(
						'<p>test<strong>text</strong>text</p>'
					);
				});
			});

			describe('Not collapsed selection', function () {
				it('Should reactivate Bold button after second click and move cursor out of Strong element', function () {
					const editor = getJodit({
						buttons: ['bold']
					});

					editor.value = 'test test test';

					const range = editor.s.createRange();
					range.setStart(editor.editor.firstChild.firstChild, 0);
					range.setEnd(editor.editor.firstChild.firstChild, 4);

					editor.s.selectRange(range);

					clickButton('bold', editor);

					expect(editor.value).equals(
						'<p><strong>test</strong> test test</p>'
					);
				});
			});
		});

		describe('Active button', function () {
			it('Should not be activated then element has default style', function () {
				const editor = getJodit({
					observer: {
						timeout: 0
					}
				});

				editor.value = '<p>test<strong>bold</strong></p>';
				editor.s.focus();

				const p = editor.editor.firstChild;
				editor.s.setCursorAfter(p.firstChild);

				simulateEvent('mousedown', 0, p);

				const bold = getButton('bold', editor);
				const align = getButton('left', editor);

				expect(bold.getAttribute('aria-pressed')).equals('false');
				expect(align.getAttribute('aria-pressed')).equals('false');

				editor.s.setCursorIn(p.querySelector('strong').firstChild);
				simulateEvent('mousedown', 0, p);
				// editor.s.insertHTML('ddd');
				expect(bold.getAttribute('aria-pressed')).equals('true');
				expect(align.getAttribute('aria-pressed')).equals('false');

				p.style.textAlign = 'right';
				simulateEvent('mousedown', 0, p);
				expect(bold.getAttribute('aria-pressed')).equals('true');
				expect(align.getAttribute('aria-pressed')).equals('true');
			});

			describe('In list', function () {
				describe('Format block button', function () {
					it('Should be activated then element has some tagname', function () {
						const editor = getJodit({
							observer: {
								timeout: 0
							}
						});

						editor.value =
							'<p>test</p><h1>test</h1><code>test</code>';
						editor.s.focus();

						const p = editor.editor.firstChild;
						const paragraph = getButton('paragraph', editor);

						expect(paragraph).is.not.null;

						editor.s.setCursorAfter(p.firstChild);
						simulateEvent('mousedown', 0, p);
						expect(paragraph.getAttribute('aria-pressed')).equals(
							'false'
						);

						editor.s.setCursorIn(editor.editor.childNodes[1]);

						simulateEvent('mousedown', 0, p);
						expect(paragraph.getAttribute('aria-pressed')).equals(
							'true'
						);

						clickTrigger('paragraph', editor);

						const header =
							getOpenedPopup(editor).querySelector('[class*=h1]');
						expect(header.getAttribute('aria-pressed')).equals(
							'true'
						);
					});
				});
			});

			describe('Select text with several properties', function () {
				it('Should select all buttons with conditions', function () {
					const editor = getJodit({
						observer: {
							timeout: 0
						}
					});

					editor.value = '<em><strong><u>bold</u></strong></em>';
					editor.s.focus();

					const range = editor.s.createRange();
					range.setStartBefore(editor.editor.firstChild);
					range.setEndAfter(editor.editor.firstChild);
					editor.s.selectRange(range);

					const bold = getButton('bold', editor);

					const italic = getButton('italic', editor);

					const underline = getButton('underline', editor);

					expect(bold.getAttribute('aria-pressed')).equals('true');

					expect(italic.getAttribute('aria-pressed')).equals('true');

					expect(underline.getAttribute('aria-pressed')).equals(
						'true'
					);
				});
			});
		});

		describe('Disable button', function () {
			describe('Cut and Copy', function () {
				describe('Cut', function () {
					it('Should be activated editor has some selected text', function () {
						const editor = getJodit({
							toolbarAdaptive: false,
							observer: {
								timeout: 0
							}
						});

						const cut = getButton('cut', editor);

						editor.value = '<p>test<strong>bold</strong></p>';
						editor.s.focus();

						expect(cut.hasAttribute('disabled')).is.true;

						const p = editor.editor.firstChild;

						editor.s.select(p.firstChild);

						expect(cut.hasAttribute('disabled')).is.false;
					});
				});

				describe('Copy', function () {
					it('Should be activated editor has some selected text', function () {
						const editor = getJodit({
							toolbarAdaptive: false,
							observer: {
								timeout: 0
							}
						});

						const copy = getButton('copy', editor);

						editor.value = '<p>test<strong>bold</strong></p>';
						editor.s.focus();

						expect(copy.hasAttribute('disabled')).is.true;

						const p = editor.editor.firstChild;

						editor.s.select(p.firstChild);

						expect(copy.hasAttribute('disabled')).is.false;
					});
				});
			});
		});
	});

	describe('Commands', function () {
		it('Click on Source button should change current mode', function () {
			const editor = getJodit();

			clickButton('source', editor);

			expect(editor.getMode()).equals(Jodit.MODE_SOURCE);
		});

		it('Click on Bold button should wrap current selection in <strong>', function () {
			const editor = getJodit();

			editor.value = 'Text to text';
			editor.s.focus();

			const range = editor.s.createRange();
			range.setStart(editor.editor.firstChild.firstChild, 3);
			range.setEnd(editor.editor.firstChild.firstChild, 10);
			editor.s.selectRange(range);

			clickButton('bold', editor);

			expect(editor.value).equals('<p>Tex<strong>t to te</strong>xt</p>');
		});

		it('Click on Italic button when selection is collapsed should create new <em> element and set cursor into it', function () {
			const editor = getJodit();

			editor.value = 'Text to text';
			editor.s.focus();

			const range = editor.s.createRange();
			range.setStart(editor.editor.firstChild.firstChild, 0);
			range.collapse(true);
			editor.s.selectRange(range);

			clickButton('italic', editor);

			editor.s.insertHTML('test');

			expect(editor.value).equals('<p><em>test</em>Text to text</p>');
		});
	});

	describe('In fileBrowser', function () {
		describe('Hide buttons ', function () {
			it('should hide toolbar buttons', function () {
				const editor = getJodit({
					filebrowser: {
						buttons: Jodit.atom([
							'filebrowser.list',
							'filebrowser.tiles',
							'filebrowser.sort'
						]),
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					}
				});

				clickButton('image', editor);

				const popup = getOpenedPopup(editor);

				expect(popup).is.not.null;

				simulateEvent('click', popup.querySelector('button'));
				const dialog = getOpenedDialog(editor);

				expect(dialog).is.not.null;

				expect(3).equals(
					dialog.querySelectorAll(
						'.jodit-dialog__header .jodit-dialog__header-title button,' +
							'.jodit-dialog__header .jodit-dialog__header-title select'
					).length
				);
			});
		});
	});

	describe('One toolbar for several editors', function () {
		it('Should create one Jodit instance but with several edit places', function () {
			const toolbarBox = appendTestDiv(),
				firstEditPlace = appendTestDiv('firstEditPlace'),
				secondEditPlace = appendTestDiv('secondEditPlace'),
				thirdEditPlace = appendTestDiv('thirdEditPlace'),
				editor = Jodit.make(firstEditPlace);

			editor.setPanel(toolbarBox);

			editor.value = 'first';

			editor.addPlace(secondEditPlace);
			editor.value = 'second';

			editor.addPlace(thirdEditPlace);
			editor.value = 'third';

			expect(Jodit.instances.firstEditPlace).equals(editor);
			expect(Jodit.instances.secondEditPlace).equals(undefined);
			expect(Jodit.instances.thirdEditPlace).equals(undefined);

			editor.destruct();

			expect(firstEditPlace.innerHTML).equals('<p>first</p>');
			expect(secondEditPlace.innerHTML).equals('<p>second</p>');
			expect(thirdEditPlace.innerHTML).equals('<p>third</p>');
		});

		describe('For all instances you can set self options', function () {
			it('Should change options for all instances', function () {
				const toolbarBox = appendTestDiv(),
					firstEditPlace = appendTestDiv('firstEditPlace'),
					secondEditPlace = appendTestDiv('secondEditPlace'),
					thirdEditPlace = appendTestDiv('thirdEditPlace'),
					editor = Jodit.make(firstEditPlace, {
						disablePlugins: ['WrapTextNodes']
					});

				editor.setPanel(toolbarBox);

				editor.value = 'first';

				editor.addPlace(secondEditPlace, {
					readonly: true,
					showCharsCounter: false,
					showWordsCounter: false,
					showXPathInStatusbar: false
				});

				editor.value = 'second';

				editor.addPlace(thirdEditPlace, {
					readonly: false,
					showCharsCounter: false,
					showWordsCounter: false,
					showXPathInStatusbar: false
				});

				editor.value = 'third';

				const editPlaces =
					editor.ownerDocument.querySelectorAll('.jodit-wysiwyg');
				expect(editPlaces.length).equals(3);

				simulateEvent('focus', 0, editPlaces[0]);
				expect(editor.options.readonly).is.false;
				expect(editor.options.showCharsCounter).is.true;

				simulateEvent('focus', 0, editPlaces[1]);
				expect(editor.options.readonly).is.true;
				expect(editor.options.showCharsCounter).is.false;

				simulateEvent('focus', 0, editPlaces[2]);
				expect(editor.options.readonly).is.false;
				expect(editor.options.showCharsCounter).is.false;
			});
		});
	});
});
