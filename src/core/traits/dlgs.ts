/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module traits
 */

import type { IDialog, IDialogOptions, IViewBased, IDlgs } from 'jodit/types';
import { Alert, Confirm, Dialog, Prompt } from 'jodit/modules/dialog';
import { isHTML, isString } from 'jodit/core/helpers/checker';
import { markOwner } from 'jodit/core/helpers/utils/utils';

export abstract class Dlgs implements IDlgs {
	dlg(this: IViewBased & IDlgs, options?: IDialogOptions): IDialog {
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
		this: IViewBased & IDlgs,
		msg: string,
		title: string | ((yes: boolean) => void) | undefined,
		callback?: (yes: boolean) => void | false
	): IDialog {
		msg = processTitle(msg, this);
		title = processTitle(title, this);
		return Confirm.call(this.dlg(), msg, title, callback);
	}

	prompt(
		this: IViewBased & IDlgs,
		msg: string,
		title: string | (() => false | void) | undefined,
		callback: (value: string) => false | void,
		placeholder?: string,
		defaultValue?: string
	): IDialog {
		msg = processTitle(msg, this);
		title = processTitle(title, this);
		placeholder = processTitle(placeholder, this);

		return Prompt.call(
			this.dlg(),
			msg,
			title,
			callback,
			placeholder,
			defaultValue
		);
	}

	alert(
		this: IViewBased & IDlgs,
		msg: string | HTMLElement,
		title?: string | (() => void | false),
		callback?: string | ((dialog: IDialog) => void | false),
		className?: string
	): IDialog {
		msg = processTitle(msg, this);
		title = processTitle(title, this);
		return Alert.call(this.dlg(), msg, title, callback, className);
	}
}

function processTitle<T extends string | unknown>(
	title: T,
	self: IViewBased
): T {
	if (isString(title) && !isHTML(title)) {
		title = self.i18n(title) as T;
	}

	return title;
}
