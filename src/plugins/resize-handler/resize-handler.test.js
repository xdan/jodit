/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Resize handler plugin', () => {
	describe('Resize editor by the handle', () => {
		it('Should change the editor height', () => {
			const editor = getJodit({
				height: 300,
				history: { timeout: 0 }
			});

			const handle = editor.container.querySelector(
				'.jodit-editor__resize'
			);
			expect(handle).is.not.null;

			const startHeight = editor.container.offsetHeight;

			simulateEvent('mousedown', handle, data => {
				data.clientX = 100;
				data.clientY = 500;
			});

			simulateEvent('mousemove', editor.ow, data => {
				data.clientX = 100;
				data.clientY = 550;
			});

			simulateEvent('mouseup', editor.ow);

			expect(editor.container.offsetHeight).equals(startHeight + 50);
		});

		// https://github.com/xdan/jodit/issues/1287
		describe('Iframe mode', () => {
			it('Should resize smoothly when mousemove is proxied from the iframe', () => {
				const editor = getJodit({
					iframe: true,
					height: 300,
					history: { timeout: 0 }
				});

				const handle = editor.container.querySelector(
					'.jodit-editor__resize'
				);
				expect(handle).is.not.null;

				const startHeight = editor.container.offsetHeight;
				const workplace = offset(editor.workplace);

				simulateEvent('mousedown', handle, data => {
					data.clientX = 100;
					data.clientY = 500;
				});

				// host-window event
				simulateEvent('mousemove', editor.ow, data => {
					data.clientX = 100;
					data.clientY = 550;
				});

				expect(editor.container.offsetHeight).equals(startHeight + 50);

				// the same pointer position, but the event comes from the
				// iframe window — its client coordinates are relative to
				// the iframe viewport and must not shrink the editor back
				simulateEvent('mousemove', editor.ow, data => {
					data.view = editor.ew;
					data.clientX = 100 - workplace.left;
					data.clientY = 550 - workplace.top;
				});

				simulateEvent('mouseup', editor.ow);

				expect(editor.container.offsetHeight).equals(startHeight + 50);
			});
		});
	});
});
