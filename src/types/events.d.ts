/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module types
 */

/* eslint-disable tsdoc/syntax */

import type { CallbackFunction, IDestructible } from './types';

interface IEventEmitter extends IDestructible {
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
	 * Doesn't start any handler
	 */
	mute(event?: string): IEventEmitter;

	/**
	 * No handlers are triggered for the event
	 */
	isMuted(event?: string): boolean;

	/**
	 * Returns event handling
	 */
	unmute(event?: string): IEventEmitter;

	/**
	 * Sets the handler for the specified event (Event List) for a given element .
	 *
	 * @param {object|string} subjectOrEvents - The object for which to set an event handler
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
	): IEventEmitter;

	on(
		subject: HTMLElement,
		events: string,
		handler: CallbackFunction,
		onTop?: boolean
	): IEventEmitter;

	on(
		subject: object,
		events: string,
		handler: CallbackFunction,
		onTop?: boolean
	): IEventEmitter;

	on(
		subjectOrEvents: object | string,
		eventsOrCallback: string | CallbackFunction,
		handlerOrSelector?: CallbackFunction | void,
		onTop?: boolean
	): IEventEmitter;

	one(...args: Parameters<IEventEmitter['on']>): IEventEmitter;

	/**
	 * Disable all handlers specified event ( Event List ) for a given element. Either a specific event handler.
	 *
	 * @param {object} subjectOrEvents - The object which is disabled handlers
	 * @param {string|Function} [eventsOrCallback] - List of events, separated by a space or comma , which is necessary
	 * to disable the handlers for a given object
	 * @param {function} [handler] - Specific event handler to be removed
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
		events: string,
		eventsOrCallback?: CallbackFunction
	): IEventEmitter;
	off(
		subject: object,
		events?: string,
		handler?: CallbackFunction
	): IEventEmitter;
	off(
		subjectOrEvents: object | string,
		eventsOrCallback?: string | (() => void),
		handler?: CallbackFunction
	): IEventEmitter;

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
	 * ```javascript
	 *  var events = new Jodit.modules.EventEmitter();
	 *  events.on(document.body, 'click',function (event) {
	 *      alert('click on ' + event.target.id );
	 *  });
	 *  events.fire(document.body.querySelector('div'), 'click');
	 * ```
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
