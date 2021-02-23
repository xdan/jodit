/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './area.less';

import { UIInput } from '../input/input';
import { component } from '../../../../decorators';

@component
export class UITextArea extends UIInput {
	/** @override */
	className(): string {
		return 'UITextArea';
	}

	nativeInput!: HTMLTextAreaElement;

	/** @override */
	protected createContainer(options: this['state']): HTMLElement {
		this.nativeInput = this.j.create.element('textarea');
		return super.createContainer(options);
	}
}
