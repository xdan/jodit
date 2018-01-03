/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov xdsoft.net
 */

import 'classlist-polyfill';

(function(e: Element){
    e.matches || (e.matches = e['matchesSelector'] !== undefined ? e['matchesSelector'] : function (this: Element, selector: string) {
            const matches: NodeList = this.ownerDocument.querySelectorAll(selector),
                th = this;

            return Array.prototype.some.call(matches, (e: Element) => {
                return e === th;
            });
        });

})(Element.prototype);