/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import { Dialog } from './dialog';
import { ToolbarIcon } from '../toolbar/icon';

/**
 * Show `alert` dialog. Work without Jodit object
 *
 * @method Alert
 * @param {string} msg Message
 * @param {string|function} [title] Title or callback
 * @param {function} [callback] callback
 * @param {string} [className]
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
	className: string = 'jodit_alert'
): Dialog => {
	if (typeof title === 'function') {
		callback = title;
		title = undefined;
	}

	const
		dialog = new Dialog(),
		container = dialog.create.div(className),
		okButton: HTMLAnchorElement = dialog.create.fromHTML(
			'<a href="javascript:void(0)" style="float:right;" class="jodit_button">' +
			ToolbarIcon.getIcon('cancel') +
			'<span>' +
			dialog.i18n('Ok') +
			'</span></a>'
		) as HTMLAnchorElement;

	asArray(msg).forEach(oneMessage => {
		container.appendChild(
			Dom.isNode(oneMessage, dialog.window)
				? oneMessage
				: dialog.create.fromHTML(oneMessage)
		);
	});

	okButton.addEventListener('click', () => {
		if (
			!callback ||
			typeof callback !== 'function' ||
			callback(dialog) !== false
		) {
			dialog.close();
		}
	});

	dialog.setFooter([okButton]);

	dialog.open(container, (title as string) || '&nbsp;', true, true);
	okButton.focus();

	return dialog;
};

import { asArray } from '../helpers/array';
import { Dom } from '../Dom';
