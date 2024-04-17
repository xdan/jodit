/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
});
