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
import * as consts from '../../constants';
import autobind from 'autobind-decorator';
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
			sel.insertNode(font);
			sel.setCursorIn(font);
			selInfo = sel.save();
			this.applyToElement(font);
			Dom.safeRemove(font);
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
	 * Apply style to collapsed selection.
	 * In usual case - should append `alternativeTag` or apply rules to `defaultTag`
	 */
	applyToCollapsed(): void {
		const sel = this.jodit.selection;
		const current = sel.current();

		if (!current) {
			return;
		}

		const closest = Dom.closest(
			current,
			n => {
				if (this.isSuitElement(n)) {
					return true;
				}

				if (
					Dom.isBlock(n, this.jodit.editorWindow) &&
					this.style.elementIsBlock
				) {
					return true;
				}

				return false;
			},
			sel.area
		);

		if (closest) {
			return this.applyToCollapsedInSuitableBox(closest);
		}

		let node: Nullable<Node> = null;

		if (this.style.elementIsBlock) {
			this.wrapUnwrappedText(current);
			return;
		}

		// for SPAN - we can use another styled SPAN
		if (this.style.element === this.style.defaultTag) {
			const wrapper = Dom.closest(current, this.style.element, sel.area);

			if (wrapper && Dom.isEmpty(wrapper)) {
				node = wrapper;
			}
		}

		if (!node) {
			node = this.jodit.createInside.element(this.style.element);

			node.appendChild(
				this.jodit.createInside.text(consts.INVISIBLE_SPACE)
			);

			sel.insertNode(node, false, false);
			sel.setCursorIn(node);
		}

		if (
			this.style.element === this.style.defaultTag &&
			this.style.options.style
		) {
			css(node as HTMLElement, this.style.options.style);
		}
	}

	/**
	 * Apply for collapsed selection was inside suitable box
	 * @param closest
	 */
	applyToCollapsedInSuitableBox(closest: HTMLElement): void {
		const sel = this.jodit.selection;

		if (!this.style.elementIsBlock) {
			if (sel.cursorOnTheLeft(closest)) {
				sel.setCursorBefore(closest);
			} else if (sel.cursorOnTheRight(closest)) {
				sel.setCursorAfter(closest);
			} else {
				const left = sel.splitSelection(closest);
				left && sel.setCursorAfter(left);
			}
		}

		// For blocks should only unwrap or wrap selection
		if (this.style.elementIsBlock) {
			const save = sel.save();

			if (closest.nodeName.toLowerCase() === this.style.element) {
				Dom.unwrap(closest);
			} else {
				Dom.replace(
					closest,
					this.style.element,
					this.jodit.createInside
				);
			}

			sel.restore(save);
		}

		return;
	}

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
			const box = Dom.up(
				font,
				node => node && Dom.isBlock(node, this.jodit.selection.win),
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

		css(
			newWrapper,
			this.style.element === this.style.defaultTag
				? this.style.options.style || {}
				: {}
		);
	}

	/**
	 * Check suitable parent node
	 *
	 * @param font
	 * @example
	 * `<strong><font>selected</font></strong>`
	 */
	private checkSuitableParent(font: HTMLElement): boolean {
		const { parentNode } = font;

		if (
			parentNode &&
			!Dom.next(font, this.isNormalNode, parentNode) &&
			!Dom.prev(font, this.isNormalNode, parentNode) &&
			this.isSuitElement(parentNode, false) &&
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
			this.isSuitElement(firstChild, false)
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
			this.isSuitElement,
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
	private elementHasRules(
		elm: HTMLElement,
		rules: CanUndef<IStyle>
	): boolean {
		return Boolean(
			isPlainObject(rules) &&
				!Dom.isTag(elm, 'font') &&
				Dom.isElement(elm) &&
				each(rules, (property, checkValue) => {
					const value = css(elm, property, undefined);

					return (
						!isVoid(value) &&
						value !== '' &&
						!isVoid(checkValue) &&
						checkValue.toString().toLowerCase() ===
							value.toString().toLowerCase()
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
	private isSuitElement(
		elm: Nullable<Node>,
		strict: boolean = true
	): elm is HTMLElement {
		if (!elm) {
			return false;
		}

		return (
			(((this.style.element !== this.style.defaultTag || !strict) &&
				elm.nodeName.toLowerCase() === this.style.element) ||
				this.elementHasRules(
					elm as HTMLElement,
					this.style.options.style
				)) &&
			this.isNormalNode(elm)
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
					if (elm && this.isSuitElement(elm as HTMLElement)) {
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
		const { area } = this.jodit.selection;

		let start: Node = elm,
			end: Node = elm;

		const edge = (clb: (node: Node) => void) => {
			return (node: Nullable<Node>) => {
				if (Dom.isBlock(node, this.jodit.selection.win)) {
					return true;
				}

				if (node) {
					clb(node);
				}

				return false;
			};
		};

		Dom.prev(
			elm,
			edge(n => (start = n)),
			area
		);

		Dom.next(
			elm,
			edge(n => (end = n)),
			area
		);

		const range = this.jodit.selection.createRange();
		range.setStartBefore(start);
		range.setEndAfter(end);
		const fragment = range.extractContents();

		const wrapper = this.jodit.createInside.element(this.style.element);
		wrapper.appendChild(fragment);
		range.insertNode(wrapper);

		return wrapper;
	}
}
