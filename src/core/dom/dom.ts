/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:core/dom/README.md]]
 * @packageDocumentation
 * @module dom
 */

import type {
	CanUndef,
	HTMLTagNames,
	ICreate,
	IJodit,
	NodeCondition,
	Nullable,
	IDictionary
} from 'jodit/types';
import * as consts from 'jodit/core/constants';
import {
	$$,
	asArray,
	attr,
	css,
	dataBind,
	error,
	get,
	isArray,
	isFunction,
	isHTML,
	isString,
	isVoid,
	toArray,
	trim
} from 'jodit/core/helpers';
import { Select } from 'jodit/core/selection';
import { TEMP_ATTR } from 'jodit/core/constants';

/**
 * Module for working with DOM
 */
export class Dom {
	/**
	 * Remove all content from element
	 */
	static detach(node: Node): void {
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
	}

	/**
	 * Wrap all inline siblings
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

			if (tmp && !Dom.isBlock(tmp)) {
				needFindNext = true;
				first = tmp;
			}
		} while (needFindNext);

		do {
			needFindNext = false;
			tmp = last.nextSibling;

			if (tmp && !Dom.isBlock(tmp)) {
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
	 */
	static wrap<K extends HTMLTagNames>(
		current: Node,
		tag: K,
		create: ICreate
	): HTMLElementTagNameMap[K];

	static wrap(
		current: Node,
		tag: HTMLElement | HTMLTagNames,
		create: ICreate
	): HTMLElement {
		const wrapper = isString(tag) ? create.element(tag) : tag;

		if (!current.parentNode) {
			throw error('Element should be in DOM');
		}

		current.parentNode.insertBefore(wrapper, current);

		wrapper.appendChild(current);

		return wrapper;
	}

