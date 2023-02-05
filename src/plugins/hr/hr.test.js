/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test insert plugins', function () {
	describe('hr', function () {
		it('Should insert horizontal line', function () {
			const editor = getJodit();
			editor.execCommand('insertHorizontalRule');
			editor.execCommand('insertHorizontalRule');
			editor.execCommand('insertHorizontalRule');
			expect(editor.value).equals('<hr><hr><hr><p></p>');
		});
	});
});
