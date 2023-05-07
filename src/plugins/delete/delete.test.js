/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Delete plugin', () => {
	describe('Select all and exec delete command', () => {
		it('Should remove all content', () => {
			const editor = getJodit();

			editor.value = '<p>test</p>';

			editor.execCommand('selectall');
			editor.execCommand('delete');

			expect(editor.value).equals('');
		});
	});
});
