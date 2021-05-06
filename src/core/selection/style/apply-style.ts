/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { CanUndef, IJodit, IStyle, Nullable } from '../../../types';
import type { Style } from './style';
import { isPlainObject, isVoid } from '../../helpers/checker';
import { Dom } from '../../dom';
import {
	attr,
	css,
	each,
	normalizeCssValue,
	normalizeNode,
	trim
} from '../../helpers';
import { autobind } from '../../decorators';

enum mode {
	UNWRAP = 'UNWRAP',
	WRAP = 'WRAP'
}

/**
 * @see [[Select.prototype.applyStyle]]
 */
export class ApplyStyle {
	constructor(readonly jodit: IJodit, readonly style: Style) {}

	/**
	 * Apply options to selection
	 */
	apply(): void {
		const sel = this.jodit.selection;

		const isCollapsed = sel.isCollapsed();

		if (isCollapsed) {
			const font = this.jodit.createInside.element('font');
			sel.insertNode(font, false, false);
			sel.setCursorIn(font);
			sel.save();

			if (!this.checkSpecialElements(font)) {
				this.applyToElement(font);
			}

			Dom.unwrap(font);
		} else {
			sel.save();
			normalizeNode(sel.area.firstChild); // FF fix for test "commandsTest - Exec command "bold"

			// for some text that contains a few STRONG elements, should unwrap all of these"
			sel.wrapInTag(this.applyToElement);
		}

		sel.restore();
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

		if (this.checkSpecialElements(font)) {
			return;
		}

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

		if (this.style.elementIsBlock) {
			const ulReg = /^(ul|ol|li|td|th|tr|tbody|table)$/i;

			const box = Dom.up(
				font,
				node => {
					if (node && Dom.isBlock(node, this.jodit.s.win)) {
						if (
							ulReg.test(this.style.element) ||
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
			this.style.element,
			this.jodit.createInside,
			true
		);

		attr(newWrapper, 'size', null);

		if (this.style.elementIsBlock) {
			this.postProcessListElement(newWrapper);
		}

		if (this.style.options.style && this.style.elementIsDefault) {
			css(newWrapper, this.style.options.style);
		}

		if (this.style.options.className) {
			newWrapper.classList.toggle(this.style.options.className);
		}
	}

	/**
	 * Check if FONT inside STYLE or SCRIPT element
	 * @param font
	 */
	private checkSpecialElements(font: HTMLElement): boolean {
		const { editor } = this.jodit;

		return Boolean(Dom.closest(font, ['style', 'script'], editor));
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
				this.style.elementIsBlock)
		) {
			this.toggleStyles(parentNode);
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
			this.toggleStyles(firstChild);
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
			if (this.style.elementIsBlock) {
				this.toggleStyles(wrapper);
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

			this.toggleStyles(wrapper);

			return true;
		}

		return false;
	}

	/**
	 * Element has all rules
	 * @param elm
	 * @param [rules]
	 */
	private elementHasSameStyle(elm: Node, rules: CanUndef<IStyle>): boolean {
		return Boolean(
			isPlainObject(rules) &&
				!Dom.isTag(elm, 'font') &&
				Dom.isHTMLElement(elm, this.jodit.ew) &&
				each(rules, (property, checkValue) => {
					const value = css(elm, property, undefined, true);

					return (
						!isVoid(value) &&
						value !== '' &&
						!isVoid(checkValue) &&
						normalizeCssValue(property, checkValue)
							.toString()
							.toLowerCase() === value.toString().toLowerCase()
					);
				})
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

		const { element, elementIsDefault, options } = this.style;

		const elmHasSameStyle = this.elementHasSameStyle(elm, options.style);
		const elmIsSame = elm.nodeName.toLowerCase() === element;

		return (
			((!elementIsDefault || !strict) && elmIsSame) ||
			(elmHasSameStyle && this.isNormalNode(elm))
		);
	}

	/**
	 * Is normal usual element
	 * @param elm
	 */
	@autobind
	private isNormalNode(elm: Nullable<Node>): boolean {
		return Boolean(
			elm != null &&
				!Dom.isEmptyTextNode(elm) &&
				!this.jodit.s.isMarker(elm as HTMLElement)
		);
	}

	/**
	 * Add or remove styles to element
	 * @param elm
	 */
	private toggleStyles(elm: HTMLElement): void {
		const { style } = this.style.options;

		// toggle CSS rules
		if (style && elm.nodeName.toLowerCase() === this.style.defaultTag) {
			Object.keys(style).forEach(rule => {
				if (
					this.mode === mode.UNWRAP ||
					css(elm, rule) ===
						normalizeCssValue(rule, style[rule] as string)
				) {
					css(elm, rule, '');

					if (this.mode === undefined) {
						this.mode = mode.UNWRAP;
					}
				} else {
					css(elm, rule, style[rule]);

					if (this.mode === undefined) {
						this.mode = mode.WRAP;
					}
				}
			});
		}

		const isBlock = Dom.isBlock(elm, this.jodit.ew);

		const isSuitableInline =
			!isBlock &&
			(!attr(elm, 'style') ||
				elm.nodeName.toLowerCase() !== this.style.defaultTag);

		const isSuitableBlock =
			!isSuitableInline &&
			isBlock &&
			elm.nodeName.toLowerCase() === this.style.element;

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

		const wrapper = this.jodit.createInside.element(this.style.element);
		wrapper.appendChild(fragment);
		range.insertNode(wrapper);

		if (this.style.elementIsBlock) {
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
			/^(OL|UL)$/i.test(this.style.element) &&
			!Dom.isTag(wrapper.firstElementChild, 'li')
		) {
			const ci = this.jodit.createInside;

			const li = Dom.replace(wrapper, 'li', ci),
				ul = Dom.wrap(li, this.style.element, ci);

			if (ul) {
				wrapper = ul;
			}
		}
	}
}
