/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

// https://github.com/xdan/jodit/issues/1423
describe('Toolbar navigation plugin', () => {
	let editor;

	const make = (options = {}) =>
		getJodit({
			toolbarAdaptive: false,
			buttons: 'bold,italic,underline',
			...options
		});

	const focused = () =>
		editor.toolbar.buttons.findIndex(button =>
			button.container.contains(document.activeElement)
		);

	const press = (key, applyOpt) =>
		simulateEvent(
			'keydown',
			key,
			document.activeElement || editor.editor,
			applyOpt
		);

	afterEach(() => {
		editor && editor.destruct();
		editor = null;
	});

	describe('Reaching the toolbar', () => {
		it('Should focus the first button on Alt+F10', () => {
			editor = make();
			editor.s.focus();

			simulateEvent('keydown', 'F10', editor.editor, options => {
				options.altKey = true;
			});

			expect(focused()).equals(0);
		});

		it('Should work with the default allowTabNavigation: false', () => {
			editor = make();

			expect(editor.o.allowTabNavigation).is.false;
			expect(
				editor.toolbar.buttons[0].container
					.querySelector('button')
					.getAttribute('tabindex')
			).equals('-1');

			editor.execCommand('focusToolbar');

			expect(focused()).equals(0);
		});

		it('Should be remappable through commandToHotkeys', () => {
			editor = make({
				commandToHotkeys: {
					focusToolbar: 'alt+0'
				}
			});

			simulateEvent('keydown', 'F10', editor.editor, options => {
				options.altKey = true;
			});
			expect(focused()).equals(-1);

			simulateEvent('keydown', '0', editor.editor, options => {
				options.altKey = true;
			});
			expect(focused()).equals(0);
		});

		it('Should do nothing when the plugin is disabled', () => {
			editor = make({ disablePlugins: ['toolbarNavigation'] });

			simulateEvent('keydown', 'F10', editor.editor, options => {
				options.altKey = true;
			});
			expect(focused()).equals(-1);

			editor.toolbar.buttons[0].focus();
			press('ArrowRight');
			expect(focused()).equals(0);
		});
	});

	describe('Walking the buttons', () => {
		it('Should move with the arrow keys and wrap around', () => {
			editor = make();
			editor.toolbar.buttons[0].focus();

			press('ArrowRight');
			expect(focused()).equals(1);

			press('ArrowRight');
			expect(focused()).equals(2);

			press('ArrowRight');
			expect(focused()).equals(0);

			press('ArrowLeft');
			expect(focused()).equals(2);
		});

		it('Should jump to the ends with Home and End', () => {
			editor = make();
			editor.toolbar.buttons[1].focus();

			press('End');
			expect(focused()).equals(2);

			press('Home');
			expect(focused()).equals(0);
		});

		it('Should reverse the arrow keys in RTL', () => {
			editor = make({ direction: 'rtl' });
			editor.toolbar.buttons[0].focus();

			press('ArrowLeft');
			expect(focused()).equals(1);

			press('ArrowRight');
			expect(focused()).equals(0);
		});

		it('Should skip disabled buttons', () => {
			editor = make();
			editor.toolbar.buttons[1].state.disabled = true;
			editor.toolbar.buttons[0].focus();

			press('ArrowRight');

			expect(focused()).equals(2);
		});
	});

	describe('Leaving the toolbar', () => {
		it('Should give the focus back to the editor on Escape', () => {
			editor = make();
			editor.toolbar.buttons[0].focus();
			expect(focused()).equals(0);

			press('Escape');

			expect(focused()).equals(-1);
			expect(editor.editor.contains(document.activeElement)).is.true;
		});
	});
});
