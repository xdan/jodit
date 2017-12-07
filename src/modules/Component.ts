/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2017 Valeriy Chupurnov xdsoft.net
 */

import Jodit from "../Jodit";

export default class Component {
    handlers: {};
    /**
     * @property{Jodit} parent
     */
    jodit: Jodit;

    constructor(jodit?: Jodit) {
        this.jodit = jodit;
        if (jodit && jodit.components) {
            jodit.components.push(this);
        }
    }

    private __scope: any[] = [];
    private __scopeNamespace: any = {};

    __fire(element: Document|Element|HTMLElement|Window, event: string|Event|MouseEvent, doc: Document) {
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

    private classSeparator = /[\s]+/;

    __on(element: Document|Element|HTMLElement|Window|Array<HTMLElement|Window>, event: string, selectorOrCallback: false|string|Function, callback?: Function) {
        if (typeof selectorOrCallback === 'function') {
            callback = selectorOrCallback;
            selectorOrCallback = false;
        }

        const eventsArray: string[] = event ? event.split(this.classSeparator) : [];
        const prepareEvent = (event: TouchEvent|MouseEvent) => {
            if (event.cancelBubble) {
                return;
            }

            if (event.type.match(/^touch/) && (<TouchEvent>event).changedTouches && (<TouchEvent>event).changedTouches.length) {
                ['clientX', 'clientY', 'pageX', 'pageY'].forEach((key: string) => {
                    Object.defineProperty(event, key, {value: (<TouchEvent>event).changedTouches[0][key], enumerable: true});
                })
            }

            if (!event['originalEvent']) {
                event['originalEvent'] = event;
            }

        };

        let temp: Function = function (event: MouseEvent|TouchEvent) {
            prepareEvent(<TouchEvent>event);
            callback.call(this, event);
        };


        eventsArray.forEach((event: string) => {
            let namespace: string = '';
            if (/\./.test(event)) {
                [event, namespace] = event.split('.');
            }

            if (selectorOrCallback) {
                temp = function (event) {
                    prepareEvent(event);
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

            const eventData = {
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