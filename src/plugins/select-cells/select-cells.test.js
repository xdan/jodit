/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Select cells plugin', () => {
	// https://github.com/xdan/jodit/issues/1163
	describe('Ctrl/Cmd + click multi-cell selection (#1163)', () => {
		const ctrlClick = td =>
			simulateEvent(['mousedown', 'mouseup', 'click'], td, e => {
				e.ctrlKey = true;
			});

		it('Should accumulate non-contiguous cells', () => {
			const editor = getJodit({ history: { timeout: 0 } });
			editor.value =
				'<table><tbody><tr><td>1</td><td>2</td><td>3</td></tr></tbody></table>';
			const tds = editor.editor.querySelectorAll('td');

			simulateEvent(['mousedown', 'mouseup', 'click'], tds[0]);
			ctrlClick(tds[2]);

			const selected = editor
				.getInstance('Table')
				.getAllSelectedCells()
				.map(c => c.textContent)
				.sort();
			expect(selected).deep.equals(['1', '3']);
		});

		it('Should toggle a cell off on a second ctrl+click', () => {
			const editor = getJodit({ history: { timeout: 0 } });
			editor.value =
				'<table><tbody><tr><td>1</td><td>2</td></tr></tbody></table>';
			const tds = editor.editor.querySelectorAll('td');

			simulateEvent(['mousedown', 'mouseup', 'click'], tds[0]);
			ctrlClick(tds[1]);
			expect(
				editor.getInstance('Table').getAllSelectedCells().length
			).equals(2);

			ctrlClick(tds[1]);
			expect(
				editor.getInstance('Table').getAllSelectedCells().length
			).equals(1);
		});

		it('Should show the cells popup after a ctrl+click selection', () => {
			const editor = getJodit({ history: { timeout: 0 } });
			editor.value =
				'<table><tbody><tr><td>1</td><td>2</td></tr></tbody></table>';
			const tds = editor.editor.querySelectorAll('td');

			simulateEvent(['mousedown', 'mouseup', 'click'], tds[0]);
			ctrlClick(tds[1]);

			expect(getOpenedPopup(editor)).is.not.null;
		});
	});

	describe('Delete content of several selected cells (#1273)', () => {
		[
			['backspace', Jodit.KEY_BACKSPACE],
			['delete', Jodit.KEY_DELETE]
		].forEach(([name, key]) => {
			it(`Should empty the selected cells and not throw on ${name}`, () => {
				const editor = getJodit();
				editor.value =
					'<table><tbody><tr><td>1</td><td>2</td><td>3</td></tr></tbody></table>';

				const tds = editor.editor.querySelectorAll('td');

				// Select all three cells (drag from first to last)
				simulateEvent('mousedown', tds[0]);
				simulateEvent(['mousemove', 'mouseup'], tds[2]);

				expect(
					editor.getInstance('Table').getAllSelectedCells().length
				).equals(3);

				expect(() =>
					simulateEvent('keydown', key, editor.editor)
				).does.not.throw();

				expect(sortAttributes(editor.value)).equals(
					'<table><tbody><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table>'
				);
			});
		});
	});

	describe('Cells popup after drag-select (#1174)', () => {
		it('Should keep the popup open when the selection changed right before mouseup', async () => {
			const editor = getJodit();
			editor.value =
				'<table><tbody><tr><td>1</td><td>2</td><td>3</td></tr></tbody></table>';

			const tds = editor.editor.querySelectorAll('td');

			simulateEvent('mousedown', tds[0]);
			// the first move marks the second cell
			simulateEvent('mousemove', tds[1]);
			// a pause mid-drag
			await delay(editor.defaultTimeout);
			// change the selection again and release right away
			simulateEvent('mousemove', tds[2]);
			simulateEvent('mouseup', tds[2]);
			// mousedown and mouseup happened on different cells, so the
			// browser dispatches the click on their common ancestor (TR)
			simulateEvent('click', tds[2].parentNode);

			expect(getOpenedPopup(editor)).is.not.null;

			// the popup must survive the debounced history change events
			await delay(1200);

			expect(getOpenedPopup(editor)).is.not.null;
		});
	});

	describe('Caret after Delete row or Delete column (#1595)', () => {
		const grid =
			'<tr><td>a1</td><td>b1</td><td>c1</td></tr>' +
			'<tr><td>a2</td><td>b2</td><td>c2</td></tr>' +
			'<tr><td>a3</td><td>b3</td><td>c3</td></tr>';

		[
			[
				'the next row',
				'tablebinrow',
				grid,
				'b2',
				'<tr><td>a1</td><td>b1</td><td>c1</td></tr>' +
					'<tr><td>a3</td><td>b3|</td><td>c3</td></tr>'
			],
			[
				'the previous row when the last row is deleted',
				'tablebinrow',
				grid,
				'b3',
				'<tr><td>a1</td><td>b1</td><td>c1</td></tr>' +
					'<tr><td>a2</td><td>b2|</td><td>c2</td></tr>'
			],
			[
				'the next column',
				'tablebincolumn',
				grid,
				'b2',
				'<tr><td>a1</td><td>c1</td></tr>' +
					'<tr><td>a2</td><td>c2|</td></tr>' +
					'<tr><td>a3</td><td>c3</td></tr>'
			],
			[
				'the previous column when the last column is deleted',
				'tablebincolumn',
				grid,
				'c2',
				'<tr><td>a1</td><td>b1</td></tr>' +
					'<tr><td>a2</td><td>b2|</td></tr>' +
					'<tr><td>a3</td><td>b3</td></tr>'
			],
			[
				'the next row when the row holds the start of a rowspan',
				'tablebinrow',
				'<tr><td rowspan="2">a12</td><td>b1</td></tr>' +
					'<tr><td>b2</td></tr>' +
					'<tr><td>a3</td><td>b3</td></tr>',
				'b1',
				'<tr><td>a12</td><td>b2|</td></tr>' +
					'<tr><td>a3</td><td>b3</td></tr>'
			],
			[
				'the next row when the row is inside a rowspan',
				'tablebinrow',
				'<tr><td rowspan="2">a12</td><td>b1</td></tr>' +
					'<tr><td>b2</td></tr>' +
					'<tr><td>a3</td><td>b3</td></tr>',
				'b2',
				'<tr><td>a12</td><td>b1</td></tr>' +
					'<tr><td>a3</td><td>b3|</td></tr>'
			],
			[
				'the next column when the column runs through a colspan',
				'tablebincolumn',
				'<tr><td colspan="2">ab1</td><td>c1</td></tr>' +
					'<tr><td>a2</td><td>b2</td><td>c2</td></tr>',
				'b2',
				'<tr><td>ab1</td><td>c1</td></tr>' +
					'<tr><td>a2</td><td>c2|</td></tr>'
			]
		].forEach(([name, command, rows, text, result]) => {
			it(`Should put the caret in ${name} on ${command}`, () => {
				const editor = getJodit();

				editor.value = '<table><tbody>' + rows + '</tbody></table>';

				const cell = Array.from(
					editor.editor.querySelectorAll('td')
				).find(td => td.textContent === text);

				editor.s.setCursorIn(cell);
				editor.getInstance('Table', editor.o).addSelection(cell);

				editor.execCommand(command);

				replaceCursorToChar(editor);

				expect(editor.value).equals(
					'<table><tbody>' + result + '</tbody></table>'
				);
			});
		});
	});

	describe('Stop selection when the drop target is not part of the table (#1357)', () => {
		it('Should not throw when the selected cells are no longer in the table matrix', () => {
			const editor = getJodit();

			editor.value =
				'<table>' +
				'<tbody>' +
				'<tr><td>1</td><td>2</td></tr>' +
				'<tr><td>3</td><td>4</td></tr>' +
				'</tbody>' +
				'</table>';

			const table = editor.editor.querySelector('table');
			const td = table.querySelector('td');

			// Begin a cell selection — registers the mouseup handler and stores
			// the anchor cell.
			simulateEvent('mousedown', td);

			// Emulate a drag-and-drop that moved the anchor cell out of the
			// table (so it is no longer part of the formal matrix)...
			td.remove();

			// ...and dropped onto a cell that does not belong to this table.
			const orphan = editor.createInside.element('td');
			const original = editor.ed.elementFromPoint;
			editor.ed.elementFromPoint = () => orphan;

			expect(() => simulateEvent('mouseup', table)).does.not.throw();

			editor.ed.elementFromPoint = original;
		});
	});

	describe('Delete the last row or column (#1597)', () => {
		[
			[
				'the only row',
				'tablebinrow',
				'<p>Before</p>' +
					'<table><tbody><tr><td>a1</td><td>b1</td></tr></tbody></table>' +
					'<p>After</p>',
				['a1'],
				'<p>Before</p><p>|After</p>'
			],
			[
				'the only column',
				'tablebincolumn',
				'<p>Before</p>' +
					'<table><tbody><tr><td>a1</td></tr><tr><td>a2</td></tr></tbody></table>' +
					'<p>After</p>',
				['a2'],
				'<p>Before</p><p>|After</p>'
			],
			[
				'every row at once',
				'tablebinrow',
				'<p>Before</p>' +
					'<table><tbody>' +
					'<tr><td>a1</td><td>b1</td></tr>' +
					'<tr><td>a2</td><td>b2</td></tr>' +
					'</tbody></table>' +
					'<p>After</p>',
				['a1', 'b1', 'a2', 'b2'],
				'<p>Before</p><p>|After</p>'
			],
			[
				'the only row of a table at the end',
				'tablebinrow',
				'<p>Before</p>' +
					'<table><tbody><tr><td>a1</td><td>b1</td></tr></tbody></table>',
				['b1'],
				'<p>Before|</p>'
			],
			[
				'the only row of a table in a cell',
				'tablebinrow',
				'<table><tbody><tr>' +
					'<td>x<table><tbody><tr><td>n1</td></tr></tbody></table></td>' +
					'<td>b1</td>' +
					'</tr></tbody></table>',
				['n1'],
				'<table><tbody><tr><td>x|</td><td>b1</td></tr></tbody></table>'
			]
		].forEach(([name, command, html, texts, result]) => {
			it(`Should remove the table and put the caret where it was after deleting ${name}`, () => {
				const editor = getJodit();

				editor.value = html;

				const cells = texts.map(text =>
					Array.from(editor.editor.querySelectorAll('td')).find(
						td => td.textContent === text
					)
				);

				editor.s.setCursorIn(cells[0]);
				cells.forEach(cell =>
					editor.getInstance('Table', editor.o).addSelection(cell)
				);

				if (cells.length > 1) {
					editor.s.sel.removeAllRanges();
				}

				editor.execCommand(command);

				replaceCursorToChar(editor);

				expect(editor.value).equals(result);
			});
		});

		it('Should put the caret where the table was after Delete table with several cells selected', () => {
			const editor = getJodit();

			editor.value =
				'<p>Before</p>' +
				'<table><tbody><tr><td>a1</td><td>b1</td></tr></tbody></table>' +
				'<p>After</p>';

			const tds = editor.editor.querySelectorAll('td');

			editor.s.setCursorIn(tds[0]);
			tds.forEach(td =>
				editor.getInstance('Table', editor.o).addSelection(td)
			);
			editor.s.sel.removeAllRanges();

			editor.execCommand('tablebin');

			replaceCursorToChar(editor);

			expect(editor.value).equals('<p>Before</p><p>|After</p>');
		});
	});
	describe('A key that moves the caret to another cell (#1643)', () => {
		// The browser moves the caret between keydown and keyup, unless
		// table-keyboard-navigation does it on keydown
		function pressKey(editor, key, moveCaret) {
			simulateEvent('keydown', key, editor.editor);
			moveCaret && moveCaret();
			simulateEvent('keyup', key, editor.editor);
		}

		function clickCell(editor, td) {
			const pos = Jodit.modules.Helpers.position(td);

			editor.s.setCursorIn(td);
			simulateEvent(['mousedown', 'mouseup', 'click'], td, e => {
				Object.assign(e, { clientX: pos.left, clientY: pos.top });
			});
		}

		const marked = editor =>
			editor.getInstance('Table').getAllSelectedCells();

		it('Should mark the cell the caret moved into, as a click on it does', () => {
			const editor = getJodit();
			editor.value =
				'<p>Before</p><table><tbody>' +
				'<tr><td>1</td><td>2</td></tr>' +
				'<tr><td>3</td><td>4</td></tr>' +
				'</tbody></table>';

			const tds = editor.editor.querySelectorAll('td');
			clickCell(editor, tds[0]);
			expect(marked(editor)).deep.equals([tds[0]]);

			pressKey(editor, Jodit.KEY_RIGHT, () =>
				editor.s.setCursorIn(tds[1], true)
			);
			expect(marked(editor)).deep.equals([tds[1]]);
			expect(getOpenedPopup(editor)).is.not.null;

			pressKey(editor, Jodit.KEY_DOWN);
			expect(marked(editor)).deep.equals([tds[3]]);
			expect(getOpenedPopup(editor)).is.not.null;

			pressKey(editor, 'Shift');
			expect(marked(editor)).deep.equals([tds[3]]);
		});

		it('Should unmark the cells once the caret has left the table', () => {
			const editor = getJodit();
			editor.value =
				'<p>Before</p><table><tbody><tr><td>1</td><td>2</td></tr></tbody></table>';

			const td = editor.editor.querySelector('td');
			clickCell(editor, td);
			expect(marked(editor)).deep.equals([td]);

			pressKey(editor, Jodit.KEY_UP, () =>
				editor.s.setCursorIn(editor.editor.querySelector('p'))
			);
			expect(marked(editor)).deep.equals([]);
			expect(getOpenedPopup(editor)).is.null;
		});

		it("Should bring the cell's popup back when the caret leaves a link in the cell", () => {
			const editor = getJodit();
			editor.value =
				'<table><tbody><tr><td>One <a href="#">link</a> two</td></tr></tbody></table>';

			const td = editor.editor.querySelector('td');
			const link = td.querySelector('a');
			const isCellPopup = () =>
				Boolean(
					getOpenedPopup(editor)?.querySelector(
						'.jodit-toolbar-button_splitv'
					)
				);

			clickCell(editor, td);
			editor.s.setCursorIn(td.firstChild, true);
			expect(isCellPopup()).is.true;

			pressKey(editor, Jodit.KEY_RIGHT, () =>
				editor.s.setCursorIn(link, true)
			);
			expect(getOpenedPopup(editor)).is.not.null;
			expect(isCellPopup()).is.false;

			pressKey(editor, Jodit.KEY_RIGHT, () =>
				editor.s.setCursorIn(td.lastChild)
			);
			expect(isCellPopup()).is.true;
			expect(marked(editor)).deep.equals([td]);
		});

		it('Should follow the caret while a key is held down', () => {
			const editor = getJodit();
			editor.value =
				'<p>Before</p><table><tbody><tr><td>1</td><td>2</td></tr></tbody></table>';

			const td = editor.editor.querySelector('td');
			editor.s.setCursorIn(editor.editor.querySelector('p'));

			// A held key sends keydown again for each repeat, and one keyup
			simulateEvent('keydown', Jodit.KEY_DOWN, editor.editor);
			editor.s.setCursorIn(td, true);
			simulateEvent('keydown', Jodit.KEY_DOWN, editor.editor, e => {
				e.repeat = true;
			});

			expect(marked(editor)).deep.equals([td]);
			expect(getOpenedPopup(editor)).is.not.null;
		});

		it('Should mark the cell when the caret comes into the table', () => {
			const editor = getJodit();
			editor.value =
				'<p>Before</p><table><tbody><tr><td>1</td><td>2</td></tr></tbody></table>';

			const td = editor.editor.querySelector('td');
			editor.s.setCursorIn(editor.editor.querySelector('p'));

			pressKey(editor, Jodit.KEY_DOWN, () =>
				editor.s.setCursorIn(td, true)
			);
			expect(marked(editor)).deep.equals([td]);
			expect(getOpenedPopup(editor)).is.not.null;
		});
	});

	describe('The marks follow the mouse at once (#1778)', () => {
		const VALUE =
			'<table style="width: 300px"><tbody>' +
			'<tr><td>One</td><td>Two</td></tr>' +
			'<tr><td>Three</td><td>Four</td></tr>' +
			'<tr><td>Five</td><td>Six</td></tr>' +
			'</tbody></table>';

		const over = element => e => {
			const box = element.getBoundingClientRect();

			Object.assign(e, {
				clientX: box.left + Math.min(box.width / 2, 20),
				clientY: (box.top + box.bottom) / 2
			});
		};

		const marked = editor =>
			editor
				.getInstance(Jodit.modules.Table, editor.o)
				.getAllSelectedCells();

		const column = editor =>
			Array.from(editor.editor.querySelector('table').rows).map(
				row => row.cells[1]
			);

		it('should mark the cells as soon as the mouse goes into another one, however quickly', () => {
			// The throttle that marked them came from this timeout
			const editor = getJodit({ defaultTimeout: 100 });
			editor.value = VALUE;

			const [two, four, six] = column(editor);

			simulateEvent('mousedown', two, over(two));
			simulateEvent('mousemove', two, over(two));
			simulateEvent('mousemove', four, over(four));

			expect(marked(editor)).deep.equals([two, four]);

			simulateEvent('mousemove', six, over(six));

			expect(marked(editor)).deep.equals([two, four, six]);
		});
	});

	describe('A drag over a table nested in a cell', () => {
		const VALUE =
			'<table style="width: 300px"><tbody><tr>' +
			'<td>One two<table><tbody><tr><td>Three four</td></tr></tbody></table></td>' +
			'<td>Five</td>' +
			'</tr></tbody></table>';

		const over = element => e => {
			const box = element.getBoundingClientRect();

			Object.assign(e, {
				clientX: box.left + Math.min(box.width / 2, 20),
				clientY: (box.top + box.bottom) / 2
			});
		};

		const marked = editor =>
			editor
				.getInstance(Jodit.modules.Table, editor.o)
				.getAllSelectedCells();

		it("should keep the browser's own selection while the mouse stays in the cell, and mark the cell it goes on to", () => {
			const editor = getJodit();
			editor.value = VALUE;

			const [outer, five] =
				editor.editor.querySelector('table').rows[0].cells;
			const inner = outer.querySelector('td');
			const [oneTwo, threeFour] = [outer.firstChild, inner.firstChild];

			simulateEvent('mousedown', outer, over(outer));

			// The browsers' selection from the drag, so far
			const range = editor.s.createRange();
			range.setStart(oneTwo, 4);
			range.setEnd(threeFour, 5);
			editor.s.selectRange(range);

			simulateEvent('mousemove', inner, over(inner));

			expect(marked(editor)).to.have.ordered.members([outer]);
			expect(editor.isLocked).is.false;

			const selected = editor.s.range;
			expect([
				selected.startContainer,
				selected.startOffset,
				selected.endContainer,
				selected.endOffset
			]).deep.equals([oneTwo, 4, threeFour, 5]);

			simulateEvent('mousemove', five, over(five));
			expect(marked(editor)).to.have.ordered.members([outer, five]);

			simulateEvent('mousemove', inner, over(inner));
			expect(marked(editor)).to.have.ordered.members([outer]);

			simulateEvent('mouseup', inner, over(inner));
		});
	});

	describe('A drag let go outside the table (#1774)', () => {
		const VALUE =
			'<table style="width: 300px"><tbody>' +
			'<tr><td>One</td><td>Two</td></tr>' +
			'<tr><td>Three</td><td>Four</td></tr>' +
			'</tbody></table>' +
			'<p>After the table, with <a href="https://example.com/">a link</a>.</p>';

		const over = element => e => {
			const box = element.getBoundingClientRect();

			Object.assign(e, {
				clientX: box.left + Math.min(box.width / 2, 20),
				clientY: (box.top + box.bottom) / 2
			});
		};

		const marked = editor =>
			editor
				.getInstance(Jodit.modules.Table, editor.o)
				.getAllSelectedCells();

		// A press in "Four", over "Three" or not, let go on the line after
		const dragOut = (editor, across = true) => {
			const [three, four] =
				editor.editor.querySelector('table').rows[1].cells;
			const p = editor.editor.querySelector('p');

			simulateEvent('mousedown', four, over(four));

			if (across) {
				simulateEvent('mousemove', three, over(three));
			}

			simulateEvent('mouseup', p, over(p));
			// The press and the release were in different elements, so the
			// browsers click their common ancestor
			simulateEvent('click', editor.editor, over(p));

			return [three, four];
		};

		const hoverOne = editor => {
			const one = editor.editor.querySelector('td');
			simulateEvent('mousemove', one, over(one));
		};

		it('should keep the cells marked, open their popup and unlock the editor', () => {
			const editor = getJodit();
			editor.value = VALUE;

			const cells = dragOut(editor);

			expect(marked(editor)).deep.equals(cells);
			expect(getOpenedPopup(editor)).is.not.null;
			expect(editor.isLocked).is.false;
		});

		it("should take away the browser's own selection from the drag, as a release over a cell does", () => {
			const editor = getJodit();
			editor.value = VALUE;

			const [three, four] =
				editor.editor.querySelector('table').rows[1].cells;
			const p = editor.editor.querySelector('p');

			simulateEvent('mousedown', four, over(four));
			simulateEvent('mousemove', three, over(three));
			simulateEvent('mouseup', p, over(p));

			// The browsers go on stretching their selection from the press once
			// the mouse leaves the table, where select-cells takes it away
			const range = editor.s.createRange();
			range.setStart(four.firstChild, 1);
			range.setEnd(p.firstChild, 3);
			editor.s.selectRange(range);

			simulateEvent('click', editor.editor, over(p));

			expect(editor.s.sel.rangeCount).equals(0);
			expect(marked(editor)).deep.equals([three, four]);
		});

		it('should leave the marks as they are when the mouse goes over the table afterwards', () => {
			const editor = getJodit();
			editor.value = VALUE;

			const cells = dragOut(editor);
			hoverOne(editor);

			expect(marked(editor)).deep.equals(cells);
			expect(editor.isLocked).is.false;
		});

		it('should mark nothing when the mouse goes over the table after a drag from one cell out of it', () => {
			const editor = getJodit();
			editor.value = VALUE;

			dragOut(editor, false);
			hoverOne(editor);

			expect(marked(editor)).deep.equals([]);
			expect(editor.isLocked).is.false;
		});

		it('should drop the marks and unlock the editor when let go outside the editor, as a click outside does', () => {
			const editor = getJodit();
			editor.value = VALUE;

			const [three, four] =
				editor.editor.querySelector('table').rows[1].cells;

			simulateEvent('mousedown', four, over(four));
			simulateEvent('mousemove', three, over(three));
			simulateEvent(['mouseup', 'click'], document.body);
			hoverOne(editor);

			expect(marked(editor)).deep.equals([]);
			expect(editor.isLocked).is.false;
		});

		it('should work in iframe mode', () => {
			const editor = getJodit({ iframe: true });
			editor.value = VALUE;

			const cells = dragOut(editor);
			hoverOne(editor);

			expect(marked(editor)).deep.equals(cells);
			expect(editor.isLocked).is.false;
		});
	});
});
