/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

/**
 * The module editor's event manager
 */

import {  IDictionary } from "../types";

export interface EventHandlerBlock {
    event: string;
    originalCallback: Function;
    syntheticCallback: Function;
}

export class EventHandlersStore {
    private __store: IDictionary< IDictionary<EventHandlerBlock[]>> = {};

    public get(event: string, namespace: string): EventHandlerBlock[] | void {
        if (this.__store[namespace] !== undefined) {
            return this.__store[namespace][event];
        }
    }

    public indexOf(event: string, namespace: string,  originalCallback: Function): false|number {
        const blocks: EventHandlerBlock[] | void = this.get(event, namespace);

        if (blocks) {
            for (let i = 0; i < blocks.length; i += 1) {
                if (blocks[i].originalCallback === originalCallback) {
                    return i;
                }
            }
        }

        return false;
    }

    public namespaces(): string[] {
        return Object.keys(this.__store);
    }

    public events(namespace: string): string[] {
        return this.__store[namespace] ? Object.keys(this.__store[namespace]) : [];
    }

    public set(event: string, namespace: string, data: EventHandlerBlock, onTop: boolean = false) {
        if (this.__store[namespace] === undefined) {
            this.__store[namespace] = {};
        }

        if (this.__store[namespace][event] === undefined) {
            this.__store[namespace][event] = [];
        }

        if (!onTop) {
            this.__store[namespace][event].push(data);
        } else {
            this.__store[namespace][event].unshift(data);
        }
    }
}

export class EventsNative {
    private __defaultNameSpace: string = "JoditEventDefaultNamespace";
    private __key: string = "__JoditEventsNativeNamespaces";

    private doc: Document = document;

    private __stopped: EventHandlerBlock[][] = [];

    private eachEvent(events: string, callback: (event: string, namespace: string) => void) {
        const eventParts: string[] = events.split(/[\s,]+/);

        eventParts.forEach((eventNameSpace: string) => {
            const eventAndNameSpace: string[] = eventNameSpace.split(".");

            const namespace: string = eventAndNameSpace[1] || this.__defaultNameSpace;

            callback.call(this, eventAndNameSpace[0], namespace);
        });
    }

    private getStore(subject: any): EventHandlersStore {
        if (subject[this.__key] === undefined) {
            const store: EventHandlersStore = new EventHandlersStore();

            Object.defineProperty(subject, this.__key, {
                enumerable: false,
                configurable: true,
                value: store,
            });
        }

        return subject[this.__key];
    }
    private clearStore(subject: any) {
        if (subject[this.__key] !== undefined) {
            delete subject[this.__key];
        }
    }

    private prepareEvent = (event: TouchEvent | MouseEvent | ClipboardEvent) => {
        if (event.cancelBubble) {
            return;
        }

        if (event.type.match(/^touch/) && (event as TouchEvent).changedTouches && (event as TouchEvent).changedTouches.length) {
            ["clientX", "clientY", "pageX", "pageY"].forEach((key: string) => {
                Object.defineProperty(event, key, {value: ((event as TouchEvent).changedTouches[0] as any)[key], configurable: true, enumerable: true});
            });
        }

        if (!(event as any).originalEvent) {
            (event as any).originalEvent = event;
        }

        if (event.type === "paste" && (event as ClipboardEvent).clipboardData === undefined && (this.doc.defaultView as any).clipboardData) {
            Object.defineProperty(event, "clipboardData", {
                get: () => {
                    return (this.doc.defaultView as any).clipboardData;
                },
                configurable: true,
                enumerable: true,
            });
        }
    }

    private triggerNativeEvent(element: Document | Element | HTMLElement | Window, event: string | Event | MouseEvent) {
        const evt: Event = this.doc.createEvent("HTMLEvents");

        if (typeof event === "string") {
            evt.initEvent(event, true, true);
        } else {
            evt.initEvent(event.type, event.bubbles, event.cancelable);

            ["screenX", "screenY", "clientX", "clientY", "target", "srcElement", "currentTarget", "timeStamp", "which", "keyCode"].forEach(property => {
                Object.defineProperty(evt, property, {value: (event as any)[property], enumerable: true});
            });

            Object.defineProperty(evt, "originalEvent", {value: event, enumerable: true});
        }

        element.dispatchEvent(evt);
    }

