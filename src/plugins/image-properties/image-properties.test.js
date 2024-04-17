/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Edit image tests', () => {
	const IMAGE = '<img alt="artio" src="tests/artio.jpg"/>';
	const { refs, css } = Jodit.modules.Helpers;

	describe('Image properties dialog', () => {
		describe('Double-click on image', () => {
			it('should open image properties dialog', () => {
				const editor = getJodit();

				editor.value = IMAGE;

				simulateEvent('dblclick', editor.editor.querySelector('img'));

				const dialog = getOpenedDialog(editor);

				expect(dialog).is.not.null;
			});

			describe.only('Editor props and click button', () => {
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
							'<p><img alt="Diff art" src="tests/artio.jpg"></p>'
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
				['editImage', 'editImage'],
				['changeImage', 'changeImage'],
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

						const refElms = refs(dialog);
						expect(css(refElms[ref], 'display')).not.equals('none');
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

						const refElms = refs(dialog);
						expect(css(refElms[ref], 'display')).equals('none');
					});
				});
			});
		});

		describe('Change border radius', () => {
			it('should change image border radius', () => {
				const editor = getJodit();

				editor.value =
					'<img style="width:100px; height: 100px; border-radius: 10px;" src="tests/artio.jpg"/>';

				simulateEvent(
					'dblclick',

					editor.editor.querySelector('img')
				);

				const dialog = getOpenedDialog(editor);

				expect(dialog).is.not.null;

				simulateEvent(
					'click',

					dialog.querySelectorAll('.jodit-tabs__buttons button')[1]
				);

				const tab = dialog.querySelector('.jodit-tab.jodit-tab_active');
				expect(tab).is.not.null;

				const input = tab.querySelector('[data-ref="borderRadius"]');
				expect(input).is.not.null;

				expect(input.value.toString()).equals('10');

				input.value = 100;

				clickButton('ok', dialog);

				expect(sortAttributes(editor.value)).equals(
					'<p><img src="tests/artio.jpg" style="border-radius:100px;height:100px;width:100px"></p>'
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

				simulateEvent(
					'click',

					dialog.querySelectorAll('.jodit-tabs__buttons button')[1]
				);

				const tab = dialog.querySelector('.jodit-tab.jodit-tab_active');
				expect(tab).is.not.null;

				const input = tab.querySelector('[data-ref="classes"]');
				expect(input).is.not.null;

				expect(input.value.toString()).equals('images123');

				input.value = 'tavble ';
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

				simulateEvent(
					'click',
					dialog.querySelectorAll('.jodit-tabs__buttons button')[1]
				);

				const tab = dialog.querySelector('.jodit-tab.jodit-tab_active');
				expect(tab).is.not.null;

				const input = tab.querySelector('[data-ref="style"]');
				expect(input).is.not.null;

				expect(sortStyles(input.value.toString())).equals(
					'height:100px;padding:10px;width:100px'
				);

				input.value = 'padding:20px;background-color: #ff0000;';
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

				expect(dialog).is.not.null;

				simulateEvent(
					'click',
					dialog.querySelectorAll('.jodit-tabs__buttons button')[1]
				);

				const tab = dialog.querySelector('.jodit-tab.jodit-tab_active');
				expect(tab).is.not.null;

				const input = tab.querySelector('[data-ref="id"]');
				expect(input).is.not.null;

				expect(input.value.toString()).equals('stop123');

				input.value = 'fast12';
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

					simulateEvent(
						'click',
						dialog.querySelectorAll(
							'.jodit-tabs__buttons button'
						)[1]
					);

					const tab = dialog.querySelector(
						'.jodit-tab.jodit-tab_active'
					);
					expect(tab).is.not.null;

					const input = tab.querySelector('[data-ref="align"]');
					expect(input).is.not.null;

					expect(input.value.toString()).equals('');

					input.value = 'left';
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

					simulateEvent(
						'click',
						dialog.querySelectorAll(
							'.jodit-tabs__buttons button'
						)[1]
					);

					const tab = dialog.querySelector(
						'.jodit-tab.jodit-tab_active'
					);
					expect(tab).is.not.null;

					const input = tab.querySelector('[data-ref="align"]');
					expect(input).is.not.null;

					expect(input.value.toString()).equals('');

					input.value = 'right';
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

					simulateEvent(
						'click',
						dialog.querySelectorAll(
							'.jodit-tabs__buttons button'
						)[1]
					);

					const tab = dialog.querySelector(
						'.jodit-tab.jodit-tab_active'
					);
					expect(tab).is.not.null;

					const input = tab.querySelector('[data-ref="align"]');
					expect(input).is.not.null;
					expect(input.value.toString()).equals('left');

					input.value = 'center';
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

					simulateEvent(
						'click',
						dialog.querySelectorAll(
							'.jodit-tabs__buttons button'
						)[1]
					);

					const tab = dialog.querySelector(
						'.jodit-tab.jodit-tab_active'
					);
					expect(tab).is.not.null;

					const input = tab.querySelector('[data-ref="align"]');
					expect(input).is.not.null;

					expect(input.value.toString()).equals('center');

					input.value = '';
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

					simulateEvent(
						'click',
						dialog.querySelectorAll(
							'.jodit-tabs__buttons button'
						)[1]
					);

					const tab = dialog.querySelector(
						'.jodit-tab.jodit-tab_active'
					);

					const marginTop = tab.querySelector(
						'[data-ref="marginTop"]'
					);

					expect(marginTop).is.not.null;

					const marginBottom = tab.querySelector(
						'[data-ref="marginBottom"]'
					);
					expect(marginBottom).is.not.null;

					expect(marginTop.value).equals('10');

					expect(marginBottom.hasAttribute('disabled')).is.true;

					marginTop.value = 100;
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

					simulateEvent(
						'click',
						dialog.querySelectorAll(
							'.jodit-tabs__buttons button'
						)[1]
					);

					const {
						marginBottom,
						marginTop,
						marginLeft,
						marginRight,
						lockMargin
					} = Jodit.modules.Helpers.refs(dialog);

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
					marginBottom.value = 10;
					marginRight.value = 20;
					marginLeft.value = 220;

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

				const tab = dialog.querySelector('.jodit-tab.jodit-tab_active');

				expect(tab).is.not.null;
				expect(tab.querySelector('[data-ref="imageTitle"]')).is.not
					.null;
				expect(
					tab.querySelector('[data-ref="imageTitle"]').value
				).equals('sting');

				dialog.querySelector('[data-ref="imageTitle"]').value = 'Stop';
				clickButton('ok', dialog);

				expect(sortAttributes(editor.value)).equals(
					'<p><img src="tests/artio.jpg" style="height:100px;width:100px" title="Stop"></p>'
				);
			});
		});

		describe('Change alt', () => {
			it('should change image alt', function (done) {
				const editor = getJodit();
				const image = new Image();
				const doTest = () => {
					editor.value =
						'<img alt="test" style="width:100px; height: 100px;" src="tests/artio.jpg"/>';

					simulateEvent(
						'dblclick',
						editor.editor.querySelector('img')
					);

					const dialog = getOpenedDialog(editor);

					const tab = dialog.querySelector(
						'.jodit-tab.jodit-tab_active'
					);

					expect(tab).is.not.null;
					expect(
						tab.querySelector('[data-ref="imageAlt"]')
					).does.not.equal(null);
					expect(
						tab.querySelector('[data-ref="imageAlt"]').value
					).equals('test');

					dialog.querySelector('[data-ref="imageAlt"]').value =
						'Stop';
					clickButton('ok', dialog);

					expect(sortAttributes(editor.value)).equals(
						'<p><img alt="Stop" src="tests/artio.jpg" style="height:100px;width:100px"></p>'
					);
					done();
				};

				image.src = 'tests/artio.jpg';

				onLoadImage(image, doTest);
			});
		});

		describe('Change link', () => {
			it('should change image wrapper', () => {
				const editor = getJodit();

				editor.value =
					'<img  style="width:100px; height: 100px;"  src="tests/artio.jpg"/>';

				simulateEvent('dblclick', editor.editor.querySelector('img'));

				const dialog = getOpenedDialog(editor);

				const tab = dialog.querySelector('.jodit-tab.jodit-tab_active');

				expect(tab).is.not.null;
				expect(tab.querySelector('[data-ref="imageLink"]')).is.not.null;
				expect(
					tab.querySelector('[data-ref="imageLink"]').value
				).equals('');

				dialog.querySelector('[data-ref="imageLink"]').value =
					'https://xdsoft.net/';

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
					const tab = dialog.querySelector(
						'.jodit-tab.jodit-tab_active'
					);

					expect(tab).is.not.null;
					expect(tab.querySelector('[data-ref="imageLink"]')).is.not
						.null;
					expect(
						tab.querySelector('[data-ref="imageLink"]').value
					).equals('');

					dialog.querySelector('[data-ref="imageLink"]').value =
						'https://xdsoft.net/';
					dialog.querySelector(
						'[data-ref="imageLinkOpenInNewTab"]'
					).checked = true;

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
					const tab = dialog.querySelector(
						'.jodit-tab.jodit-tab_active'
					);

					expect(tab).is.not.null;
					expect(tab.querySelector('[data-ref="imageLink"]')).is.not
						.null;
					expect(
						tab.querySelector('[data-ref="imageLink"]').value
					).equals('https://xdan.ru');
					expect(
						tab.querySelector('[data-ref="imageLinkOpenInNewTab"]')
							.checked
					).is.true;

					dialog.querySelector('[data-ref="imageLink"]').value =
						'https://xdsoft.net/';
					dialog.querySelector(
						'[data-ref="imageLinkOpenInNewTab"]'
					).checked = false;

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
					const tab = dialog.querySelector(
						'.jodit-tab.jodit-tab_active'
					);

					expect(tab).is.not.null;
					expect(tab.querySelector('[data-ref="imageLink"]')).is.not
						.null;
					expect(
						tab.querySelector('[data-ref="imageLink"]').value
					).equals('https://xdan.ru');
					expect(
						tab.querySelector('[data-ref="imageLinkOpenInNewTab"]')
							.checked
					).is.true;

					dialog.querySelector('[data-ref="imageLink"]').value = '';
					dialog.querySelector(
						'[data-ref="imageLinkOpenInNewTab"]'
					).checked = false;

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
					let editor, img, refs, dialog;
					beforeEach(async () => {
						editor = getJodit();

						editor.value = '<p><img src="tests/artio.jpg"/></p>';
						img = editor.editor.querySelector('img');

						await img.decode();

						simulateEvent('dblclick', img);

						dialog = getOpenedDialog(editor);

						refs = Jodit.modules.Helpers.refs(dialog);
					});

					describe('were not changed', () => {
						it('should not set style', () => {
							expect(refs.imageWidth.value).equals(
								img.offsetWidth.toString()
							);
							expect(refs.imageHeight.value).equals(
								img.offsetHeight.toString()
							);
							expect(
								refs.lockSize.classList.contains(
									'jodit-properties__lock'
								)
							).is.true;

							clickButton('Apply', dialog);

							expect(sortAttributes(editor.value)).equals(
								'<p><img src="tests/artio.jpg"></p>'
							);
						});
					});

					describe('were changed', () => {
						it('should set correct style', () => {
							refs.imageWidth.value = 100;
							simulateEvent('change', refs.imageWidth);

							clickButton('Apply', dialog);

							expect(sortAttributes(editor.value)).equals(
								'<p><img src="tests/artio.jpg" style="height:56px;width:100px"></p>'
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

					const { imageWidth, imageHeight, lockSize } =
						Jodit.modules.Helpers.refs(dialog);

					expect(imageWidth).is.not.null;
					expect(imageHeight).is.not.null;

					expect(imageWidth.value).equals(img.offsetWidth.toString());
					expect(imageHeight.value).equals(
						img.offsetHeight.toString()
					);

					expect(
						lockSize.classList.contains('jodit-properties__lock')
					).is.true;

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
						'<p><img src="tests/artio.jpg" style="height:200px;width:356px"></p>'
					);
				});

				describe('image has width in attributes', () => {
					it('should put this width in input, inside height should be auto', function (done) {
						const area = appendTestArea();
						const editor = Jodit.make(area);

						editor.value =
							'<img width="100px" src="tests/artio.jpg"/>';

						const img = editor.editor.querySelector('img');

						const callback = () => {
							simulateEvent('dblclick', img);

							expect(area.id).equals(editor.id);

							const dialog = getOpenedDialog(editor);

							const { imageWidth, imageHeight } =
								Jodit.modules.Helpers.refs(dialog);

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
								'<p><img src="tests/artio.jpg" style="height:200px;width:356px" width="356"></p>'
							);

							done();
						};

						onLoadImage(img, callback);
					});

					describe('same in style', () => {
						it('should put this width in input, inside height should be auto', function (done) {
							const area = appendTestArea();
							const editor = Jodit.make(area);

							editor.value =
								'<img style="width:100px" src="tests/artio.jpg"/>';

							const img = editor.editor.querySelector('img');

							const callback = () => {
								simulateEvent('dblclick', img);

								expect(area.id).equals(editor.id);

								const dialog = getOpenedDialog(editor);

								const { imageWidth, imageHeight, lockSize } =
									Jodit.modules.Helpers.refs(dialog);

								expect(imageWidth.value).equals('100');
								expect(imageHeight.value).equals('56');
								expect(
									lockSize.classList.contains(
										'jodit-properties__lock'
									)
								).is.true;

								imageWidth.value = 200;
								simulateEvent('change', imageWidth);

								expect(imageHeight.value).equals('112');

								imageHeight.value = 200;
								simulateEvent('change', imageHeight);
								expect(imageWidth.value).equals('356');

								clickButton('ok', dialog);

								expect(sortAttributes(editor.value)).equals(
									'<p><img src="tests/artio.jpg" style="height:200px;width:356px"></p>'
								);

								done();
							};

							onLoadImage(img, callback);
						});

						describe('Attributes has not pixel value', () => {
							it('should put these values in inputs', function (done) {
								const area = appendTestArea();
								const editor = Jodit.make(area);

								editor.value =
									'<img style="width:100%;height:30rem" src="tests/artio.jpg"/>';

								const img = editor.editor.querySelector('img');

								const callback = () => {
									simulateEvent('dblclick', img);

									expect(area.id).equals(editor.id);

									const dialog = getOpenedDialog(editor);

									const {
										imageWidth,
										imageHeight,
										lockSize
									} = Jodit.modules.Helpers.refs(dialog);

									expect(imageWidth.value).equals('100%');
									expect(imageHeight.value).equals('30rem');
									expect(
										lockSize.classList.contains(
											'jodit-properties__unlock'
										)
									).is.true;

									clickButton('ok', dialog);

									expect(sortAttributes(editor.value)).equals(
										'<p><img src="tests/artio.jpg" style="height:30rem;width:100%"></p>'
									);

									done();
								};

								onLoadImage(img, callback);
							});
						});
					});
				});

				describe('image has width and height attributes', () => {
					it('should put these attributes in inputs and lock button should be switch off', function (done) {
						const area = appendTestArea();
						const editor = Jodit.make(area);

						editor.value =
							'<img width="100px" height="200px" src="tests/artio.jpg"/>';

						const img = editor.editor.querySelector('img');

						const callback = () => {
							simulateEvent('dblclick', img);

							expect(area.id).equals(editor.id);

							const dialog = getOpenedDialog(editor);

							const { imageWidth, imageHeight, lockSize } =
								Jodit.modules.Helpers.refs(dialog);

							expect(imageWidth.value).equals('100');
							expect(imageHeight.value).equals('200');

							expect(
								lockSize.classList.contains(
									'jodit-properties__unlock'
								)
							).is.true;

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

							done();
						};

						onLoadImage(img, callback);
					});

					describe('same in style', () => {
						it('should put these values in inputs and lock button should be switch off', function (done) {
							const area = appendTestArea();
							const editor = Jodit.make(area);

							editor.value =
								'<img style="width:100px;height:200px" src="tests/artio.jpg"/>';

							const img = editor.editor.querySelector('img');

							const callback = () => {
								simulateEvent('dblclick', img);

								expect(area.id).equals(editor.id);

								const dialog = getOpenedDialog(editor);

								const { imageWidth, imageHeight, lockSize } =
									Jodit.modules.Helpers.refs(dialog);

								expect(imageWidth.value).equals('100');
								expect(imageHeight.value).equals('200');

								expect(
									lockSize.classList.contains(
										'jodit-properties__unlock'
									)
								).is.true;

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

								done();
							};

							onLoadImage(img, callback);
						});
					});
				});
			});

			describe('unlock ratio', () => {
				it('should create inputs with width and height', function (done) {
					const editor = getJodit();

					editor.value = IMAGE;
					const img = editor.editor.querySelector('img');

					const callback = () => {
						simulateEvent('dblclick', img);

						const dialog = getOpenedDialog(editor);

						expect(dialog).is.not.null;

						const { imageWidth, imageHeight, lockSize } =
							Jodit.modules.Helpers.refs(dialog);

						expect(lockSize).is.not.null;
						expect(imageWidth).is.not.null;
						expect(imageHeight).is.not.null;

						expect(imageWidth.value).equals(
							img.offsetWidth.toString()
						);
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
							'<p><img src="tests/artio.jpg" style="height:200px;width:100px"></p>'
						);

						done();
					};

					onLoadImage(img, callback);
				});

				describe('For no proportional value', () => {
					it('should not create connected size inputs', function (done) {
						const editor = getJodit();

						editor.value =
							'<img width="45px" height="212px" src="tests/artio.jpg"/>';
						const img = editor.editor.querySelector('img');

						const callback = () => {
							simulateEvent('dblclick', img);

							const dialog = getOpenedDialog(editor);

							expect(dialog).is.not.null;

							const { lockSize } =
								Jodit.modules.Helpers.refs(dialog);

							expect(
								lockSize.classList.contains(
									'jodit-properties__unlock'
								)
							).is.true;

							done();
						};

						onLoadImage(img, callback);
					});
				});

				describe('Toggle ratio again', () => {
					it('should create connected inputs with width and height', function (done) {
						const editor = getJodit();

						editor.value = IMAGE;
						const img = editor.editor.querySelector('img');

						const callback = () => {
							simulateEvent('dblclick', img);

							const dialog = getOpenedDialog(editor);
							expect(dialog).is.not.null;

							const { imageWidth, imageHeight, lockSize } =
								Jodit.modules.Helpers.refs(dialog);

							const lockerimg = lockSize.innerHTML;

							simulateEvent('click', lockSize);
							expect(lockSize.innerHTML).does.not.equal(
								lockerimg
							);
							simulateEvent('click', lockSize);
							expect(lockSize.innerHTML).equals(lockerimg);

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
								'<p><img src="tests/artio.jpg" style="height:200px;width:356px"></p>'
							);

							done();
						};

						onLoadImage(img, callback);
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

					const fb = dialog.querySelector('[data-ref="changeImage"]');
					expect(fb).is.not.null;

					const edit = dialog.querySelector(
						'[data-ref="changeImage"]'
					);
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

				it('should show buttons', () => {
					const editor = Jodit.make(appendTestArea(), settings);

					editor.value = IMAGE;
					simulateEvent(
						'dblclick',
						editor.editor.querySelector('img')
					);

					const dialog = getOpenedDialog(editor);

					expect(dialog.querySelector('[data-ref="changeImage"]')).is
						.not.null;

					expect(dialog.querySelector('[data-ref="changeImage"]')).is
						.not.null;
				});

				describe('Click on image button', () => {
					let editor;
					let imagePropertiesDialog;

					beforeEach(() => {
						editor = getJodit(settings);

						editor.value = IMAGE;

						simulateEvent(
							'dblclick',
							editor.editor.querySelector('img')
						);

						imagePropertiesDialog = getOpenedDialog(editor);

						const reChange = imagePropertiesDialog.querySelector(
							'[data-ref="changeImage"]'
						);

						expect(reChange).is.not.null;
						simulateEvent('click', reChange);
					});

					it('should open popup', () => {
						expect(getOpenedPopup(editor)).is.not.null;
					});

					describe('Click on file browser button', () => {
						it('should open file browser', () => {
							const popup = getOpenedPopup(editor);
							clickButton('Browse', popup);

							const fb = getOpenedDialog(editor);
							expect(fb).is.not.null;
							expect(fb).does.not.equal(imagePropertiesDialog);
						});

						describe('Select image', () => {
							let fb, dialog;
							beforeEach(() => {
								const popup = getOpenedPopup(editor);
								clickButton('Browse', popup);

								[fb, dialog] = getFB(editor);

								simulateEvent('click', getFirstFBItem(fb));
								clickButton('select', dialog);
							});

							it('should change image only inside dialog', () => {
								const { imageSrc } = Jodit.modules.Helpers.refs(
									imagePropertiesDialog
								);
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
									'<p><img alt="artio" src="https://xdsoft.net/jodit/files/ibanez-s520-443140.jpg"></p>'
								);
							});
						});
					});
				});

				describe('Click on edit button', () => {
					describe('When photo it is not my', () => {
						it('should open image editor', function (done) {
							const editor = Jodit.make(
								appendTestArea(),
								settings
							);

							editor.value =
								'<img src="https://xdsoft.net/jodit/files/artio.jpg"/>';

							simulateEvent(
								'dblclick',
								editor.editor.querySelector('img')
							);

							const dialog = getOpenedDialog(editor);

							expect(dialog).is.not.null;

							const edi = dialog.querySelector(
								'[data-ref="editImage"]'
							);
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

							const { imageSrc } = refs(dialog);
							expect(imageSrc.value).equals(
								'https://xdsoft.net/jodit/files/artio.jpg'
							);

							done();
						});
					});
				});
			});
		});
	});

	describe('Classes', () => {
		describe('No available classes defined', () => {
			it('Should render as input box', () => {
				const area = appendTestArea();
				const editor = Jodit.make(area, {
					history: {
						timeout: 0
					},
					disablePlugins: 'mobile'
				});

				editor.value =
					'<img alt="" src="https://xdsoft.net/jodit/files/th.jpg">';

				simulateEvent('dblclick', editor.editor.querySelector('img'));

				const dialog = getOpenedDialog(editor);

				expect(dialog).is.not.null;

				const { editImage, classes } = refs(dialog);

				expect(editImage).is.not.null;

				expect(classes.tagName).equals('INPUT');
			});
		});

		describe('Available classes defined', () => {
			it('Should render as select box', () => {
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

				simulateEvent('dblclick', editor.editor.querySelector('img'));

				const dialog = getOpenedDialog(editor);

				expect(dialog).is.not.null;
				expect(
					dialog.querySelectorAll('[data-ref="editImage"]').length
				).equals(1);

				const { classes } = refs(dialog);
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
});
