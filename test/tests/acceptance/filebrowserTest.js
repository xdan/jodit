/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Jodit FileBrowser Tests', function () {
	describe('Constructor/Destructor', function () {
		describe('Without Jodit', function () {
			it('Should create dialog and load files', function () {
				const filebrowser = new Jodit.modules.FileBrowser({
					ajax: {
						url: 'https://xdsoft.net/jodit/connector/index.php'
					}
				});

				filebrowser.open(function () {});

				expect(
					document.querySelectorAll('.jodit-dialog').length
				).equals(1);

				filebrowser.close();

				expect(
					document.querySelectorAll('.jodit-dialog').length
				).equals(0);

				filebrowser.destruct();
			});
		});

		it('Should create dialog and load files', function () {
			const editor = getJodit({
				filebrowser: {
					ajax: {
						url: 'https://xdsoft.net/jodit/connector/index.php'
					}
				}
			});

			const filebrowser = new Jodit.modules.FileBrowser(
				editor.o.filebrowser
			);
			filebrowser.open(function () {});

			expect(
				editor.ownerDocument.querySelectorAll('.jodit-dialog').length
			).equals(1);

			filebrowser.destruct();
		});

		it('Should add filebrowser icon in image buttons popup', function () {
			const editor = getJodit({
				filebrowser: {
					ajax: {
						url: 'https://xdsoft.net/jodit/connector/index.php'
					}
				}
			});

			clickButton('image', editor);

			expect(
				getOpenedPopup(editor)
					.querySelector('[aria-pressed="true"]')
					.innerText.trim()
			).equals('Browse');
		});

		it('Should add uploader icon in image buttons popup', function () {
			const editor = getJodit({
				uploader: {
					url: 'https://xdsoft.net/jodit/connector/index.php?action=upload'
				},
				filebrowser: {
					ajax: {
						url: 'https://xdsoft.net/jodit/connector/index.php'
					}
				}
			});

			clickButton('image', editor);

			expect(
				getOpenedPopup(editor)
					.querySelector('[aria-pressed="true"]')
					.innerText.trim()
			).equals('Upload');
		});

		describe('Without folders panel', function () {
			it('Should create dialog and load files', function (done) {
				const editor = getJodit({
					filebrowser: {
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						},
						showFoldersPanel: false
					}
				});

				const filebrowser = editor.filebrowser;

				filebrowser
					.open(function () {})
					.then(function () {
						const files = filebrowser.browser.querySelector(
							'.jodit-filebrowser__files'
						);

						expect(files).is.not.null;

						expect(
							files.querySelector(
								'.jodit-filebrowser__files-item img[data-src="https://xdsoft.net/jodit/files/images.jpg"]'
							)
						).is.not.null;

						done();
					})
					.catch(function (e) {
						throw e;
					});
			});
		});
	});

	describe('Change Ajax options', function () {
		describe('Use GET method instead POST', function () {
			it('Should add params into url instead body', function (done) {
				const filebrowser = new Jodit.modules.FileBrowser({
					ajax: {
						url: 'https://xdsoft.net/jodit/connector/index.php',
						method: 'GET'
					}
				});

				filebrowser
					.open(function () {})
					.then(function () {
						Jodit.modules.Ajax.log.forEach(function (req) {
							expect(req.url).to.be.match(/\?action/);
						});

						filebrowser.destruct();
						done();
					})
					.catch(function (e) {
						throw e;
					});
			});
		});

		describe('Use POST method', function () {
			it('Should add params only into body', function (done) {
				const filebrowser = new Jodit.modules.FileBrowser({
					ajax: {
						url: 'https://xdsoft.net/jodit/connector/index.php',
						method: 'POST'
					}
				});

				filebrowser
					.open(function () {})
					.then(function () {
						Jodit.modules.Ajax.log.forEach(function (req) {
							expect(req.url).equals(
								'https://xdsoft.net/jodit/connector/index.php'
							);
						});

						filebrowser.destruct();
						done();
					})
					.catch(function (e) {
						throw e;
					});
			});
		});
	});

	describe('Toolbar', function () {
		describe('Without Jodit', function () {
			it('Should create filebrowser and show standart toolbar', function (done) {
				const filebrowser = new Jodit.modules.FileBrowser({
					ajax: {
						url: 'https://xdsoft.net/jodit/connector/index.php'
					}
				});

				filebrowser
					.open(function () {})
					.then(function () {
						expect(
							filebrowser.dialog.dialogbox_header.querySelectorAll(
								'.jodit-toolbar-button,.jodit-toolbar-content'
							).length
						).equals(9);

						filebrowser.close();
						filebrowser.destruct();

						done();
					})
					.catch(function (e) {
						throw e;
					});
			});
		});
		describe('Disable buttons', function () {
			describe('Edit button', function () {
				it('Should be disable while not selected some image', function (done) {
					const filebrowser = new Jodit.modules.FileBrowser({
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					});

					filebrowser
						.open(function () {})
						.then(function () {
							const edit = getButton(
								'edit',
								filebrowser.dialog.dialogbox_header
							);
							expect(edit).is.not.null;
							expect(edit.hasAttribute('disabled')).is.true;

							simulateEvent(
								'click',
								filebrowser.browser.querySelector(
									'.jodit-filebrowser__files-item[data-is-file="0"]'
								)
							);

							expect(edit.hasAttribute('disabled')).is.false;

							filebrowser.close();
							filebrowser.destruct();

							done();
						})
						.catch(function (e) {
							throw e;
						});
				});

				it('Should be disabled if selected more then 1 image or some file', function (done) {
					const filebrowser = new Jodit.modules.FileBrowser({
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					});

					filebrowser
						.open(function () {})
						.then(function () {
							const edit = getButton(
								'edit',
								filebrowser.dialog.dialogbox_header
							);

							expect(edit.hasAttribute('disabled')).is.true;

							simulateEvent(
								'click',
								0,
								filebrowser.browser.querySelectorAll(
									'.jodit-filebrowser__files-item[data-is-file="0"]'
								)[0]
							);

							expect(edit.hasAttribute('disabled')).is.false;

							simulateEvent(
								'click',
								0,
								filebrowser.browser.querySelectorAll(
									'.jodit-filebrowser__files-item[data-is-file="0"]'
								)[1],
								function (data) {
									data[
										!navigator.userAgent.indexOf('Mac OS X')
											? 'ctrlKey'
											: 'metaKey'
									] = true;
								}
							);

							expect(edit.hasAttribute('disabled')).is.true;

							filebrowser.close();
							filebrowser.destruct();

							done();
						})
						.catch(function (e) {
							throw e;
						});
				});

				describe('Allow all buttons if permission handle is not set', function () {
					describe('If deny remove action', function () {
						it('Should not use permission hash and canI method', function (done) {
							defaultPermissions.permissions.allowFileRemove = false;

							const filebrowser = new Jodit.modules.FileBrowser({
								ajax: {
									url: 'https://xdsoft.net/jodit/connector/index.php'
								}
							});

							filebrowser
								.open(function () {})
								.then(function () {
									const remove = getButton(
										'remove',
										filebrowser.dialog
									);
									expect(remove).is.not.null;
									expect(
										remove.hasAttribute('disabled')
									).is.true;

									simulateEvent(
										'click',
										0,
										filebrowser.browser.querySelector(
											'.jodit-filebrowser__files-item[data-is-file="0"]'
										)
									);

									expect(
										remove.hasAttribute('disabled')
									).is.true;

									filebrowser.close();
									filebrowser.destruct();

									done();
								})
								.catch(function (e) {
									throw e;
								});
						});
					});

					describe('If not set permission api option', function () {
						it('Should not use permission hash and canI method', function (done) {
							defaultPermissions.permissions.allowFileRemove = false;

							const filebrowser = new Jodit.modules.FileBrowser({
								ajax: {
									url: 'https://xdsoft.net/jodit/connector/index.php'
								},
								permissions: null
							});

							filebrowser
								.open(function () {})
								.then(function () {
									const remove = getButton(
										'remove',
										filebrowser.dialog
									);
									expect(remove).is.not.null;

									expect(
										remove.hasAttribute('disabled')
									).is.true;

									simulateEvent(
										'click',
										0,
										filebrowser.browser.querySelector(
											'.jodit-filebrowser__files-item[data-is-file="0"]'
										)
									);

									expect(
										remove.hasAttribute('disabled')
									).is.false;

									filebrowser.close();
									filebrowser.destruct();

									done();
								})
								.catch(function (e) {
									throw e;
								});
						});
					});
				});
			});
		});

		describe('View', function () {
			it('Should show filebrowser in default view', function (done) {
				const filebrowser = new Jodit.modules.FileBrowser({
					view: 'tiles',
					ajax: {
						url: 'https://xdsoft.net/jodit/connector/index.php'
					}
				});

				filebrowser
					.open(function () {})
					.then(function () {
						const tiles = getButton('tiles', filebrowser.dialog);
						const list = getButton('list', filebrowser.dialog);

						const files = filebrowser.browser.querySelector(
							'.jodit-filebrowser__files'
						);

						expect(files).is.not.null;
						expect(
							files.classList.contains(
								'jodit-filebrowser__files_view_tiles'
							)
						).is.true;

						expect(tiles.component.state.activated).is.true;
						expect(list.component.state.activated).is.false;

						filebrowser.close();
						filebrowser.destruct();

						done();
					})
					.catch(function (e) {
						throw e;
					});
			});

			describe('Change view', function () {
				it('Should change filebrowser view', function (done) {
					const filebrowser = new Jodit.modules.FileBrowser({
						view: 'tiles',
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					});

					filebrowser
						.open(function () {})
						.then(function () {
							const tiles = getButton(
								'tiles',
								filebrowser.dialog
							);
							const list = getButton('list', filebrowser.dialog);

							const files = filebrowser.browser.querySelector(
								'.jodit-filebrowser__files'
							);
							expect(files).is.not.null;
							expect(
								files.classList.contains(
									'jodit-filebrowser__files_view_tiles'
								)
							).is.true;

							expect(tiles.component.state.activated).is.true;
							expect(list.component.state.activated).is.false;

							simulateEvent('click', 0, list);

							expect(
								files.classList.contains(
									'jodit-filebrowser__files_view_tiles'
								)
							).is.false;
							expect(
								files.classList.contains(
									'jodit-filebrowser__files_view_list'
								)
							).is.true;
							expect(tiles.component.state.activated).is.false;
							expect(list.component.state.activated).is.true;

							filebrowser.close();
							filebrowser.destruct();

							done();
						})
						.catch(function (e) {
							throw e;
						});
				});
			});
		});

		describe('Filter', function () {
			it('Should show only filtered items', function (done) {
				const filebrowser = new Jodit.modules.FileBrowser({
					ajax: {
						url: 'https://xdsoft.net/jodit/connector/index.php'
					}
				});

				filebrowser
					.open(function () {})
					.then(async function () {
						const filter =
							filebrowser.dialog.dialogbox_header.querySelector(
								'.jodit-toolbar-content_filter'
							);
						const input = filter.querySelector('input');
						const files = filebrowser.browser.querySelector(
							'.jodit-filebrowser__files'
						);

						expect(files).is.not.null;
						expect(filter).is.not.null;
						expect(input).is.not.null;

						const count = files.querySelectorAll(
							'.jodit-filebrowser__files-item'
						).length;

						input.value = 'i';
						simulateEvent('keydown', input);

						await filebrowser.async.requestIdlePromise();

						expect(
							files.querySelectorAll(
								'.jodit-filebrowser__files-item'
							).length
						).does.not.equal(count);

						input.value = '';
						simulateEvent('keydown', input);

						await filebrowser.async.requestIdlePromise();

						expect(
							files.querySelectorAll(
								'.jodit-filebrowser__files-item'
							).length
						).equals(count);

						filebrowser.close();
						filebrowser.destruct();

						done();
					})
					.catch(function (e) {
						throw e;
					});
			});
		});

		describe('Sort', function () {
			it('Should sort elements by filter select', function (done) {
				const filebrowser = new Jodit.modules.FileBrowser({
					ajax: {
						url: 'https://xdsoft.net/jodit/connector/index.php'
					}
				});

				filebrowser
					.open(function () {})
					.then(async function () {
						const sort =
							filebrowser.dialog.dialogbox_header.querySelector(
								'.jodit-toolbar-content_sort'
							);
						const select = sort.querySelector('select');
						const files = filebrowser.browser.querySelector(
							'.jodit-filebrowser__files'
						);

						expect(files).is.not.null;
						expect(sort).is.not.null;
						expect(select).is.not.null;

						const pars = {
							'changed-asc': [
								'images.jpg',
								'1966051_524428741092238_1051008806888563137_o.jpg',
								'ibanez-s520-443140.jpg',
								'test.txt'
							],
							'changed-desc': [
								'test.txt',
								'ibanez-s520-443140.jpg',
								'1966051_524428741092238_1051008806888563137_o.jpg',
								'images.jpg'
							],
							'name-asc': [
								'1966051_524428741092238_1051008806888563137_o.jpg',
								'ibanez-s520-443140.jpg',
								'images.jpg',
								'test.txt'
							],
							'name-desc': [
								'test.txt',
								'images.jpg',
								'ibanez-s520-443140.jpg',
								'1966051_524428741092238_1051008806888563137_o.jpg'
							],
							'size-asc': [
								'images.jpg',
								'test.txt',
								'ibanez-s520-443140.jpg',
								'1966051_524428741092238_1051008806888563137_o.jpg'
							],
							'size-desc': [
								'1966051_524428741092238_1051008806888563137_o.jpg',
								'ibanez-s520-443140.jpg',
								'test.txt',
								'images.jpg'
							]
						};

						for (const key in pars) {
							select.value = key;

							simulateEvent('change', 0, select);

							await filebrowser.async.requestIdlePromise();

							const items = files.querySelectorAll(
								'.jodit-filebrowser__files-item'
							);

							expect(
								Array.from(items)
									.map(function (item) {
										return item.querySelector(
											'.jodit-filebrowser__files-item-info-filename'
										).textContent;
									})
									.join(',')
							).equals(pars[key].join(','));
						}

						filebrowser.close();
						filebrowser.destruct();

						done();
					})
					.catch(function (e) {
						throw e;
					});
			});
		});

		describe('Select button', function () {
			it('Should fire first callback in open method', function (done) {
				const filebrowser = new Jodit.modules.FileBrowser({
					filebrowser: {
						saveStateInStorage: false
					},
					ajax: {
						url: 'https://xdsoft.net/jodit/connector/index.php'
					}
				});

				filebrowser
					.open(function (data) {
						expect(data !== undefined).is.true;
						expect(data.files !== undefined).is.true;
						expect(data.files.length).equals(1);
						expect(data.files[0]).equals(
							'https://xdsoft.net/jodit/files/test.txt'
						);
					})
					.then(function () {
						const select = getButton('select', filebrowser.dialog);
						const files = filebrowser.browser.querySelector(
							'.jodit-filebrowser__files'
						);

						expect(files).is.not.null;
						expect(select).is.not.null;

						expect(select.hasAttribute('disabled')).is.true;

						simulateEvent(
							'click',
							0,
							filebrowser.browser.querySelector(
								'.jodit-filebrowser__files-item'
							)
						);

						expect(select.hasAttribute('disabled')).is.false;

						simulateEvent('click', 0, select);

						filebrowser.close();
						filebrowser.destruct();

						done();
					})
					.catch(function (e) {
						throw e;
					});
			});
		});
	});

	describe('Test drag and drop', function () {
		describe('Drag and drop image from filebrowser', function () {
			it('Should create IMG element in editor', function (done) {
				const editor = getJodit({
					filebrowser: {
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					}
				});

				const filebrowser = editor.filebrowser;

				filebrowser
					.open(function () {})
					.then(function () {
						const files = filebrowser.browser.querySelector(
							'.jodit-filebrowser__files'
						);

						expect(files).is.not.null;

						simulateEvent(
							'dragstart',
							files.querySelector(
								'.jodit-filebrowser__files-item img[data-src="https://xdsoft.net/jodit/files/images.jpg"]'
							)
						);

						simulateEvent('dragover', window, function (data) {
							data.clientX = 50;
							data.clientY = 20 + offset(editor.editor).top;
						});

						simulateEvent('drop', editor.editor, function (data) {
							Object.defineProperty(data, 'dataTransfer', {
								value: {
									files: []
								}
							});
						});

						expect(editor.value).equals(
							'<p><img src="https://xdsoft.net/jodit/files/images.jpg"></p>'
						);

						simulateEvent('drop', window);

						filebrowser.destruct();

						done();
					})
					.catch(function (e) {
						throw e;
					});
			});
		});

		describe('Drag and drop File from filebrowser', function () {
			it('Should create A element in editor', function (done) {
				const editor = getJodit({
					filebrowser: {
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					}
				});

				const filebrowser = editor.filebrowser;

				filebrowser
					.open(function () {})
					.then(function () {
						const files = filebrowser.browser.querySelector(
							'.jodit-filebrowser__files'
						);

						expect(files).is.not.null;

						simulateEvent(
							'dragstart',
							files.querySelector(
								'.jodit-filebrowser__files-item[data-is-file="1"] img'
							)
						);

						simulateEvent('dragover', window, function (data) {
							data.clientX = 50;
							data.clientY = 20 + offset(editor.editor).top;
						});

						simulateEvent('drop', editor.editor, function (data) {
							Object.defineProperty(data, 'dataTransfer', {
								value: {
									files: []
								}
							});
						});

						expect(editor.value).equals(
							'<p><a href="https://xdsoft.net/jodit/files/test.txt">https://xdsoft.net/jodit/files/test.txt</a></p>'
						);
						simulateEvent('drop', window);

						filebrowser.destruct();
						done();
					})
					.catch(function (e) {
						throw e;
					});
			});
		});
	});

	describe('DblClick', function () {
		describe('DblClick on image from filebrowser', function () {
			it('Should insert IMG element in editor in the selected before place', function (done) {
				const editor = getJodit({
					filebrowser: {
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					}
				});

				editor.value =
					'<p>Some text</p><p>Another text</p><p>Another some text</p>';

				const range = editor.s.createRange();
				range.setStart(
					editor.editor.querySelectorAll('p')[1].firstChild,
					7
				);

				range.collapse(true);
				editor.s.selectRange(range);

				const filebrowser = editor.filebrowser;

				filebrowser
					.open()
					.then(function () {
						const files = filebrowser.browser.querySelector(
							'.jodit-filebrowser__files'
						);

						expect(files).is.not.null;

						simulateEvent(
							['click', 'dblclick'],
							0,
							files.querySelector(
								'a[data-is-file="0"].jodit-filebrowser__files-item'
							)
						);

						expect(editor.value).equals(
							'<p>Some text</p><p>Another<img src="https://xdsoft.net/jodit/files/ibanez-s520-443140.jpg" style="width: 300px;"> text</p><p>Another some text</p>'
						);

						filebrowser.destruct();
						done();
					})
					.catch(function (e) {
						throw e;
					});
			});
		});

		describe('DblClick on File from filebrowser', function () {
			it('Should insert A element in editor in the selected before place', function (done) {
				const editor = getJodit({
					filebrowser: {
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					}
				});

				editor.value =
					'<p>Some text</p><p>Another text</p><p>Another some text</p>';
				const range = editor.s.createRange();
				range.setStart(
					editor.editor.querySelectorAll('p')[1].firstChild,
					7
				);
				range.collapse(true);
				editor.s.selectRange(range);

				const filebrowser = editor.filebrowser;

				filebrowser
					.open()
					.then(function () {
						const files = filebrowser.browser.querySelector(
							'.jodit-filebrowser__files'
						);

						expect(files).is.not.null;

						simulateEvent(
							['click', 'dblclick'],
							0,
							files.querySelector(
								'a[data-is-file="1"].jodit-filebrowser__files-item'
							)
						);

						expect(editor.value).equals(
							'<p>Some text</p><p>Another<a href="https://xdsoft.net/jodit/files/test.txt" title="https://xdsoft.net/jodit/files/test.txt">https://xdsoft.net/jodit/files/test.txt</a> text</p><p>Another some text</p>'
						);

						filebrowser.destruct();
						done();
					})
					.catch(function (e) {
						throw e;
					});
			});
		});
	});

	describe('Uploader', function () {
		describe('Drag and drop', function () {
			describe('Image', function () {
				it('Should create IMG element', function (done) {
					const editor = getJodit({
						uploader: {
							url: 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload'
						},
						filebrowser: {
							ajax: {
								url: 'https://xdsoft.net/jodit/connector/index.php'
							}
						}
					});

					editor.value = '';

					editor.events.on('filesWereUploaded', function () {
						expect(sortAttributes(editor.value)).equals(
							'<p><img src="https://xdsoft.net/jodit/files/test.png" style="width:300px"></p>'
						);
						done();
					});

					simulateEvent('drop', 0, editor.editor, function (data) {
						Object.defineProperty(data, 'dataTransfer', {
							value: {
								files: [{ name: 'test.png', type: 'image/png' }]
							}
						});
					});
				});
			});

			describe('File', function () {
				it('Should create A element', function (done) {
					const editor = getJodit({
						uploader: {
							url: 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload'
						},
						filebrowser: {
							ajax: {
								url: 'https://xdsoft.net/jodit/connector/index.php'
							}
						}
					});

					editor.value = '';

					editor.events.on('filesWereUploaded', function () {
						expect(editor.value).equals(
							'<p><a href="https://xdsoft.net/jodit/files/test.txt">https://xdsoft.net/jodit/files/test.txt</a></p>'
						);
						done();
					});

					simulateEvent('drop', 0, editor.editor, function (data) {
						Object.defineProperty(data, 'dataTransfer', {
							value: {
								files: [
									{ name: 'test.txt', type: 'plain/text' }
								]
							}
						});
					});
				});
			});
		});
	});

	describe('Rename', function () {
		describe('Folder', function () {
			it('Should create button inside every folder of list', function (done) {
				const editor = getJodit({
					filebrowser: {
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					}
				});

				const filebrowser = editor.filebrowser;

				filebrowser
					.open(function () {})
					.then(async function () {
						const tree = filebrowser.browser.querySelector(
							'.jodit-filebrowser__tree'
						);

						expect(tree).is.not.null;

						const item = tree.querySelectorAll(
							'.jodit-filebrowser__tree-item'
						)[1];

						expect(item).is.not.null;

						const trigger = getButton('rename', item);

						expect(trigger).is.not.null;

						expect(trigger.parentElement.textContent.trim()).equals(
							'ceicom'
						);
						simulateEvent('click', trigger);

						const dialog = getOpenedDialog(editor);
						expect(dialog).is.not.null;
						expect(dialog).does.not.equal(filebrowser.dialog);

						expect(dialog.querySelector('input').value).equals(
							'ceicom'
						);

						dialog.querySelector('input').value = 'ceicom1';
						clickButton('ok', dialog);

						await filebrowser.async.requestIdlePromise();

						const item2 = tree.querySelectorAll(
							'.jodit-filebrowser__tree-item'
						)[1];
						expect(item2.textContent.trim()).equals('ceicom1');

						filebrowser.destruct();

						done();
					})
					.catch(function (e) {
						throw e;
					});
			});
		});
	});

	describe('Remove', function () {
		describe('Folder', function () {
			it('Should create button inside every folder of list', function (done) {
				const editor = getJodit({
					filebrowser: {
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					}
				});

				const filebrowser = editor.filebrowser;

				filebrowser
					.open(function () {})
					.then(function () {
						const tree = filebrowser.browser.querySelector(
							'.jodit-filebrowser__tree'
						);

						expect(tree).is.not.null;

						const item = tree.querySelectorAll(
							'.jodit-filebrowser__tree-item'
						)[1];

						expect(item).is.not.null;

						const trigger = getButton('remove', item);

						expect(trigger).is.not.null;

						simulateEvent('click', trigger);

						const dialog = getOpenedDialog(editor);
						expect(dialog).is.not.null;
						expect(dialog).does.not.equal(filebrowser.dialog);

						clickButton('ok', dialog);

						filebrowser.destruct();

						done();
					})
					.catch(function (e) {
						throw e;
					});
			});
		});
	});

	describe('Create', function () {
		describe('Folder', function () {
			it('Should create button below folders list', function (done) {
				const editor = getJodit({
					filebrowser: {
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					}
				});

				const filebrowser = editor.filebrowser;

				filebrowser
					.open(function () {})
					.then(function () {
						const addfolder = getButton('plus', filebrowser.tree);

						expect(addfolder).is.not.null;
						filebrowser.destruct();

						done();
					})
					.catch(function (e) {
						throw e;
					});
			});

			describe('Create new folder', function () {
				it('Should create new folder', function (done) {
					const editor = getJodit({
						filebrowser: {
							ajax: {
								url: 'https://xdsoft.net/jodit/connector/index.php'
							}
						}
					});

					const filebrowser = editor.filebrowser;

					filebrowser
						.open(function () {})
						.then(async function () {
							const addfolder = getButton(
								'plus',
								filebrowser.tree
							);

							expect(addfolder).is.not.null;

							simulateEvent('click', addfolder);

							const dialog = getOpenedDialog(editor);

							expect(dialog).is.not.null;
							dialog.querySelector('input').value = 'free';
							clickButton('ok', dialog);
							await filebrowser.async.requestIdlePromise();

							const tree = filebrowser.browser.querySelector(
								'.jodit-filebrowser__tree'
							);

							const item = tree.querySelectorAll(
								'.jodit-filebrowser__tree-item'
							)[1];
							expect(item.textContent.trim()).equals('free');

							filebrowser.destruct();

							done();
						})
						.catch(function (e) {
							throw e;
						});
				});
			});
		});
	});

	describe('Context menu', function () {
		describe('Right click on image', function () {
			it('Should open context menu', function (done) {
				const editor = getJodit({
					filebrowser: {
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					}
				});

				const filebrowser = editor.filebrowser;

				filebrowser
					.open(function () {})
					.then(function () {
						const files = filebrowser.browser.querySelector(
							'.jodit-filebrowser__files'
						);

						expect(files).is.not.null;

						const item = files.querySelector(
								'.jodit-filebrowser__files-item[data-is-file="1"]'
							),
							pos = Jodit.modules.Helpers.position(item);

						simulateEvent('contextmenu', 0, item, function (o) {
							Object.assign(o, {
								clientX: pos.left + 10,
								clientY: pos.top + 10
							});
						});

						const context = getOpenedPopup(filebrowser);

						expect(context).is.not.null;
						filebrowser.destruct();

						done();
					})
					.catch(function (e) {
						throw e;
					});
			});

			describe('Click on preview', function () {
				it('Should open preview dialog', function (done) {
					unmockPromise();

					const editor = getJodit({
						filebrowser: {
							ajax: {
								url: 'https://xdsoft.net/jodit/connector/index.php'
							}
						}
					});

					const filebrowser = editor.filebrowser;

					filebrowser
						.open()
						.then(function () {
							const files = filebrowser.browser.querySelector(
								'.jodit-filebrowser__files'
							);

							expect(files).is.not.null;

							const item = files.querySelector(
									'.jodit-filebrowser__files-item[data-is-file="0"]'
								),
								pos = Jodit.modules.Helpers.position(item);

							simulateEvent('contextmenu', 0, item, function (o) {
								Object.assign(o, {
									clientX: pos.left + 10,
									clientY: pos.top + 10
								});
							});

							const context = getOpenedPopup(filebrowser);

							expect(context).is.not.null;

							filebrowser.events.on(
								'previewOpenedAndLoaded',
								function () {
									const dialog = getOpenedDialog(filebrowser);

									expect(dialog).is.not.null;
									const previewsButtons =
										dialog.querySelectorAll(
											' .jodit-filebrowser_preview .jodit-filebrowser_preview_navigation.jodit-filebrowser_preview_navigation-prev, ' +
												' .jodit-filebrowser_preview .jodit-filebrowser_preview_navigation.jodit-filebrowser_preview_navigation-next'
										);

									expect(previewsButtons.length).equals(2);
									done();
								}
							);

							clickButton('eye', context);
						})
						.catch(function (e) {
							throw e;
						});
				});
			});
		});
	});
});
