/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module types
 */

import type { IBound, IDestructible } from './types';
import type { IUIElement } from './ui';

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

	open(
		getBound: () => IBound,
		keepPosition?: boolean,
		parentContainer?: HTMLElement
	): this;

	setContent(content: IUIElement | HTMLElement | string): this;
	updatePosition(): this;

	close(): this;
	isOwnClick(e: MouseEvent): boolean;

	setZIndex(index: number): void;
}
