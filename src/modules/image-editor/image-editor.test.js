/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Image editor', () => {
	function getForm(dialog) {
		return dialog.querySelector('.jodit-ui-image-properties-form')
			.component;
	}

	describe('Crop mode', () => {
		describe('Enable ratio', () => {
			it('Should deny crop image without ratio', async () => {
				const area = appendTestArea();
				const editor = Jodit.make(area, {
					history: {
						timeout: 0
					},
					uploader: {
						url: 'https://xdsoft.net/jodit/connector/index.php?action=upload'
					},
					filebrowser: {
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					},
					disablePlugins: 'mobile'
				});

				editor.value =
					'<img alt="" src="https://xdsoft.net/jodit/files/th.jpg">';

				simulateEvent('dblclick', editor.editor.querySelector('img'));

				const dialog = getOpenedDialog(editor);

				expect(dialog).is.not.null;

				const form = getForm(dialog);
				simulateEvent('click', form.getElm('editImage'));

				await new Promise(resolve =>
					editor.filebrowser.e.one('afterImageEditor', resolve)
				);

				const imageEditor = getOpenedDialog(editor);

				expect(imageEditor).is.not.null;

				expect(
					imageEditor.querySelectorAll('[data-area=crop]').length
				).equals(1);
				expect(
					imageEditor.querySelectorAll(
						'[data-area=crop].jodit-image-editor_active'
					).length
				).equals(0);

				simulateEvent(
					'click',
					imageEditor.querySelector('[data-area=crop] > div')
				);

				expect(
					imageEditor.querySelectorAll(
						'[data-area=crop].jodit-image-editor_active'
					).length
				).equals(1);

				const cropper = imageEditor.querySelector(
					'.jodit-image-editor__croper'
				);

				expect(cropper).not.is.null;

				const oldRatio = cropper.offsetWidth / cropper.offsetHeight;
				simulateEvent(
					'mousedown',
					cropper.querySelector('.jodit_bottomright'),
					e => {
						const pos = Jodit.modules.Helpers.offset(
							cropper,
							editor,
							editor.ownerDocument
						);
						e.clientX = pos.left + pos.width;
						e.clientY = pos.top + pos.height;
					}
				);

				simulateEvent('mousemove', editor.ownerWindow, e => {
					const pos = Jodit.modules.Helpers.offset(
						cropper,
						editor,
						editor.ownerDocument
					);
					e.clientX = pos.left + pos.width - 50;
					e.clientY = pos.top + pos.height - 150;
				});

				simulateEvent('mouseup', editor.ownerWindow, e => {
					const pos = Jodit.modules.Helpers.offset(
						cropper,
						editor,
						editor.ownerDocument
					);
					e.clientX = pos.left + pos.width - 50;
					e.clientY = pos.top + pos.height - 150;
				});

				expect(
					Math.abs(
						cropper.offsetWidth / cropper.offsetHeight - oldRatio
					) < 0.02
				).is.true;
			}).timeout(7000);
		});

		describe('Disable ratio', () => {
			it('Should allow crop image without ratio', async () => {
				const area = appendTestArea();

				const editor = Jodit.make(area, {
					history: {
						timeout: 0
					},
					uploader: {
						url: 'https://xdsoft.net/jodit/connector/index.php?action=upload'
					},
					filebrowser: {
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					}
				});

				editor.value =
					'<img alt="" src="https://xdsoft.net/jodit/files/th.jpg">';

				simulateEvent('dblclick', editor.editor.querySelector('img'));

				const dialog = getOpenedDialog(editor);

				expect(dialog).is.not.null;
				const form = getForm(dialog);
				simulateEvent('click', form.getElm('editImage'));

				await new Promise(resolve =>
					editor.filebrowser.events.one('afterImageEditor', resolve)
				);

				const imageEditor = getOpenedDialog(editor);

				expect(imageEditor).is.not.null;

				expect(
					imageEditor.querySelectorAll('[data-area=crop]').length
				).equals(1);

				expect(
					imageEditor.querySelectorAll(
						'[data-area=crop].jodit-image-editor_active'
					).length
				).equals(0);

				simulateEvent(
					'click',
					imageEditor.querySelector('[data-area=crop] > div')
				);

				expect(
					imageEditor.querySelectorAll(
						'[data-area=crop].jodit-image-editor_active'
					).length
				).equals(1);

				const cropper = imageEditor.querySelector(
					'.jodit-image-editor__croper'
				);

				expect(cropper).not.is.null;

				const oldRatio = cropper.offsetWidth / cropper.offsetHeight;

				const disableRatioBtn = imageEditor
					.querySelector('[data-area=crop].jodit-image-editor_active')
					.querySelector('.jodit-switcher input');

				expect(disableRatioBtn).not.is.null;
				disableRatioBtn.checked = false;
				simulateEvent('change', disableRatioBtn);

				simulateEvent(
					'mousedown',
					cropper.querySelector('.jodit_bottomright'),
					e => {
						const pos = Jodit.modules.Helpers.offset(
							cropper,
							editor,
							editor.ownerDocument
						);
						e.clientX = pos.left + pos.width;
						e.clientY = pos.top + pos.height;
					}
				);

				simulateEvent('mousemove', editor.ownerWindow, e => {
					const pos = Jodit.modules.Helpers.offset(
						cropper,
						editor,
						editor.ownerDocument
					);
					e.clientX = pos.left + pos.width - 50;
					e.clientY = pos.top + pos.height - 150;
				});

				simulateEvent('mouseup', editor.ownerWindow, e => {
					const pos = Jodit.modules.Helpers.offset(
						cropper,
						editor,
						editor.ownerDocument
					);
					e.clientX = pos.left + pos.width - 50;
					e.clientY = pos.top + pos.height - 150;
				});

				expect(
					Math.abs(
						cropper.offsetWidth / cropper.offsetHeight - oldRatio
					) > 1
				).is.true;
			}).timeout(7000);
		});
	});

	describe('Resize mode', () => {
		describe('Enable ratio', () => {
			it('Should deny resize image without ratio', async () => {
				const editor = getJodit({
					history: {
						timeout: 0
					},
					uploader: {
						url: 'https://xdsoft.net/jodit/connector/index.php?action=upload'
					},
					filebrowser: {
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					}
				});

				editor.value =
					'<p><img alt="artio" src="tests/artio.jpg"/></p>';

				simulateEvent('dblclick', editor.editor.querySelector('img'));

				const dialog = getOpenedDialog(editor);

				const form = getForm(dialog);
				simulateEvent('click', form.getElm('editImage'));
				await new Promise(resolve =>
					editor.filebrowser.events.one('afterImageEditor', resolve)
				);

				const imageEditor = getOpenedDialog(editor);
				expect(imageEditor).is.not.null;

				expect(
					imageEditor.querySelectorAll('[data-area=resize]').length
				).equals(1);
				expect(
					imageEditor.querySelectorAll(
						'[data-area=resize].jodit-image-editor_active'
					).length
				).equals(1); // default mode

				simulateEvent(
					'click',
					0,
					imageEditor.querySelector('[data-area=resize] > div')
				);

				expect(
					imageEditor.querySelectorAll(
						'[data-area=resize].jodit-image-editor_active'
					).length
				).equals(1);

				const resizer = imageEditor.querySelector(
					'.jodit-image-editor__resizer'
				);

				expect(resizer).not.is.null;

				const oldRatio = resizer.offsetWidth / resizer.offsetHeight;

				simulateEvent(
					'mousedown',
					resizer.querySelector('.jodit_bottomright'),
					e => {
						const pos = Jodit.modules.Helpers.offset(
							resizer,
							editor,
							editor.ownerDocument
						);
						e.clientX = pos.left + pos.width;
						e.clientY = pos.top + pos.height;
					}
				);

				simulateEvent('mousemove', editor.ownerWindow, e => {
					const pos = Jodit.modules.Helpers.offset(
						resizer,
						editor,
						editor.ownerDocument
					);
					e.clientX = pos.left + pos.width - 250;
					e.clientY = pos.top + pos.height - 150;
				});

				simulateEvent('mouseup', editor.ownerWindow, e => {
					const pos = Jodit.modules.Helpers.offset(
						resizer,
						editor,
						editor.ownerDocument
					);
					e.clientX = pos.left + pos.width - 250;
					e.clientY = pos.top + pos.height - 150;
				});

				expect(
					Math.abs(
						resizer.offsetWidth / resizer.offsetHeight - oldRatio
					) < 0.05
				).is.true;
			}).timeout(7000);
		});

		describe('Disable ratio', () => {
			it('Should allow resize image without ratio', async () => {
				const area = appendTestArea();
				const editor = Jodit.make(area, {
					history: {
						timeout: 0
					},
					uploader: {
						url: 'https://xdsoft.net/jodit/connector/index.php?action=upload'
					},
					filebrowser: {
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					}
				});
				editor.value = '<p><img alt="test" src="tests/artio.jpg"/></p>';

				simulateEvent('dblclick', editor.editor.querySelector('img'));

				const dialog = getOpenedDialog(editor);

				const form = getForm(dialog);
				simulateEvent('click', form.getElm('editImage'));

				await new Promise(resolve =>
					editor.filebrowser.events.one('afterImageEditor', resolve)
				);

				const imageEditor = getOpenedDialog(editor);
				expect(imageEditor).is.not.null;

				expect(
					imageEditor.querySelectorAll('[data-area=resize]').length
				).equals(1);
				expect(
					imageEditor.querySelectorAll(
						'[data-area=resize].jodit-image-editor_active'
					).length
				).equals(1); // default mode

				simulateEvent(
					'click',
					imageEditor.querySelector('[data-area=resize] > div')
				);

				expect(
					imageEditor.querySelectorAll(
						'[data-area=resize].jodit-image-editor_active'
					).length
				).equals(1);

				const disableRatioBtn = imageEditor
					.querySelector(
						'[data-area=resize].jodit-image-editor_active'
					)
					.querySelector('.jodit-switcher input');

				expect(disableRatioBtn).not.is.null;
				disableRatioBtn.checked = false;
				simulateEvent('change', disableRatioBtn);

				const resizer = imageEditor.querySelector(
					'.jodit-image-editor__resizer'
				);

				expect(resizer).not.is.null;

				const oldRatio = resizer.offsetWidth / resizer.offsetHeight;

				simulateEvent(
					'mousedown',
					resizer.querySelector('.jodit_bottomright'),
					e => {
						const pos = Jodit.modules.Helpers.offset(
							resizer,
							editor,
							editor.ownerDocument
						);
						e.clientX = pos.left + pos.width;
						e.clientY = pos.top + pos.height;
					}
				);

				simulateEvent('mousemove', editor.ownerWindow, e => {
					const pos = Jodit.modules.Helpers.offset(
						resizer,
						editor,
						editor.ownerDocument
					);

					e.clientX = pos.left + pos.width - 50;
					e.clientY = pos.top + pos.height - 150;
				});

				simulateEvent('mouseup', editor.ownerWindow, e => {
					const pos = Jodit.modules.Helpers.offset(
						resizer,
						editor,
						editor.ownerDocument
					);
					e.clientX = pos.left + pos.width - 50;
					e.clientY = pos.top + pos.height - 150;
				});

				expect(
					Math.abs(
						resizer.offsetWidth / resizer.offsetHeight - oldRatio
					) > 1
				).is.true;
			}).timeout(7000);
		});
	});
});
