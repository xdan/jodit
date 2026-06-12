/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

// https://github.com/xdan/jodit/issues/1109
describe('Shadow DOM plugins', () => {
	let app, root, editor;

	beforeEach(() => {
		app = appendTestDiv();
		app.attachShadow({ mode: 'open' });
		root = app.shadowRoot;
		root.innerHTML = '<div id="edit"></div>';

		editor = getJodit(
			{
				globalFullSize: false,
				shadowRoot: root,
				history: { timeout: 0 }
			},
			root.getElementById('edit')
		);

		editor.value =
			'<p><img alt="" src="tests/artio.jpg" style="width:100px;height:100px"></p>';
	});

	it('Should show the resizer frame on image click inside the shadow root', () => {
		simulateEvent('click', editor.editor.querySelector('img'));

		expect(root.querySelector('.jodit-resizer')).is.not.null;
	});

	it('Should open the image properties dialog on double click', () => {
		simulateEvent('dblclick', editor.editor.querySelector('img'));

		expect(root.querySelector('.jodit-dialog')).is.not.null;
	});

	it('Should open the inline popup on image click', () => {
		simulateEvent('click', editor.editor.querySelector('img'));

		expect(getOpenedPopup(editor)).is.not.null;
	});

	// https://github.com/xdan/jodit/issues/1312
	describe('Table cell popup', () => {
		it('Should open the cell properties popup on cell click inside the shadow root', () => {
			editor.value = '<table><tbody><tr><td>1</td></tr></tbody></table>';

			const td = editor.editor.querySelector('td');
			td.scrollIntoView({ block: 'center' });
			const pos = Jodit.modules.Helpers.position(td);

			simulateEvent(['mousedown', 'mouseup', 'click'], td, e => {
				Object.assign(e, {
					clientX: pos.left,
					clientY: pos.top
				});
			});

			const popup = getOpenedPopup(editor);
			expect(popup).is.not.null;
			expect(popup.querySelector('[data-ref="brushCell"]')).is.not.null;
		});
	});
});
