import Jodit from "../jodit"
export default class Component {
    handlers: {};
    /**
     * @prop {Jodit} parent
     */
    parent: Jodit;
    /**
     * @prop {HTMLDocument} win
     */
    doc: HTMLDocument;
    /**
     * @prop {Window} win
     */
    win: Window;

    constructor(parent?: Jodit) {
        this.parent = parent;
        this.doc = document;
        this.win = window;
        if (parent && parent.components) {
            parent.components.push(this);
        }
    }

    init() {
        console.warn('Method should be override')
    }

    __scope: any[] = [];
    __scopeNamespace: any = {};
    __fire(element: Element, event: string) {
        let evt = this.doc.createEvent('HTMLEvents')
        evt.initEvent(event, true, true);
        element.dispatchEvent(evt);
    }
    __off(element: false|Element|HTMLElement|Array<HTMLElement> = false, event: string|false = false) {
        this.__scope.forEach((data) => {
            (Array.isArray(element) ? element : [element]).forEach((elm) => {
                if ((elm === false || elm === data.element) && (event === false || event === data.event)) {
                    data.element.removeEventListener(data.event, data.callback)
                }
            });
        })
        return this;
    }

    classSeparator = /[\s]+/

    __on(element: Document|Element|HTMLElement|Window|Array<HTMLElement>, event: string, selector: false|string|Function, callback?: Function) {
        if (typeof selector === 'function') {
            callback = selector;
            selector = false;
        }

        let eventsArray = event ? event.split(this.classSeparator) : [],
            temp: Function = callback;

        eventsArray.forEach((event: string) => {
            let namespace = '';
            if (/\./.test(event)) {
                [event, namespace] = event.split('.');
            }

            if (selector) {
                temp = function (event) {
                    let node = event.target;
                    while (node && node !== this) {
                        if (node.matches(selector)) {
                            return callback.call(node, event);
                        }
                        node = node.parentNode;
                    }
                }
            }

            (Array.isArray(element) ? element : [element]).forEach((elm: HTMLElement) => {
                elm.addEventListener(event, <EventListenerOrEventListenerObject>temp);
            });

            let eventData = {
                element,
                event,
                callback
            }

            if (this.__scopeNamespace[namespace] === undefined) {
                this.__scopeNamespace[namespace] = [];
            }

            this.__scopeNamespace[namespace].push(eventData)
            this.__scope.push(eventData);
        })

        return this;
    }

    destruct() {
        this.__off();
    }
}