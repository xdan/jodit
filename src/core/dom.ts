/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type {
	CanUndef,
	HTMLTagNames,
	ICreate,
	IJodit,
	NodeCondition,
	Nullable
} from '../types';
import * as consts from './constants';
import {
	asArray,
	css,
	dataBind,
	isArray,
	isFunction,
	isString,
	isVoid,
	toArray,
	trim
} from './helpers';

/**
 * Module for working with DOM
 */
export class Dom {
	/**
	 * Remove all content from element
	 * @param node
	 */
	static detach(node: Node): void {
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
	}

	/**
	 * Wrap all inline siblings
	 *
	 * @param current
	 * @param tag
	 * @param editor
	 */
	static wrapInline(
		current: Node,
		tag: Node | HTMLTagNames,
		editor: IJodit
	): HTMLElement {
		let tmp: Nullable<Node>,
			first: Node = current,
			last: Node = current;

		editor.s.save();

		let needFindNext: boolean = false;

		do {
			needFindNext = false;
			tmp = first.previousSibling;

			if (tmp && !Dom.isBlock(tmp, editor.ew)) {
				needFindNext = true;
				first = tmp;
			}
		} while (needFindNext);

		do {
			needFindNext = false;
			tmp = last.nextSibling;

			if (tmp && !Dom.isBlock(tmp, editor.ew)) {
				needFindNext = true;
				last = tmp;
			}
		} while (needFindNext);

		const wrapper = isString(tag) ? editor.createInside.element(tag) : tag;

		if (first.parentNode) {
			first.parentNode.insertBefore(wrapper, first);
		}

		let next: Nullable<Node> = first;

		while (next) {
			next = first.nextSibling;
			wrapper.appendChild(first);

			if (first === last || !next) {
				break;
			}

			first = next;
		}

		editor.s.restore();

		return wrapper as HTMLElement;
	}

	/**
	 * Wrap node inside another node
	 *
	 * @param current
	 * @param tag
	 * @param editor
	 */
	static wrap<K extends HTMLTagNames>(
		current: Node,
		tag: K,
		create: ICreate
	): Nullable<HTMLElementTagNameMap[K]>;

	static wrap(
		current: Node,
		tag: HTMLElement | HTMLTagNames,
		create: ICreate
	): Nullable<HTMLElement> {
		const wrapper = isString(tag) ? create.element(tag) : tag;

		if (!current.parentNode) {
			return null;
		}

		current.parentNode.insertBefore(wrapper, current);

		wrapper.appendChild(current);

		return wrapper;
	}

	/**
	 * Remove parent of node and insert this node instead that parent
	 * @param node
	 */
	static unwrap(node: Node): void {
		const parent = node.parentNode;

		if (parent) {
			while (node.firstChild) {
				parent.insertBefore(node.firstChild, node);
			}

			Dom.safeRemove(node);
		}
	}

	/**
	 * It goes through all the internal elements of the node, causing a callback function
	 *
	 * @param elm elements , the internal node is necessary to sort out
	 * @param callback It called for each item found
	 * @example
	 * ```javascript
	 * Jodit.modules.Dom.each(parent.s.current(), function (node) {
	 *  if (node.nodeType === Node.TEXT_NODE) {
	 *      node.nodeValue = node.nodeValue.replace(Jodit.INVISIBLE_SPACE_REG_EX, '') // remove all of
	 *      the text element codes invisible character
	 *  }
	 * });
	 * ```
	 */
	static each(
		elm: Node | HTMLElement,
		callback: (node: Node) => void | boolean
	): boolean {
		let node: Node | null | false = elm.firstChild;

		if (node) {
			while (node) {
				const next = Dom.next(node, Boolean, elm);

				if (callback(node) === false) {
					return false;
				}

				// inside callback - node could be removed
				if (node.parentNode && !Dom.each(node, callback)) {
					return false;
				}

				node = next;
			}
		}

		return true;
	}

