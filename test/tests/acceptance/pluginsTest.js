describe('Test plugins', function() {
	getBox().style.width = 'auto';

	describe('Copy format plugin', function() {
		it('Should copy fontWeight from element and paste it in new selection', function() {
			getBox().style.width = 'auto';
			const editor = new Jodit(appendTestArea());

			editor.value = 'text <strong>test</strong> post';
			editor.selection.focus();
			editor.selection.setCursorIn(editor.editor.querySelector('strong'));

			expect(
				editor.container.querySelectorAll(
					'.jodit_toolbar_btn-copyformat'
				).length
			).equals(1);

			expect(
				editor.container.querySelectorAll(
					'.jodit_toolbar_btn-copyformat.jodit_active'
				).length
			).equals(0);

			simulateEvent(
				'mousedown',
				0,
				editor.container.querySelector('.jodit_toolbar_btn-copyformat')
			);

			expect(
				editor.container.querySelectorAll(
					'.jodit_toolbar_btn-copyformat.jodit_active'
				).length
			).equals(1);

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.selectNode(editor.editor.lastChild);
			sel.removeAllRanges();
			sel.addRange(range);

			simulateEvent('mouseup', 0, editor.editor);

			expect(editor.value.replace('700', 'bold')).equals(
				'text <strong>test</strong><span style="font-weight: bold;"> post</span>'
			);
		});

		it('Should copy fontSize from element and paste it in new selection', function() {
			getBox().style.width = 'auto';
			const editor = new Jodit(appendTestArea());

			editor.value =
				'text <span style="font-size: 11px;">test</span> post';
			editor.selection.focus();
			editor.selection.setCursorIn(editor.editor.querySelector('span'));

			expect(
				editor.container.querySelectorAll(
					'.jodit_toolbar_btn-copyformat'
				).length
			).equals(1);
			expect(
				editor.container.querySelectorAll(
					'.jodit_toolbar_btn-copyformat.jodit_active'
				).length
			).equals(0);

			simulateEvent(
				'mousedown',
				0,
				editor.container.querySelector('.jodit_toolbar_btn-copyformat')
			);

			expect(
				editor.container.querySelectorAll(
					'.jodit_toolbar_btn-copyformat.jodit_active'
				).length
			).equals(1);

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.selectNode(editor.editor.lastChild);
			sel.removeAllRanges();
			sel.addRange(range);

			simulateEvent('mouseup', 0, editor.editor);

			expect(editor.value).equals(
				'text <span style="font-size: 11px;">test</span><span style="font-size: 11px;"> post</span>'
			);
		});

		describe('Test', function() {
			it('Should copy fontSize and color from element and paste it in new selection', function() {
				getBox().style.width = 'auto';
				const editor = new Jodit(appendTestArea());

				editor.value =
					'text <span style="font-size: 11px;color: rgb(255, 0, 0);">test</span> post';
				editor.selection.focus();

				editor.selection.setCursorIn(
					editor.editor.querySelector('span')
				);

				expect(
					editor.container.querySelectorAll(
						'.jodit_toolbar_btn-copyformat'
					).length
				).equals(1);
				expect(
					editor.container.querySelectorAll(
						'.jodit_toolbar_btn-copyformat.jodit_active'
					).length
				).equals(0);

				simulateEvent(
					'mousedown',
					0,
					editor.container.querySelector(
						'.jodit_toolbar_btn-copyformat'
					)
				);

				expect(
					editor.container.querySelectorAll(
						'.jodit_toolbar_btn-copyformat.jodit_active'
					).length
				).equals(1);

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.selectNode(editor.editor.lastChild);
				sel.removeAllRanges();
				sel.addRange(range);

				simulateEvent('mouseup', 0, editor.editor);

				expect(sortAttributes(editor.value)).equals(
					'text <span style="color:#FF0000;font-size:11px">test</span><span style="color:#FF0000;font-size:11px"> post</span>'
				);
			});
		});

		it('Should toggle active state after double click', function() {
			getBox().style.width = 'auto';

			const editor = new Jodit(appendTestArea());

			editor.value =
				'text <span style="font-size: 11px;color: rgb(255, 0, 0);">test</span> post';
			editor.selection.focus();

			editor.selection.setCursorIn(editor.editor.querySelector('span'));
			expect(
				editor.container.querySelectorAll(
					'.jodit_toolbar_btn-copyformat'
				).length
			).equals(1);
			expect(
				editor.container.querySelectorAll(
					'.jodit_toolbar_btn-copyformat.jodit_active'
				).length
			).equals(0);

			simulateEvent(
				'mousedown',
				0,
				editor.container.querySelector('.jodit_toolbar_btn-copyformat')
			);

			expect(
				editor.container.querySelectorAll(
					'.jodit_toolbar_btn-copyformat.jodit_active'
				).length
			).equals(1);

			simulateEvent(
				'mousedown',
				0,
				editor.container.querySelector('.jodit_toolbar_btn-copyformat')
			);

			expect(
				editor.container.querySelectorAll(
					'.jodit_toolbar_btn-copyformat.jodit_active'
				).length
			).equals(0);

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.selectNode(editor.editor.lastChild);
			sel.removeAllRanges();
			sel.addRange(range);

			simulateEvent('mouseup', 0, editor.editor);

			expect(sortAttributes(editor.value)).equals(
				'text <span style="color:#FF0000;font-size:11px">test</span> post'
			);
		});

		describe('For image', function() {
			it('Should copy format from one image to another', function() {
				getBox().style.width = 'auto';

				const editor = new Jodit(appendTestArea()),
					html =
						'<img src="tests/artio.jpg" ' +
						'style="height: 100px;width: 100px; margin: 20px; border-image: none; border:1px solid #CCCCCC; border-radius: 50%;"> test ' +
						'<img style="height: 100px;width: 100px;" src="tests/artio.jpg">';

				editor.value = html;
				editor.selection.focus();

				expect(sortAttributes(editor.value)).equals(
					sortAttributes(html)
				);

				simulateEvent(
					'mousedown',
					0,
					editor.editor.querySelector('img')
				);

				simulateEvent(
					'mousedown',
					0,
					editor.container.querySelector(
						'.jodit_toolbar_btn-copyformat'
					)
				);

				simulateEvent(
					'mousedown',
					0,
					editor.editor.querySelectorAll('img')[1]
				);
				simulateEvent(
					'mouseup',
					0,
					editor.editor.querySelectorAll('img')[1]
				);

				expect(sortAttributes(editor.value)).equals(
					sortAttributes(
						'<img src="tests/artio.jpg" ' +
							'style="border-image:none;border-radius:50%;border:1px solid #CCCCCC;height:100px;margin:20px;width:100px"> test ' +
							'<img src="tests/artio.jpg" ' +
							'style="border-image:none;border-color:#CCCCCC;border-radius:50%;border-style:solid;border-width:1px;height:100px;margin:20px;width:100px">'
					)
				);
			});
		});

		describe('Set cursor inside em[style=background] > strong elements', function() {
			it('Should copy fontWeight from strong element, copy italic and background  style from em  and paste it in new selection', function() {
				getBox().style.width = 'auto';
				const editor = new Jodit(appendTestArea());

				editor.value =
					'text <em style="background-color: #ff0000"><strong>test</strong></em> post';
				editor.selection.focus();

				editor.selection.setCursorIn(
					editor.editor.querySelector('strong')
				);
				expect(
					editor.container.querySelectorAll(
						'.jodit_toolbar_btn-copyformat'
					).length
				).equals(1);
				expect(
					editor.container.querySelectorAll(
						'.jodit_toolbar_btn-copyformat.jodit_active'
					).length
				).equals(0);

				simulateEvent(
					'mousedown',
					0,
					editor.container.querySelector(
						'.jodit_toolbar_btn-copyformat'
					)
				);

				expect(
					editor.container.querySelectorAll(
						'.jodit_toolbar_btn-copyformat.jodit_active'
					).length
				).equals(1);

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.selectNode(editor.editor.lastChild);
				sel.removeAllRanges();
				sel.addRange(range);

				simulateEvent('mouseup', 0, editor.editor);

				expect(
					sortAttributes(
						editor
							.getEditorValue()
							.replace(/700/g, 'bold')
							.replace(/rgb\(255, 0, 0\)/g, '#ff0000')
					)
				).equals(
					'text <em style="background-color:#ff0000"><strong>test</strong></em><span style="background-color:#ff0000;font-style:italic;font-weight:bold"> post</span>'
				);
			});
		});
	});

	describe('Add new Line plugin', function() {
		it('Should not add new line element in container before first use', function() {
			const editor = new Jodit(appendTestArea());
			expect(
				editor.container.querySelectorAll('.jodit-add-new-line').length
			).equals(0);
		});

		const moveCursorUnder = function(editor, elm) {
			simulateEvent('mousemove', 0, editor.editor, function(e) {
				const pos = Jodit.modules.Helpers.position(elm, editor);

				e.clientX = pos.left + 5;
				e.clientY = pos.top + 5;
			});
		};

		it('Should show .jodit-add-new-line after user move mouse under Table,Ifrmae or IMG ', function() {
			const editor = new Jodit(appendTestArea());
			editor.value =
				'<table>' +
				'<tbody>' +
				'<tr><td>1</td></tr>' +
				'<tr><td>2</td></tr>' +
				'<tr><td>3</td></tr>' +
				'<tr><td>4</td></tr>' +
				'</tbody>' +
				'</table>';

			window.scrollTo(
				0,
				Jodit.modules.Helpers.offset(
					editor.editor,
					editor,
					editor.ownerDocument
				).top
			); // elementFromPoint works only with visible part of view

			moveCursorUnder(editor, editor.editor.firstChild);

			const newline = editor.container.querySelector(
				'.jodit-add-new-line'
			);

			expect(newline).not.is.null;
			expect(editor.ownerWindow.getComputedStyle(newline).display).equals(
				'block'
			);
		});

		it('Should add new paragraph after user clicked on newline ', function() {
			const editor = new Jodit(appendTestArea());
			editor.value =
				'<table><tbody>' +
				'<tr><td>2</td></tr>' +
				'<tr><td>2</td></tr>' +
				'<tr><td>3</td></tr>' +
				'<tr><td>4</td></tr>' +
				'</tbody></table>';

			window.scrollTo(
				0,
				Jodit.modules.Helpers.offset(
					editor.editor,
					editor,
					editor.ownerDocument
				).top
			); // elementFromPoint works only with visible part of view

			moveCursorUnder(editor, editor.editor.firstChild);

			const newline = editor.container.querySelector(
				'.jodit-add-new-line'
			);

			expect(newline).not.is.null;
			expect(editor.ownerWindow.getComputedStyle(newline).display).equals(
				'block'
			);

			simulateEvent('mousedown', 0, newline.querySelector('span'));
			expect(editor.getElementValue()).equals(
				'<p></p><table><tbody>' +
					'<tr><td>2</td></tr>' +
					'<tr><td>2</td></tr>' +
					'<tr><td>3</td></tr>' +
					'<tr><td>4</td></tr>' +
					'</tbody></table>'
			);
		});

		it('Should add new paragraph after user clicked on newline below table', function() {
			const editor = new Jodit(appendTestArea());
			editor.value =
				'<table><tbody>' +
				'<tr><td>3</td></tr>' +
				'<tr><td>2</td></tr>' +
				'</tbody></table>';

			window.scrollTo(
				0,
				Jodit.modules.Helpers.offset(
					editor.editor,
					editor,
					editor.ownerDocument
				).top
			); // elementFromPoint works only with visible part of view

			simulateEvent('mousemove', 0, editor.editor, function(data) {
				const pos = Jodit.modules.Helpers.position(
					editor.editor.firstChild,
					editor
				);

				data.clientX = pos.left + 5;
				data.clientY = pos.top + (pos.height - 5);
			});

			const newline = editor.container.querySelector(
				'.jodit-add-new-line'
			);

			expect(newline).not.is.null;
			expect(editor.ownerWindow.getComputedStyle(newline).display).equals(
				'block'
			);

			simulateEvent('mousedown', 0, newline.querySelector('span'));
			expect(editor.getElementValue()).equals(
				'<table><tbody>' +
					'<tr><td>3</td></tr>' +
					'<tr><td>2</td></tr>' +
					'</tbody></table><p></p>'
			);
		});

		it('Should add new paragraph after user clicked on newline below table in IFRAME mode', function() {
			const editor = new Jodit(appendTestArea(), {
				ifarme: true
			});
			editor.value =
				'<table><tbody>' +
				'<tr><td>3</td></tr>' +
				'<tr><td>2</td></tr>' +
				'</tbody></table>';

			window.scrollTo(
				0,
				Jodit.modules.Helpers.offset(
					editor.editor,
					editor,
					editor.ownerDocument
				).top
			); // elementFromPoint works only with visible part of view

			simulateEvent('mousemove', 0, editor.editor, function(data) {
				const pos = Jodit.modules.Helpers.position(
					editor.editor.firstChild,
					editor
				);

				data.clientX = pos.left + 5;
				data.clientY = pos.top + (pos.height - 5);
			});

			const newline = editor.container.querySelector(
				'.jodit-add-new-line'
			);

			expect(newline).not.is.null;
			expect(editor.ownerWindow.getComputedStyle(newline).display).equals(
				'block'
			);

			simulateEvent('mousedown', 0, newline.querySelector('span'));
			expect(editor.getElementValue()).equals(
				'<table><tbody>' +
					'<tr><td>3</td></tr>' +
					'<tr><td>2</td></tr>' +
					'</tbody></table><p></p>'
			);
		});

		describe('Insert line on top of IMG element that was inside P element', function() {
			it('Should insert new P before parent P element', function() {
				const editor = new Jodit(appendTestArea());
				editor.value =
					'<p><img src="tests/artio.jpg" style="width: 100px; height: 100px;" alt=""></p>';

				window.scrollTo(
					0,
					Jodit.modules.Helpers.offset(
						editor.editor,
						editor,
						editor.ownerDocument
					).top
				); // elementFromPoint works only with visible part of view

				const img = editor.editor.querySelector('img');
				expect(null).does.not.equal(img);

				moveCursorUnder(editor, img);

				const newline = editor.container.querySelector(
					'.jodit-add-new-line'
				);

				expect(null).does.not.equal(newline);
				expect(
					editor.ownerWindow.getComputedStyle(newline).display
				).equals('block');
				simulateEvent('mousedown', 0, newline.querySelector('span'));

				editor.selection.insertHTML('stop');

				expect(
					'<p>stop</p><p><img alt="" src="tests/artio.jpg" style="height:100px;width:100px"></p>'
				).equals(sortAttributes(editor.value));
			});
		});
	});

	describe('Edit image tests', function() {
		describe('Image editor', function() {
			describe('Crop mode', function() {
				describe('Enable ratio', function() {
					it('Should deny crop image without ratio', function(done) {
						const area = appendTestArea();
						const editor = new Jodit(area, {
							observer: {
								timeout: 0
							},
							uploader: {
								url:
									'https://xdsoft.net/jodit/connector/index.php?action=upload'
							},
							filebrowser: {
								ajax: {
									url:
										'https://xdsoft.net/jodit/connector/index.php'
								}
							},
							disablePlugins: 'mobile'
						});
						editor.value =
							'<img alt="" src="https://xdsoft.net/jodit/files/th.jpg">';

						simulateEvent(
							'dblclick',
							0,
							editor.editor.querySelector('img')
						);

						const dialog = editor.ownerDocument.querySelector(
							'[data-editor_id=' +
								area.id +
								'].jodit.jodit_dialog_box.active'
						);

						expect(dialog.style.display).does.not.equal('none');
						expect(
							dialog.querySelectorAll('a.jodit_use_image_editor')
								.length
						).equals(1);

						editor.events.on('afterImageEditor', function() {
							const imageEditor = editor.ownerDocument.querySelector(
								'[data-editor_id=' +
									area.id +
									'].jodit.jodit_dialog_box.active .jodit_image_editor'
							);
							expect(imageEditor).is.not.null;

							expect(
								imageEditor.querySelectorAll('[data-area=crop]')
									.length
							).equals(1);
							expect(
								imageEditor.querySelectorAll(
									'[data-area=crop].active'
								).length
							).equals(0);

							simulateEvent(
								'click',
								0,
								imageEditor.querySelector(
									'[data-area=crop] > div'
								)
							);

							expect(
								imageEditor.querySelectorAll(
									'[data-area=crop].active'
								).length
							).equals(1);

							const cropper = imageEditor.querySelector(
								'.jodit_image_editor_croper'
							);

							expect(cropper).not.is.null;

							const oldRatio =
								cropper.offsetWidth / cropper.offsetHeight;
							simulateEvent(
								'mousedown',
								0,
								cropper.querySelector('.jodit_bottomright'),
								function(e) {
									const pos = Jodit.modules.Helpers.offset(
										cropper,
										editor,
										editor.ownerDocument
									);
									e.clientX = pos.left + pos.width;
									e.clientY = pos.top + pos.height;
								}
							);

							simulateEvent(
								'mousemove',
								0,
								editor.ownerWindow,
								function(e) {
									const pos = Jodit.modules.Helpers.offset(
										cropper,
										editor,
										editor.ownerDocument
									);
									e.clientX = pos.left + pos.width - 50;
									e.clientY = pos.top + pos.height - 150;
								}
							);

							simulateEvent(
								'mouseup',
								0,
								editor.ownerWindow,
								function(e) {
									const pos = Jodit.modules.Helpers.offset(
										cropper,
										editor,
										editor.ownerDocument
									);
									e.clientX = pos.left + pos.width - 50;
									e.clientY = pos.top + pos.height - 150;
								}
							);

							expect(
								Math.abs(
									cropper.offsetWidth / cropper.offsetHeight -
										oldRatio
								) < 0.02
							).is.true;

							done();
						});

						simulateEvent(
							'mousedown',
							0,
							dialog.querySelector('a.jodit_use_image_editor')
						);
					}).timeout(7000);
				});

				describe('Disable ratio', function() {
					it('Should allow crop image without ratio', function(done) {
						const area = appendTestArea();

						const editor = new Jodit(area, {
							observer: {
								timeout: 0
							},
							uploader: {
								url:
									'https://xdsoft.net/jodit/connector/index.php?action=upload'
							},
							filebrowser: {
								ajax: {
									url:
										'https://xdsoft.net/jodit/connector/index.php'
								}
							}
						});

						editor.value =
							'<img alt="" src="https://xdsoft.net/jodit/files/th.jpg">';

						simulateEvent(
							'dblclick',
							0,
							editor.editor.querySelector('img')
						);

						const dialog = editor.ownerDocument.querySelector(
							'[data-editor_id=' +
								area.id +
								'].jodit.jodit_dialog_box.active'
						);

						expect(dialog.style.display).does.not.equal('none');
						expect(
							dialog.querySelectorAll('a.jodit_use_image_editor')
								.length
						).equals(1);

						editor.events.on('afterImageEditor', function() {
							const imageEditor = editor.ownerDocument.querySelector(
								'[data-editor_id=' +
									area.id +
									'].jodit.jodit_dialog_box.active .jodit_image_editor'
							);

							expect(imageEditor).is.not.null;

							expect(
								imageEditor.querySelectorAll('[data-area=crop]')
									.length
							).equals(1);

							expect(
								imageEditor.querySelectorAll(
									'[data-area=crop].active'
								).length
							).equals(0);

							simulateEvent(
								'click',
								0,
								imageEditor.querySelector(
									'[data-area=crop] > div'
								)
							);

							expect(
								imageEditor.querySelectorAll(
									'[data-area=crop].active'
								).length
							).equals(1);

							const cropper = imageEditor.querySelector(
								'.jodit_image_editor_croper'
							);

							expect(cropper).not.is.null;

							const oldRatio =
								cropper.offsetWidth / cropper.offsetHeight;

							const disableRatioBtn = imageEditor
								.querySelector('[data-area=crop].active')
								.querySelector(
									'.jodit_button_radio_group button:last-child'
								);

							expect(disableRatioBtn).not.is.null;
							simulateEvent('click', 0, disableRatioBtn);

							simulateEvent(
								'mousedown',
								0,
								cropper.querySelector('.jodit_bottomright'),
								function(e) {
									const pos = Jodit.modules.Helpers.offset(
										cropper,
										editor,
										editor.ownerDocument
									);
									e.clientX = pos.left + pos.width;
									e.clientY = pos.top + pos.height;
								}
							);
							simulateEvent(
								'mousemove',
								0,
								editor.ownerWindow,
								function(e) {
									const pos = Jodit.modules.Helpers.offset(
										cropper,
										editor,
										editor.ownerDocument
									);
									e.clientX = pos.left + pos.width - 50;
									e.clientY = pos.top + pos.height - 150;
								}
							);

							simulateEvent(
								'mouseup',
								0,
								editor.ownerWindow,
								function(e) {
									const pos = Jodit.modules.Helpers.offset(
										cropper,
										editor,
										editor.ownerDocument
									);
									e.clientX = pos.left + pos.width - 50;
									e.clientY = pos.top + pos.height - 150;
								}
							);

							expect(
								Math.abs(
									cropper.offsetWidth / cropper.offsetHeight -
										oldRatio
								) > 1
							).is.true;

							done();
						});

						simulateEvent(
							'mousedown',
							0,
							dialog.querySelector('a.jodit_use_image_editor')
						);
					}).timeout(7000);
				});
			});

			describe('Resize mode', function() {
				describe('Enable ratio', function() {
					it('Should deny resize image without ratio', function(done) {
						const area = appendTestArea();
						const editor = new Jodit(area, {
							observer: {
								timeout: 0
							},
							uploader: {
								url:
									'https://xdsoft.net/jodit/connector/index.php?action=upload'
							},
							filebrowser: {
								ajax: {
									url:
										'https://xdsoft.net/jodit/connector/index.php'
								}
							}
						});

						editor.value = '<img src="tests/artio.jpg">';

						simulateEvent(
							'dblclick',
							0,
							editor.editor.querySelector('img')
						);

						const dialog = editor.ownerDocument.querySelector(
							'[data-editor_id=' +
								area.id +
								'].jodit.jodit_dialog_box.active'
						);

						expect(dialog.style.display).does.not.equal('none');
						expect(
							dialog.querySelectorAll('a.jodit_use_image_editor')
								.length
						).equals(1);

						editor.events.on('afterImageEditor', function() {
							const imageEditor = editor.ownerDocument.querySelector(
								'[data-editor_id=' +
									area.id +
									'].jodit.jodit_dialog_box.active .jodit_image_editor'
							);
							expect(imageEditor).is.not.null;

							expect(
								imageEditor.querySelectorAll(
									'[data-area=resize]'
								).length
							).equals(1);
							expect(
								imageEditor.querySelectorAll(
									'[data-area=resize].active'
								).length
							).equals(1); // default mode

							simulateEvent(
								'click',
								0,
								imageEditor.querySelector(
									'[data-area=resize] > div'
								)
							);

							expect(
								imageEditor.querySelectorAll(
									'[data-area=resize].active'
								).length
							).equals(1);

							const resizer = imageEditor.querySelector(
								'.jodit_image_editor_resizer'
							);

							expect(resizer).not.is.null;

							const oldRatio =
								resizer.offsetWidth / resizer.offsetHeight;

							simulateEvent(
								'mousedown',
								0,
								resizer.querySelector('.jodit_bottomright'),
								function(e) {
									const pos = Jodit.modules.Helpers.offset(
										resizer,
										editor,
										editor.ownerDocument
									);
									e.clientX = pos.left + pos.width;
									e.clientY = pos.top + pos.height;
								}
							);

							simulateEvent(
								'mousemove',
								0,
								editor.ownerWindow,
								function(e) {
									const pos = Jodit.modules.Helpers.offset(
										resizer,
										editor,
										editor.ownerDocument
									);
									e.clientX = pos.left + pos.width - 250;
									e.clientY = pos.top + pos.height - 150;
								}
							);

							simulateEvent(
								'mouseup',
								0,
								editor.ownerWindow,
								function(e) {
									const pos = Jodit.modules.Helpers.offset(
										resizer,
										editor,
										editor.ownerDocument
									);
									e.clientX = pos.left + pos.width - 250;
									e.clientY = pos.top + pos.height - 150;
								}
							);

							expect(
								Math.abs(
									resizer.offsetWidth / resizer.offsetHeight -
										oldRatio
								) < 0.05
							).is.true;

							done();
						});

						simulateEvent(
							'mousedown',
							0,
							dialog.querySelector('a.jodit_use_image_editor')
						);
					}).timeout(7000);
				});

				describe('Disable ratio', function() {
					it('Should allow resize image without ratio', function(done) {
						const area = appendTestArea();
						const editor = new Jodit(area, {
							observer: {
								timeout: 0
							},
							uploader: {
								url:
									'https://xdsoft.net/jodit/connector/index.php?action=upload'
							},
							filebrowser: {
								ajax: {
									url:
										'https://xdsoft.net/jodit/connector/index.php'
								}
							}
						});
						editor.value = '<img src="tests/artio.jpg">';

						simulateEvent(
							'dblclick',
							0,
							editor.editor.querySelector('img')
						);

						const dialog = editor.ownerDocument.querySelector(
							'[data-editor_id=' +
								area.id +
								'].jodit.jodit_dialog_box.active'
						);

						expect(dialog.style.display).does.not.equal('none');
						expect(
							dialog.querySelectorAll('a.jodit_use_image_editor')
								.length
						).equals(1);

						editor.events.on('afterImageEditor', function() {
							const imageEditor = editor.ownerDocument.querySelector(
								'[data-editor_id=' +
									area.id +
									'].jodit.jodit_dialog_box.active .jodit_image_editor'
							);
							expect(imageEditor).is.not.null;

							expect(
								imageEditor.querySelectorAll(
									'[data-area=resize]'
								).length
							).equals(1);
							expect(
								imageEditor.querySelectorAll(
									'[data-area=resize].active'
								).length
							).equals(1); // default mode

							simulateEvent(
								'click',
								0,
								imageEditor.querySelector(
									'[data-area=resize] > div'
								)
							);

							expect(
								imageEditor.querySelectorAll(
									'[data-area=resize].active'
								).length
							).equals(1);

							const disableRatioBtn = imageEditor
								.querySelector('[data-area=resize].active')
								.querySelector(
									'.jodit_button_radio_group button:last-child'
								);

							expect(disableRatioBtn).not.is.null;
							simulateEvent('click', 0, disableRatioBtn);

							const resizer = imageEditor.querySelector(
								'.jodit_image_editor_resizer'
							);

							expect(resizer).not.is.null;

							const oldRatio =
								resizer.offsetWidth / resizer.offsetHeight;

							simulateEvent(
								'mousedown',
								0,
								resizer.querySelector('.jodit_bottomright'),
								function(e) {
									const pos = Jodit.modules.Helpers.offset(
										resizer,
										editor,
										editor.ownerDocument
									);
									e.clientX = pos.left + pos.width;
									e.clientY = pos.top + pos.height;
								}
							);

							simulateEvent(
								'mousemove',
								0,
								editor.ownerWindow,
								function(e) {
									const pos = Jodit.modules.Helpers.offset(
										resizer,
										editor,
										editor.ownerDocument
									);
									e.clientX = pos.left + pos.width - 50;
									e.clientY = pos.top + pos.height - 150;
								}
							);

							simulateEvent(
								'mouseup',
								0,
								editor.ownerWindow,
								function(e) {
									const pos = Jodit.modules.Helpers.offset(
										resizer,
										editor,
										editor.ownerDocument
									);
									e.clientX = pos.left + pos.width - 50;
									e.clientY = pos.top + pos.height - 150;
								}
							);

							expect(
								Math.abs(
									resizer.offsetWidth / resizer.offsetHeight -
										oldRatio
								) > 1
							).is.true;

							done();
						});

						simulateEvent(
							'mousedown',
							0,
							dialog.querySelector('a.jodit_use_image_editor')
						);
					}).timeout(7000);
				});
			});
		});
	});

	describe('Indent plugin', function() {
		describe('Check i18n tooltip', function() {
			describe('Native tooltip', function() {
				it('Should have different tooltip for each language', function() {
					const area = appendTestArea();

					const editor = new Jodit(area, {
						toolbarAdaptive: false,
						useNativeTooltip: true,
						buttons: 'indent,outdent',
						language: 'en'
					});

					expect(null).does.not.equal(
						editor.container.querySelector(
							'.jodit_toolbar_btn.jodit_toolbar_btn-outdent [title]'
						)
					);

					const title = editor.container
						.querySelector(
							'.jodit_toolbar_btn.jodit_toolbar_btn-outdent [title]'
						)
						.getAttribute('title');

					editor.destruct();

					const editor2 = new Jodit(area, {
						toolbarAdaptive: false,
						useNativeTooltip: true,
						buttons: 'indent,outdent',
						language: 'ru'
					});

					expect(null).does.not.equal(
						editor2.container.querySelector(
							'.jodit_toolbar_btn.jodit_toolbar_btn-outdent [title]'
						)
					);

					expect(title).does.not.equal(
						editor2.container
							.querySelector(
								'.jodit_toolbar_btn.jodit_toolbar_btn-outdent [title]'
							)
							.getAttribute('title')
					);
				});
			});

			describe('Jodit tooltip', function() {
				it('Should have different tooltip for each language', function() {
					const area = appendTestArea();

					let editor = new Jodit(area, {
						toolbarAdaptive: false,
						useNativeTooltip: false,
						buttons: 'indent,outdent',
						showTooltipDelay: 0,
						language: 'en'
					});

					let button = editor.container.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-indent'
					);

					expect(null).does.not.equal(button);

					simulateEvent('mouseenter', 0, button.querySelector('a'));

					let tooltip = editor.ownerDocument.querySelector(
						'.jodit_tooltip'
					);
					expect(null).does.not.equal(tooltip);
					const title = tooltip.textContent;
					editor.destruct();

					editor = new Jodit(area, {
						toolbarAdaptive: false,
						useNativeTooltip: false,
						showTooltipDelay: 0,
						buttons: 'indent,outdent',
						language: 'ru'
					});

					button = editor.container.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-indent'
					);
					expect(null).does.not.equal(button);

					simulateEvent('mouseenter', 0, button.querySelector('a'));

					tooltip = editor.ownerDocument.querySelector(
						'.jodit_tooltip'
					);
					expect(null).does.not.equal(tooltip);
					simulateEvent('mouseleave', 0, button.querySelector('a'));
					expect(null).not.equal(tooltip.parentNode);

					expect(parseInt(tooltip.style.left, 10)).equals(-5000);

					expect(title).does.not.equal(tooltip.textContent);
				});
			});
		});

		it('Should set active outdent button if current container has marginLeft', function() {
			const area = appendTestArea();
			const editor = new Jodit(area, {
				toolbarAdaptive: false,
				buttons: 'indent,outdent'
			});

			editor.value = '<p>text</p>';
			editor.selection.setCursorIn(editor.editor.firstChild.firstChild);

			simulateEvent('mousedown', 0, editor.editor.firstChild);

			expect(null).does.not.equal(
				editor.container.querySelector(
					'.jodit_toolbar_btn.jodit_toolbar_btn-outdent.jodit_disabled'
				)
			);

			editor.editor.firstChild.style.marginLeft = '100px';
			simulateEvent('mousedown', 0, editor.editor.firstChild);
			expect(null).equals(
				editor.container.querySelector(
					'.jodit_toolbar_btn.jodit_toolbar_btn-outdent.jodit_disabled'
				)
			);
		});

		describe('Press Indent button', function() {
			it('Should increase indent for current blocks', function() {
				const area = appendTestArea();
				const editor = new Jodit(area, {
					toolbarAdaptive: false,
					buttons: 'indent,outdent',
					indentMargin: 5
				});

				editor.value = '<h1>test</h1><p>text</p><p>text</p>';

				const range = editor.selection.createRange();

				range.setStartBefore(editor.editor.firstChild);
				range.setEndAfter(editor.editor.firstChild.nextSibling);
				editor.selection.selectRange(range);

				simulateEvent(
					'mousedown',
					0,
					editor.container.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-indent'
					)
				);

				simulateEvent(
					'mousedown',
					0,
					editor.container.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-indent'
					)
				);

				simulateEvent(
					'mousedown',
					0,
					editor.container.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-indent'
					)
				);

				expect(
					'<h1 style="margin-left: 15px;">test</h1><p style="margin-left: 15px;">text</p><p>text</p>'
				).equals(editor.value);

				simulateEvent(
					'mousedown',
					0,
					editor.container.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-outdent'
					)
				);

				simulateEvent(
					'mousedown',
					0,
					editor.container.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-outdent'
					)
				);

				simulateEvent(
					'mousedown',
					0,
					editor.container.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-outdent'
					)
				);

				expect('<h1>test</h1><p>text</p><p>text</p>').equals(
					editor.value
				);
			});
		});

		describe('Run indent command for inline elements', function() {
			it('should wrap elements in block and change margin for it', function() {
				const area = appendTestArea();
				const editor = new Jodit(area);
				editor.value = 'a<br>b<br>c<br>';
				editor.selection.setCursorAfter(editor.editor.lastChild);
				editor.execCommand('indent');
				expect(
					'<p style="margin-left: 10px;">a<br>b<br>c<br></p>'
				).equals(editor.value);
			});
		});
	});

	describe('Symbols plugin', function() {
		it('Should create symbol button in toolbar and after click open dialog with symbols', function() {
			const area = appendTestArea();
			const editor = new Jodit(area, {
				toolbarAdaptive: false,
				buttons: 'symbol'
			});
			editor.value = 'test';

			const btn = editor.container.querySelector(
				'.jodit_toolbar_btn.jodit_toolbar_btn-symbol'
			);
			expect(null).does.not.equal(btn);

			simulateEvent('mousedown', 0, btn);
			const dialog = editor.ownerDocument.querySelector(
				'.jodit_dialog_box.active.jodit_modal .jodit_dialog_content .jodit_symbols'
			);
			expect(null).does.not.equal(dialog);
		});

		describe('Symbols dialog', function() {
			it('Should have focus on first element after open', function() {
				const area = appendTestArea();
				const editor = new Jodit(area, {
					toolbarAdaptive: false,
					buttons: 'symbol'
				});
				editor.value = 'test';

				const btn = editor.container.querySelector(
					'.jodit_toolbar_btn.jodit_toolbar_btn-symbol'
				);
				expect(null).does.not.equal(btn);

				simulateEvent('mousedown', 0, btn);
				const dialog = editor.ownerDocument.querySelector(
					'.jodit_dialog_box.active.jodit_modal .jodit_dialog_content .jodit_symbols'
				);
				expect(null).does.not.equal(dialog);

				expect(dialog.querySelector('a')).equals(
					editor.ownerDocument.activeElement
				);
			});

			describe('Press key left', function() {
				it('Should select previous element', function() {
					const area = appendTestArea();
					const editor = new Jodit(area, {
						toolbarAdaptive: false,
						buttons: 'symbol'
					});
					editor.value = 'test';

					const btn = editor.container.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-symbol'
					);
					expect(null).does.not.equal(btn);

					simulateEvent('mousedown', 0, btn);
					const dialog = editor.ownerDocument.querySelector(
						'.jodit_dialog_box.active.jodit_modal .jodit_dialog_content .jodit_symbols'
					);
					expect(null).does.not.equal(dialog);

					const currentActive = dialog.getElementsByTagName('a')[10];

					simulateEvent(
						'keydown',
						Jodit.KEY_LEFT,
						currentActive,
						function(data) {
							data.target = currentActive;
						}
					);

					expect(editor.ownerDocument.activeElement).equals(
						dialog.getElementsByTagName('a')[9]
					);
				});
			});
			describe('Press key right', function() {
				it('Should select next element', function() {
					const area = appendTestArea();
					const editor = new Jodit(area, {
						toolbarAdaptive: false,
						buttons: 'symbol'
					});
					editor.value = 'test';

					const btn = editor.container.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-symbol'
					);
					expect(null).does.not.equal(btn);

					simulateEvent('mousedown', 0, btn);
					const dialog = editor.ownerDocument.querySelector(
						'.jodit_dialog_box.active.jodit_modal .jodit_dialog_content .jodit_symbols'
					);
					expect(null).does.not.equal(dialog);

					const currentActive = dialog.getElementsByTagName('a')[10];

					simulateEvent(
						'keydown',
						Jodit.KEY_RIGHT,
						currentActive,
						function(data) {
							data.target = currentActive;
						}
					);

					expect(editor.ownerDocument.activeElement).equals(
						dialog.getElementsByTagName('a')[11]
					);
				});
			});
			describe('Press key top', function() {
				it('Should select element above', function() {
					const area = appendTestArea();

					const editor = new Jodit(area, {
						toolbarAdaptive: false,
						buttons: 'symbol'
					});

					editor.value = 'test';

					const btn = editor.container.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-symbol'
					);
					expect(null).does.not.equal(btn);

					simulateEvent('mousedown', 0, btn);
					const dialog = editor.ownerDocument.querySelector(
						'.jodit_dialog_box.active.jodit_modal .jodit_dialog_content .jodit_symbols'
					);
					expect(null).does.not.equal(dialog);

					let currentActive = dialog.getElementsByTagName('a')[30];

					simulateEvent(
						'keydown',
						Jodit.KEY_UP,
						currentActive,
						function(data) {
							data.target = currentActive;
						}
					);

					expect(editor.ownerDocument.activeElement).equals(
						dialog.getElementsByTagName('a')[13]
					);

					currentActive = dialog.getElementsByTagName('a')[10];

					simulateEvent(
						'keydown',
						Jodit.KEY_UP,
						currentActive,
						function(data) {
							data.target = currentActive;
						}
					);

					expect(editor.ownerDocument.activeElement).equals(
						dialog.getElementsByTagName('a')[197]
					);
				});
			});

			describe('Press key bottom', function() {
				it('Should select element below', function() {
					const area = appendTestArea();
					const editor = new Jodit(area, {
						toolbarAdaptive: false,
						buttons: 'symbol'
					});
					editor.value = 'test';

					const btn = editor.container.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-symbol'
					);
					expect(null).does.not.equal(btn);

					simulateEvent('mousedown', 0, btn);
					const dialog = editor.ownerDocument.querySelector(
						'.jodit_dialog_box.active.jodit_modal .jodit_dialog_content .jodit_symbols'
					);
					expect(null).does.not.equal(dialog);

					let currentActive = dialog.getElementsByTagName('a')[30];

					simulateEvent(
						'keydown',
						Jodit.KEY_DOWN,
						currentActive,
						function(data) {
							data.target = currentActive;
						}
					);

					expect(editor.ownerDocument.activeElement).equals(
						dialog.getElementsByTagName('a')[47]
					);

					currentActive = dialog.getElementsByTagName('a')[200];

					simulateEvent(
						'keydown',
						Jodit.KEY_DOWN,
						currentActive,
						function(data) {
							data.target = currentActive;
						}
					);

					expect(editor.ownerDocument.activeElement).equals(
						dialog.getElementsByTagName('a')[13]
					);
				});
			});
			describe('Press Enter or mousdown on element', function() {
				it('Should insert character', function() {
					const area = appendTestArea();
					const editor = new Jodit(area, {
						toolbarAdaptive: false,
						buttons: 'symbol'
					});

					editor.value = '';

					const btn = editor.container.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-symbol'
					);
					expect(null).does.not.equal(btn);

					simulateEvent('mousedown', 0, btn);
					let dialog = editor.ownerDocument.querySelector(
						'.jodit_dialog_box.active.jodit_modal .jodit_dialog_content .jodit_symbols'
					);

					expect(null).does.not.equal(dialog);

					const currentActive = dialog.getElementsByTagName('a')[5];

					simulateEvent('keydown', Jodit.KEY_ENTER, currentActive);

					expect('&amp;').equals(editor.value);

					simulateEvent('mousedown', 0, btn);
					dialog = editor.ownerDocument.querySelector(
						'.jodit_dialog_box.active.jodit_modal .jodit_dialog_content .jodit_symbols'
					);

					expect(null).does.not.equal(dialog);

					const currentActive2 = dialog.getElementsByTagName(
						'a'
					)[125];

					simulateEvent('mousedown', 0, currentActive2);

					expect('&amp;½').equals(editor.value);
				});
			});
		});
		describe('Symbols popup', function() {
			it('Should create popup this symbols', function() {
				const area = appendTestArea();
				const editor = new Jodit(area, {
					toolbarAdaptive: false,
					buttons: 'symbol',
					usePopupForSpecialCharacters: true
				});

				editor.value = 'test';
				const range = editor.selection.createRange();
				range.setStart(editor.editor.firstChild, 0);
				range.collapse(true);
				editor.selection.selectRange(range);

				const btn = editor.container.querySelector(
					'.jodit_toolbar_btn.jodit_toolbar_btn-symbol'
				);
				expect(null).does.not.equal(btn);

				simulateEvent('mousedown', 0, btn);
				const dialog = editor.ownerDocument.querySelector(
					'.jodit_dialog_box.active.jodit_modal .jodit_dialog_content .jodit_symbols'
				);
				expect(null).equals(dialog);

				const popup = editor.container.querySelector(
					'.jodit_toolbar_popup'
				);
				expect(null).does.not.equal(popup);
				expect('block').equals(window.getComputedStyle(popup).display);

				const currentActive = popup.getElementsByTagName('a')[125];

				simulateEvent('mousedown', 0, currentActive);

				expect('½test').equals(editor.value);
				expect(null).equals(popup.parentNode);
			});
		});
	});

	describe('Hotkeys', function() {
		describe('Override default shortcuts for some commands', function() {
			it('Should work default shortcuts for another commands', function() {
				const area = appendTestArea(),
					editor = new Jodit(area, {
						commandToHotkeys: {
							bold: 'ctrl+shift+b',
							italic: ['ctrl+i', 'ctrl+shift+i']
						}
					});

				editor.value = 'test test test';
				const range = editor.selection.createRange();
				range.setStart(editor.editor.firstChild, 4);
				range.setEnd(editor.editor.firstChild, 8);
				editor.selection.selectRange(range);

				// standart ctrl+u
				simulateEvent('keydown', 85, editor.editor, function(data) {
					// data.shiftKey = true;
					data.ctrlKey = true;
				});

				expect('test<u> tes</u>t test').equals(editor.value);
			});
			describe('Replace ctrl+b to ctrl+shift+b for bold command', function() {
				it('Should not execute bold on ctrl+b', function() {
					const area = appendTestArea(),
						editor = new Jodit(area, {
							commandToHotkeys: {
								bold: 'ctrl+shift+b',
								italic: ['ctrl+i', 'ctrl+shift+i']
							}
						});
					editor.value = 'test test test';
					const range = editor.selection.createRange();
					range.setStart(editor.editor.firstChild, 4);
					range.setEnd(editor.editor.firstChild, 8);
					editor.selection.selectRange(range);

					// standart ctrl+b
					simulateEvent('keydown', 66, editor.editor, function(data) {
						// data.shiftKey = true;
						data.ctrlKey = true;
					});

					expect('test test test').equals(editor.value); // should not sork

					simulateEvent('keydown', 66, editor.editor, function(data) {
						data.shiftKey = true;
						data.ctrlKey = true;
					});

					expect('test<strong> tes</strong>t test').equals(
						editor.value
					);
				});
				it('Should execute bold on ctrl+shift+b', function() {
					const area = appendTestArea(),
						editor = new Jodit(area, {
							commandToHotkeys: {
								bold: 'ctrl+shift+b',
								italic: ['ctrl+i', 'ctrl+shift+i']
							}
						});
					editor.value = 'test test test';
					const range = editor.selection.createRange();
					range.setStart(editor.editor.firstChild, 4);
					range.setEnd(editor.editor.firstChild, 8);
					editor.selection.selectRange(range);

					simulateEvent('keydown', 66, editor.editor, function(data) {
						data.shiftKey = true;
						data.ctrlKey = true;
					});

					expect('test<strong> tes</strong>t test').equals(
						editor.value
					);
				});
			});
			describe('Add ctrl+shift+i to default ctrl+i shortcut for italic command', function() {
				it('Should work with each of shortcuts', function() {
					const area = appendTestArea(),
						editor = new Jodit(area, {
							commandToHotkeys: {
								bold: 'ctrl+shift+b',
								italic: ['ctrl+i', 'ctrl+shift+i']
							}
						});

					editor.value = 'test test test';

					const range = editor.selection.createRange();
					range.setStart(editor.editor.firstChild, 4);
					range.setEnd(editor.editor.firstChild, 8);
					editor.selection.selectRange(range);

					// standart ctrl+i
					simulateEvent('keydown', 73, editor.editor, function(data) {
						// data.shiftKey = true;
						data.ctrlKey = true;
					});

					expect('test<em> tes</em>t test').equals(editor.value);

					editor.value = 'test test test';

					const range2 = editor.selection.createRange();
					range2.setStart(editor.editor.firstChild, 4);
					range2.setEnd(editor.editor.firstChild, 8);
					editor.selection.selectRange(range2);

					// standart ctrl+shift+i
					simulateEvent('keydown', 73, editor.editor, function(data) {
						data.shiftKey = true;
						data.ctrlKey = true;
					});

					expect('test<em> tes</em>t test').equals(editor.value);

					// standart ctrl+shift+7
					simulateEvent('keydown', 103, editor.editor, function(
						data
					) {
						data.shiftKey = true;
						data.ctrlKey = true;
					});

					expect('<ol><li>test<em> tes</em>t test</li></ol>').equals(
						editor.value.replace('<br>', '')
					);
				});
			});
		});
	});

	describe('Sticky plugin', function() {
		describe('Without scrolling', function() {
			it('Should not have `jodit_sticky` class and toolbar must be in normal state', function() {
				const area = appendTestArea(),
					editor = new Jodit(area);

				editor.value = '<p>stop</p>'.repeat(100);
				expect(false).equals(
					editor.container.classList.contains('jodit_sticky')
				);
			});
		});
		describe('Create editor in page with long text', function() {
			describe('and scroll page to bottom', function() {
				it('Should add to editor class `jodit_sticky` and toolbar must be always on the top', function() {
					const area = appendTestArea(),
						editor = new Jodit(area);

					editor.value = '<p>stop</p>'.repeat(100);

					const offset = Jodit.modules.Helpers.offset(
						editor.container,
						editor,
						editor.ownerDocument
					);

					window.scroll(0, offset.top + offset.height / 2); // scroll page to bottom

					simulateEvent('scroll', 0, window);

					expect(true).equals(
						editor.container.classList.contains('jodit_sticky')
					);

					expect(0).equals(
						editor.toolbar
							.getParentContainer()
							.getBoundingClientRect().top
					);
				});
				describe('On mobile devices - with toolbarDisableStickyForMobile = true', function() {
					it('Should not add to editor class `jodit_sticky`', function() {
						getBox().style.width = '370px'; // IPhone 7

						const area = appendTestArea(),
							editor = new Jodit(area);

						editor.value = '<p>stop</p>'.repeat(100);
						const offset = Jodit.modules.Helpers.offset(
							editor.container,
							editor,
							editor.ownerDocument
						);

						window.scroll(0, offset.top + offset.height / 2); // scroll page to bottom
						simulateEvent('scroll', 0, window);

						expect(false).equals(
							editor.container.classList.contains('jodit_sticky')
						);
						expect(0).does.not.equal(
							editor.toolbar.container.getBoundingClientRect().top
						);
						getBox().style.width = 'auto'; // IPhone 7
					});
				});
				describe('In iframe mode', function() {
					it('Should work some way', function() {
						const editor = new Jodit(appendTestArea(), {
							iframe: true
						});

						editor.value = '<p>stop</p>'.repeat(100);
						const offset = Jodit.modules.Helpers.offset(
							editor.container,
							editor,
							editor.ownerDocument
						);

						window.scroll(0, offset.top + offset.height / 2); // scroll page to bottom
						simulateEvent('scroll', 0, window);

						expect(true).equals(
							editor.container.classList.contains('jodit_sticky')
						);
						expect(0).equals(
							editor.toolbar.container.getBoundingClientRect().top
						);
					});
				});
				describe('add offset for toolbar', function() {
					it('Should add offset for sticky toolbar', function() {
						const area = appendTestArea(),
							editor = new Jodit(area, {
								toolbarStickyOffset: 100
							});

						editor.value = '<p>stop</p>'.repeat(100);
						const offset = Jodit.modules.Helpers.offset(
							editor.container,
							editor,
							editor.ownerDocument
						);

						window.scroll(0, offset.top + offset.height / 2); // scroll page to bottom
						simulateEvent('scroll', 0, window);

						expect(true).equals(
							editor.container.classList.contains('jodit_sticky')
						);
						expect(100).equals(
							editor.toolbar.container.getBoundingClientRect().top
						);
					});
				});
				describe('with toolbarSticky false', function() {
					it('Should do nothing with toolbar', function() {
						const area = appendTestArea(),
							editor = new Jodit(area, {
								toolbarStickyOffset: 100,
								toolbarSticky: false
							});

						editor.value = '<p>stop</p>'.repeat(100);
						const offset = Jodit.modules.Helpers.offset(
							editor.container,
							editor,
							editor.ownerDocument
						);

						window.scroll(0, offset.top + offset.height / 2); // scroll page to bottom
						simulateEvent('scroll', 0, window);

						expect(false).equals(
							editor.container.classList.contains('jodit_sticky')
						);
						expect(100).does.not.equal(
							editor.toolbar.container.getBoundingClientRect().top
						);
						expect(0).does.not.equal(
							editor.toolbar.container.getBoundingClientRect().top
						);
					});
				});
			});

			describe('and scroll page to the top', function() {
				it('Should remove class `jodit_sticky` from editor and toolbar must have normal position', function() {
					fillBoxBr(100);

					const area = appendTestArea(),
						editor = new Jodit(area),
						brs = [0, 0, 0, 0, 0, 0, 0, 0, 0].map(function() {
							return editor.ownerDocument.createElement('br');
						});

					brs.forEach(function(br) {
						editor.container.parentNode.insertBefore(
							br,
							editor.container
						);
					});

					editor.value = '<p>stop</p>'.repeat(100);
					const offset = Jodit.modules.Helpers.offset(
						editor.container,
						editor,
						editor.ownerDocument
					);

					window.scroll(0, offset.top - 200); // scroll page above editor
					simulateEvent('scroll', 0, window);

					expect(false).equals(
						editor.container.classList.contains('jodit_sticky')
					);

					expect(5).to.be.above(
						Math.abs(
							200 -
								Jodit.modules.Helpers.position(
									editor.toolbar.container
								).top
						)
					);

					brs.forEach(function(br) {
						br.parentNode.removeChild(br);
					});
				});
			});
		});
	});

	describe('Size plugin', function() {
		describe('In iframe mode after change mode', function() {
			it('Should set min-height to iframe', function() {
				const editor = new Jodit(appendTestArea(), {
					iframe: true,
					minHeight: 300
				});

				editor.value = '';

				editor.toggleMode();
				editor.toggleMode();

				expect(editor.editor.offsetHeight).to.be.above(200);
			});
		});
		describe('Set height', function() {
			it('Should set container height', function() {
				const editor = new Jodit(appendTestArea(), {
					height: 222
				});

				expect(editor.container.offsetHeight).equals(222);
			});
		});
	});

	describe('Fullsize plugin', function() {
		describe('Toggle fullsize', function() {
			it('Should resize all boxes to first state', function() {
				const editor = new Jodit(appendTestArea(), {
					observer: {
						timeout: 0
					}
				});
				const chacksizes = ['container', 'workplace', 'editor'];
				const sizes = chacksizes.map(function(key) {
						return editor[key].offsetHeight;
					}),
					equal = function(a, b) {
						return Math.abs(a - b) <= 2;
					};

				editor.toggleFullSize(true);
				chacksizes.map(function(key, index) {
					expect(
						equal(editor[key].offsetHeight, sizes[index])
					).is.false;
				});

				editor.toggleFullSize(false);

				chacksizes.map(function(key, index) {
					expect(
						equal(editor[key].offsetHeight, sizes[index])
					).is.true;
				});
			});
		});
	});

	describe('Path plugin', function() {
		describe('After init', function() {
			describe('With showXPathInStatusbar=true', function() {
				it('Should show status bar', function() {
					const editor = new Jodit(appendTestArea(), {
						language: 'en',
						showXPathInStatusbar: true,
						showCharsCounter: false,
						showWordsCounter: false,
						observer: {
							timeout: 0
						}
					});

					editor.value = '<p>Simple text</p>';

					const statusbar = editor.container.querySelector(
						'.jodit_statusbar'
					);

					expect(
						editor.ownerWindow.getComputedStyle(statusbar).display
					).equals('flex');
				});

				it('Should show path to selection element', function() {
					const editor = new Jodit(appendTestArea(), {
						language: 'en',
						showXPathInStatusbar: true,
						observer: {
							timeout: 0
						}
					});

					editor.value = '<p>Simple text <a href="#">sss</a></p>';
					editor.selection.setCursorIn(
						editor.editor.querySelector('a')
					);

					const statusbar = editor.container.querySelector(
						'.jodit_statusbar ul'
					);

					expect(statusbar).is.not.null;
					expect(statusbar.firstChild.textContent.trim()).equals('');
					expect(statusbar.childNodes[1].textContent).equals('p');
					expect(statusbar.childNodes[2].textContent).equals('a');
				});

				describe('After change selection', function() {
					it('Should change path to selection element', function() {
						const editor = new Jodit(appendTestArea(), {
							language: 'en',
							showXPathInStatusbar: true,
							observer: {
								timeout: 0
							}
						});

						editor.value =
							'<p>Simple text <a href="#">sss</a><span>s</span></p>';
						editor.selection.setCursorIn(
							editor.editor.querySelector('a')
						);

						const statusbar = editor.container.querySelector(
							'.jodit_statusbar ul'
						);

						expect(statusbar).is.not.null;
						expect(statusbar.firstChild.innerText).equals('');
						expect(statusbar.childNodes[1].textContent).equals('p');
						expect(statusbar.childNodes[2].textContent).equals('a');

						editor.selection.setCursorIn(
							editor.editor.querySelector('span')
						);

						expect(statusbar.firstChild.innerText).equals('');
						expect(statusbar.childNodes[1].textContent).equals('p');
						expect(statusbar.childNodes[2].textContent).equals(
							'span'
						);
					});
				});
				describe('After click on element of path', function() {
					it('Should select this element', function() {
						const editor = new Jodit(appendTestArea(), {
							language: 'en',
							showXPathInStatusbar: true,
							observer: {
								timeout: 0
							}
						});

						editor.value =
							'<p>Simple text <a href="#">sss</a><span>s</span></p>';
						editor.selection.setCursorIn(
							editor.editor.querySelector('a')
						);

						const statusbar = editor.container.querySelector(
							'.jodit_statusbar ul'
						);

						expect(statusbar).is.not.null;
						expect(statusbar.firstChild.innerText).equals('');
						expect(statusbar.childNodes[1].textContent).equals('p');
						expect(statusbar.childNodes[2].textContent).equals('a');

						simulateEvent(
							'click',
							0,
							statusbar.childNodes[2].firstChild
						); // click on A

						expect(
							Jodit.modules.Helpers.trim(
								editor.selection.sel.toString()
							)
						).equals('sss');
						expect(statusbar.childNodes[2].textContent).equals('a');

						simulateEvent(
							'click',
							0,
							statusbar.childNodes[1].firstChild
						); // click on P

						expect(
							Jodit.modules.Helpers.trim(
								editor.selection.sel.toString()
							)
						).equals('Simple text ssss');
						expect(statusbar.childNodes.length).equals(3);
					});
				});
				describe('Context menu on element of path', function() {
					it('Should open context menu', function() {
						const editor = new Jodit(appendTestArea(), {
							language: 'en',
							showXPathInStatusbar: true,
							observer: {
								timeout: 0
							}
						});

						editor.value =
							'<p>Simple text <a href="#">sss</a><span>s</span></p>';

						editor.selection.setCursorIn(
							editor.editor.querySelector('a')
						);

						const statusbar = editor.container.querySelector(
							'.jodit_statusbar ul'
						);

						expect(statusbar).is.not.null;
						expect(statusbar.firstChild.innerText).equals('');
						expect(statusbar.childNodes[1].textContent).equals('p');
						expect(statusbar.childNodes[2].textContent).equals('a');

						simulateEvent(
							'contextmenu',
							0,
							statusbar.childNodes[2].firstChild
						);

						const context = editor.ownerDocument.querySelector(
							'.jodit_context_menu[data-editor_id=' +
								editor.id +
								']'
						);

						expect(context).is.not.null;
						expect(
							editor.ownerWindow.getComputedStyle(context).display
						).equals('block');

						simulateEvent(
							'mousedown',
							0,
							context.querySelector('a')
						);
						expect(editor.value).equals(
							'<p>Simple text <span>s</span></p>'
						);

						expect(context.parentNode).is.null;
					});
				});
			});
		});
	});

	describe('Paste storage', function() {
		describe('Empty list', function() {
			it('Sholud not show dialog', function() {
				const editor = new Jodit(appendTestArea());
				simulateEvent('keydown', Jodit.KEY_V, editor.editor, function(
					data
				) {
					data.ctrlKey = true;
					data.shiftKey = true;
				});
				const dialog = editor.ownerDocument.querySelector(
					'.jodit.jodit_dialog_box.active[data-editor=' +
						editor.id +
						']'
				);
				expect(dialog).is.null;
			});
		});
		describe('After copy elements', function() {
			it('Sholud show dialog with pasted list', function() {
				const editor = new Jodit(appendTestArea(), {
					observer: {
						timeout: 0
					}
				});

				editor.selection.focus();
				editor.value = 'abcde';
				const range = editor.ownerDocument.createRange();

				range.setStart(editor.editor.firstChild, 0);
				range.setEnd(editor.editor.firstChild, 1);
				editor.selection.selectRange(range);

				simulateEvent('copy', 0, editor.editor, function(data) {
					Object.defineProperty(data, 'clipboardData', {
						value: {
							getData: function() {},
							setData: function() {}
						}
					});
				});

				range.setStart(editor.editor.firstChild, 1);
				range.setEnd(editor.editor.firstChild, 2);
				editor.selection.selectRange(range);

				simulateEvent('copy', 0, editor.editor, function(data) {
					Object.defineProperty(data, 'clipboardData', {
						value: {
							getData: function() {},
							setData: function() {}
						}
					});
				});

				simulateEvent('keydown', Jodit.KEY_V, editor.editor, function(
					data
				) {
					data.ctrlKey = true;
					data.shiftKey = true;
				});

				const dialog = editor.ownerDocument.querySelector(
					'.jodit.jodit_dialog_box.active[data-editor_id=' +
						editor.id +
						']'
				);
				expect(dialog).is.not.null;
			});
			describe('After click on some of elements', function() {
				it('Sholud select this', function() {
					const editor = new Jodit(appendTestArea());

					editor.value = 'abcde';
					const range = editor.ownerDocument.createRange();

					range.setStart(editor.editor.firstChild, 0);
					range.setEnd(editor.editor.firstChild, 1);
					editor.selection.selectRange(range);

					simulateEvent('copy', 0, editor.editor, function(data) {
						Object.defineProperty(data, 'clipboardData', {
							value: {
								getData: function() {},
								setData: function() {}
							}
						});
					});

					range.setStart(editor.editor.firstChild, 1);
					range.setEnd(editor.editor.firstChild, 2);
					editor.selection.selectRange(range);

					simulateEvent('copy', 0, editor.editor, function(data) {
						Object.defineProperty(data, 'clipboardData', {
							value: {
								getData: function() {},
								setData: function() {}
							}
						});
					});

					simulateEvent(
						'keydown',
						Jodit.KEY_V,
						editor.editor,
						function(data) {
							data.ctrlKey = true;
							data.shiftKey = true;
						}
					);

					const dialog = editor.ownerDocument.querySelector(
						'.jodit.jodit_dialog_box.active[data-editor_id=' +
							editor.id +
							']'
					);
					expect(dialog).is.not.null;

					simulateEvent(
						'click',
						0,
						dialog.querySelectorAll('.jodit_paste_storage a')[1]
					);
					expect(
						dialog
							.querySelectorAll('.jodit_paste_storage a')[1]
							.classList.contains('jodit_active')
					).is.true;

					simulateEvent(
						'dblclick',
						0,
						dialog.querySelectorAll('.jodit_paste_storage a')[1]
					);

					expect(
						editor.ownerWindow.getComputedStyle(dialog).display
					).equals('none');

					expect(editor.value).equals('aacde');
				});
			});
			describe('Press key up/down/enter', function() {
				it('Sholud select next/previos element of list and insert selected value after Enter', function() {
					const editor = new Jodit(appendTestArea());

					editor.value = 'abcde';
					const range = editor.ownerDocument.createRange();

					range.setStart(editor.editor.firstChild, 0);
					range.setEnd(editor.editor.firstChild, 1);
					editor.selection.selectRange(range);

					simulateEvent('copy', 0, editor.editor, function(data) {
						Object.defineProperty(data, 'clipboardData', {
							value: {
								getData: function() {},
								setData: function() {}
							}
						});
					});

					range.setStart(editor.editor.firstChild, 1);
					range.setEnd(editor.editor.firstChild, 2);
					editor.selection.selectRange(range);

					simulateEvent('copy', 0, editor.editor, function(data) {
						Object.defineProperty(data, 'clipboardData', {
							value: {
								getData: function() {},
								setData: function() {}
							}
						});
					});

					simulateEvent(
						'keydown',
						Jodit.KEY_V,
						editor.editor,
						function(data) {
							data.ctrlKey = true;
							data.shiftKey = true;
						}
					);

					const dialog = editor.ownerDocument.querySelector(
						'.jodit.jodit_dialog_box.active[data-editor_id=' +
							editor.id +
							']'
					);
					expect(dialog).is.not.null;

					simulateEvent(
						'click',
						0,
						dialog.querySelectorAll('.jodit_paste_storage a')[0]
					);
					expect(
						dialog
							.querySelectorAll('.jodit_paste_storage a')[0]
							.classList.contains('jodit_active')
					).is.true;

					simulateEvent(
						'keydown',
						Jodit.KEY_UP,
						dialog.querySelectorAll('.jodit_paste_storage a')[0]
					);
					expect(
						dialog
							.querySelectorAll('.jodit_paste_storage a')[1]
							.classList.contains('jodit_active')
					).is.true;

					simulateEvent(
						'keydown',
						Jodit.KEY_UP,
						dialog.querySelectorAll('.jodit_paste_storage a')[1]
					);
					expect(
						dialog
							.querySelectorAll('.jodit_paste_storage a')[0]
							.classList.contains('jodit_active')
					).is.true;

					simulateEvent(
						'keydown',
						Jodit.KEY_DOWN,
						dialog.querySelectorAll('.jodit_paste_storage a')[0]
					);
					expect(
						dialog
							.querySelectorAll('.jodit_paste_storage a')[1]
							.classList.contains('jodit_active')
					).is.true;

					simulateEvent(
						'keydown',
						Jodit.KEY_ENTER,
						dialog.querySelectorAll('.jodit_paste_storage a')[0]
					);

					expect(
						editor.ownerWindow.getComputedStyle(dialog).display
					).equals('none');

					expect(editor.value).equals('aacde');
				});
			});
		});
	});

	afterEach(removeStuff);
});
