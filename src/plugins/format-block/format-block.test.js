/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Format block plugin', () => {
	// https://github.com/xdan/jodit/issues/1063
	describe('Apply a heading to a block with conflicting inline styles', () => {
		const STYLED_H1 =
			'<h1 style="color: rgb(23, 43, 77); font-size: 24px; font-weight: normal; line-height: 1.25;">Q1Fy25</h1>';

		describe('With selection', () => {
			it('Should change the tag and drop the conflicting font styles', () => {
				const editor = getJodit({ history: { timeout: 0 } });
				editor.value = STYLED_H1;
				editor.s.select(editor.editor.querySelector('h1'), true);

				editor.execCommand('formatblock', false, 'h2');

				expect(sortAttributes(editor.value)).equals(
					'<h2 style="color:#172B4D;line-height:1.25">Q1Fy25</h2>'
				);
			});
		});

		describe('With collapsed cursor', () => {
			it('Should change the tag and drop the conflicting font styles', () => {
				const editor = getJodit({ history: { timeout: 0 } });
				editor.value = STYLED_H1;
				editor.s.setCursorIn(editor.editor.querySelector('h1'));

				editor.execCommand('formatblock', false, 'h2');

				expect(sortAttributes(editor.value)).equals(
					'<h2 style="color:#172B4D;line-height:1.25">Q1Fy25</h2>'
				);
			});
		});

		describe('Regular paragraph without conflicting styles', () => {
			it('Should simply change the tag', () => {
				const editor = getJodit({ history: { timeout: 0 } });
				editor.value = '<p>text</p>';
				editor.s.select(editor.editor.querySelector('p'), true);

				editor.execCommand('formatblock', false, 'h1');

				expect(editor.value).equals('<h1>text</h1>');
			});
		});
	});

	describe('Apply a heading in an empty table cell (#1608)', () => {
		const CELL = '<table><tbody><tr><td><br></td></tr></tbody></table>';
		const HEADING =
			'<table><tbody><tr><td><h1><br></h1></td></tr></tbody></table>';

		[
			[CELL, HEADING],
			['<table><tbody><tr><td></td></tr></tbody></table>', HEADING],
			['<ul><li><br></li></ul>', '<ul><li><h1><br></h1></li></ul>']
		].forEach(([value, expected]) => {
			describe(`With the cursor in ${value}`, () => {
				it('Should give the heading one BR', () => {
					const editor = getJodit({ history: { timeout: 0 } });
					editor.value = value;
					editor.s.setCursorIn(editor.editor.querySelector('td, li'));

					editor.execCommand('formatblock', false, 'h1');

					expect(editor.value).equals(expected);
				});
			});
		});

		describe('With the contents of the cell selected', () => {
			it('Should give the heading one BR', () => {
				const editor = getJodit({ history: { timeout: 0 } });
				editor.value = CELL;
				editor.s.select(editor.editor.querySelector('td'), true);

				editor.execCommand('formatblock', false, 'h1');

				expect(editor.value).equals(HEADING);
			});
		});

		describe('With a list button', () => {
			[
				['insertUnorderedList', 'ul'],
				['insertOrderedList', 'ol']
			].forEach(([command, tag]) => {
				it(`Should give the list item one BR after ${command}`, () => {
					const editor = getJodit({ history: { timeout: 0 } });
					editor.value = CELL;
					editor.s.setCursorIn(editor.editor.querySelector('td'));

					editor.execCommand(command);

					expect(editor.value).equals(
						`<table><tbody><tr><td><${tag}><li><br></li></${tag}></td></tr></tbody></table>`
					);
				});
			});
		});
	});
});
