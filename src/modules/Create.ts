/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IDictionary, IJodit, IPanel } from '../types';
import { isPlainObject } from './helpers/checker/isPlainObject';
import { each } from './helpers/each';
import { asArray } from './helpers/array/asArray';
import { Dom } from './Dom';
import { css, isFunction, isJoditObject, refs } from './helpers';
import { Attributes, Children, ICreate } from '../types/create';

export class Create implements ICreate {
	inside!: Create;

	private get doc(): Document {
		return this.insideCreator && isJoditObject(this.jodit)
			? this.jodit.editorDocument
			: this.jodit.ownerDocument;
	}

	constructor(
		readonly jodit: IJodit | IPanel,
		readonly insideCreator: boolean = false
	) {
		if (!insideCreator) {
			this.inside = new Create(jodit, true);
		}
	}

	/**
	 * Apply some object key-value to HTMLElement
	 *
	 * @param elm
	 * @param attrs
	 */
	private applyAttributes = (elm: HTMLElement, attrs: Attributes) => {
		each(attrs, (key: string, value) => {
			if (isPlainObject(value) && key === 'style') {
				css(elm, <IDictionary<string>>value);
			} else {
				elm.setAttribute(key, value.toString());
			}
		});
	};

	element<K extends keyof HTMLElementTagNameMap>(
		tagName: K,
		childrenOrAttributes?: Children
	): HTMLElementTagNameMap[K];
	element<K extends keyof HTMLElementTagNameMap>(
		tagName: K,
		childrenOrAttributes?: Attributes,
		children?: Children
	): HTMLElementTagNameMap[K];
	element(
		tagName: string,
		childrenOrAttributes?: Attributes | Children,
		children?: Children
	): HTMLElement {
		const elm = this.doc.createElement(tagName.toLowerCase());

		if (this.insideCreator) {
			const ca = this.jodit.options.createAttributes;
			if (ca && ca[tagName.toLowerCase()]) {
				const attrs = ca[tagName.toLowerCase()];

				if (isFunction(attrs)) {
					attrs(elm);
				} else if (isPlainObject(attrs)) {
					this.applyAttributes(elm, attrs);
				}
			}
		}

		if (childrenOrAttributes) {
			if (isPlainObject(childrenOrAttributes)) {
				this.applyAttributes(elm, <Attributes>childrenOrAttributes);
			} else {
				children = <Children>childrenOrAttributes;
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
		const div = this.element('div', <any>childrenOrAttributes, children);

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
		const span = this.element('span', <any>childrenOrAttributes, children);

		if (className) {
			span.className = className;
		}

		return span;
	}

	a(
		className?: string,
		childrenOrAttributes?: Attributes,
		children?: Children
	): HTMLSpanElement;
	a(
		className?: string,
		childrenOrAttributes?: Attributes | Children,
		children?: Children
	): HTMLSpanElement {
		const a = this.element('a', <any>childrenOrAttributes, children);

		if (className) {
			a.className = className;
		}

		return a;
	}

	/**
	 * Create text node
	 *
	 * @param value
	 */
	text(value: string): Text {
		return this.doc.createTextNode(value);
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
}
