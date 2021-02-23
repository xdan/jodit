/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IBound, IDestructible } from './types';
import { IUIElement } from './ui';

export type PopupStrategy =
	| 'leftBottom'
	| 'rightBottom'
	| 'leftTop'
	| 'rightTop';
export interface IPopup extends IUIElement, IDestructible {
	container: HTMLElement;

	isOpened: boolean;
	strategy: PopupStrategy;
	viewBound: () => IBound;

	open(getBound: () => IBound, keepPosition?: boolean): this;

	setContent(content: HTMLElement | string): this;
	updatePosition(): this;

	close(): this;

	setZIndex(index: number): void;
}
