/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
	isArray,
	isFunction,
	isHTML,
	isString,
	isVoid
} from 'jodit/core/helpers/checker';
import { asArray, toArray } from 'jodit/core/helpers/array';
import { trim } from 'jodit/core/helpers/string';
import { $$, attr, call, css, dataBind, error } from 'jodit/core/helpers/utils';
import { isMarker } from 'jodit/core/helpers/checker/is-marker';
import { NO_EMPTY_TAGS, TEMP_ATTR } from 'jodit/core/constants';

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

	static wrap<K extends HTMLTagNames>(
		current: Node | Range,
		tag: HTMLElement,
		create: ICreate
	): HTMLElementTagNameMap[K];

	static wrap<K extends HTMLTagNames>(
		current: Node | Range,
		tag: K,
		create: ICreate
	): HTMLElementTagNameMap[K];

	/**
	 * Wrap node inside another node
	 */
	static wrap(
		current: Node | Range,
		tag: HTMLElement | HTMLTagNames,
		create: ICreate
	): HTMLElement {
		const wrapper = isString(tag) ? create.element(tag) : tag;

		if (Dom.isNode(current)) {
			if (!current.parentNode) {
				throw error('Element should be in DOM');
			}

			current.parentNode.insertBefore(wrapper, current);
			wrapper.appendChild(current);
		} else {
			const fragment = current.extractContents();
			current.insertNode(wrapper);
			wrapper.appendChild(fragment);
		}

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
	 * Call functions for all nodes between `start` and `end`
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
	static replace<T extends HTMLElement>(
		elm: Node,
		newTagName: HTMLTagNames,
		create: ICreate,
		withAttributes?: boolean,
		notMoveContent?: boolean
	): T;
	static replace<T extends Node>(
		elm: Node,
		newTagName: T | string,
		create: ICreate,
		withAttributes?: boolean,
		notMoveContent?: boolean
	): T;
	static replace<T extends Node>(
		elm: Node,
		newTagName: HTMLTagNames | T | string,
		create: ICreate,
		withAttributes = false,
		notMoveContent = false
	): T {
		if (isHTML(newTagName)) {
			newTagName = create.fromHTML(newTagName) as unknown as T;
		}

		const tag = isString(newTagName)
			? create.element(newTagName)
			: newTagName;

		if (!notMoveContent) {
			while (elm.firstChild) {
				tag.appendChild(elm.firstChild);
			}
		}

		if (withAttributes && Dom.isElement(elm) && Dom.isElement(tag)) {
			toArray(elm.attributes).forEach(attr => {
				tag.setAttribute(attr.name, attr.value);
			});
		}

		if (elm.parentNode) {
			elm.parentNode.replaceChild(tag, elm);
		}

		return tag as T;
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
		condNoEmptyElement: (node: Element) => boolean
	): boolean;
	static isEmpty(node: Node, noEmptyTags?: Set<string>): boolean;
	static isEmpty(
		node: Node,
		condNoEmptyElement:
			| ((elm: Element) => boolean)
			| Set<string> = NO_EMPTY_TAGS
	): boolean {
		if (!node) {
			return true;
		}

		let cond: (elm: Element) => boolean;

		if (!isFunction(condNoEmptyElement)) {
			cond = (elm: Node): boolean =>
				condNoEmptyElement.has(elm.nodeName.toLowerCase());
		} else {
			cond = condNoEmptyElement;
		}

		const emptyText = (node: Text): boolean =>
			node.nodeValue == null || trim(node.nodeValue).length === 0;

		if (Dom.isText(node)) {
			return emptyText(node);
		}

		return (
			!(Dom.isElement(node) && cond(node)) &&
			Dom.each(node as HTMLElement, (elm: Node | null): false | void => {
				if (
					(Dom.isText(elm) && !emptyText(elm)) ||
					(Dom.isElement(elm) && cond(elm))
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
		// Duck-typing
		return Boolean(
			object &&
				isString((object as Node).nodeName) &&
				typeof (object as Node).nodeType === 'number' &&
				(object as Node).childNodes &&
				isFunction((object as Node).appendChild)
		);
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
	 * Check if element is document fragment
	 */
	static isFragment(node: unknown): node is DocumentFragment {
		if (!Dom.isNode(node)) {
			return false;
		}

		const win = node.ownerDocument?.defaultView;

		return Boolean(win && node.nodeType === Node.DOCUMENT_FRAGMENT_NODE);
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

		let currentNode: Nullable<Node> = start;

		do {
			let next = leftToRight
				? currentNode.nextSibling
				: currentNode.previousSibling;

			while (next) {
				stack.unshift(next);
				next = leftToRight ? next.nextSibling : next.previousSibling;
			}

			yield* this.runInStack(start, stack, leftToRight, withChild);

			currentNode = currentNode.parentNode;
		} while (currentNode && currentNode !== root);

		return null;
	}

	/**
	 * It goes through all the internal elements of the node, causing a callback function
	 *
	 * @param elm - the element whose children and descendants you want to iterate over
	 * @param callback - It called for each item found
	 * @example
	 * ```javascript
	 * Jodit.modules.Dom.each(editor.s.current(), function (node) {
	 *  if (node.nodeType === Node.TEXT_NODE) {
	 *      node.nodeValue = node.nodeValue.replace(Jodit.INVISIBLE_SPACE_REG_EX, '') // remove all of the text element codes invisible character
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

			if (withChild) {
				let child = leftToRight ? item.lastChild : item.firstChild;

				while (child) {
					stack.push(child);
					child = leftToRight
						? child.previousSibling
						: child.nextSibling;
				}
			}

			if (start !== item) {
				yield item;
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
		cond: (n: Node) => boolean = (n: Node): boolean =>
			!Dom.isEmptyTextNode(n)
	): Nullable<Node> {
		let sibling = Dom.sibling(node, left);

		while (sibling && !cond(sibling)) {
			sibling = Dom.sibling(sibling, left);
		}

		return sibling && cond(sibling) ? sibling : null;
	}

	/**
	 * Returns the nearest non-empty sibling
	 */
	static findNotEmptySibling(node: Node, left: boolean): Nullable<Node> {
		return Dom.findSibling(node, left, n => {
			return (
				!Dom.isEmptyTextNode(n) &&
				Boolean(
					!Dom.isText(n) || (n.nodeValue?.length && trim(n.nodeValue))
				)
			);
		});
	}

	/**
	 * Returns the nearest non-empty neighbor
	 */
	static findNotEmptyNeighbor(
		node: Node,
		left: boolean,
		root: HTMLElement
	): Nullable<Node> {
		return call(
			left ? Dom.prev : Dom.next,
			node,
			n =>
				Boolean(
					n && (!Dom.isText(n) || trim(n?.nodeValue || '').length)
				),
			root
		);
	}

	static sibling(node: Node, left?: boolean): Nullable<Node> {
		return left ? node.previousSibling : node.nextSibling;
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

		const lc = (s: string): string => s.toLowerCase();

		if (isFunction(tagsOrCondition)) {
			condition = tagsOrCondition;
		} else if (isArray(tagsOrCondition)) {
			const set = new Set(tagsOrCondition.map(lc));
			condition = (tag: Node | null): boolean =>
				Boolean(tag && set.has(lc(tag.nodeName) as HTMLTagNames));
		} else {
			condition = (tag: Node | null): boolean =>
				Boolean(tag && lc(tagsOrCondition) === lc(tag.nodeName));
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

		while (current && current !== root) {
			if (condition(current)) {
				matchedParent = current;
			}

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
	static moveContent(
		from: Node,
		to: Node,
		inStart: boolean = false,
		filter: (node: Node) => boolean = (): boolean => true
	): void {
		const fragment: DocumentFragment = (
			from.ownerDocument || document
		).createDocumentFragment();

		toArray(from.childNodes)
			.filter(elm => {
				if (filter(elm)) {
					return true;
				}

				Dom.safeRemove(elm);
				return false;
			})
			.forEach((node: Node) => {
				fragment.appendChild(node);
			});

		if (!inStart || !to.firstChild) {
			to.appendChild(fragment);
		} else {
			to.insertBefore(fragment, to.firstChild);
		}
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
	static safeRemove(...nodes: unknown[]): void {
		nodes.forEach(
			node =>
				Dom.isNode(node) &&
				node.parentNode &&
				node.parentNode.removeChild(node)
		);
	}

	static safeInsertNode(range: Range, node: Node): void {
		range.collapsed || range.deleteContents();
		range.insertNode(node);
		range.setStartBefore(node);
		range.collapse(true);

		// https://developer.mozilla.org/en-US/docs/Web/API/Range/insertNode
		// if the new node is to be added to a text Node, that Node is split at the
		// insertion point, and the insertion occurs between the two text nodes.
		[node.nextSibling, node.previousSibling].forEach(
			n => Dom.isText(n) && !n.nodeValue && Dom.safeRemove(n)
		);
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
	static isTag<K extends HTMLTagNames>(
		node: Node | null | undefined | false | EventTarget,
		tagName: K
	): node is HTMLElementTagNameMap[K];

	/**
	 * @deprecated Use Set instead of Array
	 */
	static isTag<K extends HTMLTagNames>(
		node: Node | null | undefined | false | EventTarget,
		tagNames: K[]
	): node is HTMLElementTagNameMap[K];

	static isTag<K extends HTMLTagNames>(
		node: Node | null | undefined | false | EventTarget,
		tagNames: Set<K>
	): node is HTMLElementTagNameMap[K];

	static isTag<K extends HTMLTagNames>(
		node: Node | null | undefined | false | EventTarget,
		tagNames: K[] | K | Set<K>
	): node is HTMLElementTagNameMap[K] {
		if (!this.isElement(node)) {
			return false;
		}

		const nameL = node.tagName.toLowerCase() as K;
		const nameU = node.tagName.toUpperCase() as K;

		if (tagNames instanceof Set) {
			return tagNames.has(nameL) || tagNames.has(nameU);
		}

		const tags = asArray(tagNames).map(s => String(s).toLowerCase());

		for (let i = 0; i < tags.length; i += 1) {
			if (nameL === tags[i] || nameU === tags[i]) {
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

		return isMarker(element) || attr(element, TEMP_ATTR) === 'true';
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