    private removeStop(__currentBlocks: EventHandlerBlock[]) {
        if (__currentBlocks) {
            const index: number = this.__stopped.indexOf(__currentBlocks);
            index !== -1 && this.__stopped.splice(index, 1);
        }
    }
    private isStopped(__currentBlocks: EventHandlerBlock[]): boolean {
        return __currentBlocks !== undefined && this.__stopped.indexOf(__currentBlocks) !== -1;
    }

    /**
     * Get current event name
     *
     * @example
     * ```javascript
     * parent.events.on('openDialog closeDialog', function () {
     *     if (parent.events.current === 'closeDialog') {
     *         alert('Dialog was closed');
     *     } else {
     *         alert('Dialog was opened');
     *     }
     * });
     * ```
     */
    public current: string[] = [];

    /**
     * Sets the handler for the specified event ( Event List ) for a given element .
     *
     * @param {object|string} subjectOrEvents - The object for which toWYSIWYG set an event handler
     * @param {string|Function} eventsOrCallback - List of events , separated by a space or comma
     * @param {function} [handlerOrSelector] - The event handler
     * @param {selector} [selector] - Selector for capturing
     * @param {Boolean} [onTop=false] - Set handler in first
     *
     * @example
     * ```javascript
     * // set global handler
     * parent.on('beforeCommand', function (command) {
     *     alert('command');
     * });
     * ```
     * * @example
     * ```javascript
     * // set global handler
     * parent.on(document.body, 'click', function (e) {
     *     alert(this.href);
     * }, 'a');
     * ```
     */
    public on(subjectOrEvents: string, eventsOrCallback: Function, handlerOrSelector?: void, selector?: string, onTop?: boolean): EventsNative;
    public on(subjectOrEvents: object, eventsOrCallback: string, handlerOrSelector: Function, selector?: string, onTop?: boolean): EventsNative;
    public on(subjectOrEvents: object | string, eventsOrCallback: string | Function, handlerOrSelector?: Function | void, selector?: string, onTop: boolean = false): EventsNative {
        const subject: object = typeof subjectOrEvents === "string" ? this : subjectOrEvents;
        const events: string = typeof eventsOrCallback === "string" ? eventsOrCallback : subjectOrEvents as string;

        let callback: Function = handlerOrSelector as Function;

        if (callback === undefined && typeof eventsOrCallback === "function") {
            callback = eventsOrCallback as Function;
        }

        const store: EventHandlersStore = this.getStore(subject);

        if (typeof events !== "string" || events === "") {
            throw new Error("Need events names");
        }

        if (typeof callback !== "function") {
            throw new Error("Need event handler");
        }

        if (Array.isArray(subject)) {
            subject.forEach((subj: object) => {
                this.on(subj, events, callback, selector);
            });

            return this;
        }

        const isDOMElement: boolean = typeof (subject as any).addEventListener === "function";

        let self: EventsNative = this,
            syntheticCallback: Function = function(this: any) {
                return callback && callback.apply(this, arguments);
            };

        if (isDOMElement) {
            syntheticCallback = function(this: any, event: MouseEvent | TouchEvent) {
                self.prepareEvent(event as TouchEvent);

                if (callback && callback.call(this, event) === false) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    return false;
                }

                return;
            };

            if (selector) {
                syntheticCallback = function(this: any, event: TouchEvent|MouseEvent): false | void {
                    self.prepareEvent(event);
                    let node: Element|null = event.target as any;
                    while (node && node !== this) {
                        if (node.matches(selector as string)) {
                            Object.defineProperty(event, "target", {
                                value: node,
                                configurable: true,
                                enumerable: true,
                            });

                            if (callback && callback.call(node, event) === false) {
                                event.preventDefault();
                                return false;
                            }

                            return;
                        }
                        node = node.parentNode as Element|null;
                    }
                };
            }
        }

