/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import {
	Controls,
	IControlType,
	IControlTypeStrongList,
	IToolbarButton,
	IToolbarCollection,
	IViewBased, Nullable
} from '../../types/';

import { each, isString, splitArray } from '../../core/helpers/';
import { PopupMenu } from './menu';

export class PopupList extends PopupMenu {
	private defaultControl = {
		template: (editor: IViewBased, key: string, value: string) =>
			this.jodit.i18n(value)
	};

	doOpen(control: IControlTypeStrongList) {
		this.toolbar = makeCollection(this.jodit);

		const list = isString(control.list)
			? splitArray(control.list)
			: control.list;

		each(list, (key: number | string, value: string | IControlType) => {
			let button: IToolbarButton,
				controls: Controls | void = this.jodit.options.controls,
				getControl = (key: string): IControlType | void =>
					controls && controls[key];

			if (isString(value) && getControl(value)) {
				button = makeButton(
					this.jodit,
					{
						name: value.toString(),
						...getControl(value)
					},
					this.current
				); // list like array {"align": {list: ["left", "right"]}}
			} else if (
				isString(key) &&
				getControl(key) &&
				typeof value === 'object'
			) {
				button = makeButton(
					this.jodit,
					{
						name: key.toString(),
						...getControl(key),
						...value
					},
					this.current
				); // list like object {"align": {list: {"left": {exec: alert}, "right": {}}}}
			} else {
				button = makeButton(
					this.jodit,
					{
						name: key.toString(),
						exec: control.exec,
						command: control.command,
						isActive: control.isActiveChild,
						isDisabled: control.isChildDisabled,
						mode: control.mode,
						args: [
							(control.args && control.args[0]) || key,
							(control.args && control.args[1]) || value
						]
					},
					this.current
				); // list like object {"align": {list: {"left": {exec: alert}, "right": {}}}}

				const template =
					control.template || this.defaultControl.template;

				button.text.innerHTML = template(
					this.jodit,
					key.toString(),
					value.toString()
				);
			}

			this.toolbar.append(button);
		});

		this.container.appendChild(this.toolbar.container);
		this.container.style.removeProperty('marginLeft');

		this.toolbar.update();
	}

	toolbar!: IToolbarCollection;

	firstInFocus() {
		this.toolbar.firstButton?.focus();
	}

	constructor(
		jodit: IViewBased,
		readonly target: HTMLElement,
		readonly current: Nullable<HTMLElement> = null,
		readonly className: string = 'jodit-toolbar__list'
	) {
		super(jodit);
	}

	destruct() {
		if (this.isDestructed) {
			return;
		}

		this.toolbar?.destruct();

		super.destruct();
	}
}

import { makeButton, makeCollection } from '../toolbar/factory';
