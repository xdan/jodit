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

		it('should put the caret at the end of the line with whitespace before the next block', () => {
			const editor = getJodit();
			editor.value = '<p>The term dates:</p>\n<p>Second paragraph.</p>';

			const [first, second] = editor.editor.querySelectorAll('p');
			selectLineBreak(editor, first.firstChild, second);
			simulateEvent('dblclick', first);
			editor.s.insertHTML('X');

			expect(editor.value).equals(
				'<p>The term dates:X</p>\n<p>Second paragraph.</p>'
			);
		});

		it('should put the caret before a <br> Chrome selects whole, at the end of a line or on an empty one', () => {
			const editor = getJodit();

			[
				[1, '<p>The term dates:X<br>Term 1<br><br>Term 2</p>'],
				[4, '<p>The term dates:<br>Term 1<br>X<br>Term 2</p>']
			].forEach(([index, result]) => {
				editor.value = '<p>The term dates:<br>Term 1<br><br>Term 2</p>';

				const p = editor.editor.querySelector('p');
				const range = editor.s.createRange();
				range.setStart(p, index);
				range.setEnd(p, index + 1);
				editor.s.selectRange(range);
				simulateEvent('dblclick', p);
				editor.s.insertHTML('X');

				expect(editor.value).equals(result);
			});
		});

		it('should keep a <br> between blocks, which Chrome selects with the line break before it', () => {
			const editor = getJodit();
			editor.value = '<p>The term dates:</p><br><p>Second paragraph.</p>';

			const [first, second] = editor.editor.querySelectorAll('p');
			selectLineBreak(editor, first.firstChild, second);
			simulateEvent('dblclick', editor.editor.querySelector('br'));
			editor.s.insertHTML('X');

			expect(editor.value).equals(
				'<p>The term dates:X</p><br><p>Second paragraph.</p>'
			);
		});

		it('should keep an <hr> a double click lands on, which Chrome selects as the line break before it', () => {
			const editor = getJodit();
			editor.value = '<p>The term dates:</p><hr><p>Second paragraph.</p>';

			const p = editor.editor.querySelector('p');
			selectLineBreak(editor, p.firstChild, editor.editor, 1);
			simulateEvent('dblclick', editor.editor.querySelector('hr'));
			editor.s.insertHTML('X');

			expect(editor.value).equals(
				'<p>The term dates:X</p><hr><p>Second paragraph.</p>'
			);
		});

		it('should leave a selection that holds an <hr> as it is', () => {
			const editor = getJodit();
			editor.value = '<p>The term dates:</p><hr><p>Second paragraph.</p>';

			const [first, second] = editor.editor.querySelectorAll('p');
			selectLineBreak(editor, first.firstChild, second);
			simulateEvent('dblclick', editor.editor.querySelector('hr'));

			expect(editor.s.range.collapsed).is.false;
		});

		it('should put the caret at the end of a cell, which Safari selects up to the next one', () => {
			const editor = getJodit();
			editor.value =
				'<table><tbody><tr><td>One</td><td><br></td></tr></tbody></table>';

			const [one, empty] = editor.editor.querySelectorAll('td');
			selectLineBreak(editor, one.firstChild, empty);
			simulateEvent('dblclick', one);

			expect(caret(editor)).deep.equals({
				collapsed: true,
				node: 'One',
				offset: 3
			});
		});

		it('should leave a selection that holds an empty cell as it is', () => {
			const editor = getJodit();
			editor.value =
				'<table><tbody><tr><td>One</td><td><br></td><td>Three</td></tr></tbody></table>';

			const [one, empty, three] = editor.editor.querySelectorAll('td');
			selectLineBreak(editor, one.firstChild, three);
			simulateEvent('dblclick', empty);

			expect(editor.s.range.collapsed).is.false;
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

		it('should leave a space between two formatted words, which Safari selects from the end of the first, as it is', () => {
			const editor = getJodit();
			editor.value = '<p><strong>Second</strong> <em>paragraph</em></p>';

			const [word, space] = editor.editor.querySelector('p').childNodes;
			const range = editor.s.createRange();
			range.setStart(word.firstChild, 6);
			range.setEnd(space, 1);
			editor.s.selectRange(range);
			simulateEvent('dblclick', space.parentNode);

			expect(editor.s.range.toString()).equals(' ');
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
				'<p>Our camp is in&nbsp;X</p>' + VIDEO + '<p>Find out more.</p>'
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

		it('should keep the start of a drag up as the anchor', () => {
			const { editor, above, below, video, line } = make();

			drag(editor, [below, 4], [above, above.nodeValue.length]);
			release(editor, line, video.getBoundingClientRect().bottom - 8);

			const { anchorNode, anchorOffset, focusNode, focusOffset } =
				editor.s.sel;

			expect([
				anchorNode,
				anchorOffset,
				focusNode,
				focusOffset
			]).deep.equals([below, 4, below, 0]);
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

		it('should stop after an empty line above the video', () => {
			const editor = getJodit();
			editor.value =
				'<p>Our camp is in March.</p><p><br></p>' +
				VIDEO +
				'<p>Find out more.</p>';

			const [above, empty, line, below] =
				editor.editor.querySelectorAll('p');
			const video = line.querySelector('span');

			drag(editor, [above.firstChild, 21], [below.firstChild, 0]);
			release(editor, line, video.getBoundingClientRect().top + 8);

			expect(editor.s.range.intersectsNode(empty)).is.true;
			expect(editor.s.range.intersectsNode(video)).is.false;

			editor.s.insertHTML('X');

			expect(editor.value).equals(
				'<p>Our camp is in March.X</p>' +
					VIDEO +
					'<p>Find out more.</p>'
			);
		});

		it('should stop in a table above the video, without looking past it', () => {
			const editor = getJodit();
			editor.value =
				'<p>Our camp is in March.</p>' +
				'<table><tbody><tr><td><br></td></tr></tbody></table>' +
				VIDEO +
				'<p>Find out more.</p>';

			const [above, line, below] = editor.editor.querySelectorAll('p');
			const video = line.querySelector('span');

			drag(editor, [above.firstChild, 21], [below.firstChild, 0]);
			release(editor, line, video.getBoundingClientRect().top + 8);

			expect(
				editor.s.range.intersectsNode(
					editor.editor.querySelector('table')
				)
			).is.true;
			expect(editor.s.range.intersectsNode(video)).is.false;
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

		const isShaded = (editor, selector = 'video') =>
			editor.ew
				.getComputedStyle(editor.editor.querySelector(selector))
				.filter.includes('feFlood');

		it('should be shaded as an image is, without changing the value', () => {
			const editor = getJodit();
			editor.value = VALUE;

			const [above, , below] = editor.editor.querySelectorAll('p');
			select(editor, above.firstChild, 0, below.firstChild, 4);

			expect(isShaded(editor)).is.true;
			expect(editor.value).equals(VALUE);
		});

		it('should shade the video, and not tint its wrapper, which can fill the line', () => {
			const editor = getJodit();
			editor.value = VALUE.replace(
				'<span contenteditable="false">',
				'<span contenteditable="false" style="display: block">'
			);

			const [above, , below] = editor.editor.querySelectorAll('p');
			select(editor, above.firstChild, 0, below.firstChild, 4);

			expect(isShaded(editor)).is.true;
			expect(isShaded(editor, 'span')).is.false;
			expect(
				editor.ew.getComputedStyle(
					editor.editor.querySelector('span'),
					'::selection'
				).backgroundColor
			).equals('rgba(0, 0, 0, 0)');
		});

		it("should leave the wrapper's position and ::after as they are", () => {
			const editor = getJodit();
			editor.value = VALUE;

			const wrapper = editor.editor.querySelector('span');
			const own = () => [
				editor.ew.getComputedStyle(wrapper).position,
				editor.ew.getComputedStyle(wrapper, '::after').content
			];

			const before = own();
			const [above, , below] = editor.editor.querySelectorAll('p');
			select(editor, above.firstChild, 0, below.firstChild, 4);

			expect(isShaded(editor)).is.true;
			expect(own()).deep.equals(before);
		});

		it('should lose the shade once the selection leaves it', () => {
			const editor = getJodit();
			editor.value = VALUE;

			const [above, , below] = editor.editor.querySelectorAll('p');
			select(editor, above.firstChild, 0, below.firstChild, 4);
			select(editor, above.firstChild, 0, above.firstChild, 4);

			expect(isShaded(editor)).is.false;

			editor.s.setCursorIn(below);
			simulateEvent('selectionchange', editor.ed);

			expect(isShaded(editor)).is.false;
		});

		it('should leave a selection that runs outside the editor alone', () => {
			const editor = getJodit();
			editor.value = VALUE;

			const below = editor.editor.querySelectorAll('p')[2];
			const range = editor.ed.createRange();
			range.setStartBefore(editor.container);
			range.setEnd(below.firstChild, 4);
			editor.s.sel.removeAllRanges();
			editor.s.sel.addRange(range);
			simulateEvent('selectionchange', editor.ed);

			expect(isShaded(editor)).is.false;
		});

		it('should not shade a video in a read-only editor', () => {
			const editor = getJodit({ readonly: true });
			editor.value = VALUE;

			const [above, , below] = editor.editor.querySelectorAll('p');
			select(editor, above.firstChild, 0, below.firstChild, 4);

			expect(isShaded(editor)).is.false;
		});

		it('should be shaded in iframe mode', () => {
			const editor = getJodit({ iframe: true });
			editor.value = VALUE;

			const [above, , below] = editor.editor.querySelectorAll('p');
			select(editor, above.firstChild, 0, below.firstChild, 4);

			expect(isShaded(editor)).is.true;
		});
	});
});
