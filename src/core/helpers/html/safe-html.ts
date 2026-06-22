/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/html
 */

import { Dom } from 'jodit/core/dom/dom';
import { attr } from 'jodit/core/helpers/utils';

export type safeOptions = {
	removeOnError: boolean;
	safeJavaScriptLink: boolean;
	removeEventAttributes?: boolean;
	safeLinksTarget?: boolean;
};

const HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';

/**
 * Integration points where HTML is legitimately allowed inside MathML/SVG foreign content.
 */
const HTML_INTEGRATION_POINTS = new Set([
	'foreignobject',
	'annotation-xml',
	'desc',
	'title'
]);

/**
 * True for an HTML element the parser placed inside MathML/SVG outside an integration point - smuggled
 * HTML (e.g. `mglyph` / `style` under `<math>`) that a reparse can hoist into a live node. Legitimate
 * MathML/SVG children and HTML below an integration point are kept.
 */
function isSmuggledForeignHtml(elm: Element): boolean {
	if (elm.namespaceURI !== HTML_NAMESPACE || elm.closest('math,svg') === null) {
		return false;
	}

	for (let parent = elm.parentElement; parent; parent = parent.parentElement) {
		const name = parent.nodeName.toLowerCase();

		if (name === 'math' || name === 'svg') {
			break;
		}

		if (HTML_INTEGRATION_POINTS.has(name)) {
			return false;
		}
	}

	return true;
}

/**
 * Removes dangerous constructs from HTML
 */
export function safeHTML(
	box: HTMLElement | DocumentFragment,
	options: safeOptions
): void {
	if (!Dom.isElement(box) && !Dom.isFragment(box)) {
		return;
	}

	// Drop HTML smuggled into MathML/SVG before the walk: a reparse would otherwise hoist its hidden
	// markup into a live node.
	const foreign = box.querySelectorAll('math *, svg *');

	for (let i = 0; i < foreign.length; i++) {
		if (foreign[i].isConnected && isSmuggledForeignHtml(foreign[i])) {
			Dom.safeRemove(foreign[i]);
		}
	}

	const removeEvents = options.removeEventAttributes ?? options.removeOnError;

	// Single synchronous traversal of the subtree. Besides removing event
	// handlers and `javascript:` links, `sanitizeHTMLElement` neutralises
	// executable `iframe[srcdoc]`, `data:text/html` / SVG `data:` document
	// sources and dangerous schemes in every URL-bearing attribute.
	const process = (node: Node): void => {
		if (!Dom.isElement(node)) {
			return;
		}

		if (removeEvents) {
			removeAllEventAttributes(node);
		}

		sanitizeHTMLElement(node, options);

		if (
			options.safeLinksTarget &&
			node.nodeName === 'A' &&
			node.getAttribute('target') === '_blank'
		) {
			const rel = node.getAttribute('rel') || '';
			const parts = rel.split(/\s+/).filter(Boolean);

			if (!parts.includes('noopener')) {
				parts.push('noopener');
			}

			if (!parts.includes('noreferrer')) {
				parts.push('noreferrer');
			}

			attr(node, 'rel', parts.join(' '));
		}
	};

	process(box);
	Dom.each(box, process);
}

/**
 * Remove all on* event handler attributes from an element
 */
function removeAllEventAttributes(elm: Element | DocumentFragment): boolean {
	if (!Dom.isElement(elm)) {
		return false;
	}

	let effected = false;
	const toRemove: string[] = [];

	for (let i = 0; i < elm.attributes.length; i++) {
		if (elm.attributes[i].name.toLowerCase().startsWith('on')) {
			toRemove.push(elm.attributes[i].name);
		}
	}

	for (const name of toRemove) {
		elm.removeAttribute(name);
		effected = true;
	}

	return effected;
}

/**
 * URL-bearing attributes (besides `href`) that can load or execute content.
 */
const URL_ATTRIBUTES = [
	'src',
	'data',
	'action',
	'formaction',
	'poster',
	'background',
	'xlink:href'
];

/**
 * Tags that load their URL as a *document* (scripts inside run). An SVG data
 * URL is only an XSS vector here — as an `<img>` source it renders inertly.
 */
const DOCUMENT_EMBED_TAGS = new Set(['iframe', 'frame', 'object', 'embed']);

/**
 * Detects executable / script-bearing URL schemes. The attribute value is
 * already HTML-entity-decoded by `getAttribute`, so only whitespace and
 * control characters (which browsers ignore inside a scheme) need stripping.
 */
function isDangerousUrl(value: string, tagName: string): boolean {
	// eslint-disable-next-line no-control-regex
	const normalized = value.replace(/[\u0000-\u0020]+/g, '').toLowerCase();

	if (/^(?:javascript|vbscript|livescript|mocha):/.test(normalized)) {
		return true;
	}

	if (/^data:(?:text\/html|application\/xhtml)/.test(normalized)) {
		return true;
	}

	return (
		/^data:image\/svg/.test(normalized) && DOCUMENT_EMBED_TAGS.has(tagName)
	);
}

export function sanitizeHTMLElement(
	elm: Element | DocumentFragment,
	{ safeJavaScriptLink, removeOnError }: safeOptions = {
		safeJavaScriptLink: true,
		removeOnError: true
	}
): boolean {
	if (!Dom.isElement(elm)) {
		return false;
	}

	let effected = false;

	if (removeOnError && elm.hasAttribute('onerror')) {
		attr(elm, 'onerror', null);
		effected = true;
	}

	const href = elm.getAttribute('href');

	if (safeJavaScriptLink && href && href.trim().indexOf('javascript') === 0) {
		attr(elm, 'href', location.protocol + '//' + href);
		effected = true;
	}

	if (safeJavaScriptLink) {
		// `srcdoc` runs its content as a full HTML document — drop it entirely.
		if (elm.hasAttribute('srcdoc')) {
			attr(elm, 'srcdoc', null);
			effected = true;
		}

		// Strip executable schemes from any other URL-bearing attribute.
		const tagName = elm.nodeName.toLowerCase();

		for (const name of URL_ATTRIBUTES) {
			const value = elm.getAttribute(name);

			if (value && isDangerousUrl(value, tagName)) {
				attr(elm, name, null);
				effected = true;
			}
		}
	}

	return effected;
}
