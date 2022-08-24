/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IDialog, IDialogOptions } from 'jodit/types';
import { ViewWithToolbar } from './view-with-toolbar';
import { Dialog, Alert, Confirm, Prompt } from 'jodit/modules/dialog';
import { isString, markOwner } from 'jodit/core/helpers';

export abstract class Panel extends ViewWithToolbar {
	dialog(options?: IDialogOptions): IDialog {
		const dialog = new Dialog({
			language: this.o.language,
			shadowRoot: this.o.shadowRoot,
			ownerWindow: this.o.ownerWindow,
			defaultTimeout: this.o.defaultTimeout,
			theme: this.o.theme,
			globalFullSize: this.o.globalFullSize,
			...options
		});
		markOwner(this, dialog.container);
		dialog.parent = this;
		return dialog.bindDestruct(this);
	}

	confirm(
		msg: string,
		title: string | ((yes: boolean) => void) | undefined,
		callback?: (yes: boolean) => void | false
	): IDialog {
		if (isString(title)) {
			title = this.i18n(title);
		}
		return Confirm.call(this.dialog(), this.i18n(msg), title, callback);
	}

	prompt(
		msg: string,
		title: string | (() => false | void) | undefined,
		callback: (value: string) => false | void,
		placeholder?: string,
		defaultValue?: string
	): IDialog {
		if (isString(title)) {
			title = this.i18n(title);
		}

		if (isString(placeholder)) {
			placeholder = this.i18n(placeholder);
		}

		return Prompt.call(
			this.dialog(),
			this.i18n(msg),
			title,
			callback,
			placeholder,
			defaultValue
		);
	}

	alert(
		msg: string | HTMLElement,
		title?: string | (() => void | false),
		callback?: string | ((dialog: IDialog) => void | false),
		className?: string
	): IDialog {
		if (isString(msg)) {
			msg = this.i18n(msg);
		}
		if (isString(title)) {
			title = this.i18n(title);
		}
		return Alert.call(this.dialog(), msg, title, callback, className);
	}
}
