/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Dom } from '../../Dom';
import { $$ } from '../selector';

export const applyStyles = (html: string): string => {
    if (html.indexOf('<html ') === -1) {
        return html;
    }

    html = html.substring(html.indexOf('<html '), html.length);
    html = html.substring(0, html.lastIndexOf('</html>') + '</html>'.length);

    const iframe: HTMLIFrameElement = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    let convertedString: string = '',
        collection: HTMLElement[] = [],
        rules: CSSStyleRule[] = [];

    try {
        const iframeDoc: Document | null =
            iframe.contentDocument ||
            (iframe.contentWindow ? iframe.contentWindow.document : null);

        if (iframeDoc) {
            iframeDoc.open();
            iframeDoc.write(html);
            iframeDoc.close();

            if (iframeDoc.styleSheets.length) {
                rules = (iframeDoc.styleSheets[
                iframeDoc.styleSheets.length - 1
                    ] as any).cssRules;
            }

            for (let idx = 0; idx < rules.length; idx += 1) {
                if (rules[idx].selectorText === '') {
                    continue;
                }

                collection = $$(rules[idx].selectorText, iframeDoc.body);

                collection.forEach((elm: HTMLElement) => {
                    elm.style.cssText += rules[idx].style.cssText
                        .replace(/mso-[a-z\-]+:[\s]*[^;]+;/g, '')
                        .replace(/border[a-z\-]*:[\s]*[^;]+;/g, '');
                });
            }

            convertedString = iframeDoc.firstChild
                ? iframeDoc.body.innerHTML
                : '';
        }
    } catch {
    } finally {
        Dom.safeRemove(iframe);
    }

    if (convertedString) {
        html = convertedString;
    }

    return html
        .replace(/<(\/)?(html|colgroup|col|o:p)[^>]*>/g, '')
        .replace(/<!--[^>]*>/g, '');
};