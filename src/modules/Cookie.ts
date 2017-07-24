import Component from "./Component"

export default class Cookie extends Component {
    /**
     * Set cookie value
     *
     * @method set
     * @param {string|number} name
     * @param {string|number} value
     * @param {int} [days] if it value < 0 cookie removed
     * @example
     *
     * Jodit.modules.Cookie.set('somename', somevalue, 5);
     */
    static set(name: string|number, value: string|number, days ?: number) {
        let expires: string, date;
        if (days) {
            date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toGMTString();
        } else {
            expires = '';
        }
        document.cookie = name + "=" + value + expires + '; path=/';
    }

    /**
     * Get cookie value by key
     *
     * @method get
     * @param {string} name
     * @return {string}
     * @example
     *
     * console.log(Jodit.modules.Cookie.get('somename'));
     */
    static get (name: string): string|null {
        let nameEQ: string = name + '=',
            i: number,
            c: string,
            ca = document.cookie.split(';');

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
     *
     * Jodit.modules.Cookie.remove('somename');
     */
    static remove(name: string) {
        Cookie.set(name, '', -1);
    }
}