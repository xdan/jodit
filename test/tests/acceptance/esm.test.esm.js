import '../../../build/esm/plugins/all.js';

import { Jodit } from '../../../build/esm/index.js';

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

	it('should have all helpers', () => {
		expect(Object.keys(Jodit.modules.Helpers).length).to.be.greaterThan(
			120
		);
	});
});
