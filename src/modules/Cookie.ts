import Component from "./Component"

export default class Cookie extends Component {
    /**
     * Set cookie value
     *
     * @method set
     * @param {string} name
     * @param {scalar} value
     * @param {int} [days] if it value < 0 cookie removed
     * @example
     * Jodit.modules.Cookie().set('somename', somevalue, 5);
     *
     * var editor = new Jodit(".editors");
     * editor.cookie.set('somename', somevalue, 5);
     *
     * var cookie = new Jodit.modules.Cookie();
     * cookie.set('somename', somevalue, 5);
     */
    set(name: string|number, value: string|number, days ?: number) {
        let expires, date;
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
     * console.log(Jodit.modules.Cookie().get('somename'));
     *
     * var editor = new Jodit(".editors");
     * console.log(editor.cookie.get('somename'));
     *
     * var cookie = new Jodit.modules.Cookie();
     * console.log(cookie.get('somename'));
     */
    get (name) {
        let nameEQ = name + '=',
            i,
            c,
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
     * Jodit.modules.Cookie().remove('somename');
     *
     * var editor = new Jodit(".editors");
     * editor.cookie.remove('somename');
     *
     * var cookie = new Jodit.modules.Cookie();
     * cookie.remove('somename');
     */
    remove(name) {
        this.set(name, '', -1);
    }
}