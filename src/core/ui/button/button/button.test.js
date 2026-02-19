/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test UIButton', () => {
	const { UIButton } = Jodit.modules;

	let editor;
	beforeEach(() => {
		editor = getJodit();
	});

	describe('aria-label', () => {
		it('should set aria-label from tooltip when text is empty', () => {
			const button = new UIButton(editor);
			button.state.tooltip = 'Bold';

			expect(button.button.getAttribute('aria-label')).eq('Bold');
		});

		it('should not set aria-label when text is provided', () => {
			const button = new UIButton(editor);
			button.state.text = 'Bold';
			button.state.tooltip = 'Make text bold';

			expect(button.button.getAttribute('aria-label')).is.null;
		});

		it('should remove aria-label when text is set after tooltip', () => {
			const button = new UIButton(editor);
			button.state.tooltip = 'Bold';

			expect(button.button.getAttribute('aria-label')).eq('Bold');

			button.state.text = 'Bold';

			expect(button.button.getAttribute('aria-label')).is.null;
		});

		it('should restore aria-label when text is cleared', async () => {
			const button = new UIButton(editor);
			button.state.tooltip = 'Bold';
			button.state.text = 'Bold';

			expect(button.button.getAttribute('aria-label')).is.null;

			button.state.text = '';

			await editor.async.requestIdlePromise();
			expect(button.button.getAttribute('aria-label')).eq('Bold');
		});

		it('should not set aria-label when both text and tooltip are empty', () => {
			const button = new UIButton(editor);

			expect(button.button.getAttribute('aria-label')).is.null;
		});
	});
});
