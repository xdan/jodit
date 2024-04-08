/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/dialog
 */

import type { IDialog } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { asArray } from 'jodit/core/helpers/array/as-array';
import { isFunction } from 'jodit/core/helpers/checker/is-function';
import { Button } from 'jodit/core/ui/button/button/button';

import { Dialog } from './dialog';

/**
 * Show `alert` dialog. Work without Jodit object
 * @example
 * ```javascript
 * Jodit.Alert("File was uploaded");
 * Jodit.Alert("File was uploaded", "Message");
 * Jodit.Alert("File was uploaded", function() {
 *    $('form').hide();
 * });
 * Jodit.Alert("File wasn't uploaded", "Error", function() {
 *    $('form').hide();
 * });
 * ```
 */
export function Alert(
	this: IDialog | unknown,
	msg: string | HTMLElement,
	title?: string | (() => void | false),
	callback?: string | ((dialog: IDialog) => void | false),
	className: string = 'jodit-dialog_alert'
): IDialog {
	if (isFunction(title)) {
		callback = title;
		title = undefined;
	}
	const dialog =
			this instanceof Dialog
				? this
				: new Dialog({ closeOnClickOverlay: true }),
		container = dialog.c.div(className),
		okButton = Button(dialog, 'ok', 'Ok');

	asArray(msg).forEach(oneMessage => {
		container.appendChild(
			Dom.isNode(oneMessage) ? oneMessage : dialog.c.fromHTML(oneMessage)
		);
	});

	okButton.onAction(() => {
		if (!callback || !isFunction(callback) || callback(dialog) !== false) {
			dialog.close();
		}
	});

	dialog.setFooter([okButton]);

	dialog.open(container, (title as string) || '&nbsp;', true, true);
	okButton.focus();

	return dialog;
}
