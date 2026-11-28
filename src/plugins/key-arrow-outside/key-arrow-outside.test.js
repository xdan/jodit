/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Key arrow outside plugin', () => {
	// Where the browser's right arrow takes the caret: past the invisible space
	const moveCaretPast = (editor, node) => {
		const range = editor.s.createRange();
		range.setStart(node, node.nodeValue.length);
		range.collapse(true);
		editor.s.selectRange(range);
	};

	describe('Right arrow at the end of an inline element', () => {
		it('should step out with an invisible space, so no space is typed', () => {
			const editor = getJodit();
			editor.value = '<p>Hello <strong>bold|</strong></p>';
			setCursorToChar(editor);

			simulateEvent('keydown', Jodit.KEY_RIGHT, editor.editor);

			const strong = editor.editor.querySelector('strong');
			expect(strong.nextSibling.nodeValue).eq(Jodit.INVISIBLE_SPACE);
			expect(editor.value).eq('<p>Hello <strong>bold</strong></p>');

			moveCaretPast(editor, strong.nextSibling);
			editor.s.insertNode(editor.createInside.text('x'), false, false);

			expect(editor.value).eq('<p>Hello <strong>bold</strong>x</p>');
		});

		it('should step out of one element a press', () => {
			const editor = getJodit();
			editor.value =
				'<p><span style="font-size: 24px;"><strong>Hello|</strong></span></p>';
			setCursorToChar(editor);

			simulateEvent('keydown', Jodit.KEY_RIGHT, editor.editor);

			const strong = editor.editor.querySelector('strong');
			expect(strong.nextSibling.nodeValue).eq(Jodit.INVISIBLE_SPACE);
			expect(strong.parentNode.lastChild).eq(strong.nextSibling);

			moveCaretPast(editor, strong.nextSibling);
			simulateEvent('keydown', Jodit.KEY_RIGHT, editor.editor);

			const span = editor.editor.querySelector('span');
			expect(span.nextSibling.nodeValue).eq(Jodit.INVISIBLE_SPACE);
			expect(editor.value).eq(
				'<p><span style="font-size: 24px;"><strong>Hello</strong></span></p>'
			);
		});
	});
});
