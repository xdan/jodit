/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import {
	IDictionary,
	IJodit,
	Attributes,
	Children,
	ICreate,
	IPanel
} from '../types';

import {
	isPlainObject,
	each,
	asArray,
	css,
	isFunction,
	isJoditObject,
	kebabCase,
	refs
} from './helpers/';

import { Dom } from './dom';
import { cache } from './decorators';

export class Create implements ICreate {
	inside!: Create;

	@cache
	private get doc(): Document {
		if (!this.j) {
			return document;
		}

		return this.insideCreator && isJoditObject(this.j)
			? this.j.editorDocument
			: this.j.od;
	}

	constructor(
		readonly jodit?: IJodit | IPanel,
		readonly insideCreator: boolean = false
	) {
		if (!insideCreator) {
			this.inside = new Create(jodit, true);
		}
	}

	/**
	 * Short alias for jodit
	 */
	get j(): this['jodit'] {
		return this.jodit;
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

		if (this?.j?.o.direction) {
			const direction = this.j.o.direction.toLowerCase();

			elm.style.direction = direction === 'rtl' ? 'rtl' : 'ltr';
		}

		if (this.j && this.insideCreator) {
			const ca = this.j.o.createAttributes;

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
