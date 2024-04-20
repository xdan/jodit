/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Edit image tests', () => {
	const IMAGE = '<img alt="artio" src="tests/artio.jpg"/>';
	const { css } = Jodit.modules.Helpers;

	function getForm(dialog) {
		return dialog.querySelector('.jodit-ui-image-properties-form')
			.component;
	}

	describe('Image properties dialog', () => {
		describe('Double-click on image', () => {
			it('should open image properties dialog', () => {
				const editor = getJodit();

				editor.value = IMAGE;

				simulateEvent('dblclick', editor.editor.querySelector('img'));

				const dialog = getOpenedDialog(editor);

				expect(dialog).is.not.null;
			});

			describe('Click action button', () => {
				let editor, dialog;
				beforeEach(async () => {
					editor = getJodit();

					editor.value = IMAGE;
					const img = editor.editor.querySelector('img');
					simulateEvent('dblclick', img);
					await img.decode();

					dialog = getOpenedDialog(editor);
					const form = dialog.querySelector(
						'.jodit-ui-image-properties-form'
					).component;

					expect(form).is.not.null;

					form.getElm('imageAlt').value = 'Diff art';
					simulateEvent('change', form.getElm('imageAlt'));

					form.getElm('marginTop').value = 8;
					simulateEvent('change', form.getElm('marginTop'));
					await editor.async.requestIdlePromise();
				});

				describe('Remove', () => {
					it('Should close dialog and remove image from editor', async () => {
						clickButton('Delete', dialog);
						await editor.async.requestIdlePromise();
						expect(sortAttributes(editor.value)).eq('<p></p>');
					});
				});

				describe('Cancel', () => {
					it('Should just close dialog', async () => {
						clickButton('Cancel', dialog);
						await editor.async.requestIdlePromise();
						expect(sortAttributes(editor.value)).eq(
							'<p><img alt="artio" src="tests/artio.jpg"></p>'
						);
					});
				});

				describe('Apply', () => {
					it('Should apply edited options', async () => {
						clickButton('Apply', dialog);
						await editor.async.requestIdlePromise();
						expect(sortAttributes(editor.value)).eq(
							'<p><img alt="Diff art" src="tests/artio.jpg" style="margin:8px"></p>'
						);
					});
				});
			});

			describe('Disable by image.openOnDblClick', () => {
				it('should not open image properties dialog', () => {
					const editor = getJodit({
						image: {
							openOnDblClick: false
						}
					});

					editor.value = IMAGE;
					simulateEvent(
						'dblclick',

						editor.editor.querySelector('img')
					);

					const dialog = getOpenedDialog(editor);

					expect(dialog).is.null;
				});
			});

			[
				['editSize', 'imageSizes'],
				['showPreview', 'imageView'],
				['editSrc', 'editSrc'],
				['editTitle', 'editTitle'],
				['editAlt', 'editAlt'],
				['editLink', 'editLink'],
				['editLink', 'editLinkTarget'],
				// ['useImageEditor', 'editImage'],
				// ['editImage', 'editImage'],
				['editMargins', 'editMargins'],
				['editAlign', 'editAlign'],
				['editStyle', 'editStyle'],
				['editClass', 'editClass'],
				['editId', 'editId'],
				['editBorderRadius', 'editBorderRadius']
			].forEach(([option, ref]) => {
				describe('Enable ' + option, () => {
					it('should hide image sizes', () => {
						const editor = getJodit({
							image: {
								[option]: true
							}
						});

						editor.value = IMAGE;

						simulateEvent(
							'dblclick',
							editor.editor.querySelector('img')
						);

						const dialog = getOpenedDialog(editor);

						const form = dialog.querySelector(
							'.jodit-ui-image-properties-form'
						).component;

						expect(form).is.not.null;
						const refElm = form.getElm(ref);
						expect(css(refElm, 'display')).not.equals(
							'none',
							`Reference ${ref} element should be visible`
						);
					});
				});

				describe('Disable ' + option, () => {
					it('should hide image sizes', () => {
						const editor = getJodit({
							image: {
								[option]: false
							}
						});

						editor.value = IMAGE;

						simulateEvent(
							'dblclick',
							editor.editor.querySelector('img')
						);

						const dialog = getOpenedDialog(editor);

						const form = dialog.querySelector(
							'.jodit-ui-image-properties-form'
						).component;

						expect(form).is.not.null;
						const refElm = form.getElm(ref);
						expect(css(refElm, 'display')).equals(
							'none',
							`Reference ${ref} with "${option}: false" element should not be visible`
						);
					});
				});
			});
		});

		describe('Main tab', () => {
			it('should be opened first', async () => {
				const editor = getJodit();
				editor.value = IMAGE;
				const img = editor.editor.querySelector('img');
				await img.decode();
				simulateEvent('dblclick', img);
				const dialog = getOpenedDialog(editor);
				expect(dialog).is.not.null;
				clickButton('Advanced', dialog);
				expect(
					getButton('Image', dialog).getAttribute('aria-pressed')
				).equals('false');
				expect(
					getButton('Advanced', dialog).getAttribute('aria-pressed')
				).equals('true');

				clickButton('close', dialog);
				expect(getOpenedDialog(editor)).is.null;

				simulateEvent('dblclick', img);
				const dialog2 = getOpenedDialog(editor);
				expect(dialog2).equals(dialog);

				expect(
					getButton('Image', dialog).getAttribute('aria-pressed')
				).equals('true');
				expect(
					getButton('Advanced', dialog).getAttribute('aria-pressed')
				).equals('false');
			});
		});

		describe('Change border radius', () => {
			it('should change image border radius', () => {
				const editor = getJodit();

				editor.value =
					'<img alt="ratio" style="width:100px; height: 100px; border-radius: 10px;" src="tests/artio.jpg"/>';

				simulateEvent(
					'dblclick',

					editor.editor.querySelector('img')
				);

				const dialog = getOpenedDialog(editor);

				expect(dialog).is.not.null;

				clickButton('Advanced', dialog);

				const tab = dialog.querySelector('.jodit-tab.jodit-tab_active');
				expect(tab).is.not.null;

				const form = getForm(dialog);

				expect(form).is.not.null;
				const input = form.getElm('borderRadius');

				expect(input).is.not.null;

				expect(input.value.toString()).equals('10');

				input.value = 100;
				simulateEvent('change', input);

				clickButton('ok', dialog);
				expect(sortAttributes(editor.value)).equals(
					'<p><img alt="ratio" src="tests/artio.jpg" style="border-radius:100px;height:100px;width:100px"></p>'
				);
			});
		});

		describe('Change classes', () => {
			it('should change image classlist', () => {
				const editor = getJodit();

				editor.value =
					'<img class="images123" style="width:100px; height: 100px;" src="tests/artio.jpg"/>';

				simulateEvent(
					'dblclick',

					editor.editor.querySelector('img')
				);

				const dialog = getOpenedDialog(editor);

				expect(dialog).is.not.null;

				clickButton('Advanced', dialog);

				const form = getForm(dialog);

				const input = form.getElm('classes');
				expect(input).is.not.null;

				expect(input.value.toString()).equals('images123');

				input.value = 'tavble ';
				simulateEvent('change', input);
				clickButton('ok', dialog);

				expect(sortAttributes(editor.value)).equals(
					'<p><img class="tavble " src="tests/artio.jpg" style="height:100px;width:100px"></p>'
				);
			});
		});

		describe('Change styles', () => {
			it('should change image styles', () => {
				const editor = getJodit();

				editor.value =
					'<img style="padding:10px;width:100px; height: 100px;" src="tests/artio.jpg"/>';

				simulateEvent('dblclick', editor.editor.querySelector('img'));

				const dialog = getOpenedDialog(editor);

				expect(dialog).is.not.null;

				clickButton('Advanced', dialog);

				const form = getForm(dialog);
				const input = form.getElm('style');
				expect(input).is.not.null;

				expect(sortStyles(input.value.toString())).equals(
					'height:100px;padding:10px;width:100px'
				);

				input.value = 'padding:20px;background-color: #ff0000;';
				simulateEvent('change', input);
				clickButton('ok', dialog);

				expect(sortAttributes(editor.value)).equals(
					'<p><img src="tests/artio.jpg" style="background-color:#FF0000;height:100px;padding:20px;width:100px"></p>'
				);
			});
		});

		describe('Change id', () => {
			it('should change image id', () => {
				const editor = getJodit();

				editor.value =
					'<img id="stop123"  style="width:100px; height: 100px;"  src="tests/artio.jpg"/>';

				simulateEvent('dblclick', editor.editor.querySelector('img'));

				const dialog = getOpenedDialog(editor);

				clickButton('Advanced', dialog);
				const form = getForm(dialog);

				const input = form.getElm('id');
				expect(input).is.not.null;

				expect(input.value.toString()).equals('stop123');

				input.value = 'fast12';
				simulateEvent('change', input);
				clickButton('ok', dialog);

				expect(sortAttributes(editor.value)).equals(
					'<p><img id="fast12" src="tests/artio.jpg" style="height:100px;width:100px"></p>'
				);
			});
		});

		describe('Change align', () => {
			describe('left', () => {
				it('should change image horizontal align', () => {
					const editor = getJodit();

					editor.value =
						'<img  style="width:100px; height: 100px;"  src="tests/artio.jpg"/>';

					simulateEvent(
						'dblclick',
						editor.editor.querySelector('img')
					);

					const dialog = getOpenedDialog(editor);

					clickButton('Advanced', dialog);
					const form = getForm(dialog);

					const input = form.getElm('align');
					expect(input).is.not.null;

					expect(input.value.toString()).equals('');

					input.value = 'left';
					simulateEvent('change', input);
					clickButton('ok', dialog);

					expect(sortAttributes(editor.value)).equals(
						'<p><img src="tests/artio.jpg" style="float:left;height:100px;width:100px"></p>'
					);
				});
			});

			describe('right', () => {
				it('should change image horizontal align', () => {
					const editor = getJodit();

					editor.value =
						'<img  style="width:100px; height: 100px;"  src="tests/artio.jpg"/>';
					simulateEvent(
						'dblclick',

						editor.editor.querySelector('img')
					);

					const dialog = getOpenedDialog(editor);

					clickButton('Advanced', dialog);
					const form = getForm(dialog);

					const input = form.getElm('align');

					expect(input.value.toString()).equals('');

					input.value = 'right';
					simulateEvent('change', input);

					clickButton('ok', dialog);

					expect(sortAttributes(editor.value)).equals(
						'<p><img src="tests/artio.jpg" style="float:right;height:100px;width:100px"></p>'
					);
				});
			});

			describe('center', () => {
				it('should change image horizontal align', () => {
					const editor = getJodit();

					editor.value =
						'<img style="float:left;width:100px; height: 100px;" src="tests/artio.jpg"/>';

					simulateEvent(
						'dblclick',
						editor.editor.querySelector('img')
					);

					const dialog = getOpenedDialog(editor);

					clickButton('Advanced', dialog);
					const form = getForm(dialog);

					const input = form.getElm('align');
					expect(input.value.toString()).equals('left');

					input.value = 'center';
					simulateEvent('change', input);

					clickButton('ok', dialog);

					expect(sortAttributes(editor.value)).equals(
						'<p><img src="tests/artio.jpg" style="display:block;height:100px;margin-left:auto;margin-right:auto;width:100px"></p>'
					);
				});
			});

			describe('Clear align', () => {
				it('should clear some align', () => {
					const editor = getJodit();

					editor.value =
						'<img src="tests/artio.jpg" style="width:100px; height: 100px;display:block;margin-left:auto;margin-right:auto">';

					simulateEvent(
						'dblclick',
						editor.editor.querySelector('img')
					);

					const dialog = getOpenedDialog(editor);

					clickButton('Advanced', dialog);
					const form = getForm(dialog);

					const input = form.getElm('align');
					expect(input).is.not.null;

					expect(input.value.toString()).equals('center');

					input.value = '';
					simulateEvent('change', input);

					clickButton('ok', dialog);

					expect(sortAttributes(editor.value)).equals(
						'<p><img src="tests/artio.jpg" style="height:100px;width:100px"></p>'
					);
				});
			});
		});

		describe('Change margins', () => {
			describe('Change marginTop with lock', () => {
				it('should change all margins', () => {
					const editor = getJodit();

					editor.value =
						'<img style="margin: 10px;width:100px; height: 100px;" src="tests/artio.jpg"/>';

					simulateEvent(
						'dblclick',
						editor.editor.querySelector('img')
					);

					const dialog = getOpenedDialog(editor);

					clickButton('Advanced', dialog);
					const form = getForm(dialog);

					const marginTop = form.getElm('marginTop');

					expect(marginTop).is.not.null;

					const marginBottom = form.getElm('marginBottom');
					expect(marginBottom).is.not.null;

					expect(marginTop.value).equals('10');

					expect(marginBottom.hasAttribute('disabled')).is.true;

					marginTop.value = 100;
					simulateEvent('change', marginTop);
					clickButton('ok', dialog);

					expect(sortAttributes(editor.value)).equals(
						'<p><img src="tests/artio.jpg" style="height:100px;margin:100px;width:100px"></p>'
					);
				});
			});

			describe('Change marginTop with unlock', () => {
				it('should change only marginTop', () => {
					const editor = getJodit();

					editor.value =
						'<img style="margin: 10px;width:100px; height: 100px;" src="tests/artio.jpg"/>';

					simulateEvent(
						'dblclick',
						editor.editor.querySelector('img')
					);

					const dialog = getOpenedDialog(editor);

					clickButton('Advanced', dialog);

					const form = getForm(dialog);

					const marginBottom = form.getElm('marginBottom');
					const marginTop = form.getElm('marginTop');
					const marginLeft = form.getElm('marginLeft');
					const marginRight = form.getElm('marginRight');
					const lockMargin = form.getElm('lockMargin');

					expect(lockMargin).is.not.null;
					const lockerimg = lockMargin.innerHTML;
					simulateEvent('click', lockMargin);
					expect(lockMargin.innerHTML).does.not.equal(lockerimg);

					expect(marginTop.value.toString()).equals('10');

					expect(marginBottom.value.toString()).equals('10');

					expect(marginLeft.value.toString()).equals('10');

					expect(marginRight.value.toString()).equals('10');

					expect(marginBottom.hasAttribute('disabled')).is.false;

					marginTop.value = 100;
					simulateEvent('change', marginTop);
					marginBottom.value = 10;
					simulateEvent('change', marginBottom);
					marginRight.value = 20;
					simulateEvent('change', marginRight);
					marginLeft.value = 220;
					simulateEvent('change', marginLeft);

					clickButton('ok', dialog);

					expect(sortAttributes(editor.value)).equals(
						'<p><img src="tests/artio.jpg" style="height:100px;margin:100px 20px 10px 220px;width:100px"></p>'
					);
				});
			});
		});

		describe('Change title', () => {
			it('should change image title', () => {
				const editor = getJodit();

				editor.value =
					'<img title="sting" style="width:100px; height: 100px;" src="tests/artio.jpg"/>';
				simulateEvent('dblclick', editor.editor.querySelector('img'));

				const dialog = getOpenedDialog(editor);

				const form = getForm(dialog);

				const input = form.getElm('imageTitle');

				expect(input).is.not.null;
				expect(input.value).equals('sting');

				input.value = 'Stop';
				simulateEvent('change', input);
				clickButton('ok', dialog);

				expect(sortAttributes(editor.value)).equals(
					'<p><img src="tests/artio.jpg" style="height:100px;width:100px" title="Stop"></p>'
				);
			});
		});

		describe('Change alt', () => {
			it('should change image alt', async () => {
				const editor = getJodit();
				const image = new Image();

				image.src = 'tests/artio.jpg';
				await image.decode();

				editor.value =
					'<img alt="test" style="width:100px; height: 100px;" src="tests/artio.jpg"/>';

				simulateEvent('dblclick', editor.editor.querySelector('img'));

				const dialog = getOpenedDialog(editor);

				const form = getForm(dialog);

				const input = form.getElm('imageAlt');

				expect(input).is.not.null;
				expect(input.value).equals('test');

				input.value = 'Stop';
				simulateEvent('change', input);
				clickButton('ok', dialog);

				expect(sortAttributes(editor.value)).equals(
					'<p><img alt="Stop" src="tests/artio.jpg" style="height:100px;width:100px"></p>'
				);
			});
		});

		describe('Change link', () => {
			it('should change image wrapper', () => {
				const editor = getJodit();

				editor.value =
					'<img  style="width:100px; height: 100px;"  src="tests/artio.jpg"/>';

				simulateEvent('dblclick', editor.editor.querySelector('img'));

				const dialog = getOpenedDialog(editor);

				const form = getForm(dialog);
				const input = form.getElm('imageLink');

				expect(input).is.not.null;
				expect(input.value).equals('');

				input.value = 'https://xdsoft.net/';
				simulateEvent('change', input);

				clickButton('ok', dialog);

				expect(sortAttributes(editor.value)).equals(
					'<p><a href="https://xdsoft.net/"><img src="tests/artio.jpg" style="height:100px;width:100px"></a></p>'
				);
			});

			describe('open link in new tab', () => {
				it('should change image wrapper with target="_blank"', () => {
					const editor = getJodit();

					editor.value =
						'<img style="width:100px; height: 100px;" src="tests/artio.jpg"/>';

					simulateEvent(
						'dblclick',
						editor.editor.querySelector('img')
					);

					const dialog = getOpenedDialog(editor);
					const form = getForm(dialog);
					const input = form.getElm('imageLink');

					expect(input).is.not.null;
					expect(input.value).equals('');

					input.value = 'https://xdsoft.net/';
					simulateEvent('change', input);

					const checkbox = form.getElm('imageLinkOpenInNewTab');
					checkbox.checked = true;
					simulateEvent('change', checkbox);

					clickButton('ok', dialog);

					expect(sortAttributes(editor.value)).equals(
						'<p><a href="https://xdsoft.net/" target="_blank"><img src="tests/artio.jpg" style="height:100px;width:100px"></a></p>'
					);
				});
			});

			describe('Open dialog for image wrapped in link', () => {
				it('should change image wrapper', () => {
					const editor = getJodit();

					editor.value =
						'<a href="https://xdan.ru" target="_blank"><img  style="width:100px; height: 100px;"  src="tests/artio.jpg"/></a>';

					simulateEvent(
						'dblclick',
						editor.editor.querySelector('img')
					);

					const dialog = getOpenedDialog(editor);
					const form = getForm(dialog);
					const input = form.getElm('imageLink');

					expect(input).is.not.null;
					expect(input.value).equals('https://xdan.ru');

					const checkbox = form.getElm('imageLinkOpenInNewTab');
					expect(checkbox.checked).is.true;

					input.value = 'https://xdsoft.net/';
					simulateEvent('change', input);
					checkbox.checked = false;
					simulateEvent('change', checkbox);

					clickButton('ok', dialog);

					expect(sortAttributes(editor.value)).equals(
						'<p><a href="https://xdsoft.net/"><img src="tests/artio.jpg" style="height:100px;width:100px"></a></p>'
					);
				});
			});

			describe('Unlink', () => {
				it('should remove image wrapper', () => {
					const editor = getJodit();

					editor.value =
						'<a href="https://xdan.ru" target="_blank"><img style="width:100px; height: 100px;" src="tests/artio.jpg"/></a>';

					simulateEvent(
						'dblclick',
						editor.editor.querySelector('img')
					);

					const dialog = getOpenedDialog(editor);
					const form = getForm(dialog);
					const input = form.getElm('imageLink');

					expect(input).is.not.null;
					expect(input.value).equals('https://xdan.ru');

					const checkbox = form.getElm('imageLinkOpenInNewTab');
					expect(checkbox.checked).is.true;

					input.value = '';
					simulateEvent('change', input);
					checkbox.checked = false;
					simulateEvent('change', checkbox);

					clickButton('ok', dialog);

					expect(sortAttributes(editor.value)).equals(
						'<p><img src="tests/artio.jpg" style="height:100px;width:100px"></p>'
					);
				});
			});
		});

		describe('Change size', () => {
			describe('dblclick on image and open dialog', () => {
				describe('width and height', () => {
					let editor,
						img,
						dialog,
						imageWidth,
						imageHeight,
						lockSize,
						form;

					beforeEach(async () => {
						editor = getJodit();

						editor.value = IMAGE;
						img = editor.editor.querySelector('img');

						await img.decode();

						simulateEvent('dblclick', img);

						dialog = getOpenedDialog(editor);

						form = getForm(dialog);
						imageWidth = form.getElm('imageWidth');
						imageHeight = form.getElm('imageHeight');
						lockSize = form.getElm('lockSize');
					});

					describe('were not changed', () => {
						it('should not set style', () => {
							expect(imageWidth.value).equals(
								img.offsetWidth.toString()
							);
							expect(imageHeight.value).equals(
								img.offsetHeight.toString()
							);
							expect(form.getMod('lock-size')).is.true;

							clickButton('Apply', dialog);

							expect(sortAttributes(editor.value)).equals(
								'<p><img alt="artio" src="tests/artio.jpg"></p>'
							);
						});
					});

					describe('were changed', () => {
						it('should set correct style', () => {
							imageWidth.value = 100;
							simulateEvent('change', imageWidth);

							clickButton('Apply', dialog);

							expect(sortAttributes(editor.value)).equals(
								'<p><img alt="artio" src="tests/artio.jpg" style="width:100px"></p>'
							);
						});
					});
				});

				it('should create inputs contains width and height', async () => {
					const area = appendTestArea();
					const editor = Jodit.make(area);

					editor.value = IMAGE;
					const img = editor.editor.querySelector('img');
					await img.decode();

					simulateEvent('dblclick', img);

					expect(area.id).equals(editor.id);

					const dialog = getOpenedDialog(editor);
					expect(dialog).is.not.null;

					const form = getForm(dialog);
					const imageWidth = form.getElm('imageWidth');
					const imageHeight = form.getElm('imageHeight');

					expect(imageWidth).is.not.null;
					expect(imageHeight).is.not.null;

					expect(imageWidth.value).equals(img.offsetWidth.toString());
					expect(imageHeight.value).equals(
						img.offsetHeight.toString()
					);

					expect(form.getMod('lock-size')).is.true;

					imageWidth.value = 100;
					simulateEvent('change', imageWidth);
					expect(imageHeight.value).does.not.equal(
						img.offsetHeight.toString()
					);

					imageHeight.value = 200;
					simulateEvent('change', imageHeight);
					expect(imageWidth.value).does.not.equal('100');

					clickButton('ok', dialog);

					expect(sortAttributes(editor.value)).equals(
						'<p><img alt="artio" src="tests/artio.jpg" style="width:356px"></p>'
					);
				});

				describe('image has width in attributes', () => {
					it('should put this width in input, inside height should be auto', async () => {
						const area = appendTestArea();
						const editor = Jodit.make(area);

						editor.value =
							'<img alt="artio" width="100px" src="tests/artio.jpg"/>';

						const img = editor.editor.querySelector('img');
						await img.decode();

						simulateEvent('dblclick', img);

						expect(area.id).equals(editor.id);

						const dialog = getOpenedDialog(editor);

						const form = getForm(dialog);
						const imageWidth = form.getElm('imageWidth');
						const imageHeight = form.getElm('imageHeight');

						expect(imageWidth.value).equals('100');
						expect(imageHeight.value).equals('56');

						imageWidth.value = 200;
						simulateEvent('change', imageWidth);

						expect(imageHeight.value).equals('112');

						imageHeight.value = 200;
						simulateEvent('change', imageHeight);
						expect(imageWidth.value).equals('356');

						clickButton('ok', dialog);

						expect(sortAttributes(editor.value)).equals(
							'<p><img alt="artio" src="tests/artio.jpg" style="width:356px" width="356"></p>'
						);
					});

					describe('same in style', () => {
						it('should put this width in input, inside height should be auto', async () => {
							const area = appendTestArea();
							const editor = Jodit.make(area);

							editor.value =
								'<img alt="artio" style="width:100px" src="tests/artio.jpg"/>';

							const img = editor.editor.querySelector('img');
							await img.decode();

							simulateEvent('dblclick', img);

							expect(area.id).equals(editor.id);

							const dialog = getOpenedDialog(editor);

							const form = getForm(dialog);
							const imageWidth = form.getElm('imageWidth');
							const imageHeight = form.getElm('imageHeight');
							const lockSize = form.getElm('lockSize');

							expect(imageWidth.value).equals('100');
							expect(imageHeight.value).equals('56');
							expect(form.getMod('lock-size')).is.true;

							imageWidth.value = 200;
							simulateEvent('change', imageWidth);

							expect(imageHeight.value).equals('112');

							imageHeight.value = 200;
							simulateEvent('change', imageHeight);
							expect(imageWidth.value).equals('356');

							clickButton('ok', dialog);

							expect(sortAttributes(editor.value)).equals(
								'<p><img alt="artio" src="tests/artio.jpg" style="width:356px"></p>'
							);
						});

						describe('Attributes has not pixel value', () => {
							it('should put these values in inputs', async () => {
								const area = appendTestArea();
								const editor = Jodit.make(area);

								editor.value =
									'<img style="width:100%;height:30rem" src="tests/artio.jpg"/>';

								const img = editor.editor.querySelector('img');
								await img.decode();
								simulateEvent('dblclick', img);

								expect(area.id).equals(editor.id);

								const dialog = getOpenedDialog(editor);

								const form = getForm(dialog);
								const imageWidth = form.getElm('imageWidth');
								const imageHeight = form.getElm('imageHeight');

								expect(imageWidth.value).equals('100%');
								expect(imageHeight.value).equals('30rem');
								expect(form.getMod('lock-size')).is.false;

								clickButton('ok', dialog);

								expect(sortAttributes(editor.value)).equals(
									'<p><img src="tests/artio.jpg" style="height:30rem;width:100%"></p>'
								);
							});
						});
					});
				});

				describe('image has width and height attributes', () => {
					it('should put these attributes in inputs and lock button should be switch off', async () => {
						const area = appendTestArea();
						const editor = Jodit.make(area);

						editor.value =
							'<img width="100px" height="200px" src="tests/artio.jpg"/>';

						const img = editor.editor.querySelector('img');

						await img.decode();
						simulateEvent('dblclick', img);

						expect(area.id).equals(editor.id);

						const dialog = getOpenedDialog(editor);

						const form = getForm(dialog);
						const imageWidth = form.getElm('imageWidth');
						const imageHeight = form.getElm('imageHeight');

						expect(imageWidth.value).equals('100');
						expect(imageHeight.value).equals('200');

						expect(form.getMod('lock-size')).is.false;

						imageWidth.value = 200;
						simulateEvent('change', imageWidth);
						expect(imageHeight.value).equals('200');

						imageHeight.value = 1900;
						simulateEvent('change', imageHeight);
						expect(imageWidth.value).equals('200');

						clickButton('ok', dialog);

						expect(sortAttributes(editor.value)).equals(
							'<p><img height="1900" src="tests/artio.jpg" style="height:1900px;width:200px" width="200"></p>'
						);
					});

					describe('same in style', () => {
						it('should put these values in inputs and lock button should be switch off', async () => {
							const area = appendTestArea();
							const editor = Jodit.make(area);

							editor.value =
								'<img style="width:100px;height:200px" src="tests/artio.jpg"/>';

							const img = editor.editor.querySelector('img');
							await img.decode();
							simulateEvent('dblclick', img);

							expect(area.id).equals(editor.id);

							const dialog = getOpenedDialog(editor);

							const form = getForm(dialog);
							const imageWidth = form.getElm('imageWidth');
							const imageHeight = form.getElm('imageHeight');

							expect(imageWidth.value).equals('100');
							expect(imageHeight.value).equals('200');

							expect(form.getMod('lock-size')).is.false;

							imageWidth.value = 200;
							simulateEvent('change', imageWidth);
							expect(imageHeight.value).equals('200');

							imageHeight.value = 1900;
							simulateEvent('change', imageHeight);
							expect(imageWidth.value).equals('200');

							clickButton('ok', dialog);

							expect(sortAttributes(editor.value)).equals(
								'<p><img src="tests/artio.jpg" style="height:1900px;width:200px"></p>'
							);
						});
					});
				});
			});

			describe('unlock ratio', () => {
				it('should create inputs with width and height', async () => {
					const editor = getJodit();

					editor.value = IMAGE;
					const img = editor.editor.querySelector('img');
					await img.decode();
					simulateEvent('dblclick', img);

					const dialog = getOpenedDialog(editor);

					expect(dialog).is.not.null;

					const form = getForm(dialog);
					const imageWidth = form.getElm('imageWidth');
					const imageHeight = form.getElm('imageHeight');
					const lockSize = form.getElm('lockSize');

					expect(lockSize).is.not.null;
					expect(imageWidth).is.not.null;
					expect(imageHeight).is.not.null;

					expect(imageWidth.value).equals(img.offsetWidth.toString());
					expect(imageHeight.value).equals(
						img.offsetHeight.toString()
					);

					simulateEvent('click', lockSize);

					imageWidth.value = 100;
					simulateEvent('change', imageWidth);
					expect(imageHeight.value).equals(
						img.offsetHeight.toString()
					);

					imageHeight.value = 200;
					simulateEvent('change', imageHeight);
					expect(imageWidth.value).equals('100');

					clickButton('ok', dialog);

					expect(sortAttributes(editor.value)).equals(
						'<p><img alt="artio" src="tests/artio.jpg" style="height:200px;width:100px"></p>'
					);
				});

				describe('For no proportional value', () => {
					it('should not create connected size inputs', async () => {
						const editor = getJodit();

						editor.value =
							'<img width="45px" height="212px" src="tests/artio.jpg"/>';
						const img = editor.editor.querySelector('img');
						await img.decode();
						simulateEvent('dblclick', img);

						const dialog = getOpenedDialog(editor);

						expect(dialog).is.not.null;

						const form = getForm(dialog);

						expect(form.getMod('lock-size')).is.false;
					});
				});

				describe('Toggle ratio again', () => {
					it('should create connected inputs with width and height', async () => {
						const editor = getJodit();

						editor.value = IMAGE;
						const img = editor.editor.querySelector('img');

						await img.decode();
						simulateEvent('dblclick', img);

						const dialog = getOpenedDialog(editor);
						expect(dialog).is.not.null;

						const form = getForm(dialog);
						const imageWidth = form.getElm('imageWidth');
						const imageHeight = form.getElm('imageHeight');
						const lockSize = form.getElm('lockSize');
						const lockerImg = lockSize.innerHTML;

						simulateEvent('click', lockSize);
						expect(lockSize.innerHTML).does.not.equal(lockerImg);

						simulateEvent('click', lockSize);
						expect(lockSize.innerHTML).equals(lockerImg);

						imageWidth.value = 100;
						simulateEvent('change', imageWidth);
						expect(imageHeight.value).does.not.equal(
							img.offsetHeight.toString()
						);

						imageHeight.value = 200;
						simulateEvent('change', imageHeight);
						expect(imageWidth.value).does.not.equal('100');

						clickButton('ok', dialog);

						expect(sortAttributes(editor.value)).equals(
							'<p><img alt="artio" src="tests/artio.jpg" style="width:356px"></p>'
						);
					});
				});
			});
		});

		describe('Show file browser buttons and edit image button', () => {
			describe("If uploader or file browser settings don't set", () => {
				it('should not show buttons', () => {
					const editor = getJodit();

					editor.value = IMAGE;
					simulateEvent(
						'dblclick',
						editor.editor.querySelector('img')
					);

					const dialog = getOpenedDialog(editor);

					expect(dialog).is.not.null;

					const form = getForm(dialog);
					const fb = form.getElm('changeImage');
					const edit = form.getElm('editImage');
					expect(fb).is.not.null;
					expect(edit).is.not.null;

					expect(edit.parentNode.style.display).equals('none');
				});
			});

			describe('Uploader and file browser settings set', () => {
				const settings = {
					uploader: {
						url: 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload'
					},

					filebrowser: {
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					}
				};

				const getFB = editor => {
					const dialog = getOpenedDialog(editor);
					return [
						dialog.querySelector('.jodit-file-browser').component,
						dialog
					];
				};

				it('should show buttons', async () => {
					const editor = Jodit.make(appendTestArea(), settings);

					editor.value = IMAGE;
					const img = editor.editor.querySelector('img');
					await img.decode();

					simulateEvent('dblclick', img);

					const dialog = getOpenedDialog(editor);

					const form = getForm(dialog);
					const fb = form.getElm('changeImage');
					expect(fb).is.not.null;

					expect(form.getElm('editImage')).is.not.null;
				});

				describe('Click on image button', () => {
					let editor;
					let imagePropertiesDialog;
					let form;

					beforeEach(async () => {
						editor = getJodit(settings);

						editor.value = IMAGE;
						const img = editor.editor.querySelector('img');
						await img.decode();

						simulateEvent('dblclick', img);

						imagePropertiesDialog = getOpenedDialog(editor);

						form = getForm(imagePropertiesDialog);
						const reChange = form.getElm('changeImage');

						expect(reChange).is.not.null;
						simulateEvent('click', reChange);
					});

					it('should open popup', () => {
						expect(getOpenedPopup(imagePropertiesDialog.component))
							.is.not.null;
					});

					describe('Click on file browser button', () => {
						it('should open file browser', () => {
							const popup = getOpenedPopup(
								imagePropertiesDialog.component
							);
							clickButton('Browse', popup);

							const fb = getOpenedDialog(editor);
							expect(fb).is.not.null;
							expect(fb).does.not.equal(imagePropertiesDialog);
						});

						describe('Select image', () => {
							let fb, dialog, previousWidth, previousHeight;

							beforeEach(async () => {
								imagePropertiesDialog = getOpenedDialog(editor);
								const popup = getOpenedPopup(
									imagePropertiesDialog.component
								);

								const imageWidth = form.getElm('imageWidth');
								previousWidth = imageWidth.value;
								const imageHeight = form.getElm('imageHeight');
								previousHeight = imageHeight.value;

								clickButton('Browse', popup);

								[fb, dialog] = getFB(editor);

								simulateEvent('click', getFirstFBItem(fb));

								unmockPromise();
								clickButton('select', dialog);

								await new Promise(resolve =>
									editor.e.one(
										'updateImageProperties.imageproperties',
										resolve
									)
								);
							});

							it('should change image only inside dialog', () => {
								const form = getForm(imagePropertiesDialog);
								const imageSrc = form.getElm('imageSrc');
								expect(imageSrc.value).equals(
									'https://xdsoft.net/jodit/files/ibanez-s520-443140.jpg'
								);

								expect(sortAttributes(editor.value)).equals(
									'<p><img alt="artio" src="tests/artio.jpg"></p>'
								);
							});

							it('should change source image after click apply', () => {
								clickButton('Apply', imagePropertiesDialog);
								expect(sortAttributes(editor.value)).equals(
									'<p><img alt="artio" src="https://xdsoft.net/jodit/files/ibanez-s520-443140.jpg" style="width:500px"></p>'
								);
							});
						});

						describe('Lock size', () => {
							describe('Enabled', () => {
								it('should change only height inside heightImage field', async () => {
									const popup = getOpenedPopup(
										imagePropertiesDialog.component
									);

									const imageWidth =
										form.getElm('imageWidth');
									const previousWidth = imageWidth.value;
									const imageHeight =
										form.getElm('imageHeight');
									const previousHeight = imageHeight.value;

									clickButton('Browse', popup);

									const [fb, dialog] = getFB(editor);

									simulateEvent('click', getFirstFBItem(fb));

									unmockPromise();
									clickButton('select', dialog);

									await new Promise(resolve =>
										editor.e.one(
											'updateImageProperties.imageproperties',
											resolve
										)
									);
									expect(imageWidth.value).equals('500');
									expect(imageHeight.value).equals('375');
								});
							});

							describe('Disabled', () => {
								it('should not change width and height', async () => {
									const popup = getOpenedPopup(
										imagePropertiesDialog.component
									);

									const lockSize = form.getElm('lockSize');
									simulateEvent('click', lockSize);

									const imageWidth =
										form.getElm('imageWidth');
									const previousWidth = imageWidth.value;
									const imageHeight =
										form.getElm('imageHeight');
									const previousHeight = imageHeight.value;

									clickButton('Browse', popup);

									const [fb, dialog] = getFB(editor);

									simulateEvent('click', getFirstFBItem(fb));

									unmockPromise();
									clickButton('select', dialog);

									await new Promise(resolve =>
										editor.e.one(
											'updateImageProperties.imageproperties',
											resolve
										)
									);

									expect(imageWidth.value).equals('500');
									expect(imageHeight.value).equals('281');
								});
							});
						});
					});
				});

				describe('Click on edit button', () => {
					describe('When photo it is not my', () => {
						it('should open image editor', async () => {
							const editor = Jodit.make(
								appendTestArea(),
								settings
							);

							editor.value =
								'<p><img src="https://xdsoft.net/jodit/files/artio.jpg"/></p>';
							const img = editor.editor.querySelector('img');

							await img.decode();

							simulateEvent('dblclick', img);

							const dialog = getOpenedDialog(editor);

							expect(dialog).is.not.null;

							const form = getForm(dialog);
							const edi = form.getElm('editImage');

							expect(edi).is.not.null;

							simulateEvent('click', edi);

							const dialog2 = getOpenedDialog(editor);
							expect(dialog2).is.not.null;
							expect(dialog2).does.not.equal(dialog);

							clickButton('ok', dialog2);

							const dialog3 = getOpenedDialog(editor);

							expect(dialog3).is.not.null;
							expect(dialog3).does.not.equal(dialog2);

							clickButton('ok', dialog3);

							const dialog4 = getOpenedDialog(editor);

							expect(dialog4).is.not.null;
							expect(dialog4).does.not.equal(dialog3);

							clickButton('ok', dialog4);

							const imageSrc = form.getElm('imageSrc');
							expect(imageSrc.value).equals(
								'https://xdsoft.net/jodit/files/artio.jpg'
							);
						});
					});
				});
			});
		});
	});

	describe('Classes', () => {
		describe('No available classes defined', () => {
			it('Should render as input box', async () => {
				const area = appendTestArea();
				const editor = Jodit.make(area, {
					history: {
						timeout: 0
					},
					disablePlugins: 'mobile'
				});

				editor.value =
					'<p><img alt="" src="https://xdsoft.net/jodit/files/th.jpg"></p>';

				const img = editor.editor.querySelector('img');
				await img.decode();
				simulateEvent('dblclick', img);

				const dialog = getOpenedDialog(editor);

				expect(dialog).is.not.null;

				const form = getForm(dialog);
				const editImage = form.getElm('editImage');
				const classes = form.getElm('classes');

				expect(editImage).is.not.null;

				expect(classes.tagName).equals('INPUT');
			});
		});

		describe('Available classes defined', () => {
			it('Should render as select box', async () => {
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
				const img = editor.editor.querySelector('img');
				await img.decode();

				simulateEvent('dblclick', img);

				const dialog = getOpenedDialog(editor);

				expect(dialog).is.not.null;

				const form = getForm(dialog);
				const editImage = form.getElm('editImage');

				expect(editImage).is.not.null;

				const classes = form.getElm('classes');

				expect(classes.tagName).equals('SELECT');

				const options = [];
				classes.querySelectorAll('option').forEach(option => {
					options.push([option.value, option.textContent]);
				});

				expect(options).to.eql([
					['rte-image-width-50', 'rte-image-width-50'],
					['rte-image-width-75', '75 % width']
				]);
			});
		});
	});

	describe('Dialog image', () => {
		describe('Opened dialog image', () => {
			it('Should disable margin inputs for left, bottom, right if element has equals margins(margin:10px;)', async () => {
				const editor = getJodit({
					history: {
						timeout: 0
					},
					image: {
						openOnDblClick: true
					}
				});
				editor.value =
					'<img src="https://xdsoft.net/jodit/files/artio.jpg" style="margin:10px;border:1px solid red;width:100px;height:100px;"/>';

				const img = editor.editor.querySelector('img');
				await img.decode();
				simulateEvent('dblclick', img);

				const dialog = getOpenedDialog(editor);

				expect(dialog.style.display).does.not.equal('none');

				const form = getForm(dialog);
				const marginBottom = form.getElm('marginBottom');
				expect(marginBottom.getAttribute('disabled')).equals('true');
			});

			it('Should enable margin inputs for left, bottom, right if element has not equals margins(margin:10px 5px;)', async () => {
				const editor = getJodit({
					history: {
						timeout: 0
					},
					image: {
						openOnDblClick: true
					}
				});
				editor.value =
					'<img alt="artio" src="https://xdsoft.net/jodit/files/artio.jpg" style="margin:10px 5px;border:1px solid red;width:100px;height:100px;"/>';

				const img = editor.editor.querySelector('img');
				await img.decode();
				simulateEvent('dblclick', img);

				const dialog = getOpenedDialog(editor);
				const form = getForm(dialog);
				const marginBottom = form.getElm('marginBottom');

				expect(dialog.style.display).does.not.equal('none');
				expect(marginBottom.getAttribute('disabled')).is.null;
			});
		});
	});
});
