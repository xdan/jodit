/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Paste after a space that follows a tag (#1546)', function () {
	it('Should keep the space between the tag and the pasted text', function () {
		const editor = getJodit({ defaultActionOnPaste: 'insert_only_text' });
		editor.value = '<p><strong>test</strong> |</p>';
		setCursorToChar(editor);

		simulatePaste(editor.editor, 'jodit', 'text/plain');

		expect(editor.value).equals('<p><strong>test</strong> jodit</p>');
	});

	it('Should keep the space when a node is inserted through insertNode', function () {
		const editor = getJodit();
		editor.value = '<p><strong>test</strong> |</p>';
		setCursorToChar(editor);

		editor.s.insertNode(editor.createInside.text('jodit'));

		expect(editor.value).equals('<p><strong>test</strong> jodit</p>');
	});
});
