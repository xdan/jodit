/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:core/event-emitter/README.md]]
 * @packageDocumentation
 * @module event-emitter
 */

import type {
	CallbackFunction,
	CanArray,
	CanUndef,
	EventHandlerBlock,
	IEventEmitter,
	IEventEmitterOnOptions
} from 'jodit/types';
import { defaultNameSpace, EventHandlersStore } from './store';
import { isString, isStringArray } from 'jodit/core/helpers/checker/is-string';
import { isFunction } from 'jodit/core/helpers/checker/is-function';
import { isArray } from 'jodit/core/helpers/checker/is-array';
import { error } from 'jodit/core/helpers/utils/error';
import { splitArray } from 'jodit/core/helpers/array/split-array';

/**
 * The module editor's event manager
 */
export class EventEmitter implements IEventEmitter {
	private __mutedEvents: Set<string> = new Set();

	mute(event?: string): this {
		this.__mutedEvents.add(event ?? '*');
		return this;
	}

	isMuted(event?: string): boolean {
		if (event && this.__mutedEvents.has(event)) {
			return true;
		}

		return this.__mutedEvents.has('*');
	}

	unmute(event?: string): this {
		this.__mutedEvents.delete(event ?? '*');
		return this;
	}

	readonly __key: string = '__JoditEventEmitterNamespaces';

	private __doc: Document = document;

	private __eachEvent(
		events: CanArray<string>,
		callback: (event: string, namespace: string) => void
	): void {
		const eventParts = splitArray(events).map(e => e.trim());

		eventParts.forEach(eventNameSpace => {
			const eventAndNameSpace = eventNameSpace.split('.');
			const namespace = eventAndNameSpace[1] || defaultNameSpace;
			callback.call(this, eventAndNameSpace[0], namespace);
		});
	}

	private __getStore(subject: any): EventHandlersStore {
		if (!subject) {
			throw error('Need subject');
		}

		if (subject[this.__key] === undefined) {
			const store = new EventHandlersStore();

			Object.defineProperty(subject, this.__key, {
				enumerable: false,
				configurable: true,
				writable: true,
				value: store
			});
		}

		return subject[this.__key];
	}

	private __removeStoreFromSubject(subject: any): void {
		if (subject[this.__key] !== undefined) {
			Object.defineProperty(subject, this.__key, {
				enumerable: false,
				configurable: true,
				writable: true,
				value: undefined
			});
		}
	}

	private __prepareEvent = (
		e: TouchEvent | MouseEvent | ClipboardEvent
	): void => {
		if (e.cancelBubble) {
			return;
		}

		// for Shadow Dom
		if (e.composed && isFunction(e.composedPath) && e.composedPath()[0]) {
			Object.defineProperty(e, 'target', {
				value: e.composedPath()[0],
				configurable: true,
				enumerable: true
			});
		}

		if (
			e.type.match(/^touch/) &&
			(e as TouchEvent).changedTouches &&
			(e as TouchEvent).changedTouches.length
		) {
			['clientX', 'clientY', 'pageX', 'pageY'].forEach((key: string) => {
				Object.defineProperty(e, key, {
					value: ((e as TouchEvent).changedTouches[0] as any)[key],
					configurable: true,
					enumerable: true
				});
			});
		}

		if (!(e as any).originalEvent) {
			(e as any).originalEvent = e;
		}

		if (
			e.type === 'paste' &&
			(e as ClipboardEvent).clipboardData === undefined &&
			(this.__doc.defaultView as any).clipboardData
		) {
			Object.defineProperty(e, 'clipboardData', {
				get: () => {
					return (this.__doc.defaultView as any).clipboardData;
				},
				configurable: true,
				enumerable: true
			});
		}
	};

