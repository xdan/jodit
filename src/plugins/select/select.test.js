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
});
