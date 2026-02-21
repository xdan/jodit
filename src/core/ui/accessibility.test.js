/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Accessibility', () => {
	const { UIGroup, UIButton } = Jodit.modules;

	describe('UIElement role', () => {
		let editor;
		beforeEach(() => {
			editor = getJodit();
		});

		it('should set role from state on UIButton', () => {
			const button = new UIButton(editor);
			button.setState({ role: 'menuitem' });
			expect(button.container.getAttribute('role')).eq('menuitem');
		});

		it('should have role="button" by default on UIButton', () => {
			const button = new UIButton(editor);
			expect(button.container.getAttribute('role')).eq('button');
		});
	});

	describe('UIGroup roles', () => {
		let editor;
		beforeEach(() => {
			editor = getJodit();
		});

		it('should have default role="list"', () => {
			const group = new UIGroup(editor);
			expect(group.container.getAttribute('role')).eq('list');
			expect(group.getRole()).eq('list');
		});

		it('should use custom role from options', () => {
			const group = new UIGroup(editor, [], { role: 'group' });
			expect(group.container.getAttribute('role')).eq('group');
			expect(group.getRole()).eq('group');
		});

		it('should accept role="toolbar" from options', () => {
			const group = new UIGroup(editor, [], { role: 'toolbar' });
			expect(group.container.getAttribute('role')).eq('toolbar');
		});
	});

	describe('ToolbarCollection', () => {
		it('should have role="toolbar"', () => {
			const editor = getJodit();
			expect(editor.toolbar.container.getAttribute('role')).equals(
				'toolbar'
			);
		});

		it('should have role="toolbar" via getRole()', () => {
			const editor = getJodit();
			expect(editor.toolbar.getRole()).equals('toolbar');
		});
	});

	describe('Toolbar groups', () => {
		it('should have role="group" on line groups', () => {
			const editor = getJodit({
				buttons: ['bold', 'italic']
			});

			const groups =
				editor.toolbar.container.querySelectorAll('[role="group"]');
			expect(groups.length).to.be.above(0);
		});
	});

	describe('ToolbarButton', () => {
		it('should have role="listitem"', () => {
			const editor = getJodit({
				buttons: ['bold']
			});

			const button = getButton('bold', editor);
			expect(button.parentElement.getAttribute('role')).equals(
				'listitem'
			);
		});
	});

	describe('Trigger button', () => {
		it('should have role="button" and aria-haspopup on trigger', () => {
			const editor = getJodit({
				toolbarAdaptive: false,
				buttons: ['font']
			});

			const trigger = editor.toolbar.container.querySelector(
				'.jodit-toolbar-button__trigger'
			);

			expect(trigger).is.not.null;
			expect(trigger.getAttribute('role')).equals('button');
			expect(trigger.getAttribute('aria-haspopup')).equals('true');
			expect(trigger.getAttribute('aria-expanded')).equals('false');
		});

		it('should set aria-expanded="true" when popup is opened', () => {
			const editor = getJodit({
				toolbarAdaptive: false,
				buttons: ['font']
			});

			const trigger = editor.toolbar.container.querySelector(
				'[data-ref="font"] .jodit-toolbar-button__trigger'
			);

			simulateEvent(['mousedown', 'mouseup', 'click'], trigger);

			const popup = getOpenedPopup(editor);
			expect(popup).is.not.null;
			expect(trigger.getAttribute('aria-expanded')).equals('true');
		});

		it('should set aria-expanded="false" when popup is closed', () => {
			const editor = getJodit({
				toolbarAdaptive: false,
				buttons: ['font']
			});

			const trigger = editor.toolbar.container.querySelector(
				'[data-ref="font"] .jodit-toolbar-button__trigger'
			);

			simulateEvent(['mousedown', 'mouseup', 'click'], trigger);
			expect(getOpenedPopup(editor)).is.not.null;

			simulateEvent('mousedown', window);

			expect(trigger.getAttribute('aria-expanded')).equals('false');
		});
	});

	describe('Trigger aria-label', () => {
		it('should set aria-label on trigger from tooltip', () => {
			const editor = getJodit({
				toolbarAdaptive: false,
				buttons: ['font']
			});

			const trigger = editor.toolbar.container.querySelector(
				'[data-ref="font"] .jodit-toolbar-button__trigger'
			);

			expect(trigger).is.not.null;
			expect(trigger.getAttribute('aria-label')).is.not.null;
		});
	});

	describe('XPath plugin', () => {
		it('should have role="list" on xpath container', () => {
			const editor = getJodit({
				language: 'en',
				showXPathInStatusbar: true,
				history: {
					timeout: 0
				}
			});

			editor.value = '<p>Simple text</p>';
			editor.s.setCursorIn(editor.editor.firstChild);

			const xpath = editor.container.querySelector(
				'.jodit-status-bar .jodit-xpath'
			);

			expect(xpath).is.not.null;
			expect(xpath.getAttribute('role')).equals('list');
		});
	});
});
