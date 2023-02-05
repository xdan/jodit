/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test uploader module', function () {
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
										'" width="300px"></p>'
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
										'<p>test<img src="https://xdsoft.net/jodit/files/logo.gif" style="width:300px"></p>'
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
								afterInsertImage: function (img) {
									try {
										expect(img.src).equals(
											'https://xdsoft.net/jodit/files/test_logo.gif'
										);

										expect(
											sortAttributes(editor.value)
										).equals(
											'<p>test<img src="https://xdsoft.net/jodit/files/test_logo.gif" style="width:300px"></p>'
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
					const timer = setTimeout(function () {
						done('Timeout error');
					}, 4000);

					const file = new FileImage(),
						editor = getJodit({
							iframe: true,
							history: {
								timeout: 0
							},
							uploader: {
								url: 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload'
							},
							events: {
								afterInsertImage: function (img) {
									try {
										clearTimeout(timer);

										expect(img.src).equals(
											'https://xdsoft.net/jodit/files/logo.gif'
										);
										expect(
											sortAttributes(editor.value)
										).equals(
											'<p>test<img src="https://xdsoft.net/jodit/files/logo.gif" style="width:300px"></p>'
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

					setTimeout(function () {
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
