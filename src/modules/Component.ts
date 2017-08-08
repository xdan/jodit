import Jodit from "../Jodit";

export default class Component {
    handlers: {};
    /**
     * @prop {Jodit} parent
     */
    jodit: Jodit;

    constructor(parent?: Jodit) {
        this.jodit = parent;
        if (parent && parent.components) {
            parent.components.push(this);
        }
    }

    __scope: any[] = [];
    __scopeNamespace: any = {};

    __fire(element: Document|Element|HTMLElement|Window, event: string|Event|MouseEvent, doc?: Document) {
        let evt: Event = doc.createEvent('HTMLEvents');

        if (typeof event === 'string') {
            evt.initEvent(event, true, true);
        } else {
            evt.initEvent(event.type, event.bubbles, event.cancelable);

            ['screenX', 'screenY', 'clientX', 'clientY', 'target', 'srcElement', 'currentTarget', 'timeStamp', 'which', 'keyCode'].forEach((property) => {
                Object.defineProperty(evt, property, {value: event[property], enumerable: true});
            });

            Object.defineProperty(evt, 'originalEvent', {value: event, enumerable: true});
        }

        element.dispatchEvent(evt);
    }

    __off(element: false|Document|Element|HTMLElement|Window|Array<HTMLElement> = false, event: string|false = false) {
        if (event && /^\./.test(event)) {
            let nameSpace = event.replace(/^\./, '');
            if (this.__scopeNamespace[nameSpace]) {
                this.__scopeNamespace[nameSpace].forEach((data) => {
                    (Array.isArray(element) ? element : [element]).forEach((elm) => {
                        if (data.element && data.element.removeEventListener && (elm === false || elm === data.element)) {
                            data.element.removeEventListener(data.event, data.callback)
                        }
                    });
                });
            }
            return this;
        }
        this.__scope.forEach((data) => {
            (Array.isArray(element) ? element : [element]).forEach((elm) => {
                if (data.element && data.element.removeEventListener && (elm === false || elm === data.element) && (event === false || event === data.event)) {
                    data.element.removeEventListener(data.event, data.callback)
                }
            });
        });
        return this;
    }

    classSeparator = /[\s]+/;

    __on(element: Document|Element|HTMLElement|Window|Array<HTMLElement|Window>, event: string, selectorOrCallback: false|string|Function, callback?: Function) {
        if (typeof selectorOrCallback === 'function') {
            callback = selectorOrCallback;
            selectorOrCallback = false;
        }

        let eventsArray = event ? event.split(this.classSeparator) : [],
            temp: Function = function (event: MouseEvent) {
                if (event.cancelBubble) {
                    return;
                }
                if (!event['originalEvent']) {
                    event['originalEvent'] = event;
                }
                callback.call(this, event);
            };

        eventsArray.forEach((event: string) => {
            let namespace = '';
            if (/\./.test(event)) {
                [event, namespace] = event.split('.');
            }

            if (selectorOrCallback) {
                temp = function (event) {
                    if (event.cancelBubble) {
                        return;
                    }
                    if (!event['originalEvent']) {
                        event['originalEvent'] = event;
                    }
                    let node = event.target;
                    while (node && node !== this) {
                        if (node.matches(selectorOrCallback)) {
                            if (callback.call(node, event) === false) {
                                event.preventDefault();
                                return false;
                            }
                            return;
                        }
                        node = node.parentNode;
                    }
                }
            }

            (Array.isArray(element) ? element : [element]).forEach((elm: HTMLElement) => {
                elm.addEventListener(event, <EventListenerOrEventListenerObject>temp, false);
            });

            let eventData = {
                element,
                event,
                callback: temp
            };

            if (this.__scopeNamespace[namespace] === undefined) {
                this.__scopeNamespace[namespace] = [];
            }

            this.__scopeNamespace[namespace].push(eventData);
            this.__scope.push(eventData);
        });

        return this;
    }

    destruct() {
        this.__off();
    }
}