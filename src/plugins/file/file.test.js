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
							expect(data.items).deep.equals([
								{ file: 'logo.gif', isImage: true }
							]);
							expect(data.files).deep.equals(['logo.gif']);

							this.s.insertHTML(
								`<a class="file" href="${data.baseurl}${data.items[0].file}">Logo</a>`
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

		it('Should insert the items file.defaultHandlerSuccess is given (#1752)', function () {
			const editor = getJodit();

			editor.value = '<p>test|</p>';
			setCursorToChar(editor);

			editor.o.file.defaultHandlerSuccess.call(editor, {
				baseurl: 'https://xdsoft.net/jodit/files/',
				items: [{ file: 'file.xls', isImage: false }]
			});

			expect(editor.value).equals(
				'<p>test<a href="https://xdsoft.net/jodit/files/file.xls">https://xdsoft.net/jodit/files/file.xls</a></p>'
			);
		});

		it('Should still insert the files file.defaultHandlerSuccess is given as arrays (#1752)', function () {
			const editor = getJodit();

			editor.value = '<p>test|</p>';
			setCursorToChar(editor);

			editor.o.file.defaultHandlerSuccess.call(editor, {
				baseurl: 'https://xdsoft.net/jodit/files/',
				files: ['file.xls']
			});

			expect(editor.value).equals(
				'<p>test<a href="https://xdsoft.net/jodit/files/file.xls">https://xdsoft.net/jodit/files/file.xls</a></p>'
			);
		});

		it('Should make the selected text the link to an uploaded file', async function () {
			const editor = getJodit({
				uploader: {
					url: 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload'
				}
			});

			editor.value = '<p>Our |terms| apply</p>';
			setCursorToChar(editor);

			dropInFilePopup(editor, new FileImage());
			await waitForCondition(() => editor.value.includes('<a '), 3000);

			expect(editor.value).equals(
				'<p>Our <a href="https://xdsoft.net/jodit/files/logo.gif">terms</a> apply</p>'
			);
		});
	});

	describe('URL tab', function () {
		const insertByUrl = (editor, url, text = '') => {
			clickButton('file', editor);
			const popup = getOpenedPopup(editor);
			popup.querySelector('input[name=url]').value = url;
			popup.querySelector('input[name=text]').value = text;
			simulateEvent('submit', 0, popup.querySelector('form'));
		};

		it('Should make the selected text the link, keeping it', function () {
			const editor = getJodit();
			editor.value = '<p>Our |terms| apply</p>';
			setCursorToChar(editor);

			insertByUrl(editor, 'https://xdsoft.net/terms.pdf');

			expect(editor.value).equals(
				'<p>Our <a href="https://xdsoft.net/terms.pdf">terms</a> apply</p>'
			);
		});

		it('Should keep the selected text and take the text field as the title', function () {
			const editor = getJodit();
			editor.value = '<p>Our |terms| apply</p>';
			setCursorToChar(editor);

			insertByUrl(editor, 'https://xdsoft.net/terms.pdf', 'Terms');

			expect(editor.value).equals(
				'<p>Our <a href="https://xdsoft.net/terms.pdf" title="Terms">terms</a> apply</p>'
			);
		});

		it('Should insert the URL as the text with nothing selected', function () {
			const editor = getJodit();
			editor.value = '<p>test|</p>';
			setCursorToChar(editor);

			insertByUrl(editor, 'https://xdsoft.net/terms.pdf');

			expect(editor.value).equals(
				'<p>test<a href="https://xdsoft.net/terms.pdf" title="">https://xdsoft.net/terms.pdf</a></p>'
			);
		});
	});

	describe('Browse tab', function () {
		// Jodit PRO's file browser calls back with only the arrays
		it('Should insert links to the files a file browser passes as arrays (#1752)', function () {
			const editor = getJodit({
				filebrowser: {
					ajax: {
						url: 'https://example.com/filebrowser'
					}
				}
			});

			Object.defineProperty(editor.filebrowser, 'open', {
				value: callback =>
					callback({
						baseurl: 'https://xdsoft.net/jodit/files/',
						files: ['file.xls'],
						isImages: [false]
					})
			});

			editor.value = '<p>test|</p>';
			setCursorToChar(editor);

			clickButton('file', editor);
			clickButton('Browse', getOpenedPopup(editor), 'tab');

			expect(editor.value).equals(
				'<p>test<a href="https://xdsoft.net/jodit/files/file.xls" title="">https://xdsoft.net/jodit/files/file.xls</a></p>'
			);
		});
	});
});
