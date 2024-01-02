/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/backspace
 */

export type DeleteMode = 'char' | 'word' | 'sentence';

declare module 'jodit/types/events' {
	interface IEventEmitter {
		/**
		 * Enables content preparation prior to deletion, or allows for a complete
		 * override of the deletion logic if true is returned.
		 */
		on(
			event: 'backSpaceBeforeCases',
			callback: (backspace: boolean, fakeNode: Node) => void | true
		): this;

		/**
		 * Triggers after the Backspace or Delete key has been pressed and processed.
		 */
		on(
			event: 'backSpaceAfterDelete',
			callback: (backspace: boolean, fakeNode: Node) => void
		): this;
	}
}

declare module 'jodit/types/jodit' {
	interface IJodit {
		/**
		 * Backspace plugin: Deletes the next character or selected text.
		 */
		execCommand(command: 'deleteButton'): void;

		/**
		 * Backspace plugin: Deletes the previous character or selected text.
		 */
		execCommand(command: 'backspaceButton'): void;

		/**
		 * Backspace plugin: Deletes the next word or selected text.
		 */
		execCommand(command: 'deleteWordButton'): void;

		/**
		 * Backspace plugin: Deletes the previous word or selected text.
		 */
		execCommand(command: 'backspaceWordButton'): void;

		/**
		 * Backspace plugin: Deletes the next sentence or selected text.
		 */
		execCommand(command: 'deleteSentenceButton'): void;

		/**
		 * Backspace plugin: Deletes the previous sentence or selected text.
		 */
		execCommand(command: 'backspaceSentenceButton'): void;
	}
}
