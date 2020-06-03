import autobind from 'autobind-decorator';

import { CanUndef, IJodit, markerInfo, Nullable } from '../../../types';
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
import { IStyle, Style } from './style';

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

		if (this.style.elementIsBlock) {
			const ulReg = /^(ul|ol|li|td|th|tr|tbody|table)$/i;

			const box = Dom.up(
				font,
				node => {
					if (node && Dom.isBlock(node, this.jodit.selection.win)) {
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
			this.jodit.createInside
		);

		if (this.style.options.style && this.style.elementIsDefault) {
			css(newWrapper, this.style.options.style);
		}
	}

	private checkSuitableParent(font: HTMLElement): boolean {
		const { parentNode } = font;

		if (
			parentNode &&
			!Dom.next(font, this.isNormalNode, parentNode) &&
			!Dom.prev(font, this.isNormalNode, parentNode) &&
			this.isSuitableElement(parentNode, false) &&
			parentNode !== this.jodit.selection.area &&
			(!Dom.isBlock(parentNode, this.jodit.editorWindow) ||
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
		const { firstChild } = font;

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

			const leftRange = this.jodit.selection.createRange();

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
	 * @param rules
	 */
	private elementHasSameStyle(elm: Node, rules: CanUndef<IStyle>): boolean {
		return Boolean(
			isPlainObject(rules) &&
				!Dom.isTag(elm, 'font') &&
				Dom.isHTMLElement(elm, this.jodit.editorWindow) &&
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
			elm !== null &&
				!Dom.isEmptyTextNode(elm) &&
				!this.jodit.selection.isMarker(elm as HTMLElement)
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

		const isBlock = Dom.isBlock(elm, this.jodit.editorWindow);

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

		const edge = (elm: Node, key: keyof Node = 'previousSibling') => {
			let edgeNode: Node = elm,
				node: Nullable<Node> = elm;

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

		const range = this.jodit.selection.createRange();
		range.setStartBefore(start);
		range.setEndAfter(end);
		const fragment = range.extractContents();

		let wrapper = this.jodit.createInside.element(this.style.element);
		wrapper.appendChild(fragment);
		range.insertNode(wrapper);

		if (this.style.elementIsBlock) {
			// Add extra LI inside UL/OL
			if (/^(OL|UL)$/i.test(this.style.element)) {
				const li = Dom.replace(wrapper, 'li', this.jodit.createInside);
				const ul = Dom.wrap(li, this.style.element, this.jodit);

				if (ul) {
					wrapper = ul;
				}
			}

			if (Dom.isEmpty(wrapper)) {
				wrapper.appendChild(this.jodit.createInside.element('br'));
			}
		}

		return wrapper;
	}
}
