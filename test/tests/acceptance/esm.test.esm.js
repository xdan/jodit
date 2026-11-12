/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */
import 'base/build/esm/plugins/all.js';

import { Jodit } from 'base/build/esm/index.js';
import { expect } from 'chai';

describe('ESM build', () => {
	it('Should create Jodit instance', async () => {
		const textarea = document.createElement('textarea');
		document.body.appendChild(textarea);
		textarea.value = '<p>test</p>';

		const editor = Jodit.make(textarea);
		expect(editor instanceof Jodit).is.true;
		await editor.waitForReady();

		expect(editor.value).eq(textarea.value);
		expect(Jodit.plugins.size).above(60);
		editor.destruct();
	});

	it('Should keep every language a dictionary, with a `default` translation inside (no.js)', () => {
		Object.keys(Jodit.lang).forEach(key => {
			expect(typeof Jodit.lang[key]).eq('object', key);
		});

		expect(Jodit.lang.no.default).eq('Standard');
		expect(Jodit.lang.no['Speech Recognize']).to.be.a('string');
	});

	it('should have all helpers', () => {
		expect(Object.keys(Jodit.modules.Helpers).length).to.be.greaterThan(
			120
		);
	});
});