	/**
	 * Call function for all nodes between `start` and `end`
	 *
	 * @param start
	 * @param end
	 */
	static between(
		start: Node,
		end: Node,
		callback: (node: Node) => void | boolean
	): void {
		let next: CanUndef<Nullable<Node>> = start;

		while (next && next !== end) {
			if (start !== next && callback(next)) {
				break;
			}

			let step: Nullable<Node> = next.firstChild || next.nextSibling;

			if (!step) {
				while (next && !next.nextSibling) {
					next = next.parentNode;
				}

				step = next?.nextSibling as Nullable<Node>;
			}

			next = step;
		}
	}

	/**
	 * Replace one tag to another transfer content
	 *
	 * @param  {Node} elm The element that needs to be replaced by new
	 * @param  {string} newTagName tag name for which will change `elm`
	 * @param  {boolean} withAttributes=false If true move tag's attributes
	 * @param  {boolean} notMoveContent=false false - Move content from elm to newTagName
	 * @param  {Document} [doc=document]
	 * @return {Node} Returns a new tag
	 * @example
	 * ```javascript
	 * Jodit.modules.Dom.replace(parent.editor.getElementsByTagName('span')[0], 'p');
	 * // Replace the first <span> element to the < p >
	 * ```
	 */
	static replace(
		elm: HTMLElement,
		newTagName: HTMLTagNames | HTMLElement,
		create: ICreate,
		withAttributes = false,
		notMoveContent = false
	): HTMLElement {
		const tag = isString(newTagName)
			? create.element(newTagName)
			: newTagName;

		if (!notMoveContent) {
			while (elm.firstChild) {
				tag.appendChild(elm.firstChild);
			}
		}

		if (withAttributes) {
			toArray(elm.attributes).forEach(attr => {
				tag.setAttribute(attr.name, attr.value);
			});
		}

		if (elm.parentNode) {
			elm.parentNode.replaceChild(tag, elm);
		}

		return tag;
	}

	/**
	 * Checks whether the Node text and blank (in this case it may contain invisible auxiliary characters ,
	 * it is also empty )
	 *
	 * @param  {Node} node The element of wood to be checked
	 * @return {Boolean} true element is empty
	 */
	static isEmptyTextNode(node: Node): boolean {
		return (
			Dom.isText(node) &&
			(!node.nodeValue ||
				node.nodeValue.replace(consts.INVISIBLE_SPACE_REG_EXP(), '')
					.length === 0)
		);
	}

	/**
	 * Check if element is empty
	 *
	 * @param {Node} node
	 * @param {RegExp} condNoEmptyElement
	 * @return {boolean}
	 */
	static isEmpty(
		node: Node,
		condNoEmptyElement: RegExp = /^(img|svg|canvas|input|textarea|form)$/
	): boolean {
		if (!node) {
			return true;
		}

		if (Dom.isText(node)) {
			return node.nodeValue == null || trim(node.nodeValue).length === 0;
		}

		return (
			!condNoEmptyElement.test(node.nodeName.toLowerCase()) &&
			Dom.each(node as HTMLElement, (elm: Node | null): false | void => {
				if (
					(Dom.isText(elm) &&
						elm.nodeValue != null &&
						trim(elm.nodeValue).length !== 0) ||
					(Dom.isElement(elm) &&
						condNoEmptyElement.test(elm.nodeName.toLowerCase()))
				) {
					return false;
				}
			})
		);
	}

	/**
	 * Returns true if it is a DOM node
	 */
	static isNode(object: unknown, win?: Window): object is Node {
		if (!object) {
			return false;
		}

		if (
			typeof win === 'object' &&
			win &&
			(typeof (win as any).Node === 'function' ||
				typeof (win as any).Node === 'object')
		) {
			return object instanceof (win as any).Node; // for Iframe Node !== iframe.contentWindow.Node
		}

		return false;
	}

