/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/paste
 */

import type {
	IDialog,
	IJodit,
	InsertMode,
	IUIOption,
	Nullable
} from 'jodit/types';
import {
	isArray,
	isNumber,
	isString,
	isVoid
} from 'jodit/core/helpers/checker';
import { Dom } from 'jodit/core/dom/dom';

import { TEXT_PLAIN } from 'jodit/core/constants';
import { Button } from 'jodit/core/ui/button/button/button';

import type { PasteEvent } from './interface';

/**
 * Remove special HTML comments
 * @private
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

/**
 * @private
 */
function isDragEvent(e: Nullable<PasteEvent>): e is DragEvent {
	return Boolean(e && e.type === 'drop');
}

/**
 * One insert point for clipboard plugins
 * @private
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
 * @private
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
 * @private
 */
export function askInsertTypeDialog(
	jodit: IJodit,
	msg: string,
	title: string,
	callback: (yes: InsertMode) => void,
	buttonList: IUIOption[]
): IDialog | void {
	if (
		jodit.e.fire(
			'beforeOpenPasteDialog',
			msg,
			title,
			callback,
			buttonList
		) === false
	) {
		return;
	}

	const dialog = jodit.confirm(
		`<div style="word-break: normal; white-space: normal">${jodit.i18n(
			msg
		)}</div>`,
		jodit.i18n(title)
	);

	const buttons = buttonList.map(({ text, value }) =>
		Button(jodit, {
			text,
			name: text.toLowerCase(),
			tabIndex: 0
		}).onAction(() => {
			dialog.close();
			callback(value as InsertMode);
		})
	);

	dialog.e.one(dialog, 'afterClose', () => {
		if (!jodit.s.isFocused()) {
			jodit.s.focus();
		}
	});

	const cancel = Button(jodit, {
		text: 'Cancel',
		tabIndex: 0
	}).onAction(() => {
		dialog.close();
	});

	dialog.setFooter([...buttons, cancel]);

	buttons[0].focus();
	buttons[0].state.variant = 'primary';

	jodit.e.fire(
		'afterOpenPasteDialog',
		dialog,
		msg,
		title,
		callback,
		buttonList
	);

	return dialog;
}
