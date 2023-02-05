/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Edit image tests', function () {
	describe('Image editor', function () {
		describe('Crop mode', function () {
			describe('Enable ratio', function () {
				it('Should deny crop image without ratio', function (done) {
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

					simulateEvent(
						'dblclick',
						editor.editor.querySelector('img')
					);

					const dialog = getOpenedDialog(editor);

					expect(dialog).is.not.null;
					expect(
						dialog.querySelectorAll('[data-ref="editImage"]').length
					).equals(1);

					editor.filebrowser.events.on(
						'afterImageEditor',
						function () {
							const imageEditor = getOpenedDialog(editor);

							expect(imageEditor).is.not.null;

							expect(
								imageEditor.querySelectorAll('[data-area=crop]')
									.length
							).equals(1);
							expect(
								imageEditor.querySelectorAll(
									'[data-area=crop].jodit-image-editor_active'
								).length
							).equals(0);

							simulateEvent(
								'click',
								imageEditor.querySelector(
									'[data-area=crop] > div'
								)
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

							const oldRatio =
								cropper.offsetWidth / cropper.offsetHeight;
							simulateEvent(
								'mousedown',
								cropper.querySelector('.jodit_bottomright'),
								function (e) {
									const pos = Jodit.modules.Helpers.offset(
										cropper,
										editor,
										editor.ownerDocument
									);
									e.clientX = pos.left + pos.width;
									e.clientY = pos.top + pos.height;
								}
							);

							simulateEvent(
								'mousemove',
								editor.ownerWindow,
								function (e) {
									const pos = Jodit.modules.Helpers.offset(
										cropper,
										editor,
										editor.ownerDocument
									);
									e.clientX = pos.left + pos.width - 50;
									e.clientY = pos.top + pos.height - 150;
								}
							);

							simulateEvent(
								'mouseup',
								editor.ownerWindow,
								function (e) {
									const pos = Jodit.modules.Helpers.offset(
										cropper,
										editor,
										editor.ownerDocument
									);
									e.clientX = pos.left + pos.width - 50;
									e.clientY = pos.top + pos.height - 150;
								}
							);

							expect(
								Math.abs(
									cropper.offsetWidth / cropper.offsetHeight -
										oldRatio
								) < 0.02
							).is.true;

							done();
						}
					);

					simulateEvent(
						'click',
						dialog.querySelector('[data-ref="editImage"]')
					);
				}).timeout(7000);
			});

			describe('Disable ratio', function () {
				it('Should allow crop image without ratio', function (done) {
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

					simulateEvent(
						'dblclick',
						editor.editor.querySelector('img')
					);

					const dialog = getOpenedDialog(editor);

					expect(dialog).is.not.null;
					expect(
						dialog.querySelectorAll('[data-ref="editImage"]').length
					).equals(1);

					editor.filebrowser.events.on(
						'afterImageEditor',
						function () {
							const imageEditor = getOpenedDialog(editor);

							expect(imageEditor).is.not.null;

							expect(
								imageEditor.querySelectorAll('[data-area=crop]')
									.length
							).equals(1);

							expect(
								imageEditor.querySelectorAll(
									'[data-area=crop].jodit-image-editor_active'
								).length
							).equals(0);

							simulateEvent(
								'click',
								imageEditor.querySelector(
									'[data-area=crop] > div'
								)
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

							const oldRatio =
								cropper.offsetWidth / cropper.offsetHeight;

							const disableRatioBtn = imageEditor
								.querySelector(
									'[data-area=crop].jodit-image-editor_active'
								)
								.querySelector('.jodit-switcher input');

							expect(disableRatioBtn).not.is.null;
							disableRatioBtn.checked = false;
							simulateEvent('change', disableRatioBtn);

							simulateEvent(
								'mousedown',
								cropper.querySelector('.jodit_bottomright'),
								function (e) {
									const pos = Jodit.modules.Helpers.offset(
										cropper,
										editor,
										editor.ownerDocument
									);
									e.clientX = pos.left + pos.width;
									e.clientY = pos.top + pos.height;
								}
							);

							simulateEvent(
								'mousemove',
								editor.ownerWindow,
								function (e) {
									const pos = Jodit.modules.Helpers.offset(
										cropper,
										editor,
										editor.ownerDocument
									);
									e.clientX = pos.left + pos.width - 50;
									e.clientY = pos.top + pos.height - 150;
								}
							);

							simulateEvent(
								'mouseup',
								editor.ownerWindow,
								function (e) {
									const pos = Jodit.modules.Helpers.offset(
										cropper,
										editor,
										editor.ownerDocument
									);
									e.clientX = pos.left + pos.width - 50;
									e.clientY = pos.top + pos.height - 150;
								}
							);

							expect(
								Math.abs(
									cropper.offsetWidth / cropper.offsetHeight -
										oldRatio
								) > 1
							).is.true;

							done();
						}
					);

					simulateEvent(
						'click',
						dialog.querySelector('[data-ref="editImage"]')
					);
				}).timeout(7000);
			});
		});

		describe('Resize mode', function () {
			describe('Enable ratio', function () {
				it('Should deny resize image without ratio', done => {
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

					editor.value = '<img src="tests/artio.jpg">';

					simulateEvent(
						'dblclick',
						editor.editor.querySelector('img')
					);

					const dialog = getOpenedDialog(editor);

					editor.filebrowser.events.on('afterImageEditor', () => {
						const imageEditor = getOpenedDialog(editor);
						expect(imageEditor).is.not.null;

						expect(
							imageEditor.querySelectorAll('[data-area=resize]')
								.length
						).equals(1);
						expect(
							imageEditor.querySelectorAll(
								'[data-area=resize].jodit-image-editor_active'
							).length
						).equals(1); // default mode

						simulateEvent(
							'click',
							0,
							imageEditor.querySelector(
								'[data-area=resize] > div'
							)
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

						const oldRatio =
							resizer.offsetWidth / resizer.offsetHeight;

						simulateEvent(
							'mousedown',
							resizer.querySelector('.jodit_bottomright'),
							function (e) {
								const pos = Jodit.modules.Helpers.offset(
									resizer,
									editor,
									editor.ownerDocument
								);
								e.clientX = pos.left + pos.width;
								e.clientY = pos.top + pos.height;
							}
						);

						simulateEvent(
							'mousemove',
							editor.ownerWindow,
							function (e) {
								const pos = Jodit.modules.Helpers.offset(
									resizer,
									editor,
									editor.ownerDocument
								);
								e.clientX = pos.left + pos.width - 250;
								e.clientY = pos.top + pos.height - 150;
							}
						);

						simulateEvent(
							'mouseup',
							editor.ownerWindow,
							function (e) {
								const pos = Jodit.modules.Helpers.offset(
									resizer,
									editor,
									editor.ownerDocument
								);
								e.clientX = pos.left + pos.width - 250;
								e.clientY = pos.top + pos.height - 150;
							}
						);

						expect(
							Math.abs(
								resizer.offsetWidth / resizer.offsetHeight -
									oldRatio
							) < 0.05
						).is.true;

						done();
					});

					simulateEvent(
						'click',
						dialog.querySelector('[data-ref="editImage"]')
					);
				}).timeout(7000);
			});

			describe('Disable ratio', function () {
				it('Should allow resize image without ratio', function (done) {
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
					editor.value = '<img src="tests/artio.jpg">';

					simulateEvent(
						'dblclick',
						editor.editor.querySelector('img')
					);

					const dialog = getOpenedDialog(editor);

					editor.filebrowser.events.on(
						'afterImageEditor',
						function () {
							const imageEditor = getOpenedDialog(editor);
							expect(imageEditor).is.not.null;

							expect(
								imageEditor.querySelectorAll(
									'[data-area=resize]'
								).length
							).equals(1);
							expect(
								imageEditor.querySelectorAll(
									'[data-area=resize].jodit-image-editor_active'
								).length
							).equals(1); // default mode

							simulateEvent(
								'click',
								imageEditor.querySelector(
									'[data-area=resize] > div'
								)
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

							const oldRatio =
								resizer.offsetWidth / resizer.offsetHeight;

							simulateEvent(
								'mousedown',
								resizer.querySelector('.jodit_bottomright'),
								function (e) {
									const pos = Jodit.modules.Helpers.offset(
										resizer,
										editor,
										editor.ownerDocument
									);
									e.clientX = pos.left + pos.width;
									e.clientY = pos.top + pos.height;
								}
							);

							simulateEvent(
								'mousemove',
								editor.ownerWindow,
								function (e) {
									const pos = Jodit.modules.Helpers.offset(
										resizer,
										editor,
										editor.ownerDocument
									);

									e.clientX = pos.left + pos.width - 50;
									e.clientY = pos.top + pos.height - 150;
								}
							);

							simulateEvent(
								'mouseup',
								editor.ownerWindow,
								function (e) {
									const pos = Jodit.modules.Helpers.offset(
										resizer,
										editor,
										editor.ownerDocument
									);
									e.clientX = pos.left + pos.width - 50;
									e.clientY = pos.top + pos.height - 150;
								}
							);

							expect(
								Math.abs(
									resizer.offsetWidth / resizer.offsetHeight -
										oldRatio
								) > 1
							).is.true;

							done();
						}
					);

					simulateEvent(
						'click',
						dialog.querySelector('[data-ref="editImage"]')
					);
				}).timeout(7000);
			});
		});
		describe('Classes', function () {
			describe('No available classes defined', function () {
				it('Should render as input box', function (done) {
					const area = appendTestArea();
					const editor = Jodit.make(area, {
						history: {
							timeout: 0
						},
						disablePlugins: 'mobile'
					});

					editor.value =
						'<img alt="" src="https://xdsoft.net/jodit/files/th.jpg">';

					simulateEvent(
						'dblclick',
						editor.editor.querySelector('img')
					);

					const dialog = getOpenedDialog(editor);

					expect(dialog).is.not.null;
					expect(
						dialog.querySelectorAll('[data-ref="editImage"]').length
					).equals(1);

					expect(
						dialog.querySelectorAll('input[data-ref="classes"]')
							.length
					).equals(1);

					done();
				}).timeout(7000);
			});
			describe('Available classes defined', function () {
				it('Should render as select box', function (done) {
					const area = appendTestArea();
					const editor = Jodit.make(area, {
						history: {
							timeout: 0
						},
						image: {
							availableClasses: [
								'rte-image-width-50',
								['rte-image-width-75', '75 % width']
							]
						},
						disablePlugins: 'mobile'
					});

					editor.value =
						'<img alt="" src="https://xdsoft.net/jodit/files/th.jpg">';

					simulateEvent(
						'dblclick',
						editor.editor.querySelector('img')
					);

					const dialog = getOpenedDialog(editor);

					expect(dialog).is.not.null;
					expect(
						dialog.querySelectorAll('[data-ref="editImage"]').length
					).equals(1);

					expect(
						dialog.querySelectorAll('select[data-ref="classes"]')
							.length
					).equals(1);

					const options = [];
					dialog
						.querySelectorAll('select[data-ref="classes"] option')
						.forEach(option => {
							options.push([option.value, option.textContent]);
						});

					expect(options).to.eql([
						['rte-image-width-50', 'rte-image-width-50'],
						['rte-image-width-75', '75 % width']
					]);

					done();
				}).timeout(7000);
			});
		});
	});
});
