/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('File plugin', function () {
	describe('Upload tab', function () {
		function dropInFilePopup(editor, file) {
			clickButton('file', editor);

			simulateEvent(
				'drop',
				getOpenedPopup(editor).querySelector(
					'.jodit-drag-and-drop__file-box'
				),
				function (data) {
					Object.defineProperty(data, 'dataTransfer', {
						value: {
							files: [file]
						}
					});
				}
			);
		}

		// https://github.com/xdan/jodit/issues/1523
		it('Should insert an uploaded image as a link to it', function (done) {
			const editor = getJodit({
				uploader: {
					url: 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload'
				},
				events: {
					afterInsertNode: function () {
						try {
							expect(editor.value).equals(
								'<p>test<a href="https://xdsoft.net/jodit/files/logo.gif">https://xdsoft.net/jodit/files/logo.gif</a></p>'
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

			dropInFilePopup(editor, new FileImage());
		});

		it('Should let file.defaultHandlerSuccess insert the files instead', function (done) {
			const editor = getJodit({
				uploader: {
					url: 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload'
				},
				file: {
					defaultHandlerSuccess: function (data) {
						try {
							expect(this).equals(editor);
							expect(data.files).deep.equals(['logo.gif']);

							this.s.insertHTML(
								`<a class="file" href="${data.baseurl}${data.files[0]}">Logo</a>`
							);

							expect(editor.value).equals(
								'<p>test<a class="file" href="https://xdsoft.net/jodit/files/logo.gif">Logo</a></p>'
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

			dropInFilePopup(editor, new FileImage());
		});
	});
});
