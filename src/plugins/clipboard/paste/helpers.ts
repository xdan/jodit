/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IJodit, Nullable } from '../../../types';
import { isNumber, isString } from '../../../core/helpers';
import { Dom } from '../../../core/dom';

export const getDataTransfer = (
	event: ClipboardEvent | DragEvent
): Nullable<DataTransfer> => {
	if ((event as ClipboardEvent).clipboardData) {
		return (event as ClipboardEvent).clipboardData;
	}

	try {
		return (event as DragEvent).dataTransfer || new DataTransfer();
	} catch {
		return null;
	}
};

export function pasteInsertHtml(
	editor: IJodit,
	html: number | string | Node
): void {
	const result = editor.e.fire('beforePasteInsert', html);

	if (
		result !== false &&
		(isString(result) || isNumber(result) || Dom.isNode(result, editor.ew))
	) {
		html = result;
	}

	editor.s.insertHTML(html);
}
