/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Undo after switching between Source and WYSIWYG (#1537)', function () {
	it('Should undo the last content change, not add an empty step for the switch', function () {
		const editor = getJodit({ history: { timeout: 0 } });
		editor.value = '<p>one</p>';
		editor.s.setCursorIn(editor.editor.firstChild, false);
		editor.s.insertHTML(' two');

		expect(editor.value).equals('<p>one two</p>');
		const steps = editor.history.length;

		editor.toggleMode();
		editor.toggleMode();
		expect(editor.getRealMode()).equals(Jodit.MODE_WYSIWYG);
		expect(editor.history.length).equals(steps);

		editor.execCommand('undo');
		expect(editor.value).equals('<p>one</p>');

		editor.execCommand('redo');
		expect(editor.value).equals('<p>one two</p>');
	});

	it('Should still record an edit made in the source view', function () {
		const editor = getJodit({ history: { timeout: 0 } });
		editor.value = '<p>one</p>';

		editor.toggleMode();
		const mirror = editor.container.querySelector('.jodit-source__mirror');
		mirror.value = '<p>one two</p>';
		simulateEvent('input', mirror);
		editor.toggleMode();

		expect(editor.value).equals('<p>one two</p>');

		editor.execCommand('undo');
		expect(editor.value).equals('<p>one</p>');
	});
});
