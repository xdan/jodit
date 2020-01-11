describe('Test uploader module', function() {
	describe('Drop file', function() {
		describe('Drop Image like base64', function() {
			it('Should insert image with SRC in base64', function(done) {
				const file = new FileImage(),
					editor = new Jodit(appendTestArea(), {
						uploader: {
							insertImageAsBase64URI: true
						},
						events: {
							afterInsertImage: function(img) {
								expect(img.src).equals(file.dataURI);
								expect(sortAttributes(editor.value)).equals('<img src="' + file.dataURI + '" style="width:300px">');
								done();
							}
						}
					});

				simulateEvent('drop', 0, editor.editor, function(data) {
					Object.defineProperty(data, 'dataTransfer', {
						value: {
							files: [file]
						}
					});
				});
			});
		});

		describe('Drop Image and upload on server', function() {
			it('Should upload file and insert image with SRC from server', function(done) {
				const file = new FileImage(),
					editor = new Jodit(appendTestArea(), {
						observer: {
							timeout: 0
						},
						uploader: {
							url:
								'https://xdsoft.net/jodit/connector/index.php?action=fileUpload'
						},
						events: {
							afterInsertImage: function(img) {
								expect(img.src).equals('https://xdsoft.net/jodit/files/logo.gif');

								expect(sortAttributes(editor.value))
									.equals('<img src="https://xdsoft.net/jodit/files/logo.gif" style="width:300px">');

								done();
							}
						}
					});

				simulateEvent('drop', 0, editor.editor, function(data) {
					Object.defineProperty(data, 'dataTransfer', {
						value: {
							files: [file]
						}
					});
				});
			});

			describe('For iframe mode', function() {
				it('Should upload file and insert image with SRC from server', function(done) {
					const timer = setTimeout(function () {
						expect(true).is.false;
					}, 4000)

					const file = new FileImage(),
						editor = new Jodit(appendTestArea(), {
							iframe: true,
							observer: {
								timeout: 0
							},
							uploader: {
								url:
									'https://xdsoft.net/jodit/connector/index.php?action=fileUpload'
							},
							events: {
								afterInsertImage: function(img) {
									clearTimeout(timer);

									expect(img.src).equals(
										'https://xdsoft.net/jodit/files/logo.gif'
									);
									expect(
										sortAttributes(editor.value)
									).equals(
										'<img src="https://xdsoft.net/jodit/files/logo.gif" style="width:300px">'
									);
									done();
								}
							}
						});

					setTimeout(function() {
						simulateEvent('drop', 0, editor.editor, function(data) {
							Object.defineProperty(data, 'dataTransfer', {
								value: {
									files: [file]
								}
							});
						});
					}, 300);
				});
			});
		});

		describe('Drop File and upload on server', function() {
			it('Should upload file and insert A element with HREF to file on server', function(done) {
				const file = new FileXLS(),
					editor = new Jodit(appendTestArea(), {
						observer: {
							timeout: 0
						},
						uploader: {
							url:
								'https://xdsoft.net/jodit/connector/index.php?action=fileUpload'
						},
						events: {
							afterInsertNode: function(node) {
								expect(node.href).equals(
									'https://xdsoft.net/jodit/files/file.xls'
								);
								expect(editor.value).equals(
									'<a href="https://xdsoft.net/jodit/files/file.xls">https://xdsoft.net/jodit/files/file.xls</a>'
								);
								done();
							}
						}
					});

				simulateEvent('drop', 0, editor.editor, function(data) {
					Object.defineProperty(data, 'dataTransfer', {
						value: {
							files: [file]
						}
					});
				});
			});

			describe('Drop with insertImageAsBase64URI=true', function() {
				it('Should upload file and insert A element with HREF to file on server', function(done) {
					const file = new FileXLS(),
						editor = new Jodit(appendTestArea(), {
							observer: {
								timeout: 0
							},
							uploader: {
								url:
									'https://xdsoft.net/jodit/connector/index.php?action=fileUpload',
								insertImageAsBase64URI: true
							},
							events: {
								afterInsertNode: function(node) {
									expect(node.href).equals(
										'https://xdsoft.net/jodit/files/file.xls'
									);
									expect(editor.value).equals(
										'<a href="https://xdsoft.net/jodit/files/file.xls">https://xdsoft.net/jodit/files/file.xls</a>'
									);
									done();
								}
							}
						});

					simulateEvent('drop', 0, editor.editor, function(data) {
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

	afterEach(removeStuff);
});