        this.eachEvent(events, (event: string, namespace: string): void => {
            if (event === "") {
                throw new Error("Need event name");
            }

            if (store.indexOf(event, namespace, callback) === false) {
                const block: EventHandlerBlock = {
                    event,
                    originalCallback: callback,
                    syntheticCallback,
                };

                store.set(event, namespace, block, onTop);

                if (isDOMElement) {
                    (subject as HTMLElement).addEventListener(event, syntheticCallback as EventListener, false);
                }
            }
        });

        return this;
    }

    /**
     * Disable all handlers specified event ( Event List ) for a given element. Either a specific event handler.
     *
     * @param {object} subjectOrEvents - The object which is disabled handlers
     * @param {string|Function} [eventsOrCallback] - List of events, separated by a space or comma , which is necessary toWYSIWYG disable the handlers for a given object
     * @param {function} [handler] - Specific event handler toWYSIWYG be removed
     *
     * @example
     * ```javascript
     * var a = {name: "Anton"};
     * parent.events.on(a, 'open', function () {
     *     alert(this.name);
     * });
     *
     * parent.events.fire(a, 'open');
     * parent.events.off(a, 'open');
     * var b = {name: "Ivan"}, hndlr = function () {
     *  alert(this.name);
     * };
     * parent.events.on(b, 'open close', hndlr);
     * parent.events.fire(a, 'open');
     * parent.events.off(a, 'open', hndlr);
     * parent.events.fire(a, 'close');
     * parent.events.on('someGlobalEvents', function () {
     *   console.log(this); // parent
     * });
     * parent.events.fire('someGlobalEvents');
     * parent.events.off('someGlobalEvents');
     * ```
     */
    public off(subjectOrEvents: string): EventsNative;
    public off(subjectOrEvents: string, eventsOrCallback?: Function): EventsNative;
    public off(subjectOrEvents: object, eventsOrCallback?: string, handler?: Function): EventsNative;
    public off(subjectOrEvents: object | string, eventsOrCallback?: string | Function, handler?: Function): EventsNative {
        const subject: object = typeof subjectOrEvents === "string" ? this : subjectOrEvents;
        const events: string = typeof eventsOrCallback === "string" ? eventsOrCallback : subjectOrEvents as string;

        const store: EventHandlersStore = this.getStore(subject);

        let callback: Function = handler as Function;

        if (typeof events !== "string" || !events) {
            store.namespaces().forEach((namespace: string) => {
                this.off(subject, "." + namespace);
            });

            this.clearStore(subject);

            return this;
        }

        if (callback === undefined && typeof eventsOrCallback === "function") {
            callback = eventsOrCallback as Function;
        }

        const isDOMElement: boolean = typeof (subject as any).removeEventListener === "function",
            removeEventListener = (block: EventHandlerBlock) => {
                if (isDOMElement) {
                    (subject as HTMLElement).removeEventListener(block.event, block.syntheticCallback as EventListener, false);
                }
            },
            removeCallbackFromNameSpace = (event: string, namespace: string) => {
                if (event !== "") {
                    const blocks: EventHandlerBlock[] | void = store.get(event, namespace);
                    if (blocks && blocks.length) {
                        let found: boolean = false;

                        if (typeof callback !== "function") {
                            blocks.forEach(removeEventListener);
                            blocks.length = 0;
                            found = true;
                        } else {
                            const index: number|false = store.indexOf(event, namespace, callback);
                            if (index !== false) {
                                removeEventListener(blocks[index]);
                                blocks.splice(index, 1);
                                found = true;
                            }
                        }
                    }
                } else {
                    store.events(namespace)
                        .forEach((eventName: string) => {
                            if (eventName !== "") {
                                removeCallbackFromNameSpace(eventName, namespace);
                            }
                        });
                }
            };

        this.eachEvent(events, (event: string, namespace: string): void => {
            if (namespace === this.__defaultNameSpace) {
                store.namespaces()
                    .forEach((name: string) => {
                        removeCallbackFromNameSpace(event, name);
                    });
            } else {
                removeCallbackFromNameSpace(event, namespace);
            }
        });

        return this;
    }

    public stopPropagation(subjectOrEvents: object|string, eventsList?: string) {
        const subject: object = typeof subjectOrEvents === "string" ? this : subjectOrEvents;
        const events: string = typeof subjectOrEvents === "string" ? subjectOrEvents : eventsList as string;

        if (typeof events !== "string") {
            throw new Error("Need event names");
        }
        const store: EventHandlersStore = this.getStore(subject);

        this.eachEvent(events, (event: string, namespace: string): void => {
            const blocks: EventHandlerBlock[] | void = store.get(event, namespace);
            if (blocks) {
                this.__stopped.push(blocks);
            }
        });
    }

    /**
     * Sets the handler for the specified event (Event List) for a given element .
     *
     * @param {object|string} subjectOrEvents - The object which is caused by certain events
     * @param {string|Array} eventsList - List of events , separated by a space or comma
     * @param {Array} [args] - Options for the event handler
     * @return {boolean} `false` if one of the handlers return `false`
     * @example
     * ```javascript
     * var dialog = new Jodit.modules.Dialog();
     * parent.events.on('afterClose', function () {
     *     dialog.destruct(); // will be removed from DOM
     * });
     * dialog.open('Hello world!!!');
     * ```
     *  or you can trigger native browser listener
     *  ```javascript
     *  var events = new Jodit.modules.EventsNative();
     *  events.on(document.body, 'click',function (event) {
     *      alert('click on ' + event.target.id );
     *  });
     *  events.fire(document.body.querySelector('div'), 'click');
     *  ```
     *
     */
    public fire(subjectOrEvents: string, eventsList?: any, ...args: any[]): any;
    public fire(subjectOrEvents: object, eventsList: string | Event, ...args: any[]): any;
    public fire(subjectOrEvents: object|string, eventsList?: string | any | Event, ...args: any[]): any {
        let result: any = void(0),
            result_value: any;

        const subject: object = typeof subjectOrEvents === "string" ? this : subjectOrEvents;
        const events: string = typeof subjectOrEvents === "string" ? subjectOrEvents : eventsList as string;
        const argumentsList: any[] = typeof subjectOrEvents === "string" ? [eventsList, ...args] : args;

        const isDOMElement: boolean = typeof (subject as any).dispatchEvent === "function";

        if (!isDOMElement && typeof events !== "string") {
            throw new Error("Need events names");
        }

        const store: EventHandlersStore = this.getStore(subject);

        if (typeof events !== "string" && isDOMElement) {
            this.triggerNativeEvent(subject as HTMLElement, eventsList);
        } else {
            this.eachEvent(events, (event: string, namespace: string): void => {
                if (isDOMElement) {
                    this.triggerNativeEvent(subject as HTMLElement, event);
                } else {
                    const blocks: EventHandlerBlock[] | void = store.get(event, namespace);
                    if (blocks) {
                        try {
                            blocks.every((block: EventHandlerBlock): boolean => {
                                if (this.isStopped(blocks)) {
                                    return false;
                                }

                                this.current.push(event);
                                result_value = block.syntheticCallback.apply(subject, argumentsList);
                                this.current.pop();

                                if (result_value !== undefined) {
                                    result = result_value;
                                }

                                return true;
                            });
                        } finally {
                            this.removeStop(blocks);
                        }
                    }

                    if (namespace === this.__defaultNameSpace && !isDOMElement) {
                        store
                            .namespaces()
                            .filter(ns => ns !== namespace)
                            .forEach((ns: string) => {
                                const result_second: any = this.fire.apply(this, [subject, event + "." + ns, ...argumentsList]);
                                if (result_second !== undefined) {
                                    result = result_second;
                                }
                            });
                    }
                }
            });
        }

        return result;
    }

    public destruct() {
        this.off(this);
    }

    constructor(doc?: Document) {
        if (doc) {
            this.doc = doc;
        }
        this.__key += (new Date()).getTime();
    }
}
