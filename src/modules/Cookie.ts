/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { IStorage } from '../types';

export class Cookie implements IStorage {
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
    public set(name: string | number, value: string | number, days?: number) {
        let expires: string, date;

        if (days) {
            date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = '; expires=' + date.toUTCString();
        } else {
            expires = '';
        }

        document.cookie = name + '=' + value + expires + '; path=/';
    }

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
    public get(name: string): string | null {
        const nameEQ: string = name + '=',
            ca = document.cookie.split(';');
        let i: number, c: string;

        for (i = 0; i < ca.length; i += 1) {
            c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }

        return null;
    }

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
    public remove(name: string) {
        this.set(name, '', -1);
    }
}
