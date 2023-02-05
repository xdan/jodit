/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:core/create/README.md]]
 * @packageDocumentation
 * @module create
 */

import type {
	IDictionary,
	Attributes,
	Children,
	ICreate,
	CanUndef,
	NodeFunction
} from 'jodit/types';

import {
	isPlainObject,
	asArray,
	isFunction,
	refs,
	isString,
	attr
} from 'jodit/core/helpers/';
import { assert } from 'jodit/core/helpers/utils/assert';

import { Dom } from 'jodit/core/dom';
import { INVISIBLE_SPACE } from 'jodit/core/constants';

export class Create implements ICreate {
	private get doc(): Document {
		// @ts-ignore - TODO it's a function
		return isFunction(this.document) ? this.document() : this.document;
	}

	constructor(
		readonly document: Document | (() => Document),
		readonly createAttributes?: CanUndef<
			IDictionary<Attributes | NodeFunction>
		>
	) {}

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
				attr(elm, <IDictionary>childrenOrAttributes);
			} else {
				children = childrenOrAttributes as Children;
			}
		}

		if (children) {
			asArray(children).forEach((child: string | Node) =>
				elm.appendChild(isString(child) ? this.fromHTML(child) : child)
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

	sandbox(): HTMLElement {
		const iframe = this.element('iframe', { sandbox: 'allow-same-origin' });
		this.doc.body.appendChild(iframe);
		const doc = iframe.contentWindow?.document;
		assert(doc, 'iframe.contentWindow.document');

		if (!doc) {
			throw Error('Iframe error');
		}

		doc.open();
		doc.write('<!DOCTYPE html><html><head></head><body></body></html>');
		doc.close();
		return doc.body;
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
	 */
	text(value: string): Text {
		return this.doc.createTextNode(value);
	}

	/**
	 * Create invisible text node
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
	 * @param refsToggleElement - State dictionary in which you can set the visibility of some of the elements
	 * ```js
	 * const editor = Jodit.make('#editor');
	 * editor.createInside.fromHTML(`<div>
	 *   <input name="name" ref="name"/>
	 *   <input name="email" ref="email"/>
	 * </div>`, {
	 *   name: true,
	 *   email: false
	 * });
	 * ```
	 */
	fromHTML(
		html: string | number,
		refsToggleElement?: IDictionary<boolean | void>
	): HTMLElement {
		const div = this.div();

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
	 */
	applyCreateAttributes(elm: HTMLElement): void {
		if (this.createAttributes) {
			const ca = this.createAttributes;

			if (ca && ca[elm.tagName.toLowerCase()]) {
				const attrsOpt = ca[elm.tagName.toLowerCase()];

				if (isFunction(attrsOpt)) {
					attrsOpt(elm);
				} else if (isPlainObject(attrsOpt)) {
					attr(elm, <IDictionary>attrsOpt);
				}
			}
		}
	}
}
