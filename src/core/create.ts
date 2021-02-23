/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type {
	IDictionary,
	Attributes,
	Children,
	ICreate,
	CanUndef,
	NodeFunction
} from '../types';

import {
	isPlainObject,
	each,
	asArray,
	css,
	isFunction,
	kebabCase,
	refs
} from './helpers/';

import { Dom } from './dom';
import { INVISIBLE_SPACE } from './constants';

export class Create implements ICreate {
	private get doc(): Document {
		return isFunction(this.document) ? this.document() : this.document;
	}

	constructor(
		readonly document: Document | (() => Document),
		readonly createAttributes?: CanUndef<
			IDictionary<Attributes | NodeFunction>
		>
	) {}

	/**
	 * Apply some object key-value to HTMLElement
	 *
	 * @param elm
	 * @param attrs
	 */
	private applyAttributes = (elm: HTMLElement, attrs: Attributes) => {
		each(attrs, (key: string, value) => {
			if (isPlainObject(value) && key === 'style') {
				css(elm, value as IDictionary<string>);
			} else {
				if (key === 'className') {
					key = 'class';
				}

				elm.setAttribute(kebabCase(key), value.toString());
			}
		});
	};

	element<K extends keyof HTMLElementTagNameMap>(
		tagName: K,
		children?: Children
	): HTMLElementTagNameMap[K];
	element<K extends keyof HTMLElementTagNameMap>(
		tagName: K,
		attributes?: Attributes,
		children?: Children
	): HTMLElementTagNameMap[K];
	element(
		tagName: string,
		childrenOrAttributes?: Attributes | Children,
		children?: Children
	): HTMLElement {
		const elm = this.doc.createElement(tagName.toLowerCase());

		this.applyCreateAttributes(elm);

		if (childrenOrAttributes) {
			if (isPlainObject(childrenOrAttributes)) {
				this.applyAttributes(elm, childrenOrAttributes as Attributes);
			} else {
				children = childrenOrAttributes as Children;
			}
		}

		if (children) {
			asArray(children).forEach((child: string | Node) =>
				elm.appendChild(
					typeof child === 'string' ? this.fromHTML(child) : child
				)
			);
		}

		return elm;
	}

	div(className?: string, childrenOrAttributes?: Children): HTMLDivElement;
	div(
		className?: string,
		childrenOrAttributes?: Attributes,
		children?: Children
	): HTMLDivElement;
	div(
		className?: string,
		childrenOrAttributes?: Attributes | Children,
		children?: Children
	): HTMLDivElement {
		const div = this.element('div', childrenOrAttributes as any, children);

		if (className) {
			div.className = className;
		}

		return div;
	}

	span(className?: string, childrenOrAttributes?: Children): HTMLSpanElement;
	span(
		className?: string,
		childrenOrAttributes?: Attributes,
		children?: Children
	): HTMLSpanElement;
	span(
		className?: string,
		childrenOrAttributes?: Attributes | Children,
		children?: Children
	): HTMLSpanElement {
		const span = this.element(
			'span',
			childrenOrAttributes as any,
			children
		);

		if (className) {
			span.className = className;
		}

		return span;
	}

	a(className?: string, children?: Children): HTMLAnchorElement;
	a(
		className?: string,
		childrenOrAttributes?: Attributes,
		children?: Children
	): HTMLAnchorElement;
	a(
		className?: string,
		childrenOrAttributes?: Attributes | Children,
		children?: Children
	): HTMLAnchorElement {
		const a = this.element('a', childrenOrAttributes as any, children);

		if (className) {
			a.className = className;
		}

		return a;
	}

	/**
	 * Create text node
	 * @param value
	 */
	text(value: string): Text {
		return this.doc.createTextNode(value);
	}

	/**
	 * Create invisible text node
	 * @param value
	 */
	fake(): Text {
		return this.text(INVISIBLE_SPACE);
	}

	/**
	 * Create HTML Document fragment element
	 */
	fragment(): DocumentFragment {
		return this.doc.createDocumentFragment();
	}

	/**
	 * Create DOM element from HTML text
	 *
	 * @param html
	 * @param refsToggleElement
	 *
	 * @return HTMLElement
	 */
	fromHTML(
		html: string | number,
		refsToggleElement?: IDictionary<boolean | void>
	): HTMLElement {
		const div: HTMLDivElement = this.div();

		div.innerHTML = html.toString();

		const child: HTMLElement =
			div.firstChild !== div.lastChild || !div.firstChild
				? div
				: (div.firstChild as HTMLElement);

		Dom.safeRemove(child);

		if (refsToggleElement) {
			const refElements = refs(child);

			Object.keys(refsToggleElement).forEach(key => {
				const elm = refElements[key];

				if (elm && refsToggleElement[key] === false) {
					Dom.hide(elm);
				}
			});
		}

		return child;
	}

	/**
	 * Apply to element `createAttributes` options
	 * @param elm
	 */
	applyCreateAttributes(elm: HTMLElement): void {
		if (this.createAttributes) {
			const ca = this.createAttributes;

			if (ca && ca[elm.tagName.toLowerCase()]) {
				const attrs = ca[elm.tagName.toLowerCase()];

				if (isFunction(attrs)) {
					attrs(elm);
				} else if (isPlainObject(attrs)) {
					this.applyAttributes(elm, attrs);
				}
			}
		}
	}
}
