/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import 'classlist-polyfill';
import 'es6-promise/auto';
import { IDictionary } from './types';

((e: Element) => {
    e.matches ||
        (e.matches =
            (e as any).matchesSelector !== undefined
                ? (e as any).matchesSelector
                : function(this: Element, selector: string) {
                      if (!this.ownerDocument) {
                          return [];
                      }

                      const matches: NodeList | null = this.ownerDocument.querySelectorAll(
                              selector
                          ),
                          th = this;

                      return Array.prototype.some.call(
                          matches,
                          (elm: Element) => {
                              return elm === th;
                          }
                      );
                  });
})(Element.prototype);

if (!Array.from) {
    Array.from = <T>(object: T[]): T[] => {
        'use strict';
        return [].slice.call(object);
    };
}

typeof Symbol === 'function' ||  (() => {
    const map: IDictionary = {};

    function Symbol(sym: string) {
        return `@@${sym}`;
    }

    (<any>Symbol)['for'] = (sym: string) => {
        if (map[sym]) {
            return map[sym];
        }

        return map[sym] = Symbol(sym);
    }
})();
