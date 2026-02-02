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
