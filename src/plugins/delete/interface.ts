/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/delete
 */

declare module 'jodit/types/jodit' {
	interface IJodit {
		/**
		 * Delete plugin: Remove selected text. With `keepFormat`, as after
		 * Backspace or Delete, the next letter keeps the formatting of an
		 * element whose text was deleted whole
		 */
		execCommand(
			command: 'delete',
			showUI?: boolean,
			keepFormat?: boolean
		): void;
	}
}
