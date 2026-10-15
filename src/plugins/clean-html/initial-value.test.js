/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Clean HTML on the initial value of a textarea', function () {
	// The textarea's content goes into the editor before the plugins are
	// ready; an event handler in it must never run and must not survive.
	const payload =
		'<p>text <img src="data:," onerror="window.__joditInitialValueFired = (window.__joditInitialValueFired || 0) + 1"></p>';

	beforeEach(function () {
		delete window.__joditInitialValueFired;
	});

	afterEach(function () {
		delete window.__joditInitialValueFired;
	});

	[false, true].forEach(iframe => {
		it(`Should neither run nor keep an event handler from the textarea (iframe: ${iframe})`, async function () {
			const area = appendTestArea();
			area.value = payload;

			const editor = getJodit({ iframe }, area);
			await editor.waitForReady();
			await delay(300);

			expect(window.__joditInitialValueFired).is.undefined;
			expect(editor.editor.querySelector('img[onerror]')).is.null;
			expect(editor.value).does.not.include('onerror');
			expect(editor.value).includes('<img');
		});
	});

	it('Should keep sanitising values set after init', function () {
		const editor = getJodit();
		editor.value = payload;

		expect(editor.editor.querySelector('img[onerror]')).is.null;
		expect(window.__joditInitialValueFired).is.undefined;
	});
});
