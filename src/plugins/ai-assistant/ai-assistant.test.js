/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('AI Assistant', () => {
	it('Should have an ai-assistant button', () => {
		const editor = getJodit();
		const button = getButton('ai_assistant', editor);
		expect(button).to.be.not.null;
	});

	it('Should have an ai-commands button', () => {
		const editor = getJodit();
		const button = getButton('ai_commands', editor);
		expect(button).to.be.not.null;
	});

	// TODO: add more tests
});
