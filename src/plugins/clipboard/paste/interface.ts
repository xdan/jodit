/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/clipboard/paste
 */

import type {
	INSERT_AS_HTML,
	INSERT_AS_TEXT,
	INSERT_CLEAR_HTML,
	INSERT_ONLY_TEXT
} from 'jodit/core/constants';

export type InsertMode =
	| typeof INSERT_AS_HTML
	| typeof INSERT_CLEAR_HTML
	| typeof INSERT_ONLY_TEXT
	| typeof INSERT_AS_TEXT;

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
