/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test select plugin', () => {
	describe('On triple click', () => {
		[
			[
				'<p>|Test and pop</p><p>other</p>',
				'<p>|Test and pop|</p><p>other</p>'
			],
			[
				'<h1>|Test and pop</h1><p>other</p>',
				'<h1>|Test and pop|</h1><p>other</p>'
			],
			[
				'<h1>Test <strong>|and pop</strong></h1><p>other</p>',
				'<h1>|Test <strong>and pop</strong>|</h1><p>other</p>'
			],
			[
				'<h1>Test <strong>|and pop</strong><span>loop</span></h1><p>other</p>',
				'<h1>|Test <strong>and pop</strong><span>loop</span>|</h1><p>other</p>'
			],
			[
				'<ul><li>|test <strong>pop stop</strong></li><li>land me</li></ul>',
				'<ul><li>|test <strong>pop stop</strong>|</li><li>land me</li></ul>'
			]
		].forEach(([input, output]) => {
			describe(`Selection in ${input}`, () => {
				it('Should select content inside block', () => {
					const editor = getJodit();
					editor.value = input;
					setCursorToChar(editor);
					simulateEvent('click', editor.editor.firstChild, () => ({
						detail: 3
					}));
					replaceCursorToChar(editor);
					expect(editor.value).to.be.equal(output);
				});
			});
		});
	});

	describe('Keep pending format after a click (#1291)', () => {
		it('Should apply pending bold+italic+underline to text typed after a click', async () => {
			const editor = getJodit({ cleanHTML: { timeout: 0 } });
			editor.value = '<p>text<strong><em><u></u></em></strong></p>';

			// A real click lands at the end of "text", just before the empty
			// pending-format markers (verified via caretRangeFromPoint).
			const t = editor.editor.querySelector('p').firstChild;
			const range = editor.s.createRange();
			range.setStart(t, t.nodeValue.length);
			range.collapse(true);
			editor.s.selectRange(range);

			// Real click order: mousedown (clean-html) then click (correction).
			simulateEvent('mousedown', editor.editor);
			simulateEvent('click', editor.editor);
			await editor.async.requestIdlePromise();
			await editor.async.requestIdlePromise();

			editor.s.insertHTML('X');

			expect(sortAttributes(editor.value)).equals(
				'<p>text<strong><em><u>X</u></em></strong></p>'
			);
		});
	});

	describe('Click to the right of a nested list item (#1296)', () => {
		it('Should put the cursor at the end of the line, not the start', () => {
			const editor = getJodit();
			editor.value =
				'<ul><li>Level one text<ul><li>Level two text</li></ul></li></ul>';

			const li = editor.editor.querySelector('li');
			const text = li.firstChild;

			// Emulate Blink placing the caret at the start of the line on click
			const range = editor.s.createRange();
			range.setStart(text, 0);
			range.collapse(true);
			editor.s.selectRange(range);

			const measure = editor.s.createRange();
			measure.selectNodeContents(text);
			const rect = measure.getBoundingClientRect();

			simulateEvent('click', li, e => {
				Object.assign(e, {
					clientX: rect.right + 50,
					clientY: (rect.top + rect.bottom) / 2
				});
			});

			editor.s.insertHTML('X');

			expect(sortAttributes(editor.value)).equals(
				'<ul><li>Level one textX<ul><li>Level two text</li></ul></li></ul>'
			);
		});
	});

	describe('A click to the right of a table row (#1770)', () => {
		const TABLE =
			'<table style="width: 300px"><tbody>' +
			'<tr><td>One</td><td>Two</td></tr>' +
			'<tr><td>Three</td><td>Four</td></tr>' +
			'</tbody></table>';

		const VALUE = TABLE + '<p>After the table.</p>';

		const beside = (editor, row) => {
			const table = editor.editor.querySelector('table');
			const box = table.getBoundingClientRect();
			const line = table.rows[row].getBoundingClientRect();

			return e => {
				Object.assign(e, {
					clientX: box.right + 50,
					clientY: (line.top + line.bottom) / 2,
					button: 0,
					detail: 1
				});
			};
		};

		const clickBeside = (editor, row) => {
			simulateEvent('mousedown', editor.editor, beside(editor, row));
			simulateEvent('mouseup', editor.editor, beside(editor, row));
			simulateEvent('click', editor.editor, beside(editor, row));
		};

		// Just inside a text's letter, as a move with the button held
		const overLetter = (editor, text, offset) => {
			const letter = editor.s.createRange();
			letter.setStart(text, offset);
			letter.setEnd(text, offset + 1);
			const box = letter.getBoundingClientRect();

			return e => {
				Object.assign(e, {
					clientX: box.left + 1,
					clientY: (box.top + box.bottom) / 2,
					buttons: 1
				});
			};
		};

		it('should send typing beside a row into the first cell of the next row', () => {
			const editor = getJodit();
			editor.value = VALUE;

			clickBeside(editor, 0);
			editor.s.insertHTML('X');

			expect(editor.value).equals(
				VALUE.replace('<td>Three', '<td>XThree')
			);
		});

		it('should send typing beside the last row to the start of the line after the table', () => {
			const editor = getJodit();
			editor.value = VALUE;

			clickBeside(editor, 1);
			editor.s.insertHTML('X');

			expect(editor.value).equals(VALUE.replace('<p>After', '<p>XAfter'));
		});

		it('should start a line after a table with nothing after it', () => {
			const editor = getJodit();
			editor.value = TABLE;

			clickBeside(editor, 1);
			editor.s.insertHTML('X');

			expect(editor.value).equals(TABLE + '<p>X</p>');
		});

		it('should put the caret there as the mouse goes down, and keep the browser from putting its own after the table', () => {
			const editor = getJodit();
			editor.value = VALUE;

			const at = {};
			beside(editor, 0)(at);

			const down = new MouseEvent('mousedown', {
				...at,
				bubbles: true,
				cancelable: true
			});

			expect(editor.editor.dispatchEvent(down)).is.false;
			expect(editor.s.range.startContainer.nodeValue).equals('Three');
		});

		it('should put the caret back on the release, as in iframe mode a press without the focus moves it to the end', () => {
			const editor = getJodit();
			editor.value = VALUE;

			simulateEvent('mousedown', editor.editor, beside(editor, 0));
			editor.s.setCursorIn(editor.editor.querySelector('p'), false);
			simulateEvent('mouseup', editor.editor, beside(editor, 0));
			editor.s.insertHTML('X');

			expect(editor.value).equals(
				VALUE.replace('<td>Three', '<td>XThree')
			);
		});

		it('should select from the end of the row with a drag from beside it back over the row, and not the rows below', () => {
			const editor = getJodit();
			editor.value = VALUE;

			const table = editor.editor.querySelector('table');
			const one = table.rows[0].cells[0];
			table.scrollIntoView({ block: 'center' });

			simulateEvent('mousedown', editor.editor, beside(editor, 0));
			simulateEvent(
				'mousemove',
				editor.ew,
				overLetter(editor, one.firstChild, 0)
			);
			simulateEvent(
				'mouseup',
				one,
				overLetter(editor, one.firstChild, 0)
			);
			simulateEvent('click', editor.editor);

			expect(editor.s.range.toString()).equals('OneTwo');
		});

		it('should select from the end of the row with a drag from beside it to the line below the table', () => {
			const editor = getJodit();
			editor.value = VALUE;

			const p = editor.editor.querySelector('p');
			p.scrollIntoView({ block: 'center' });

			simulateEvent('mousedown', editor.editor, beside(editor, 0));
			simulateEvent(
				'mousemove',
				editor.ew,
				overLetter(editor, p.firstChild, 5)
			);

			expect(editor.s.range.toString()).equals('ThreeFourAfter');
		});

		it('should go back to the caret when the drag comes back beside the row', () => {
			const editor = getJodit();
			editor.value = VALUE;

			const p = editor.editor.querySelector('p');

			simulateEvent('mousedown', editor.editor, beside(editor, 0));
			simulateEvent(
				'mousemove',
				editor.ew,
				overLetter(editor, p.firstChild, 5)
			);
			simulateEvent('mousemove', editor.editor, e => {
				beside(editor, 0)(e);
				e.buttons = 1;
			});
			simulateEvent('mouseup', editor.editor, beside(editor, 0));
			editor.s.insertHTML('X');

			expect(editor.value).equals(
				VALUE.replace('<td>Three', '<td>XThree')
			);
		});

		it('should take a double click beside a row as a click, adding no line', () => {
			const editor = getJodit();
			editor.value = VALUE;

			const twice = e => {
				beside(editor, 0)(e);
				e.detail = 2;
			};

			clickBeside(editor, 0);
			simulateEvent('mousedown', editor.editor, twice);
			simulateEvent('mouseup', editor.editor, twice);
			simulateEvent('click', editor.editor, twice);
			simulateEvent('dblclick', editor.editor, twice);
			editor.s.insertHTML('X');

			expect(editor.value).equals(
				VALUE.replace('<td>Three', '<td>XThree')
			);
		});

		it('should leave a click to the right of a line of text alone', () => {
			const editor = getJodit();
			editor.value = '<p>A line of text</p>' + VALUE;

			const p = editor.editor.querySelector('p');
			const box = p.getBoundingClientRect();
			const at = e => {
				Object.assign(e, {
					clientX: box.right - 5,
					clientY: (box.top + box.bottom) / 2,
					button: 0,
					detail: 1
				});
			};

			simulateEvent('mousedown', editor.editor, at);
			editor.s.setCursorIn(p);
			simulateEvent('mouseup', editor.editor, at);
			simulateEvent('click', editor.editor, at);

			expect(editor.s.range.startContainer.nodeValue).equals(
				'A line of text'
			);
		});

		it('should work in iframe mode', () => {
			const editor = getJodit({ iframe: true });
			editor.value = VALUE;

			clickBeside(editor, 0);
			editor.s.insertHTML('X');

			expect(editor.value).equals(
				VALUE.replace('<td>Three', '<td>XThree')
			);
		});
	});
});
