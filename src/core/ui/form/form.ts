/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IDictionary, IUIForm, IUIInput, IUISelect } from '../../../types';
import { UIGroup } from '../list/group';
import { UIInput, UISelect } from './inputs';
import { attr } from '../../helpers/utils';
import { component } from '../../decorators';

@component
export class UIForm extends UIGroup implements IUIForm {
	/** @override */
	className(): string {
		return 'UIForm';
	}

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

		const selects = this.allChildren.filter(
			elm => elm instanceof UISelect
		) as IUISelect[];

		for (const select of selects) {
			if (!select.validate()) {
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
					res[item.state.name] = item.value;
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
