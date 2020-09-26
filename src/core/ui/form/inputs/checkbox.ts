/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import './checkbox.less';
import { UIInput } from '../input';
import { IDictionary } from '../../../../types';

export class UICheckbox extends UIInput {
	/** @override */
	protected makeContainer(options?: IDictionary): HTMLElement {
		return this.j.c.element('label', {
			className: this.componentName
		});
	}

	/** @override */
	protected createContainer(options: this['options']): HTMLElement {
		return super.createContainer({ ...options, type: 'checkbox' });
	}
}
