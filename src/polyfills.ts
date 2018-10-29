/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import 'classlist-polyfill';
import 'es6-promise/auto';

(function(e: Element){
    e.matches || (e.matches = (<any>e).matchesSelector !== undefined ? (<any>e).matchesSelector : function (this: Element, selector: string) {
            const matches: NodeList = this.ownerDocument.querySelectorAll(selector),
                th = this;

            return Array.prototype.some.call(matches, (e: Element) => {
                return e === th;
            });
        });

})(Element.prototype);


