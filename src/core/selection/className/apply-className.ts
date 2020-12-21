/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import autobind from 'autobind-decorator';

import { CanUndef, IJodit, ClassNameValue, markerInfo, Nullable } from '../../../types';
import { Dom } from '../../dom';
import {
	attr,
	classlist,
	normalizeNode,
	trim
} from '../../helpers';
import { ClassName } from './className';

enum mode {
	UNWRAP = 'UNWRAP',
	WRAP = 'WRAP'
}

/**
 * @see [[Select.prototype.applyClassName]]
 */
export class ApplyClassName {
	constructor(readonly jodit: IJodit, readonly className: ClassName) {}

	/**
	 * Apply options to selection
	 */
	apply(): void {
		const sel = this.jodit.selection;

		let selInfo: markerInfo[] = [];

		const isCollapsed = sel.isCollapsed();

		if (isCollapsed) {
			const font = this.jodit.createInside.element('font');
			sel.insertNode(font, false, false);
			sel.setCursorIn(font);
			selInfo = sel.save();
			this.applyToElement(font);
			Dom.unwrap(font);
		} else {
			selInfo = sel.save();
			normalizeNode(sel.area.firstChild); // FF fix for test "commandsTest - Exec command "bold"

			// for some text that contains a few STRONG elements, should unwrap all of these"
			sel.wrapInTag(this.applyToElement);
		}

		sel.restore(selInfo);
	}

	/**
	 * Mode WRAP or UNWRAP
	 */
	private mode: CanUndef<keyof typeof mode>;

	/**
	 * Apply options to all selected fragment
	 * @param font
	 */
	@autobind
	private applyToElement(font: HTMLElement): void {
		const { area } = this.jodit.selection;

		if (
			this.checkSuitableParent(font) ||
			this.checkSuitableChild(font) ||
			this.checkClosestWrapper(font) ||
			this.unwrapChildren(font)
		) {
			return;
		}

		if (!this.mode) {
			this.mode = mode.WRAP;
		}

		if (this.mode !== mode.WRAP) {
			return;
		}

		let wrapper = font;

		if (this.className.elementIsBlock) {
			const ulReg = /^(ul|ol|li|td|th|tr|tbody|table)$/i;

			const box = Dom.up(
				font,
				node => {
					if (node && Dom.isBlock(node, this.jodit.s.win)) {
						if (
							ulReg.test(this.className.element) ||
							!ulReg.test(node.nodeName)
						) {
							return true;
						}
					}

					return false;
				},
				area
			);

			if (box) {
				wrapper = box;
			} else {
				wrapper = this.wrapUnwrappedText(font);
			}
		}

		const newWrapper = Dom.replace(
			wrapper,
			this.className.element,
			this.jodit.createInside
		);

		if (this.className.elementIsBlock) {
			this.postProcessListElement(newWrapper);
		}

		if (this.className.options.className && this.className.elementIsDefault) {
			classlist(newWrapper, this.className.options.className);
		}
	}

	private checkSuitableParent(font: HTMLElement): boolean {
		const { parentNode } = font;

		if (
			parentNode &&
			!Dom.next(font, this.isNormalNode, parentNode) &&
			!Dom.prev(font, this.isNormalNode, parentNode) &&
			this.isSuitableElement(parentNode, false) &&
			parentNode !== this.jodit.s.area &&
			(!Dom.isBlock(parentNode, this.jodit.ew) ||
				this.className.elementIsBlock)
		) {
			this.toggleClassNames(parentNode);
			return true;
		}

		return false;
	}

	/**
	 * Check suitable first child
	 *
	 * @param font
	 * @example
	 * `<font><strong>selected</strong></font>`
	 */
	private checkSuitableChild(font: HTMLElement): boolean {
		let { firstChild } = font;

		if (firstChild && this.jodit.s.isMarker(firstChild as HTMLElement)) {
			firstChild = firstChild.nextSibling;
		}

		if (
			firstChild &&
			!Dom.next(firstChild, this.isNormalNode, font) &&
			!Dom.prev(firstChild, this.isNormalNode, font) &&
			this.isSuitableElement(firstChild, false)
		) {
			this.toggleClassNames(firstChild);
			return true;
		}

		return false;
	}

	/**
	 * Check closest suitable wrapper element
	 *
	 * @param font
	 * @example
	 * `<strong><span>zxc<font>selected</font>dfdsf</span></strong>`
	 */
	private checkClosestWrapper(font: HTMLElement): boolean {
		const wrapper = Dom.closest(
			font,
			this.isSuitableElement,
			this.jodit.editor
		);

		if (wrapper) {
			if (this.className.elementIsBlock) {
				this.toggleClassNames(wrapper);
				return true;
			}

			const leftRange = this.jodit.s.createRange();

			leftRange.setStartBefore(wrapper);
			leftRange.setEndBefore(font);

			const leftFragment = leftRange.extractContents();

			if (
				(!leftFragment.textContent ||
					!trim(leftFragment.textContent).length) &&
				leftFragment.firstChild
			) {
				Dom.unwrap(leftFragment.firstChild);
			}

			if (wrapper.parentNode) {
				wrapper.parentNode.insertBefore(leftFragment, wrapper);
			}

			leftRange.setStartAfter(font);
			leftRange.setEndAfter(wrapper);

			const rightFragment = leftRange.extractContents();

			// case then marker can be inside fragnment
			if (
				(!rightFragment.textContent ||
					!trim(rightFragment.textContent).length) &&
				rightFragment.firstChild
			) {
				Dom.unwrap(rightFragment.firstChild);
			}

			Dom.after(wrapper, rightFragment);

			this.toggleClassNames(wrapper);

			return true;
		}

		return false;
	}

