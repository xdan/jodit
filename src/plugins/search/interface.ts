/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

declare module 'jodit/types/events' {
	interface IEventEmitter {
		/**
		 * Search plugin: Emitted when the user presses the button - find the next element ins search form
		 * @event
		 */
		on(event: 'searchNext', callback: () => void): this;

		/**
		 * Search plugin: Emitted when the user presses the button - find the previous element in search form
		 * @event
		 */
		on(event: 'searchPrevious', callback: () => void): this;

		/**
		 * Search plugin: Emitted search and select process is finished
		 */
		on(event: 'afterFindAndSelect', callback: () => void): this;

		/**
		 * Search plugin: Emitted search and replace process is finished
		 */
		on(event: 'afterFindAndReplace', callback: () => void): this;
	}
}

declare module 'jodit/types/jodit' {
	interface IJodit {
		/**
		 * Search plugin: Runs a text search and highlights found results
		 */
		execCommand(command: 'search', query?: string, next?: boolean): void;

		/**
		 * Search plugin: Open search form
		 */
		execCommand(command: 'openSearchDialog', query?: string): void;

		/**
		 * Search plugin: Open replace form
		 */
		execCommand(
			command: 'openReplaceDialog',
			query?: string,
			replace?: string
		): void;

		registerCommand(
			command: 'search',
			callback: (
				command: 'search',
				openReplaceDialogquery?: string,
				next?: boolean
			) => void
		): void;

		registerCommand(
			command: 'openSearchDialog',
			callback: (command: 'openSearchDialog', query?: string) => void
		): void;

		registerCommand(
			command: 'openReplaceDialog',
			callback: (
				command: 'openReplaceDialog',
				query?: string,
				replace?: string
			) => void
		): void;
	}
}
