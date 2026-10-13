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

	it('Should not empty the editor on undo with the ACE source editor', function (done) {
		// ACE reports its own `setValue` as a removal and an insertion; fed
		// back into the editor they were two history steps, `content -> ''`
		// and `'' -> content`.
		unmockPromise();

		const timeout = /*ok*/ setTimeout(() => {
			done(new Error('Timeout error'));
		}, 15000);

		const editor = getJodit({
			sourceEditor: 'ace',
			beautifyHTML: false,
			history: { timeout: 0 },
			events: {
				sourceEditorReady(jodit) {
					try {
						expect(jodit.getRealMode()).equals(Jodit.MODE_SOURCE);
						jodit.toggleMode();
						expect(jodit.getRealMode()).equals(Jodit.MODE_WYSIWYG);
						expect(jodit.value).equals('<p>one two</p>');

						jodit.execCommand('undo');
						expect(jodit.value).equals('<p>one</p>');

						jodit.execCommand('redo');
						expect(jodit.value).equals('<p>one two</p>');
						done();
					} catch (e) {
						done(e);
					} finally {
						clearTimeout(timeout);
					}
				}
			}
		});

		editor.value = '<p>one</p>';
		editor.s.setCursorIn(editor.editor.firstChild, false);
		editor.s.insertHTML(' two');
		editor.toggleMode();
	});
});
