/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import './area.less';
import { UIInput } from '../input';

export class UITextArea extends UIInput {
	nativeInput!: HTMLTextAreaElement;

	/** @override */
	protected createContainer(options: this['options']): HTMLElement {
		this.nativeInput = this.j.create.element('textarea');
		return super.createContainer(options);
	}
}
