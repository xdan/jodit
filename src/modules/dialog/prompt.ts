/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import { Dialog } from './dialog';
import { Icon } from '../../core/ui';

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
	const dialog: Dialog = new Dialog(),
		cancelButton: HTMLAnchorElement = dialog.c.fromHTML(
			'<a href="javascript:void(0)" style="float:right;" class="jodit-button">' +
				Icon.get('cancel') +
				'<span>' +
				dialog.i18n('Cancel') +
				'</span></a>'
		) as HTMLAnchorElement,
		okButton: HTMLAnchorElement = dialog.c.fromHTML(
			'<a href="javascript:void(0)" style="float:left;" class="jodit-button">' +
				Icon.get('check') +
				'<span>' +
				dialog.i18n('Ok') +
				'</span></a>'
		) as HTMLAnchorElement,
		form: HTMLFormElement = dialog.c.element('form', {
			class: 'jodit-dialog_prompt'
		}),
		inputElement: HTMLInputElement = dialog.c.element('input', {
			autofocus: true,
			class: 'jodit_input'
		}),
		labelElement: HTMLLabelElement = dialog.c.element(
			'label'
		) as HTMLLabelElement;

	if (typeof title === 'function') {
		callback = title;
		title = undefined;
	}

	if (placeholder) {
		inputElement.setAttribute('placeholder', placeholder);
	}

	labelElement.appendChild(dialog.c.text(msg));

	form.appendChild(labelElement);
	form.appendChild(inputElement);

	cancelButton.addEventListener('click', dialog.close, false);

	const onclick = () => {
		if (
			!callback ||
			typeof callback !== 'function' ||
			callback(inputElement.value) !== false
		) {
			dialog.close();
		}
	};

	okButton.addEventListener('click', onclick);

	form.addEventListener('submit', () => {
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
