/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import { ToolbarElement } from './element';

export class ToolbarSeparator extends ToolbarElement {
	protected createContainer(): HTMLElement {
		return this.jodit.create.span('jodit-toolbar__separator');
	}
}