	/**
	 *  Check if element is table cell
	 *
	 * @param elm
	 * @param win
	 */
	static isCell(elm: unknown, win: Window): elm is HTMLTableCellElement {
		return Dom.isNode(elm, win) && /^(td|th)$/i.test(elm.nodeName);
	}

	/**
	 * Check is element is Image element
	 *
	 * @param {Node} elm
	 * @param {Window} win
	 * @return {boolean}
	 */
	static isImage(elm: unknown, win: Window): elm is HTMLImageElement {
		return (
			Dom.isNode(elm, win) &&
			/^(img|svg|picture|canvas)$/i.test(elm.nodeName)
		);
	}

	/**
	 * Check the `node` is a block element
	 *
	 * @param node
	 * @param win
	 */
	static isBlock(node: unknown, win: Window): node is HTMLElement {
		return (
			!isVoid(node) &&
			typeof node === 'object' &&
			Dom.isNode(node, win) &&
			consts.IS_BLOCK.test((node as Node).nodeName)
		);
	}

	/**
	 * Check if element is text node
	 * @param node
	 */
	static isText(node: Node | null | false): node is Text {
		return Boolean(node && node.nodeType === Node.TEXT_NODE);
	}

	/**
	 * Check if element is element node
	 * @param node
	 */
	static isElement(
		node: Node | null | false | EventTarget | object
	): node is Element {
		return Boolean(node && (node as Node).nodeType === Node.ELEMENT_NODE);
	}

	/**
	 * Check if element is HTMLElement node
	 * @param node
	 */
	static isHTMLElement(node: unknown, win: Window): node is HTMLElement {
		return (
			Dom.isNode(node, win) && node instanceof (win as any).HTMLElement
		);
	}

	/**
	 * Check element is inline block
	 * @param node
	 */
	static isInlineBlock(node: Node | null | false): boolean {
		return (
			Dom.isElement(node) &&
			!/^(BR|HR)$/i.test(node.tagName) &&
			['inline', 'inline-block'].indexOf(
				css(node as HTMLElement, 'display').toString()
			) !== -1
		);
	}

	/**
	 * It's block and it can be split
	 */
	static canSplitBlock(node: unknown, win: Window): boolean {
		return (
			!isVoid(node) &&
			node instanceof (win as any).HTMLElement &&
			Dom.isBlock(node, win) &&
			!/^(TD|TH|CAPTION|FORM)$/.test(node.nodeName) &&
			node.style !== undefined &&
			!/^(fixed|absolute)/i.test(node.style.position)
		);
	}

	/**
	 * Get last matched node inside root
	 *
	 * @param root
	 * @param condition
	 */
	static last(
		root: Nullable<Node>,
		condition: NodeCondition
	): Nullable<Node> {
		let last = root?.lastChild as Nullable<Node>;

		if (!last) {
			return null;
		}

		do {
			if (condition(last)) {
				return last;
			}

			let next: Nullable<Node> = last.lastChild;

			if (!next) {
				next = last.previousSibling;
			}

			if (!next && last.parentNode !== root) {
				do {
					last = last.parentNode;
				} while (
					last &&
					!last?.previousSibling &&
					last.parentNode !== root
				);

				next = last?.previousSibling as Nullable<Node>;
			}

			last = next;
		} while (last);

		return null;
	}

	/**
	 * Find previous node
	 *
	 * @param node
	 * @param condition
	 * @param root
	 * @param [withChild]
	 */
	static prev(
		node: Node,
		condition: NodeCondition,
		root: Node | HTMLElement | ParentNode,
		withChild: boolean = true
	): Nullable<Node> {
		return Dom.find(
			node,
			condition,
			root,
			false,
			'previousSibling',
			withChild ? 'lastChild' : false
		);
	}

