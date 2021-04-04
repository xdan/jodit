/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Resize plugin', function () {
	describe('Resize box', function () {
		describe('In relative object', function () {
			it('should be in front of image', function () {
				const div = document.createElement('div');
				div.innerHTML =
					'<div style="width:800px; margin:auto; border:1px solid red;">\n' +
					'        wrong image selection\n' +
					'        <div style="position:relative;text-align: left">\n' +
					'            <textarea id="text__area0"> <img src="https://xdsoft.net/jodit/build/images/artio.jpg" style="border:1px solid red;width:100px;height:100px;"/></textarea>\n' +
					'        </div>\n' +
					'    </div>';

				document.body.appendChild(div);

				const editor = new Jodit('#text__area0');
				simulateEvent('click', 0, editor.editor.querySelector('img'));

				const resizer = document.querySelector(
					'.jodit-resizer[data-editor_id=text__area0]'
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

		describe('After resize - popup', function () {
			it('should be hidden and after this should be shown', function () {
				const div = document.createElement('div');
				div.innerHTML =
					'<div style="width:800px; margin:auto; border:1px solid red;">\n' +
					'        wrong image selection\n' +
					'        <div style="position:relative;text-align: left">\n' +
					'            <textarea id="text__area1"> &lt;img src="https://xdsoft.net/jodit/build/images/artio.jpg" style="border:1px solid red;width:100px;height:100px;"/&gt;</textarea>\n' +
					'        </div>\n' +
					'    </div>';

				document.body.appendChild(div);

				const editor = new Jodit(
					document.getElementById('text__area1')
				);
				simulateEvent(
					['mousedown', 'mouseup', 'click'],
					0,
					editor.editor.querySelector('img')
				);
				//
				const popup = getOpenedPopup(editor);
				//
				expect(popup).is.not.null;
				//
				const resizer = editor.ownerDocument.querySelector(
					'.jodit-resizer[data-editor_id=text__area1]'
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
				simulateEvent(
					'mousemove',
					0,
					editor.ownerWindow,
					function (data) {
						data.clientX = positionResizer.left - 10;
						data.clientY = positionResizer.top - 10;
					}
				);
				//
				expect(popup.parentNode).is.null;

				simulateEvent(
					'mouseup',
					0,
					editor.ownerWindow,
					function (data) {
						data.clientX = positionResizer.left - 10;
						data.clientY = positionResizer.top - 10;
					}
				);

				expect(popup.parentNode).is.null;
				//
				editor.destruct();
				div.parentNode && div.parentNode.removeChild(div);
			});
		});

		describe('Resize image', function () {
			describe('Size box', function () {
				it('Should show size for image', function (done) {
					const editor = getJodit({
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
						editor.editor.querySelector('img')
					);

					const resizer = document.querySelector(
						'.jodit-resizer[data-editor_id=' + editor.id + ']'
					);
					expect(resizer).is.not.null;

					const sizer = resizer.querySelector('span');
					expect(sizer).is.not.null;
					expect(
						editor.ownerWindow.getComputedStyle(sizer).opacity
					).equals('0');

					const positionResizer = offset(
						resizer.getElementsByTagName('i')[1]
					);

					simulateEvent(
						'mousedown',
						0,
						resizer.getElementsByTagName('i')[1]
					);

					simulateEvent(
						'mousemove',
						0,
						editor.ownerWindow,
						function (data) {
							data.clientX = positionResizer.left + 10;
							data.clientY = positionResizer.top + 10;
						}
					);

					simulateEvent(
						'mouseup',
						0,
						editor.ownerWindow,
						function (data) {
							data.clientX = positionResizer.left + 10;
							data.clientY = positionResizer.top + 10;
						}
					);

					expect(sizer.style.opacity).equals('1');

					setTimeout(function () {
						expect(sizer.style.opacity).equals('0');
						done();
					}, 500);
				});

				describe('For small state', function () {
					it('Should hide size', function () {
						const editor = getJodit({
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
							editor.editor.querySelector('img')
						);

						const resizer = document.querySelector(
							'.jodit-resizer[data-editor_id=' + editor.id + ']'
						);
						expect(resizer).is.not.null;

						const sizer = resizer.querySelector('span');
						expect(sizer).is.not.null;
						expect(
							editor.ownerWindow.getComputedStyle(sizer).opacity
						).equals('0');

						const positionResizer = offset(
							resizer.getElementsByTagName('i')[2]
						);

						simulateEvent(
							'mousedown',
							resizer.getElementsByTagName('i')[2]
						);

						simulateEvent(
							'mousemove',
							editor.ownerWindow,
							function (data) {
								data.clientX = positionResizer.left - 480;
								data.clientY = positionResizer.top - 200;
							}
						);

						simulateEvent(
							'mouseup',
							editor.ownerWindow,
							function (data) {
								data.clientX = positionResizer.left - 480;
								data.clientY = positionResizer.top - 200;
							}
						);

						expect(sizer.style.opacity).equals('0');
					});
				});
			});

			it('Should not allow to resize image more then width of editor', function (done) {
				getBox().style.width = '600px';
				const editor = getJodit();
				const image = new Image();
				image.src = 'tests/artio.jpg';

				const callback = function () {
					const ratio = image.naturalWidth / image.naturalHeight;

					editor.value =
						'<img src="tests/artio.jpg" style="width:500px;height: 281px;"/>';
					const img = editor.editor.querySelector('img');
					simulateEvent(['mousedown', 'mouseup', 'click'], 0, img);
					const resizer = document.querySelector(
						'.jodit-resizer[data-editor_id=' + editor.id + ']'
					);
					expect(resizer).is.not.null;

					const positionResizer = offset(resizer);
					//

					simulateEvent(
						'mousedown',
						0,
						resizer.getElementsByTagName('i')[1]
					);
					simulateEvent(
						'mousemove',
						0,
						editor.ownerWindow,
						function (data) {
							data.clientX = positionResizer.left + 1000;
							data.clientY = positionResizer.top + 1000;
						}
					);

					simulateEvent(
						'mouseup',
						0,
						editor.ownerWindow,
						function (data) {
							data.clientX = positionResizer.left + 1000;
							data.clientY = positionResizer.top + 1000;
						}
					);
					const newratio = img.offsetWidth / img.offsetHeight;

					expect(img.offsetWidth).equals(
						editor.editor.offsetWidth - 16
					);

					expect(Math.abs(newratio - ratio) < 0.003).is.true;
					done();
				};

				onLoadImage(image, callback);
			});
		});
	});

	describe('For iframes', function () {
		it('should wrap these iframes inside JODIT tag', function () {
			const editor = getJodit();
			editor.value =
				'<iframe style="border: 0px currentColor; border-image: none;" src="https://www.google.com/maps/embed" frameborder="0" width="100%" height="500"></iframe>' +
				'<iframe style="border: 0px currentColor; border-image: none;" src="https://www.google.com/maps/embed" frameborder="0" width="100%" height="500"></iframe>';

			expect(editor.editor.querySelectorAll('jodit').length).equals(2);
			expect(
				editor.editor.querySelector('jodit').firstChild.tagName
			).equals('IFRAME');
		});

		describe('Output HTML', function () {
			it('should not contains JODIT tag', function () {
				const editor = getJodit();
				editor.value =
					'<iframe style="border: 0px currentColor; border-image: none;" src="https://www.google.com/maps/embed" frameborder="0" width="100%" height="500"></iframe>' +
					'<iframe style="border: 0px currentColor; border-image: none;" src="https://www.google.com/maps/embed" frameborder="0" width="100%" height="500"></iframe>';

				expect(editor.editor.querySelectorAll('jodit').length).equals(
					2
				);
				expect(sortAttributes(editor.value)).equals(
					'<iframe frameborder="0" height="500" src="https://www.google.com/maps/embed" style="border:0px currentColor" width="100%"></iframe><iframe frameborder="0" height="500" src="https://www.google.com/maps/embed" style="border:0px currentColor" width="100%"></iframe>'
				);
			});
		});
	});
});
