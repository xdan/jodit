/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/html
 */

import { Dom } from 'jodit/core/dom';
import { trim } from 'jodit/core/helpers/string/trim';
import { toArray } from 'jodit/core/helpers/array/to-array';

/**
 * The method automatically cleans up content from Microsoft Word and other HTML sources to ensure clean, compliant
 * content that matches the look and feel of the site.
 */
export function cleanFromWord(html: string): string {
	if (html.indexOf('<html ') !== -1) {
		html = html.substring(html.indexOf('<html '), html.length);
		html = html.substring(
			0,
			html.lastIndexOf('</html>') + '</html>'.length
		);
	}

	let convertedString: string = '';

	try {
		const div = document.createElement('div');
		div.innerHTML = html;

		const marks: Node[] = [];

		if (div.firstChild) {
			Dom.all(div, node => {
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
								toArray((node as Element).attributes).forEach(
									(attr: Attr) => {
										if (
											[
												'src',
												'href',
												'rel',
												'content'
											].indexOf(
												attr.name.toLowerCase()
											) === -1
										) {
											(node as Element).removeAttribute(
												attr.name
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

		marks.forEach(Dom.safeRemove);

		convertedString = div.innerHTML;
	} catch (e) {}

	if (convertedString) {
		html = convertedString;
	}

	html = html.split(/(\n)/).filter(trim).join('\n');

	return html
		.replace(/<(\/)?(html|colgroup|col|o:p)[^>]*>/g, '')
		.replace(/<!--[^>]*>/g, '');
}
