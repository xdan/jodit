/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/dialog
 */

import { Dialog } from 'jodit/modules/dialog';
import { isFunction } from 'jodit/core/helpers';
import { Button } from 'jodit/core/ui';

/**
 * Show `confirm` dialog. Work without Jodit object
 *
 * @param title - Title or callback
 * @param callback - callback. The first argument is the value entered
 * @example
 * ```javascript
 * Jodit.Confirm("Are you sure?", "Confirm Dialog", function (yes) {
 *     if (yes) {
 *         // do something
 *     }
 * });
 * ```
 */
export const Confirm = (
	msg: string,
	title: string | ((yes: boolean) => void) | undefined,
	callback?: (yes: boolean) => void | false
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

	const action = (yes: boolean) => () => {
		if (!callback || callback(yes) !== false) {
			dialog.close();
		}
	};

	const $cancel = Button(dialog, 'cancel', 'Cancel');
	const $ok = Button(dialog, 'ok', 'Yes');

	$cancel.onAction(action(false));

	$ok.onAction(action(true));

	dialog.e.on($div, 'submit', () => {
		action(true)();
		return false;
	});

	dialog.setFooter([$ok, $cancel]);

	dialog.open($div, (title as string) || '&nbsp;', true, true);
	$ok.focus();

	return dialog;
};
