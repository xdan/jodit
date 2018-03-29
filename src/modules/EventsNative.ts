/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

/**
 * The module editor's event manager
 */

type EventHandlerBlock = {
    event: string,
    originalCallback: Function,
    syntheticCallback: Function
};

class EventHandlersStore {
    private __store: {
        [key: string]: {
            [key: string]: Array<EventHandlerBlock>
        }
    } = {};

    get(event: string, namespace: string):  Array<EventHandlerBlock> | void{
        if (this.__store[namespace] !== undefined) {
            return this.__store[namespace][event];
        }
    }

    indexOf(event: string, namespace: string,  originalCallback: Function): false|number {
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

    // remove(event: string, namespace: string,  originalCallback: Function) {
    //     const blocks: EventHandlerBlock[] | void = this.get(namespace, event);
    //
    //     if (blocks) {
    //         return blocks.some((block: EventHandlerBlock, index: number) => {
    //             if (block.originalCallback === originalCallback) {
    //                 blocks.splice(index, 1);
    //                 return true;
    //             }
    //
    //             return false;
    //         });
    //     }
    //
    //     return false;
    // }

    namespaces(): string[] {
        return Object.keys(this.__store);
    }
    events(namespace: string): string[] {
        return this.__store[namespace] ? Object.keys(this.__store[namespace]) : [];
    }
    set(event: string, namespace: string, data: EventHandlerBlock, onTop: boolean = false) {
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
    private __defaultNameSpace: string = 'JoditEventDefaultNamespace';
    private __key: string = '__JoditEventsNativeNamespaces';

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
    current: string[] = [];

    private doc: Document = document;

    constructor(doc?: Document){
        if (doc) {
            this.doc = doc;
        }
        this.__key += (new Date()).getTime();
    }

    private eachEvent(events: string, callback: (event: string, namespace: string) => void) {
        const eventParts: string[] = events.split(/[\s,]+/);

        eventParts.forEach((eventNameSpace: string) => {
            const eventAndNameSpace: string[] = eventNameSpace.split('.');

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
                value: store
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

        if (event.type.match(/^touch/) && (<TouchEvent>event).changedTouches && (<TouchEvent>event).changedTouches.length) {
            ['clientX', 'clientY', 'pageX', 'pageY'].forEach((key: string) => {
                Object.defineProperty(event, key, {value: (<any>(<TouchEvent>event).changedTouches[0])[key], configurable: true, enumerable: true});
            })
        }

        if (!(<any>event)['originalEvent']) {
            (<any>event)['originalEvent'] = event;
        }

        if (event.type === 'paste' && (<ClipboardEvent>event).clipboardData === undefined && (<any>this.doc.defaultView).clipboardData) {
            Object.defineProperty(event, 'clipboardData', {
                get: () => {
                    return (<any>this.doc.defaultView).clipboardData;
                },
                configurable: true,
                enumerable: true
            });
        }
    };

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
    on(subjectOrEvents: object | string, eventsOrCallback: string|Function, handlerOrSelector?: Function, selector?: string, onTop: boolean = false): EventsNative {
        const subject: object = typeof subjectOrEvents === 'string' ? this : subjectOrEvents;
        const events: string = typeof eventsOrCallback === 'string' ? eventsOrCallback : <string>subjectOrEvents;

        let callback: Function = <Function>handlerOrSelector;

        if (callback === undefined && typeof eventsOrCallback === 'function') {
            callback = <Function>eventsOrCallback;
        }

        const store: EventHandlersStore = this.getStore(subject);

        if (typeof events !== 'string' || events === '') {
            throw new Error('Need events names');
        }

        if (typeof callback !== 'function') {
            throw new Error('Need event handler');
        }

        if (Array.isArray(subject)) {
            subject.forEach((subj: object) => {
                this.on(subj, events, callback, selector);
            });

            return this;
        }

        const isDOMElement: boolean = typeof (<any>subject)['addEventListener'] === 'function';

        let self: EventsNative = this,
            syntheticCallback: Function = function (this: any) {
                return callback && callback.apply(this, arguments);
            };

        if (isDOMElement) {
            syntheticCallback = function (this: any, event: MouseEvent | TouchEvent) {
                self.prepareEvent(<TouchEvent>event);

                if (callback && callback.call(this, event) === false) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    return false;
                }

                return;
            };
            if (selector) {
                syntheticCallback = function (this: any, event: TouchEvent|MouseEvent): false | void {
                    self.prepareEvent(event);
                    let node: Element|null = <any>event.target;
                    while (node && node !== this) {
                        if (node.matches(<string>selector)) {
                            Object.defineProperty(event, 'target', {
                                value: node,
                                configurable: true,
                                enumerable: true
                            });

                            if (callback && callback.call(node, event) === false) {
                                event.preventDefault();
                                return false;
                            }

                            return;
                        }
                        node = <Element|null>node.parentNode;
                    }
                }
            }
        }

        this.eachEvent(events, (event: string, namespace: string): void => {
            if (event === '') {
                throw new Error('Need event name');
            }

            if (store.indexOf(event, namespace, callback) === false) {
                const block: EventHandlerBlock = {
                    event,
                    originalCallback: callback,
                    syntheticCallback
                };

                store.set(event, namespace, block, onTop);

                if (namespace !== this.__defaultNameSpace) {
                    store.set(event, this.__defaultNameSpace, block, onTop);
                }

                if (isDOMElement) {
                    (<HTMLElement>subject).addEventListener(event, <EventListener>syntheticCallback, false);
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
    off(subjectOrEvents: object|string, eventsOrCallback?: string|Function, handler?: Function): EventsNative {
        const subject: object = typeof subjectOrEvents === 'string' ? this : subjectOrEvents;
        const events: string = typeof eventsOrCallback === 'string' ? eventsOrCallback : <string>subjectOrEvents;
        const store: EventHandlersStore = this.getStore(subject);

        let callback: Function = <Function>handler;

        if (typeof events !== 'string' || !events) {
            store.namespaces().forEach((namespace: string) => {
                this.off(subject, '.' + namespace);
            });

            this.clearStore(subject);

            return this;
        }

        if (callback === undefined && typeof eventsOrCallback === 'function') {
            callback = <Function>eventsOrCallback;
        }

        const isDOMElement: boolean = typeof (<any>subject)['removeEventListener'] === 'function',
            removeEventListener = (block: EventHandlerBlock) => {
                if (isDOMElement) {
                    (<HTMLElement>subject).removeEventListener(block.event, <EventListener>block.syntheticCallback, false);
                }
            },
            removeCallbackFromNameSpace = (event: string, namespace: string) => {
                if (event !== '') {
                    const blocks: EventHandlerBlock[] | void = store.get(event, namespace);
                    if (blocks && blocks.length) {
                        let found: boolean = false;

                        if (typeof callback !== 'function') {
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

                        if (found && namespace !== this.__defaultNameSpace) {
                            removeCallbackFromNameSpace(event, this.__defaultNameSpace);
                        }
                    }
                } else {
                    store.events(namespace).forEach((eventName: string) => {
                        if (eventName !== '') {
                            removeCallbackFromNameSpace(eventName, namespace);
                        }
                    });
                }
            };

        this.eachEvent(events, (event: string, namespace: string): void => {
            if (namespace === this.__defaultNameSpace) {
                store.namespaces().forEach((name: string) => {
                    removeCallbackFromNameSpace(event, name);
                });
            } else {
                removeCallbackFromNameSpace(event, namespace);
            }
        });

        return this;
    }

    private triggerNativeEvent(element: Document | Element | HTMLElement | Window, event: string | Event | MouseEvent) {
        const evt: Event = this.doc.createEvent('HTMLEvents');

        if (typeof event === 'string') {
            evt.initEvent(event, true, true);
        } else {
            evt.initEvent(event.type, event.bubbles, event.cancelable);

            ['screenX', 'screenY', 'clientX', 'clientY', 'target', 'srcElement', 'currentTarget', 'timeStamp', 'which', 'keyCode'].forEach((property) => {
                Object.defineProperty(evt, property, {value: (<any>event)[property], enumerable: true});
            });

            Object.defineProperty(evt, 'originalEvent', {value: event, enumerable: true});
        }

        element.dispatchEvent(evt);
    }

    private __stopped: Array<EventHandlerBlock[]> = [];

    stopPropagation(subjectOrEvents: object|string, eventsList?: string) {
        const subject: object = typeof subjectOrEvents === 'string' ? this : subjectOrEvents;
        const events: string = typeof subjectOrEvents === 'string' ? subjectOrEvents : <string>eventsList;

        if (typeof events !== 'string') {
            throw new Error('Need event names');
        }
        const store: EventHandlersStore = this.getStore(subject);

        this.eachEvent(events, (event: string, namespace: string): void => {
            const blocks: EventHandlerBlock[] | void = store.get(event, namespace);
            if (blocks) {
                this.__stopped.push(blocks);
            }
        });
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
    fire(subjectOrEvents: object|string, eventsList?: string|any|Event, ...args: any[]): any {
        let result: any = void(0),
            result_value: any;

        const subject: object = typeof subjectOrEvents === 'string' ? this : subjectOrEvents;
        const events: string = typeof subjectOrEvents === 'string' ? subjectOrEvents : <string>eventsList;
        const argumentsList: Array<any> = typeof subjectOrEvents === 'string' ? [eventsList, ...args] : args;

        const isDOMElement: boolean = typeof (<any>subject)['dispatchEvent'] === 'function';

        if (!isDOMElement && typeof events !== 'string') {
            throw new Error('Need events names');
        }

        const store: EventHandlersStore = this.getStore(subject);

        if (typeof events !== 'string' && isDOMElement) {
            this.triggerNativeEvent(<HTMLElement>subject, eventsList);
        } else {
            this.eachEvent(events, (event: string, namespace: string): void => {
                if (isDOMElement) {
                    this.triggerNativeEvent(<HTMLElement>subject, event);
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

                }
            });
        }

        return result;
    }

    destruct() {
        this.off(this);
    }
}