/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/tab/README.md]]
 * @packageDocumentation
 * @module plugins/tab
 */

import type { IJodit } from 'jodit/types';
import { KEY_ESC, KEY_TAB } from 'jodit/core/constants';
import { autobind, watch } from 'jodit/core/decorators';
import { pluginSystem } from 'jodit/core/global';
import { isString } from 'jodit/core/helpers/checker/is-string';
import { Plugin } from 'jodit/core/plugin';

import './config';

import {
	onTabInsideLi,
	onTabSpaces,
	removeTabSpaces,
	tabsToSpaces
} from './cases';

const MODIFIER_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta', 'CapsLock']);

class tab extends Plugin {
	protected afterInit(jodit: IJodit): void {
		// Without a namespace it runs ahead of table navigation, which would
		// take a released Tab
		jodit.e.on('keydown', this.__onKeyDownFirst, { top: true });
	}

	/**
	 * With `tab.spaces`, Tab stays in the editor, so an Escape lets the next
	 * Tab move the focus on, as in code editors. A modifier key keeps it, and
	 * any other key or a click ends it
	 */
	private __released: boolean = false;

	// An Escape that closes a popup has done its job
	@watch([':mousedown.tab', ':beforePopupClose.tab'])
	protected __endRelease(): void {
		this.__released = false;
	}

	@autobind
	private __onKeyDownFirst(event: KeyboardEvent): void {
		const released = this.__released;

		if (!MODIFIER_KEYS.has(event.key)) {
			this.__released = event.key === KEY_ESC && this.j.o.tab.spaces > 0;
		}

		// The browser moves the focus
		if (released && event.key === KEY_TAB) {
			this.j.e.stopPropagation('keydown');
		}
	}

	@watch(':keydown.tab')
	protected __onTab(event: KeyboardEvent): false | void {
		if (
			event.key === KEY_TAB &&
			(this.__onShift(event.shiftKey) ||
				onTabSpaces(this.j, event.shiftKey))
		) {
			return false;
		}
	}

	@watch(':backSpaceBeforeCases.tab')
	protected __onBackspace(backspace: boolean, fakeNode: Node): true | void {
		if (backspace && removeTabSpaces(this.j, fakeNode)) {
			return true;
		}
	}

	@watch(':beforePasteInsert.tab')
	protected __onPasteInsert(html: unknown): string | void {
		if (isString(html)) {
			return tabsToSpaces(this.j, html);
		}
	}

	@watch(':beforeCommand.tab')
	protected __onCommand(command: string): false | void {
		if (
			(command === 'indent' || command === 'outdent') &&
			this.__onShift(command === 'outdent')
		) {
			return false;
		}
	}

	private __onShift(shift: boolean): boolean {
		const res = onTabInsideLi(this.j, shift);

		if (res) {
			this.j.e.fire('afterTab', shift);
		}

		return res;
	}

	protected beforeDestruct(jodit: IJodit): void {
		jodit.e.off('keydown', this.__onKeyDownFirst);
	}
}

pluginSystem.add('tab', tab);
