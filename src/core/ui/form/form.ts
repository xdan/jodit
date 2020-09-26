/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import { IDictionary, IUIForm, IUIInput } from '../../../types';
import { UIGroup } from '..';
import { UIInput } from './input';
import { attr } from '../../helpers/utils';

export class UIForm extends UIGroup implements IUIForm {
	container!: HTMLFormElement;

	submit() {
		this.j.e.fire(this.container, 'submit');
	}

	validate(): boolean {
		const inputs = this.allChildren.filter(
			elm => elm instanceof UIInput
		) as IUIInput[];

		for (const input of inputs) {
			if (!input.validate()) {
				return false;
			}
		}

		return true;
	}

	onSubmit(handler: (data: IDictionary) => false | void) {
		this.j.e.on(this.container, 'submit', (): false => {
			const inputs = this.allChildren.filter(
				elm => elm instanceof UIInput
			) as IUIInput[];

			if (!this.validate()) {
				return false;
			}

			handler(
				inputs.reduce((res, item) => {
					res[item.options.name] = item.value;
					return res;
				}, {} as IDictionary)
			);

			return false;
		});
	}

	/** @override */
	protected createContainer(): HTMLElement {
		const form = this.j.c.element('form');
		form.classList.add(this.componentName);
		attr(form, 'dir', this.j.o.direction || 'auto');
		return form;
	}
}
