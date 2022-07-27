/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { InsertMode } from 'jodit/types';

/**
 * @module plugins/paste
 */

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
