/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IDestructible } from './types';
import type { IPopup } from './popup';

export interface IContextMenuAction {
	icon?: string;
	title?: string;
	exec?: (this: IContextMenu, e: MouseEvent) => false | void;
	enabled?: boolean;
}

export interface IContextMenu extends IDestructible, IPopup {
	show(
		x: number,
		y: number,
		actions: Array<false | IContextMenuAction>
	): void;
}