	/**
	 * Find next node what `condition(next) === true`
	 *
	 * @param node
	 * @param condition
	 * @param root
	 * @param [withChild]
	 */
	static next(
		node: Node,
		condition: NodeCondition,
		root: Node | HTMLElement | ParentNode,
		withChild: boolean = true
	): Nullable<Node> {
		return Dom.find(
			node,
			condition,
			root,
			undefined,
			undefined,
			withChild ? 'firstChild' : false
		);
	}

	static prevWithClass(
		node: HTMLElement,
		className: string
	): Nullable<HTMLElement> {
		return Dom.prev(
			node,
			node => {
				return (
					Dom.isElement(node) && node.classList.contains(className)
				);
			},
			node.parentNode as HTMLElement
		) as HTMLElement | null;
	}

	static nextWithClass(
		node: HTMLElement,
		className: string
	): Nullable<HTMLElement> {
		return Dom.next(
			node,
			elm => Dom.isElement(elm) && elm.classList.contains(className),
			node.parentNode as HTMLElement
		) as Nullable<HTMLElement>;
	}

	/**
	 * Find next/prev node what `condition(next) === true`
	 *
	 * @param node
	 * @param condition
	 * @param root
	 * @param [recurse] check first argument
	 * @param [sibling] nextSibling or previousSibling
	 * @param [child] firstChild or lastChild
	 */
	static find(
		node: Node,
		condition: NodeCondition,
		root: ParentNode | HTMLElement | Node,
		recurse = false,
		sibling: keyof Node = 'nextSibling',
		child: keyof Node | false = 'firstChild'
	): Nullable<Node> {
		if (recurse && condition(node)) {
			return node;
		}

		let start: Nullable<Node> = node,
			next: Nullable<Node>;

		do {
			next = start[sibling] as Node;

			if (condition(next)) {
				return next ? next : null;
			}

			if (child && next && next[child]) {
				const nextOne = Dom.find(
					next[child] as Node,
					condition,
					next,
					true,
					sibling,
					child
				);

				if (nextOne) {
					return nextOne;
				}
			}

			if (!next) {
				next = start.parentNode;
			}

			start = next;
		} while (start && start !== root);

		return null;
	}

	/**
	 * Find next/prev node what `condition(next) === true`
	 *
	 * @param node
	 * @param condition
	 * @param root
	 * @param [sibling] nextSibling or previousSibling
	 * @param [child] firstChild or lastChild
	 */
	static findWithCurrent(
		node: Node,
		condition: NodeCondition,
		root: HTMLElement | Node,
		sibling: 'nextSibling' | 'previousSibling' = 'nextSibling',
		child: 'firstChild' | 'lastChild' = 'firstChild'
	): Nullable<Node> {
		let next: Nullable<Node> = node;

		do {
			if (condition(next)) {
				return next || null;
			}

			if (child && next && next[child]) {
				const nextOne = Dom.findWithCurrent(
					next[child] as Node,
					condition,
					next,
					sibling,
					child
				);

				if (nextOne) {
					return nextOne;
				}
			}

			while (next && !next[sibling] && next !== root) {
				next = next.parentNode;
			}

			if (next && next[sibling] && next !== root) {
				next = next[sibling];
			}
		} while (next && next !== root);

		return null;
	}

	/**
	 * Get not empty  sibling
	 *
	 * @param node
	 * @param [left]
	 * @param [cond]
	 */
	static findSibling(
		node: Node,
		left: boolean = true,
		cond: (n: Node) => boolean = (n: Node) => !Dom.isEmptyTextNode(n)
	): Nullable<Node> {
		const getSibling = (node: Node): Nullable<Node> => {
			return left ? node.previousSibling : node.nextSibling;
		};

		let start = getSibling(node);

		while (start && !cond(start)) {
			start = getSibling(start);
		}

		return start && cond(start) ? start : null;
	}

