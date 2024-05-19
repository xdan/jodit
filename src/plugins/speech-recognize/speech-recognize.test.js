/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Speech Recognize', () => {
	describe('Toolbar', () => {
		it('Should create toolbar with speech button', () => {
			const editor = getJodit({
				toolbarAdaptive: false,
				speechRecognize: {
					api: {} // Mock for FF
				}
			});

			const speechButton = getButton('speechRecognize', editor);

			expect(speechButton).is.not.null;
		});

		describe('Is not supported', () => {
			it('Should not show speech button', () => {
				const editor = getJodit({
					toolbarAdaptive: false,
					speechRecognize: {
						api: null
					}
				});

				const speechButton = getButton('speechRecognize', editor);

				expect(speechButton).is.null;
			});
		});
	});
});
