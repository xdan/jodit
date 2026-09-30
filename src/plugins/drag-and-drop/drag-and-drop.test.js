/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Drag and drop plugin', () => {
	const makeFileDropEvent = () => {
		const dt = new DataTransfer();
		dt.items.add(
			new File(['fake-bytes'], 'photo.jpg', { type: 'image/jpeg' })
		);

		return new DragEvent('drop', {
			bubbles: true,
			cancelable: true,
			dataTransfer: dt
		});
	};

	// GHSA-jhhp-r3r7-v2cg
	describe('Drop HTML with event handlers', () => {
		const html =
			'<p onmouseover="alert(1)"><b onclick="alert(2)">dropped</b></p>';

		const dropEvent = () => {
			const dt = new DataTransfer();
			dt.setData('text/html', html);

			return new DragEvent('drop', {
				bubbles: true,
				cancelable: true,
				dataTransfer: dt
			});
		};

		it('Should insert a drop from another window through the paste plugin, without the handlers', () => {
			const editor = getJodit({
				history: { timeout: 0 },
				askBeforePasteHTML: false
			});
			editor.value = '<p>test|</p>';
			setCursorToChar(editor);

			// No dragstart in this window: the drag began elsewhere
			const event = dropEvent();
			editor.editor.dispatchEvent(event);

			expect(event.defaultPrevented).is.true;
			expect(editor.value).includes('dropped');
			expect(editor.value).does.not.include('onmouseover');
			expect(editor.value).does.not.include('onclick');
		});

		it('Should insert a drag that began in the editor without the handlers', () => {
			const editor = getJodit({
				history: { timeout: 0 },
				askBeforePasteHTML: false
			});
			editor.value = '<p>test|</p>';
			setCursorToChar(editor);

			editor.editor.dispatchEvent(
				new DragEvent('dragstart', { bubbles: true, cancelable: true })
			);
			editor.editor.dispatchEvent(dropEvent());

			expect(editor.value).includes('dropped');
			expect(editor.value).does.not.include('onmouseover');
			expect(editor.value).does.not.include('onclick');
			expect(editor.editor.querySelector('[onmouseover], [onclick]')).is
				.null;
		});
	});

	// https://github.com/xdan/jodit/issues/1077
	describe('Drop a file with enableDragAndDropFileToEditor: false', () => {
		it('Should cancel the drop so the browser does not insert the file natively', () => {
			const editor = getJodit({
				enableDragAndDropFileToEditor: false,
				uploader: {
					insertImageAsBase64URI: true
				},
				history: { timeout: 0 }
			});

			editor.value = '<p>test</p>';

			const event = makeFileDropEvent();
			editor.editor.dispatchEvent(event);

			expect(event.defaultPrevented).is.true;
			expect(editor.value).equals('<p>test</p>');
		});
	});

	describe('Drop a file with enableDragAndDropFileToEditor: true', () => {
		it('Should keep the drop processable by the uploader', () => {
			const editor = getJodit({
				uploader: {
					insertImageAsBase64URI: true
				},
				history: { timeout: 0 }
			});

			editor.value = '<p>test</p>';

			const event = makeFileDropEvent();
			editor.editor.dispatchEvent(event);

			// the uploader binds its own handler and prevents default itself
			expect(event.defaultPrevented).is.true;
		});
	});
});
