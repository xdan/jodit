/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

// https://github.com/xdan/jodit/issues/965
describe('Custom ownerWindow (editor created inside an iframe)', () => {
	let iframe, editor;

	beforeEach(() => {
		iframe = document.createElement('iframe');
		document.body.appendChild(iframe);

		const idoc = iframe.contentDocument;
		idoc.open();
		idoc.write('<html><body></body></html>');
		idoc.close();

		const area = idoc.createElement('textarea');
		idoc.body.appendChild(area);

		editor = Jodit.make(area, {
			ownerDocument: idoc,
			ownerWindow: iframe.contentWindow,
			history: { timeout: 0 }
		});
	});

	afterEach(() => {
		editor.destruct();
		iframe.remove();
	});

	it('Should inherit the owner window in the editor itself', () => {
		expect(editor.ownerWindow).equals(iframe.contentWindow);
	});

	it('Should inherit the owner window in the toolbar collection', () => {
		// the toolbar used to keep the global `window`, so dropdown
		// outside-click listeners were bound to the wrong window and the
		// dropdowns never closed
		expect(editor.toolbar.ownerWindow).equals(iframe.contentWindow);
	});

	it('Should inherit the owner window in popups', () => {
		const popup = new Jodit.modules.Popup(editor);

		// Popup.__addGlobalListeners binds its outside-click close handler
		// to `popup.ow` — it must be the window the user actually clicks in
		expect(popup.ownerWindow).equals(iframe.contentWindow);

		popup.destruct();
	});
});