	/**
	 * Element has all classNames
	 * @param elm
	 * @param [classNames]
	 */
	private elementHasSameClassName(elm: Node, classNames: CanUndef<ClassNameValue>): boolean {
		return Boolean(
			!Dom.isTag(elm, 'font') &&
				Dom.isHTMLElement(elm, this.jodit.ew) &&
				elm.classList.contains (classNames as string)
		);
	}

	/**
	 * This element is suitable for options
	 *
	 * @param elm
	 * @param strict
	 */
	@autobind
	isSuitableElement(
		elm: Nullable<Node>,
		strict: boolean = true
	): elm is HTMLElement {
		if (!elm) {
			return false;
		}

		const { element, elementIsDefault, options } = this.className;

		const elmHasSameClassName = this.elementHasSameClassName(elm, options.className);
		const elmIsSame = elm.nodeName.toLowerCase() === element;

		return (
			((!elementIsDefault || !strict) && elmIsSame) ||
			(elmHasSameClassName && this.isNormalNode(elm))
		);
	}

	/**
	 * Is normal usual element
	 * @param elm
	 */
	@autobind
	private isNormalNode(elm: Nullable<Node>): boolean {
		return Boolean(
			elm !== null &&
				!Dom.isEmptyTextNode(elm) &&
				!this.jodit.s.isMarker(elm as HTMLElement)
		);
	}

	/**
	 * Add or remove className to element
	 * @param elm
	 */
	private toggleClassNames(elm: HTMLElement): void {
		const { className } = this.className.options;

		// toggle classNames
		if (className && elm.nodeName.toLowerCase() === this.className.defaultTag) {
			if (
				this.mode === mode.UNWRAP ||
				elm.classList.contains(className)
			) {
				elm.classList.remove(className)

				if (this.mode === undefined) {
					this.mode = mode.UNWRAP;
				}
			} else {
				elm.classList.add(className)

				if (this.mode === undefined) {
					this.mode = mode.WRAP;
				}
			}
		}

		const isBlock = Dom.isBlock(elm, this.jodit.ew);

		const isSuitableInline =
			!isBlock &&
			(!attr(elm, 'class') ||
				elm.nodeName.toLowerCase() !== this.className.defaultTag);

		const isSuitableBlock =
			!isSuitableInline &&
			isBlock &&
			elm.nodeName.toLowerCase() === this.className.element;

		if (isSuitableInline || isSuitableBlock) {
			// toggle `<strong>test</strong>` toWYSIWYG `test`, and
			// `<span style="">test</span>` toWYSIWYG `test`
			Dom.unwrap(elm);

			if (this.mode === undefined) {
				this.mode = mode.UNWRAP;
			}
		}
	}

	/**
	 * Unwrap all suit elements inside
	 * @param font
	 */
	private unwrapChildren(font: HTMLElement): boolean {
		const needUnwrap: Node[] = [];
		let firstElementSuit: boolean | undefined;

		if (font.firstChild) {
			Dom.find(
				font.firstChild,
				(elm: Node | null) => {
					if (elm && this.isSuitableElement(elm as HTMLElement)) {
						if (firstElementSuit === undefined) {
							firstElementSuit = true;
						}

						needUnwrap.push(elm);
					} else {
						if (firstElementSuit === undefined) {
							firstElementSuit = false;
						}
					}

					return false;
				},
				font,
				true
			);
		}

		needUnwrap.forEach(Dom.unwrap);

		return Boolean(firstElementSuit);
	}

	/**
	 * Wrap text or inline elements inside Block element
	 * @param elm
	 */
	private wrapUnwrappedText(elm: Node): HTMLElement {
		const { area, win } = this.jodit.selection;

		const edge = (n: Node, key: keyof Node = 'previousSibling') => {
			let edgeNode: Node = n,
				node: Nullable<Node> = n;

			while (node) {
				edgeNode = node;

				if (node[key]) {
					node = node[key] as Nullable<Node>;
				} else {
					node =
						node.parentNode &&
						!Dom.isBlock(node.parentNode, win) &&
						node.parentNode !== area
							? node.parentNode
							: null;
				}

				if (Dom.isBlock(node, win)) {
					break;
				}
			}

			return edgeNode;
		};

		const start: Node = edge(elm),
			end: Node = edge(elm, 'nextSibling');

		const range = this.jodit.s.createRange();
		range.setStartBefore(start);
		range.setEndAfter(end);
		const fragment = range.extractContents();

		const wrapper = this.jodit.createInside.element(this.className.element);
		wrapper.appendChild(fragment);
		range.insertNode(wrapper);

		if (this.className.elementIsBlock) {
			this.postProcessListElement(wrapper);

			if (
				Dom.isEmpty(wrapper) &&
				!Dom.isTag(wrapper.firstElementChild, 'br')
			) {
				wrapper.appendChild(this.jodit.createInside.element('br'));
			}
		}

		return wrapper;
	}

	/**
	 * Post process UL or OL element
	 * @param wrapper
	 */
	private postProcessListElement(wrapper: HTMLElement): void {
		// Add extra LI inside UL/OL
		if (
			/^(OL|UL)$/i.test(this.className.element) &&
			!Dom.isTag(wrapper.firstElementChild, 'li')
		) {
			const li = Dom.replace(wrapper, 'li', this.jodit.createInside);
			const ul = Dom.wrap(li, this.className.element, this.jodit);

			if (ul) {
				wrapper = ul;
			}
		}
	}
}
