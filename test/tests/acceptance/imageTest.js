describe('Test image', function() {
	describe('Image properties dialog', function() {
		describe('Double click on image', function() {
			it('should open image properties dialog', function() {
				const editor = new Jodit(appendTestArea());

				editor.value = '<img src="tests/artio.jpg"/>';
				simulateEvent(
					'dblclick',
					0,
					editor.editor.querySelector('img')
				);
				const dialog = editor.ownerDocument.querySelector(
					'.jodit.jodit_dialog_box.active[data-editor_id=' +
						editor.id +
						']'
				);

				expect(dialog).is.not.null;
			});

			describe('Disable by image.openOnDblClick', function() {
				it('should not open image properties dialog', function() {
					const editor = new Jodit(appendTestArea(), {
						image: {
							openOnDblClick: false
						}
					});

					editor.value = '<img src="tests/artio.jpg"/>';
					simulateEvent(
						'dblclick',
						0,
						editor.editor.querySelector('img')
					);
					const dialog = editor.ownerDocument.querySelector(
						'.jodit.jodit_dialog_box.active[data-editor_id=' +
							editor.id +
							']'
					);

					expect(dialog).is.null;
				});
			});
		});

		describe('Change border radius', function() {
			it('should change image border radius', function() {
				const editor = new Jodit(appendTestArea());

				editor.value =
					'<img style="width:100px; height: 100px; border-radius: 10px;" src="tests/artio.jpg"/>';

				simulateEvent(
					'dblclick',
					0,
					editor.editor.querySelector('img')
				);

				const dialog = editor.ownerDocument.querySelector(
					'.jodit.jodit_dialog_box.active[data-editor_id=' +
						editor.id +
						']'
				);

				expect(dialog).is.not.null;

				simulateEvent(
					'mousedown',
					0,
					dialog.querySelectorAll('.jodit_tabs_buttons a')[1]
				);

				const tab = dialog.querySelector('.jodit_tab.active');
				expect(tab).is.not.null;
				expect(tab.querySelector('.border_radius')).does.not.equal(
					null
				);

				expect(
					tab.querySelector('.border_radius').value.toString()
				).equals('10');

				tab.querySelector('.border_radius').value = 100;
				simulateEvent(
					'click',
					0,
					dialog.querySelectorAll(
						'.jodit_dialog_footer .jodit_button.jodit_status_success'
					)[0]
				);

				expect(sortAttributes(editor.value)).equals(
					'<img src="tests/artio.jpg" style="border-radius:100px;height:100px;width:100px">'
				);
			});
		});

		describe('Change classes', function() {
			it('should change image classlist', function() {
				const editor = new Jodit(appendTestArea());

				editor.value =
					'<img class="images123" style="width:100px; height: 100px;" src="tests/artio.jpg"/>';
				simulateEvent(
					'dblclick',
					0,
					editor.editor.querySelector('img')
				);
				const dialog = editor.ownerDocument.querySelector(
					'.jodit.jodit_dialog_box.active[data-editor_id=' +
						editor.id +
						']'
				);

				expect(dialog).is.not.null;

				simulateEvent(
					'mousedown',
					0,
					dialog.querySelectorAll('.jodit_tabs_buttons a')[1]
				);

				const tab = dialog.querySelector('.jodit_tab.active');
				expect(tab).is.not.null;
				expect(tab.querySelector('.classes')).is.not.null;

				expect(tab.querySelector('.classes').value.toString()).equals(
					'images123'
				);

				tab.querySelector('.classes').value = 'tavble ';
				simulateEvent(
					'click',
					0,
					dialog.querySelectorAll(
						'.jodit_dialog_footer .jodit_button.jodit_status_success'
					)[0]
				);

				expect(sortAttributes(editor.value)).equals(
					'<img class="tavble " src="tests/artio.jpg" style="height:100px;width:100px">'
				);
			});
		});

		describe('Change styles', function() {
			it('should change image styles', function() {
				const editor = new Jodit(appendTestArea());

				editor.value =
					'<img style="padding:10px;width:100px; height: 100px;" src="tests/artio.jpg"/>';
				simulateEvent(
					'dblclick',
					0,
					editor.editor.querySelector('img')
				);
				const dialog = editor.ownerDocument.querySelector(
					'.jodit.jodit_dialog_box.active[data-editor_id=' +
						editor.id +
						']'
				);

				expect(dialog).is.not.null;

				simulateEvent(
					'mousedown',
					0,
					dialog.querySelectorAll('.jodit_tabs_buttons a')[1]
				);

				const tab = dialog.querySelector('.jodit_tab.active');
				expect(tab).is.not.null;
				expect(tab.querySelector('.style')).is.not.null;

				expect(
					sortStyles(tab.querySelector('.style').value.toString())
				).equals('height:100px;padding:10px;width:100px');

				tab.querySelector('.style').value =
					'padding:20px;background-color: #ff0000;';
				simulateEvent(
					'click',
					0,
					dialog.querySelectorAll(
						'.jodit_dialog_footer .jodit_button.jodit_status_success'
					)[0]
				);

				expect(sortAttributes(editor.value)).equals(
					'<img src="tests/artio.jpg" style="background-color:#FF0000;height:100px;padding:20px;width:100px">'
				);
			});
		});

		describe('Change id', function() {
			it('should change image id', function() {
				const editor = new Jodit(appendTestArea());

				editor.value =
					'<img id="stop123"  style="width:100px; height: 100px;"  src="tests/artio.jpg"/>';
				simulateEvent(
					'dblclick',
					0,
					editor.editor.querySelector('img')
				);
				const dialog = editor.ownerDocument.querySelector(
					'.jodit.jodit_dialog_box.active[data-editor_id=' +
						editor.id +
						']'
				);

				expect(dialog).is.not.null;

				simulateEvent(
					'mousedown',
					0,
					dialog.querySelectorAll('.jodit_tabs_buttons a')[1]
				);

				const tab = dialog.querySelector('.jodit_tab.active');
				expect(tab).is.not.null;
				expect(tab.querySelector('.id')).is.not.null;

				expect(tab.querySelector('.id').value.toString()).equals(
					'stop123'
				);

				tab.querySelector('.id').value = 'fast12';
				simulateEvent(
					'click',
					0,
					dialog.querySelectorAll(
						'.jodit_dialog_footer .jodit_button.jodit_status_success'
					)[0]
				);

				expect(sortAttributes(editor.value)).equals(
					'<img id="fast12" src="tests/artio.jpg" style="height:100px;width:100px">'
				);
			});
		});

		describe('Change align', function() {
			describe('left', function() {
				it('should change image horizontal align', function() {
					const editor = new Jodit(appendTestArea());

					editor.value =
						'<img  style="width:100px; height: 100px;"  src="tests/artio.jpg"/>';
					simulateEvent(
						'dblclick',
						0,
						editor.editor.querySelector('img')
					);
					const dialog = editor.ownerDocument.querySelector(
						'.jodit.jodit_dialog_box.active[data-editor_id=' +
							editor.id +
							']'
					);

					simulateEvent(
						'mousedown',
						0,
						dialog.querySelectorAll('.jodit_tabs_buttons a')[1]
					);

					const tab = dialog.querySelector('.jodit_tab.active');
					expect(tab).is.not.null;
					expect(tab.querySelector('.align')).is.not.null;

					expect(tab.querySelector('.align').value.toString()).equals(
						''
					);

					tab.querySelector('.align').value = 'left';
					simulateEvent(
						'click',
						0,
						dialog.querySelectorAll(
							'.jodit_dialog_footer .jodit_button.jodit_status_success'
						)[0]
					);

					expect(sortAttributes(editor.value)).equals(
						'<img src="tests/artio.jpg" style="float:left;height:100px;width:100px">'
					);
				});
			});
			describe('right', function() {
				it('should change image horizontal align', function() {
					const editor = new Jodit(appendTestArea());

					editor.value =
						'<img  style="width:100px; height: 100px;"  src="tests/artio.jpg"/>';
					simulateEvent(
						'dblclick',
						0,
						editor.editor.querySelector('img')
					);
					const dialog = editor.ownerDocument.querySelector(
						'.jodit.jodit_dialog_box.active[data-editor_id=' +
							editor.id +
							']'
					);

					simulateEvent(
						'mousedown',
						0,
						dialog.querySelectorAll('.jodit_tabs_buttons a')[1]
					);

					const tab = dialog.querySelector('.jodit_tab.active');
					expect(tab).is.not.null;
					expect(tab.querySelector('.align')).is.not.null;

					expect(tab.querySelector('.align').value.toString()).equals(
						''
					);

					tab.querySelector('.align').value = 'right';
					simulateEvent(
						'click',
						0,
						dialog.querySelectorAll(
							'.jodit_dialog_footer .jodit_button.jodit_status_success'
						)[0]
					);

					expect(sortAttributes(editor.value)).equals(
						'<img src="tests/artio.jpg" style="float:right;height:100px;width:100px">'
					);
				});
			});
			describe('center', function() {
				it('should change image horizontal align', function() {
					const editor = new Jodit(appendTestArea());

					editor.value =
						'<img style="float:left;width:100px; height: 100px;" src="tests/artio.jpg"/>';
					simulateEvent(
						'dblclick',
						0,
						editor.editor.querySelector('img')
					);
					const dialog = editor.ownerDocument.querySelector(
						'.jodit.jodit_dialog_box.active[data-editor_id=' +
							editor.id +
							']'
					);

					simulateEvent(
						'mousedown',
						0,
						dialog.querySelectorAll('.jodit_tabs_buttons a')[1]
					);

					const tab = dialog.querySelector('.jodit_tab.active');
					expect(tab).is.not.null;
					expect(tab.querySelector('.align')).is.not.null;

					expect(tab.querySelector('.align').value.toString()).equals(
						'left'
					);

					tab.querySelector('.align').value = 'center';
					simulateEvent(
						'click',
						0,
						dialog.querySelectorAll(
							'.jodit_dialog_footer .jodit_button.jodit_status_success'
						)[0]
					);

					expect(sortAttributes(editor.value)).equals(
						'<img src="tests/artio.jpg" style="display:block;height:100px;margin-left:auto;margin-right:auto;width:100px">'
					);
				});
			});
			describe('Clear align', function() {
				it('should clear some align', function() {
					const editor = new Jodit(appendTestArea());

					editor.value =
						'<img src="tests/artio.jpg" style="width:100px; height: 100px;display:block;margin-left:auto;margin-right:auto">';
					simulateEvent(
						'dblclick',
						0,
						editor.editor.querySelector('img')
					);
					const dialog = editor.ownerDocument.querySelector(
						'.jodit.jodit_dialog_box.active[data-editor_id=' +
							editor.id +
							']'
					);

					simulateEvent(
						'mousedown',
						0,
						dialog.querySelectorAll('.jodit_tabs_buttons a')[1]
					);

					const tab = dialog.querySelector('.jodit_tab.active');
					expect(tab).is.not.null;
					expect(tab.querySelector('.align')).is.not.null;

					expect(tab.querySelector('.align').value.toString()).equals(
						'center'
					);

					tab.querySelector('.align').value = '';
					simulateEvent(
						'click',
						0,
						dialog.querySelectorAll(
							'.jodit_dialog_footer .jodit_button.jodit_status_success'
						)[0]
					);

					expect(sortAttributes(editor.value)).equals(
						'<img src="tests/artio.jpg" style="height:100px;width:100px">'
					);
				});
			});
		});

		describe('Change margins', function() {
			describe('Change marginTop with lock', function() {
				it('should change all margins', function() {
					const editor = new Jodit(appendTestArea());

					editor.value =
						'<img style="margin: 10px;width:100px; height: 100px;" src="tests/artio.jpg"/>';
					simulateEvent(
						'dblclick',
						0,
						editor.editor.querySelector('img')
					);
					const dialog = editor.ownerDocument.querySelector(
						'.jodit.jodit_dialog_box.active[data-editor_id=' +
							editor.id +
							']'
					);

					simulateEvent(
						'mousedown',
						0,
						dialog.querySelectorAll('.jodit_tabs_buttons a')[1]
					);

					const tab = dialog.querySelector('.jodit_tab.active');

					expect(tab.querySelector('.marginTop')).does.not.equal(
						null
					);
					expect(tab.querySelector('.marginBottom')).does.not.equal(
						null
					);

					expect(
						tab.querySelector('.marginTop').value.toString()
					).equals('10');
					expect(
						tab
							.querySelector('.marginBottom')
							.hasAttribute('disabled')
					).is.true;

					tab.querySelector('.marginTop').value = 100;
					simulateEvent(
						'click',
						0,
						dialog.querySelectorAll(
							'.jodit_dialog_footer .jodit_button.jodit_status_success'
						)[0]
					);

					expect(sortAttributes(editor.value)).equals(
						'<img src="tests/artio.jpg" style="height:100px;margin:100px;width:100px">'
					);
				});
			});
			describe('Change marginTop with unlock', function() {
				it('should change only marginTop', function() {
					const editor = new Jodit(appendTestArea());

					editor.value =
						'<img style="margin: 10px;width:100px; height: 100px;" src="tests/artio.jpg"/>';
					simulateEvent(
						'dblclick',
						0,
						editor.editor.querySelector('img')
					);
					const dialog = editor.ownerDocument.querySelector(
						'.jodit.jodit_dialog_box.active[data-editor_id=' +
							editor.id +
							']'
					);

					simulateEvent(
						'mousedown',
						0,
						dialog.querySelectorAll('.jodit_tabs_buttons a')[1]
					);

					const tab = dialog.querySelector('.jodit_tab.active');

					const locker = tab.querySelector(
						'.jodit_lock_helper.jodit_lock_margin'
					);
					expect(locker).is.not.null;
					const lockerimg = locker.innerHTML;
					simulateEvent('click', 0, locker);
					expect(locker.innerHTML).does.not.equal(lockerimg);

					expect(
						tab.querySelector('.marginTop').value.toString()
					).equals('10');
					expect(
						tab.querySelector('.marginBottom').value.toString()
					).equals('10');
					expect(
						tab.querySelector('.marginLeft').value.toString()
					).equals('10');
					expect(
						tab.querySelector('.marginRight').value.toString()
					).equals('10');
					expect(
						tab
							.querySelector('.marginBottom')
							.hasAttribute('disabled')
					).is.false;

					tab.querySelector('.marginTop').value = 100;
					tab.querySelector('.marginBottom').value = 10;
					tab.querySelector('.marginRight').value = 20;
					tab.querySelector('.marginLeft').value = 220;
					simulateEvent(
						'click',
						0,
						dialog.querySelectorAll(
							'.jodit_dialog_footer .jodit_button.jodit_status_success'
						)[0]
					);

					expect(sortAttributes(editor.value)).equals(
						'<img src="tests/artio.jpg" style="height:100px;margin:100px 20px 10px 220px;width:100px">'
					);
				});
			});
		});

		describe('Change title', function() {
			it('should change image title', function() {
				const editor = new Jodit(appendTestArea());

				editor.value =
					'<img title="sting" style="width:100px; height: 100px;" src="tests/artio.jpg"/>';
				simulateEvent(
					'dblclick',
					0,
					editor.editor.querySelector('img')
				);

				const dialog = editor.ownerDocument.querySelector(
					'.jodit.jodit_dialog_box.active[data-editor_id=' +
						editor.id +
						']'
				);
				const tab = dialog.querySelector('.jodit_tab.active');

				expect(tab).is.not.null;
				expect(tab.querySelector('.imageTitle')).is.not.null;
				expect(tab.querySelector('.imageTitle').value).equals('sting');

				dialog.querySelector('.imageTitle').value = 'Stop';
				simulateEvent(
					'click',
					0,
					dialog.querySelectorAll(
						'.jodit_dialog_footer .jodit_button.jodit_status_success'
					)[0]
				);

				expect(sortAttributes(editor.value)).equals(
					'<img src="tests/artio.jpg" style="height:100px;width:100px" title="Stop">'
				);
			});
		});

		describe('Change alt', function() {
			it('should change image alt', function(done) {
				const editor = new Jodit(appendTestArea());
				const image = new Image();
				const doTest = function() {
					editor.value =
						'<img alt="test" style="width:100px; height: 100px;" src="tests/artio.jpg"/>';
					simulateEvent(
						'dblclick',
						0,
						editor.editor.querySelector('img')
					);

					const dialog = editor.ownerDocument.querySelector(
						'.jodit.jodit_dialog_box.active[data-editor_id=' +
							editor.id +
							']'
					);
					const tab = dialog.querySelector('.jodit_tab.active');

					expect(tab).is.not.null;
					expect(tab.querySelector('.imageAlt')).does.not.equal(null);
					expect(tab.querySelector('.imageAlt').value).equals('test');

					dialog.querySelector('.imageAlt').value = 'Stop';
					simulateEvent(
						'click',
						0,
						dialog.querySelectorAll(
							'.jodit_dialog_footer .jodit_button.jodit_status_success'
						)[0]
					);

					expect(sortAttributes(editor.value)).equals(
						'<img alt="Stop" src="tests/artio.jpg" style="height:100px;width:100px">'
					);
					done();
				};

				image.src = 'tests/artio.jpg';

				onLoadImage(image, doTest);
			});
		});

		describe('Change link', function() {
			it('should change image wrapper', function() {
				const editor = new Jodit(appendTestArea());

				editor.value =
					'<img  style="width:100px; height: 100px;"  src="tests/artio.jpg"/>';
				simulateEvent(
					'dblclick',
					0,
					editor.editor.querySelector('img')
				);

				const dialog = editor.ownerDocument.querySelector(
					'.jodit.jodit_dialog_box.active[data-editor_id=' +
						editor.id +
						']'
				);
				const tab = dialog.querySelector('.jodit_tab.active');

				expect(tab).is.not.null;
				expect(tab.querySelector('.imageLink')).is.not.null;
				expect(tab.querySelector('.imageLink').value).equals('');

				dialog.querySelector('.imageLink').value =
					'https://xdsoft.net/';
				simulateEvent(
					'click',
					0,
					dialog.querySelectorAll(
						'.jodit_dialog_footer .jodit_button.jodit_status_success'
					)[0]
				);

				expect(sortAttributes(editor.value)).equals(
					'<a href="https://xdsoft.net/"><img src="tests/artio.jpg" style="height:100px;width:100px"></a>'
				);
			});
			describe('open link in new tab', function() {
				it('should change image wrapper with target="_blank"', function() {
					const editor = new Jodit(appendTestArea());

					editor.value =
						'<img style="width:100px; height: 100px;" src="tests/artio.jpg"/>';
					simulateEvent(
						'dblclick',
						0,
						editor.editor.querySelector('img')
					);

					const dialog = editor.ownerDocument.querySelector(
						'.jodit.jodit_dialog_box.active[data-editor_id=' +
							editor.id +
							']'
					);
					const tab = dialog.querySelector('.jodit_tab.active');

					expect(tab).is.not.null;
					expect(tab.querySelector('.imageLink')).does.not.equal(
						null
					);
					expect(tab.querySelector('.imageLink').value).equals('');

					dialog.querySelector('.imageLink').value =
						'https://xdsoft.net/';
					dialog.querySelector(
						'.imageLinkOpenInNewTab'
					).checked = true;

					simulateEvent(
						'click',
						0,
						dialog.querySelectorAll(
							'.jodit_dialog_footer .jodit_button.jodit_status_success'
						)[0]
					);

					expect(sortAttributes(editor.value)).equals(
						'<a href="https://xdsoft.net/" target="_blank"><img src="tests/artio.jpg" style="height:100px;width:100px"></a>'
					);
				});
			});
			describe('Open dialog dor image wrapped in link', function() {
				it('should change image wrapper', function() {
					const editor = new Jodit(appendTestArea());

					editor.value =
						'<a href="https://xdan.ru" target="_blank"><img  style="width:100px; height: 100px;"  src="tests/artio.jpg"/></a>';
					simulateEvent(
						'dblclick',
						0,
						editor.editor.querySelector('img')
					);

					const dialog = editor.ownerDocument.querySelector(
						'.jodit.jodit_dialog_box.active[data-editor_id=' +
							editor.id +
							']'
					);
					const tab = dialog.querySelector('.jodit_tab.active');

					expect(tab).is.not.null;
					expect(tab.querySelector('.imageLink')).does.not.equal(
						null
					);
					expect(tab.querySelector('.imageLink').value).equals(
						'https://xdan.ru'
					);
					expect(tab.querySelector('.imageLinkOpenInNewTab').checked)
						.is.true;

					dialog.querySelector('.imageLink').value =
						'https://xdsoft.net/';
					dialog.querySelector(
						'.imageLinkOpenInNewTab'
					).checked = false;

					simulateEvent(
						'click',
						0,
						dialog.querySelectorAll(
							'.jodit_dialog_footer .jodit_button.jodit_status_success'
						)[0]
					);

					expect(sortAttributes(editor.value)).equals(
						'<a href="https://xdsoft.net/"><img src="tests/artio.jpg" style="height:100px;width:100px"></a>'
					);
				});
			});
			describe('Unlink', function() {
				it('should remove image wrapper', function() {
					const editor = new Jodit(appendTestArea());

					editor.value =
						'<a href="https://xdan.ru" target="_blank"><img style="width:100px; height: 100px;" src="tests/artio.jpg"/></a>';
					simulateEvent(
						'dblclick',
						0,
						editor.editor.querySelector('img')
					);

					const dialog = editor.ownerDocument.querySelector(
						'.jodit.jodit_dialog_box.active[data-editor_id=' +
							editor.id +
							']'
					);
					const tab = dialog.querySelector('.jodit_tab.active');

					expect(tab).is.not.null;
					expect(tab.querySelector('.imageLink')).does.not.equal(
						null
					);
					expect(tab.querySelector('.imageLink').value).equals(
						'https://xdan.ru'
					);
					expect(tab.querySelector('.imageLinkOpenInNewTab').checked)
						.is.true;

					dialog.querySelector('.imageLink').value = '';
					dialog.querySelector(
						'.imageLinkOpenInNewTab'
					).checked = false;

					simulateEvent(
						'click',
						0,
						dialog.querySelectorAll(
							'.jodit_dialog_footer .jodit_button.jodit_status_success'
						)[0]
					);

					expect(sortAttributes(editor.value)).equals(
						'<img src="tests/artio.jpg" style="height:100px;width:100px">'
					);
				});
			});
		});

		describe('Change size', function() {
			describe('dblclick on image and open dialog', function() {
				it('should create inputs contains width and height', function(done) {
					const area = appendTestArea();
					const editor = new Jodit(area);

					editor.value = '<img src="tests/artio.jpg"/>';
					const img = editor.editor.querySelector('img');

					const callback = function() {
						simulateEvent('dblclick', 0, img);

						expect(area.id).equals(editor.id);

						const dialog = editor.ownerDocument.querySelector(
							'.jodit.jodit_dialog_box.active[data-editor_id=' +
								editor.id +
								']'
						);
						expect(dialog).is.not.null;

						const imageWidth = dialog.querySelector('.imageWidth');
						const imageHeight = dialog.querySelector(
							'.imageHeight'
						);

						expect(imageWidth).is.not.null;
						expect(imageHeight).is.not.null;

						expect(imageWidth.value).equals(
							img.offsetWidth.toString()
						);
						expect(imageHeight.value).equals(
							img.offsetHeight.toString()
						);

						imageWidth.value = 100;
						simulateEvent('change', 0, imageWidth);
						expect(imageHeight.value).does.not.equal(
							img.offsetHeight.toString()
						);

						imageHeight.value = 200;
						simulateEvent('change', 0, imageHeight);
						expect(imageWidth.value).does.not.equal('100');

						simulateEvent(
							'click',
							0,
							dialog.querySelectorAll(
								'.jodit_dialog_footer .jodit_button.jodit_status_success'
							)[0]
						);

						expect(sortAttributes(editor.value)).equals(
							'<img src="tests/artio.jpg" style="height:200px;width:356px">'
						);

						done();
					};

					onLoadImage(img, callback);
				});
			});

			describe('unlock ratio', function() {
				it('should create inputs with width and height', function(done) {
					const editor = new Jodit(appendTestArea());

					editor.value = '<img src="tests/artio.jpg"/>';
					const img = editor.editor.querySelector('img');

					const callback = function() {
						simulateEvent('dblclick', 0, img);

						const dialog = editor.ownerDocument.querySelector(
							'.jodit.jodit_dialog_box.active[data-editor_id=' +
								editor.id +
								']'
						);

						expect(dialog).is.not.null;

						const imageWidth = dialog.querySelector('.imageWidth');
						const imageHeight = dialog.querySelector(
							'.imageHeight'
						);
						const locker = dialog.querySelector(
							'.jodit_lock_helper.jodit_lock_size'
						);

						expect(locker).is.not.null;
						expect(imageWidth).is.not.null;
						expect(imageHeight).is.not.null;

						expect(imageWidth.value).equals(
							img.offsetWidth.toString()
						);
						expect(imageHeight.value).equals(
							img.offsetHeight.toString()
						);

						simulateEvent('click', 0, locker);

						imageWidth.value = 100;
						simulateEvent('change', 0, imageWidth);
						expect(imageHeight.value).equals(
							img.offsetHeight.toString()
						);

						imageHeight.value = 200;
						simulateEvent('change', 0, imageHeight);
						expect(imageWidth.value).equals('100');

						simulateEvent(
							'click',
							0,
							dialog.querySelectorAll(
								'.jodit_dialog_footer .jodit_button.jodit_status_success'
							)[0]
						);

						expect(sortAttributes(editor.value)).equals(
							'<img src="tests/artio.jpg" style="height:200px;width:100px">'
						);

						done();
					};

					onLoadImage(img, callback);
				});

				describe('Toggle ratio again', function() {
					it('should create connected inputs with width and height', function(done) {
						const editor = new Jodit(appendTestArea());

						editor.value = '<img src="tests/artio.jpg"/>';
						const img = editor.editor.querySelector('img');

						const callback = function() {
							simulateEvent('dblclick', 0, img);

							const dialog = editor.ownerDocument.querySelector(
								'.jodit.jodit_dialog_box.active[data-editor_id=' +
									editor.id +
									']'
							);
							expect(dialog).is.not.null;

							const imageWidth = dialog.querySelector(
								'.imageWidth'
							);
							const imageHeight = dialog.querySelector(
								'.imageHeight'
							);
							const locker = dialog.querySelector(
								'.jodit_lock_helper.jodit_lock_size'
							);
							const lockerimg = locker.innerHTML;

							simulateEvent('click', 0, locker);
							expect(locker.innerHTML).does.not.equal(lockerimg);
							simulateEvent('click', 0, locker);
							expect(locker.innerHTML).equals(lockerimg);

							imageWidth.value = 100;
							simulateEvent('change', 0, imageWidth);
							expect(imageHeight.value).does.not.equal(
								img.offsetHeight.toString()
							);

							imageHeight.value = 200;
							simulateEvent('change', 0, imageHeight);
							expect(imageWidth.value).does.not.equal('100');

							simulateEvent(
								'click',
								0,
								dialog.querySelectorAll(
									'.jodit_dialog_footer .jodit_button.jodit_status_success'
								)[0]
							);

							expect(sortAttributes(editor.value)).equals(
								'<img src="tests/artio.jpg" style="height:200px;width:356px">'
							);

							done();
						};

						onLoadImage(img, callback);
					});
				});
			});
		});

		describe('Show filebrowser buttons and edit image button', function() {
			describe("If uploader or filebrowser settings don't setted", function() {
				it('should not show buttons', function() {
					const editor = new Jodit(appendTestArea());

					editor.value = '<img src="tests/artio.jpg"/>';
					simulateEvent(
						'dblclick',
						0,
						editor.editor.querySelector('img')
					);
					const dialog = editor.ownerDocument.querySelector(
						'.jodit.jodit_dialog_box.active[data-editor_id=' +
							editor.id +
							']'
					);

					expect(dialog).is.not.null;

					const fb = dialog.querySelector(
						'.jodit_button.jodit_rechange'
					);
					expect(fb).is.not.null;

					const edit = dialog.querySelector(
						'.jodit_button.jodit_rechange'
					);
					expect(edit).is.not.null;

					expect(edit.parentNode.style.display).equals('none');
				});
			});

			describe('Uploader and filebrowser settings set', function() {
				const settings = {
					uploader: {
						url:
							'https://xdsoft.net/jodit/connector/index.php?action=fileUpload'
					},

					filebrowser: {
						// buttons: ['list', 'tiles', 'sort'],
						ajax: {
							url: 'https://xdsoft.net/jodit/connector/index.php'
						}
					}
				};

				it('should not show buttons', function() {
					const editor = new Jodit(appendTestArea(), settings);

					editor.value = '<img src="tests/artio.jpg"/>';
					simulateEvent(
						'dblclick',
						0,
						editor.editor.querySelector('img')
					);
					const dialog = editor.ownerDocument.querySelector(
						'.jodit.jodit_dialog_box.active[data-editor_id=' +
							editor.id +
							']'
					);

					expect(dialog.querySelector('.jodit_button.jodit_rechange'))
						.is.not.null;

					expect(
						dialog.querySelector(
							'.jodit_button.jodit_use_image_editor'
						)
					).is.not.null;
				});

				describe('Click on filebrowser button', function() {
					it('should open popup', function() {
						const editor = new Jodit(appendTestArea(), settings);

						editor.value = '<img src="tests/artio.jpg"/>';

						simulateEvent(
							'dblclick',
							0,
							editor.editor.querySelector('img')
						);

						const dialog = editor.ownerDocument.querySelector(
							'.jodit.jodit_dialog_box.active[data-editor_id=' +
								editor.id +
								']'
						);

						const rechange = dialog.querySelector(
							'.jodit_button.jodit_rechange'
						);

						expect(rechange).is.not.null;
						simulateEvent('mousedown', 0, rechange);
						expect(
							dialog.querySelector(
								'.jodit_toolbar_popup.jodit_toolbar_popup-open.jodit_right'
							)
						).is.not.null;
					});
				});
				describe('Click on edit button', function() {
					describe('When photo it is not my', function() {
						it('should open image editor', function(done) {
							const editor = new Jodit(
								appendTestArea(),
								settings
							);

							editor.value =
								'<img src="https://xdsoft.net/jodit/build/images/artio.jpg"/>';
							simulateEvent(
								'dblclick',
								0,
								editor.editor.querySelector('img')
							);

							const dialog = editor.ownerDocument.querySelector(
								'.jodit.jodit_dialog_box.active[data-editor_id=' +
									editor.id +
									']'
							);
							expect(dialog).is.not.null;

							const edi = dialog.querySelector(
								'.jodit_button.jodit_use_image_editor'
							);
							expect(edi).is.not.null;

							simulateEvent('mousedown', 0, edi);

							const dialog2 = editor.ownerDocument.querySelector(
								'.jodit.jodit_dialog_box.active.jodit_modal'
							);
							expect(dialog2).is.not.null;
							expect(dialog2).does.not.equal(dialog);

							simulateEvent(
								'click',
								0,
								dialog2.querySelector('a.jodit_button')
							);

							const dialog3 = editor.ownerDocument.querySelector(
								'.jodit.jodit_dialog_box.active.jodit_modal'
							);

							expect(dialog3).is.not.null;
							expect(dialog3).does.not.equal(dialog2);

							simulateEvent(
								'click',
								0,
								dialog3.querySelector('a.jodit_button')
							);

							const dialog4 = editor.ownerDocument.querySelector(
								'.jodit.jodit_dialog_box.active.jodit_modal'
							);

							expect(dialog4).is.not.null;
							expect(dialog4).does.not.equal(dialog3);

							simulateEvent(
								'click',
								0,
								dialog4.querySelector('a.jodit_button')
							);

							expect(
								dialog.querySelector('.imageSrc').value
							).equals(
								'https://xdsoft.net/jodit/files/artio.jpg'
							);

							done();
						});
					});
				});
			});
		});
	});

	it('Double click on image then openOnDblClick=false should select image', function() {
		const editor = new Jodit(appendTestArea(), {
			image: { openOnDblClick: false }
		});
		editor.value = '<img src="tests/artio.jpg"/>';

		simulateEvent('dblclick', 0, editor.editor.querySelector('img'));
		const dialogs = document.querySelectorAll(
			'.jodit.jodit_dialog_box.active'
		);

		expect(dialogs.length).equals(0);

		expect(editor.selection.current().tagName).equals('IMG');
	});

	describe('One click on image', function() {
		it('should show resizer', function() {
			const editor = new Jodit(appendTestArea());
			editor.value = '<img src="tests/artio.jpg"/>';

			const img = editor.editor.querySelector('img');

			simulateEvent('click', 0, img);

			const resizer = editor.ownerDocument.querySelector(
				'.jodit_resizer[data-editor_id=' + editor.id + ']'
			);

			expect(resizer).is.not.null;
		});

		describe('in full size mode', function() {
			it('should show resizer and set mmaximum zIndex', function() {
				const editor = new Jodit(appendTestArea(), {
					fullsize: true
				});
				editor.value = '<img src="tests/artio.jpg"/>';

				const img = editor.editor.querySelector('img');

				simulateEvent('click', 0, img);

				const resizer = document.querySelector(
					'.jodit_resizer[data-editor_id=' + editor.id + ']'
				);

				expect(resizer).is.not.null;
				expect(resizer.style.zIndex).equals(
					window.getComputedStyle(editor.container).zIndex
				);
			});
		});
	});

	it('One click inside table cell should show resizer', function() {
		const editor = new Jodit(appendTestArea());
		editor.value = '<table><tr><td>1</td></tr></table>';

		const td = editor.editor.querySelector('td');

		simulateEvent('click', 0, td);

		const resizer = document.querySelector(
			'.jodit_resizer[data-editor_id=' + editor.id + ']'
		);

		expect(resizer).is.not.null;
	});

	describe('Popup box', function() {
		describe('In relative object', function() {
			it('should be under image', function() {
				const div = document.createElement('div');
				div.innerHTML =
					'<div style="width:800px; margin:auto; border:1px solid red;">\n' +
					'        wrong image selection\n' +
					'        <div style="position:relative;text-align: left">\n' +
					'            <textarea id="text_area0"> <img src="https://xdsoft.net/jodit/build/images/artio.jpg" style="border:1px solid red;width:100px;height:100px;"/></textarea>\n' +
					'        </div>\n' +
					'    </div>';

				document.body.appendChild(div);
				const editor = new Jodit('#text_area0', {
					observer: {
						timeout: 0
					}
				});
				window.scrollTo(0, offset(div).top);
				simulateEvent(
					'mousedown',
					0,
					editor.editor.querySelector('img')
				);

				const popup = document.querySelector(
					'.jodit_toolbar_popup-inline[data-editor_id=text_area0]'
				);

				expect(popup.parentNode.parentNode !== null).is.true;

				const positionPopup = offset(popup.parentNode);
				const positionImg = offset(editor.editor.querySelector('img'));

				expect(
					Math.abs(
						positionPopup.left -
							(positionImg.left + positionImg.width / 2)
					) < 20
				).is.true;

				expect(
					Math.abs(
						positionPopup.top -
							(positionImg.top + positionImg.height)
					) < 20
				).is.true;

				editor.destruct();
				document.body.removeChild(div);
			});
		});
	});

	describe('Resize box', function() {
		describe('In relative object', function() {
			it('should be in front of image', function() {
				const div = document.createElement('div');
				div.innerHTML =
					'<div style="width:800px; margin:auto; border:1px solid red;">\n' +
					'        wrong image selection\n' +
					'        <div style="position:relative;text-align: left">\n' +
					'            <textarea id="text_area0"> <img src="https://xdsoft.net/jodit/build/images/artio.jpg" style="border:1px solid red;width:100px;height:100px;"/></textarea>\n' +
					'        </div>\n' +
					'    </div>';

				document.body.appendChild(div);

				const editor = new Jodit('#text_area0');
				simulateEvent('click', 0, editor.editor.querySelector('img'));

				const resizer = document.querySelector(
					'.jodit_resizer[data-editor_id=text_area0]'
				);
				expect(resizer).is.not.null;

				const positionResizer = offset(resizer);
				const positionImg = offset(editor.editor.querySelector('img'));

				expect(Math.abs(positionResizer.left - positionImg.left) < 2).is
					.true;
				expect(Math.abs(positionResizer.top - positionImg.top) < 2).is
					.true;

				editor.destruct();
				document.body.removeChild(div);
			});
		});
		describe('After resize - popup', function() {
			it('should be hidden and after this should be shown', function() {
				const div = document.createElement('div');
				div.innerHTML =
					'<div style="width:800px; margin:auto; border:1px solid red;">\n' +
					'        wrong image selection\n' +
					'        <div style="position:relative;text-align: left">\n' +
					'            <textarea id="text_area1"> &lt;img src="https://xdsoft.net/jodit/build/images/artio.jpg" style="border:1px solid red;width:100px;height:100px;"/&gt;</textarea>\n' +
					'        </div>\n' +
					'    </div>';

				document.body.appendChild(div);

				const editor = new Jodit(document.getElementById('text_area1'));
				simulateEvent(
					['mousedown', 'mouseup', 'click'],
					0,
					editor.editor.querySelector('img')
				);
				//
				const popup = editor.ownerDocument.querySelector(
					'.jodit_toolbar_popup-inline[data-editor_id=text_area1]'
				);
				//
				expect(popup.parentNode.parentNode !== null).is.true;
				//
				const resizer = editor.ownerDocument.querySelector(
					'.jodit_resizer[data-editor_id=text_area1]'
				);
				expect(resizer).is.not.null;
				//
				const positionResizer = offset(resizer);
				//
				simulateEvent(
					'mousedown',
					0,
					resizer.getElementsByTagName('i')[0]
				);
				simulateEvent('mousemove', 0, editor.ownerWindow, function(
					data
				) {
					data.clientX = positionResizer.left - 10;
					data.clientY = positionResizer.top - 10;
				});
				//
				expect(popup.parentNode).is.null;

				simulateEvent('mouseup', 0, editor.ownerWindow, function(data) {
					data.clientX = positionResizer.left - 10;
					data.clientY = positionResizer.top - 10;
				});

				expect(popup.parentNode).is.null;
				//
				editor.destruct();
				div.parentNode && div.parentNode.removeChild(div);
			});
		});
		describe('Resize image', function() {
			describe('Size box', function() {
				it('Should show size for image', function(done) {
					const editor = new Jodit(appendTestArea(), {
						observer: {
							timeout: 0
						},
						resizer: {
							hideSizeTimeout: 400
						}
					});
					editor.value =
						'<img src="tests/artio.jpg" style="width:500px;height: 281px;"/>';

					simulateEvent(
						['mousedown', 'mouseup', 'click'],
						0,
						editor.editor.querySelector('img')
					);

					const resizer = document.querySelector(
						'.jodit_resizer[data-editor_id=' + editor.id + ']'
					);
					expect(resizer).is.not.null;

					const sizer = resizer.querySelector('span');
					expect(sizer).is.not.null;
					expect(
						editor.ownerWindow.getComputedStyle(sizer).opacity
					).equals('0');

					const positionResizer = offset(resizer);

					simulateEvent(
						'mousedown',
						0,
						resizer.getElementsByTagName('i')[1]
					);

					simulateEvent('mousemove', 0, editor.ownerWindow, function(
						data
					) {
						data.clientX = positionResizer.left + 10;
						data.clientY = positionResizer.top + 10;
					});

					simulateEvent('mouseup', 0, editor.ownerWindow, function(
						data
					) {
						data.clientX = positionResizer.left + 10;
						data.clientY = positionResizer.top + 10;
					});

					expect(sizer.style.opacity).equals('1');

					setTimeout(function() {
						expect(sizer.style.opacity).equals('0');
						done();
					}, 500);
				});

				describe('For small state', function() {
					it('Should hide size', function() {
						const editor = new Jodit(appendTestArea(), {
							observer: {
								timeout: 0
							},
							resizer: {
								hideSizeTimeout: 400
							}
						});

						editor.value =
							'<img src="tests/artio.jpg" style="width:500px;height: 281px;"/>';

						simulateEvent(
							['mousedown', 'mouseup', 'click'],
							0,
							editor.editor.querySelector('img')
						);

						const resizer = document.querySelector(
							'.jodit_resizer[data-editor_id=' + editor.id + ']'
						);
						expect(resizer).is.not.null;

						const sizer = resizer.querySelector('span');
						expect(sizer).is.not.null;
						expect(
							editor.ownerWindow.getComputedStyle(sizer).opacity
						).equals('0');

						const positionResizer = offset(resizer);

						simulateEvent(
							'mousedown',
							0,
							resizer.getElementsByTagName('i')[1]
						);
						simulateEvent(
							'mousemove',
							0,
							editor.ownerWindow,
							function(data) {
								data.clientX = positionResizer.left - 480;
								data.clientY = positionResizer.top - 200;
							}
						);
						simulateEvent(
							'mouseup',
							0,
							editor.ownerWindow,
							function(data) {
								data.clientX = positionResizer.left - 480;
								data.clientY = positionResizer.top - 200;
							}
						);

						expect(sizer.style.opacity).equals('0');
					});
				});
			});

			it('Should not allow to resize image more then width of editor', function(done) {
				box.style.width = '600px';
				const editor = new Jodit(appendTestArea());
				const image = new Image();
				image.src = 'tests/artio.jpg';

				const callback = function() {
					const ratio = image.naturalWidth / image.naturalHeight;

					editor.value =
						'<img src="tests/artio.jpg" style="width:500px;height: 281px;"/>';
					const img = editor.editor.querySelector('img');
					simulateEvent(['mousedown', 'mouseup', 'click'], 0, img);
					const resizer = document.querySelector(
						'.jodit_resizer[data-editor_id=' + editor.id + ']'
					);
					expect(resizer).is.not.null;

					const positionResizer = offset(resizer);
					//

					simulateEvent(
						'mousedown',
						0,
						resizer.getElementsByTagName('i')[1]
					);
					simulateEvent('mousemove', 0, editor.ownerWindow, function(
						data
					) {
						data.clientX = positionResizer.left + 1000;
						data.clientY = positionResizer.top + 1000;
					});

					simulateEvent('mouseup', 0, editor.ownerWindow, function(
						data
					) {
						data.clientX = positionResizer.left + 1000;
						data.clientY = positionResizer.top + 1000;
					});
					const newratio = img.offsetWidth / img.offsetHeight;

					expect(img.offsetWidth).equals(
						editor.editor.offsetWidth - 20
					);

					expect(Math.abs(newratio - ratio) < 0.003).is.true;
					done();
				};

				onLoadImage(image, callback);
			});
		});
	});
});
