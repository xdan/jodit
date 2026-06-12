/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

// https://github.com/xdan/jodit/issues/1329
describe('Uploader beforeUpload hook (#1329)', () => {
	const makeFiles = () => [
		new File(['data'], 'photo.jpg', { type: 'image/jpeg' })
	];

	it('Should call beforeUpload with the file list', async () => {
		let received = null;
		const editor = getJodit({
			uploader: {
				url: 'https://example.invalid/upload',
				insertImageAsBase64URI: false,
				beforeUpload(files) {
					received = files;
					return false;
				},
				defaultHandlerError() {}
			}
		});

		try {
			await editor.uploader.upload(makeFiles());
		} catch (e) {}

		expect(received).is.not.null;
		expect(received.length).equals(1);
		expect(received[0].name).equals('photo.jpg');

		editor.destruct();
	});

	it('Should abort the upload when beforeUpload returns false', async () => {
		let rejected = false;
		const editor = getJodit({
			uploader: {
				url: 'https://example.invalid/upload',
				insertImageAsBase64URI: false,
				beforeUpload() {
					return false;
				},
				defaultHandlerError() {}
			}
		});

		try {
			await editor.uploader.upload(makeFiles());
		} catch (e) {
			rejected = true;
		}

		expect(rejected).is.true;
		editor.destruct();
	});

	it('Should expose the editor as this.j inside beforeUpload', async () => {
		let editorFromHook = null;
		const editor = getJodit({
			uploader: {
				url: 'https://example.invalid/upload',
				beforeUpload() {
					editorFromHook = this.j;
					return false;
				},
				defaultHandlerError() {}
			}
		});

		try {
			await editor.uploader.upload(makeFiles());
		} catch (e) {}

		expect(editorFromHook).equals(editor);
		editor.destruct();
	});

	it('Should proceed when beforeUpload does not return false', () => {
		let called = false;
		const editor = getJodit({
			uploader: {
				insertImageAsBase64URI: true,
				imagesExtensions: ['jpg', 'jpeg', 'png'],
				beforeUpload() {
					called = true;
				}
			}
		});

		editor.uploader.upload(makeFiles());
		expect(called).is.true;
		editor.destruct();
	});
});
