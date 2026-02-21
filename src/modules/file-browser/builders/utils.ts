/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/file-browser
 */

import type {
	HTMLTagNames,
	IDictionary,
	IFileBrowserItem,
	Nullable
} from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';

/**
 * @private
 */
export const getItem = (
	node: Nullable<EventTarget>,
	root: HTMLElement,
	tag: HTMLTagNames = 'a'
): Nullable<HTMLElement> =>
	Dom.closest(node as Node, elm => Dom.isTag(elm, tag), root);

/**
 * @private
 */
export const elementToItem = (
	elm: HTMLElement,
	elementsMap: IDictionary<{
		elm: HTMLElement;
		item: IFileBrowserItem;
	}>
): IFileBrowserItem | void => {
	const { key } = elm.dataset,
		{ item } = elementsMap[key || ''];

	return item;
};
