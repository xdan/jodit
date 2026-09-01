/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module types
 */

/**
 * Virtual DOM interfaces.
 *
 * A minimal structural subset of the browser DOM: every browser `Node`,
 * `Element`, `HTMLElement`, `Text`, `Document` and `DocumentFragment`
 * satisfies the matching interface below, so they can be passed anywhere
 * these types are expected. The `Dom` module (and the low-level helpers)
 * must rely only on this subset — this is the contract that will let the
 * editor switch to virtual-DOM editing without rewriting the call sites.
 *
 * Keep these interfaces as small as possible: add a member only when the
 * `Dom` module (or `attr`/`css` helpers) really needs it.
 */

/**
 * Minimal subset of the browser `Node`
 */
export interface VNode {
	readonly nodeType: number;
	readonly nodeName: string;
	nodeValue: string | null;
	textContent: string | null;

	readonly parentNode: VNode | null;
	readonly parentElement: VHTMLElement | null;
	readonly firstChild: VNode | null;
	readonly lastChild: VNode | null;
	readonly previousSibling: VNode | null;
	readonly nextSibling: VNode | null;
	readonly childNodes: ArrayLike<VNode>;
	readonly ownerDocument: VDocument | null;

	appendChild(node: VNode): VNode;
	insertBefore(node: VNode, child: VNode | null): VNode;
	removeChild(child: VNode): VNode;
	replaceChild(node: VNode, child: VNode): VNode;
	contains(other: VNode | null): boolean;
}

/**
 * Minimal subset of the browser `Attr`
 */
export interface VAttr {
	readonly name: string;
	readonly value: string;
}

/**
 * Minimal subset of the browser `DOMTokenList`
 */
export interface VTokenList {
	readonly length: number;
	add(...tokens: string[]): void;
	remove(...tokens: string[]): void;
	contains(token: string): boolean;
	toggle(token: string, force?: boolean): boolean;
}

/**
 * Minimal subset of the browser `Element`
 */
export interface VElement extends VNode {
	readonly tagName: string;
	readonly attributes: ArrayLike<VAttr>;
	readonly classList: VTokenList;
	className: string;

	getAttribute(name: string): string | null;
	setAttribute(name: string, value: string): void;
	removeAttribute(name: string): void;
	hasAttribute(name: string): boolean;
}

/**
 * Minimal subset of the browser `CSSStyleDeclaration`
 */
export interface VStyle {
	getPropertyValue(property: string): string;
	setProperty(property: string, value: string | null): void;
	removeProperty(property: string): string;
}

/**
 * Minimal subset of the browser `HTMLElement`
 */
export interface VHTMLElement extends VElement {
	readonly style: VStyle;
}

/**
 * Minimal subset of the browser `Document`. Text nodes and fragments add
 * nothing to `VNode` structurally, so they are typed as `VNode`.
 */
export interface VDocument {
	createElement(tagName: string): VHTMLElement;
	createTextNode(data: string): VNode;
	createDocumentFragment(): VNode;
}
