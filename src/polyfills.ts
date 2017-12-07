/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2017 Valeriy Chupurnov xdsoft.net
 */

import 'classlist-polyfill';

(function(e){
    e.matches || (e.matches = e['matchesSelector'] !== undefined ? e['matchesSelector'] : function (selector: string) {
            const matches = this.ownerDocument.querySelectorAll(selector),
                th = this;

            return Array.prototype.some.call(matches, (e) => {
                return e === th;
            });
        });

})(Element.prototype);