	private __triggerNativeEvent(
		element: Document | Element | HTMLElement | Window,
		event: string | Event | MouseEvent
	): void {
		const evt = this.__doc.createEvent('HTMLEvents');

		if (isString(event)) {
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
	 * Sets the handler for the specified event ( Event List ) for a given element
	 *
	 * @example
	 * ```javascript
	 * // set global handler
	 * editor.events.on('beforeCommand', function (command) {
	 *     alert('command');
	 * });
	 * ```
	 * * @example
	 * ```javascript
	 * // set global handler
	 * editor.events.on(document.body, 'click', function (e) {
	 *     alert(this.href);
	 * });
	 * ```
	 */
	on(
		events: CanArray<string>,
		callback: CallbackFunction,
		options?: IEventEmitterOnOptions
	): this;

	on(
		subjects: CanArray<HTMLElement | Window | object>,
		events: CanArray<string>,
		callback: CallbackFunction,
		options?: IEventEmitterOnOptions
	): this;

	on(
		eventsOrSubjects:
			| CanArray<string>
			| CanArray<HTMLElement | Window | object>,
		callbackOrEvents: CallbackFunction | CanArray<string>,
		optionsOrCallback: IEventEmitterOnOptions | CallbackFunction | void,
		opts?: IEventEmitterOnOptions
	): this {
		let subjects: CanArray<HTMLElement | Window | object>;
		let events: CanArray<string>;
		let callback: CallbackFunction;
		let options: CanUndef<IEventEmitterOnOptions>;

		if (isString(eventsOrSubjects) || isStringArray(eventsOrSubjects)) {
			subjects = this;
			events = eventsOrSubjects;
			callback = callbackOrEvents as CallbackFunction;
			options = optionsOrCallback as IEventEmitterOnOptions;
		} else {
			subjects = eventsOrSubjects;
			events = callbackOrEvents as CanArray<string>;
			callback = optionsOrCallback as CallbackFunction;
			options = opts;
		}

		if (
			!(isString(events) || isStringArray(events)) ||
			events.length === 0
		) {
			throw error('Need events names');
		}

		if (!isFunction(callback)) {
			throw error('Need event handler');
		}

		if (isArray(subjects)) {
			subjects.forEach(subj => {
				this.on(subj, events, callback, options);
			});

			return this;
		}

		const subject = subjects;

		const store = this.__getStore(subject);

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

				self.__prepareEvent(event as TouchEvent);

				if (callback && callback.call(this, event) === false) {
					event.preventDefault();
					event.stopImmediatePropagation();
					return false;
				}

				return;
			};
		}

		this.__eachEvent(events, (event: string, namespace: string): void => {
			if (event.length === 0) {
				throw error('Need event name');
			}

			if (store.indexOf(event, namespace, callback) === false) {
				const block: EventHandlerBlock = {
					event,
					originalCallback: callback,
					syntheticCallback
				};

				store.set(event, namespace, block, options?.top);

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
		eventsOrSubjects:
			| CanArray<string>
			| CanArray<HTMLElement | Window | object>,
		callbackOrEvents: CallbackFunction | CanArray<string>,
		optionsOrCallback: IEventEmitterOnOptions | CallbackFunction | void,
		opts?: IEventEmitterOnOptions
	): this {
		let subjects: CanArray<HTMLElement | Window | object>;
		let events: CanArray<string>;
		let callback: CallbackFunction;
		let options: CanUndef<IEventEmitterOnOptions>;

		if (isString(eventsOrSubjects) || isStringArray(eventsOrSubjects)) {
			subjects = this;
			events = eventsOrSubjects;
			callback = callbackOrEvents as CallbackFunction;
			options = optionsOrCallback as IEventEmitterOnOptions;
		} else {
			subjects = eventsOrSubjects;
			events = callbackOrEvents as CanArray<string>;
			callback = optionsOrCallback as CallbackFunction;
			options = opts;
		}

		const newCallback = (...args: any): void => {
			this.off(subjects, events, newCallback);
			return callback(...args);
		};

		this.on(subjects, events, newCallback, options);

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
	off(events: CanArray<string>, callback?: CallbackFunction): this;

	off(
		subjects: CanArray<Window | HTMLElement | object>,
		events?: CanArray<string>,
		callback?: CallbackFunction
	): this;

	off(
		eventsOrSubjects:
			| CanArray<string>
			| CanArray<Window | HTMLElement | object>,
		callbackOrEvents?: CallbackFunction | CanArray<string>,
		handler?: CallbackFunction
	): this {
		let subjects: CanArray<HTMLElement | Window | object>;
		let events: CanArray<string>;
		let callback: CanUndef<CallbackFunction>;

		if (isString(eventsOrSubjects) || isStringArray(eventsOrSubjects)) {
			subjects = this;
			events = eventsOrSubjects;
			callback = callbackOrEvents as CallbackFunction;
		} else {
			subjects = eventsOrSubjects;
			events = callbackOrEvents as CanArray<string>;
			callback = handler;
		}

		if (isArray(subjects)) {
			subjects.forEach(subj => {
				this.off(subj, events, callback);
			});

			return this;
		}

		const subject = subjects;

		const store = this.__getStore(subject);

		if (
			!(isString(events) || isStringArray(events)) ||
			events.length === 0
		) {
			store.namespaces().forEach((namespace: string) => {
				this.off(subject, '.' + namespace);
			});
			this.__removeStoreFromSubject(subject);
			return this;
		}

		const isDOMElement = isFunction(
				(subject as HTMLElement).removeEventListener
			),
			removeEventListener = (block: EventHandlerBlock): void => {
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
			): void => {
				if (event === '') {
					store.events(namespace).forEach((eventName: string) => {
						if (eventName !== '') {
							removeCallbackFromNameSpace(eventName, namespace);
						}
					});
					return;
				}

				const blocks = store.get(event, namespace);

				if (!blocks || !blocks.length) {
					return;
				}

				if (!isFunction(callback)) {
					blocks.forEach(removeEventListener);
					blocks.length = 0;
					store.clearEvents(namespace, event);
				} else {
					const index = store.indexOf(event, namespace, callback);

					if (index !== false) {
						removeEventListener(blocks[index]);
						blocks.splice(index, 1);

						if (!blocks.length) {
							store.clearEvents(namespace, event);
						}
					}
				}
			};

		this.__eachEvent(events, (event, namespace): void => {
			if (namespace === defaultNameSpace) {
				store.namespaces().forEach(namespace => {
					removeCallbackFromNameSpace(event, namespace);
				});
			} else {
				removeCallbackFromNameSpace(event, namespace);
			}
		});

		if (store.isEmpty()) {
			this.__removeStoreFromSubject(subject);
		}

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

		const store = this.__getStore(subject);

		this.__eachEvent(events, (event: string, namespace: string): void => {
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

	private __removeStop(currentBlocks: EventHandlerBlock[]): void {
		if (currentBlocks) {
			const index: number = this.__stopped.indexOf(currentBlocks);
			index !== -1 && this.__stopped.splice(0, index + 1);
		}
	}

	private __isStopped(currentBlocks: EventHandlerBlock[]): boolean {
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

		const store = this.__getStore(subject);

		if (!isString(events) && isDOMElement) {
			this.__triggerNativeEvent(subject as HTMLElement, eventsList);
		} else {
			this.__eachEvent(
				events,
				(event: string, namespace: string): void => {
					if (isDOMElement) {
						this.__triggerNativeEvent(
							subject as HTMLElement,
							event
						);
					} else {
						const blocks = store.get(event, namespace);

						if (blocks) {
							try {
								[...blocks].every(
									(block: EventHandlerBlock): boolean => {
										if (this.__isStopped(blocks)) {
											return false;
										}

										this.currents.push(event);

										result_value =
											block.syntheticCallback.call(
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
								this.__removeStop(blocks);
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
				}
			);
		}

		return result;
	}

	private __isDestructed: boolean = false;

	constructor(doc?: Document) {
		if (doc) {
			this.__doc = doc;
		}

		this.__key += new Date().getTime();
	}

	destruct(): void {
		if (!this.__isDestructed) {
			return;
		}

		this.__isDestructed = true;

		this.off(this);

		this.__getStore(this).clear();
		this.__removeStoreFromSubject(this);
	}
}
