/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/dialog
 */

import { Dialog } from './dialog';
import { asArray, isFunction } from 'jodit/core/helpers/';
import { Dom } from 'jodit/core/dom';
import { Button } from 'jodit/core/ui';

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
export const Alert = (
	msg: string | HTMLElement,
	title?: string | (() => void | false),
	callback?: string | ((dialog: Dialog) => void | false),
	className: string = 'jodit-dialog_alert'
): Dialog => {
	if (isFunction(title)) {
		callback = title;
		title = undefined;
	}
	const dialog = new Dialog(),
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
};
