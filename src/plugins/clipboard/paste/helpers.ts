/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/clipboard/paste
 */

import type { IJodit, Nullable } from 'jodit/types';
import type {
	PasteEvent,
	InsertMode
} from 'jodit/plugins/clipboard/paste/interface';
import {
	isArray,
	isNumber,
	isString,
	isVoid
} from 'jodit/core/helpers/checker';

import { Dom } from 'jodit/core/dom';
import {
	INSERT_AS_HTML,
	INSERT_AS_TEXT,
	INSERT_ONLY_TEXT,
	TEXT_PLAIN
} from 'jodit/core/constants';

import { Confirm, Dialog } from 'jodit/modules';
import { Button } from 'jodit/core/ui';
import { markOwner } from 'jodit/src/core/helpers/utils/utils';

/**
 * Get DataTransfer from different event types
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
 */
function removeExtraFragments(html: string): string {
	html = html.replace(/<meta[^>]+?>/g, '');

	const start = html.search(/<!--StartFragment-->/i);

	if (start !== -1) {
		html = html.substring(start + 20);
	}

	const end = html.search(/<!--EndFragment-->/i);

	if (end !== -1) {
		html = html.substring(0, end);
	}

	return html;
}

function isDragEvent(e: Nullable<PasteEvent>): e is DragEvent {
	return Boolean(e && e.type === 'drop');
}

/**
 * One insert point for clipboard plugins
 */
export function pasteInsertHtml(
	e: Nullable<PasteEvent>,
	editor: IJodit,
	html: number | string | Node
): void {
	if (editor.isInDestruct) {
		return;
	}

	if (isDragEvent(e)) {
		editor.s.insertCursorAtPoint(e.clientX, e.clientY);
	}

	const result = editor.e.fire('beforePasteInsert', html);

	if (
		!isVoid(result) &&
		(isString(result) || isNumber(result) || Dom.isNode(result))
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
 */
export function getAllTypes(dt: DataTransfer): string {
	const types: ReadonlyArray<string> | string = dt.types;

	let types_str: string = '';

	if (
		isArray(types) ||
		{}.toString.call(types) === '[object DOMStringList]'
	) {
		for (let i = 0; i < types.length; i += 1) {
			types_str += types[i] + ';';
		}
	} else {
		types_str = (types || TEXT_PLAIN).toString() + ';';
	}

	return types_str;
}

/**
 * Make command dialog
 */
export function askInsertTypeDialog(
	jodit: IJodit,
	msg: string,
	title: string,
	callback: (yes: InsertMode) => void,
	clearButton: string = 'Clean',
	insertText: string = 'Insert only Text'
): Dialog | void {
	if (
		jodit.e.fire(
			'beforeOpenPasteDialog',
			msg,
			title,
			callback,
			clearButton,
			insertText
		) === false
	) {
		return;
	}

	const dialog = Confirm(
		`<div style="word-break: normal; white-space: normal">${jodit.i18n(
			msg
		)}</div>`,
		jodit.i18n(title)
	);

	dialog.bindDestruct(jodit);

	markOwner(jodit, dialog.container);

	const keep = Button(jodit, {
		text: 'Keep',
		name: 'keep',
		variant: 'primary',
		tabIndex: 0
	});

	const clear = Button(jodit, {
		text: clearButton,
		tabIndex: 0
	});

	const clear2 = Button(jodit, {
		text: insertText,
		tabIndex: 0
	});

	const cancel = Button(jodit, {
		text: 'Cancel',
		tabIndex: 0
	});

	keep.onAction(() => {
		dialog.close();
		callback && callback(INSERT_AS_HTML);
	});

	clear.onAction(() => {
		dialog.close();
		callback && callback(INSERT_AS_TEXT);
	});

	clear2.onAction(() => {
		dialog.close();
		callback && callback(INSERT_ONLY_TEXT);
	});

	cancel.onAction(() => {
		dialog.close();
	});

	dialog.setFooter([keep, clear, insertText ? clear2 : '', cancel]);

	keep.focus();

	jodit.e.fire(
		'afterOpenPasteDialog',
		dialog,
		msg,
		title,
		callback,
		clearButton,
		insertText
	);

	return dialog;
}
