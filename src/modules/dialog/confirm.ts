/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Dialog } from './dialog';
import { isFunction } from '../../core/helpers';
import { Button } from '../../core/ui';

/**
 * Show `confirm` dialog. Work without Jodit object
 *
 * @method Confirm
 * @param {string} msg Message
 * @param {string|function} [title] Title or callback
 * @param {function} [callback] callback. The first argument is the value entered
 * @example
 * ```javascript
 * Jodit.Confirm("Are you shure?", "Confirm Dialog", function (yes) {
 *     if (yes) {
 *         // do something
 *     }
 * });
 * ```
 */
export const Confirm = (
	msg: string,
	title: string | ((yes: boolean) => void) | undefined,
	callback?: (yes: boolean) => void
): Dialog => {
	const dialog = new Dialog(),
		$div: HTMLDivElement = dialog.c.fromHTML(
			'<form class="jodit-dialog_prompt"></form>'
		) as HTMLDivElement,
		$label: HTMLLabelElement = dialog.c.element('label');

	if (isFunction(title)) {
		callback = title;
		title = undefined;
	}

	$label.appendChild(dialog.c.fromHTML(msg));
	$div.appendChild($label);

	const $cancel = Button(dialog, 'cancel', 'Cancel');

	$cancel.onAction(() => {
		if (callback) {
			callback(false);
		}

		dialog.close();
	});

	const onok = () => {
		if (callback) {
			callback(true);
		}

		dialog.close();
	};

	const $ok = Button(dialog, 'ok', 'Yes');

	$ok.onAction(onok);

	dialog.e.on($div, 'submit', () => {
		onok();
		return false;
	});

	dialog.setFooter([$ok, $cancel]);

	dialog.open($div, (title as string) || '&nbsp;', true, true);
	$ok.focus();

	return dialog;
};
