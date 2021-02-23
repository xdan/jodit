/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { CallbackFunction, IDestructible } from './types';

interface IEventsNative extends IDestructible {
	/**
	 * Get current event name
	 *
	 * @example
	 * ```javascript
	 * parent.e.on('openDialog closeDialog', function () {
	 *     if (parent.e.current === 'closeDialog') {
	 *         alert('Dialog was closed');
	 *     } else {
	 *         alert('Dialog was opened');
	 *     }
	 * });
	 * ```
	 */
	current: string;
	currents: string[];

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
	on(
		events: string,
		handler: CallbackFunction,
		handlerOrSelector?: void,
		onTop?: boolean
	): IEventsNative;

	on(
		subject: HTMLElement,
		events: string,
		handler: CallbackFunction,
		onTop?: boolean
	): IEventsNative;

	on(
		subject: object,
		events: string,
		handler: CallbackFunction,
		onTop?: boolean
	): IEventsNative;

	on(
		subjectOrEvents: object | string,
		eventsOrCallback: string | CallbackFunction,
		handlerOrSelector?: CallbackFunction | void,
		onTop?: boolean
	): IEventsNative;

	one(...args: Parameters<IEventsNative['on']>): IEventsNative;

	/**
	 * Disable all handlers specified event ( Event List ) for a given element. Either a specific event handler.
	 *
	 * @param {object} subjectOrEvents - The object which is disabled handlers
	 * @param {string|Function} [eventsOrCallback] - List of events, separated by a space or comma , which is necessary
	 * toWYSIWYG disable the handlers for a given object
	 * @param {function} [handler] - Specific event handler toWYSIWYG be removed
	 *
	 * @example
	 * ```javascript
	 * var a = {name: "Anton"};
	 * parent.e.on(a, 'open', function () {
	 *     alert(this.name);
	 * });
	 *
	 * parent.e.fire(a, 'open');
	 * parent.e.off(a, 'open');
	 * var b = {name: "Ivan"}, hndlr = function () {
	 *  alert(this.name);
	 * };
	 * parent.e.on(b, 'open close', hndlr);
	 * parent.e.fire(a, 'open');
	 * parent.e.off(a, 'open', hndlr);
	 * parent.e.fire(a, 'close');
	 * parent.e.on('someGlobalEvents', function () {
	 *   console.log(this); // parent
	 * });
	 * parent.e.fire('someGlobalEvents');
	 * parent.e.off('someGlobalEvents');
	 * ```
	 */
	off(
		subjectOrEvents: string,
		eventsOrCallback?: CallbackFunction
	): IEventsNative;
	off(
		subjectOrEvents: object,
		eventsOrCallback?: string,
		handler?: CallbackFunction
	): IEventsNative;
	off(
		subjectOrEvents: object | string,
		eventsOrCallback?: string | (() => void),
		handler?: CallbackFunction
	): IEventsNative;

	stopPropagation(
		subjectOrEvents: object | string,
		eventsList?: string
	): void;

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
	 * parent.e.on('afterClose', function () {
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
	fire(subjectOrEvents: string, ...args: any[]): any;
	fire(
		subjectOrEvents: object,
		eventsList: string | Event,
		...args: any[]
	): any;
	fire(
		subjectOrEvents: object | string,
		eventsList?: string | any | Event,
		...args: any[]
	): any;
}
