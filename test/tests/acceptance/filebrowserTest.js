describe('Jodit FileBrowser Tests', function() {
	describe('Constructor/Destructor', function() {
		describe('Without Jodit', function() {
			it('Should create dialog and load files', function() {
				const filebrowser = new Jodit.modules.FileBrowser(null, {
					ajax: {
						url: 'https://xdsoft.net/jodit/connector/index.php'
					}
				});

				filebrowser.open(function() {});

				expect(
					document.querySelectorAll('.jodit_dialog_box.active').length
				).equals(1);

				filebrowser.close();

				expect(
					document.querySelectorAll('.jodit_dialog_box.active').length
				).equals(0);

				filebrowser.destruct();
			});
		});

		it('Should create dialog and load files', function() {
			const editor = new Jodit(appendTestArea(), {
				filebrowser: {
					ajax: {
						url: 'https://xdsoft.net/jodit/connector/index.php'
					}
				}
			});

			const filebrowser = new Jodit.modules.FileBrowser(editor);
			filebrowser.open(function() {});

			expect(
				editor.ownerDocument.querySelectorAll(
					'.jodit_dialog_box.active[data-editor_id=' + editor.id + ']'
				).length
			).equals(1);

			filebrowser.destruct();
		});

		it('Should add filebrowser icon in image buttons popup', function() {
			const editor = new Jodit(appendTestArea(), {
				filebrowser: {
					ajax: {
						url: 'https://xdsoft.net/jodit/connector/index.php'
					}
				}
			});

			simulateEvent(
				'mousedown',
				0,
				editor.container.querySelector(
					'.jodit_toolbar_btn.jodit_toolbar_btn-image'
				)
			);

			expect(
				editor.container
					.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-image .jodit_tabs_buttons .active'
					)
					.textContent.trim()
			).equals('Browse');
		});

		it('Should add uploader icon in image buttons popup', function() {
			const editor = new Jodit(appendTestArea(), {
				uploader: {
					url:
						'https://xdsoft.net/jodit/connector/index.php?action=upload'
				},
				filebrowser: {
					ajax: {
						url: 'https://xdsoft.net/jodit/connector/index.php'
					}
				}
			});

			simulateEvent(
				'mousedown',
				0,
				editor.container.querySelector(
					'.jodit_toolbar_btn.jodit_toolbar_btn-image'
				)
			);

			expect(
				editor.container.querySelector(
					'.jodit_toolbar_btn.jodit_toolbar_btn-image .jodit_tabs_buttons .active'
				).textContent
			).equals('Upload');
		});
	});

	describe('Change Ajax options', function() {
		describe('Use GET method instead POST', function() {
			it('Should add params into url instead body', function(done) {
				const filebrowser = new Jodit.modules.FileBrowser(null, {
					ajax: {
						url: 'https://xdsoft.net/jodit/connector/index.php',
						method: 'GET'
					}
				});

				filebrowser
					.open(function() {})
					.then(function() {
						Jodit.modules.Ajax.log.forEach(function(req) {
							expect(req.url).to.be.match(/\?action/);
						});

						filebrowser.destruct();
						done();
					})
					.catch(function(e) {
						throw e;
					});
			});
		});

		describe('Use POST method', function() {
			it('Should add params only into body', function(done) {
				const filebrowser = new Jodit.modules.FileBrowser(null, {
					ajax: {
						url: 'https://xdsoft.net/jodit/connector/index.php',
						method: 'POST'
					}
				});

				filebrowser
					.open(function() {})
					.then(function() {
						Jodit.modules.Ajax.log.forEach(function(req) {
							expect(req.url).equals(
								'https://xdsoft.net/jodit/connector/index.php'
							);
						});

						filebrowser.destruct();
						done();
					})
					.catch(function(e) {
						throw e;
					});
			});
		});
	});

	describe('Toolbar', function() {
		describe('Without Jodit', function() {
			it('Should create filebrowser and show standart toolbar', function(done) {
				const filebrowser = new Jodit.modules.FileBrowser(null, {
					ajax: {
						url: 'https://xdsoft.net/jodit/connector/index.php'
					}
				});

				filebrowser
					.open(function() {})
					.then(function() {
						expect(
							filebrowser.dialog.dialogbox_header.querySelectorAll(
								'.jodit_toolbar_btn'
							).length
						).equals(12);

						filebrowser.close();
						filebrowser.destruct();
						done();
					})
					.catch(function(e) {
						throw e;
					});
			});
		});
		describe('Disable buttons', function() {
			describe('Edit button', function() {
				it('Should be disable while not selected some image', function(done) {
					const filebrowser = new Jodit.modules.FileBrowser(null, {
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					});

					filebrowser
						.open(function() {})
						.then(function() {
							const edit = filebrowser.dialog.dialogbox_header.querySelector(
								'.jodit_toolbar_btn-edit'
							);
							expect(edit).is.not.null;
							expect(
								edit.classList.contains('jodit_disabled')
							).is.true;

							simulateEvent(
								'click',
								0,
								filebrowser.browser.querySelector(
									'.jodit_filebrowser_files_item[data-is-file="0"]'
								)
							);

							expect(
								edit.classList.contains('jodit_disabled')
							).is.false;

							filebrowser.close();
							filebrowser.destruct();

							done();
						})
						.catch(function(e) {
							throw e;
						});
				});

				it('Should be disabled if selected more then 1 image or some file', function(done) {
					const filebrowser = new Jodit.modules.FileBrowser(null, {
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					});

					filebrowser
						.open(function() {})
						.then(function() {
							const edit = filebrowser.dialog.dialogbox_header.querySelector(
								'.jodit_toolbar_btn-edit'
							);

							expect(edit).is.not.null;
							expect(
								edit.classList.contains('jodit_disabled')
							).is.true;

							expect(
								edit.classList.contains('jodit_disabled')
							).is.true;

							simulateEvent(
								'click',
								0,
								filebrowser.browser.querySelectorAll(
									'.jodit_filebrowser_files_item[data-is-file="0"]'
								)[0]
							);

							expect(
								edit.classList.contains('jodit_disabled')
							).is.false;

							simulateEvent(
								'click',
								0,
								filebrowser.browser.querySelectorAll(
									'.jodit_filebrowser_files_item[data-is-file="0"]'
								)[1],
								function(data) {
									data[
										!navigator.userAgent.indexOf('Mac OS X')
											? 'ctrlKey'
											: 'metaKey'
										] = true;
								}
							);

							expect(
								edit.classList.contains('jodit_disabled')
							).is.true;

							filebrowser.close();
							filebrowser.destruct();

							done();
						})
						.catch(function(e) {
							throw e;
						});
				});

				describe('Allow all buttons if permission handle is not set', function() {
					describe('If deny remove action', function(done) {
						it('Should not use permission hash and canI method', function(done) {
							defaultPermissions.permissions.allowFileRemove = false;

							const filebrowser = new Jodit.modules.FileBrowser(
								null,
								{
									ajax: {
										url:
											'https://xdsoft.net/jodit/connector/index.php'
									}
								}
							);

							filebrowser
								.open(function() {})
								.then(function() {
									const remove = filebrowser.dialog.dialogbox_header.querySelector(
										'.jodit_toolbar_btn-remove'
									);
									expect(remove).is.not.null;
									expect(
										remove.classList.contains(
											'jodit_disabled'
										)
									).is.true;

									simulateEvent(
										'click',
										0,
										filebrowser.browser.querySelector(
											'.jodit_filebrowser_files_item[data-is-file="0"]'
										)
									);

									expect(
										remove.classList.contains(
											'jodit_disabled'
										)
									).is.true;

									filebrowser.close();
									filebrowser.destruct();

									done();
								})
								.catch(function(e) {
									throw e;
								});
						});
					});
					describe('If not set permission api option', function(done) {
						it('Should not use permission hash and canI method', function(done) {
							defaultPermissions.permissions.allowFileRemove = false;

							const filebrowser = new Jodit.modules.FileBrowser(
								null,
								{
									ajax: {
										url:
											'https://xdsoft.net/jodit/connector/index.php'
									},
									permissions: null
								}
							);

							filebrowser
								.open(function() {})
								.then(function() {
									const remove = filebrowser.dialog.dialogbox_header.querySelector(
										'.jodit_toolbar_btn-remove'
									);
									expect(remove).is.not.null;
									expect(
										remove.classList.contains(
											'jodit_disabled'
										)
									).is.true;

									simulateEvent(
										'click',
										0,
										filebrowser.browser.querySelector(
											'.jodit_filebrowser_files_item[data-is-file="0"]'
										)
									);

									expect(
										remove.classList.contains(
											'jodit_disabled'
										)
									).is.false;

									filebrowser.close();
									filebrowser.destruct();

									done();
								})
								.catch(function(e) {
									throw e;
								});
						});
					});
				});
			});
		});

		describe('View', function() {
			it('Should show filebrowser in default view', function(done) {
				const filebrowser = new Jodit.modules.FileBrowser(null, {
					view: 'tiles',
					ajax: {
						url: 'https://xdsoft.net/jodit/connector/index.php'
					}
				});

				filebrowser
					.open(function() {})
					.then(function() {
						const tiles = filebrowser.dialog.dialogbox_header.querySelector(
							'.jodit_toolbar_btn-tiles'
						);
						const list = filebrowser.dialog.dialogbox_header.querySelector(
							'.jodit_toolbar_btn-list'
						);
						const files = filebrowser.browser.querySelector(
							'.jodit_filebrowser_files'
						);

						expect(files).is.not.null;
						expect(
							files.classList.contains(
								'jodit_filebrowser_files_view-tiles'
							)
						).is.true;
						expect(
							tiles.classList.contains('jodit_active')
						).is.true;
						expect(
							list.classList.contains('jodit_active')
						).is.false;

						filebrowser.close();
						filebrowser.destruct();

						done();
					})
					.catch(function(e) {
						throw e;
					});
			});

			describe('Change view', function() {
				it('Should change filebrowser view', function(done) {
					const filebrowser = new Jodit.modules.FileBrowser(null, {
						view: 'tiles',
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					});

					filebrowser
						.open(function() {})
						.then(function() {
							const tiles = filebrowser.dialog.dialogbox_header.querySelector(
								'.jodit_toolbar_btn-tiles'
							);
							const list = filebrowser.dialog.dialogbox_header.querySelector(
								'.jodit_toolbar_btn-list'
							);
							const files = filebrowser.browser.querySelector(
								'.jodit_filebrowser_files'
							);
							expect(files).is.not.null;
							expect(
								files.classList.contains(
									'jodit_filebrowser_files_view-tiles'
								)
							).is.true;
							expect(
								tiles.classList.contains('jodit_active')
							).is.true;
							expect(
								list.classList.contains('jodit_active')
							).is.false;

							simulateEvent('mousedown', 0, list);

							expect(
								files.classList.contains(
									'jodit_filebrowser_files_view-tiles'
								)
							).is.false;
							expect(
								files.classList.contains(
									'jodit_filebrowser_files_view-list'
								)
							).is.true;
							expect(
								tiles.classList.contains('jodit_active')
							).is.false;
							expect(
								list.classList.contains('jodit_active')
							).is.true;

							filebrowser.close();
							filebrowser.destruct();

							done();
						})
						.catch(function(e) {
							throw e;
						});
				});
			});
		});

		describe('Filter', function() {
			it('Should show only filterd items', function(done) {
				const filebrowser = new Jodit.modules.FileBrowser(null, {
					ajax: {
						url: 'https://xdsoft.net/jodit/connector/index.php'
					}
				});

				filebrowser
					.open(function() {})
					.then(function() {
						const filter = filebrowser.dialog.dialogbox_header.querySelector(
							'.jodit_toolbar_btn-filter'
						);
						const input = filter.querySelector('input');
						const files = filebrowser.browser.querySelector(
							'.jodit_filebrowser_files'
						);

						expect(files).is.not.null;
						expect(filter).is.not.null;
						expect(input).is.not.null;

						const count = files.querySelectorAll(
							'.jodit_filebrowser_files_item'
						).length;
						input.value = 'i';
						simulateEvent('keydown', 0, input);

						expect(
							files.querySelectorAll(
								'.jodit_filebrowser_files_item'
							).length
						).does.not.equal(count);

						input.value = '';
						simulateEvent('keydown', 0, input);
						expect(
							files.querySelectorAll(
								'.jodit_filebrowser_files_item'
							).length
						).equals(count);

						filebrowser.close();
						filebrowser.destruct();

						done();
					})
					.catch(function(e) {
						throw e;
					});
			});
		});

		describe('Sort', function() {
			it('Should sort elements by filter select', function(done) {
				const filebrowser = new Jodit.modules.FileBrowser(null, {
					ajax: {
						url: 'https://xdsoft.net/jodit/connector/index.php'
					}
				});

				filebrowser
					.open(function() {})
					.then(function() {
						const sort = filebrowser.dialog.dialogbox_header.querySelector(
							'.jodit_toolbar_btn-sort'
						);
						const select = sort.querySelector('select');
						const files = filebrowser.browser.querySelector(
							'.jodit_filebrowser_files'
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

							const items = files.querySelectorAll(
								'.jodit_filebrowser_files_item'
							);

							expect(
								Array.from(items)
									.map(function(item) {
										return item.querySelector(
											'.jodit_filebrowser_files_item-info-filename'
										).textContent;
									})
									.join(',')
							).equals(pars[key].join(','));
						}

						filebrowser.close();
						filebrowser.destruct();

						done();
					})
					.catch(function(e) {
						throw e;
					});
			});
		});

		describe('Select button', function() {
			it('Should fire first callback in open method', function(done) {
				const filebrowser = new Jodit.modules.FileBrowser(null, {
					filebrowser: {
						saveStateInStorage: false
					},
					ajax: {
						url: 'https://xdsoft.net/jodit/connector/index.php'
					}
				});

				filebrowser
					.open(function(data) {
						expect(data !== undefined).is.true;
						expect(data.files !== undefined).is.true;
						expect(data.files.length).equals(1);
						expect(data.files[0]).equals(
							'https://xdsoft.net/jodit/files/test.txt'
						);

						filebrowser.close();
						filebrowser.destruct();

						done();
					})
					.then(function() {
						const select = filebrowser.dialog.dialogbox_header.querySelector(
							'.jodit_toolbar_btn-select'
						);
						const files = filebrowser.browser.querySelector(
							'.jodit_filebrowser_files'
						);

						expect(files).is.not.null;
						expect(select).is.not.null;

						expect(
							select.classList.contains('jodit_disabled')
						).is.true;

						simulateEvent(
							'click',
							0,
							filebrowser.browser.querySelector(
								'.jodit_filebrowser_files_item'
							)
						);

						expect(
							select.classList.contains('jodit_disabled')
						).is.false;

						simulateEvent('mousedown', 0, select);
					})
					.catch(function(e) {
						throw e;
					});
			});
		});
	});

	describe('Test drag and drop', function() {
		describe('Drag and drop image from filebrowser', function() {
			it('Should create IMG element in editor', function(done) {
				const editor = new Jodit(appendTestArea(), {
					filebrowser: {
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					}
				});

				const filebrowser = editor.getInstance('FileBrowser');

				filebrowser
					.open(function() {})
					.then(function() {
						if (editor.isInDestruct) {
							debugger
						}
						const files = filebrowser.browser.querySelector(
							'.jodit_filebrowser_files'
						);

						expect(files).is.not.null;

						simulateEvent(
							'dragstart',
							0,
							files.querySelector(
								'.jodit_filebrowser_files_item img[data-src="https://xdsoft.net/jodit/files/images.jpg"]'
							)
						);

						simulateEvent('dragover', 0, window, function(data) {
							data.clientX = 50;
							data.clientY = 20 + offset(editor.editor).top;
						});

						const image = editor.ownerDocument.querySelector(
							'img[data-src="https://xdsoft.net/jodit/files/images.jpg"][alt="images.jpg"][style*="fixed"]'
						);

						expect(image).is.not.null;
						expect(image.style.position).equals('fixed');

						simulateEvent('drop', 0, editor.editor, function(data) {
							Object.defineProperty(data, 'dataTransfer', {
								value: {
									files: []
								}
							});
						});

						expect(editor.value).equals(
							'<img src="https://xdsoft.net/jodit/files/images.jpg">'
						);

						expect(image.parentNode).is.not.null;
						simulateEvent('drop', 0, window);
						expect(image.parentNode).is.null;

						filebrowser.destruct();

						done();
					})
					.catch(function(e) {
						throw e;
					});
			});
		});

		describe('Drag and drop File from filebrowser', function() {
			it('Should create A element in editor', function(done) {
				const editor = new Jodit(appendTestArea(), {
					filebrowser: {
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					}
				});

				const filebrowser = editor.getInstance('FileBrowser');

				filebrowser
					.open(function() {})
					.then(function() {
						const files = filebrowser.browser.querySelector(
							'.jodit_filebrowser_files'
						);

						expect(files).is.not.null;

						simulateEvent(
							'dragstart',
							0,
							files.querySelector(
								'.jodit_filebrowser_files_item[data-is-file="1"] img'
							)
						);

						simulateEvent('dragover', 0, window, function(data) {
							data.clientX = 50;
							data.clientY = 20 + offset(editor.editor).top;
						});

						const image = editor.ownerDocument.querySelector(
							'img[data-src="https://xdsoft.net/jodit/files/test.txt"][alt="test.txt"][style*="fixed"]'
						);
						expect(image).is.not.null;
						expect(image.style.position).equals('fixed');

						simulateEvent('drop', 0, editor.editor, function(data) {
							Object.defineProperty(data, 'dataTransfer', {
								value: {
									files: []
								}
							});
						});

						expect(editor.value).equals(
							'<a href="https://xdsoft.net/jodit/files/test.txt">https://xdsoft.net/jodit/files/test.txt</a>'
						);
						expect(image.parentNode).is.not.null;
						simulateEvent('drop', 0, window);
						expect(image.parentNode).is.null;

						filebrowser.destruct();
						done();
					})
					.catch(function(e) {
						throw e;
					});
			});
		});
	});

	describe('DblClick', function() {
		describe('DblClick on image from filebrowser', function() {
			it('Should insert IMG element in editor in the selected before place', function(done) {
				const editor = new Jodit(appendTestArea(), {
					filebrowser: {
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					}
				});

				editor.value =
					'<p>Some text</p><p>Another text</p><p>Another some text</p>';
				const range = editor.selection.createRange();
				range.setStart(
					editor.editor.querySelectorAll('p')[1].firstChild,
					7
				);

				range.collapse(true);
				editor.selection.selectRange(range);

				const filebrowser = editor.getInstance('FileBrowser');

				filebrowser
					.open()
					.then(function() {
						const files = filebrowser.browser.querySelector(
							'.jodit_filebrowser_files'
						);

						expect(files).is.not.null;

						simulateEvent(
							['click', 'dblclick'],
							0,
							files.querySelector(
								'a[data-is-file="0"].jodit_filebrowser_files_item'
							)
						);

						expect(editor.value).equals(
							'<p>Some text</p><p>Another<img src="https://xdsoft.net/jodit/files/ibanez-s520-443140.jpg" style="width: 300px;"> text</p><p>Another some text</p>'
						);

						filebrowser.destruct();
						done();
					})
					.catch(function(e) {
						throw e;
					});
			});
		});

		describe('DblClick on File from filebrowser', function() {
			it('Should insert A element in editor in the selected before place', function(done) {
				const editor = new Jodit(appendTestArea(), {
					filebrowser: {
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					}
				});

				editor.value =
					'<p>Some text</p><p>Another text</p><p>Another some text</p>';
				const range = editor.selection.createRange();
				range.setStart(
					editor.editor.querySelectorAll('p')[1].firstChild,
					7
				);
				range.collapse(true);
				editor.selection.selectRange(range);

				const filebrowser = editor.getInstance('FileBrowser');

				filebrowser
					.open()
					.then(function() {
						const files = filebrowser.browser.querySelector(
							'.jodit_filebrowser_files'
						);

						expect(files).is.not.null;

						simulateEvent(
							['click', 'dblclick'],
							0,
							files.querySelector(
								'a[data-is-file="1"].jodit_filebrowser_files_item'
							)
						);

						expect(editor.value).equals(
							'<p>Some text</p><p>Another<a href="https://xdsoft.net/jodit/files/test.txt" title="https://xdsoft.net/jodit/files/test.txt">https://xdsoft.net/jodit/files/test.txt</a> text</p><p>Another some text</p>'
						);

						filebrowser.destruct();
						done();
					})
					.catch(function(e) {
						throw e;
					});
			});
		});
	});

	describe('Uploader', function() {
		describe('Drag and drop', function() {
			describe('Image', function(done) {
				it('Should create IMG element', function(done) {
					const editor = new Jodit(appendTestArea(), {
						uploader: {
							url:
								'https://xdsoft.net/jodit/connector/index.php?action=fileUpload'
						},
						filebrowser: {
							ajax: {
								url:
									'https://xdsoft.net/jodit/connector/index.php'
							}
						}
					});

					editor.value = '';

					editor.events.on('filesWereUploaded', function() {
						expect(sortAttributes(editor.value)).equals(
							'<img src="https://xdsoft.net/jodit/files/test.png" style="width:300px">'
						);
						done();
					});

					simulateEvent('drop', 0, editor.editor, function(data) {
						Object.defineProperty(data, 'dataTransfer', {
							value: {
								files: [{ name: 'test.png', type: 'image/png' }]
							}
						});
					});
				});
			});

			describe('File', function(done) {
				it('Should create A element', function(done) {
					const editor = new Jodit(appendTestArea(), {
						uploader: {
							url:
								'https://xdsoft.net/jodit/connector/index.php?action=fileUpload'
						},
						filebrowser: {
							ajax: {
								url:
									'https://xdsoft.net/jodit/connector/index.php'
							}
						}
					});

					editor.value = '';

					editor.events.on('filesWereUploaded', function() {
						expect(editor.value).equals(
							'<a href="https://xdsoft.net/jodit/files/test.txt">https://xdsoft.net/jodit/files/test.txt</a>'
						);
						done();
					});

					simulateEvent('drop', 0, editor.editor, function(data) {
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

	describe('Rename', function() {
		describe('Folder', function() {
			it('Should create button inside every folder of list', function(done) {
				const editor = new Jodit(appendTestArea(), {
					filebrowser: {
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					}
				});

				const filebrowser = editor.getInstance('FileBrowser');

				filebrowser
					.open(function() {})
					.then(function() {
						const tree = filebrowser.browser.querySelector(
							'.jodit_filebrowser_tree'
						);

						expect(tree).is.not.null;

						const item = tree.querySelector(
							'.jodit_filebrowser_tree_item'
						);

						expect(item).is.not.null;

						const trigger = tree.querySelector(
							'.jodit_icon_folder_rename'
						);

						expect(trigger).is.not.null;
						filebrowser.destruct();

						done();
					})
					.catch(function(e) {
						throw e;
					});
			});
		});
	});

	describe('Context menu', function() {
		describe('Right click on image', function() {
			it('Should open context menu', function(done) {
				const editor = new Jodit(appendTestArea(), {
					filebrowser: {
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					}
				});

				const filebrowser = editor.getInstance('FileBrowser');

				filebrowser
					.open(function() {})
					.then(function() {
						const files = filebrowser.browser.querySelector(
							'.jodit_filebrowser_files'
						);

						expect(files).is.not.null;

						simulateEvent(
							'contextmenu',
							0,
							files.querySelector(
								'.jodit_filebrowser_files_item[data-is-file="1"]'
							)
						);

						const context = document.body.querySelector(
							'[data-editor_id="' +
							editor.id +
							'"].jodit_context_menu.jodit_context_menu-show'
						);

						expect(context).is.not.null;
						filebrowser.destruct();

						done();
					})
					.catch(function(e) {
						throw e;
					});
			});

			describe('Click on preview', function() {
				it('Should open preview dialog', function(done) {
					unmockPromise();

					const editor = new Jodit(appendTestArea(), {
						filebrowser: {
							ajax: {
								url:
									'https://xdsoft.net/jodit/connector/index.php'
							}
						}
					});

					const filebrowser = editor.getInstance('FileBrowser');

					filebrowser
						.open(function() {})
						.then(function() {
							const files = filebrowser.browser.querySelector(
								'.jodit_filebrowser_files'
							);

							expect(files).is.not.null;

							simulateEvent(
								'contextmenu',
								0,
								files.querySelector(
									'.jodit_filebrowser_files_item[data-is-file="0"]'
								)
							);

							const context = document.body.querySelector(
								'[data-editor_id="' +
								editor.id +
								'"].jodit_context_menu.jodit_context_menu-show'
							);

							expect(context).is.not.null;

							editor.events.on(
								'previewOpenedAndLoaded',
								function() {
									const dlgSel = '[data-editor_id="' + editor.id + '"].jodit.jodit_dialog_box.jodit_filebrowser_preview_dialog.active ';

									const dialog = editor.ownerDocument.querySelector(dlgSel);

									expect(dialog).is.not.null;

									const previewsButtons = dialog.querySelectorAll(
										' .jodit_filebrowser_preview .jodit_filebrowser_preview_navigation.jodit_filebrowser_preview_navigation-prev, ' +
										' .jodit_filebrowser_preview .jodit_filebrowser_preview_navigation.jodit_filebrowser_preview_navigation-next'
									);

									expect(previewsButtons.length).equals(2);
									filebrowser.destruct();

									done();
								}
							);

							simulateEvent(
								'mousedown',
								0,
								context.querySelector('a[data-icon="eye"]')
							);
						})
						.catch(function(e) {
							throw e;
						});
				});
			});
		});
	});
});
