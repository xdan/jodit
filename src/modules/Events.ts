/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov xdsoft.net
 */

import {Component} from "./Component"

/**
 * The module editor's event manager
 */
export class Events extends Component{
    current: string;
    stack: string[] = [];

    /**
     * Get current event name
     *
     * @method current
     * @example
     * ```javascript
     * parent.events.on('openDialog closeDialog', function () {
     *     if (parent.events.current() === 'closeDialog') {
     *         alert('Dialog was closed');
     *     } else {
     *         alert('Dialog was opened');
     *     }
     * });
     * ```
     */

    /**
     * Disable all handlers specified event ( Event List ) for a given element. Either a specific event handler.
     * @method off
     * @param {object} [object] - The object which is disabled handlers
     * @param {string} [list] - List of events, separated by a space or comma , which is necessary toWYSIWYG disable the handlers for a given object
     * @param {function} [callback] - Specific event handler toWYSIWYG be removed
     * @return {Events} this
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
    off(object?: any, list?: any, callback?: Function) {
        if (arguments.length === 0) {
            this.jodit.handlers = {};
            return this;
        }

        let i: number, j: number;

        if (typeof object === 'string') {
            callback = list;
            list = object;
            object = this.jodit;
        }

        if (object.handlers === undefined) {
            return this;
        }

        let actions: string[] = list.split(/[\s,]+/);

        for (i = 0; i < actions.length; i += 1) {
            if (object.handlers[actions[i]] === undefined) {
                continue;
            }

            if (callback !== undefined) {
                for (j = 0; j < object.handlers[actions[i]].length; j += 1) {
                    if (object.handlers[actions[i]][j] === callback) {
                        object.handlers[actions[i]].splice(j, 1);
                    }
                }
            } else {
                delete object.handlers[actions[i]];
            }

        }

        return this;
    }

     /**
     * Sets the handler for the specified event ( Event List ) for a given element .
     * @method on
     * @param {Object|string} [objectOrEvent] - The object for which toWYSIWYG set an event handler
     * @param {(String|Function)} list - List of events , separated by a space or comma
     * @param {function} [callback] - The event handler
     * @param {Boolean} [onTop=false] - Set handler in first
     * @return {Events} this
     * @example
     * ```javascript
     * // set global handler
     * parent.on('beforeSetELementValue', function (data) {
     *     data.value = jQuery.trim(data.value);
     * });
     * ```
     */
    on(objectOrEvent: any, list: any, callback?: string|Function, onTop: boolean = false) {
        let i: number;

        if (typeof objectOrEvent === 'string') {
            callback = list;
            list = objectOrEvent;
            objectOrEvent = this.jodit;
        }

        if (typeof list !== 'string') {
           new Error('Parameter list must be string');
        }

        let actionsList:string[] = list.split(/[\s,]+/);

        for (i = 0; i < actionsList.length; i += 1) {
            if (objectOrEvent.handlers === undefined) {
                objectOrEvent.handlers = {};
            }

            if (objectOrEvent.handlers[actionsList[i]] === undefined) {
                objectOrEvent.handlers[actionsList[i]] = [];
            }

            if (onTop) {
                objectOrEvent.handlers[actionsList[i]].unshift(callback);
            } else {
                objectOrEvent.handlers[actionsList[i]].push(callback);
            }
        }
        return this;
    }

    /**
     * Sets the handler for the specified event (Event List) for a given element .
     * @method fire
     * @param {object|string} object - The object which is caused by certain events
     * @param {string|Array} eventOrArgs - List of events , separated by a space or comma
     * @param {Array} [args] - Options for the event handler
     * @return {boolean} `false` if one of the handlers return `false`
     * @example
     * ```javascript
     * var dialog = new Jodit.modules.Dialog(parent);
     * parent.on(dialog, 'afterClose', function () {
     *     dialog.destroy(); // will be removed from DOM
     * });
     * dialog.open('Hello world!!!');
     * ```
     */

    fire (object: any, eventOrArgs?: string|any[], args?: any[]): false|void|any {
        let i: number,
            j: number,
            result: any,
            result_value: any;

        if (typeof object === 'string') {
            args = <any[]>eventOrArgs;
            eventOrArgs = object;
            object = this.jodit;
        }

        if (object.handlers === undefined) {
            return;
        }

        eventOrArgs = (<string>eventOrArgs).split(/[\s,]+/);

        for (i = 0; i < eventOrArgs.length; i += 1) {
            if (object.handlers[eventOrArgs[i]] === undefined) {
                continue;
            }

            this.stack.push(eventOrArgs[i]);
            for (j = 0; object.handlers[eventOrArgs[i]] && j < object.handlers[eventOrArgs[i]].length; j += 1) {
                this.current = eventOrArgs[i];
                result_value = object.handlers[eventOrArgs[i]][j].apply(object, args || []);
                if (result_value !== undefined) {
                    result = result_value;
                }
            }
            this.stack.pop();
        }

        return result;
    }
}