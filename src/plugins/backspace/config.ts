/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/backspace
 */

import { IS_MAC } from 'jodit/core/constants';
import { Config } from 'jodit/config';

declare module 'jodit/config' {
	interface Config {
		/**
		 * Keyboard hotkey mappings for delete and backspace operations (character, word, sentence).
		 * On macOS the defaults leave out Cmd+Backspace, Ctrl+Backspace, Ctrl+Option+Backspace
		 * and Cmd+Option+Backspace, so the browser applies the system's own bindings to them.
		 */
		delete: {
			hotkeys: {
				delete: string[];
				deleteWord: string[];
				deleteSentence: string[];
				backspace: string[];
				backspaceWord: string[];
				backspaceSentence: string[];
			};

			/**
			 * Disable specific Backspace/Delete cleanup cases by their stable
			 * key, so the plugin no longer applies that particular behavior.
			 * Available keys: `remove-unbreakable`, `remove-not-editable`,
			 * `remove-char`, `table-cell`, `remove-empty-parent`,
			 * `remove-empty-neighbor`, `join-two-lists`, `unwrap-list-item`,
			 * `join-neighbors`, `unwrap-first-list-item`.
			 *
			 * ```javascript
			 * Jodit.make('#editor', {
			 * 	 delete: { disableCases: new Set(['remove-empty-parent']) }
			 * });
			 * ```
			 */
			disableCases?: Set<string>;
		};
	}
}

Config.prototype.delete = {
	hotkeys: {
		delete: IS_MAC ? ['delete'] : ['delete', 'cmd+backspace'],
		deleteWord: IS_MAC
			? ['ctrl+delete']
			: ['ctrl+delete', 'cmd+alt+backspace', 'ctrl+alt+backspace'],
		deleteSentence: ['ctrl+shift+delete', 'cmd+shift+delete'],
		backspace: ['backspace'],
		backspaceWord: IS_MAC ? [] : ['ctrl+backspace'],
		backspaceSentence: ['ctrl+shift+backspace', 'cmd+shift+backspace']
	}
};
