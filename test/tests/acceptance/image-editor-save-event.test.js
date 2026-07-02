/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

// https://github.com/xdan/jodit/issues/820
('imageeditor' in window.skipTest ? describe.skip : describe)(
	'Image editor afterImageEditorSave event (#820)',
	() => {
		const DATA_URL =
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

		it('Should fire afterImageEditorSave with the action box when Save is clicked', async () => {
			const editor = getJodit({ history: { timeout: 0 } });

			let fired = null;
			editor.e.on('afterImageEditorSave', data => {
				fired = data;
			});

			const ie = editor.getInstance('ImageEditor', editor.o);
			ie.open(DATA_URL, () => {});

			await delay(400);

			const dialog = editor.ownerDocument.querySelector('.jodit-dialog');
			expect(dialog).is.not.null;

			const saveBtn = dialog.querySelector('[data-ref="save"]');
			expect(saveBtn).is.not.null;

			simulateEvent('click', saveBtn);
			await delay(50);

			expect(fired).is.not.null;
			expect(fired.action).equals('resize');
			expect(fired.box).is.not.undefined;

			editor.destruct();
		});
	}
);
