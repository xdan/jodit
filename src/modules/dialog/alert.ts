/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import { Dialog } from './dialog';
import { asArray, isFunction } from '../../core/helpers/';
import { Dom } from '../../core/dom';
import { Icon } from '../../core/ui';

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
	className: string = 'jodit-dialog_alert'
): Dialog => {
	if (isFunction(title)) {
		callback = title;
		title = undefined;
	}

	const dialog = new Dialog(),
		container = dialog.c.div(className),
		okButton: HTMLAnchorElement = dialog.c.fromHTML(
			'<a href="javascript:void(0)" style="float:right;" class="jodit-button">' +
				Icon.get('cancel') +
				'<span>' +
				dialog.i18n('Ok') +
				'</span></a>'
		) as HTMLAnchorElement;

	asArray(msg).forEach(oneMessage => {
		container.appendChild(
			Dom.isNode(oneMessage, dialog.window)
				? oneMessage
				: dialog.c.fromHTML(oneMessage)
		);
	});

	dialog.e.on(okButton, 'click', () => {
		if (!callback || !isFunction(callback) || callback(dialog) !== false) {
			dialog.close();
		}
	});

	dialog.setFooter([okButton]);

	dialog.open(container, (title as string) || '&nbsp;', true, true);
	okButton.focus();

	return dialog;
};
