/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Tables Jodit Editor Tests', function () {
	describe('Methods', function () {
		it('After init container must has one element .jodit-table-resizer', function () {
			const editor = getJodit();
			expect(editor.editor.querySelector('.jodit-table-resizer')).equals(
				null
			);

			const table1 = editor.createInside.fromHTML(
				'<table><tr><td>1</td></tr></table>'
			);
			editor.s.insertNode(table1);
			simulateEvent(
				'mousemove',
				0,
				table1.querySelector('td'),
				function (opt) {
					opt.offsetX = 3;
				}
			);

			const table2 = editor.createInside.fromHTML(
				'<table><tr><td>2</td></tr></table>'
			);
			editor.s.insertNode(table2);
			simulateEvent(
				'mousemove',
				0,
				table2.querySelector('td'),
				function (opt) {
					opt.offsetX = 3;
				}
			);

			expect(
				editor.container.querySelectorAll('.jodit-table-resizer').length
			).equals(1);
		});

		it('Process wrong table', function () {
			const editor = getJodit();
			editor.value =
				'<table>' +
				'<tr>' +
				'<td>1</td>' +
				'<td>2</td>' +
				'<td rowspan="2">3</td>' +
				'</tr>' +
				'<tr><td>4</td></tr>' +
				'</table>';

			selectCells(editor, [0, 1]);

			Jodit.modules.Table.mergeSelected(editor.editor.firstChild, editor);

			simulateEvent(
				'mousemove',
				0,
				editor.editor.querySelector('td'),
				function (opt) {
					opt.offsetX = 3;
				}
			);

			expect(
				editor.container.querySelectorAll('.jodit-table-resizer').length
			).equals(1);
		});

		it('Method getRowsCount should return TR count', function () {
			const editor = getJodit();

			editor.value =
				'<table>' +
				[1, 2, 3, 4]
					.map(function () {
						return '<tr>' + '<td>1</td>' + '<td>2</td>' + '</tr>';
					})
					.join('') +
				'</table>';

			// const table = new Jodit.modules.Table(editor);
			expect(
				Jodit.modules.Table.getRowsCount(editor.editor.firstChild)
			).equals(4);
		});

		it('Method getColumnsCount should return maximum of TH or TD in one row in table', function () {
			const editor = getJodit();

			editor.value =
				'<table>' +
				'<tr><td>1</td><td>2</td><td>3</td></tr>' +
				'<tr><td>1</td><td>2</td><td>3</td></tr>' +
				'<tr><td colspan="2">12</td><td>3</td></tr>' +
				'<tr><td colspan="3">123</td></tr>' +
				'<tr><td colspan="3">123</td><td>4</td></tr>' + // 4 cells - wrong table but will suit
				'</table>';

			expect(
				Jodit.modules.Table.getColumnsCount(editor.editor.firstChild)
			).equals(4);
		});

		describe('appendRow', function () {
			it('should append one row in the end of table', function () {
				const editor = getJodit();

				editor.value =
					'<table>' +
					'<tr><td>1</td><td>2</td><td>3</td></tr>' +
					'</table>';

				Jodit.modules.Table.appendRow(
					editor.editor.firstChild,
					false,
					true,
					editor.createInside
				);

				expect(editor.value).equals(
					'<table><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td></td><td></td><td></td></tr></tbody></table>'
				);
			});

			describe('with second argument', function () {
				it('should append one row after row', function () {
					const editor = getJodit();

					editor.value =
						'<table>' +
						'<tr><td>1</td><td>2</td><td>3</td></tr>' +
						'<tr><td>2</td><td>3</td><td>4</td></tr>' +
						'</table>';

					Jodit.modules.Table.appendRow(
						editor.editor.firstChild,
						editor.editor.firstChild.querySelector('tr'),
						true,
						editor.createInside
					);

					expect(editor.value).equals(
						'<table><tbody>' +
							'<tr><td>1</td><td>2</td><td>3</td></tr>' +
							'<tr><td></td><td></td><td></td></tr>' +
							'<tr><td>2</td><td>3</td><td>4</td></tr>' +
							'</tbody></table>'
					);
				});

				describe('Set rowspan', function () {
					it('should append one row after row and recalculate all rowspan', function () {
						const editor = getJodit();

						editor.value =
							'<table>' +
							'<tr><td rowspan="2">1</td><td>2</td><td>3</td></tr>' +
							'<tr><td>3</td><td>4</td></tr>' +
							'</table>';

						Jodit.modules.Table.appendRow(
							editor.editor.firstChild,
							editor.editor.firstChild.querySelector('tr'),
							true,
							editor.createInside
						);

						expect(editor.value).equals(
							'<table><tbody>' +
								'<tr><td>1</td><td>2</td><td>3</td></tr>' +
								'<tr><td rowspan="2"></td><td></td><td></td></tr>' +
								'<tr><td>3</td><td>4</td></tr>' +
								'</tbody></table>'
						);
					});
				});

				describe('with styled row', function () {
					it('should append one row after this row and copy matching styles', function () {
						const editor = getJodit();

						editor.value =
							'<table>' +
							'<tr><td style="color: red">1</td><td class="blue">2</td><td>3</td></tr>' +
							'<tr><td>2</td><td>3</td><td>4</td></tr>' +
							'</table>';

						Jodit.modules.Table.appendRow(
							editor.editor.firstChild,
							editor.editor.firstChild.querySelector('tr'),
							true,
							editor.createInside
						);

						expect(sortAttributes(editor.value)).equals(
							'<table><tbody>' +
								'<tr><td style="color:red">1</td><td class="blue">2</td><td>3</td></tr>' +
								'<tr><td style="color:red"></td><td class="blue"></td><td></td></tr>' +
								'<tr><td>2</td><td>3</td><td>4</td></tr></tbody></table>'
						);
					});
				});
			});

			describe('with second=TR  and third=false arguments ', function () {
				it('should append and one row before row', function () {
					const editor = getJodit();

					editor.value =
						'<table>' +
						'<tr><td>1</td><td>2</td><td>3</td></tr>' +
						'<tr><td>2</td><td>3</td><td>4</td></tr>' +
						'</table>';

					Jodit.modules.Table.appendRow(
						editor.editor.firstChild,
						editor.editor.firstChild.querySelector('tr'),
						false,
						editor.createInside
					);

					expect(editor.value).equals(
						'<table><tbody><tr><td></td><td></td><td></td></tr><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>2</td><td>3</td><td>4</td></tr></tbody></table>'
					);
				});
			});
		});

		it('Method appendColumn should append column in the end', function () {
			const editor = getJodit();

			editor.value =
				'<table>' +
				'<tr><td>1</td><td>2</td></tr>' +
				'<tr><td colspan="2">3</td></tr>' +
				'</table>';

			Jodit.modules.Table.appendColumn(
				editor.editor.firstChild,
				-1,
				true,
				editor.createInside
			);

			expect(editor.value.toLowerCase()).equals(
				'<table>' +
					'<tbody>' +
					'<tr><td>1</td><td>2</td><td></td></tr>' +
					'<tr><td colspan="2">3</td><td></td></tr>' +
					'</tbody>' +
					'</table>'
			);
		});

		it('Method appendColumn with second argument should append column after that column', function () {
			const editor = getJodit();

			editor.value =
				'<table>' +
				'<tr><td>1</td><td>2</td></tr>' +
				'<tr><td colspan="2">3</td></tr>' +
				'</table>';

			Jodit.modules.Table.appendColumn(
				editor.editor.firstChild,
				0,
				true,
				editor.createInside
			);

			expect(editor.value.toLowerCase()).equals(
				'<table>' +
					'<tbody>' +
					'<tr><td>1</td><td></td><td>2</td></tr>' +
					'<tr><td colspan="3">3</td></tr>' +
					'</tbody>' +
					'</table>'
			);
		});

		it('Method appendColumn with second argument and third = false should append column before that column', function () {
			const editor = getJodit();

			editor.value =
				'<table>' +
				'<tr><td>1</td><td>2</td></tr>' +
				'<tr><td colspan="2">3</td></tr>' +
				'</table>';

			Jodit.modules.Table.appendColumn(
				editor.editor.firstChild,
				1,
				false,
				editor.createInside
			);

			expect(editor.value.toLowerCase()).equals(
				'<table>' +
					'<tbody>' +
					'<tr><td>1</td><td></td><td>2</td></tr>' +
					'<tr><td colspan="3">3</td></tr>' +
					'</tbody>' +
					'</table>'
			);
		});

		it('Remove row should delete TR from table', function () {
			const editor = getJodit();

			editor.value =
				'<table>' +
				'<tr><td>1</td><td>2</td><td>3</td></tr>' +
				'<tr><td rowspan="2">4</td><td>5</td><td>6</td></tr>' +
				'<tr><td>7</td><td>8</td></tr>' +
				'</table>';

			simulateEvent(
				'mousedown',
				Jodit.KEY_TAB,
				editor.editor.querySelectorAll('td')[4]
			);

			Jodit.modules.Table.removeRow(editor.editor.firstChild, 1);

			expect(editor.value.toLowerCase()).equals(
				'<table>' +
					'<tbody>' +
					'<tr><td>1</td><td>2</td><td>3</td></tr>' +
					'<tr><td>4</td><td>7</td><td>8</td></tr>' +
					'</tbody>' +
					'</table>'
			);
		});

		describe('Method merge selected cells', function () {
			it('Simple should merge all selected cells into one ', function () {
				const editor = getJodit();

				editor.value =
					'<table>' +
					'<tr><td>1</td><td>2</td></tr>' +
					'<tr><td>3</td><td>4</td></tr>' +
					'<tr><td>5</td><td>6</td></tr>' +
					'</table>';

				selectCells(editor, [0, 1, 2, 3]);
				// const table = new Jodit.modules.Table(editor);
				Jodit.modules.Table.mergeSelected(
					editor.editor.firstChild,
					editor
				);

				expect(sortAttributes(editor.editor.innerHTML)).equals(
					'<table>' +
						'<tbody>' +
						'<tr>' +
						'<td colspan="2">1<br>2<br>3<br>4</td>' +
						'</tr>' +
						'<tr>' +
						'<td>5</td>' +
						'<td>6</td>' +
						'</tr>' +
						'</tbody>' +
						'</table>'
				);

				expect(
					editor.getInstance('Table', editor.o).selected.size
				).equals(1);
			});

			it('With colspan and rowspan into one ', function () {
				const editor = getJodit();

				editor.value =
					'<table>' +
					'<tr><td colspan="2">1</td></tr>' +
					'<tr><td>3</td><td>4</td></tr>' +
					'<tr><td rowspan="2">5</td><td>6</td></tr>' +
					'<tr><td>7</td></tr>' +
					'<tr><td>8</td><td>9</td></tr>' +
					'</table>';

				selectCells(editor, [0, 1, 2, 3, 4, 5]);
				Jodit.modules.Table.mergeSelected(
					editor.editor.firstChild,
					editor
				);

				expect(sortAttributes(editor.value)).equals(
					'<table>' +
						'<tbody>' +
						'<tr>' +
						'<td colspan="2">' +
						'1<br>3<br>4<br>5<br>6<br>7' +
						'</td>' +
						'</tr>' +
						'<tr>' +
						'<td>8</td>' +
						'<td>9</td>' +
						'</tr>' +
						'</tbody>' +
						'</table>'
				);

				expect(
					editor.getInstance('Table', editor.o).selected.size
				).equals(1);
			});

			it('A few cells with colspan and rowspan', function () {
				const editor = getJodit();

				editor.value =
					'<table style="width: 100%;">' +
					'<tbody>' +
					'<tr><td colspan="3">0,0<br>0,1<br>0,2<br></td><td>0,3</td></tr>' +
					'<tr><td rowspan="3">1,0<br>2,0<br>3,0<br></td><td>1,1</td><td>1,2</td><td>1,3</td></tr>' +
					'<tr><td>2,1</td><td>2,2</td><td>2,3</td></tr>' +
					'<tr><td>3,1</td><td>3,2</td><td>3,3</td></tr>' +
					'</tbody></table>';

				selectCells(editor, [0, 2, 3, 4, 6, 7, 9, 10]);

				Jodit.modules.Table.mergeSelected(
					editor.editor.firstChild,
					editor
				);

				expect(sortAttributes(editor.value)).equals(
					'<table style="width:100%">' +
						'<tbody>' +
						'<tr>' +
						'<td rowspan="4">' +
						'0,0<br>0,1<br>0,2<br><br>' +
						'1,0<br>2,0<br>3,0<br><br>' +
						'1,1<br>' +
						'1,2<br>' +
						'2,1<br>' +
						'2,2<br>' +
						'3,1<br>' +
						'3,2' +
						'</td>' +
						'<td>0,3</td>' +
						'</tr>' +
						'<tr>' +
						'<td>1,3</td>' +
						'</tr>' +
						'<tr>' +
						'<td>2,3</td>' +
						'</tr>' +
						'<tr>' +
						'<td>3,3</td>' +
						'</tr>' +
						'</tbody>' +
						'</table>'
				);
			});

			it('Merge cells in center', function () {
				const editor = getJodit();

				editor.value =
					'<table style="width: 100%;">' +
					'<tbody>' +
					'<tr>' +
					'<td colspan="3" class="">0,0<br>0,1<br>0,2<br></td>' +
					'<td>0,3</td>' +
					'</tr>' +
					'<tr>' +
					'<td rowspan="3" class="">1,0<br>2,0<br>3,0<br></td>' +
					'<td>1,1</td>' +
					'<td>1,2</td>' +
					'<td>1,3</td>' +
					'</tr>' +
					'<tr>' +
					'<td>2,1</td>' +
					'<td>2,2</td>' +
					'<td>2,3</td>' +
					'</tr>' +
					'<tr>' +
					'<td class="">3,1</td>' +
					'<td class="">3,2</td>' +
					'<td>3,3</td>' +
					'</tr>' +
					'</tbody>' +
					'</table>';

				selectCells(editor, [3, 4, 5, 6, 7, 8]);

				// const table = new Jodit.modules.Table(editor);
				Jodit.modules.Table.mergeSelected(
					editor.editor.firstChild,
					editor
				);

				expect(sortAttributes(editor.editor.innerHTML)).equals(
					'<table style="width:100%">' +
						'<tbody>' +
						'<tr>' +
						'<td colspan="3">0,0<br>0,1<br>0,2<br></td><td>0,3</td>' +
						'</tr>' +
						'<tr>' +
						'<td rowspan="2">1,0<br>2,0<br>3,0<br></td>' +
						'<td colspan="3">1,1<br>1,2<br>1,3<br>2,1<br>2,2<br>2,3</td>' +
						'</tr>' +
						'<tr>' +
						'<td>3,1</td><td>3,2</td><td>3,3</td>' +
						'</tr>' +
						'</tbody>' +
						'</table>'
				);
			});

			it('Normalize merged cells', function () {
				const editor = getJodit();

				editor.value =
					'<table>' +
					'<tbody>' +
					'<tr>' +
					'<td colspan="3" rowspan="4">1</td>' +
					'<td rowspan="4">2</td>' +
					'</tr>' +
					'<tr></tr>' +
					'<tr></tr>' +
					'<tr></tr>' +
					'</tbody>' +
					'</table>';

				selectCells(editor, [0, 1]);

				Jodit.modules.Table.mergeSelected(
					editor.editor.firstChild,
					editor
				);

				expect(sortAttributes(editor.editor.innerHTML)).equals(
					'<table>' +
						'<tbody>' +
						'<tr>' +
						'<td>1<br>2</td>' +
						'</tr>' +
						'</tbody>' +
						'</table>'
				);
			});
		});

		describe('Split selected cells', function () {
			it('Split cell by Horizontal', function () {
				const editor = getJodit();

				editor.value =
					'<table>' +
					'<tbody>' +
					'<tr><td>0,0</td></tr>' +
					'<tr><td>1,0</td></tr>' +
					'</tbody>' +
					'</table>';

				selectCells(editor, [0]);

				Jodit.modules.Table.splitHorizontal(
					editor.editor.firstChild,
					editor
				);

				expect(sortAttributes(editor.editor.innerHTML)).equals(
					'<table>' +
						'<tbody>' +
						'<tr><td>0,0</td></tr>' +
						'<tr><td><br></td></tr>' +
						'<tr><td>1,0</td></tr>' +
						'</tbody>' +
						'</table>'
				);
			});

			it('Split cell with rowspan by horizontal', function () {
				const editor = getJodit();

				editor.value =
					'<table>' +
					'<tbody>' +
					'<tr><td>0,0</td><td>0,1</td><td>0,2</td></tr>' +
					'<tr>' +
					'<td rowspan="2">1,0</td>' +
					'<td>1,1</td>' +
					'<td rowspan="2">1,2</td>' +
					'</tr>' +
					'<tr><td><br></td></tr>' +
					'<tr><td>2,0</td><td>2,1</td><td>2,2</td></tr>' +
					'</tbody>' +
					'</table>';

				selectCells(editor, [3]);

				// const table = new Jodit.modules.Table(editor);
				Jodit.modules.Table.splitHorizontal(
					editor.editor.firstChild,
					editor
				);

				expect(sortAttributes(editor.editor.innerHTML)).equals(
					'<table>' +
						'<tbody>' +
						'<tr><td>0,0</td><td>0,1</td><td>0,2</td></tr>' +
						'<tr>' +
						'<td>1,0</td>' +
						'<td>1,1</td>' +
						'<td rowspan="2">1,2</td>' +
						'</tr>' +
						'<tr><td><br></td><td><br></td></tr>' +
						'<tr><td>2,0</td><td>2,1</td><td>2,2</td></tr>' +
						'</tbody>' +
						'</table>'
				);
			});

			it('Split cell with rowspan by horizontal 2', function () {
				const editor = getJodit();

				editor.value =
					'<table>' +
					'<tbody>' +
					'<tr><td>0,0</td><td>0,1</td><td>0,2</td></tr>' +
					'<tr>' +
					'<td rowspan="2">1,0</td>' +
					'<td rowspan="2">1,1</td>' +
					'<td>1,2</td>' +
					'</tr>' +
					'<tr><td><br></td></tr>' +
					'<tr><td>2,0</td><td>2,1</td><td>2,2</td></tr>' +
					'</tbody>' +
					'</table>';

				selectCells(editor, [4]);

				Jodit.modules.Table.splitHorizontal(
					editor.editor.firstChild,
					editor
				);

				expect(sortAttributes(editor.value)).equals(
					'<table>' +
						'<tbody>' +
						'<tr><td>0,0</td><td>0,1</td><td>0,2</td></tr>' +
						'<tr>' +
						'<td rowspan="2">1,0</td>' +
						'<td>1,1</td>' +
						'<td>1,2</td>' +
						'</tr>' +
						'<tr><td><br></td><td><br></td></tr>' +
						'<tr><td>2,0</td><td>2,1</td><td>2,2</td></tr>' +
						'</tbody>' +
						'</table>'
				);
			});

			it('Split cell by vertical', function () {
				const editor = getJodit();

				editor.value =
					'<table style="width: 300px;">' +
					'<tbody>' +
					'<tr><td style="width:100px">0,0</td><td>0,1</td></tr>' +
					'<tr><td>1,0</td><td>1,1</td></tr>' +
					'</tbody>' +
					'</table>';

				selectCells(editor, [0]);

				Jodit.modules.Table.splitVertical(
					editor.editor.firstChild,
					editor
				);

				expect(sortAttributes(editor.value)).equals(
					'<table style="width:300px">' +
						'<tbody>' +
						'<tr><td style="width:16.66%">0,0</td><td style="width:16.66%"><br></td><td>0,1</td></tr>' +
						'<tr><td colspan="2">1,0</td><td>1,1</td></tr>' +
						'</tbody>' +
						'</table>'
				);
			});
		});
	});

	describe('Work with tables', function () {
		it('Create table and insert into cell some text', function () {
			const editor = getJodit();
			editor.ownerWindow.focus();
			editor.value = '';

			const table = editor.createInside.element('table'),
				tr = editor.createInside.element('tr'),
				td = editor.createInside.element('td'),
				td2 = editor.createInside.element('td');

			tr.appendChild(td);
			tr.appendChild(td2);
			table.appendChild(tr);

			editor.s.focus();
			editor.s.insertNode(table, false);
			editor.s.setCursorIn(table, false); // set cursor in last cell
			editor.s.insertNode(editor.createInside.text('ok'));

			expect(editor.value).equals(
				'<table><tr><td></td><td>ok</td></tr></table>'
			);
		});

		it('After insert table like html without tbody, it should be appear', function () {
			const editor = getJodit();

			editor.value =
				'<table>' +
				'<tr>' +
				'<td>1</td>' +
				'<td>2</td>' +
				'</tr>' +
				'</table>';

			expect(editor.value).equals(
				'<table><tbody><tr><td>1</td><td>2</td></tr></tbody></table>'
			);
		});

		it('After press Tab button cursor should be in next cell in table', function () {
			const editor = getJodit();

			editor.value =
				'<table>' +
				'<tr>' +
				'<td>1</td>' +
				'<td>2</td>' +
				'</tr>' +
				'</table>';

			editor.s.setCursorIn(editor.editor.querySelector('td'));

			simulateEvent('keydown', Jodit.KEY_TAB, editor.editor);

			editor.s.insertNode(editor.createInside.text('test'), false);

			expect(editor.value.replace('<br>', '')).equals(
				'<table><tbody><tr><td>1</td><td>test</td></tr></tbody></table>'
			);
		});

		it('After press Tab + Shift buttons cursor should be in next cell in table', function () {
			const editor = getJodit();

			editor.value =
				'<table>' +
				'<tr>' +
				'<td>1</td>' +
				'<td>2</td>' +
				'</tr>' +
				'</table>';

			editor.s.setCursorIn(editor.editor.querySelector('td').nextSibling);

			simulateEvent(
				'keydown',
				Jodit.KEY_TAB,
				editor.editor,
				function (evnt) {
					evnt.shiftKey = true;
				}
			);

			editor.s.insertNode(editor.createInside.text('test'), false);

			expect(editor.value.replace('<br>', '')).equals(
				'<table><tbody><tr><td>test</td><td>2</td></tr></tbody></table>'
			);
		});

		it('After press Right arrow not in the end of cell it should do nothing', function () {
			const editor = getJodit();

			editor.value =
				'<table>' +
				'<tr>' +
				'<td>1</td>' +
				'<td>2</td>' +
				'</tr>' +
				'</table>';

			editor.s.setCursorIn(editor.editor.querySelector('td'), true); // set cursor before 1

			simulateEvent('keydown', Jodit.KEY_RIGHT, editor.editor); // not work but in real cursor move after 1

			editor.s.insertNode(editor.createInside.text('test'), false);

			expect(editor.value).equals(
				'<table><tbody><tr><td>test1</td><td>2</td></tr></tbody></table>'
			);
		});

		it('After press Left arrow in the start of cell it should work like tab + shift', function () {
			const editor = getJodit();

			editor.value =
				'<table>' +
				'<tr>' +
				'<td>1</td>' +
				'<td>2</td>' +
				'</tr>' +
				'</table>';

			editor.s.setCursorIn(
				editor.editor.querySelector('td').nextSibling,
				true
			); // set cursor before 1

			simulateEvent('keydown', Jodit.KEY_LEFT, editor.editor); // not work but in real cursor move after 1

			editor.s.insertNode(editor.createInside.text('test'), false);

			expect(editor.value).equals(
				'<table><tbody>' +
					'<tr>' +
					'<td>1test</td>' +
					'<td>2</td>' +
					'</tr>' +
					'</tbody></table>'
			);
		});

		it("After press Top arrow in the first cell's line cursor should move into top cell", function () {
			const editor = getJodit();

			editor.value =
				'<table>' +
				'<tr>' +
				'<td>1</td>' +
				'<td>2</td>' +
				'</tr>' +
				'<tr>' +
				'<td>3</td>' +
				'<td>4<br>5<br>6</td>' +
				'</tr>' +
				'</table>';

			editor.s.setCursorAfter(
				editor.editor.querySelectorAll('td')[3].firstChild
			); // set cursor after 4

			simulateEvent('keydown', Jodit.KEY_UP, editor.editor);

			editor.s.insertNode(editor.createInside.text('test'), false);

			expect(editor.value).equals(
				'<table><tbody>' +
					'<tr>' +
					'<td>1</td>' +
					'<td>2test</td></tr>' +
					'<tr>' +
					'<td>3</td>' +
					'<td>' +
					'4<br>' +
					'5<br>' +
					'6' +
					'</td>' +
					'</tr>' +
					'</tbody></table>'
			);
		});

		it("After press Bottom arrow in the first cell's line cursor should move into bottom cell", function () {
			const editor = getJodit();

			editor.value =
				'<table>' +
				'<tr>' +
				'<td>1</td>' +
				'<td>2<br>3</td>' +
				'</tr>' +
				'<tr>' +
				'<td>4</td>' +
				'<td>5</td>' +
				'</tr>' +
				'</table>';

			editor.s.setCursorAfter(
				editor.editor.querySelectorAll('td')[1].lastChild
			); // set cursor after 3

			simulateEvent('keydown', Jodit.KEY_DOWN, editor.editor);

			editor.s.insertNode(editor.createInside.text('test'), false);

			expect(editor.value).equals(
				'<table><tbody>' +
					'<tr>' +
					'<td>1</td>' +
					'<td>2<br>3</td>' +
					'</tr>' +
					'<tr>' +
					'<td>4</td>' +
					'<td>test5</td>' +
					'</tr>' +
					'</tbody></table>'
			);
		});

		it("After press Tab in last table's cell in table should add new row and move into first cell form it", function () {
			const editor = getJodit();

			editor.value =
				'<table>' +
				'<tr>' +
				'<td>1</td>' +
				'<td>2</td>' +
				'</tr>' +
				'</table>';

			editor.s.setCursorAfter(
				editor.editor.querySelectorAll('td')[1].lastChild
			); // set cursor after 2

			simulateEvent('keydown', Jodit.KEY_TAB, editor.editor);

			editor.s.insertNode(editor.createInside.text('test'), false);

			expect(editor.value).equals(
				'<table><tbody>' +
					'<tr>' +
					'<td>1</td>' +
					'<td>2</td>' +
					'</tr>' +
					'<tr>' +
					'<td>test<br></td>' +
					'<td></td>' +
					'</tr>' +
					'</tbody></table>'
			);
		});

		describe('Remove row', function () {
			it('Remove simple row without rowspan should simple remove row', function () {
				const editor = getJodit();

				editor.value =
					'<table>' +
					'<tr><td>1</td><td>2</td></tr>' +
					'<tr><td>3</td><td>4</td></tr>' +
					'</table>';

				Jodit.modules.Table.removeRow(editor.editor.firstChild, 0);

				expect(editor.value.toLowerCase()).equals(
					'<table>' +
						'<tbody>' +
						'<tr><td>3</td><td>4</td></tr>' +
						'</tbody>' +
						'</table>'
				);
			});
			it('Remove row which not consists td, because of in previous row was cell with rowspan should simple remove row and decrement rowspan', function () {
				const editor = getJodit();

				editor.value =
					'<table>' +
					'<tr><td rowspan="2">1</td><td>2</td></tr>' +
					'<tr><td>3</td></tr>' +
					'</table>';

				// const table = new Jodit.modules.Table(editor);
				Jodit.modules.Table.removeRow(editor.editor.firstChild, 1);

				expect(editor.value.toLowerCase()).equals(
					'<table>' +
						'<tbody>' +
						'<tr><td>1</td><td>2</td></tr>' +
						'</tbody>' +
						'</table>'
				);
			});
			it('Remove row which not consists td, because of in previous row was cell with rowspan and colspan should simple remove row and decrement rowspan once time', function () {
				const editor = getJodit();

				editor.value =
					'<table>' +
					'<tr><td rowspan="3" colspan="2">1</td><td>2</td></tr>' +
					'<tr><td>3</td></tr>' +
					'<tr><td>4</td></tr>' +
					'<tr><td>5</td><td>6</td><td>7</td></tr>' +
					'</table>';

				// const table = new Jodit.modules.Table(editor);
				Jodit.modules.Table.removeRow(editor.editor.firstChild, 1);

				expect(editor.value.toLowerCase()).equals(
					'<table>' +
						'<tbody>' +
						'<tr><td rowspan="2" colspan="2">1</td><td>2</td></tr>' +
						'<tr><td>4</td></tr>' +
						'<tr><td>5</td><td>6</td><td>7</td></tr>' +
						'</tbody>' +
						'</table>'
				);
			});
			it('Remove row which consists td with rowspan should simple remove row and decrement rowspan and move that cell into next row', function () {
				const editor = getJodit();

				editor.value =
					'<table>' +
					'<tr><td rowspan="2">1</td><td>2</td></tr>' +
					'<tr><td>3</td></tr>' +
					'</table>';

				// const table = new Jodit.modules.Table(editor);
				Jodit.modules.Table.removeRow(editor.editor.firstChild, 0);

				expect(editor.value.toLowerCase()).equals(
					'<table>' +
						'<tbody>' +
						'<tr><td>1</td><td>3</td></tr>' +
						'</tbody>' +
						'</table>'
				);
			});
			it('Remove row which consists td with rowspan and colspan should simple remove row and decrement rowspan and move that cell into next row', function () {
				const editor = getJodit();

				editor.value =
					'<table>' +
					'<tr><td rowspan="2" colspan="2">1</td><td>2</td></tr>' +
					'<tr><td>3</td></tr>' +
					'<tr><td>4</td><td>5</td><td>6</td></tr>' +
					'</table>';

				// const table = new Jodit.modules.Table(editor);
				Jodit.modules.Table.removeRow(editor.editor.firstChild, 0);

				expect(editor.value.toLowerCase()).equals(
					'<table>' +
						'<tbody>' +
						'<tr><td colspan="2">1</td><td>3</td></tr>' +
						'<tr><td>4</td><td>5</td><td>6</td></tr>' +
						'</tbody>' +
						'</table>'
				);
			});
			it('Remove row which consists last td with rowspan and colspan should simple remove row and decrement rowspan and move that cell into next row in last position', function () {
				const editor = getJodit();

				editor.value =
					'<table>' +
					'<tr><td>1</td><td>2</td><td>3</td></tr>' +
					'<tr><td>4</td><td colspan="2" rowspan="2">5</td></tr>' +
					'<tr><td>6</td></tr>' +
					'</table>';

				// const table = new Jodit.modules.Table(editor);
				Jodit.modules.Table.removeRow(editor.editor.firstChild, 1);

				expect(editor.value.toLowerCase()).equals(
					'<table>' +
						'<tbody>' +
						'<tr><td>1</td><td>2</td><td>3</td></tr>' +
						'<tr><td>6</td><td colspan="2">5</td></tr>' +
						'</tbody>' +
						'</table>'
				);
			});
		});

		describe('Remove column', function () {
			it('Remove simple column without colspan should simple remove all cells in column', function () {
				const editor = getJodit();

				editor.value =
					'<table>' +
					'<tr><td>1</td><td>2</td></tr>' +
					'<tr><td>3</td><td>4</td></tr>' +
					'<tr><td>5</td><td>6</td></tr>' +
					'</table>';

				// const table = new Jodit.modules.Table(editor);
				Jodit.modules.Table.removeColumn(editor.editor.firstChild, 0);

				expect(editor.value.toLowerCase()).equals(
					'<table>' +
						'<tbody>' +
						'<tr><td>2</td></tr>' +
						'<tr><td>4</td></tr>' +
						'<tr><td>6</td></tr>' +
						'</tbody>' +
						'</table>'
				);
			});
			it('Remove column which consists td with colspan should remove all cells in column but that td should decrement colspan', function () {
				const editor = getJodit();

				editor.value =
					'<table>' +
					'<tr><td>1</td><td>2</td></tr>' +
					'<tr><td colspan="2">3</td></tr>' +
					'<tr><td>4</td><td>5</td></tr>' +
					'</table>';

				// const table = new Jodit.modules.Table(editor);
				Jodit.modules.Table.removeColumn(editor.editor.firstChild, 0);

				expect(editor.value.toLowerCase()).equals(
					'<table>' +
						'<tbody>' +
						'<tr><td>2</td></tr>' +
						'<tr><td>3</td></tr>' +
						'<tr><td>5</td></tr>' +
						'</tbody>' +
						'</table>'
				);
			});
			it('Remove column which not consists td with colspan should remove all cells in column but that td should decrement colspan too', function () {
				const editor = getJodit();

				editor.value =
					'<table>' +
					'<tr><td>1</td><td>2</td></tr>' +
					'<tr><td colspan="2">3</td></tr>' +
					'<tr><td>4</td><td>5</td></tr>' +
					'</table>';

				// const table = new Jodit.modules.Table(editor);
				Jodit.modules.Table.removeColumn(editor.editor.firstChild, 1);

				expect(editor.value.toLowerCase()).equals(
					'<table>' +
						'<tbody>' +
						'<tr><td>1</td></tr>' +
						'<tr><td>3</td></tr>' +
						'<tr><td>4</td></tr>' +
						'</tbody>' +
						'</table>'
				);
			});

			it('Remove column part of that td (colspan and rowspan) in another column should remove all cells in column but that td should decrement colspan once time', function () {
				const editor = getJodit();

				editor.value =
					'<table>' +
					'<tr><td>1</td><td>2</td><td>3</td><td>4</td></tr>' +
					'<tr><td>5</td><td colspan="3" rowspan="2">6</td></tr>' +
					'<tr><td>7</td></tr>' +
					'</table>';

				// const table = new Jodit.modules.Table(editor);
				Jodit.modules.Table.removeColumn(editor.editor.firstChild, 3);

				let result = editor.value.toLowerCase();

				// in ie colspan and rowspan change places but it is not so important
				result = result.replace('rowspan', 'colspan');

				expect(result).equals(
					'<table>' +
						'<tbody>' +
						'<tr><td>1</td><td>2</td><td>3</td></tr>' +
						'<tr><td>5</td><td colspan="2" colspan="2">6</td></tr>' +
						'<tr><td>7</td></tr>' +
						'</tbody>' +
						'</table>'
				);
			});
		});

		describe('Select cells', function () {
			it('When we press mouse button over cell and move mouse to another cell, it should select all cells in bound', function () {
				const editor = getJodit();

				editor.value =
					'<table>' +
					'<tr><td>1</td><td>2</td></tr>' +
					'<tr><td>3</td><td>4</td></tr>' +
					'<tr><td>5</td><td>6</td></tr>' +
					'</table>';

				let td = editor.editor.querySelector('td');

				simulateEvent('mousedown', td);

				td = editor.editor.querySelectorAll('td')[3];

				simulateEvent(['mousemove', 'mouseup'], td);

				expect(
					editor.getInstance('Table', editor.o).selected.size
				).equals(4);
			});

			describe('Set custom selected border color', function () {
				it('Should add css rule in document for selected css', function () {
					const editor = getJodit({
						table: {
							selectionCellStyle:
								'border: 1px double red !important;'
						}
					});

					editor.value =
						'<table>' +
						'<tr><td>1</td><td>2</td></tr>' +
						'<tr><td>3</td><td>4</td></tr>' +
						'<tr><td>5</td><td>6</td></tr>' +
						'</table>';

					let td = editor.editor.querySelector('td');

					simulateEvent('mousedown', td);

					td = editor.editor.querySelectorAll('td')[3];

					simulateEvent(['mousemove', 'mouseup', 'click'], td);

					expect(
						Jodit.modules.Helpers.normalizeColor(
							editor.ew.getComputedStyle(td).borderBottomColor
						)
					).equals('#FF0000');
				});

				describe('For iframe mode', function () {
					it('Should add css rule in editor document for selected css', function () {
						const editor = getJodit({
							iframe: true,
							table: {
								selectionCellStyle:
									'border: 1px double red !important;'
							}
						});

						editor.value =
							'<table>' +
							'<tr><td>1</td><td>2</td></tr>' +
							'<tr><td>3</td><td>4</td></tr>' +
							'<tr><td>5</td><td>6</td></tr>' +
							'</table>';

						let td = editor.editor.querySelector('td');

						simulateEvent('mousedown', td);

						td = editor.editor.querySelectorAll('td')[3];

						simulateEvent(['mousemove', 'mouseup', 'click'], td);

						expect(
							Jodit.modules.Helpers.normalizeColor(
								editor.ew.getComputedStyle(td).borderBottomColor
							)
						).equals('#FF0000');
					});
				});
			});

			describe('When we press mouse button over cell in subtable and move mouse to another cell', function () {
				it('should select all cells in bound in that table', function () {
					const editor = getJodit();

					editor.value =
						'<table>' +
						'<tr><td>1</td><td>2</td></tr>' +
						'<tr>' +
						'<td>3</td>' +
						'<td class="test">' +
						'<table>' +
						'<tr><td>1</td><td>2</td></tr>' +
						'<tr><td>3</td><td>4</td></tr>' +
						'<tr><td>5</td><td>6</td></tr>' +
						'</table>' +
						'</td>' +
						'</tr>' +
						'<tr><td>5</td><td>6</td></tr>' +
						'</table>';

					let td = editor.editor
							.querySelector('.test')
							.querySelector('td'),
						pos = Jodit.modules.Helpers.position(td);
					simulateEvent('mousedown', 0, td, e => {
						Object.assign(e, {
							clientX: pos.left,
							clientY: pos.top
						});
					});

					td = editor.editor
						.querySelector('.test')
						.querySelectorAll('td')[3];
					pos = Jodit.modules.Helpers.position(td);

					simulateEvent(['mousemove', 'mouseup', 'click'], td);

					expect(
						editor.getInstance('Table', editor.o).selected.size
					).equals(4);
				});
			});

			it('When we press mouse button over cell and move mouse to another cell, it should select all cells in bound even if between be colspan and rowspan', function () {
				const editor = getJodit();

				editor.value =
					'<table style="width: 100%;">' +
					'<tbody>' +
					'<tr><td colspan="3">0,0<br>0,1<br>0,2<br></td><td>0,3</td></tr>' +
					'<tr><td rowspan="3">1,0<br>2,0<br>3,0<br></td><td>1,1</td><td>1,2</td><td>1,3</td></tr>' +
					'<tr><td>2,1</td><td>2,2</td><td>2,3</td></tr>' +
					'<tr><td>3,1</td><td>3,2</td><td>3,3</td></tr>' +
					'</tbody>' +
					'</table>';

				let td = editor.editor.querySelector('td');

				simulateEvent('mousedown', td);

				td = editor.editor.querySelectorAll('td')[7];
				simulateEvent(['mousemove', 'mouseup', 'click'], td);

				expect(
					editor.getInstance('Table', editor.o).selected.size
				).equals(8);
			});
		});

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

						expect(Math.abs(resizerBox.left - box.left) < 10).is
							.true;

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
					'<table style="width: 100px; border-collapse: separate;" cellspacing="0">' +
					'<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr>' +
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

				simulateEvent('mousemove', 1, editor.ew, function (options) {
					options.clientX = box.left + 500; // can move only on 5 pixels
					options.pageX = 0;
					options.pageY = 0;
				});

				expect(
					parseInt(
						editor.container.querySelector('.jodit-table-resizer')
							.style.left,
						10
					) < 55
				).is.true;
				done();
			});

			describe('When move mouse over left edge of cell and press mouse button and move cursor to right in 5 pixels', function () {
				it('should decrease the width of the right column and the width of the left column should increase', function (done) {
					const editor = getJodit();

					editor.value =
						'<table style="width: 100px; border-collapse: separate;" cellspacing="0">' +
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
					simulateEvent('mouseup', 1, window, function (options) {
						options.clientX = box.left + 5; // move on 5 pixels
						options.pageX = 0;
						options.pageY = 0;
					});

					expect(editor.editor.innerHTML.toLowerCase()).equals(
						'<table style="width: 100px; border-collapse: separate;" cellspacing="0"><tbody>' +
							'<tr>' +
							'<td style="width: 30%;">1</td>' +
							'<td style="width: 20%;">2</td>' +
							'<td>3</td>' +
							'<td>4</td>' +
							'</tr>' +
							'</tbody></table>'
					);
					done();
				});

				describe('After resize', function () {
					it('it should restore selection', function (done) {
						const editor = getJodit();

						editor.value =
							'<p>test</p><table style="width: 100px; border-collapse: separate;" cellspacing="0">' +
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
							1,
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

						editor.s.insertHTML('stop');

						expect(sortAttributes(editor.value)).equals(
							'<p>teststop</p>' +
								'<table cellspacing="0" style="border-collapse:separate;width:100px">' +
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
							'<table style="width: 100px; border-collapse: separate;" cellspacing="0">' +
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

						expect(editor.editor.innerHTML.toLowerCase()).equals(
							'<table style="width: 100px; border-collapse: separate;" cellspacing="0"><tbody>' +
								'<tr>' +
								'<td>1</td>' +
								'<td style="width: 20%;">2</td>' +
								'<td style="width: 30%;">3</td>' +
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
								'<p>test</p><table style="width: 100px; border-collapse: separate;" cellspacing="0">' +
								'<tr><td>1</td><td>2</td><td>3</td><td>4</td></tr>' +
								'</table>';

							const td = editor.editor.querySelectorAll('td')[1],
								box = td.getBoundingClientRect();

							editor.s.setCursorIn(editor.editor.firstChild);

							simulateEvent(
								'mousemove',
								1,
								td,
								function (options) {
									options.clientX = box.left;
									options.offsetX = 0;
									options.pageX = 0;
									options.pageY = 0;
								}
							);

							simulateEvent(
								'mousedown',
								1,
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

							editor.s.insertHTML('stop');

							expect(sortAttributes(editor.value)).equals(
								'<p>teststop</p>' +
									'<table cellspacing="0" style="border-collapse:separate;width:100px">' +
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
			});

			it('When move mouse over right edge of last cell and press mouse button and move cursor to right in 50 pixels - the width of the whole table should increase', function () {
				const editor = getJodit();

				getBox().style.width = '202px';

				editor.value =
					'<table style="width: 100px; border-collapse: separate;" cellspacing="0">' +
					'<tr><td>1</td><td>2</td><td>3</td><td>5</td></tr>' +
					'</table>';
				const td = editor.editor.querySelectorAll('td')[3],
					box = td.getBoundingClientRect();

				simulateEvent('mousemove', 1, td, function (options) {
					options.clientX = box.left + box.width;
					options.offsetX = box.width;
				});

				simulateEvent(
					'mousedown',
					1,
					editor.container.querySelector('.jodit-table-resizer'),
					function (options) {
						options.clientX = box.left + box.width;
					}
				);

				simulateEvent('mousemove', 1, window, function (options) {
					options.clientX = box.left + box.width + 50;
				});
				simulateEvent('mouseup', 1, window, function (options) {
					options.clientX = box.left + box.width + 50;
				});

				expect(
					sortAttributes(editor.editor.innerHTML.toLowerCase())
				).equals(
					'<table cellspacing="0" style="border-collapse:separate;width:81.52%"><tbody>' +
						'<tr>' +
						'<td>1</td>' +
						'<td>2</td>' +
						'<td>3</td>' +
						'<td>5</td>' +
						'</tr>' +
						'</tbody></table>'
				);
			});

			describe('When move mouse over left edge of first cell', function () {
				describe('press mouse button and move cursor to left in 50 pixels', function () {
					it('should increase the width of the whole table', function () {
						const editor = getJodit();

						getBox().style.width = '202px';

						editor.value =
							'<table style="width: 100px">' +
							'<tr><td>1</td><td>2</td><td>3</td><td>4</td></tr>' +
							'</table>';

						const td = editor.editor.querySelectorAll('td')[0],
							box = td.getBoundingClientRect();

						simulateEvent('mousemove', 1, td, function (options) {
							options.clientX = box.left;
							options.offsetX = 0;
						});

						simulateEvent(
							'mousedown',
							1,
							editor.container.querySelector(
								'.jodit-table-resizer'
							),
							function (options) {
								options.clientX = box.left;
							}
						);

						simulateEvent(
							'mousemove',
							1,
							window,
							function (options) {
								options.clientX = box.left + 50;
							}
						);
						simulateEvent('mouseup', 1, window, function (options) {
							options.clientX = box.left + 50;
						});

						expect(
							sortAttributes(
								editor.editor.innerHTML.toLowerCase()
							)
						).equals(
							'<table style="margin-left:27.17%;width:27.17%">' +
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
							editor.container.querySelector(
								'.jodit-table-resizer'
							),
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
							Math.abs(positionResizer.left - positionImg.left) <
								10
						).is.true;

						expect(
							Math.abs(positionResizer.top - positionImg.top) < 10
						).is.true;

						document.body.removeChild(area);
					});
				});
			});
		});
	});
});