	/**
	 * Remove parent of node and insert this node instead that parent
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
	 * Call function for all nodes between `start` and `end`
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
	 * @param elm - The element that needs to be replaced by new
	 * @param newTagName - tag name for which will change `elm`
	 * @param withAttributes - If true move tag's attributes
	 * @param notMoveContent - false - Move content from elm to newTagName
	 * @example
	 * ```javascript
	 * Jodit.modules.Dom.replace(parent.editor.getElementsByTagName('span')[0], 'p');
	 * // Replace the first <span> element to the < p >
	 * ```
	 */
	static replace(
		elm: HTMLElement,
		newTagName: HTMLTagNames | HTMLElement | string,
		create: ICreate,
		withAttributes = false,
		notMoveContent = false
	): HTMLElement {
		if (isHTML(newTagName)) {
			newTagName = create.fromHTML(newTagName);
		}

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
	 * @param node - The element of wood to be checked
	 */
	static isEmptyTextNode(node: Nullable<Node>): boolean {
		return (
			Dom.isText(node) &&
			(!node.nodeValue ||
				node.nodeValue
					.replace(consts.INVISIBLE_SPACE_REG_EXP(), '')
					.trim().length === 0)
		);
	}

	static isEmptyContent(node: Node): boolean {
		return Dom.each(node as HTMLElement, (elm: Node | null): boolean =>
			Dom.isEmptyTextNode(elm)
		);
	}

	/**
	 * The node is editable
	 */
	static isContentEditable(node: Nullable<Node>, root: HTMLElement): boolean {
		return (
			Dom.isNode(node) &&
			!Dom.closest(
				node,
				elm =>
					Dom.isElement(elm) &&
					elm.getAttribute('contenteditable') === 'false',
				root
			)
		);
	}

	/**
	 * Check if element is empty
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
	static isNode(object: unknown): object is Node {
		if (!object) {
			return false;
		}

		const win = get<Window>('ownerDocument.defaultView', <object>object);

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
	 */
	static isCell(elm: unknown): elm is HTMLTableCellElement {
		return Dom.isNode(elm) && /^(td|th)$/i.test(elm.nodeName);
	}

	/**
	 * Check is element is Image element
	 */
	static isImage(elm: unknown): elm is HTMLImageElement {
		return (
			Dom.isNode(elm) && /^(img|svg|picture|canvas)$/i.test(elm.nodeName)
		);
	}

	/**
	 * Check the `node` is a block element
	 * @param node - Object to check
	 */
	static isBlock(node: unknown): node is HTMLDivElement {
		return (
			!isVoid(node) &&
			typeof node === 'object' &&
			Dom.isNode(node) &&
			consts.IS_BLOCK.test((node as Node).nodeName)
		);
	}

	/**
	 * Check if element is text node
	 */
	static isText(node: Node | null | false): node is Text {
		return Boolean(node && node.nodeType === Node.TEXT_NODE);
	}

	/**
	 * Check if element is element node
	 */
	static isElement(node: unknown): node is Element {
		if (!Dom.isNode(node)) {
			return false;
		}

		const win = node.ownerDocument?.defaultView;

		return Boolean(win && node.nodeType === Node.ELEMENT_NODE);
	}

	/**
	 * Check if element is HTMLElement node
	 */
	static isHTMLElement(node: unknown): node is HTMLElement {
		if (!Dom.isNode(node)) {
			return false;
		}

		const win = node.ownerDocument?.defaultView;

		return Boolean(win && node instanceof win.HTMLElement);
	}

	/**
	 * Check element is inline block
	 */
	static isInlineBlock(node: Node | null | false): node is HTMLElement {
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
	static canSplitBlock(node: unknown): boolean {
		return (
			!isVoid(node) &&
			Dom.isHTMLElement(node) &&
			Dom.isBlock(node) &&
			!/^(TD|TH|CAPTION|FORM)$/.test(node.nodeName) &&
			node.style !== undefined &&
			!/^(fixed|absolute)/i.test(node.style.position)
		);
	}

	/**
	 * Get last matched node inside root
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
	 */
	static prev<T extends Node = Node>(
		node: Node,
		condition: NodeCondition,
		root: HTMLElement,
		withChild: boolean = true
	): Nullable<T> {
		return Dom.find<T>(node, condition, root, false, withChild);
	}

	/**
	 * Find next node what `condition(next) === true`
	 */
	static next<T extends Node = Node>(
		node: Node,
		condition: NodeCondition,
		root: HTMLElement,
		withChild: boolean = true
	): Nullable<T> {
		return Dom.find<T>(node, condition, root, true, withChild);
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
	 */
	static find<T extends Node = Node>(
		node: Node,
		condition: NodeCondition,
		root: HTMLElement,
		leftToRight: boolean = true,
		withChild: boolean = true
	): Nullable<T> {
		const gen = this.nextGen(node, root, leftToRight, withChild);

		let item = gen.next();

		while (!item.done) {
			if (condition(item.value)) {
				return <T>item.value;
			}

			item = gen.next();
		}

		return null;
	}

	/**
	 * Find next/prev node what `condition(next) === true`
	 */
	static *nextGen(
		start: Node,
		root: HTMLElement,
		leftToRight: boolean = true,
		withChild: boolean = true
	): Generator<Node> {
		const stack: Node[] = [];

		let currentNode = start;

		do {
			let next = leftToRight
				? currentNode.nextSibling
				: currentNode.previousSibling;

			while (next) {
				stack.unshift(next);
				next = leftToRight ? next.nextSibling : next.previousSibling;
			}

			yield* this.runInStack(start, stack, leftToRight, withChild);

			currentNode = <Node>currentNode.parentNode;
		} while (currentNode !== root);

		return null;
	}

	/**
	 * It goes through all the internal elements of the node, causing a callback function
	 *
	 * @param elm - the element whose children and descendants you want to iterate over
	 * @param callback - It called for each item found
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
		elm: Node,
		callback: (node: Node) => void | boolean,
		leftToRight: boolean = true
	): boolean {
		const gen = this.eachGen(elm, leftToRight);

		let item = gen.next();

		while (!item.done) {
			if (callback(item.value) === false) {
				return false;
			}

			item = gen.next();
		}

		return true;
	}

	static eachGen(root: Node, leftToRight: boolean = true): Generator<Node> {
		return this.runInStack(root, [root], leftToRight);
	}

	private static *runInStack(
		start: Node,
		stack: Node[],
		leftToRight: boolean,
		withChild: boolean = true
	): Generator<Node> {
		while (stack.length) {
			const item = <Node>stack.pop();

			if (start !== item) {
				yield item;
			}

			if (withChild) {
				let child = leftToRight ? item.lastChild : item.firstChild;

				while (child) {
					stack.push(child);
					child = leftToRight
						? child.previousSibling
						: child.nextSibling;
				}
			}
		}
	}

	/**
	 * Find next/prev node what `condition(next) === true`
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
	 * Get not empty sibling
	 */
	static findSibling(
		node: Node,
		left: boolean = true,
		cond: (n: Node) => boolean = (n: Node) => !Dom.isEmptyTextNode(n)
	): Nullable<Node> {
		const getSibling = (node: Node): Nullable<Node> =>
			left ? node.previousSibling : node.nextSibling;

		let start = getSibling(node);

		while (start && !cond(start)) {
			start = getSibling(start);
		}

		return start && cond(start) ? start : null;
	}

	/**
	 * It goes through all the elements in ascending order, and checks to see if they meet the predetermined condition
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
	 */
	static prepend(root: Node, newElement: Node | DocumentFragment): void {
		root.insertBefore(newElement, root.firstChild);
	}

	/**
	 * Insert newElement as last child inside element
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
	 */
	static safeRemove(node: Node | false | null | void): void {
		node && node.parentNode && node.parentNode.removeChild(node);
	}

	/**
	 * Hide element
	 */
	static hide(node: Nullable<HTMLElement>): void {
		if (!node) {
			return;
		}

		dataBind(node, '__old_display', node.style.display);
		node.style.display = 'none';
	}

	/**
	 * Show element
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

	/**
	 * Marks an item as temporary
	 */
	static markTemporary<K extends HTMLElement>(
		element: K,
		attributes?: IDictionary
	): K {
		attributes && attr(element, attributes);
		attr(element, TEMP_ATTR, true);
		return element;
	}

	/**
	 * Check if element is temporary
	 */
	static isTemporary(element: unknown): boolean {
		if (!Dom.isElement(element)) {
			return false;
		}

		return Select.isMarker(element) || attr(element, TEMP_ATTR) === 'true';
	}

	/**
	 * Replace temporary elements from string
	 */
	static replaceTemporaryFromString(value: string): string {
		return value.replace(
			/<([a-z]+)[^>]+data-jodit-temp[^>]+>(.+?)<\/\1>/gi,
			'$2'
		);
	}

	/**
	 * Get temporary list
	 */
	static temporaryList(root: HTMLElement): HTMLElement[] {
		return $$(`[${TEMP_ATTR}]`, root);
	}
}