	/**
	 * It goes through all the elements in ascending order, and checks to see if they meet the predetermined condition
	 *
	 * @param node
	 * @param condition
	 * @param [root] Root element
	 * @param [checkRoot]
	 */
	static up<T extends HTMLElement>(
		node: Nullable<Node>,
		condition: NodeCondition,
		root?: Node,
		checkRoot: boolean = false
	): Nullable<T> {
		let start = node;

		if (!start) {
			return null;
		}

		do {
			if (condition(start)) {
				return start as T;
			}

			if (start === root || !start.parentNode) {
				break;
			}

			start = start.parentNode;
		} while (start && start !== root);

		if (start === root && checkRoot && condition(start)) {
			return start as T;
		}

		return null;
	}

	/**
	 * Find parent by tag name
	 *
	 * @param node
	 * @param tags
	 * @param root
	 */
	static closest<T extends HTMLElement, K extends HTMLTagNames>(
		node: Nullable<Node>,
		tags: K,
		root: HTMLElement
	): Nullable<HTMLElementTagNameMap[K]>;

	static closest<
		T extends HTMLElement,
		K extends keyof HTMLElementTagNameMap
	>(
		node: Nullable<Node>,
		tags: K[],
		root: HTMLElement
	): Nullable<HTMLElementTagNameMap[K]>;

	static closest<T extends HTMLElement>(
		node: Nullable<Node>,
		condition: NodeCondition,
		root: HTMLElement
	): Nullable<T>;

	static closest<T extends HTMLElement>(
		node: Nullable<Node>,
		tagsOrCondition: HTMLTagNames | HTMLTagNames[] | NodeCondition,
		root: HTMLElement
	): Nullable<T> {
		let condition: NodeCondition;

		if (isFunction(tagsOrCondition)) {
			condition = tagsOrCondition;
		} else if (isArray(tagsOrCondition)) {
			condition = (tag: Node | null) =>
				tag &&
				tagsOrCondition.includes(
					tag.nodeName.toLowerCase() as HTMLTagNames
				);
		} else {
			condition = (tag: Node | null) =>
				tag && tagsOrCondition === tag.nodeName.toLowerCase();
		}

		return Dom.up(node, condition, root);
	}

	/**
	 * Furthest parent node matching condition
	 *
	 * @param node
	 * @param condition
	 * @param root
	 */
	static furthest<T extends HTMLElement>(
		node: Nullable<Node>,
		condition: NodeCondition,
		root: HTMLElement
	): Nullable<T> {
		let matchedParent: Nullable<T> = null,
			current: Nullable<T> = node?.parentElement as Nullable<T>;

		while (current && current !== root && condition(current)) {
			matchedParent = current;
			current = current?.parentElement as Nullable<T>;
		}

		return matchedParent;
	}

	/**
	 * Append new element in the start of root
	 * @param root
	 * @param newElement
	 */
	static appendChildFirst(
		root: HTMLElement,
		newElement: HTMLElement | DocumentFragment
	): void {
		const child = root.firstChild;

		if (child) {
			if (child !== newElement) {
				root.insertBefore(newElement, child);
			}
		} else {
			root.appendChild(newElement);
		}
	}

	/**
	 * Insert newElement after element
	 *
	 * @param elm
	 * @param newElement
	 */
	static after(elm: Node, newElement: Node | DocumentFragment): void {
		const { parentNode } = elm;

		if (!parentNode) {
			return;
		}

		if (parentNode.lastChild === elm) {
			parentNode.appendChild(newElement);
		} else {
			parentNode.insertBefore(newElement, elm.nextSibling);
		}
	}

	/**
	 * Insert newElement before element
	 *
	 * @param elm
	 * @param newElement
	 */
	static before(elm: Node, newElement: Node | DocumentFragment): void {
		const { parentNode } = elm;

		if (!parentNode) {
			return;
		}

		parentNode.insertBefore(newElement, elm);
	}

