/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './checkbox.less';

import type { IDictionary, IUIInput, IViewBased } from '../../../../../types';
import { UIInput } from '../input/input';
import { component } from '../../../../decorators';

@component
export class UICheckbox extends UIInput {
	/** @override */
	className(): string {
		return 'UICheckbox';
	}

	/** @override */
	protected render(options?: IDictionary): HTMLElement {
		return this.j.c.element('label', {
			className: this.componentName
		});
	}

	/** @override **/
	constructor(jodit: IViewBased, options: Partial<IUIInput['state']>) {
		super(jodit, { ...options, type: 'checkbox' });
	}
}
