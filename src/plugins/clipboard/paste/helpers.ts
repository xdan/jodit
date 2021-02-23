/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit, Nullable } from '../../../types';
import type { PasteEvent } from '../config';
import {
	isArray,
	isNumber,
	isString,
	isVoid,
	type
} from '../../../core/helpers';
import { Dom } from '../../../core/dom';
import { TEXT_PLAIN } from '../../../core/constants';

/**
 * Get DataTransfer from different event types
 * @param event
 */
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

/**
 * Remove special HTML comments
 * @param html
 */
function removeExtraFragments(html: string): string {
	html = html.replace(/<meta[^>]+?>/g, '');

	const start = html.search(/<!--StartFragment-->/i);

	if (start !== -1) {
		html = html.substr(start + 20);
	}

	const end = html.search(/<!--EndFragment-->/i);

	if (end !== -1) {
		html = html.substr(0, end);
	}

	return html;
}

/**
 * One insert point for clipboard plugins
 *
 * @param e
 * @param editor
 * @param html
 */
export function pasteInsertHtml(
	e: Nullable<PasteEvent>,
	editor: IJodit,
	html: number | string | Node
): void {
	if (editor.isInDestruct) {
		return;
	}

	if (e?.type === 'drop') {
		editor.s.insertCursorAtPoint(
			(e as DragEvent).clientX,
			(e as DragEvent).clientY
		);
	}

	const result = editor.e.fire('beforePasteInsert', html);

	if (
		!isVoid(result) &&
		(isString(result) || isNumber(result) || Dom.isNode(result, editor.ew))
	) {
		html = result;
	}

	if (isString(html)) {
		html = removeExtraFragments(html);
	}

	editor.s.insertHTML(html);
}

/**
 * Return all available data types in event
 * @param dt
 */
export function getAllTypes(dt: DataTransfer): string {
	const types: ReadonlyArray<string> | string = dt.types;

	let types_str: string = '';

	if (isArray(types) || type(types) === 'domstringlist') {
		for (let i = 0; i < types.length; i += 1) {
			types_str += types[i] + ';';
		}
	} else {
		types_str = (types || TEXT_PLAIN).toString() + ';';
	}

	return types_str;
}