	/**
	 * Insert newElement as first child inside element
	 *
	 * @param elm
	 * @param newElement
	 */
	static prepend(root: Node, newElement: Node | DocumentFragment): void {
		root.insertBefore(newElement, root.firstChild);
	}

	/**
	 * Insert newElement as last child inside element
	 *
	 * @param elm
	 * @param newElement
	 */
	static append(
		root: Node,
		newElements: Array<Node | DocumentFragment>
	): void;

	static append(root: Node, newElement: Node | DocumentFragment): void;

	static append(
		root: Node,
		newElement: Node | DocumentFragment | Array<Node | DocumentFragment>
	): void {
		if (isArray(newElement)) {
			newElement.forEach(node => {
				this.append(root, node);
			});
		} else {
			root.appendChild(newElement);
		}
	}

	/**
	 * Move all content to another element
	 *
	 * @param {Node} from
	 * @param {Node} to
	 * @param {boolean} inStart
	 */
	static moveContent(from: Node, to: Node, inStart: boolean = false): void {
		const fragment: DocumentFragment = (
			from.ownerDocument || document
		).createDocumentFragment();

		toArray(from.childNodes).forEach((node: Node) => {
			fragment.appendChild(node);
		});

		if (!inStart || !to.firstChild) {
			to.appendChild(fragment);
		} else {
			to.insertBefore(fragment, to.firstChild);
		}
	}

	/**
	 * Call callback condition function for all elements of node
	 *
	 * @param node
	 * @param condition
	 * @param prev
	 */
	static all(
		node: Node,
		condition: NodeCondition,
		prev: boolean = false
	): Nullable<Node> {
		let nodes: Node[] = node.childNodes ? toArray(node.childNodes) : [];

		if (condition(node)) {
			return node;
		}

		if (prev) {
			nodes = nodes.reverse();
		}

		nodes.forEach(child => {
			Dom.all(child, condition, prev);
		});

		return null;
	}

	/**
	 * Check root contains child or equal child
	 *
	 * @param root
	 * @param child
	 * @param [onlyContains]
	 */
	static isOrContains(
		root: Node,
		child: Node,
		onlyContains: boolean = false
	): boolean {
		if (root === child) {
			return !onlyContains;
		}

		return Boolean(
			child && root && this.up(child, nd => nd === root, root, true)
		);
	}

	/**
	 * Safe remove element from DOM
	 * @param node
	 */
	static safeRemove(node: Node | false | null | void): void {
		node && node.parentNode && node.parentNode.removeChild(node);
	}

	/**
	 * Hide element
	 * @param node
	 */
	static hide(node: HTMLElement | null): void {
		if (!node) {
			return;
		}

		dataBind(node, '__old_display', node.style.display);
		node.style.display = 'none';
	}

	/**
	 * Show element
	 * @param node
	 */
	static show(node: Nullable<HTMLElement>): void {
		if (!node) {
			return;
		}

		const display = dataBind(node, '__old_display');

		if (node.style.display === 'none') {
			node.style.display = display || '';
		}
	}

	/**
	 * Check if element is some tag
	 *
	 * @param node
	 * @param tagNames
	 */
	static isTag<K extends keyof HTMLElementTagNameMap>(
		node: Node | null | false | EventTarget,
		tagName: K
	): node is HTMLElementTagNameMap[K];

	static isTag<K extends keyof HTMLElementTagNameMap>(
		node: Node | null | false | EventTarget,
		tagNames: K[]
	): node is HTMLElementTagNameMap[K];

	static isTag<K extends keyof HTMLElementTagNameMap>(
		node: Node | null | false | EventTarget,
		tagNames: K[] | K
	): node is HTMLElementTagNameMap[K] {
		const tags = asArray(tagNames).map(String);

		for (let i = 0; i < tags.length; i += 1) {
			if (
				this.isElement(node) &&
				node.tagName.toLowerCase() === tags[i].toLowerCase()
			) {
				return true;
			}
		}

		return false;
	}
}
