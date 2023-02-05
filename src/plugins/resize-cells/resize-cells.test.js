/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test Resize Cells', function () {
	describe('Resize column', function () {
		describe('Move mouse over edge of cell', function () {
			before(function () {
				const brs = [];
				for (let i = 0; i < 100; i += 1) {
					brs.push(document.createElement('br'));
					brs[brs.length - 1].classList.add('test');
					document.body.appendChild(brs[brs.length - 1]);
				}
			});

			describe('Normal scroll', function () {
				it("should show element's resizer", function (done) {
					const editor = getJodit();
					window.scrollTo(
						0,
						Jodit.modules.Helpers.offset(
							editor.container,
							editor,
							editor.ownerDocument
						).top + 50
					);

					editor.value =
						'<table>' +
						'<tr><td>1</td><td>2</td></tr>' +
						'</table><p>3</p>';

					const box = Jodit.modules.Helpers.offset(
						editor.editor.querySelectorAll('td')[1],
						editor,
						editor.ed
					);

					const tablebox = Jodit.modules.Helpers.offset(
						editor.editor.querySelector('table'),
						editor,
						editor.ed
					);

					simulateEvent(
						'mousemove',
						1,
						editor.editor.getElementsByTagName('td')[1],
						function (options) {
							options.offsetX = 3;
						}
					);

					const resizer = editor.container.querySelector(
						'.jodit-table-resizer'
					);
					expect(resizer).is.not.null;

					const resizerBox = Jodit.modules.Helpers.offset(
						resizer,
						editor,
						editor.ownerDocument
					);

					expect(Math.abs(resizerBox.left - box.left) < 10).is.true;

					expect(Math.abs(resizerBox.top - tablebox.top) < 10).is
						.true;

					simulateEvent(
						'mouseleave',
						1,
						editor.editor.querySelector('table'),
						function (options) {
							options.relatedTarget =
								editor.editor.querySelector('p');
						}
					);
					simulateEvent(
						'mousemove',
						1,
						editor.editor.querySelector('p')
					);

					expect(resizer.parentNode).is.null;

					done();
				});
			});

			after(function () {
				[].slice
					.call(document.querySelectorAll('br.test'))
					.forEach(function (br) {
						br.parentNode && br.parentNode.removeChild(br);
					});
			});
		});

		it('When move mouse over left edge of cell and press mouse button and move cursor to right in 500 pixels - resizer should be nearby next edge', function (done) {
			const editor = getJodit();

			editor.value =
				'<table style="width: 100px; table-layout: fixed; border-collapse: separate;" cellspacing="0">' +
				'<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr>' +
				'</table>';

			editor.editor.scrollIntoView();

			const td = editor.editor.querySelectorAll('td')[1],
				box = td.getBoundingClientRect();

			simulateEvent('mousemove', td, function (options) {
				options.clientX = box.left;
				options.offsetX = 0;
				options.pageX = 0;
				options.pageY = 0;
			});

			simulateEvent(
				'mousedown',
				editor.container.querySelector('.jodit-table-resizer'),
				function (options) {
					options.clientX = box.left;
					options.pageX = 0;
					options.pageY = 0;
				}
			);

			simulateEvent('mousemove', editor.ew, function (options) {
				options.clientX = box.left + 500; // can move only on 5 pixels
				options.pageX = 0;
				options.pageY = 0;
			});

			expect(
				parseInt(
					editor.container.querySelector('.jodit-table-resizer').style
						.left,
					10
				) < 55
			).is.true;

			done();
		});

		describe('When move mouse over left edge of cell and press mouse button and move cursor to right in 5 pixels', function () {
			describe('For one row', () => {
				it('should decrease the width of the right column and the width of the left column should increase', function (done) {
					const editor = getJodit();

					editor.value =
						'<table style="width: 100px;table-layout: fixed;border-collapse: separate;" cellspacing="0">' +
						'<tr><td>1</td><td>2</td><td>3</td><td>4</td></tr>' +
						'</table>';

					const td = editor.editor.querySelectorAll('td')[1],
						box = td.getBoundingClientRect();

					simulateEvent('mousemove', td, function (options) {
						options.clientX = box.left;
						options.offsetX = 0;
						options.pageX = 0;
						options.pageY = 0;
					});

					simulateEvent(
						'mousedown',
						editor.container.querySelector('.jodit-table-resizer'),
						function (options) {
							options.clientX = box.left;
							options.pageX = 0;
							options.pageY = 0;
						}
					);

					simulateEvent(
						['mousemove', 'mouseup'],
						editor.ew,
						function (options) {
							options.clientX = box.left + 5; // move on 5 pixels
							options.pageX = 0;
							options.pageY = 0;
						}
					);

					expect(sortAttributes(editor.value)).equals(
						'<table cellspacing="0" style="border-collapse:separate;table-layout:fixed;width:100px"><tbody>' +
							'<tr>' +
							'<td style="width:30%">1</td>' +
							'<td style="width:20%">2</td>' +
							'<td>3</td>' +
							'<td>4</td>' +
							'</tr>' +
							'</tbody></table>'
					);

					done();
				});
			});

			describe('For several rows', () => {
				it("should change witdt only first selected row's cells", function (done) {
					const editor = getJodit();

					editor.value =
						'<table style="width: 100px; table-layout: fixed;border-collapse: separate;" cellspacing="0">' +
						'<tbody>' +
						'<tr><td>1</td><td>2</td><td>3</td><td>4</td></tr>' +
						'<tr><td>5</td><td>6</td><td>7</td><td>8</td></tr>' +
						'</tbody>' +
						'</table>';

					const td = editor.editor.querySelectorAll('td')[1],
						box = td.getBoundingClientRect();

					simulateEvent('mousemove', td, function (options) {
						options.clientX = box.left;
						options.offsetX = 0;
						options.pageX = 0;
						options.pageY = 0;
					});

					simulateEvent(
						'mousedown',
						editor.container.querySelector('.jodit-table-resizer'),
						function (options) {
							options.clientX = box.left;
							options.pageX = 0;
							options.pageY = 0;
						}
					);

					simulateEvent(
						['mousemove', 'mouseup'],
						editor.ew,
						function (options) {
							options.clientX = box.left + 5; // move on 5 pixels
							options.pageX = 0;
							options.pageY = 0;
						}
					);

					expect(sortAttributes(editor.value)).equals(
						'<table cellspacing="0" style="border-collapse:separate;table-layout:fixed;width:100px"><tbody>' +
							'<tr><td style="width:30%">1</td><td style="width:20%">2</td><td>3</td><td>4</td></tr>' +
							'<tr><td>5</td><td>6</td><td>7</td><td>8</td></tr>' +
							'</tbody></table>'
					);

					done();
				});
			});

			describe('After resize', function () {
				it('it should restore selection', function (done) {
					const editor = getJodit();

					editor.value =
						'<p>test</p><table style="width: 100px; table-layout: fixed;border-collapse: separate;" cellspacing="0">' +
						'<tr><td>1</td><td>2</td><td>3</td><td>4</td></tr>' +
						'</table>';

					const td = editor.editor.querySelectorAll('td')[1],
						box = td.getBoundingClientRect();

					editor.s.setCursorIn(editor.editor.firstChild);

					simulateEvent('mousemove', 1, td, function (options) {
						options.clientX = box.left;
						options.offsetX = 0;
						options.pageX = 0;
						options.pageY = 0;
					});

					simulateEvent(
						'mousedown',
						editor.container.querySelector('.jodit-table-resizer'),
						function (options) {
							options.clientX = box.left;
							options.pageX = 0;
							options.pageY = 0;
						}
					);

					simulateEvent('mousemove', editor.ew, function (options) {
						options.clientX = box.left + 5; // move on 5 pixels
						options.pageX = 0;
						options.pageY = 0;
					});
					simulateEvent(
						'mouseup',
						editor.ownerWindow,
						function (options) {
							options.clientX = box.left + 5; // move on 5 pixels
							options.pageX = 0;
							options.pageY = 0;
						}
					);

					editor.s.insertHTML('stop');

					expect(sortAttributes(editor.value)).equals(
						'<p>teststop</p>' +
							'<table cellspacing="0" style="border-collapse:separate;table-layout:fixed;width:100px">' +
							'<tbody>' +
							'<tr>' +
							'<td style="width:30%">1</td>' +
							'<td style="width:20%">2</td>' +
							'<td>3</td>' +
							'<td>4</td>' +
							'</tr>' +
							'</tbody>' +
							'</table>'
					);

					done();
				});
			});

			describe('For RTL direction', function () {
				it('should decrease the width of the left column and the width of the right column should increase', function (done) {
					const editor = getJodit({
						direction: 'rtl'
					});

					editor.value =
						'<table style="width: 100px; table-layout: fixed; border-collapse: separate;" cellspacing="0">' +
						'<tr><td>1</td><td>2</td><td>3</td><td>4</td></tr>' +
						'</table>';

					const td = editor.editor.querySelectorAll('td')[1],
						box = td.getBoundingClientRect();

					simulateEvent('mousemove', 1, td, function (options) {
						options.clientX = box.left;
						options.offsetX = 0;
						options.pageX = 0;
						options.pageY = 0;
					});

					simulateEvent(
						'mousedown',
						1,
						editor.container.querySelector('.jodit-table-resizer'),
						function (options) {
							options.clientX = box.left;
							options.pageX = 0;
							options.pageY = 0;
						}
					);

					simulateEvent(
						'mousemove',
						1,
						editor.ew,
						function (options) {
							options.clientX = box.left + 5; // move on 5 pixels
							options.pageX = 0;
							options.pageY = 0;
						}
					);

					simulateEvent(
						'mouseup',
						1,
						editor.ownerWindow,
						function (options) {
							options.clientX = box.left + 5; // move on 5 pixels
							options.pageX = 0;
							options.pageY = 0;
						}
					);

					expect(sortAttributes(editor.value)).equals(
						'<table cellspacing="0" style="border-collapse:separate;table-layout:fixed;width:100px"><tbody>' +
							'<tr>' +
							'<td>1</td>' +
							'<td style="width:20%">2</td>' +
							'<td style="width:30%">3</td>' +
							'<td>4</td>' +
							'</tr>' +
							'</tbody></table>'
					);

					done();
				});

				describe('After resize', function () {
					it('it should restore selection', function (done) {
						const editor = getJodit({
							direction: 'rtl'
						});

						editor.value =
							'<p>test</p><table style="width: 100px; table-layout: fixed; border-collapse: separate;" cellspacing="0">' +
							'<tr><td>1</td><td>2</td><td>3</td><td>4</td></tr>' +
							'</table>';

						const td = editor.editor.querySelectorAll('td')[1],
							box = td.getBoundingClientRect();

						editor.s.setCursorIn(editor.editor.firstChild);

						simulateEvent('mousemove', td, function (options) {
							options.clientX = box.left;
							options.offsetX = 0;
							options.pageX = 0;
							options.pageY = 0;
						});

						simulateEvent(
							'mousedown',
							editor.container.querySelector(
								'.jodit-table-resizer'
							),
							function (options) {
								options.clientX = box.left;
								options.pageX = 0;
								options.pageY = 0;
							}
						);

						simulateEvent(
							'mousemove',
							editor.ew,
							function (options) {
								options.clientX = box.left + 5; // move on 5 pixels
								options.pageX = 0;
								options.pageY = 0;
							}
						);

						simulateEvent(
							'mouseup',
							editor.ownerWindow,
							function (options) {
								options.clientX = box.left + 5; // move on 5 pixels
								options.pageX = 0;
								options.pageY = 0;
							}
						);

						editor.s.insertHTML('stop');

						expect(sortAttributes(editor.value)).equals(
							'<p>teststop</p>' +
								'<table cellspacing="0" style="border-collapse:separate;table-layout:fixed;width:100px">' +
								'<tbody>' +
								'<tr>' +
								'<td>1</td>' +
								'<td style="width:20%">2</td>' +
								'<td style="width:30%">3</td>' +
								'<td>4</td>' +
								'</tr>' +
								'</tbody>' +
								'</table>'
						);

						done();
					});
				});
			});

			describe('For merged cells', () => {
				it('should change only not merged cells', () => {
					const editor = getJodit();

					editor.value = `<table style="width: 100px; border-collapse: separate;table-layout: fixed" cellspacing="0">
								<tbody>
									<tr><td>1</td><td colspan="2">2 3</td><td>4</td></tr>
									<tr><td>5</td><td>6</td><td>7</td><td>8</td></tr>
								</tbody>
							</table>`;

					const td = editor.editor.querySelectorAll('td')[5],
						box = td.getBoundingClientRect();

					simulateEvent('mousemove', td, options => {
						options.clientX = box.left;
						options.offsetX = 0;
						options.pageX = 0;
						options.pageY = 0;
					});

					simulateEvent(
						'mousedown',
						editor.container.querySelector('.jodit-table-resizer'),
						options => {
							options.clientX = box.left;
							options.pageX = 0;
							options.pageY = 0;
						}
					);

					simulateEvent(
						['mousemove', 'mouseup'],
						editor.ew,
						options => {
							options.clientX = box.left + 5; // move on 5 pixels
							options.pageX = 0;
							options.pageY = 0;
						}
					);

					expect(sortAttributes(editor.value)).equals(
						`<table cellspacing="0" style="border-collapse:separate;table-layout:fixed;width:100px">
								<tbody>
									<tr><td>1</td><td colspan="2">2 3</td><td>4</td></tr>
									<tr><td>5</td><td style="width:30%">6</td><td style="width:20%">7</td><td>8</td></tr>
								</tbody>
							</table>`
					);
				});

				describe('Table in one row', () => {
					it('should change usual way', () => {
						const editor = getJodit();

						editor.value =
							'<table style="width: 100px; border-collapse: separate;table-layout: fixed" cellspacing="0">' +
							'<tbody>' +
							'<tr><td>1</td><td colspan="2">2 3</td><td>4</td></tr>' +
							'</tbody>' +
							'</table>';

						const td = editor.editor.querySelectorAll('td')[1],
							box = td.getBoundingClientRect();

						simulateEvent('mousemove', td, options => {
							options.clientX = box.left;
							options.offsetX = 0;
							options.pageX = 0;
							options.pageY = 0;
						});

						simulateEvent(
							'mousedown',
							editor.container.querySelector(
								'.jodit-table-resizer'
							),
							options => {
								options.clientX = box.left;
								options.pageX = 0;
								options.pageY = 0;
							}
						);

						simulateEvent(
							['mousemove', 'mouseup'],
							editor.ew,
							options => {
								options.clientX = box.left - 5; // move on 5 pixels
								options.pageX = 0;
								options.pageY = 0;
							}
						);

						expect(sortAttributes(editor.value)).equals(
							'<table cellspacing="0" style="border-collapse:separate;table-layout:fixed;width:100px">' +
								'<tbody>' +
								'<tr><td style="width:20%">1</td><td colspan="2" style="width:55%">2 3</td><td>4</td></tr>' +
								'</tbody>' +
								'</table>'
						);
					});
				});

				describe('Table in two row', () => {
					it('should change usual way', () => {
						const editor = getJodit();

						editor.value =
							'<table style="width: 120px; border-collapse: separate;" cellspacing="0">' +
							'<tbody>' +
							'<tr><td>1</td><td colspan="2">2 3</td></tr>' +
							'<tr><td>4</td><td>5</td><td>6</td></tr>' +
							'</tbody>' +
							'</table>';

						const td = editor.editor.querySelectorAll('td')[4],
							box = td.getBoundingClientRect();

						simulateEvent('mousemove', td, options => {
							options.clientX = box.left;
							options.offsetX = 0;
							options.pageX = 0;
							options.pageY = 0;
						});

						simulateEvent(
							'mousedown',
							editor.container.querySelector(
								'.jodit-table-resizer'
							),
							options => {
								options.clientX = box.left;
								options.pageX = 0;
								options.pageY = 0;
							}
						);

						simulateEvent(
							['mousemove', 'mouseup'],
							editor.ew,
							options => {
								options.clientX = box.left - 12;
								options.pageX = 0;
								options.pageY = 0;
							}
						);

						expect(sortAttributes(editor.value)).equals(
							'<table cellspacing="0" style="border-collapse:separate;width:120px">' +
								'<tbody>' +
								'<tr><td>1</td><td colspan="2">2 3</td></tr>' +
								'<tr><td>4</td><td style="width:23.33%">5</td><td style="width:43.33%">6</td></tr>' +
								'</tbody>' +
								'</table>'
						);
					});
				});

				describe('Table in three row', () => {
					it('should change usual way', () => {
						const editor = getJodit();

						editor.value =
							'<table cellspacing="0" style="border-collapse:separate;width:120px;table-layout:fixed">' +
							'<tbody>' +
							'<tr><td>1</td><td colspan="2">2 3</td></tr>' +
							'<tr><td>4</td><td style="width:33%">5</td><td style="width:33%">6</td></tr>' +
							'<tr><td>7</td><td style="width:33%">8</td><td style="width:33%">9</td></tr>' +
							'</tbody>' +
							'</table>';

						const td = editor.editor.querySelectorAll('td')[4],
							box = td.getBoundingClientRect();

						simulateEvent('mousemove', td, options => {
							options.clientX = box.left;
							options.offsetX = 0;
							options.pageX = 0;
							options.pageY = 0;
						});

						simulateEvent(
							'mousedown',
							editor.container.querySelector(
								'.jodit-table-resizer'
							),
							options => {
								options.clientX = box.left;
								options.pageX = 0;
								options.pageY = 0;
							}
						);

						simulateEvent(
							['mousemove', 'mouseup'],
							editor.ew,
							options => {
								options.clientX = box.left - 12;
								options.pageX = 0;
								options.pageY = 0;
							}
						);

						expect(sortAttributes(editor.value)).equals(
							'<table cellspacing="0" style="border-collapse:separate;table-layout:fixed;width:120px">' +
								'<tbody>' +
								'<tr><td>1</td><td colspan="2">2 3</td></tr>' +
								'<tr><td>4</td><td style="width:23.33%">5</td><td style="width:43.33%">6</td></tr>' +
								'<tr><td>7</td><td>8</td><td>9</td></tr>' +
								'</tbody>' +
								'</table>'
						);
					});
				});
			});
		});

		describe('When move mouse over right edge of last cell and', function () {
			describe('press mouse button and move cursor to right in 50 pixels', function () {
				it('the width of the whole table should increase', function () {
					const editor = getJodit();

					getBox().style.width = '202px';

					editor.value =
						'<table style="width: 100px; table-layout: fixed; border-collapse: separate;" cellspacing="0">' +
						'<tr><td>1</td><td>2</td><td>3</td><td>5</td></tr>' +
						'</table>';
					const td = editor.editor.querySelectorAll('td')[3],
						box = td.getBoundingClientRect();

					simulateEvent('mousemove', td, function (options) {
						options.clientX = box.left + box.width;
						options.offsetX = box.width;
					});

					simulateEvent(
						'mousedown',
						editor.container.querySelector('.jodit-table-resizer'),
						function (options) {
							options.clientX = box.left + box.width;
						}
					);

					simulateEvent('mousemove', window, function (options) {
						options.clientX = box.left + box.width + 50;
					});
					simulateEvent('mouseup', window, function (options) {
						options.clientX = box.left + box.width + 50;
					});

					expect(
						sortAttributes(
							editor.editor.innerHTML
								.toLowerCase()
								.replace(/81\.[0-9]{2}/, '81.52') // For FF on Windows
						)
					).equals(
						'<table cellspacing="0" style="border-collapse:separate;table-layout:fixed;width:81.52%"><tbody>' +
							'<tr>' +
							'<td>1</td>' +
							'<td>2</td>' +
							'<td>3</td>' +
							'<td>5</td>' +
							'</tr>' +
							'</tbody></table>'
					);
				});
			});
		});

		describe('When move mouse over left edge of first cell', function () {
			describe('press mouse button and move cursor to left in 50 pixels', function () {
				it('should increase the width of the whole table', function () {
					const editor = getJodit();

					getBox().style.width = '202px';

					editor.value =
						'<table style="table-layout: fixed;width: 100px">' +
						'<tr><td>1</td><td>2</td><td>3</td><td>4</td></tr>' +
						'</table>';

					const td = editor.editor.querySelectorAll('td')[0],
						box = td.getBoundingClientRect();

					simulateEvent('mousemove', td, function (options) {
						options.clientX = box.left;
						options.offsetX = 0;
					});

					simulateEvent(
						'mousedown',
						editor.container.querySelector('.jodit-table-resizer'),
						function (options) {
							options.clientX = box.left;
						}
					);

					simulateEvent('mousemove', window, function (options) {
						options.clientX = box.left + 50;
					});
					simulateEvent('mouseup', window, function (options) {
						options.clientX = box.left + 50;
					});

					expect(
						sortAttributes(
							editor.editor.innerHTML
								.toLowerCase()
								.replace(/27\.[0-9]{2}/g, '27.17') // FF for Windows
						)
					).equals(
						'<table style="margin-left:27.17%;table-layout:fixed;width:27.17%">' +
							'<tbody>' +
							'<tr>' +
							'<td>1</td>' +
							'<td>2</td>' +
							'<td>3</td>' +
							'<td>4</td>' +
							'</tr>' +
							'</tbody>' +
							'</table>'
					);
				});
			});

			describe('press mouse button and do not move cursor after', function () {
				it("should not change any cell's width", function () {
					const editor = getJodit();

					getBox().style.width = '202px';

					const initital =
						'<table style="width:100px"><tbody>' +
						'<tr><td>1</td><td>2</td><td>3</td><td>4</td></tr>' +
						'</tbody></table>';

					editor.value = initital;

					const td = editor.editor.querySelectorAll('td')[0],
						box = td.getBoundingClientRect();

					simulateEvent('mousemove', td, function (options) {
						options.clientX = box.left;
						options.offsetX = 0;
					});

					simulateEvent(
						'mousedown',
						editor.container.querySelector('.jodit-table-resizer'),
						function (options) {
							options.clientX = box.left;
						}
					);

					simulateEvent('mouseup', window, function (options) {
						options.clientX = box.left;
					});

					expect(sortAttributes(editor.value)).equals(initital);
				});
			});
		});
	});

	describe('Resize table', function () {
		describe('Image in cell', function () {
			describe('Mouse down on the Image', function () {
				it('should show resizer for this image', function () {
					const area = document.createElement('textarea');
					area.setAttribute(
						'id',
						'should_show_resizer_for_this_image'
					);
					document.body.appendChild(area);
					const editor = new Jodit(area);

					editor.value =
						'<table>' +
						'<tr>' +
						'<td>1</td>' +
						'<td>2</td>' +
						'<td>3</td>' +
						'<td>4</td>' +
						'<td>5</td>' +
						'<td>6</td>' +
						'<td>7</td>' +
						'<td><img style="width:30px" src="tests/artio.jpg"></td>' +
						'</tr>' +
						'</table>';

					simulateEvent(
						'click',
						1,
						editor.editor.querySelector('img')
					);

					const resizer = editor.ownerDocument.querySelector(
						'.jodit-resizer[data-editor_id=should_show_resizer_for_this_image]'
					);

					expect(resizer).is.not.null;

					const positionResizer = offset(resizer);
					const positionImg = offset(
						editor.editor.querySelector('img')
					);

					expect(
						Math.abs(positionResizer.left - positionImg.left) < 10
					).is.true;

					expect(Math.abs(positionResizer.top - positionImg.top) < 10)
						.is.true;

					document.body.removeChild(area);
				});
			});
		});
	});
});
