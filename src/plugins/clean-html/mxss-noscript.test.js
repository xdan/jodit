/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Mutation XSS through a noscript carrier on value set', function () {
	// The value is sanitized in an inert document, where scripting is off and
	// `<noscript>` content is parsed as markup, then serialized and assigned to
	// the live editor, where scripting is on and the same bytes are parsed as
	// raw text ending at the first `</noscript>`. Whatever follows becomes a
	// real element with a live handler. Reported by Tan-JunWei.
	const payload =
		'<p>a</p><noscript><style></noscript><img src="/definitely-missing-404.png" onerror="window.__joditMxssFired = (window.__joditMxssFired || 0) + 1"></style></noscript><p>b</p>';

	beforeEach(function () {
		delete window.__joditMxssFired;
	});

	afterEach(function () {
		delete window.__joditMxssFired;
	});

	it('Should leave no live event handler in the editor right after assignment', function () {
		const editor = getJodit();
		editor.value = payload;

		// Synchronously, before any task can run: nothing in the live DOM may
		// carry an on* attribute, whatever the carrier was.
		const handlers = editor.editor.querySelectorAll(
			'[onerror],[onload],[onclick]'
		);
		expect(handlers.length).equals(0);
		expect(editor.editor.querySelector('noscript')).is.null;
	});

	it('Should never execute the handler', async function () {
		const editor = getJodit();
		editor.value = payload;

		// Long enough for a failed image request and its error event.
		await delay(600);

		expect(window.__joditMxssFired).is.undefined;
	});

	it('Should keep the harmless paragraphs around the carrier', function () {
		const editor = getJodit();
		editor.value = payload;

		expect(editor.editor.querySelectorAll('p').length).equals(2);
		expect(editor.editor.textContent).contains('a');
		expect(editor.editor.textContent).contains('b');
	});
});
