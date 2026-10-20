/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Resize plugin', () => {
	describe('Iframe mode', () => {
		// https://github.com/xdan/jodit/issues/1264
		describe('Resize image', () => {
			const makeEditorWithImage = () => {
				const editor = getJodit({
					iframe: true,
					editHTMLDocumentMode: true,
					history: { timeout: 0 }
				});

				// a non-zero workplace offset makes a wrongly applied
				// iframe-coordinate correction visible
				editor.container.style.marginLeft = '50px';

				editor.value =
					'<p><img alt="" src="tests/artio.jpg" style="width:100px;height:100px"/></p>';

				const img = editor.editor.querySelector('img');
				simulateEvent(['mousedown', 'mouseup', 'click'], img);

				const resizer = document.querySelector(
					'.jodit-resizer[data-editor_id=' + editor.id + ']'
				);
				expect(resizer).is.not.null;

				// bottom-right handle
				const handle = resizer.getElementsByTagName('div')[2];
				const pos = offset(handle);

				simulateEvent('mousedown', handle, data => {
					data.clientX = pos.left;
					data.clientY = pos.top;
				});

				return { editor, img, handle, pos };
			};

			it('Should use mousemove coordinates of the main window as is', () => {
				const { editor, img, pos } = makeEditorWithImage();

				simulateEvent('mousemove', editor.ow, data => {
					data.clientX = pos.left + 10;
					data.clientY = pos.top + 10;
				});

				simulateEvent('mouseup', editor.ow);

				expect(img.offsetWidth).equals(110);
			});

			it('Should shift mousemove coordinates proxied from the iframe into the main window space', () => {
				const { editor, img, pos } = makeEditorWithImage();

				const workplace = offset(editor.workplace);

				simulateEvent('mousemove', editor.ow, data => {
					data.view = editor.ew;
					data.clientX = pos.left + 10 - workplace.left;
					data.clientY = pos.top + 10 - workplace.top;
				});

				simulateEvent('mouseup', editor.ow);

				expect(img.offsetWidth).equals(110);
			});
		});

		// https://github.com/xdan/jodit/issues/1266
		// https://github.com/xdan/jodit/issues/1577
		it('Should keep the frame on the image when the iframe content is scrolled', async () => {
			const editor = getJodit({
				iframe: true,
				editHTMLDocumentMode: true,
				height: 200,
				history: { timeout: 0 }
			});

			editor.value =
				'<p>line</p>'.repeat(20) +
				'<p><img alt="" src="tests/artio.jpg" style="width:100px;height:100px"/></p>' +
				'<p>line</p>'.repeat(20);

			const img = editor.editor.querySelector('img');
			simulateEvent('click', img);

			const resizer = document.querySelector(
				'.jodit-resizer[data-editor_id=' + editor.id + ']'
			);
			expect(resizer).is.not.null;

			editor.ew.scrollTo(0, 300);
			await delay(100);

			expect(resizer.parentNode).is.not.null;
			expect(
				Math.round(
					img.getBoundingClientRect().top +
						editor.iframe.getBoundingClientRect().top
				)
			).equals(Math.round(resizer.getBoundingClientRect().top));
		});
	});

	describe('Resize box', () => {
		describe('In relative object', () => {
			it('should be in front of image', () => {
				const div = document.createElement('div');
				div.innerHTML =
					'<div style="width:800px; margin:auto; border:1px solid red;">\n' +
					'        wrong image selection\n' +
					'        <div style="position:relative;text-align: left">\n' +
					'            <textarea id="text__area0"> <img src="tests/artio.jpg" style="border:1px solid red;width:100px;height:100px;"/></textarea>\n' +
					'        </div>\n' +
					'    </div>';

				document.body.appendChild(div);

				const editor = Jodit.make('#text__area0');
				simulateEvent('click', 0, editor.editor.querySelector('img'));

				const resizer = document.querySelector(
					'.jodit-resizer[data-editor_id=text__area0]'
				);
				expect(resizer).is.not.null;

				const positionResizer = offset(resizer);
				const positionImg = offset(editor.editor.querySelector('img'));

				expect(Math.abs(positionResizer.left - positionImg.left) < 2).is
					.true;
				expect(Math.abs(positionResizer.top - positionImg.top) < 2).is
					.true;

				editor.destruct();
				document.body.removeChild(div);
			});
		});

		describe('After resize - popup', () => {
			it('should be hidden and after this should be shown', () => {
				const div = document.createElement('div');
				div.innerHTML =
					'<div style="width:800px; margin:auto; border:1px solid red;">\n' +
					'        wrong image selection\n' +
					'        <div style="position:relative;text-align: left">\n' +
					'            <textarea id="text__area1"> &lt;img src="tests/artio.jpg" style="border:1px solid red;width:100px;height:100px;"/&gt;</textarea>\n' +
					'        </div>\n' +
					'    </div>';

				document.body.appendChild(div);

				const editor = Jodit.make(
					document.getElementById('text__area1')
				);
				simulateEvent(
					['mousedown', 'mouseup', 'click'],
					editor.editor.querySelector('img')
				);
				//
				const popup = getOpenedPopup(editor);
				//
				expect(popup).is.not.null;
				//
				const resizer = editor.ownerDocument.querySelector(
					'.jodit-resizer[data-editor_id=text__area1]'
				);
				expect(resizer).is.not.null;
				//
				const positionResizer = offset(resizer);
				//
				simulateEvent(
					'mousedown',
					resizer.getElementsByTagName('div')[0]
				);
				simulateEvent('mousemove', editor.ownerWindow, function (data) {
					data.clientX = positionResizer.left - 10;
					data.clientY = positionResizer.top - 10;
				});
				//
				expect(popup.parentNode).is.null;

				simulateEvent('mouseup', editor.ownerWindow, function (data) {
					data.clientX = positionResizer.left - 10;
					data.clientY = positionResizer.top - 10;
				});

				expect(popup.parentNode).is.null;
				//
				editor.destruct();
				div.parentNode && div.parentNode.removeChild(div);
			});
		});

		describe('Resize image', () => {
			const resizeImage = function (editor) {
				const img = editor.editor.querySelector('img');

				simulateEvent(['mousedown', 'mouseup', 'click'], img);

				const resizer = document.querySelector(
					'.jodit-resizer[data-editor_id=' + editor.id + ']'
				);

				const handle = resizer.getElementsByTagName('div')[1],
					pos = offset(handle);

				simulateEvent('mousedown', handle, data => {
					data.clientX = pos.left;
					data.clientY = pos.top;
				});

				simulateEvent('mousemove', editor.ow, data => {
					data.clientX = pos.left + 10;
					data.clientY = pos.top + 10;
				});

				simulateEvent('mouseup', editor.ow, data => {
					data.clientX = pos.left + 10;
					data.clientY = pos.top + 10;
				});
			};

			describe('Size box', () => {
				it('Should show size for image', function (done) {
					const editor = getJodit({
						history: {
							timeout: 0
						},
						resizer: {
							hideSizeTimeout: 400
						}
					});
					editor.value =
						'<img src="tests/artio.jpg" style="width:500px;height: 281px;"/>';

					simulateEvent(
						['mousedown', 'mouseup', 'click'],
						editor.editor.querySelector('img')
					);

					const resizer = document.querySelector(
						'.jodit-resizer[data-editor_id=' + editor.id + ']'
					);
					expect(resizer).is.not.null;

					const sizer = resizer.querySelector('span');
					expect(sizer).is.not.null;
					expect(
						editor.ownerWindow.getComputedStyle(sizer).opacity
					).equals('0');

					const positionResizer = offset(
						resizer.getElementsByTagName('div')[1]
					);

					simulateEvent(
						'mousedown',
						resizer.getElementsByTagName('div')[1]
					);

					simulateEvent(
						'mousemove',
						editor.ownerWindow,
						function (data) {
							data.clientX = positionResizer.left + 10;
							data.clientY = positionResizer.top + 10;
						}
					);

					simulateEvent(
						'mouseup',
						editor.ownerWindow,
						function (data) {
							data.clientX = positionResizer.left + 10;
							data.clientY = positionResizer.top + 10;
						}
					);

					expect(sizer.style.opacity).equals('1');

					editor.async.setTimeout(() => {
						expect(sizer.style.opacity).equals('0');
						done();
					}, 500);
				});

				describe('For small state', () => {
					it('Should hide size', () => {
						const editor = getJodit({
							history: {
								timeout: 0
							},
							resizer: {
								hideSizeTimeout: 400
							}
						});

						editor.value =
							'<img src="tests/artio.jpg" style="width:500px;height: 281px;"/>';

						simulateEvent(
							['mousedown', 'mouseup', 'click'],
							editor.editor.querySelector('img')
						);

						const resizer = document.querySelector(
							'.jodit-resizer[data-editor_id=' + editor.id + ']'
						);
						expect(resizer).is.not.null;

						const sizer = resizer.querySelector('span');
						expect(sizer).is.not.null;
						expect(
							editor.ownerWindow.getComputedStyle(sizer).opacity
						).equals('0');

						const positionResizer = offset(
							resizer.getElementsByTagName('div')[2]
						);

						simulateEvent(
							'mousedown',
							resizer.getElementsByTagName('div')[2]
						);

						simulateEvent(
							'mousemove',
							editor.ownerWindow,
							function (data) {
								data.clientX = positionResizer.left - 480;
								data.clientY = positionResizer.top - 200;
							}
						);

						simulateEvent(
							'mouseup',
							editor.ownerWindow,
							function (data) {
								data.clientX = positionResizer.left - 480;
								data.clientY = positionResizer.top - 200;
							}
						);

						expect(sizer.style.opacity).equals('0');
					});
				});

				describe('Save aspect ratio', () => {
					describe('Disable useAspectRatio option', () => {
						it("should don't save it", async () => {
							const editor = getJodit({
								resizer: {
									useAspectRatio: false
								}
							});

							editor.value =
								'<p><img src="tests/artio.jpg" style="width: 301px;"/></p>';

							await onLoadImage(
								editor.editor.querySelector('img')
							);
							resizeImage(editor);

							expect(sortAttributes(editor.value)).eq(
								'<p><img src="tests/artio.jpg" style="height:159px;width:311px"></p>'
							);
						});

						describe('With Alt button', () => {
							it("should don't save it", async () => {
								const editor = getJodit();

								editor.value =
									'<p><img src="tests/artio.jpg" style="width: 301px;"/></p>';

								await onLoadImage(
									editor.editor.querySelector('img')
								);

								simulateEvent('keydown', 'Alt', editor.ew);
								resizeImage(editor);

								expect(sortAttributes(editor.value)).eq(
									'<p><img src="tests/artio.jpg" style="height:159px;width:311px"></p>'
								);
							});
						});
					});

					describe('Enable useAspectRatio only for table', () => {
						it("should don't save it for images", async () => {
							const editor = getJodit({
								resizer: {
									useAspectRatio: new Set(['table'])
								}
							});

							editor.value =
								'<p><img src="tests/artio.jpg" style="width: 301px;"/></p>';

							await onLoadImage(
								editor.editor.querySelector('img')
							);

							resizeImage(editor);

							expect(sortAttributes(editor.value)).eq(
								'<p><img src="tests/artio.jpg" style="height:159px;width:311px"></p>'
							);
						});
					});

					describe('Enable useAspectRatio for all', () => {
						it('should save it for all', async () => {
							const editor = getJodit({
								resizer: {
									useAspectRatio: true
								}
							});

							editor.value =
								'<p><img src="tests/artio.jpg" style="width: 301px;"/></p>';

							await onLoadImage(
								editor.editor.querySelector('img')
							);

							resizeImage(editor);

							expect(sortAttributes(editor.value)).eq(
								'<p><img src="tests/artio.jpg" style="height:175px;width:311px"></p>'
							);
						});
					});
				});

				describe('For styled image', () => {
					describe('Disable forImageChangeAttributes', () => {
						it('Should change only styles width and height', async () => {
							const editor = getJodit({
								history: {
									timeout: 0
								}
							});

							editor.value =
								'<p><img src="tests/artio.jpg" style="width: 301px;"/></p>';

							await onLoadImage(
								editor.editor.querySelector('img')
							);
							resizeImage(editor);

							expect(sortAttributes(editor.value)).eq(
								'<p><img src="tests/artio.jpg" style="height:175px;width:311px"></p>'
							);
						});
					});

					describe('Enable forImageChangeAttributes', () => {
						describe('Does not has width or height styles', () => {
							it('Should change only attributes width and height', async () => {
								const editor = getJodit({
									resizer: {
										forImageChangeAttributes: true
									},
									history: {
										timeout: 0
									}
								});

								editor.value =
									'<p><img src="tests/artio.jpg"/></p>';

								await onLoadImage(
									editor.editor.querySelector('img')
								);
								resizeImage(editor);

								expect(sortAttributes(editor.value)).eq(
									'<p><img height="287" src="tests/artio.jpg" width="510"></p>'
								);
							});
						});

						describe('Has width or height styles', () => {
							describe('Has width style', () => {
								it('Should change attributes width and height and width styles', async () => {
									const editor = getJodit({
										resizer: {
											forImageChangeAttributes: true
										},
										history: {
											timeout: 0
										}
									});

									editor.value =
										'<p><img src="tests/artio.jpg" style="width:300px"/></p>';

									await onLoadImage(
										editor.editor.querySelector('img')
									);

									resizeImage(editor);

									expect(sortAttributes(editor.value)).eq(
										'<p><img height="175" src="tests/artio.jpg" style="width:310px" width="310"></p>'
									);
								});
							});

							describe('Has height style', () => {
								it('Should change attributes width and height and height styles', async () => {
									const editor = getJodit({
										resizer: {
											forImageChangeAttributes: true
										},
										history: {
											timeout: 0
										}
									});

									editor.value =
										'<p><img src="tests/artio.jpg" style="height:300px"/></p>';

									await onLoadImage(
										editor.editor.querySelector('img')
									);

									resizeImage(editor);

									expect(sortAttributes(editor.value)).eq(
										'<p><img height="306" src="tests/artio.jpg" style="height:306px" width="544"></p>'
									);
								});
							});

							describe('Has both height and width style', () => {
								it('Should change attributes width and height and width and height styles', async () => {
									const editor = getJodit({
										resizer: {
											forImageChangeAttributes: true
										},
										history: {
											timeout: 0
										}
									});

									editor.value =
										'<p><img src="tests/artio.jpg" style="width:300px;height:300px"/></p>';

									await onLoadImage(
										editor.editor.querySelector('img')
									);

									resizeImage(editor);

									expect(sortAttributes(editor.value)).eq(
										'<p><img height="310" src="tests/artio.jpg" style="height:310px;width:310px" width="310"></p>'
									);
								});
							});
						});
					});
				});
			});

			it('Should not allow to resize image more then width of editor', async () => {
				getBox().style.width = '600px';
				const editor = getJodit();
				const image = new Image();
				image.src = 'tests/artio.jpg';

				await onLoadImage(image);

				const ratio = image.naturalWidth / image.naturalHeight;

				editor.value =
					'<p><img src="tests/artio.jpg" style="width:500px;height: 281px;"/></p>';
				const img = editor.editor.querySelector('img');
				await onLoadImage(img);

				simulateEvent(['mousedown', 'mouseup', 'click'], 0, img);
				const resizer = document.querySelector(
					'.jodit-resizer[data-editor_id=' + editor.id + ']'
				);
				expect(resizer).is.not.null;

				const positionResizer = offset(resizer);
				//

				simulateEvent(
					'mousedown',
					resizer.getElementsByTagName('div')[1]
				);

				simulateEvent('mousemove', editor.ownerWindow, function (data) {
					data.clientX = positionResizer.left + 1000;
					data.clientY = positionResizer.top + 1000;
				});

				simulateEvent('mouseup', editor.ownerWindow, function (data) {
					data.clientX = positionResizer.left + 1000;
					data.clientY = positionResizer.top + 1000;
				});
				const newRatio = img.offsetWidth / img.offsetHeight;

				expect(img.offsetWidth).equals(editor.editor.offsetWidth - 16);

				expect(Math.abs(newRatio - ratio) < 0.01).is.true;
			});
		});
	});

	// https://github.com/xdan/jodit/issues/1474
	describe('For iframes inside a hidden container', () => {
		const makeHiddenEditor = value => {
			const host = document.createElement('div');
			host.style.cssText = 'display:none;width:800px;';
			document.body.appendChild(host);

			const area = document.createElement('textarea');
			host.appendChild(area);

			const editor = getJodit({}, area);
			editor.value = value;

			return { editor, host };
		};

		it('Should not collapse the iframe wrapper to zero size', () => {
			const { editor, host } = makeHiddenEditor(
				'<iframe src="about:blank" width="560" height="315"></iframe>' +
					'<p>Text after the video</p>'
			);

			host.style.display = 'block';

			const wrapper = editor.editor.querySelector(
				'[data-jodit_iframe_wrapper]'
			);

			expect(wrapper).is.not.null;

			expect(wrapper.offsetWidth).is.above(0);
			expect(wrapper.offsetHeight).is.above(0);

			host.parentNode.removeChild(host);
		});

		it('Should keep the following text below the iframe', () => {
			const { editor, host } = makeHiddenEditor(
				'<iframe src="about:blank" width="560" height="315"></iframe>' +
					'<p>Text after the video</p>'
			);

			host.style.display = 'block';

			const iframe = editor.editor.querySelector('iframe');
			const paragraph = editor.editor.querySelector('p');

			const overlaps =
				paragraph.getBoundingClientRect().top <
				iframe.getBoundingClientRect().bottom;

			expect(overlaps).is.false;

			host.parentNode.removeChild(host);
		});

		it('Should not turn a percentage width into pixels', () => {
			const { editor, host } = makeHiddenEditor(
				'<iframe src="about:blank" width="100%" height="500"></iframe>'
			);

			host.style.display = 'block';

			const wrapper = editor.editor.querySelector(
				'[data-jodit_iframe_wrapper]'
			);

			expect(wrapper.style.width).does.not.equal('100px');

			host.parentNode.removeChild(host);
		});
	});

	describe('For iframes', () => {
		it('should wrap these iframes inside JODIT tag', () => {
			const editor = getJodit();
			editor.value =
				'<iframe style="border: 0px currentColor; border-image: none;" src="https://www.google.com/maps/embed" frameborder="0" width="100%" height="500"></iframe>' +
				'<iframe style="border: 0px currentColor; border-image: none;" src="https://www.google.com/maps/embed" frameborder="0" width="100%" height="500"></iframe>';

			expect(editor.editor.querySelectorAll('jodit').length).equals(2);
			expect(
				editor.editor.querySelector('jodit').firstChild.tagName
			).equals('IFRAME');
		});

		// https://github.com/xdan/jodit/issues/1583
		it('should delete a clicked embed with Backspace, as with Delete', () => {
			const editor = getJodit({ history: { timeout: 0 } });

			editor.value =
				'<p>one</p><p><iframe src="https://www.youtube.com/embed/3JZ_D3ELwOQ" width="320" height="180"></iframe></p><p>two</p>';

			simulateEvent(
				['mousedown', 'mouseup', 'click'],
				editor.editor.querySelector('[data-jodit_iframe_wrapper]')
			);

			// WebKit drops the selection after the click, and the editor keeps its focus
			editor.s.isFocused = () => true;
			editor.s.sel.removeAllRanges();

			simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

			expect(editor.editor.querySelector('iframe')).is.null;
			expect(editor.value).equals('<p>one</p><p></p><p>two</p>');
		});

		// https://github.com/xdan/jodit/issues/1584
		describe('Size attributes', () => {
			const src = 'https://www.youtube.com/embed/3JZ_D3ELwOQ';

			function framed(attrs) {
				const editor = getJodit({ history: { timeout: 0 } });

				editor.value = `<p><iframe ${attrs} src="${src}"></iframe></p>`;

				simulateEvent(
					['mousedown', 'mouseup', 'click'],
					editor.editor.querySelector('[data-jodit_iframe_wrapper]')
				);

				const resizer = document.querySelector(
					'.jodit-resizer[data-editor_id=' + editor.id + ']'
				);
				expect(resizer).is.not.null;

				return { editor, resizer };
			}

			it('should leave them alone when the embed is only clicked', () => {
				const { editor } = framed('width="100%" height="315"');

				expect(sortAttributes(editor.value)).equals(
					`<p><iframe height="315" src="${src}" width="100%"></iframe></p>`
				);
			});

			it('should write the new size as numbers when it is resized', () => {
				const { editor, resizer } = framed('width="320" height="180"');

				// bottom-right handle
				const handle = resizer.getElementsByTagName('div')[2];
				const pos = offset(handle);

				simulateEvent('mousedown', handle, data => {
					data.clientX = pos.left;
					data.clientY = pos.top;
				});

				simulateEvent('mousemove', editor.ow, data => {
					data.clientX = pos.left + 20;
					data.clientY = pos.top + 10;
				});

				simulateEvent('mouseup', editor.ow);

				expect(sortAttributes(editor.value)).equals(
					`<p><iframe height="190" src="${src}" width="340"></iframe></p>`
				);
			});
		});

		describe('Output HTML', () => {
			it('should not contains JODIT tag', () => {
				const editor = getJodit();
				editor.value =
					'<iframe style="border: 0px currentColor; border-image: none;" src="https://www.google.com/maps/embed" frameborder="0" width="100%" height="500"></iframe>' +
					'<iframe style="border: 0px currentColor; border-image: none;" src="https://www.google.com/maps/embed" frameborder="0" width="100%" height="500"></iframe>';

				expect(editor.editor.querySelectorAll('jodit').length).equals(
					2
				);
				expect(sortAttributes(editor.value)).equals(
					'<iframe frameborder="0" height="500" src="https://www.google.com/maps/embed" style="border:0px currentColor" width="100%"></iframe><iframe frameborder="0" height="500" src="https://www.google.com/maps/embed" style="border:0px currentColor" width="100%"></iframe>'
				);
			});
		});
	});

	// https://github.com/xdan/jodit/issues/1577
	describe('Scrolling', () => {
		function framed(options) {
			const editor = getJodit({ history: { timeout: 0 }, ...options });

			editor.value =
				'<p>line</p>'.repeat(3) +
				'<p><img alt="" src="tests/artio.jpg" style="width:100px;height:100px"/></p>' +
				'<p>line</p>'.repeat(30);

			const img = editor.editor.querySelector('img');
			simulateEvent('click', img);

			const resizer = document.querySelector(
				'.jodit-resizer[data-editor_id=' + editor.id + ']'
			);
			expect(resizer).is.not.null;

			return { editor, img, resizer };
		}

		const top = element => Math.round(element.getBoundingClientRect().top);

		it('should move the frame with the image as the content scrolls', async () => {
			const { editor, img, resizer } = framed({ height: 300 });

			editor.editor.scrollTop = 40;
			await delay(100);

			expect(resizer.parentNode).is.not.null;
			expect(top(resizer)).equals(top(img));
		});

		it('should not make the editor scrollable when the frame runs past its bottom', async () => {
			const { editor, img, resizer } = framed({ height: 300 });
			const { workplace } = editor;

			// Clicked while scrolled down, then scrolled back up
			editor.editor.scrollTop = 100;
			await delay(100);
			simulateEvent('click', img);
			editor.editor.scrollTop = 0;
			img.style.height = '1000px';
			editor.e.fire('resize');
			await delay(100);

			expect(resizer.parentNode).is.not.null;
			expect(top(resizer)).equals(top(img));
			expect(workplace.scrollHeight).equals(workplace.clientHeight);
		});

		it('should keep the frame on the image as the page scrolls', async () => {
			const { img, resizer } = framed({ inline: true });
			const spacer = document.createElement('div');
			spacer.style.height = '3000px';
			document.body.appendChild(spacer);

			window.scrollBy(0, 50);
			await delay(100);

			expect(resizer.parentNode).is.not.null;
			expect(top(resizer)).equals(top(img));

			window.scrollTo(0, 0);
			spacer.remove();
		});
	});

	// https://github.com/xdan/jodit/issues/1530
	describe('For video', () => {
		// One 32x18 frame
		const clip =
			'data:video/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQJChYECGFOAZwEAAAAAAAHWEU2bdLpNu4tTq4QVSalmU6yBoU27i1OrhBZUrmtTrIHGTbuMU6uEElTDZ1OsggEiTbuMU6uEHFO7a1OsggHA7AEAAAAAAABZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmoCrXsYMPQkBNgIRMYXZmV0GETGF2ZkSJiECPQAAAAAAAFlSua9euAQAAAAAAAE7XgQFzxYgAAAAAAAAAAZyBACK1nIN1bmSIgQCGhVZfVlA4g4EBI+ODhDuaygDgkLCBILqBEpqBAlWwhFW5gQFV7oEA7AEAAAAAAAACAAASVMNn0HNzzWPAi2PFiAAAAAAAAAABZ8iYRaOHRU5DT0RFUkSHi0xhdmMgbGlidnB4Z8ihRaOIRFVSQVRJT05Eh5MwMDowMDowMS4wMDAwMDAwMDAAH0O2dcTngQCjv4EAAIAQAwCdASogABIAAkcIhYWImYSIDIICdbokgH8AQWxuICwA/vEKj/+QTYEPAH/8ZU8ZU8ZU/4vsPupnMBxTu2uRu4+zgQC3iveBAfGCAXfwgQM=';
		const frVideo = { tag: 'span', className: 'fr-video' };

		async function loaded(editor) {
			const video = editor.editor.querySelector('video');

			if (video.readyState < 1) {
				await new Promise(resolve =>
					video.addEventListener('loadedmetadata', resolve, {
						once: true
					})
				);
			}

			// The media plugin wraps it after a delay
			await delay(100);

			return video;
		}

		function resize(editor, target, dx) {
			simulateEvent(['mousedown', 'mouseup', 'click'], target);

			const resizer = document.querySelector(
				'.jodit-resizer[data-editor_id=' + editor.id + ']'
			);
			expect(resizer).is.not.null;

			// bottom-right handle
			const handle = resizer.getElementsByTagName('div')[2];
			const pos = offset(handle);

			simulateEvent('mousedown', handle, data => {
				data.clientX = pos.left;
				data.clientY = pos.top;
			});

			simulateEvent('mousemove', editor.ow, data => {
				data.clientX = pos.left + dx;
				data.clientY = pos.top;
			});

			simulateEvent('mouseup', editor.ow);

			return resizer;
		}

		it('should resize it by its width alone, keeping its ratio', async () => {
			const editor = getJodit({ history: { timeout: 0 } });

			editor.value = `<p><video src="${clip}" style="width:320px"></video></p>`;
			const video = await loaded(editor);
			const wrapper = video.parentElement;

			expect(wrapper.tagName).equals('JODIT-MEDIA');

			// A click lands on the wrapper, which covers the video
			const resizer = resize(editor, wrapper, 20);

			expect(sortAttributes(editor.value)).equals(
				`<p><video src="${clip}" style="width:340px"></video></p>`
			);
			expect(video.offsetHeight).equals(191);
			expect(resizer.offsetWidth).equals(340);
			expect(wrapper.offsetWidth).equals(340);
		});

		it('should keep the height of a video that has one in step with its width', async () => {
			const editor = getJodit({ history: { timeout: 0 } });

			editor.value = `<p><video src="${clip}" style="width:320px;height:180px"></video></p>`;
			const video = await loaded(editor);

			resize(editor, video.parentElement, 20);

			expect(sortAttributes(editor.value)).equals(
				`<p><video src="${clip}" style="height:191px;width:340px"></video></p>`
			);
		});

		it('should give it a height when resized freely with Alt', async () => {
			const editor = getJodit({ history: { timeout: 0 } });

			editor.value = `<p><video src="${clip}" style="width:320px"></video></p>`;
			const video = await loaded(editor);

			simulateEvent('keydown', 'Alt', editor.ew);
			resize(editor, video.parentElement, 20);

			expect(sortAttributes(editor.value)).equals(
				`<p><video src="${clip}" style="height:180px;width:340px"></video></p>`
			);
		});

		it('should resize the video in a wrapper from mediaWrappers', async () => {
			const editor = getJodit({
				history: { timeout: 0 },
				mediaWrappers: { video: frVideo }
			});

			editor.value = `<p><video src="${clip}" style="width:320px"></video></p>`;
			const video = await loaded(editor);

			resize(editor, editor.editor.querySelector('span.fr-video'), 20);

			expect(sortAttributes(editor.value)).equals(
				`<p><span class="fr-video" contenteditable="false" draggable="true"><video src="${clip}" style="width:340px"></video></span></p>`
			);
			expect(video.offsetHeight).equals(191);
		});

		it('should hide the frame when the video goes with its wrapper', async () => {
			const editor = getJodit({
				history: { timeout: 0 },
				mediaWrappers: { video: frVideo }
			});

			editor.value = `<p>one</p><p><video src="${clip}" style="width:320px"></video></p><p>two</p>`;
			const video = await loaded(editor);

			simulateEvent(['mousedown', 'mouseup', 'click'], video);

			const resizer = document.querySelector(
				'.jodit-resizer[data-editor_id=' + editor.id + ']'
			);
			expect(resizer.parentNode).is.not.null;

			// As Delete does with the wrapper selected
			editor.s.removeNode(video.parentElement);
			simulateEvent('keydown', 'Delete', editor.editor);

			expect(resizer.parentNode).is.null;
		});

		it('should resize an embed through its own wrapper when its mediaWrappers wrapper is clicked', () => {
			const editor = getJodit({
				history: { timeout: 0 },
				mediaWrappers: { iframe: frVideo }
			});

			editor.value =
				'<p><span class="fr-video"><iframe src="https://www.youtube.com/embed/3JZ_D3ELwOQ" width="320" height="180"></iframe></span></p>';

			const span = editor.editor.querySelector('span.fr-video');
			const resizer = resize(editor, span, 20);
			const iframe = span.querySelector('iframe');

			expect(resizer.offsetWidth).equals(340);
			expect(iframe.getAttribute('width')).equals('340');
			expect(iframe.getAttribute('height')).equals('180');
		});
	});
	describe('A click in the popup of the framed element (#1650)', () => {
		it('Should keep the frame, and hide it for a click in the text', () => {
			const editor = getJodit();
			editor.value =
				'<p>One <img src="tests/artio.jpg" style="width:100px;height:100px"> two</p>';

			const img = editor.editor.querySelector('img');
			const frame = () =>
				editor.ownerDocument.querySelector(
					'.jodit-resizer[data-editor_id=' + editor.id + ']'
				);

			simulateEvent(['mousedown', 'mouseup', 'click'], img);
			expect(frame()).is.not.null;

			const popup = getOpenedPopup(editor);
			expect(popup).is.not.null;

			simulateEvent('mouseup', getButton('left', popup));
			expect(frame()).is.not.null;

			simulateEvent('mouseup', editor.editor.querySelector('p'));
			expect(frame()).is.null;
		});
	});

	describe('A key that moves the caret off the element (#1643)', () => {
		function pressKey(editor, key, moveCaret) {
			simulateEvent('keydown', key, editor.editor);
			moveCaret && moveCaret();
			simulateEvent('keyup', key, editor.editor);
		}

		const frame = editor =>
			editor.ownerDocument.querySelector(
				'.jodit-resizer[data-editor_id=' + editor.id + ']'
			);

		it("Should hide an image's frame once the caret has left the image", () => {
			const editor = getJodit();
			editor.value =
				'<p>One <img src="tests/artio.jpg" style="width:100px;height:100px"> two</p><p>Next line</p>';

			const img = editor.editor.querySelector('img');
			simulateEvent(['mousedown', 'mouseup', 'click'], img);
			editor.s.select(img);
			expect(frame(editor)).is.not.null;

			pressKey(editor, 'Shift');
			expect(frame(editor)).is.not.null;

			pressKey(editor, Jodit.KEY_DOWN, () =>
				editor.s.setCursorIn(editor.editor.querySelectorAll('p')[1])
			);
			expect(frame(editor)).is.null;
		});

		it("Should hide a table's frame once the caret has left the table, and show it when it comes back", () => {
			const editor = getJodit();
			editor.value =
				'<p>Before</p><table><tbody>' +
				'<tr><td>1</td><td>2</td></tr>' +
				'<tr><td>3</td><td>4</td></tr>' +
				'</tbody></table>';

			const tds = editor.editor.querySelectorAll('td');
			editor.s.setCursorIn(tds[0]);
			simulateEvent(['mousedown', 'mouseup', 'click'], tds[0]);
			expect(frame(editor)).is.not.null;

			pressKey(editor, Jodit.KEY_RIGHT, () =>
				editor.s.setCursorIn(tds[1], true)
			);
			expect(frame(editor)).is.not.null;

			// table-keyboard-navigation moves the caret to the cell below
			pressKey(editor, Jodit.KEY_DOWN);
			expect(editor.s.current().parentNode).equals(tds[3]);
			expect(frame(editor)).is.not.null;

			pressKey(editor, Jodit.KEY_UP);
			expect(frame(editor)).is.not.null;

			pressKey(editor, Jodit.KEY_UP, () =>
				editor.s.setCursorIn(editor.editor.querySelector('p'))
			);
			expect(frame(editor)).is.null;

			pressKey(editor, Jodit.KEY_DOWN, () =>
				editor.s.setCursorIn(tds[0], true)
			);
			expect(frame(editor)).is.not.null;
		});
	});
});
