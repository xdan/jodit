/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Dom } from '../../Dom';

/**
 * The method automatically cleans up content from Microsoft Word and other HTML sources to ensure clean, compliant
 * content that matches the look and feel of the site.
 */
export const cleanFromWord = (html: string): string => {
    if (html.indexOf('<html ') !== -1) {
        html = html.substring(html.indexOf('<html '), html.length);
        html = html.substring(
            0,
            html.lastIndexOf('</html>') + '</html>'.length
        );
    }

    let convertedString: string = '';

    try {
        const div: HTMLDivElement = document.createElement('div');
        div.innerHTML = html;

        const marks: Node[] = [];

        if (div.firstChild) {
            Dom.all(div, node => {
                if (!node) {
                    return;
                }
                switch (node.nodeType) {
                    case Node.ELEMENT_NODE:
                        if (node.nodeName === 'FONT') {
                            Dom.unwrap(node);
                        } else {
                            [].slice
                                .call((node as Element).attributes)
                                .forEach((attr: Attr) => {
                                    if (
                                        [
                                            'src',
                                            'href',
                                            'rel',
                                            'content',
                                        ].indexOf(attr.name.toLowerCase()) ===
                                        -1
                                    ) {
                                        (node as Element).removeAttribute(
                                            attr.name
                                        );
                                    }
                                });
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

    return html
        .replace(/<(\/)?(html|colgroup|col|o:p)[^>]*>/g, '')
        .replace(/<!--[^>]*>/g, '');
};