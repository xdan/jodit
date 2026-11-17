/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/html
 */

import type { HTMLTagNames } from 'jodit/types';
import { globalDocument, PASTE_KEEP_ATTRIBUTES } from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom/dom';
import { toArray } from 'jodit/core/helpers/array/to-array';
import { removeWordWrappers } from 'jodit/core/helpers/html/tag-scan';
import {
	readWordListItems,
	wrapWordListItems
} from 'jodit/core/helpers/html/word-lists';
import { trim } from 'jodit/core/helpers/string/trim';
import { attr, attrRaw } from 'jodit/core/helpers/utils/attr';

/**
 * Google Docs marks bold, italic, underline and strikethrough with styles on
 * spans, where Word uses tags, so they become the tags before the styles go
 */
function formattedSpansToTags(root: HTMLElement): void {
	toArray(root.querySelectorAll<HTMLElement>('span[style]')).forEach(span => {
		const { fontWeight, fontStyle } = span.style;
		const lines =
			span.style.textDecorationLine || span.style.textDecoration;

		const tags = (
			[
				(fontWeight === 'bold' ||
					fontWeight === 'bolder' ||
					parseInt(fontWeight, 10) >= 600) &&
					'strong',
				/^(italic|oblique)/.test(fontStyle) && 'em',
				/underline/.test(lines) && 'u',
				/line-through/.test(lines) && 's'
			] as Array<HTMLTagNames | false>
		).filter((tag): tag is HTMLTagNames => Boolean(tag));

		if (!tags.length) {
			return;
		}

		const elements = tags.map(tag => span.ownerDocument.createElement(tag));

		// The outermost takes the span's attributes, which the cleaning
		// that follows filters as it would the span's
		toArray(span.attributes).forEach(({ name, value }) =>
			elements[0].setAttribute(name, value)
		);

		elements.reduce((parent, child) => parent.appendChild(child));

		const innermost = elements[elements.length - 1];

		while (span.firstChild) {
			innermost.appendChild(span.firstChild);
		}

		Dom.before(span, elements[0]);
		Dom.safeRemove(span);
	});
}

/**
 * Takes `node` out of `format`, which stays around the rest of its content
 */
function liftOut(node: Node, format: HTMLElement): void {
	const range = (node.ownerDocument as Document).createRange();

	const wrap = (): void => {
		if (!range.collapsed) {
			range.surroundContents(format.cloneNode());
		}
	};

	for (let child = node; child !== format; child = child.parentNode as Node) {
		range.selectNodeContents(child.parentNode as Node);
		range.setEndBefore(child);
		wrap();

		range.selectNodeContents(child.parentNode as Node);
		range.setStartAfter(child);
		wrap();
	}

	Dom.unwrap(format);
}

/**
 * An element styled with a normal weight or style comes out of the bold or
 * italic tags around it, which would make it bold or italic once the styles go.
 * CSS can't take an ancestor's underline or strikethrough off, so they have no
 * such reset
 */
function liftOutNormalFormatting(root: HTMLElement): void {
	const liftOutOf = (element: HTMLElement, tags: HTMLTagNames[]): void => {
		let format = Dom.closest(element.parentNode, tags, root);

		while (format) {
			liftOut(element, format);
			format = Dom.closest(element.parentNode, tags, root);
		}
	};

	toArray(root.querySelectorAll<HTMLElement>('[style]')).forEach(element => {
		const { fontWeight, fontStyle } = element.style;

		if (
			fontWeight === 'normal' ||
			fontWeight === 'lighter' ||
			parseInt(fontWeight, 10) < 600
		) {
			liftOutOf(element, ['strong', 'b']);
		}

		if (fontStyle === 'normal') {
			liftOutOf(element, ['em', 'i']);
		}
	});
}

/**
 * The method automatically cleans up content from Microsoft Word and other HTML sources to ensure clean, compliant
 * content that matches the look and feel of the site.
 *
 * @param keepAttributes - The attributes to keep; every other attribute, and every style, is removed
 */
export function cleanFromWord(
	html: string,
	keepAttributes: readonly string[] = PASTE_KEEP_ATTRIBUTES
): string {
	const keep = new Set(keepAttributes.map(name => name.toLowerCase()));

	if (html.indexOf('<html ') !== -1) {
		html = html.substring(html.indexOf('<html '), html.length);
		html = html.substring(
			0,
			html.lastIndexOf('</html>') + '</html>'.length
		);
	}

	let convertedString: string = '';

	try {
		const div = globalDocument.createElement('div');
		div.innerHTML = html;

		const marks: Node[] = [];
		const listItems = readWordListItems(div);

		formattedSpansToTags(div);
		liftOutNormalFormatting(div);

		if (div.firstChild) {
			Dom.each(div, node => {
				if (!node) {
					return;
				}
				switch (node.nodeType) {
					case Node.ELEMENT_NODE:
						switch (node.nodeName) {
							case 'STYLE':
							case 'LINK':
							case 'META':
								marks.push(node);
								break;

							case 'W:SDT':
							case 'W:SDTPR':
							case 'FONT':
								Dom.unwrap(node);
								break;

							default:
								// Word marks its auto-generated list markers
								// (the literal bullet/number, e.g. `1.` or `·`)
								// with `mso-list:Ignore`. They are display-only
								// and must not be imported, otherwise the marker
								// text leaks into the content. See #948
								if (
									/mso-list:\s*ignore/i.test(
										attr(node as Element, 'style') || ''
									)
								) {
									marks.push(node);
									break;
								}

								toArray((node as Element).attributes).forEach(
									(attribute: Attr) => {
										if (
											!keep.has(
												attribute.name.toLowerCase()
											)
										) {
											// `attrRaw`: SVG keeps camelCase names
											// (`viewBox`), `attr()` would kebab-case
											// them and silently skip the removal
											attrRaw(
												node as Element,
												attribute.name,
												null
											);
										}
									}
								);
						}
						break;
					case Node.TEXT_NODE:
						break;
					default:
						marks.push(node);
				}
			});
		}

		Dom.safeRemove.apply(null, marks);
		wrapWordListItems(listItems);

		convertedString = div.innerHTML;
	} catch (e) {}

	if (convertedString) {
		html = convertedString;
	}

	html = html.split(/(\n)/).filter(trim).join('\n');

	return removeWordWrappers(html);
}
