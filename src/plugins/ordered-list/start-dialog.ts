/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/ordered-list
 */

import type { IJodit, Nullable } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { attr } from 'jodit/core/helpers/utils/attr';
import { Button } from 'jodit/core/ui/button';
import { UIBlock, UIForm, UIInput } from 'jodit/core/ui/form';

/**
 * The numbered list the selection is in
 */
export function closestOrderedList(jodit: IJodit): Nullable<HTMLOListElement> {
	const current = jodit.s.current();

	return current ? Dom.closest(current, 'ol', jodit.editor) : null;
}

/**
 * Asks for the number of the first item of the list the selection is in,
 * and sets the list's `start`. The selection is put back when the dialog
 * closes, however it closes.
 */
export function openStartDialog(jodit: IJodit): void {
	const list = closestOrderedList(jodit);

	if (!list) {
		return;
	}

	const dialog = jodit.dlg({ resizable: false, closeOnClickOverlay: true });

	const input = new UIInput(jodit, {
		name: 'start',
		type: 'number',
		label: 'Number for the first item',
		value: list.start
	});

	const form = new UIForm(jodit, [new UIBlock(jodit, [input])]);
	form.container.classList.add('jodit-dialog_alert');

	form.onSubmit(({ start }): false | void => {
		const value = start === '' ? 1 : parseInt(start, 10);

		if (isNaN(value)) {
			input.focus();
			return false;
		}

		dialog.close();

		attr(list, 'start', value === 1 ? null : value);
		jodit.synchronizeValues();
	});

	jodit.s.save();

	dialog.e.on(dialog, 'afterClose', () => {
		jodit.s.focus();
		jodit.s.restore();
	});

	dialog.setFooter([
		Button(jodit, 'cancel', 'Cancel').onAction(() => dialog.close()),
		Button(jodit, 'ok', 'Apply', 'primary').onAction(() => form.submit())
	]);

	dialog.open(form, jodit.i18n('Start numbering at'), true, true);

	input.focus();
	(input.nativeInput as HTMLInputElement).select();
}
