/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:core/event-emitter/README.md]]
 * @packageDocumentation
 * @module event-emitter
 */

import type {
	CallbackFunction,
	EventHandlerBlock,
	IEventEmitter
} from 'jodit/types';
import { defaultNameSpace, EventHandlersStore } from './store';
import { isString } from 'jodit/core/helpers/checker/is-string';
import { isFunction } from 'jodit/core/helpers/checker/is-function';
import { isArray } from 'jodit/core/helpers/checker/is-array';
import { error } from 'jodit/core/helpers/utils/error';

/**
 * The module editor's event manager
 */
export class EventEmitter implements IEventEmitter {
	private mutedEvents: Set<string> = new Set();

	mute(event?: string): this {
		this.mutedEvents.add(event ?? '*');
		return this;
	}

	isMuted(event?: string): boolean {
		if (event && this.mutedEvents.has(event)) {
			return true;
		}

		return this.mutedEvents.has('*');
	}

	unmute(event?: string): this {
		this.mutedEvents.delete(event ?? '*');
		return this;
	}

	readonly __key: string = '__JoditEventEmitterNamespaces';

	private doc: Document = document;

	private eachEvent(
		events: string,
		callback: (event: string, namespace: string) => void
	) {
		const eventParts: string[] = events.split(/[\s,]+/);

		eventParts.forEach((eventNameSpace: string) => {
			const eventAndNameSpace: string[] = eventNameSpace.split('.');

			const namespace: string = eventAndNameSpace[1] || defaultNameSpace;

			callback.call(this, eventAndNameSpace[0], namespace);
		});
	}

