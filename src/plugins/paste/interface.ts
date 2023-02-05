/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/paste
 */

import type { InsertMode } from 'jodit/types';

export type PasteEvent = ClipboardEvent | DragEvent;

export type PastedValue = {
	html: string | Node;
	action?: InsertMode;
};

export interface PastedData {
	html?: string;
	plain?: string;
	rtf?: string;
}

declare module 'jodit/types/events' {
	interface IEventEmitter {
		/**
		 * Emitted before a clipboard paste is processed
		 * @event
		 */
		on(
			event: 'beforePaste',
			callback: (e: PasteEvent) => void | false
		): this;

		/**
		 * Emitted after a clipboard paste is processed
		 * @event
		 */
		on(event: 'afterPaste', callback: (e: PasteEvent) => false): this;

		/**
		 * Emitted before a clipboard paste if buffer content is like HTML
		 * @event
		 */
		on(
			event: 'processHTML',
			callback: (
				e: PasteEvent,
				value: string,
				texts: PastedData
			) => void | true
		): this;
	}
}
