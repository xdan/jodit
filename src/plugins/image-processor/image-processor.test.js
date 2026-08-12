/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Image processor plugin', () => {
	const DATA_URI =
		'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

	// https://github.com/xdan/jodit/issues/1244
	describe('Base64 image must not leak as a blob: URL', () => {
		it('Should replace data URI with blob: only in the view and restore it in the value', async () => {
			const editor = getJodit({
				history: { timeout: 0 }
			});

			editor.value = '<p><img alt="" src="' + DATA_URI + '"></p>';

			editor.e.fire('change', editor.value, '');
			await delay(150);

			// the view uses a blob: URL
			expect(editor.editor.querySelector('img').src).to.match(/^blob:/);

			// but the value still returns the original data URI
			expect(editor.value).to.include(DATA_URI);
			expect(editor.value).does.not.include('blob:');
		});

		it('Should survive the controlled-value loop (value assigned back on every change)', async () => {
			const editor = getJodit({
				history: { timeout: 0 }
			});

			editor.value = '<p><img alt="" src="' + DATA_URI + '"></p>';
			editor.e.fire('change', editor.value, '');
			await delay(150);

			// emulate a React-style controlled component: read the value and
			// assign it back several times
			for (let i = 0; i < 3; i += 1) {
				const value = editor.value;
				editor.value = value;
				editor.e.fire('change', editor.value, '');
				await delay(150);
			}

			expect(editor.value).to.include(DATA_URI);
			expect(editor.value).does.not.include('blob:');
		});

		it('Should write the data URI (not blob:) into the source element', async () => {
			const area = appendTestArea();
			const editor = Jodit.make(area, {
				history: { timeout: 0 }
			});

			editor.value = '<p><img alt="" src="' + DATA_URI + '"></p>';
			editor.e.fire('change', editor.value, '');
			await delay(150);

			editor.synchronizeValues();

			expect(area.value).to.include(DATA_URI);
			expect(area.value).does.not.include('blob:');

			editor.destruct();
		});

		it('Should leave the data URI in the source element after destruct (React remount)', async () => {
			const area = appendTestArea();
			const editor = Jodit.make(area, {
				history: { timeout: 0 }
			});

			editor.value = '<p><img alt="" src="' + DATA_URI + '"></p>';
			editor.e.fire('change', editor.value, '');
			await delay(150);

			expect(editor.editor.querySelector('img').src).to.match(/^blob:/);

			editor.destruct();

			expect(area.value).to.include(DATA_URI);
			expect(area.value).does.not.include('blob:');
		});
	});

	describe('Percent-encoded data URI', () => {
		const SVG_URI =
			'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221%22%20height%3D%221%22%3E%3C%2Fsvg%3E';

		it('Should convert it to a blob: URL without throwing on atob', async () => {
			const editor = getJodit({
				history: { timeout: 0 }
			});

			editor.value = '<p><img alt="" src="' + SVG_URI + '"></p>';
			editor.e.fire('change', editor.value, '');
			await delay(150);

			expect(editor.editor.querySelector('img').src).to.match(/^blob:/);
			expect(editor.value).to.include(SVG_URI);

			editor.destruct();
		});

		it('Should keep an undecodable data URI as is', async () => {
			const editor = getJodit({
				history: { timeout: 0 }
			});

			const broken = 'data:image/svg+xml,%%%';

			editor.value = '<p><img alt="" src="' + broken + '"></p>';
			editor.e.fire('change', editor.value, '');
			await delay(150);

			expect(editor.editor.querySelector('img').src).to.include('%%%');
			expect(editor.value).to.include(broken);

			editor.destruct();
		});
	});
});
