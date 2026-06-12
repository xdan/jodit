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
});
