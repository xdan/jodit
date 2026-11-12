/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/html
 */

import { globalDocument, IS_PROD } from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom/dom';
import {
	indexOfOpenTag,
	removeWordWrappers
} from 'jodit/core/helpers/html/tag-scan';
import {
	readWordListItems,
	wrapWordListItems
} from 'jodit/core/helpers/html/word-lists';
import { trim } from 'jodit/core/helpers/string/trim';
import { attr } from 'jodit/core/helpers/utils/attr';
import { css } from 'jodit/core/helpers/utils/css';
import { $$ } from 'jodit/core/helpers/utils/selector';

// Drop the `mso-*` and `border*` declarations and turn pt/cm into px; one declaration at a time, so a long value cannot make the regexes backtrack
function normalizeCSS(s: string): string {
	const declarations = s.split(';');
	const last = declarations.length - 1;

	return declarations
		.filter((declaration, index) => {
			const match = /^\s*([a-z-]{1,64})\s*:/i.exec(declaration);

			if (!match) {
				return true;
			}

			const property = match[1].toLowerCase();

			return !(
				property.startsWith('mso-') ||
				(property.startsWith('border') && index !== last)
			);
		})
		.join(';')
		.replace(/([0-9.]{1,32})(pt|cm)/gi, (match, units, metrics) => {
			switch (metrics.toLowerCase()) {
				case 'pt':
					return (parseFloat(units) * 1.328).toFixed(0) + 'px';

				case 'cm':
					return (parseFloat(units) * 0.02645833).toFixed(0) + 'px';
			}

			return match;
		});
}

/**
 * If the HTML has CSS rules with selectors,
 * it applies them to the selectors in the HTML itself
 * and then removes the selector styles, leaving only the inline ones.
 */
export function applyStyles(html: string): string {
	// Match the opening <html> tag whether or not it carries attributes. MS
	// Word emits `<html xmlns:o=…>` (note the trailing space), but Excel/Calc
	// wrap the copied table in a bare `<html>`. The old `'<html '` check missed
	// the bare tag, so for Excel clipboards the `<style>` rules (class-based
	// cell backgrounds/borders, e.g. `.xl31 { background:#FCE4D6 }`) were never
	// inlined and all styling was lost once the `<style>` block got stripped.
	// See https://github.com/xdan/jodit/issues/1362
	const open = indexOfOpenTag(html, 'html');

	if (open === -1) {
		return html;
	}

	html = html.substring(open);

	const closeIndex = html.toLowerCase().lastIndexOf('</html>');

	if (closeIndex !== -1) {
		html = html.substring(0, closeIndex + '</html>'.length);
	}

	const iframe = globalDocument.createElement('iframe');

	css(iframe, 'display', 'none');
	Dom.append(globalDocument.body, iframe);

	let convertedString: string = '',
		collection: HTMLElement[];

	try {
		const iframeDoc: Document | null =
			iframe.contentDocument ||
			(iframe.contentWindow ? iframe.contentWindow.document : null);

		if (iframeDoc) {
			iframeDoc.open();
			iframeDoc.write(html);
			iframeDoc.close();

			const listItems = readWordListItems(iframeDoc.body);

			// Word marks its auto-generated list markers (the literal
			// bullet/number, e.g. `1.` or `·`) with `mso-list:Ignore`.
			// They are display-only and must not be imported, otherwise
			// the marker text leaks into the content. Drop them before any
			// style normalization strips the `mso-list` hint. See #948
			Dom.each(iframeDoc.body, (node: Node) => {
				if (
					Dom.isElement(node) &&
					/mso-list:\s*ignore/i.test(attr(node, 'style') || '')
				) {
					Dom.safeRemove(node);
				}
			});

			try {
				for (let i = 0; i < iframeDoc.styleSheets.length; i += 1) {
					const rules: CSSStyleRule[] = (
						iframeDoc.styleSheets[i] as any
					).cssRules;

					for (let idx = 0; idx < rules.length; idx += 1) {
						if (rules[idx].selectorText === '') {
							continue;
						}

						collection = $$(
							rules[idx].selectorText,
							iframeDoc.body
						);

						// `style.cssText` on purpose: the CSSOM parses the text,
						// drops invalid declarations and re-serializes it. The raw
						// `style` attribute would keep Word-only junk verbatim
						collection.forEach((elm: HTMLElement) => {
							elm.style.cssText = normalizeCSS(
								rules[idx].style.cssText +
									';' +
									elm.style.cssText
							);
						});
					}
				}
			} catch (e) {
				if (!IS_PROD) {
					throw e;
				}
			}

			wrapWordListItems(listItems);

			Dom.each(iframeDoc.body, node => {
				if (Dom.isElement(node)) {
					const cssText = attr(node, 'style');

					if (cssText) {
						(node as HTMLElement).style.cssText =
							normalizeCSS(cssText);
					}

					if (!attr(node, 'style')) {
						attr(node, 'style', null);
					}
				}
			});

			convertedString = iframeDoc.firstChild
				? trim(iframeDoc.body.innerHTML)
				: '';
		}
	} catch {
	} finally {
		Dom.safeRemove(iframe);
	}

	if (convertedString) {
		html = convertedString;
	}

	return trim(removeWordWrappers(html));
}
