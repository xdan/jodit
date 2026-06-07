/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Select cells plugin', () => {
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
});
