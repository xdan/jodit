/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { IStorage } from "./Storage";
export declare class Cookie implements IStorage {
    /**
     * Set cookie value
     *
     * @method set
     * @param {string|number} name
     * @param {string|number} value
     * @param {int} [days] if it value < 0 cookie removed
     * @example
     * ```javascript
     * Jodit.modules.Cookie.set('somename', somevalue, 5);
     * ```
     */
    set(name: string | number, value: string | number, days?: number): void;
    /**
     * Get cookie value by key
     *
     * @method get
     * @param {string} name
     * @return {string}
     * @example
     * ```javascript
     * console.log(Jodit.modules.Cookie.get('somename'));
     * ```
     */
    get(name: string): string | null;
    /**
     * Remove cookie by key
     *
     * @method remove
     * @param {string} name
     * @example
     * ```javascript
     * Jodit.modules.Cookie.remove('somename');
     * ```
     */
    remove(name: string): void;
}
