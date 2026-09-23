/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/toolbar-navigation/README.md]]
 * @packageDocumentation
 * @module plugins/toolbar-navigation
 */

import type { IJodit, IUIButton } from 'jodit/types';
import {
	KEY_END,
	KEY_ESC,
	KEY_HOME,
	KEY_LEFT,
	KEY_RIGHT
} from 'jodit/core/constants';
import { autobind } from 'jodit/core/decorators/autobind/autobind';
import { watch } from 'jodit/core/decorators/watch/watch';
import { Dom } from 'jodit/core/dom/dom';
import { pluginSystem } from 'jodit/core/global';
import { attr } from 'jodit/core/helpers/utils/attr';
import { Plugin } from 'jodit/core/plugin';

const INPUT_TAGS = new Set(['input', 'textarea', 'select'] as const);

/**
 * Makes the toolbar reachable from the keyboard, as described by the WAI-ARIA
 * authoring practices for a `role="toolbar"` widget.
 *
 * The focus is moved programmatically, so this works whatever
 * {@link Config.allowTabNavigation} does with the tab order — including the
 * default, where the buttons take no part in the page tab order.
 */
export class toolbarNavigation extends Plugin {
	/** @override */
	protected afterInit(jodit: IJodit): void {
		jodit.registerCommand('focusToolbar', {
			hotkeys: 'alt+f10',
			exec: this.focusToolbar
		});
	}

	/** @override */
	protected beforeDestruct(): void {}

	/**
	 * Moves the focus to the first button of the toolbar.
	 *
	 * Bound to `Alt+F10` by default; remap it like any other command:
	 * `commandToHotkeys: { focusToolbar: 'alt+0' }`
	 */
	@autobind
	focusToolbar(): false {
		const [first] = this.__buttons();

		first?.focus();

		return false;
	}

	/**
	 * Arrow keys / `Home` / `End` walk the buttons, `Escape` leaves the toolbar
	 */
	@watch('j.toolbar.container:keydown.toolbar-navigation')
	protected onKeyDown(e: KeyboardEvent): boolean | void {
		if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) {
			return;
		}

		const target = e.target as Node;

		// A control that needs the arrow keys for itself
		if (
			Dom.isTag(target, INPUT_TAGS) ||
			(Dom.isHTMLElement(target) && target.isContentEditable)
		) {
			return;
		}

		const buttons = this.__buttons();

		if (!buttons.length) {
			return;
		}

		switch (e.key) {
			case KEY_ESC:
				this.j.s.focus();
				break;

			case KEY_HOME:
				buttons[0].focus();
				break;

			case KEY_END:
				buttons[buttons.length - 1].focus();
				break;

			case KEY_LEFT:
			case KEY_RIGHT: {
				const index = buttons.findIndex(button =>
					button.container.contains(target)
				);

				if (index === -1) {
					return;
				}

				const forward = (e.key === KEY_RIGHT) !== this.__isRtl(),
					next = index + (forward ? 1 : -1);

				buttons[(next + buttons.length) % buttons.length].focus();
				break;
			}

			default:
				return;
		}

		e.preventDefault();
		e.stopPropagation();

		return false;
	}

	/**
	 * Toolbar buttons that can take the focus right now
	 */
	private __buttons(): IUIButton[] {
		return this.j.toolbar.buttons.filter(
			button => !button.state.disabled && button.container.isConnected
		);
	}

	private __isRtl(): boolean {
		return attr(this.j.toolbar.container, 'dir') === 'rtl';
	}
}

pluginSystem.add('toolbarNavigation', toolbarNavigation);
