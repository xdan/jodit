/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
  * Released under MIT see LICENSE.txt in the project root for license information.

 * Copyright 2013-2020 Valeriy Chupurnov https://xdsoft.net
 */

import { CallbackFunction } from './types';

interface IEventsNative {
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
	current: string[];

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
		subjectOrEvents: string,
		eventsOrCallback: CallbackFunction,
		handlerOrSelector?: void,
		selector?: string,
		onTop?: boolean
	): IEventsNative;

	on(
		subjectOrEvents: object,
		eventsOrCallback: string,
		handlerOrSelector: CallbackFunction,
		selector?: string,
		onTop?: boolean
	): IEventsNative;

	on(
		subjectOrEvents: object | string,
		eventsOrCallback: string | CallbackFunction,
		handlerOrSelector?: CallbackFunction | void,
		selector?: string,
		onTop?: boolean
	): IEventsNative;

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
	fire(subjectOrEvents: string, eventsList?: any, ...args: any[]): any;
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

	destruct(): void;
}
