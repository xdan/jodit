/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

declare module 'jodit/types/jodit' {
	interface IJodit {
		/**
		 * Bold plugin: Make selected text bold
		 */
		execCommand(command: 'bold'): void;

		/**
		 * Bold plugin: Make selected text style italic
		 */
		execCommand(command: 'italic'): void;

		/**
		 * Bold plugin: Make selected text style underline
		 */
		execCommand(command: 'underline'): void;

		/**
		 * Bold plugin: Make selected text style strikethrough
		 */
		execCommand(command: 'strikethrough'): void;

		/**
		 * Bold plugin: Wrap selected text in SUB tag
		 */
		execCommand(command: 'subscript'): void;

		/**
		 * Bold plugin: Wrap selected text in SUP tag
		 */
		execCommand(command: 'superscript'): void;
	}
}
