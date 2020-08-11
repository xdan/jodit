/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IViewOptions } from './view';
import { IComponent, IContainer } from './types';

export interface IDialogOptions extends IViewOptions {
	resizable?: boolean;
	draggable?: boolean;
}

export type ContentItem = string | HTMLElement | IContainer;
export type Content =
	| ContentItem
	| ContentItem[]
	| Array<ContentItem | ContentItem[]>;

export interface IDialog extends IComponent, IContainer {
	isOpened: boolean;

	open(destroyAfter: boolean): this;
	open(destroyAfter: boolean, modal: boolean): this;
	open(
		content?: Content,
		title?: Content,
		destroyAfter?: boolean,
		modal?: boolean
	): this;

	close(): this;

	setSize(w?: number | string, h?: number | string): this;
	setPosition(x?: number, y?: number): this;
	setHeader(content: Content): this;
	setContent(content: Content): this;
	setFooter(content: Content): this;
	setModal(modal: undefined | boolean): this;
	getZIndex(): number;
}
