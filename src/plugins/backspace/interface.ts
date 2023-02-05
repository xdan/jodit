/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/backspace
 */

export type DeleteMode = 'char' | 'word' | 'sentence';

declare module 'jodit/types/events' {
	interface IEventEmitter {
		/**
		 * Allows you to prepare the content before deletion or completely override the deletion logic if you return true
		 */
		on(
			event: 'backSpaceBeforeCases',
			callback: (backspace: boolean, fakeNode: Node) => void | true
		): this;

		/**
		 * Emits after backspace or delete key pressed and were processed
		 */
		on(
			event: 'backSpaceAfterDelete',
			callback: (backspace: boolean, fakeNode: Node) => void
		): this;
	}
}
