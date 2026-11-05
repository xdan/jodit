/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test uploader module', function () {
	describe('beforeUpload', function () {
		function makeEditor(beforeUpload, prepareData) {
			return getJodit({
				uploader: {
					url: 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload',
					beforeUpload,
					prepareData: prepareData || (form => form)
				}
			});
		}

		it('Should abort the upload when it returns false and hand the handler the reason', async function () {
			const editor = makeEditor(() => false);
			let caught = null;

			try {
				await editor.uploader.upload([FileXLS()]);
			} catch (e) {
				caught = e;
			}

			expect(caught).is.not.null;
			expect(caught.message).equals('Upload canceled');
		});

		it('Should wait for a promise and send the files it resolves with instead of the dropped ones', async function () {
			const sent = [];
			const editor = makeEditor(
				async files => {
					await delay(10);
					return [{ name: 'renamed.xls', type: files[0].type }];
				},
				form => {
					sent.push(form.getName('files[0]'));
					return form;
				}
			);

			const resp = await editor.uploader.upload([FileXLS()]);

			expect(sent).deep.equals(['renamed.xls']);
			expect(resp.files).deep.equals(['renamed.xls']);
		});

		it('Should add the fields of a plan to the request', async function () {
			let onExists = null;
			const editor = makeEditor(
				files => ({ files, data: { onExists: 'replace' } }),
				form => {
					onExists = form.get('onExists');
					return form;
				}
			);

			await editor.uploader.upload([FileXLS()]);

			expect(onExists).equals('replace');
		});

		it('Should send nothing when the plan keeps no file', async function () {
			let requests = 0;
			const editor = makeEditor(
				() => ({ files: [] }),
				form => {
					requests += 1;
					return form;
				}
			);

			const resp = await editor.uploader.upload([FileXLS()]);

			expect(requests).equals(0);
			expect(resp.files).deep.equals([]);
		});

		it('Should route a thrown error through the error handler', async function () {
			const editor = makeEditor(() => {
				throw new Error('Too many files');
			});
			let caught = null;

			try {
				await editor.uploader.upload([FileXLS()]);
			} catch (e) {
				caught = e;
			}

			expect(caught.message).equals('Too many files');
		});
	});

	describe('Name already taken (409)', function () {
		let oldSend, requests;

		// A connector with the `error` strategy: the names in `taken` answer 409, the rest are stored
		function mockConnector(taken) {
			requests = [];
			oldSend = Jodit.modules.Ajax.prototype.send;

			Jodit.modules.Ajax.prototype.send = function () {
				const form = this.options.data;
				const names = [];

				for (let i = 0; form.getName('files[' + i + ']'); i += 1) {
					names.push(form.getName('files[' + i + ']'));
				}

				requests.push({ names, onExists: form.get('onExists') });

				const clash = names.find(
					name =>
						taken.includes(name) &&
						form.get('onExists') !== 'replace'
				);

				return Promise.resolve({
					json: () =>
						Promise.resolve(
							clash
								? {
										success: false,
										data: {
											code: 409,
											messages: [
												'File ' +
													clash +
													' already exists'
											]
										}
									}
								: {
										success: true,
										data: {
											baseurl:
												'https://xdsoft.net/jodit/files/',
											files: names,
											isImages: names.map(() => false),
											code: 220
										}
									}
						)
				});
			};
		}

		afterEach(function () {
			Jodit.modules.Ajax.prototype.send = oldSend;
		});

		function makeEditor(uploader) {
			return getJodit({
				uploader: {
					url: 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload',
					...uploader
				}
			});
		}

		it('Should ask for another name and send the file again under it', async function () {
			mockConnector(['file.xls']);
			const editor = makeEditor({
				promptOnExistsSuggestName: name => 'copy-' + name
			});

			const upload = editor.uploader.upload([FileXLS()]);
			await delay(50);

			const dialog = getOpenedDialog(editor);
			expect(dialog).is.not.null;
			expect(dialog.textContent).contains('File file.xls already exists');

			const input = dialog.querySelector('input');
			expect(input.value).equals('copy-file.xls');

			clickButton('ok', dialog);
			const resp = await upload;

			expect(requests.map(r => r.names)).deep.equals([
				['file.xls'],
				['copy-file.xls']
			]);
			expect(resp.files).deep.equals(['copy-file.xls']);
		});

		it('Should drop the file when the prompt is cancelled', async function () {
			mockConnector(['file.xls']);
			const editor = makeEditor({});

			const upload = editor.uploader.upload([FileXLS()]);
			await delay(50);

			const dialog = getOpenedDialog(editor);
			clickButton('cancel', dialog);
			const resp = await upload;

			expect(requests.length).equals(1);
			expect(resp.files).deep.equals([]);
			expect(getOpenedDialog(editor)).is.null;
		});

		it('Should send a batch again one file at a time, so only the taken name asks', async function () {
			mockConnector(['file.xls']);
			const editor = makeEditor({});

			const upload = editor.uploader.upload([
				FileXLS(),
				{ name: 'free.xls', type: 'application/xls' }
			]);
			await delay(50);

			expect(requests.map(r => r.names)).deep.equals([
				['file.xls', 'free.xls'],
				['file.xls'],
				['free.xls']
			]);

			const dialog = getOpenedDialog(editor);
			dialog.querySelector('input').value = 'other.xls';
			clickButton('ok', dialog);
			await upload;

			expect(requests[3].names).deep.equals(['other.xls']);
		});

		it('Should leave it to the error handler when promptOnExists is off, with the answer, the files and retry', async function () {
			mockConnector(['file.xls']);
			let caught = null;
			const editor = makeEditor({
				promptOnExists: false,
				defaultHandlerError(e) {
					caught = e;
					e.retry({ data: { onExists: 'replace' } });
				}
			});

			editor.value = '<p>test|</p>';
			setCursorToChar(editor);

			simulateEvent('drop', editor.editor, function (data) {
				Object.defineProperty(data, 'dataTransfer', {
					value: { files: [FileXLS()] }
				});
			});
			await delay(50);

			expect(caught.code).equals(409);
			expect(caught.message).equals('File file.xls already exists');
			expect(caught.answer.data.code).equals(409);
			expect(caught.files.map(f => f.name)).deep.equals(['file.xls']);
			expect(requests).deep.equals([
				{ names: ['file.xls'], onExists: undefined },
				{ names: ['file.xls'], onExists: 'replace' }
			]);
			expect(getOpenedDialog(editor)).is.null;
		});

		it('Should not run beforeUpload again on retry', async function () {
			mockConnector(['file.xls']);
			let calls = 0;
			const editor = makeEditor({
				beforeUpload: () => {
					calls += 1;
				}
			});

			const upload = editor.uploader.upload([FileXLS()]);
			await delay(50);
			clickButton('ok', getOpenedDialog(editor));
			await upload;

			expect(calls).equals(1);
			expect(requests.length).equals(2);
		});
	});

	describe('Drop file', function () {
		describe('Drop Image like base64', function () {
			it('Should insert image with SRC in base64', function (done) {
				const file = new FileImage(),
					editor = getJodit({
						imageProcessor: {
							replaceDataURIToBlobIdInView: false
						},
						resizer: {
							forImageChangeAttributes: true
						},
						uploader: {
							insertImageAsBase64URI: true
						},
						events: {
							afterInsertImage: function (img) {
								expect(img.src).equals(file.dataURI);
								expect(sortAttributes(editor.value)).equals(
									'<p>test<img src="' +
										file.dataURI +
										'" width="300"></p>'
								);
								done();
							}
						}
					});

				editor.value = '<p>test|</p>';
				setCursorToChar(editor);

				simulateEvent('drop', editor.editor, function (data) {
					fillXY(data, editor);
					Object.defineProperty(data, 'dataTransfer', {
						value: {
							files: [file]
						}
					});
				});
			});

			describe('Fire filesWereUploaded', function () {
				it('Should fire filesWereUploaded when all images have been read as base64', function (done) {
					const file = new FileImage(),
						editor = getJodit({
							uploader: {
								insertImageAsBase64URI: true
							},
							events: {
								filesWereUploaded: function () {
									done();
								}
							}
						});

					editor.value = '<p>test|</p>';
					setCursorToChar(editor);

					simulateEvent('drop', editor.editor, function (data) {
						fillXY(data, editor);
						Object.defineProperty(data, 'dataTransfer', {
							value: {
								files: [file]
							}
						});
					});
				});
			});

			describe('Drop SVG/BMP/WebP image like base64 (#1228)', function () {
				[
					{
						name: 'logo.svg',
						type: 'image/svg+xml',
						dataURI: 'data:image/svg+xml;base64,PHN2Zy8+'
					},
					{
						name: 'logo.bmp',
						type: 'image/bmp',
						dataURI: 'data:image/bmp;base64,Qk0='
					},
					{
						name: 'logo.webp',
						type: 'image/webp',
						dataURI: 'data:image/webp;base64,UklGRg=='
					}
				].forEach(function (file) {
					it(
						'Should insert ' + file.type + ' image as base64',
						function (done) {
							const editor = getJodit({
								imageProcessor: {
									replaceDataURIToBlobIdInView: false
								},
								uploader: {
									insertImageAsBase64URI: true
								},
								events: {
									afterInsertImage: function (img) {
										expect(img.src).equals(file.dataURI);
										done();
									}
								}
							});

							editor.value = '<p>test|</p>';
							setCursorToChar(editor);

							simulateEvent(
								'drop',
								editor.editor,
								function (data) {
									fillXY(data, editor);
									Object.defineProperty(
										data,
										'dataTransfer',
										{
											value: {
												files: [file]
											}
										}
									);
								}
							);
						}
					);
				});
			});

			describe('File names (#1089)', function () {
				it('Should pass the dropped file name to the success handler', function (done) {
					const file = new FileImage(),
						editor = getJodit({
							uploader: {
								insertImageAsBase64URI: true,
								defaultHandlerSuccess: function (data) {
									try {
										expect(data.files).deep.equals([
											file.dataURI
										]);
										expect(data.fileNames).deep.equals([
											'logo.gif'
										]);
										done();
									} catch (e) {
										done(e);
									}
								}
							}
						});

					editor.value = '<p>test|</p>';
					setCursorToChar(editor);

					simulateEvent('drop', editor.editor, function (data) {
						fillXY(data, editor);
						Object.defineProperty(data, 'dataTransfer', {
							value: {
								files: [file]
							}
						});
					});
				});

				it('Should give each image its own name when the reads finish out of order', function () {
					const files = [
							{
								name: 'first.png',
								type: 'image/png',
								dataURI: 'data:image/png;base64,Zmlyc3Q='
							},
							{
								name: 'second.png',
								type: 'image/png',
								dataURI: 'data:image/png;base64,c2Vjb25k'
							}
						],
						received = [],
						editor = getJodit({
							uploader: {
								insertImageAsBase64URI: true,
								defaultHandlerSuccess: function (data) {
									received.push([
										data.fileNames[0],
										data.files[0]
									]);
								}
							}
						});

					editor.value = '<p>test|</p>';
					setCursorToChar(editor);

					const MockReader = window.FileReader,
						pending = [];

					window.FileReader = function () {
						const self = this;
						self.readAsDataURL = function (file) {
							pending.push(function () {
								self.result = file.dataURI;
								self.onloadend();
							});
						};
					};

					try {
						simulateEvent('drop', editor.editor, function (data) {
							fillXY(data, editor);
							Object.defineProperty(data, 'dataTransfer', {
								value: {
									files: files
								}
							});
						});
					} finally {
						window.FileReader = MockReader;
					}

					pending.reverse().forEach(function (finish) {
						finish();
					});

					expect(received).deep.equals([
						['second.png', 'data:image/png;base64,c2Vjb25k'],
						['first.png', 'data:image/png;base64,Zmlyc3Q=']
					]);
				});
			});
		});

		describe('Drop Image and upload on server', function () {
			it('Should upload file and insert image with SRC from server', function (done) {
				const file = new FileImage(),
					editor = getJodit({
						history: {
							timeout: 0
						},
						uploader: {
							url: 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload'
						},
						events: {
							afterInsertImage: function (img) {
								try {
									expect(img.src).equals(
										'https://xdsoft.net/jodit/files/logo.gif'
									);

									expect(sortAttributes(editor.value)).equals(
										'<p>test<img src="https://xdsoft.net/jodit/files/logo.gif" width="300"></p>'
									);

									done();
								} catch (e) {
									done(e);
								}
							}
						}
					});

				editor.value = '<p>test|</p>';
				setCursorToChar(editor);

				simulateEvent('drop', editor.editor, function (data) {
					Object.defineProperty(data, 'dataTransfer', {
						value: {
							files: [file]
						}
					});
				});
			});

			describe('Change filename', () => {
				it('Should upload file with different filename', function (done) {
					const file = new FileImage(),
						editor = getJodit({
							uploader: {
								url: 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload',
								processFileName: (key, file, name) => {
									return [key, file, 'test_' + name];
								}
							},
							events: {
								afterInsertImage: img => {
									try {
										expect(img.src).equals(
											'https://xdsoft.net/jodit/files/test_logo.gif'
										);

										expect(
											sortAttributes(editor.value)
										).equals(
											// Because afterInsertImage called before resizer handler we use attribute width
											'<p>test<img src="https://xdsoft.net/jodit/files/test_logo.gif" width="300"></p>'
										);

										done();
									} catch (e) {
										done(e);
									}
								}
							}
						});

					editor.value = '<p>test|</p>';
					setCursorToChar(editor);

					simulateEvent('drop', editor.editor, function (data) {
						Object.defineProperty(data, 'dataTransfer', {
							value: {
								files: [file]
							}
						});
					});
				});
			});

			describe('For iframe mode', function () {
				it('Should upload file and insert image with SRC from server', function (done) {
					let isFinished = false;

					const timer = /*ok*/ setTimeout(function () {
						if (!isFinished) {
							isFinished = true;
							done('Timeout error');
						}
					}, 4000);

					const file = new FileImage(),
						editor = getJodit({
							iframe: true,
							history: {
								timeout: 0
							},
							resizer: {
								forImageChangeAttributes: true
							},
							uploader: {
								url: 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload'
							},
							events: {
								afterInsertImage: function (img) {
									if (isFinished) {
										return;
									}

									try {
										isFinished = true;

										clearTimeout(timer);

										expect(img.src).equals(
											'https://xdsoft.net/jodit/files/logo.gif'
										);
										expect(
											sortAttributes(editor.value)
										).equals(
											'<p>test<img src="https://xdsoft.net/jodit/files/logo.gif" width="300"></p>'
										);
										done();
									} catch (e) {
										done(e);
									}
								}
							}
						});

					editor.value = '<p>test|</p>';
					setCursorToChar(editor);

					editor.async.setTimeout(function () {
						simulateEvent(
							'drop',

							editor.editor,
							function (data) {
								Object.defineProperty(data, 'dataTransfer', {
									value: {
										files: [file]
									}
								});
							}
						);
					}, 300);
				});
			});
		});

		describe('Drop File and upload on server', function () {
			it('Should upload file and insert A element with HREF to file on server', function (done) {
				const file = new FileXLS(),
					editor = getJodit({
						history: {
							timeout: 0
						},
						uploader: {
							url: 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload'
						},
						events: {
							afterInsertNode: function (node) {
								try {
									expect(node.href).equals(
										'https://xdsoft.net/jodit/files/file.xls'
									);
									expect(editor.value).equals(
										'<p>test<a href="https://xdsoft.net/jodit/files/file.xls">https://xdsoft.net/jodit/files/file.xls</a></p>'
									);
									done();
								} catch (e) {
									done(e);
								}
							}
						}
					});

				editor.value = '<p>test|</p>';
				setCursorToChar(editor);

				simulateEvent('drop', editor.editor, function (data) {
					Object.defineProperty(data, 'dataTransfer', {
						value: {
							files: [file]
						}
					});
				});
			});

			describe('Change filename', () => {
				it('Should upload file and insert A element changed displayed name', done => {
					const file = new FileXLS(),
						editor = getJodit({
							history: {
								timeout: 0
							},
							uploader: {
								url: 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload',
								getDisplayName: (_, name) => 'File:' + name
							},
							events: {
								afterInsertNode: node => {
									try {
										expect(editor.value).equals(
											'<p>test<a href="https://xdsoft.net/jodit/files/file.xls">File:file.xls</a></p>'
										);
										done();
									} catch (e) {
										done(e);
									}
								}
							}
						});

					editor.value = '<p>test|</p>';
					setCursorToChar(editor);

					simulateEvent('drop', editor.editor, function (data) {
						Object.defineProperty(data, 'dataTransfer', {
							value: {
								files: [file]
							}
						});
					});
				});
			});

			describe('Drop with insertImageAsBase64URI=true', function () {
				it('Should upload file and insert A element with HREF to file on server', function (done) {
					const file = new FileXLS(),
						editor = getJodit({
							history: {
								timeout: 0
							},
							uploader: {
								url: 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload',
								insertImageAsBase64URI: true
							},
							events: {
								afterInsertNode: function (node) {
									try {
										expect(node.href).equals(
											'https://xdsoft.net/jodit/files/file.xls'
										);
										expect(editor.value).equals(
											'<p>test<a href="https://xdsoft.net/jodit/files/file.xls">https://xdsoft.net/jodit/files/file.xls</a></p>'
										);
										done();
									} catch (e) {
										done(e);
									}
								}
							}
						});

					editor.value = '<p>test|</p>';
					setCursorToChar(editor);

					simulateEvent('drop', 0, editor.editor, function (data) {
						Object.defineProperty(data, 'dataTransfer', {
							value: {
								files: [file]
							}
						});
					});
				});
			});
		});
	});
});
