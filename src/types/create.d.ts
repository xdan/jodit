/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module types
 */

import type { IDictionary } from './types';

export type Attributes = IDictionary<
	| string
	| number
	| boolean
	| undefined
	| IDictionary<string | number | boolean | undefined>
>;
export type Children = string | Array<string | Node> | Node;

interface ICreate {
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
	): HTMLElement;

	div(className?: string, children?: Children): HTMLDivElement;
	div(
		className?: string,
		attributes?: Attributes,
		children?: Children
	): HTMLDivElement;
	div(
		className?: string,
		childrenOrAttributes?: Attributes | Children,
		children?: Children
	): HTMLDivElement;

	sandbox(): HTMLElement;

	span(className?: string, children?: Children): HTMLSpanElement;
	span(
		className?: string,
		attributes?: Attributes,
		children?: Children
	): HTMLSpanElement;
	span(
		className?: string,
		childrenOrAttributes?: Attributes | Children,
		children?: Children
	): HTMLSpanElement;

	a(className?: string, children?: Children): HTMLAnchorElement;
	a(
		className?: string,
		attributes?: Attributes,
		children?: Children
	): HTMLAnchorElement;
	a(
		className?: string,
		childrenOrAttributes?: Attributes | Children,
		children?: Children
	): HTMLAnchorElement;

	/**
	 * Create text node
	 */
	text(value: string): Text;

	/**
	 * Create invisible text node
	 */
	fake(): Text;

	/**
	 * Create HTML Document fragment element
	 */
	fragment(): DocumentFragment;

	/**
	 * Create DOM element from HTML text
	 */
	fromHTML(html: string, refs?: IDictionary<boolean>): HTMLElement;

	/**
	 * Apply to element `createAttributes` options
	 */
	applyCreateAttributes(elm: HTMLElement): void;
}
