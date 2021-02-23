/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Dialog } from './dialog';
import { Button } from '../../core/ui';
import { attr, isFunction } from '../../core/helpers';

/**
 * Show `Prompt` dialog. Work without Jodit object
 *
 * @method Prompt
 * @param {string} msg Message
 * @param {string|function} [title] Title or callback
 * @param {function} [callback] callback. The first argument is the value entered
 * @param {string} [placeholder] Placeholder for input
 * @example
 * ```javascript
 * Jodit.Prompt("Enter your name", "Prompt Dialog", function (name) {
 *     if (name.length < 3) {
 *         Jodit.Alert("The name must be at least 3 letters");
 *         return false;
 *     }
 *     // do something
 * });
 * ```
 */
export const Prompt = (
	msg: string,
	title: string | (() => false | void) | undefined,
	callback: (value: string) => false | void,
	placeholder?: string,
	defaultValue?: string
): Dialog => {
	const dialog = new Dialog(),
		cancelButton = Button(dialog, 'cancel', 'Cancel'),
		okButton = Button(dialog, 'ok', 'Ok'),
		form = dialog.c.element('form', {
			class: 'jodit-dialog_prompt'
		}),
		inputElement = dialog.c.element('input', {
			autofocus: true,
			class: 'jodit-input'
		}),
		labelElement = dialog.c.element('label');

	if (isFunction(title)) {
		callback = title;
		title = undefined;
	}

	if (placeholder) {
		attr(inputElement, 'placeholder', placeholder);
	}

	labelElement.appendChild(dialog.c.text(msg));

	form.appendChild(labelElement);
	form.appendChild(inputElement);

	cancelButton.onAction(dialog.close);

	const onclick = () => {
		if (
			!callback ||
			!isFunction(callback) ||
			callback(inputElement.value) !== false
		) {
			dialog.close();
		}
	};

	okButton.onAction(onclick);

	dialog.e.on(form, 'submit', () => {
		onclick();
		return false;
	});

	dialog.setFooter([okButton, cancelButton]);

	dialog.open(form, (title as string) || '&nbsp;', true, true);
	inputElement.focus();

	if (defaultValue !== undefined && defaultValue.length) {
		inputElement.value = defaultValue;
		inputElement.select();
	}

	return dialog;
};