	private getStore(subject: any): EventHandlersStore {
		if (!subject) {
			throw error('Need subject');
		}

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

	private prepareEvent = (
		event: TouchEvent | MouseEvent | ClipboardEvent
	) => {
		if (event.cancelBubble) {
			return;
		}

		if (
			event.type.match(/^touch/) &&
			(event as TouchEvent).changedTouches &&
			(event as TouchEvent).changedTouches.length
		) {
			['clientX', 'clientY', 'pageX', 'pageY'].forEach((key: string) => {
				Object.defineProperty(event, key, {
					value: ((event as TouchEvent).changedTouches[0] as any)[
						key
					],
					configurable: true,
					enumerable: true
				});
			});
		}

		if (!(event as any).originalEvent) {
			(event as any).originalEvent = event;
		}

		if (
			event.type === 'paste' &&
			(event as ClipboardEvent).clipboardData === undefined &&
			(this.doc.defaultView as any).clipboardData
		) {
			Object.defineProperty(event, 'clipboardData', {
				get: () => {
					return (this.doc.defaultView as any).clipboardData;
				},
				configurable: true,
				enumerable: true
			});
		}
	};

	private triggerNativeEvent(
		element: Document | Element | HTMLElement | Window,
		event: string | Event | MouseEvent
	) {
		const evt: Event = this.doc.createEvent('HTMLEvents');

		if (typeof event === 'string') {
			evt.initEvent(event, true, true);
		} else {
			evt.initEvent(event.type, event.bubbles, event.cancelable);

			[
				'screenX',
				'screenY',
				'clientX',
				'clientY',
				'target',
				'srcElement',
				'currentTarget',
				'timeStamp',
				'which',
				'keyCode'
			].forEach(property => {
				Object.defineProperty(evt, property, {
					value: (event as any)[property],
					enumerable: true
				});
			});

			Object.defineProperty(evt, 'originalEvent', {
				value: event,
				enumerable: true
			});
		}

		element.dispatchEvent(evt);
	}

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
	get current(): string {
		return this.currents[this.currents.length - 1];
	}

	currents: string[] = [];

	/**
	 * Sets the handler for the specified event ( Event List ) for a given element .
	 *
	 * @param subjectOrEvents - The object for which to set an event handler
	 * @param eventsOrCallback - List of events, separated by a space or comma
	 * @param handlerOrSelector - The event handler
	 * @param selector - Selector for capturing
	 * @param onTop - Set handler in first
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
		callback: CallbackFunction,
		ignore?: void,
		onTop?: boolean
	): this;

	on(
		subjects: HTMLElement | HTMLElement[],
		events: string,
		handle: CallbackFunction,
		onTop?: boolean
	): this;

	on<T extends object>(
		subjects: T[] | T,
		events: string,
		handle: CallbackFunction,
		onTop?: boolean
	): this;

	on(
		subjectOrEvents: HTMLElement | HTMLElement[] | object | string,
		eventsOrCallback: string | CallbackFunction,
		handlerOrSelector?: CallbackFunction | void,
		onTop: boolean = false
	): this {
		const subject = isString(subjectOrEvents) ? this : subjectOrEvents;

		const events: string = isString(eventsOrCallback)
			? eventsOrCallback
			: (subjectOrEvents as string);

		let callback = handlerOrSelector as CallbackFunction;

		if (callback === undefined && isFunction(eventsOrCallback)) {
			callback = eventsOrCallback as CallbackFunction;
		}

		const store: EventHandlersStore = this.getStore(subject);

		if (!isString(events) || events === '') {
			throw error('Need events names');
		}

		if (!isFunction(callback)) {
			throw error('Need event handler');
		}

		if (isArray(subject)) {
			subject.forEach((subj: object) => {
				this.on(subj, events, callback, onTop);
			});

			return this;
		}

		const isDOMElement = isFunction(
				(subject as HTMLElement).addEventListener
			),
			self: EventEmitter = this;

		let syntheticCallback: CallbackFunction = function (
			this: any,
			event: string,
			...args: any[]
		): any {
			if (self.isMuted(event)) {
				return;
			}

			return callback && callback.call(this, ...args);
		};

		if (isDOMElement) {
			syntheticCallback = function (
				this: any,
				event: MouseEvent | TouchEvent
			): void | false {
				if (self.isMuted(event.type)) {
					return;
				}

				self.prepareEvent(event as TouchEvent);

				if (callback && callback.call(this, event) === false) {
					event.preventDefault();
					event.stopImmediatePropagation();
					return false;
				}

				return;
			};
		}

		this.eachEvent(events, (event: string, namespace: string): void => {
			if (event === '') {
				throw error('Need event name');
			}

			if (store.indexOf(event, namespace, callback) === false) {
				const block: EventHandlerBlock = {
					event,
					originalCallback: callback,
					syntheticCallback
				};

				store.set(event, namespace, block, onTop);

				if (isDOMElement) {
					const options: AddEventListenerOptions | false = [
						'touchstart',
						'touchend',
						'scroll',
						'mousewheel',
						'mousemove',
						'touchmove'
					].includes(event)
						? {
								passive: true
						  }
						: false;

					(subject as HTMLElement).addEventListener(
						event,
						syntheticCallback as EventListener,
						options
					);
				}
			}
		});

		return this;
	}

	one(
		subjectOrEvents: HTMLElement | HTMLElement[] | object | string,
		eventsOrCallback: string | CallbackFunction,
		handlerOrSelector?: CallbackFunction | void,
		onTop: boolean = false
	): this {
		const subject = isString(subjectOrEvents) ? this : subjectOrEvents;

		const events: string = isString(eventsOrCallback)
			? eventsOrCallback
			: (subjectOrEvents as string);

		let callback = handlerOrSelector as CallbackFunction;

		if (callback === undefined && isFunction(eventsOrCallback)) {
			callback = eventsOrCallback as CallbackFunction;
		}

		const newCallback = (...args: any) => {
			this.off(subject, events, newCallback);
			return callback(...args);
		};

		this.on(subject, events, newCallback, onTop);

		return this;
	}

	/**
	 * Disable all handlers specified event ( Event List ) for a given element. Either a specific event handler.
	 *
	 * @param subjectOrEvents - The object which is disabled handlers
	 * @param eventsOrCallback - List of events, separated by a space or comma , which is necessary
	 * to disable the handlers for a given object
	 * @param handler - Specific event handler to be removed
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
	off(events: string, callback?: CallbackFunction): this;
	off(subject: object, events?: string, handler?: CallbackFunction): this;
	off(
		subjectOrEvents: object | string,
		eventsOrCallback?: string | CallbackFunction,
		handler?: CallbackFunction
	): this {
		const subject: object = isString(subjectOrEvents)
			? this
			: subjectOrEvents;
		const events: string = isString(eventsOrCallback)
			? eventsOrCallback
			: (subjectOrEvents as string);

		const store: EventHandlersStore = this.getStore(subject);

		let callback: () => void = handler as () => void;

		if (!isString(events) || !events) {
			store.namespaces().forEach((namespace: string) => {
				this.off(subject, '.' + namespace);
			});

			this.clearStore(subject);

			return this;
		}

		if (callback === undefined && isFunction(eventsOrCallback)) {
			callback = eventsOrCallback as () => void;
		}

		const isDOMElement = isFunction((subject as any).removeEventListener),
			removeEventListener = (block: EventHandlerBlock) => {
				if (isDOMElement) {
					(subject as HTMLElement).removeEventListener(
						block.event,
						block.syntheticCallback as EventListener,
						false
					);
				}
			},
			removeCallbackFromNameSpace = (
				event: string,
				namespace: string
			) => {
				if (event !== '') {
					const blocks: EventHandlerBlock[] | void = store.get(
						event,
						namespace
					);
					if (blocks && blocks.length) {
						if (!isFunction(callback)) {
							blocks.forEach(removeEventListener);
							blocks.length = 0;
						} else {
							const index: number | false = store.indexOf(
								event,
								namespace,
								callback
							);
							if (index !== false) {
								removeEventListener(blocks[index]);
								blocks.splice(index, 1);
							}
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
			if (namespace === defaultNameSpace) {
				store.namespaces().forEach((name: string) => {
					removeCallbackFromNameSpace(event, name);
				});
			} else {
				removeCallbackFromNameSpace(event, namespace);
			}
		});

		return this;
	}

	/**
	 * Stop execute all another listeners for this event
	 */
	stopPropagation(events: string): void;
	stopPropagation(subject: object, eventsList: string): void;
	stopPropagation(
		subjectOrEvents: object | string,
		eventsList?: string
	): void {
		const subject: object = isString(subjectOrEvents)
			? this
			: subjectOrEvents;

		const events: string = isString(subjectOrEvents)
			? subjectOrEvents
			: (eventsList as string);

		if (typeof events !== 'string') {
			throw error('Need event names');
		}

		const store: EventHandlersStore = this.getStore(subject);

		this.eachEvent(events, (event: string, namespace: string): void => {
			const blocks: EventHandlerBlock[] | void = store.get(
				event,
				namespace
			);

			if (blocks) {
				this.__stopped.push(blocks);
			}

			if (namespace === defaultNameSpace) {
				store
					.namespaces(true)
					.forEach(ns =>
						this.stopPropagation(subject, event + '.' + ns)
					);
			}
		});
	}

	private __stopped: EventHandlerBlock[][] = [];

	private removeStop(currentBlocks: EventHandlerBlock[]) {
		if (currentBlocks) {
			const index: number = this.__stopped.indexOf(currentBlocks);
			index !== -1 && this.__stopped.splice(0, index + 1);
		}
	}

	private isStopped(currentBlocks: EventHandlerBlock[]): boolean {
		return (
			currentBlocks !== undefined &&
			this.__stopped.indexOf(currentBlocks) !== -1
		);
	}

	/**
	 * Emits an event to all handlers and calls them
	 *
	 * @param subjectOrEvents - The object which is caused by certain events
	 * @param eventsList - List of events , separated by a space or comma
	 * @param args - Options for the event handler
	 * @returns `false` if one of the handlers return `false`
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
	): any {
		let result: any, result_value: any;

		const subject: object = isString(subjectOrEvents)
			? this
			: subjectOrEvents;

		const events: string = isString(subjectOrEvents)
			? subjectOrEvents
			: (eventsList as string);

		const argumentsList: any[] = isString(subjectOrEvents)
			? [eventsList, ...args]
			: args;

		const isDOMElement: boolean = isFunction(
			(subject as any).dispatchEvent
		);

		if (!isDOMElement && !isString(events)) {
			throw error('Need events names');
		}

		const store: EventHandlersStore = this.getStore(subject);

		if (!isString(events) && isDOMElement) {
			this.triggerNativeEvent(subject as HTMLElement, eventsList);
		} else {
			this.eachEvent(events, (event: string, namespace: string): void => {
				if (isDOMElement) {
					this.triggerNativeEvent(subject as HTMLElement, event);
				} else {
					const blocks: EventHandlerBlock[] | void = store.get(
						event,
						namespace
					);

					if (blocks) {
						try {
							[...blocks].every(
								(block: EventHandlerBlock): boolean => {
									if (this.isStopped(blocks)) {
										return false;
									}

									this.currents.push(event);

									result_value = block.syntheticCallback.call(
										subject,
										event,
										...argumentsList
									);

									this.currents.pop();

									if (result_value !== undefined) {
										result = result_value;
									}

									return true;
								}
							);
						} finally {
							this.removeStop(blocks);
						}
					}

					if (namespace === defaultNameSpace && !isDOMElement) {
						store
							.namespaces()
							.filter(ns => ns !== namespace)
							.forEach((ns: string) => {
								const result_second: any = this.fire.apply(
									this,
									[
										subject,
										event + '.' + ns,
										...argumentsList
									]
								);
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

	private isDestructed: boolean = false;

	constructor(doc?: Document) {
		if (doc) {
			this.doc = doc;
		}

		this.__key += new Date().getTime();
	}

	destruct(): void {
		if (!this.isDestructed) {
			return;
		}

		this.isDestructed = true;

		this.off(this);

		this.getStore(this).clear();
		delete (this as any)[this.__key];
	}
}
