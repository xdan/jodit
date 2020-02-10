describe('Toolbar', function() {
	describe('Custom buttons', function() {
		it('should create normal button in toolbar', function() {
			const editor = new Jodit(appendTestArea(), {
				toolbarAdaptive: false,
				buttons: [
					'image',
					{
						name: 'alert_some',
						iconURL:
							'https://xdsoft.net/jodit/build/images/icons/045-copy.png',
						exec: function() {
							alert('test');
						}
					}
				]
			});

			const btns = Array.from(
				editor.container.querySelectorAll(
					'.jodit_toolbar .jodit_toolbar_btn'
				)
			);

			expect(btns.length).equals(2);

			btns.forEach(function(btn) {
				const icon = btn.querySelector('.jodit_icon');

				expect(icon).is.not.null;

				const style = window.getComputedStyle(icon),
					height = parseInt(style.height),
					width = parseInt(style.width);

				expect(width).to.be.above(5);
				expect(height).to.be.above(5);
			});
		});

		describe('Use controls', function() {
			it('should create normal button in toolbar', function() {
				const editor = new Jodit(appendTestArea(), {
					toolbarAdaptive: false,
					controls: {
						alert_some: {
							name: 'alert_some',
							iconURL:
								'https://xdsoft.net/jodit/build/images/icons/045-copy.png',
							exec: function() {
								editor.selection.insertHTML(
									'<p><span>indigo</span></p>'
								);
							}
						}
					},
					buttons: ['image', 'alert_some']
				});

				expect(editor.toolbar.getButtonsList().toString()).equals(
					'image,alert_some'
				);

				simulateEvent(
					'mousedown',
					0,
					editor.container.querySelector(
						'.jodit_toolbar_btn-alert_some'
					)
				);

				expect(editor.value).equals('<p><span>indigo</span></p><br>');
			});
		});
	});

	describe('Set toolbar options to false', function() {
		it('Should hide toolbar', function() {
			const editor = new Jodit(appendTestArea(), {
				toolbar: false
			});

			expect(null).equals(
				editor.container.querySelector('.jodit_toolbar')
			);
		});
	});

	describe('Set toolbar options to css selector', function() {
		it('Should render toolbar in different container', function() {
			const div = appendTestDiv(),
				editor = Jodit.make(appendTestArea(), {
					toolbar: div
				});

			const toolbar = document.querySelector('.jodit_toolbar');
			const defaultContainer = editor.container.querySelector(
				'.jodit_toolbar_container'
			);

			expect(null).does.not.equal(toolbar);
			expect(div).equals(toolbar.parentElement);
			expect(defaultContainer).does.not.equal(toolbar.parentElement);
		});

		describe('After enable Fullsize mode', function() {
			it('Should render toolbar in default container', function() {
				const div = appendTestDiv(),
					editor = Jodit.make(appendTestArea(), {
						toolbar: div
					});

				const toolbar = document.querySelector('.jodit_toolbar');
				const defaultContainer = editor.container.querySelector(
					'.jodit_toolbar_container'
				);

				editor.toggleFullSize(true);
				expect(defaultContainer).equals(toolbar.parentElement);

				editor.toggleFullSize(false);
				expect(div).equals(toolbar.parentElement);
			});
		});

		describe('Change toolbar container dynamically', function() {
			it('Should render toolbar in different containers every call setPanel', function() {
				const div1 = appendTestDiv(),
					div2 = appendTestDiv(),
					div3 = appendTestDiv(),
					editor = Jodit.make(appendTestArea());

				const toolbar = document.querySelector('.jodit_toolbar');
				expect(toolbar).is.not.null;

				const defaultContainer = editor.container.querySelector(
					'.jodit_toolbar_container'
				);
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

	describe('Popups', function() {
		describe('Click on dots buttons in mobile size', function() {
			it('Should open popup with several buttons', function() {
				getBox().style.width = '300px';
				const editor = new Jodit(appendTestArea());
				const dots = editor.container.querySelector(
					'.jodit_toolbar_btn.jodit_toolbar_btn-dots'
				);
				expect(dots).is.not.null;
				simulateEvent('mousedown', 0, dots);
				const popup = dots.querySelector(
					'.jodit_toolbar_popup.jodit_toolbar_popup-open'
				);

				expect(popup).is.not.null;

				const video = popup.querySelector(
					'.jodit_toolbar_btn.jodit_toolbar_btn-video'
				);
				expect(video).is.not.null;

				simulateEvent('mousedown', 0, video);

				const popup2 = video.querySelector(
					'.jodit_toolbar_popup.jodit_toolbar_popup-open'
				);
				expect(popup2).is.not.null;
				getBox().style.width = 'auto';
			});
			describe('Some with touchend', function() {
				it('Should open popup with several buttons', function() {
					getBox().style.width = '300px';
					const editor = new Jodit(appendTestArea());
					const dots = editor.container.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-dots'
					);
					expect(dots).is.not.null;
					simulateEvent('touchend', 0, dots);
					const popup = dots.querySelector(
						'.jodit_toolbar_popup.jodit_toolbar_popup-open'
					);

					expect(popup).is.not.null;

					const video = popup.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-video'
					);
					expect(video).is.not.null;

					simulateEvent('touchend', 0, video);

					const popup2 = video.querySelector(
						'.jodit_toolbar_popup.jodit_toolbar_popup-open'
					);
					expect(popup2).is.not.null;
					getBox().style.width = 'auto';
				});
			});
		});

		describe('Click on some link', function() {
			describe('in the left side of editor', function() {
				it('Should open inline popup with float by left editor side', function() {
					const editor = new Jodit(appendTestArea(), {});

					editor.value = 'asas <a href="#">test</a>';

					simulateEvent(
						'mousedown',
						0,
						editor.editor.querySelector('a')
					);

					const popup = editor.ownerDocument.querySelector(
						'.jodit_toolbar_popup-inline.jodit_toolbar_popup-inline-open'
					);

					expect(popup && popup.style.display !== 'none').equals(
						true
					);

					const positionPopup = offset(popup);
					const positionContainer = offset(editor.container);

					expect(true).equals(
						positionPopup.left >= positionContainer.left
					);
				});
			});
		});

		describe('Click on some button with defined popup field', function() {
			it('Should open popup in toolbar', function() {
				const editor = new Jodit(appendTestArea(), {
					disablePlugins: 'mobile'
				});
				simulateEvent(
					'mousedown',
					0,
					editor.container.querySelector('.jodit_toolbar_btn-video')
				);

				const popup = editor.ownerDocument.querySelector(
					'.jodit_toolbar_popup'
				);

				expect(popup && popup.style.display === 'block').is.true;
			});
			describe('in the left side', function() {
				it('Should open popup in toolbar with float by left editor side', function() {
					const editor = new Jodit(appendTestArea(), {
						buttons: ['video'],
						disablePlugins: 'mobile'
					});

					simulateEvent(
						'mousedown',
						0,
						editor.container.querySelector(
							'.jodit_toolbar_btn-video'
						)
					);

					const popup = editor.ownerDocument.querySelector(
						'.jodit_toolbar_popup[data-editor_id=' + editor.id + ']'
					);

					expect(popup).is.not.null;

					const positionPopup = offset(popup);
					const positionContainer = offset(editor.container);

					expect(true).equals(
						positionPopup.left >= positionContainer.left
					);
				});
			});
			describe('in the right side', function() {
				it('Should open popup in toolbar with float by left editor side', function() {
					const editor = new Jodit(appendTestArea(), {
						width: 300,
						buttons: [
							'video',
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

					simulateEvent(
						'mousedown',
						0,
						editor.container.querySelector(
							'.jodit_toolbar_btn-video:last-child'
						)
					);

					const popup = editor.ownerDocument.querySelector(
						'.jodit_toolbar_popup[data-editor_id=' + editor.id + ']'
					);

					expect(popup).is.not.null;

					const positionPopup = offset(popup);
					const positionContainer = offset(editor.container);

					expect(
						Math.abs(
							positionPopup.left +
								positionPopup.width -
								(positionContainer.left +
									positionContainer.width)
						) < 2
					).is.true;
				});
			});
		});

		getBox().style.width = 'auto';

		it('Open and close popap after clicking in another place', function() {
			const editor = new Jodit(appendTestArea(), {
				disablePlugins: 'mobile'
			});

			simulateEvent(
				'mousedown',
				0,
				editor.container.querySelector('.jodit_toolbar_btn-video')
			);

			const popup = editor.ownerDocument.querySelector(
				'.jodit_toolbar_popup'
			);

			expect(popup && popup.style.display === 'block').is.true;

			simulateEvent('mousedown', 0, window);

			expect(popup && popup.parentNode === null).is.true;
		});

		describe('Open list', function() {
			it('Should Open list in toolbar', function() {
				const editor = new Jodit(appendTestArea(), {
					toolbarAdaptive: false
				});

				simulateEvent(
					'mousedown',
					0,
					editor.container.querySelector(
						'.jodit_toolbar_btn.jodit_with_dropdownlist.jodit_toolbar_btn-font'
					)
				);

				const list = editor.container.querySelector(
					'.jodit_toolbar_list'
				);

				expect(
					list &&
						window.getComputedStyle(list).display === 'block' &&
						list.parentNode !== null
				).is.true;
			});
			describe('Change defaiult list', function() {
				it('Should change default FONT list in toolbar', function() {
					const editor = new Jodit(appendTestArea(), {
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

					simulateEvent(
						'mousedown',
						0,
						editor.container.querySelector(
							'.jodit_toolbar_btn.jodit_with_dropdownlist.jodit_toolbar_btn-font'
						)
					);

					const list = editor.container.querySelector(
						'.jodit_toolbar_list'
					);

					expect(
						list &&
							window.getComputedStyle(list).display === 'block' &&
							list.parentNode !== null
					).is.true;

					expect(list.textContent.match('Custom')).is.not.null;
				});
				it('Should change default FONT size list in toolbar', function() {
					const editor = new Jodit(appendTestArea(), {
						toolbarAdaptive: false,
						controls: {
							fontsize: {
								list: '8,9,10'
							}
						}
					});

					simulateEvent(
						'mousedown',
						0,
						editor.container.querySelector(
							'.jodit_toolbar_btn.jodit_with_dropdownlist.jodit_toolbar_btn-fontsize'
						)
					);

					const list = editor.container.querySelector(
						'.jodit_toolbar_list'
					);

					expect(list.getElementsByTagName('li').length).equals(3);
				});
			});
		});

		it('Open and close list after clicking in another place', function() {
			const editor = new Jodit(appendTestArea());

			simulateEvent(
				'mousedown',
				0,
				editor.container.querySelector(
					'.jodit_toolbar_btn.jodit_with_dropdownlist'
				)
			);

			const list = editor.container.querySelector('.jodit_toolbar_list');

			expect(
				list && window.getComputedStyle(list).display === 'block'
			).is.true;

			simulateEvent('mousedown', 0, window);

			expect(list && list.parentNode === null).is.true;
		});

		it('Open colorpicker set background and color. After this click in another any place. White when popap will be closed. Open again and remove all styles.', function() {
			const editor = new Jodit(appendTestArea());

			editor.value = 'text2text';

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.setStart(editor.editor.firstChild, 3);
			range.setEnd(editor.editor.firstChild, 6);
			sel.removeAllRanges();
			sel.addRange(range);

			simulateEvent(
				'mousedown',
				0,
				editor.container.querySelector(
					'.jodit_toolbar_btn.jodit_toolbar_btn-brush'
				)
			);

			const list = editor.container.querySelector('.jodit_toolbar_popup');

			expect(window.getComputedStyle(list).display).equals('block');

			simulateEvent(
				'mousedown',
				0,
				editor.container.querySelector(
					'.jodit_toolbar_btn.jodit_toolbar_btn-brush [data-color="#F9CB9C"]'
				)
			);

			expect(editor.value).equals(
				'tex<span style="background-color: rgb(249, 203, 156);">t2t</span>ext'
			);

			// simulateEvent('mousedown', 0, editor.editor)
			expect(list.parentNode).is.null;

			range.selectNodeContents(editor.editor.querySelector('span'));
			// range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);

			simulateEvent(
				'mousedown',
				0,
				editor.container.querySelector(
					'.jodit_toolbar_btn.jodit_toolbar_btn-brush'
				)
			);

			const list2 = editor.container.querySelector(
				'.jodit_toolbar_popup.jodit_toolbar_popup-open'
			);
			expect(window.getComputedStyle(list2).display).equals('block');

			simulateEvent(
				'mousedown',
				0,
				editor.container.querySelector(
					'.jodit_toolbar_btn.jodit_toolbar_btn-brush .jodit_colorpicker > a > svg'
				)
			);
			expect(editor.value).equals('text2text');
		});

		describe('Show native color picker', function() {
			describe('Enable', function() {
				it('should open color picker with button - native color picker', function() {
					const editor = new Jodit(appendTestArea(), {
						showBrowserColorPicker: true
					});

					editor.value = 'text2text';

					simulateEvent(
						'mousedown',
						0,
						editor.container.querySelector(
							'.jodit_toolbar_btn.jodit_toolbar_btn-brush'
						)
					);

					const list = editor.container.querySelector(
						'.jodit_toolbar_popup'
					);

					// In two tabs text-color and background-color
					expect(
						list.querySelectorAll('input[type="color"]').length
					).equals(2);
				});
			});
			describe('Disable', function() {
				it('should open color picker without button - native color picker', function() {
					const editor = new Jodit(appendTestArea(), {
						showBrowserColorPicker: false
					});

					editor.value = 'text2text';

					simulateEvent(
						'mousedown',
						0,
						editor.container.querySelector(
							'.jodit_toolbar_btn.jodit_toolbar_btn-brush'
						)
					);

					const list = editor.container.querySelector(
						'.jodit_toolbar_popup'
					);

					expect(
						list.querySelectorAll('input[type="color"]').length
					).equals(0);
				});
			});
		});

		it('Open format list set H1 for current cursor position. Restore selection after that', function() {
			const editor = new Jodit(appendTestArea());

			editor.value = 'text2text';

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.setStart(editor.editor.firstChild, 3);
			range.setEnd(editor.editor.firstChild, 6);
			sel.removeAllRanges();
			sel.addRange(range);

			simulateEvent(
				'mousedown',
				0,
				editor.container.querySelector(
					'.jodit_toolbar_btn.jodit_toolbar_btn-paragraph'
				)
			);

			const list = editor.container.querySelector('.jodit_toolbar_list');

			expect(window.getComputedStyle(list).display).equals('block');

			simulateEvent(
				'mousedown',
				0,
				editor.container.querySelector(
					'.jodit_toolbar_btn.jodit_toolbar_btn-paragraph .jodit_toolbar_btn.jodit_toolbar_btn-h1'
				)
			);

			expect(editor.value).equals('<h1>text2text</h1>');

			simulateEvent('mousedown', 0, editor.editor);

			expect(list.parentNode).is.null;

			editor.selection.insertNode(
				editor.create.inside.text(' a ')
			);

			expect(editor.value).equals('<h1>tex a ext</h1>');
		});
		describe('FontName', function() {
			describe('Open fontname list and select some element', function() {
				it('Should apply this font to current selection elements', function() {
					const editor = new Jodit(appendTestArea(), {
						toolbarAdaptive: false
					});

					editor.value = '<p>test</p>';
					editor.selection.select(
						editor.editor.firstChild.firstChild
					);

					const fontname = editor.container.querySelector(
						'.jodit_toolbar_btn.jodit_with_dropdownlist.jodit_toolbar_btn-font'
					);
					expect(fontname).is.not.null;

					const openFontNameList = function() {
						simulateEvent('mousedown', 0, fontname);

						return fontname.querySelector(
							'.jodit_toolbar_list.jodit_toolbar_list-open > ul'
						);
					};

					expect(openFontNameList()).is.not.null;

					Array.from(openFontNameList().childNodes).map(function(
						font,
						index
					) {
						font = openFontNameList().childNodes[index];
						simulateEvent('mousedown', 0, font);

						const fontFamily = font
							.querySelector('span[style]')
							.getAttribute('style')
							.replace(/"/g, "'");

						expect(sortAttributes(editor.value)).equals(
							sortAttributes(
								'<p><span style="' +
									fontFamily +
									'">test</span></p>'
							)
						);
					});
				});
				describe('Extends standart font list', function() {
					it('Should standart font list elements', function() {
						const editor = new Jodit(appendTestArea(), {
							toolbarAdaptive: false,
							controls: {
								font: {
									list: {
										"-apple-system,BlinkMacSystemFont,'Segoe WPC','Segoe UI',HelveticaNeue-Light,Ubuntu,'Droid Sans',sans-serif":
											'OS System Font'
									}
								}
							}
						});

						editor.value = '<p>test</p>';
						editor.selection.select(
							editor.editor.firstChild.firstChild
						);

						const fontname = editor.container.querySelector(
							'.jodit_toolbar_btn.jodit_with_dropdownlist.jodit_toolbar_btn-font'
						);
						expect(fontname).is.not.null;

						simulateEvent('mousedown', 0, fontname);

						const list = fontname.querySelector(
							'.jodit_toolbar_list.jodit_toolbar_list-open > ul'
						);

						expect(list).is.not.null;

						const font =
							list.childNodes[list.childNodes.length - 1];
						simulateEvent('mousedown', 0, font);

						expect(sortAttributes(editor.value)).equals(
							sortAttributes(
								"<p><span style=\"font-family:-apple-system,BlinkMacSystemFont,'Segoe WPC','Segoe UI',HelveticaNeue-Light,Ubuntu,'Droid Sans',sans-serif\">test</span></p>"
							)
						);
					});
				});
			});
		});

		it('Open video dialog and insert video by url from youtube.', function() {
			const editor = new Jodit(appendTestArea(), {
				disablePlugins: 'mobile'
			});

			editor.value = '';

			simulateEvent(
				'mousedown',
				0,
				editor.container.querySelector(
					'.jodit_toolbar_btn.jodit_toolbar_btn-video'
				)
			);

			const popup = editor.ownerDocument.querySelector(
				'.jodit_toolbar_popup'
			);

			expect(popup.style.display).equals('block');

			popup.querySelector('input[name=code]').value =
				'sddhttps://www.youtube.com/watch?v=7CcEYRfxUOQ'; // try wrong url
			simulateEvent('submit', 0, popup.querySelector('.jodit_form'));

			expect(
				popup.querySelectorAll('input[name=code].jodit_error').length
			).equals(1);

			popup.querySelector('input[name=code]').value =
				'https://www.youtube.com/watch?v=7CcEYRfxUOQ';
			simulateEvent('submit', 0, popup.querySelector('.jodit_form'));

			expect(sortAttributes(editor.value)).equals(
				'<iframe allowfullscreen="" frameborder="0" height="345" src="https://www.youtube.com/embed/7CcEYRfxUOQ" width="400"></iframe>'
			);

			simulateEvent('mousedown', 0, editor.editor);

			expect(popup.parentNode).is.null;
		});
		it('Open align list and choose Right align.', function() {
			const editor = new Jodit(appendTestArea());

			editor.value = 'Test';

			clickButton('left', editor);

			const list = editor.container.querySelector('.jodit_toolbar_list');

			expect(window.getComputedStyle(list).display).equals('block');

			simulateEvent(
				'mousedown',
				0,
				editor.container.querySelector(
					'.jodit_toolbar_btn.jodit_toolbar_btn-left .jodit_toolbar_btn.jodit_toolbar_btn-right'
				)
			);

			expect(sortAttributes(editor.value)).equals(
				'<p style="text-align:right">Test</p>'
			);

			simulateEvent('mousedown', 0, editor.editor);

			expect(list.parentNode).is.null;
		});

		describe('Click inside the link', function() {
			it('Should open link popup', function() {
				const editor = new Jodit(appendTestArea(), {
					observer: {
						timeout: 0
					}
				});

				editor.value = 'test test <a href="#">test</a>';

				simulateEvent('mousedown', 0, editor.editor.querySelector('a'));

				const popup = editor.ownerDocument.querySelector(
					'.jodit_toolbar_popup-inline.jodit_toolbar_popup-inline-open[data-editor_id=' +
						editor.id +
						']'
				);

				expect(popup).is.not.null;
			});

			describe('Click on pencil', function() {
				it('Should open edit link popup', function() {
					const editor = new Jodit(appendTestArea(), {
						observer: {
							timeout: 0
						}
					});

					editor.value = 'test test <a href="#">test</a>';

					simulateEvent(
						'mousedown',
						0,
						editor.editor.querySelector('a')
					);
					const popup = editor.ownerDocument.querySelector(
						'.jodit_toolbar_popup-inline[data-editor_id=' +
							editor.id +
							']'
					);

					expect(popup).is.not.null;
					expect(
						popup.classList.contains(
							'jodit_toolbar_popup-inline-open'
						)
					).is.true;

					const pencil = popup.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-link a'
					);
					expect(pencil).is.not.null;

					simulateEvent('mousedown', 0, pencil);
					const subpopup = popup.querySelector(
						'.jodit_toolbar_popup'
					);

					expect(subpopup).is.not.null;
					expect(subpopup.style.display).equals('block');
					expect(
						popup.classList.contains(
							'jodit_toolbar_popup-inline-open'
						)
					).is.true;
					expect(popup.parentNode.parentNode.parentNode).is.not.null;
				});
			});
		});

		describe('Create table', function() {
			describe('Mouse move', function() {
				it('Should highlight cells in table-creator', function() {
					const editor = new Jodit(appendTestArea());
					simulateEvent(
						'mousedown',
						0,
						editor.container.querySelector(
							'.jodit_toolbar_btn.jodit_toolbar_btn-table'
						)
					);

					const list = editor.container.querySelector(
						'.jodit_toolbar_popup'
					);

					expect(window.getComputedStyle(list).display).equals(
						'block'
					);

					simulateEvent(
						'mousemove',
						0,
						list.querySelectorAll('.jodit_form-container div')[14]
					);
					expect(
						list.querySelectorAll(
							'.jodit_form-container div.hovered'
						).length
					).equals(10);
				});
				describe('In iframe mode', function() {
					it('Should works same way', function() {
						const editor = new Jodit(appendTestArea(), {
							iframe: true
						});

						simulateEvent(
							'mousedown',
							0,
							editor.container.querySelector(
								'.jodit_toolbar_btn.jodit_toolbar_btn-table'
							)
						);

						const list = editor.container.querySelector(
							'.jodit_toolbar_popup'
						);

						expect(window.getComputedStyle(list).display).equals(
							'block'
						);

						const divs = list.querySelectorAll(
							'.jodit_form-container div'
						);

						expect(divs.length).to.be.above(10);

						simulateEvent('mousemove', 0, divs[14]);

						expect(
							list.querySelectorAll(
								'.jodit_form-container div.hovered'
							).length
						).equals(10);
					});
				});
			});
		});
	});

	describe('Buttons', function() {
		describe('Text mode', function() {
			it('Should work i18n', function() {
				const editor = new Jodit(appendTestArea(), {
						textIcons: true,
						language: 'ru'
					}),
					editor2 = new Jodit(appendTestArea(), {
						textIcons: true,
						language: 'en'
					});

				const label1 = editor.container.querySelector(
						'.jodit_toolbar_btn-source'
					).textContent,
					label2 = editor2.container.querySelector(
						'.jodit_toolbar_btn-source'
					).textContent;

				expect(label1).does.not.equal(label2);
			});

			it('Should create buttons with text', function() {
				const editor = new Jodit(appendTestArea(), {
					textIcons: true
				});
				expect(
					editor.container.querySelectorAll(
						'.jodit_toolbar_btn-source'
					).length
				).equals(1);
				expect(
					editor.container.querySelectorAll(
						'.jodit_toolbar_btn-source svg'
					).length
				).equals(0);
			});

			it("Should add jodit_text_icons class to editor's container", function() {
				const editor = new Jodit(appendTestArea(), {
					textIcons: true
				});
				expect(editor.container.classList.contains('jodit_text_icons'))
					.is.true;
			});

			it('Should set font-size more them 0', function() {
				const editor = new Jodit(appendTestArea(), {
					textIcons: true
				});
				expect(
					parseInt(
						editor.ownerWindow.getComputedStyle(
							editor.container.querySelector(
								'.jodit_toolbar_btn-source .jodit_icon'
							)
						).fontSize,
						10
					)
				).to.be.above(10);
			});

			describe('In tabs', function() {
				it('Should be also only text', function() {
					const editor = new Jodit(appendTestArea(), {
						textIcons: true
					});

					expect(
						editor.container.querySelector(
							'.jodit_toolbar_btn-image'
						)
					).is.not.null;

					simulateEvent(
						'mousedown',
						0,
						editor.container.querySelector(
							'.jodit_toolbar_btn-image'
						)
					);

					const popup = editor.container.querySelector(
						'.jodit_toolbar_btn-image .jodit_toolbar_popup.jodit_toolbar_popup-open'
					);

					expect(popup).is.not.null;

					expect(popup.querySelectorAll('svg, img').length).equals(0);
				});
			});

			describe('In brush popup', function() {
				it('Should be also only text', function() {
					const editor = new Jodit(appendTestArea(), {
						textIcons: true
					});

					expect(
						editor.container.querySelector(
							'.jodit_toolbar_btn-brush'
						)
					).is.not.null;

					simulateEvent(
						'mousedown',
						0,
						editor.container.querySelector(
							'.jodit_toolbar_btn-brush'
						)
					);

					const popup = editor.container.querySelector(
						'.jodit_toolbar_btn-brush .jodit_toolbar_popup.jodit_toolbar_popup-open'
					);

					expect(popup).is.not.null;

					expect(popup.querySelectorAll('svg, img').length).equals(0);
				});
			});

			describe('In video popup', function() {
				it('Should be also only text', function() {
					const editor = new Jodit(appendTestArea(), {
						textIcons: true,
						toolbarAdaptive: false
					});

					expect(
						editor.container.querySelector(
							'.jodit_toolbar_btn-video'
						)
					).is.not.null;

					simulateEvent(
						'mousedown',
						0,
						editor.container.querySelector(
							'.jodit_toolbar_btn-video'
						)
					);

					const popup = editor.container.querySelector(
						'.jodit_toolbar_btn-video .jodit_toolbar_popup.jodit_toolbar_popup-open'
					);

					expect(popup).is.not.null;

					expect(popup.querySelectorAll('svg, img').length).equals(0);
				});
			});
		});

		it('Remove default buttons functionality', function() {
			const editor = new Jodit(appendTestArea());
			expect(
				editor.container.querySelectorAll('.jodit_toolbar_btn-source')
					.length
			).equals(1);
			editor.destruct();

			const editor2 = new Jodit(appendTestArea(), {
				removeButtons: ['source']
			});

			expect(
				editor2.container.querySelectorAll('.jodit_toolbar_btn-source')
					.length
			).equals(0);
		});

		it('Add own button', function() {
			const editor = new Jodit(appendTestArea(), {
				disablePlugins: ['mobile'],
				buttons: Jodit.defaultOptions.buttons.concat([
					{
						name: 'insertDate',
						iconURL: 'http://xdsoft.net/jodit/images/logo.png',
						exec: function(editor) {
							editor.selection.insertHTML(
								new Date('2016/03/16').toDateString()
							);
						}
					}
				])
			});

			expect(
				editor.container.querySelectorAll(
					'.jodit_toolbar_btn-insertDate'
				).length
			).equals(1);

			editor.value = '';

			simulateEvent(
				'mousedown',
				0,
				editor.container.querySelector('.jodit_toolbar_btn-insertDate')
			);
			expect(editor.value).equals('Wed Mar 16 2016');
		});

		it('When cursor inside STRONG tag, Bold button should be selected', function() {
			const editor = new Jodit(appendTestArea(), {
				observer: {
					timeout: 0 // disable delay
				}
			});

			editor.value =
				'<strong>test</strong><em>test2</em><i>test3</i><b>test3</b>';
			editor.selection.focus();

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.setStart(editor.editor.firstChild.firstChild, 2);
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);

			simulateEvent('mousedown', 0, editor.editor);

			expect(
				editor.container.querySelectorAll(
					'.jodit_toolbar_btn-bold.jodit_active'
				).length
			).equals(1);

			range.setStart(editor.editor.firstChild.nextSibling.firstChild, 2);
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);

			simulateEvent('mousedown', 0, editor.editor);

			expect(
				editor.container.querySelectorAll(
					'.jodit_toolbar_btn-bold.jodit_active'
				).length
			).equals(0);
			expect(
				editor.container.querySelectorAll(
					'.jodit_toolbar_btn-italic.jodit_active'
				).length
			).equals(1);

			range.setStart(
				editor.editor.firstChild.nextSibling.nextSibling.firstChild,
				2
			);
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);

			simulateEvent('mousedown', 0, editor.editor);

			expect(
				editor.container.querySelectorAll(
					'.jodit_toolbar_btn-bold.jodit_active'
				).length
			).equals(0);
			expect(
				editor.container.querySelectorAll(
					'.jodit_toolbar_btn-italic.jodit_active'
				).length
			).equals(1);

			range.setStart(
				editor.editor.firstChild.nextSibling.nextSibling.nextSibling
					.firstChild,
				2
			);
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);

			simulateEvent('mousedown', 0, editor.editor);

			expect(
				editor.container.querySelectorAll(
					'.jodit_toolbar_btn-bold.jodit_active'
				).length
			).equals(1);
			expect(
				editor.container.querySelectorAll(
					'.jodit_toolbar_btn-italic.jodit_active'
				).length
			).equals(0);
		});

		describe('Disable for mode', function() {
			it('Should disable buttons which can not be used in that mode', function() {
				const editor = new Jodit(appendTestArea(), {
					observer: {
						timeout: 0 // disable delay
					}
				});

				editor.value =
					'<strong>test</strong><em>test2</em><i>test3</i><b>test3</b>'
				;

				editor.setMode(Jodit.MODE_SOURCE);

				expect(
					editor.container.querySelectorAll(
						'.jodit_toolbar_btn-bold.jodit_disabled'
					).length
				).equals(1);
				expect(
					editor.container.querySelectorAll(
						'.jodit_toolbar_btn-source.jodit_disabled'
					).length
				).equals(0);

				editor.setMode(Jodit.MODE_WYSIWYG);

				expect(
					editor.container.querySelectorAll(
						'.jodit_toolbar_btn-bold.jodit_disabled'
					).length
				).equals(0);
				expect(
					editor.container.querySelectorAll(
						'.jodit_toolbar_btn-source.jodit_disabled'
					).length
				).equals(0);
			});

			describe('For list', function() {
				describe('enable', function() {
					it('Should enable buttons which can be used in that mode', function() {
						const editor = new Jodit(appendTestArea(), {
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
									exec: function(editor) {
										const key = this.args[0];

										if (key === 'clear') {
											this.val('');
											return;
										}

										editor.selection.insertHTML(
											'&nbsp;{{test' + key + '}}&nbsp;'
										);
									},
									template: function(key, value) {
										return '<div>' + value + '</div>';
									}
								}
							]
						});

						const btn = editor.container.querySelector(
							'.jodit_toolbar_btn-list_test'
						);
						expect(btn).is.not.null;

						expect(btn.classList.contains('jodit_disabled')).to.be
							.false;

						simulateEvent('mousedown', 0, btn);

						const list = btn.querySelector('.jodit_toolbar_list');
						expect(list).is.not.null;

						expect(
							list.querySelectorAll('.jodit_disabled').length
						).equals(0);
					});
				});

				describe('disable', function() {
					it('Should disable buttons which can not be used in that mode', function() {
						const editor = new Jodit(appendTestArea(), {
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
									exec: function(editor) {
										const key = this.args[0];

										if (key === 'clear') {
											this.val('');
											return;
										}

										editor.selection.insertHTML(
											'&nbsp;{{test' + key + '}}&nbsp;'
										);
									},
									template: function(key, value) {
										return '<div>' + value + '</div>';
									}
								}
							]
						});

						const btn = editor.container.querySelector(
							'.jodit_toolbar_btn-list_test'
						);
						expect(btn).is.not.null;

						expect(btn.classList.contains('jodit_disabled')).is
							.true;

						simulateEvent('mousedown', 0, btn);

						const list = btn.querySelector('.jodit_toolbar_list');
						expect(list).is.null;
					});
				});
			});
		});

		it('When cursor inside SPAN tag with style="font-weight: bold" or style="font-weight: 700", Bold button should be selected', function() {
			const editor = new Jodit(appendTestArea(), {
				observer: {
					timeout: 0 // disable delay
				}
			});

			editor.value = '<span style="font-weight: bold">test</span>';
			editor.selection.focus();

			const sel = editor.selection.sel,
				range = editor.selection.createRange();
			range.setStart(editor.editor.firstChild.firstChild, 2);
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);

			simulateEvent('mousedown', 0, editor.editor);

			expect(
				editor.container.querySelectorAll(
					'.jodit_toolbar_btn-bold.jodit_active'
				).length
			).equals(1);
		});

		describe('Check Redo Undo functionality', function() {
			it('Should change disable in icon then then can not be executed', function() {
				const area = appendTestArea();
				area.value = 'top';
				const editor = new Jodit(area, {
					observer: {
						timeout: 0 // disable delay
					}
				});
				editor.selection.focus();

				editor.value = 'Test';

				expect(
					editor.container.querySelectorAll(
						'.jodit_toolbar_btn-undo.jodit_disabled'
					).length
				).equals(0);
				expect(
					editor.container.querySelectorAll(
						'.jodit_toolbar_btn-redo.jodit_disabled'
					).length
				).equals(1);

				simulateEvent(
					'mousedown',
					0,
					editor.container.querySelector('.jodit_toolbar_btn-undo')
				);

				expect(
					editor.container.querySelectorAll(
						'.jodit_toolbar_btn-undo.jodit_disabled'
					).length
				).equals(1);
				expect(
					editor.container.querySelectorAll(
						'.jodit_toolbar_btn-redo.jodit_disabled'
					).length
				).equals(0);

				expect(editor.value).equals('top');
			});
		});

		it('Full size button', function() {
			const editor = new Jodit(appendTestArea(), {
				observer: {
					timeout: 0 // disable delay
				}
			});

			simulateEvent(
				'mousedown',
				0,
				editor.container.querySelector('.jodit_toolbar_btn-fullsize')
			);

			let node = editor.container.parentNode;

			while (node && node.nodeType !== Node.DOCUMENT_NODE) {
				expect(node.classList.contains('jodit_fullsize_box')).equals(
					true
				);
				node = node.parentNode;
			}
		});

		describe('Extra buttons', function() {
			describe('Options extraButtons', function() {
				it('Should add extra buttons', function() {
					const editor = new Jodit(appendTestArea(), {
						extraButtons: [
							{
								name: 'adddate',
								exec: function(editor) {
									const a = editor.create.inside.text(
										'111'
									);
									editor.selection.insertNode(a);
								}
							}
						]
					});

					editor.value = '';

					expect(
						editor.container.querySelectorAll(
							'.jodit_toolbar_btn-adddate'
						).length
					).equals(1);

					simulateEvent(
						'mousedown',
						0,
						editor.container.querySelector(
							'.jodit_toolbar_btn-adddate'
						)
					);

					expect(editor.value).equals('111');
				});

				describe('extraButtons always append in the end', function() {
					it('Should add extra buttons on postion by buttons potions', function() {
						const editor = new Jodit(appendTestArea(), {
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
									exec: function(editor) {
										const a = editor.create.inside.text(
											'111'
										);
										editor.selection.insertNode(a);
									}
								}
							]
						});

						expect(
							editor.toolbar.getButtonsList().toString()
						).equals('indent,outdent,bold,adddate,dots,adddate');
					});
				});
			});
		});

		describe('Add button', function() {
			it('Should create buttons in toolbar', function() {
				const editor = new Jodit(appendTestArea(), {
					buttons: ['indent', 'outdent', 'bold', 'customxxx'],
					disablePlugins: 'mobile'
				});

				expect(null).does.not.equal(
					editor.container.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-indent'
					)
				);
				expect(null).does.not.equal(
					editor.container.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-outdent'
					)
				);
				expect(null).does.not.equal(
					editor.container.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-bold'
					)
				);
				expect(null).does.not.equal(
					editor.container.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-customxxx'
					)
				);
				expect(null).equals(
					editor.container.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-source'
					)
				);
			});
		});

		describe('Button Bold', function() {
			describe('In collapsed selection', function() {
				it('Should reactivate Bold button after second click and move cursor out of Strong element', function() {
					const editor = new Jodit(appendTestArea(), {
						buttons: ['bold']
					});

					editor.value = '<p>test</p>';
					editor.selection.setCursorAfter(
						editor.editor.firstChild.firstChild
					);

					simulateEvent(
						'mousedown',
						0,
						editor.container.querySelector(
							'.jodit_toolbar_btn-bold'
						)
					);
					editor.selection.insertHTML('text');
					simulateEvent(
						'mousedown',
						0,
						editor.container.querySelector(
							'.jodit_toolbar_btn-bold'
						)
					);
					editor.selection.insertHTML('text');

					expect(editor.value).equals(
						'<p>test<strong>text</strong>text</p>'
					);
				});
			});

			describe('Not collapsed selection', function() {
				it('Should reactivate Bold button after second click and move cursor out of Strong element', function() {
					const editor = new Jodit(appendTestArea(), {
						buttons: ['bold']
					});

					editor.value = 'test test test';

					const range = editor.selection.createRange();
					range.setStart(editor.editor.firstChild, 0);
					range.setEnd(editor.editor.firstChild, 4);

					editor.selection.selectRange(range);

					simulateEvent(
						'mousedown',
						0,
						editor.container.querySelector(
							'.jodit_toolbar_btn-bold'
						)
					);

					expect(editor.value).equals(
						'<strong>test</strong> test test'
					);
				});
			});
		});

		describe('Active button', function() {
			it('Should not be activated then element has default style', function() {
				const editor = new Jodit(appendTestArea(), {
					observer: {
						timeout: 0
					}
				});

				editor.value = '<p>test<strong>bold</strong></p>';
				editor.selection.focus();

				const p = editor.editor.firstChild;
				editor.selection.setCursorAfter(p.firstChild);

				simulateEvent('mousedown', 0, p);

				const bold = editor.container.querySelector(
					'.jodit_toolbar_btn-bold'
				);
				const align = editor.container.querySelector(
					'.jodit_toolbar_btn-left'
				);

				expect(false).equals(align.classList.contains('jodit_active'));
				expect(false).equals(bold.classList.contains('jodit_active'));

				editor.selection.setCursorIn(
					p.querySelector('strong').firstChild
				);
				simulateEvent('mousedown', 0, p);
				// editor.selection.insertHTML('ddd');
				expect(false).equals(align.classList.contains('jodit_active'));
				expect(true).equals(bold.classList.contains('jodit_active'));

				p.style.textAlign = 'right';
				simulateEvent('mousedown', 0, p);
				expect(true).equals(align.classList.contains('jodit_active'));
				expect(true).equals(bold.classList.contains('jodit_active'));
			});

			describe('Fontsize button', function() {
				it('Should be activated then element has no default font-size', function() {
					const editor = new Jodit(appendTestArea(), {
						observer: {
							timeout: 0
						}
					});

					editor.value =
						'<p>test<span style="font-size: 12px">bold</span></p>';
					editor.selection.focus();

					const p = editor.editor.firstChild;
					const fontsize = editor.container.querySelector(
						'.jodit_toolbar_btn-fontsize'
					);

					editor.selection.setCursorAfter(p.firstChild);
					simulateEvent('mousedown', 0, p);
					expect(false).equals(
						fontsize.classList.contains('jodit_active')
					);

					editor.selection.setCursorIn(p.lastChild);
					simulateEvent('mousedown', 0, p);
					expect(true).equals(
						fontsize.classList.contains('jodit_active')
					);
				});
			});

			describe('Color button', function() {
				it('Should be activated then element has some color', function() {
					const editor = new Jodit(appendTestArea(), {
						observer: {
							timeout: 0
						}
					});

					editor.value =
						'<p>test<span style="color: #ccc">bold</span></p>';
					editor.selection.focus();

					const p = editor.editor.firstChild;
					const brush = editor.container.querySelector(
						'.jodit_toolbar_btn-brush'
					);
					const brushIcon = editor.container.querySelector(
						'.jodit_toolbar_btn-brush svg'
					);

					editor.selection.setCursorAfter(p.firstChild);
					simulateEvent('mousedown', 0, p);
					expect(false).equals(
						brush.classList.contains('jodit_active')
					);
					expect('').equals(brushIcon.style.fill);

					editor.selection.setCursorIn(p.lastChild);
					simulateEvent('mousedown', 0, p);
					expect(true).equals(
						brush.classList.contains('jodit_active')
					);
					expect('rgb(204, 204, 204)').equals(brushIcon.style.fill);
				});
			});

			describe('In list', function() {
				describe('Fontsize button', function() {
					it('Should be activated then element has some style value', function() {
						const editor = new Jodit(appendTestArea(), {
							observer: {
								timeout: 0
							}
						});

						editor.value =
							'<p>test<span style="font-size: 16px">bold</span></p>';
						editor.selection.focus();

						const p = editor.editor.firstChild;
						const font = editor.container.querySelector(
							'.jodit_toolbar_btn-fontsize'
						);

						expect(null).does.not.equal(font);

						editor.selection.setCursorAfter(p.firstChild);
						simulateEvent('mousedown', 0, p);
						expect(false).equals(
							font.classList.contains('jodit_active')
						);

						editor.selection.setCursorIn(p.lastChild);

						simulateEvent('mousedown', 0, p);
						expect(true).equals(
							font.classList.contains('jodit_active')
						);

						simulateEvent('mousedown', 0, font);

						const font16 = font.querySelector(
							'.jodit_toolbar_btn-6'
						);
						expect(true).equals(
							font16.classList.contains('jodit_active')
						);
					});
				});

				describe('Font family button', function() {
					it('Should be activated then element has some style value', function() {
						const editor = new Jodit(appendTestArea(), {
							toolbarAdaptive: false,
							observer: {
								timeout: 0
							}
						});

						editor.value =
							'<p>test<span style="font-family: Georgia, serif;">bold</span></p>';
						editor.selection.focus();

						const p = editor.editor.firstChild;
						const font = editor.container.querySelector(
							'.jodit_toolbar_btn-font'
						);

						expect(null).does.not.equal(font);

						editor.selection.setCursorAfter(p.firstChild);
						simulateEvent('mousedown', 0, p);
						expect(false).equals(
							font.classList.contains('jodit_active')
						);

						editor.selection.setCursorIn(p.lastChild);

						simulateEvent('mousedown', 0, p);
						expect(true).equals(
							font.classList.contains('jodit_active')
						);

						simulateEvent('mousedown', 0, font);

						const fontGeorgia = font.querySelector(
							'.jodit_toolbar_btn-Georgia_serif'
						);
						expect(fontGeorgia).does.not.equal(font);
						expect(true).equals(
							fontGeorgia.classList.contains('jodit_active')
						);
					});
				});

				describe('Format block button', function() {
					it('Should be activated then element has some tagname', function() {
						const editor = new Jodit(appendTestArea(), {
							observer: {
								timeout: 0
							}
						});

						editor.value =
							'<p>test</p><h1>test</h1><code>test</code>';
						editor.selection.focus();

						const p = editor.editor.firstChild;
						const paragraph = editor.container.querySelector(
							'.jodit_toolbar_btn-paragraph'
						);

						expect(null).does.not.equal(paragraph);

						editor.selection.setCursorAfter(p.firstChild);
						simulateEvent('mousedown', 0, p);
						expect(false).equals(
							paragraph.classList.contains('jodit_active')
						);

						editor.selection.setCursorIn(
							editor.editor.childNodes[1]
						);

						simulateEvent('mousedown', 0, p);
						expect(true).equals(
							paragraph.classList.contains('jodit_active')
						);

						simulateEvent('mousedown', 0, paragraph);

						const header = paragraph.querySelector(
							'.jodit_toolbar_btn-h1'
						);
						expect(true).equals(
							header.classList.contains('jodit_active')
						);
					});
				});
			});

			describe('Select text with several properties', function() {
				it('Should select all buttons with conditions', function() {
					const editor = new Jodit(appendTestArea(), {
						observer: {
							timeout: 0
						}
					});

					editor.value = '<em><strong><u>bold</u></strong></em>';
					editor.selection.focus();

					const range = editor.selection.createRange();
					range.setStartBefore(editor.editor.firstChild);
					range.setEndAfter(editor.editor.firstChild);
					editor.selection.selectRange(range);

					const bold = editor.container.querySelector(
						'.jodit_toolbar_btn-bold'
					);

					const italic = editor.container.querySelector(
						'.jodit_toolbar_btn-italic'
					);

					const underline = editor.container.querySelector(
						'.jodit_toolbar_btn-underline'
					);

					expect(
						bold.classList.contains('jodit_active')
					).is.true;

					expect(
						italic.classList.contains('jodit_active')
					).is.true;

					expect(
						underline.classList.contains('jodit_active')
					).is.true;
				});
			});
		});

		describe('Disable button', function() {
			describe('Cut and Copy', function() {
				describe('Cut', function() {
					it('Should be activated editor has some selected text', function() {
						const editor = new Jodit(appendTestArea(), {
							toolbarAdaptive: false,
							observer: {
								timeout: 0
							}
						});

						const cut = editor.container.querySelector(
							'.jodit_toolbar_btn-cut'
						);

						editor.value = '<p>test<strong>bold</strong></p>';
						editor.selection.focus();

						expect(true).equals(
							cut.classList.contains('jodit_disabled')
						);

						const p = editor.editor.firstChild;

						editor.selection.select(p.firstChild);

						expect(false).equals(
							cut.classList.contains('jodit_disabled')
						);
					});
				});

				describe('Copy', function() {
					it('Should be activated editor has some selected text', function() {
						const editor = new Jodit(appendTestArea(), {
							toolbarAdaptive: false,
							observer: {
								timeout: 0
							}
						});

						const copy = editor.container.querySelector(
							'.jodit_toolbar_btn-copy'
						);

						editor.value = '<p>test<strong>bold</strong></p>';
						editor.selection.focus();

						expect(true).equals(
							copy.classList.contains('jodit_disabled')
						);

						const p = editor.editor.firstChild;

						editor.selection.select(p.firstChild);

						expect(false).equals(
							copy.classList.contains('jodit_disabled')
						);
					});
				});
			});

			describe('Color button', function() {
				it('Should be disabled and icon should have default color', function() {
					const color = Jodit.defaultOptions.controls.brush,
						defaultIsDisabled = color.isDisable;

					color.isDisable = () => true; // Always disabled

					const editor = new Jodit(appendTestArea(), {
						observer: {
							timeout: 0
						}
					});

					editor.value =
						'<p>test<span style="color: #ccc">bold</span></p>';
					editor.selection.focus();

					const p = editor.editor.firstChild,
						brush = editor.container.querySelector(
							'.jodit_toolbar_btn-brush'
						),
						brushIcon = editor.container.querySelector(
							'.jodit_toolbar_btn-brush svg'
						);

					editor.selection.setCursorAfter(p.firstChild);
					simulateEvent('mousedown', 0, p);
					expect(false).equals(
						brush.classList.contains('jodit_active')
					);
					expect('').equals(brushIcon.style.fill);

					editor.selection.setCursorIn(p.lastChild);
					simulateEvent('mousedown', 0, p);
					expect(false).equals(
						brush.classList.contains('jodit_active')
					);
					expect('').equals(brushIcon.style.fill);

					color.isDisable = defaultIsDisabled;
				});
			});
		});
	});

	describe('Commands', function() {
		it('Click on Source button should change current mode', function() {
			const editor = new Jodit(appendTestArea());

			simulateEvent(
				'mousedown',
				0,
				editor.container.querySelector('.jodit_toolbar_btn-source')
			);

			expect(editor.getMode()).equals(Jodit.MODE_SOURCE);
		});

		it('Click on Bold button should wrap current selection in <strong>', function() {
			const editor = new Jodit(appendTestArea());

			editor.value = 'Text to text';
			editor.selection.focus();

			const sel = editor.selection.sel,
				range = editor.selection.createRange();
			range.setStart(editor.editor.firstChild, 3);
			range.setEnd(editor.editor.firstChild, 10);
			sel.removeAllRanges();
			sel.addRange(range);

			simulateEvent(
				'mousedown',
				0,
				editor.container.querySelector('.jodit_toolbar_btn-bold')
			);

			expect(editor.value).equals(
				'Tex<strong>t to te</strong>xt'
			);
		});

		it('Click on Italic button when selection is collapsed should create new <em> element and set cursor into it', function() {
			const editor = new Jodit(appendTestArea());

			editor.value = 'Text to text';
			editor.selection.focus();

			const sel = editor.selection.sel,
				range = editor.selection.createRange();
			range.setStart(editor.editor.firstChild, 0);
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);

			simulateEvent(
				'mousedown',
				0,
				editor.container.querySelector('.jodit_toolbar_btn-italic')
			);

			editor.selection.insertHTML('test');

			expect(editor.value).equals('<em>test</em>Text to text');
		});

		it('Click on unordered list button when selection is collapsed should wrap current box in  new <ul><li> element', function() {
			const editor = new Jodit(appendTestArea());

			editor.value = '<p>Text to text</p>';

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.setStart(editor.editor.firstChild.firstChild, 0);
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);

			simulateEvent(
				'mousedown',
				0,
				editor.container.querySelector('.jodit_toolbar_btn-ul')
			);

			editor.selection.insertHTML('test ');

			expect(editor.value).equals(
				'<ul><li>test Text to text</li></ul>'
			);
		});
	});

	describe('Inline', function() {
		describe('Сlick on the image', function() {
			it('Should Open inline popup', function() {
				const editor = new Jodit(appendTestArea());

				editor.value = '<img alt="" src="../artio.jpg"/>';
				editor.selection.focus();

				simulateEvent(
					'mousedown',
					0,
					editor.editor.querySelector('img')
				);

				const popup = editor.ownerDocument.querySelector(
					'.jodit_toolbar_popup-inline'
				);

				expect(popup && popup.parentNode.parentNode !== null).equals(
					true
				);
			});

			describe('and click in opened popup on pencil button', function() {
				it('Should Open edit image dialog', function() {
					const editor = new Jodit(appendTestArea());

					editor.value = '<img alt="" src="../artio.jpg"/>';
					editor.selection.focus();

					simulateEvent(
						'mousedown',
						0,
						editor.editor.querySelector('img')
					);

					const popup = editor.ownerDocument.querySelector(
						'.jodit_toolbar_popup-inline'
					);

					expect(
						popup && popup.parentNode.parentNode !== null
					).is.true;

					simulateEvent(
						'mousedown',
						0,
						popup.querySelector(
							'.jodit_toolbar_btn.jodit_toolbar_btn-pencil'
						)
					);

					const dialog = editor.ownerDocument.querySelector(
						'.jodit.jodit_dialog_box.active[data-editor_id=' +
							editor.id +
							']'
					);

					expect(dialog).is.not.null;
				});
			});
		});

		it('Open inline popup after click inside the cell', function() {
			const editor = new Jodit(appendTestArea());

			editor.value =
				'<table>' + '<tr><td>1</td></tr>' + '</table>'
			;

			simulateEvent('mousedown', 0, editor.editor.querySelector('td'));

			const popup = editor.ownerDocument.querySelector(
				'.jodit_toolbar_popup-inline'
			);

			expect(popup && popup.parentNode.parentNode !== null).is.true;
		});

		describe('Table button', function() {
			describe('Select table cell', function() {
				it('Should Select table cell', function() {
					const editor = new Jodit(appendTestArea());

					editor.value =
						'<table>' + '<tr><td>2</td></tr>' + '</table>'
					;

					const td = editor.editor.querySelector('td');

					simulateEvent('mousedown', 0, td);

					expect(
						td.hasAttribute(Jodit.JODIT_SELECTED_CELL_MARKER)
					).is.true;
				});
				describe('and press brushh button', function() {
					it('Should Select table cell and fill it in yellow', function() {
						const editor = new Jodit(appendTestArea());

						editor.value =
							'<table>' + '<tr><td>3</td></tr>' + '</table>'
						;

						const td = editor.editor.querySelector('td');

						simulateEvent('mousedown', 0, td);
						simulateEvent('mousemove', 0, td);

						const popup = editor.ownerDocument.querySelector(
							'.jodit_toolbar_popup-inline'
						);

						expect(
							popup && popup.parentNode.parentNode !== null
						).is.true;

						simulateEvent(
							'mousedown',
							0,
							popup.querySelector('.jodit_toolbar_btn-brush>a')
						);

						const popupColor = popup.querySelector(
							'.jodit_toolbar_popup'
						);
						expect(
							popupColor &&
								window.getComputedStyle(popupColor).display
						).equals('block');

						simulateEvent(
							'mousedown',
							0,
							popupColor.querySelector(
								'.jodit_colorpicker_group>a'
							)
						);

						expect(
							Jodit.modules.Helpers.normalizeColor(
								td.style.backgroundColor
							)
						).equals('#000000');
					});
				});
			});
		});

		it('Select table cell and change it vertical align', function() {
			const editor = new Jodit(appendTestArea());

			editor.value =
				'<table>' +
				'<tr><td style="vertical-align: middle">3</td></tr>' +
				'</table>';

			const td = editor.editor.querySelector('td');

			simulateEvent('mousedown', 0, td);

			const popup = editor.ownerDocument.querySelector(
				'.jodit_toolbar_popup-inline'
			);

			expect(popup && popup.parentNode.parentNode !== null).is.true;

			simulateEvent(
				'mousedown',
				0,
				popup.querySelector('.jodit_toolbar_btn-valign>a')
			);

			const popupColor = popup.querySelector('.jodit_toolbar_list');
			expect(
				popupColor && window.getComputedStyle(popupColor).display
			).equals('block');

			simulateEvent('mousedown', 0, popupColor.querySelector('li>a'));

			expect(td.style.verticalAlign).equals('top');
		});

		it('Select table cell and split it by vertical', function() {
			const editor = new Jodit(appendTestArea());

			editor.value =
				'<table style="width: 300px;">' +
					'<tr><td>3</td></tr>' +
					'</table>'
			;

			const td = editor.editor.querySelector('td');

			simulateEvent('mousedown', 0, td);

			const popup = editor.ownerDocument.querySelector(
				'.jodit_toolbar_popup-inline'
			);

			simulateEvent(
				'mousedown',
				0,
				popup.querySelector('.jodit_toolbar_btn-splitv>a')
			);

			const list = popup.querySelector(
				'.jodit_toolbar_list.jodit_toolbar_list-open'
			);
			expect(list).is.not.null;
			simulateEvent(
				'mousedown',
				0,
				list.querySelector(
					'.jodit_toolbar_btn.jodit_toolbar_btn-tablesplitv a'
				)
			);

			expect(sortAttributes(editor.value)).equals(
				'<table style="width:300px"><tbody><tr><td style="width:49.83%">3</td><td style="width:49.83%"><br></td></tr></tbody></table>'
			);
		});

		it('Select table cell and split it by horizontal', function() {
			const editor = new Jodit(appendTestArea());

			editor.value =
				'<table style="width: 300px;">' +
					'<tr><td>5</td></tr>' +
					'</table>'
			;

			const td = editor.editor.querySelector('td');

			simulateEvent('mousedown', 0, td);

			const popup = editor.ownerDocument.querySelector(
				'.jodit_toolbar_popup-inline'
			);

			simulateEvent(
				'mousedown',
				0,
				popup.querySelector('.jodit_toolbar_btn-splitv>a')
			);
			const list = popup.querySelector(
				'.jodit_toolbar_list.jodit_toolbar_list-open'
			);
			expect(list).is.not.null;
			simulateEvent(
				'mousedown',
				0,
				list.querySelector(
					'.jodit_toolbar_btn.jodit_toolbar_btn-tablesplitg a'
				)
			);

			expect(sortAttributes(editor.value)).equals(
				'<table style="width:300px"><tbody><tr><td>5</td></tr><tr><td><br></td></tr></tbody></table>'
			);
		});

		it('Select two table cells and merge then in one', function() {
			const editor = new Jodit(appendTestArea());

			editor.value =
				'<table style="width: 300px;">' +
					'<tr><td>5</td><td>6</td></tr>' +
					'</table>'
			;

			const td = editor.editor.querySelector('td');

			simulateEvent('mousedown', 0, td);
			simulateEvent(
				'mousemove',
				0,
				editor.editor.querySelectorAll('td')[1]
			);

			const popup = editor.ownerDocument.querySelector(
				'.jodit_toolbar_popup-inline'
			);

			simulateEvent(
				'mousedown',
				0,
				popup.querySelector('.jodit_toolbar_btn-merge>a')
			);

			expect(editor.value).equals(
				'<table style="width: 300px;"><tbody><tr><td >5<br>6</td></tr></tbody></table>'
			);
		});

		it('Select table cell add column before this', function() {
			const editor = new Jodit(appendTestArea());

			editor.value =
				'<table>' + '<tr><td>3</td></tr>' + '</table>'
			;

			const td = editor.editor.querySelector('td');

			simulateEvent('mousedown', 0, td);

			const popup = editor.ownerDocument.querySelector(
				'.jodit_toolbar_popup-inline'
			);

			expect(popup && popup.parentNode.parentNode !== null).is.true;

			simulateEvent(
				'mousedown',
				0,
				popup.querySelector('.jodit_toolbar_btn-addcolumn>a')
			);

			const popupColor = popup.querySelector('.jodit_toolbar_list');
			expect(
				popupColor && window.getComputedStyle(popupColor).display
			).equals('block');

			simulateEvent('mousedown', 0, popupColor.querySelector('li>a'));

			expect(editor.value).equals(
				'<table><tbody><tr><td></td><td >3</td></tr></tbody></table>'
			);
		});

		it('Select table cell and add row above this', function() {
			const editor = new Jodit(appendTestArea());

			editor.value =
				'<table>' + '<tr><td>3</td></tr>' + '</table>'
			;

			const td = editor.editor.querySelector('td');

			simulateEvent('mousedown', 0, td);

			const popup = editor.ownerDocument.querySelector(
				'.jodit_toolbar_popup-inline'
			);

			expect(popup && popup.parentNode.parentNode !== null).is.true;

			simulateEvent(
				'mousedown',
				0,
				popup.querySelector('.jodit_toolbar_btn-addrow>a')
			);

			const popupColor = popup.querySelector('.jodit_toolbar_list');
			expect(
				popupColor && window.getComputedStyle(popupColor).display
			).equals('block');

			simulateEvent('mousedown', 0, popupColor.querySelector('li>a'));

			expect(editor.value).equals(
				'<table><tbody><tr><td></td></tr><tr><td >3</td></tr></tbody></table>'
			);
		});

		it('Select table cell and remove it row', function() {
			const editor = new Jodit(appendTestArea());

			editor.value =
				'<table>' +
					'<tr><td>1</td></tr>' +
					'<tr><td>2</td></tr>' +
					'<tr><td>3</td></tr>' +
					'</table>'
			;

			const td = editor.editor.querySelectorAll('td')[1];

			simulateEvent('mousedown', 0, td);

			const popup = editor.ownerDocument.querySelector(
				'.jodit_toolbar_popup-inline'
			);

			expect(popup && popup.parentNode.parentNode !== null).is.true;

			simulateEvent(
				'mousedown',
				0,
				popup.querySelector('.jodit_toolbar_btn-delete>a')
			);

			const popupColor = popup.querySelector('.jodit_toolbar_list');
			expect(
				popupColor && window.getComputedStyle(popupColor).display
			).equals('block');

			simulateEvent(
				'mousedown',
				0,
				popupColor.querySelectorAll('li>a')[1]
			);

			expect(editor.value).equals(
				'<table><tbody><tr><td>1</td></tr><tr><td>3</td></tr></tbody></table>'
			);
		});

		it('Select table cell and remove whole table should hide inline popup', function() {
			const editor = new Jodit(appendTestArea());

			editor.value =
				'<table>' +
					'<tr><td>1</td></tr>' +
					'<tr><td>2</td></tr>' +
					'<tr><td>3</td></tr>' +
					'</table>'
			;

			const td = editor.editor.querySelectorAll('td')[1];

			simulateEvent('mousedown', 0, td);

			const popup = editor.ownerDocument.querySelector(
				'.jodit_toolbar_popup-inline'
			);

			expect(popup && popup.parentNode.parentNode !== null).is.true;

			simulateEvent(
				'mousedown',
				0,
				popup.querySelector('.jodit_toolbar_btn-delete>a')
			);

			const popupColor = popup.querySelector('.jodit_toolbar_list');
			expect(
				popupColor && window.getComputedStyle(popupColor).display
			).equals('block');

			simulateEvent(
				'mousedown',
				0,
				popupColor.querySelectorAll('li>a')[0]
			);

			expect(editor.value).equals('');

			expect(popup && popup.parentNode).is.null;
		});
	});

	describe('In fileBrowser', function() {
		describe('Hide buttons ', function() {
			it('should hide toolbar buttons', function() {
				const editor = new Jodit(appendTestArea(), {
					filebrowser: {
						buttons: Jodit.Array([
							'filebrowser.list',
							'filebrowser.tiles',
							'filebrowser.sort'
						]),
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					}
				});

				simulateEvent(
					'mousedown',
					0,
					editor.ownerDocument.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-image'
					)
				);

				const popup = editor.ownerDocument.querySelector(
					'.jodit_toolbar_popup'
				);

				expect(popup && popup.style.display !== 'none').is.true;
				simulateEvent(
					'mousedown',
					0,
					popup.querySelectorAll('.jodit_tabs_buttons > a')[0]
				);

				const dialog = editor.ownerDocument.querySelector(
					'.jodit.jodit_dialog_box.active[data-editor_id=' +
						editor.id +
						']'
				);

				expect(dialog).is.not.null;

				expect(3).equals(
					dialog.querySelectorAll(
						'.jodit_dialog_header .jodit_dialog_header-title .jodit_toolbar_btn'
					).length
				);
			});
		});
	});

	describe('One toolbar for several editors', function() {
		it('Should create one Jodit instance but with several edit places', function() {
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

			expect(firstEditPlace.innerHTML).equals('first');
			expect(secondEditPlace.innerHTML).equals('second');
			expect(thirdEditPlace.innerHTML).equals('third');
		});

		describe('For all instances you can set self options', function() {
			it('Should change options for all instances', function() {
				const toolbarBox = appendTestDiv(),
					firstEditPlace = appendTestDiv('firstEditPlace'),
					secondEditPlace = appendTestDiv('secondEditPlace'),
					thirdEditPlace = appendTestDiv('thirdEditPlace'),
					editor = Jodit.make(firstEditPlace);

				editor.setPanel(toolbarBox);

				editor.value = 'first';

				editor.addPlace(secondEditPlace, {
					"readonly": true,
					"showCharsCounter": false,
					"showWordsCounter": false,
					"showXPathInStatusbar": false
				});

				editor.value = 'second';

				editor.addPlace(thirdEditPlace, {
					"readonly": false,
					"showCharsCounter": false,
					"showWordsCounter": false,
					"showXPathInStatusbar": false
				});

				editor.value = 'third';

				const editPlaces = editor.ownerDocument.querySelectorAll('.jodit_wysiwyg');
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
