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

	describe('Double click past the end of a line (#1768)', () => {
		// What Chrome and Safari select: from the end of the line's text to
		// the start of whatever follows, which shows nothing
		const selectLineBreak = (editor, text, end, endOffset = 0) => {
			const range = editor.s.createRange();
			range.setStart(text, text.nodeValue.length);
			range.setEnd(end, endOffset);
			editor.s.selectRange(range);
		};

		const caret = editor => {
			const range = editor.s.range;

			return {
				collapsed: range.collapsed,
				node: range.startContainer.nodeValue,
				offset: range.startOffset
			};
		};

		it('should put the caret at the end of the line, so typing stays on it', () => {
			const editor = getJodit();
			editor.value = '<p>The term dates:</p><p>Second paragraph.</p>';

			const [first, second] = editor.editor.querySelectorAll('p');
			selectLineBreak(editor, first.firstChild, second);
			simulateEvent('dblclick', first);

			expect(caret(editor)).deep.equals({
				collapsed: true,
				node: 'The term dates:',
				offset: 15
			});

			editor.s.insertHTML('X');

			expect(editor.value).equals(
				'<p>The term dates:X</p><p>Second paragraph.</p>'
			);
		});

		it('should keep a video on the line below', () => {
			const editor = getJodit();
			editor.value =
				'<p>Our camp is in March.</p>' +
				'<p><span contenteditable="false"><video width="320" height="180"></video></span></p>' +
				'<p>Find out more.</p>';

			const paragraphs = editor.editor.querySelectorAll('p');
			selectLineBreak(editor, paragraphs[0].firstChild, paragraphs[2]);
			simulateEvent('dblclick', paragraphs[0]);

			expect(caret(editor).collapsed).is.true;

			editor.s.insertHTML('X');

			expect(editor.value).equals(
				'<p>Our camp is in March.X</p>' +
					'<p><span contenteditable="false"><video width="320" height="180"></video></span></p>' +
					'<p>Find out more.</p>'
			);
		});

		it('should put the caret at the end of the line before a table, and of a list item', () => {
			const editor = getJodit();
			editor.value =
				'<p>Before the table</p><table><tbody><tr><td>One</td></tr></tbody></table>' +
				'<ul><li>A list item</li><li>Another item</li></ul>';

			const p = editor.editor.querySelector('p');
			selectLineBreak(editor, p.firstChild, editor.editor, 1);
			simulateEvent('dblclick', p);
			editor.s.insertHTML('X');

			const [item, next] = editor.editor.querySelectorAll('li');
			selectLineBreak(editor, item.firstChild, next);
			simulateEvent('dblclick', item);
			editor.s.insertHTML('Y');

			expect(editor.value).equals(
				'<p>Before the tableX</p><table><tbody><tr><td>One</td></tr></tbody></table>' +
					'<ul><li>A list itemY</li><li>Another item</li></ul>'
			);
		});

		it('should work in iframe mode', () => {
			const editor = getJodit({ iframe: true });
			editor.value = '<p>The term dates:</p><p>Second paragraph.</p>';

			const [first, second] = editor.editor.querySelectorAll('p');
			selectLineBreak(editor, first.firstChild, second);
			simulateEvent('dblclick', first);
			editor.s.insertHTML('X');

			expect(editor.value).equals(
				'<p>The term dates:X</p><p>Second paragraph.</p>'
			);
		});

		it('should leave a double click on a word or a space as it is', () => {
			const editor = getJodit();
			editor.value = '<p>Second paragraph.</p>';

			const text = editor.editor.querySelector('p').firstChild;

			[
				[0, 6],
				[6, 7]
			].forEach(([start, end]) => {
				const range = editor.s.createRange();
				range.setStart(text, start);
				range.setEnd(text, end);
				editor.s.selectRange(range);
				simulateEvent('dblclick', text.parentNode);

				expect(editor.s.range.toString()).equals(
					text.nodeValue.slice(start, end)
				);
			});
		});

		it('should leave a selected image as it is', () => {
			const editor = getJodit({ image: { openOnDblClick: false } });
			editor.value =
				'<p>A <img src="tests/artio.jpg" alt=""> picture</p>';

			const img = editor.editor.querySelector('img');
			const range = editor.s.createRange();
			range.selectNode(img);
			editor.s.selectRange(range);
			simulateEvent('dblclick', img);

			expect(editor.s.range.collapsed).is.false;
			expect(editor.s.current()).equals(img);
		});

		it('should leave the same selection made without a double click, as Shift+Right makes it', () => {
			const editor = getJodit();
			editor.value = '<p>The term dates:</p><p>Second paragraph.</p>';

			const [first, second] = editor.editor.querySelectorAll('p');
			selectLineBreak(editor, first.firstChild, second);
			simulateEvent(['mouseup', 'click'], first);

			expect(editor.s.range.collapsed).is.false;
		});

		it('should not add a line when the double click lands on the editing area itself', () => {
			const editor = getJodit();
			editor.value = '<p>The term dates:</p><p>Second paragraph.</p>';

			const [first, second] = editor.editor.querySelectorAll('p');
			selectLineBreak(editor, first.firstChild, second);
			simulateEvent('dblclick', editor.editor);

			expect(editor.s.range.collapsed).is.true;
			expect(editor.value).equals(
				'<p>The term dates:</p><p>Second paragraph.</p>'
			);
		});
	});

	describe('Drag onto the line of a video (#1768)', () => {
		const VIDEO =
			'<p><span contenteditable="false"><video width="320" height="180"></video></span></p>';

		const make = options => {
			const editor = getJodit(options);
			editor.value =
				'<p>Our camp is in March.</p>' +
				VIDEO +
				'<p>Find out more.</p>';

			const [above, line, below] = editor.editor.querySelectorAll('p');

			return {
				editor,
				above: above.firstChild,
				below: below.firstChild,
				video: line.querySelector('span'),
				line
			};
		};

		// What Chrome and Safari select: past the video, as there's no caret
		// position beside it
		const drag = (editor, [anchor, anchorOffset], [focus, focusOffset]) =>
			editor.s.sel.setBaseAndExtent(
				anchor,
				anchorOffset,
				focus,
				focusOffset
			);

		const release = (editor, target, clientY) =>
			simulateEvent('mouseup', target, e => {
				Object.assign(e, {
					clientX: target.getBoundingClientRect().left,
					clientY
				});
			});

		it('should stop a drag down before a video the pointer is still on', () => {
			const { editor, above, below, video, line } = make();

			drag(editor, [above, above.nodeValue.length], [below, 0]);
			release(editor, line, video.getBoundingClientRect().top + 8);

			expect(editor.s.range.collapsed).is.true;

			editor.s.insertHTML('X');

			expect(editor.value).equals(
				'<p>Our camp is in March.X</p>' +
					VIDEO +
					'<p>Find out more.</p>'
			);
		});

		it('should keep the text a drag took before the video', () => {
			const { editor, above, below, video, line } = make();

			drag(editor, [above, 15], [below, 0]);
			release(editor, line, video.getBoundingClientRect().top + 8);

			expect(editor.s.range.toString()).equals('March.');

			editor.s.insertHTML('X');

			expect(editor.value).equals(
				'<p>Our camp is in X</p>' + VIDEO + '<p>Find out more.</p>'
			);
		});

		it('should stop a drag up after a video the pointer is still on', () => {
			const { editor, above, below, video, line } = make();

			drag(editor, [below, 0], [above, above.nodeValue.length]);
			release(editor, line, video.getBoundingClientRect().bottom - 8);

			expect(editor.s.range.collapsed).is.true;

			editor.s.insertHTML('X');

			expect(editor.value).equals(
				'<p>Our camp is in March.</p>' +
					VIDEO +
					'<p>XFind out more.</p>'
			);
		});

		it('should take in the video once the pointer has passed it', () => {
			const { editor, above, below, video } = make();

			drag(editor, [above, above.nodeValue.length], [below, 0]);
			release(
				editor,
				below.parentNode,
				video.getBoundingClientRect().bottom + 5
			);

			expect(editor.s.range.collapsed).is.false;
			expect(editor.s.range.intersectsNode(video)).is.true;
		});

		it('should work in iframe mode', () => {
			const { editor, above, below, video, line } = make({
				iframe: true
			});

			drag(editor, [above, above.nodeValue.length], [below, 0]);
			release(editor, line, video.getBoundingClientRect().top + 8);
			editor.s.insertHTML('X');

			expect(editor.value).equals(
				'<p>Our camp is in March.X</p>' +
					VIDEO +
					'<p>Find out more.</p>'
			);
		});
	});

	describe('A video in the selection (#1768)', () => {
		const VALUE =
			'<p>Our camp is in March.</p>' +
			'<p><span contenteditable="false"><video width="320" height="180"></video></span></p>' +
			'<p>Find out more.</p>';

		const select = (editor, start, startOffset, end, endOffset) => {
			const range = editor.s.createRange();
			range.setStart(start, startOffset);
			range.setEnd(end, endOffset);
			editor.s.selectRange(range);
			simulateEvent('selectionchange', editor.ed);
		};

		const tint = editor =>
			editor.ew.getComputedStyle(
				editor.editor.querySelector('span'),
				'::after'
			).backgroundColor;

		const tintSize = editor => {
			const after = editor.ew.getComputedStyle(
				editor.editor.querySelector('span'),
				'::after'
			);

			return [after.width, after.height];
		};

		const TINT = 'rgb(181, 214, 253)';

		it('should be tinted as an image is, in the editing area only', () => {
			const editor = getJodit();
			editor.value = VALUE;

			const [above, , below] = editor.editor.querySelectorAll('p');
			select(editor, above.firstChild, 0, below.firstChild, 4);

			expect(tint(editor)).equals(TINT);
			expect(editor.value).equals(VALUE);
		});

		it('should tint the video alone, not the line it is on', () => {
			const editor = getJodit();
			editor.value = VALUE.replace(
				'<span contenteditable="false">',
				'<span contenteditable="false" style="display: block">'
			);

			const [above, , below] = editor.editor.querySelectorAll('p');
			select(editor, above.firstChild, 0, below.firstChild, 4);

			expect(tintSize(editor)).deep.equals(['320px', '180px']);
		});

		it('should lose the tint once the selection leaves it', () => {
			const editor = getJodit();
			editor.value = VALUE;

			const [above, , below] = editor.editor.querySelectorAll('p');
			select(editor, above.firstChild, 0, below.firstChild, 4);
			select(editor, above.firstChild, 0, above.firstChild, 4);

			expect(tint(editor)).not.equals(TINT);

			editor.s.setCursorIn(below);
			simulateEvent('selectionchange', editor.ed);

			expect(tint(editor)).not.equals(TINT);
		});

		it('should be tinted in iframe mode', () => {
			const editor = getJodit({ iframe: true });
			editor.value = VALUE;

			const [above, , below] = editor.editor.querySelectorAll('p');
			select(editor, above.firstChild, 0, below.firstChild, 4);

			expect(tint(editor)).equals(TINT);
		});
	});
});
