/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IDestructible } from './types';

export interface IContextMenuAction {
	icon?: string;
	title?: string;
	exec?: (this: IContextMenu, e: MouseEvent) => false | void;
}

export interface IContextMenu extends IDestructible {
	show(
		x: number,
		y: number,
		actions: Array<false | IContextMenuAction>
	): void;
}
