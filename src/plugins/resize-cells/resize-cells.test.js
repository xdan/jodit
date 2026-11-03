/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
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

		describe('While the handle is dragged', () => {
			const TABLE =
				'<table style="width: 300px; border-collapse: collapse;"><tbody>' +
				'<tr><td>1</td><td>2</td><td>3</td></tr>' +
				'</tbody></table>';

			const grab = editor => {
				const td = editor.editor.querySelector('td');
				const box = td.getBoundingClientRect();

				simulateEvent('mousemove', td, options => {
					options.offsetX = box.width - 2;
					options.clientX = box.right - 2;
					options.clientY = box.top + 5;
				});
				simulateEvent(
					'mousedown',
					editor.container.querySelector('.jodit-table-resizer'),
					options => {
						options.clientX = box.right;
					}
				);

				return { td, box };
			};

			it('should resize the column as the handle moves', () => {
				const editor = getJodit();
				editor.value = TABLE;

				const { td, box } = grab(editor);
				simulateEvent('mousemove', editor.ew, options => {
					options.clientX = box.right + 30;
				});

				expect(
					Math.abs(
						td.getBoundingClientRect().right - (box.right + 30)
					)
				).is.below(2);

				const resizer = editor.container
					.querySelector('.jodit-table-resizer')
					.getBoundingClientRect();
				expect(
					Math.abs(
						resizer.left + resizer.width / 2 - (box.right + 30)
					)
				).is.below(3);

				simulateEvent('mouseup', editor.ew, options => {
					options.clientX = box.right + 30;
				});

				expect(
					Math.abs(
						td.getBoundingClientRect().right - (box.right + 30)
					)
				).is.below(2);
			});

			it('should leave the cells as they were after a drag back to where it started', () => {
				const editor = getJodit();
				editor.value = TABLE;
				const value = editor.value;

				const { box } = grab(editor);
				simulateEvent('mousemove', editor.ew, options => {
					options.clientX = box.right + 30;
				});
				simulateEvent(['mousemove', 'mouseup'], editor.ew, options => {
					options.clientX = box.right;
				});

				expect(editor.value).equals(value);
			});
		});
	});

	// https://github.com/xdan/jodit/issues/952
	describe('Resize row (#952)', function () {
		const TABLE =
			'<table style="width: 300px; border-collapse: collapse;"><tbody>' +
			'<tr><td>1</td><td>2</td></tr>' +
			'<tr><td>3</td><td>4</td></tr>' +
			'</tbody></table>';

		const handle = editor =>
			editor.container.querySelector('.jodit-table-resizer');

		// Away from the cell's sides, at `clientY`
		const hover = (cell, clientY) =>
			simulateEvent('mousemove', cell, options => {
				options.offsetX = 20;
				options.clientX = cell.getBoundingClientRect().left + 20;
				options.clientY = clientY;
			});

		const drag = (editor, fromY, toY) => {
			simulateEvent('mousedown', handle(editor), options => {
				options.clientY = fromY;
			});
			simulateEvent(['mousemove', 'mouseup'], editor.ew, options => {
				options.clientY = toY;
			});
		};

		it('should show a handle across the table on the border below a row', () => {
			const editor = getJodit();
			editor.value = TABLE;

			const td = editor.editor.querySelector('td');
			const box = td.getBoundingClientRect();
			hover(td, box.bottom - 2);

			const resizer = handle(editor);
			expect(resizer).is.not.null;
			expect(resizer.classList.contains('jodit-table-resizer_row')).is
				.true;

			const resizerBox = resizer.getBoundingClientRect();
			const tableBox = editor.editor
				.querySelector('table')
				.getBoundingClientRect();

			expect(
				Math.abs(resizerBox.top + resizerBox.height / 2 - box.bottom)
			).is.below(3);
			expect(Math.abs(resizerBox.left - tableBox.left)).is.below(3);
			expect(Math.abs(resizerBox.width - tableBox.width)).is.below(3);
		});

		it("should set the row's height in pixels in its style, as one history step", () => {
			const editor = getJodit({ history: { timeout: 0 } });
			editor.value = TABLE;
			const steps = editor.history.length;

			const [first, second] = editor.editor.querySelectorAll('tr');
			const td = first.cells[0];
			const box = td.getBoundingClientRect();
			const height = first.offsetHeight;

			hover(td, box.bottom - 2);
			drag(editor, box.bottom, box.bottom + 30);

			expect(first.style.height).equals(height + 30 + 'px');
			expect(second.hasAttribute('style')).is.false;
			expect(td.hasAttribute('style')).is.false;
			expect(editor.history.length).equals(steps + 1);

			editor.execCommand('undo');

			expect(editor.editor.querySelector('tr').hasAttribute('style')).is
				.false;
		});

		it('should resize the row while the handle is dragged', () => {
			const editor = getJodit();
			editor.value = TABLE;

			const first = editor.editor.querySelector('tr');
			const td = first.cells[0];
			const box = td.getBoundingClientRect();
			const height = first.offsetHeight;

			hover(td, box.bottom - 2);
			simulateEvent('mousedown', handle(editor), options => {
				options.clientY = box.bottom;
			});
			simulateEvent('mousemove', editor.ew, options => {
				options.clientY = box.bottom + 30;
			});

			expect(first.offsetHeight).equals(height + 30);

			const resizerBox = handle(editor).getBoundingClientRect();
			expect(
				Math.abs(
					resizerBox.top +
						resizerBox.height / 2 -
						td.getBoundingClientRect().bottom
				)
			).is.below(3);

			simulateEvent('mouseup', editor.ew);
		});

		it('should leave the row as it was after a drag back to where it started', () => {
			const editor = getJodit();
			editor.value = TABLE;

			const first = editor.editor.querySelector('tr');
			const td = first.cells[0];
			const box = td.getBoundingClientRect();

			hover(td, box.bottom - 2);
			simulateEvent('mousedown', handle(editor), options => {
				options.clientY = box.bottom;
			});
			simulateEvent('mousemove', editor.ew, options => {
				options.clientY = box.bottom + 30;
			});
			simulateEvent(['mousemove', 'mouseup'], editor.ew, options => {
				options.clientY = box.bottom;
			});

			expect(first.hasAttribute('style')).is.false;
		});

		it('should keep the handle while a drag leaves the table', () => {
			const editor = getJodit();
			editor.value = TABLE;

			const td = editor.editor.querySelector('td');
			const box = td.getBoundingClientRect();

			hover(td, box.bottom - 2);
			simulateEvent('mousedown', handle(editor), options => {
				options.clientY = box.bottom;
			});
			simulateEvent('mouseleave', editor.editor.querySelector('table'));

			expect(handle(editor)).is.not.null;

			simulateEvent('mouseup', editor.ew);
		});

		it('should not make a row shorter than its content', () => {
			const editor = getJodit();
			editor.value = TABLE.replace('<tr>', '<tr style="height: 100px;">');

			const first = editor.editor.querySelector('tr');
			const td = first.cells[0];
			const box = td.getBoundingClientRect();

			hover(td, box.bottom - 2);
			drag(editor, box.bottom, box.bottom - 200);

			expect(parseInt(first.style.height, 10)).is.below(100);
			expect(first.style.height).equals(first.offsetHeight + 'px');
		});

		describe('In an editor scrolled down', () => {
			const scrolledDown = options => {
				const editor = getJodit({ height: 300, ...options });
				editor.value =
					TABLE.replace('<tr>', '<tr style="height: 400px;">') +
					'<p>line</p>'.repeat(8);

				const scroller = editor.o.iframe
					? editor.ed.scrollingElement
					: editor.editor;
				scroller.scrollTop = 400 - scroller.clientHeight / 2;

				const td = editor.editor.querySelector('td');
				hover(td, td.getBoundingClientRect().bottom - 2);

				return { editor, scroller, td };
			};

			it('should size the row to where the pointer is let go', () => {
				const { editor, scroller, td } = scrolledDown();
				const { scrollTop } = scroller;
				const { bottom } = td.getBoundingClientRect();
				expect(scrollTop).is.above(0);

				drag(editor, bottom, bottom - 50);

				expect(td.parentElement.style.height).equals('350px');
				expect(scroller.scrollTop).equals(scrollTop);
				expect(
					Math.abs(td.getBoundingClientRect().bottom - (bottom - 50))
				).is.below(2);
			});

			it('should scroll up along with a drag past the top, as far as the row can shrink', async () => {
				const { editor, scroller, td } = scrolledDown();
				const { scrollTop } = scroller;
				const { bottom } = td.getBoundingClientRect();
				const top =
					scroller.getBoundingClientRect().top + scroller.clientTop;

				simulateEvent('mousedown', handle(editor), options => {
					options.clientY = bottom;
				});
				simulateEvent('mousemove', editor.ew, options => {
					options.clientY = top - 40;
				});
				await delay(1000);
				simulateEvent('mouseup', editor.ew);

				const row = td.parentElement;
				expect(scroller.scrollTop).is.below(scrollTop);
				expect(row.offsetHeight).is.below(400 - (bottom - top));
				expect(row.style.height).equals(row.offsetHeight + 'px');
				expect(
					Math.abs(td.getBoundingClientRect().bottom - top)
				).is.below(2);
			});

			it('should scroll down along with a drag past the bottom, growing the row', async () => {
				const { editor, scroller, td } = scrolledDown();
				const { scrollTop } = scroller;
				const { bottom } = td.getBoundingClientRect();
				const end =
					scroller.getBoundingClientRect().top +
					scroller.clientTop +
					scroller.clientHeight;

				simulateEvent('mousedown', handle(editor), options => {
					options.clientY = bottom;
				});
				simulateEvent('mousemove', editor.ew, options => {
					options.clientY = end + 40;
				});
				await delay(300);
				simulateEvent('mouseup', editor.ew);

				const scrolled = scroller.scrollTop - scrollTop;
				expect(scrolled).is.above(0);
				expect(
					Math.abs(
						td.parentElement.offsetHeight -
							(400 + end - bottom + scrolled)
					)
				).is.below(2);
				expect(
					Math.abs(td.getBoundingClientRect().bottom - end)
				).is.below(2);

				const resizer = handle(editor).getBoundingClientRect();
				expect(
					Math.abs(resizer.top + resizer.height / 2 - end)
				).is.below(3);
			});

			it('should scroll an iframe down along with a drag near its bottom', async () => {
				const { editor, scroller } = scrolledDown({ iframe: true });
				const { scrollTop } = scroller;
				const styles = () =>
					[editor.ed.documentElement, editor.ed.body].map(elm =>
						elm.getAttribute('style')
					);
				const before = styles();

				simulateEvent('mousedown', handle(editor));
				simulateEvent('mousemove', editor.ew, options => {
					options.clientY = editor.ew.innerHeight - 5;
				});
				await delay(300);
				simulateEvent('mouseup', editor.ow);

				expect(scroller.scrollTop).is.above(scrollTop);
				expect(styles()).deep.equals(before);
			});

			it('should keep the scroll of an iframe as a drag starts', () => {
				const { editor, scroller } = scrolledDown({ iframe: true });
				const { scrollTop } = scroller;
				expect(scrollTop).is.above(0);

				simulateEvent('mousedown', handle(editor));

				expect(scroller.scrollTop).equals(scrollTop);
				simulateEvent('mouseup', editor.ow);
			});
		});

		it("should resize the last row from the table's bottom edge", () => {
			const editor = getJodit();
			editor.value = TABLE;

			const last = editor.editor.querySelectorAll('tr')[1];
			const td = last.cells[1];
			const box = td.getBoundingClientRect();
			const height = last.offsetHeight;

			hover(td, box.bottom - 2);
			drag(editor, box.bottom, box.bottom + 20);

			expect(last.style.height).equals(height + 20 + 'px');
		});

		it('should resize the row above a border reached from the cell below it', () => {
			const editor = getJodit();
			editor.value = TABLE;

			const [first, second] = editor.editor.querySelectorAll('tr');
			const box = second.cells[0].getBoundingClientRect();
			const height = first.offsetHeight;

			hover(second.cells[0], box.top + 2);
			drag(editor, box.top, box.top + 20);

			expect(first.style.height).equals(height + 20 + 'px');
			expect(second.hasAttribute('style')).is.false;
		});

		it('should resize the row a cell spanning two rows ends in', () => {
			const editor = getJodit();
			editor.value =
				'<table style="width: 300px; border-collapse: collapse;"><tbody>' +
				'<tr><td rowspan="2">A</td><td>1</td></tr>' +
				'<tr><td>2</td></tr>' +
				'<tr><td>3</td><td>4</td></tr>' +
				'</tbody></table>';

			const [first, second] = editor.editor.querySelectorAll('tr');
			const td = first.cells[0];
			const box = td.getBoundingClientRect();
			const height = second.offsetHeight;

			hover(td, box.bottom - 2);
			drag(editor, box.bottom, box.bottom + 20);

			expect(second.style.height).equals(height + 20 + 'px');
			expect(first.hasAttribute('style')).is.false;
		});

		it("should not show a row handle on the table's top edge", () => {
			const editor = getJodit();
			editor.value = TABLE;

			const td = editor.editor.querySelector('td');
			hover(td, td.getBoundingClientRect().top + 2);

			expect(handle(editor)).is.null;
		});

		it("should show the column's handle at a corner", () => {
			const editor = getJodit();
			editor.value = TABLE;

			const td = editor.editor.querySelectorAll('td')[1];
			const box = td.getBoundingClientRect();
			simulateEvent('mousemove', td, options => {
				options.offsetX = 2;
				options.clientX = box.left + 2;
				options.clientY = box.bottom - 2;
			});

			expect(handle(editor)).is.not.null;
			expect(handle(editor).classList.contains('jodit-table-resizer_row'))
				.is.false;
		});

		it('should not show a handle with tableAllowCellResize off', () => {
			const editor = getJodit({ tableAllowCellResize: false });
			editor.value = TABLE;

			const td = editor.editor.querySelector('td');
			hover(td, td.getBoundingClientRect().bottom - 2);

			expect(handle(editor)).is.null;
		});
	});

	// https://github.com/xdan/jodit/issues/1757
	describe('A table in the starting value (#1757)', () => {
		[false, true].forEach(iframe => {
			it(`should show the column's handle before anything is edited${iframe ? ', in an iframe' : ''}`, async () => {
				const area = appendTestArea();
				area.value =
					'<table style="width: 300px; border-collapse: collapse;"><tbody>' +
					'<tr><td>1</td><td>2</td></tr>' +
					'<tr><td>3</td><td>4</td></tr>' +
					'</tbody></table>';

				const editor = getJodit({ iframe }, area);
				await editor.waitForReady();

				const td = editor.editor.querySelector('td');
				const box = td.getBoundingClientRect();
				simulateEvent('mousemove', td, options => {
					options.offsetX = box.width - 2;
					options.clientX = box.right - 2;
					options.clientY = box.top + 5;
				});

				expect(editor.container.querySelector('.jodit-table-resizer'))
					.is.not.null;
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
