/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright 2013-2020 Valeriy Chupurnov https://xdsoft.net
 */

/**
 * The module editor's event manager
 */

import { CallbackFunction, EventHandlerBlock } from '../../types';
import { defaultNameSpace, EventHandlersStore } from './store';
import { IEventsNative } from '../../types/events';
import { error } from '../helpers';

export class EventsNative implements IEventsNative {
	readonly __key: string = '__JoditEventsNativeNamespaces';

	private doc: Document = document;

	private __stopped: EventHandlerBlock[][] = [];

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

	private removeStop(currentBlocks: EventHandlerBlock[]) {
		if (currentBlocks) {
			const index: number = this.__stopped.indexOf(currentBlocks);
			index !== -1 && this.__stopped.splice(index, 1);
		}
	}

	private isStopped(currentBlocks: EventHandlerBlock[]): boolean {
		return (
			currentBlocks !== undefined &&
			this.__stopped.indexOf(currentBlocks) !== -1
		);
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
	current: string[] = [];

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
	): EventsNative;

	on(
		subjectOrEvents: object,
		eventsOrCallback: string,
		handlerOrSelector: CallbackFunction,
		selector?: string,
		onTop?: boolean
	): EventsNative;

	on(
		subjectOrEvents: object | string,
		eventsOrCallback: string | CallbackFunction,
		handlerOrSelector?: CallbackFunction | void,
		selector?: string,
		onTop: boolean = false
	): EventsNative {
		const subject: object =
			typeof subjectOrEvents === 'string' ? this : subjectOrEvents;

		const events: string =
			typeof eventsOrCallback === 'string'
				? eventsOrCallback
				: (subjectOrEvents as string);

		let callback = handlerOrSelector as CallbackFunction;

		if (callback === undefined && typeof eventsOrCallback === 'function') {
			callback = eventsOrCallback as CallbackFunction;
		}

		const store: EventHandlersStore = this.getStore(subject);

		if (typeof events !== 'string' || events === '') {
			throw error('Need events names');
		}

		if (typeof callback !== 'function') {
			throw error('Need event handler');
		}

		if (Array.isArray(subject)) {
			subject.forEach((subj: object) => {
				this.on(subj, events, callback, selector);
			});

			return this;
		}

		const isDOMElement: boolean =
			typeof (subject as any).addEventListener === 'function',
			self: EventsNative = this;

		let syntheticCallback = function(
			this: any,
			event: MouseEvent | TouchEvent
		) {
			return callback && callback.apply(this, arguments as any);
		};

		if (isDOMElement) {
			syntheticCallback = function(
				this: any,
				event: MouseEvent | TouchEvent
			): void | false {
				self.prepareEvent(event as TouchEvent);

				if (callback && callback.call(this, event) === false) {
					event.preventDefault();
					event.stopImmediatePropagation();
					return false;
				}

				return;
			};

			if (selector) {
				syntheticCallback = function(
					this: any,
					event: TouchEvent | MouseEvent
				): false | void {
					self.prepareEvent(event);
					let node: Element | null = event.target as any;
					while (node && node !== this) {
						if (node.matches(selector as string)) {
							Object.defineProperty(event, 'target', {
								value: node,
								configurable: true,
								enumerable: true
							});

							if (
								callback &&
								callback.call(node, event) === false
							) {
								event.preventDefault();
								return false;
							}

							return;
						}
						node = node.parentNode as Element | null;
					}
				};
			}
		}

		this.eachEvent(
			events,
			(event: string, namespace: string): void => {
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
						(subject as HTMLElement).addEventListener(
							event,
							syntheticCallback as EventListener,
							false
						);
					}
				}
			}
		);

		return this;
	}

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
	off(subjectOrEvents: string, eventsOrCallback?: () => void): EventsNative;
	off(
		subjectOrEvents: object,
		eventsOrCallback?: string,
		handler?: () => void
	): EventsNative;
	off(
		subjectOrEvents: object | string,
		eventsOrCallback?: string | (() => void),
		handler?: () => void
	): EventsNative {
		const subject: object =
			typeof subjectOrEvents === 'string' ? this : subjectOrEvents;
		const events: string =
			typeof eventsOrCallback === 'string'
				? eventsOrCallback
				: (subjectOrEvents as string);

		const store: EventHandlersStore = this.getStore(subject);

		let callback: () => void = handler as () => void;

		if (typeof events !== 'string' || !events) {
			store.namespaces().forEach((namespace: string) => {
				this.off(subject, '.' + namespace);
			});

			this.clearStore(subject);

			return this;
		}

		if (callback === undefined && typeof eventsOrCallback === 'function') {
			callback = eventsOrCallback as () => void;
		}

		const isDOMElement: boolean =
			typeof (subject as any).removeEventListener === 'function',
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
						if (typeof callback !== 'function') {
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

		this.eachEvent(
			events,
			(event: string, namespace: string): void => {
				if (namespace === defaultNameSpace) {
					store.namespaces().forEach((name: string) => {
						removeCallbackFromNameSpace(event, name);
					});
				} else {
					removeCallbackFromNameSpace(event, namespace);
				}
			}
		);

		return this;
	}

	/**
	 * Stop execute all another listeners for this event
	 *
	 * @param subjectOrEvents
	 * @param eventsList
	 */
	stopPropagation(subjectOrEvents: string): void;
	stopPropagation(subjectOrEvents: object, eventsList: string): void;
	stopPropagation(subjectOrEvents: object | string, eventsList?: string) {
		const subject: object =
			typeof subjectOrEvents === 'string' ? this : subjectOrEvents;

		const events: string =
			typeof subjectOrEvents === 'string'
				? subjectOrEvents
				: (eventsList as string);

		if (typeof events !== 'string') {
			throw error('Need event names');
		}

		const store: EventHandlersStore = this.getStore(subject);

		this.eachEvent(
			events,
			(event: string, namespace: string): void => {
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
			}
		);
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
	): any {
		let
			result: any = undefined,
			result_value: any;

		const subject: object =
			typeof subjectOrEvents === 'string' ? this : subjectOrEvents;

		const events: string =
			typeof subjectOrEvents === 'string'
				? subjectOrEvents
				: (eventsList as string);

		const argumentsList: any[] =
			typeof subjectOrEvents === 'string' ? [eventsList, ...args] : args;

		const isDOMElement: boolean =
			typeof (subject as any).dispatchEvent === 'function';

		if (!isDOMElement && typeof events !== 'string') {
			throw error('Need events names');
		}

		const store: EventHandlersStore = this.getStore(subject);

		if (typeof events !== 'string' && isDOMElement) {
			this.triggerNativeEvent(subject as HTMLElement, eventsList);
		} else {
			this.eachEvent(
				events,
				(event: string, namespace: string): void => {
					if (isDOMElement) {
						this.triggerNativeEvent(subject as HTMLElement, event);
					} else {
						const blocks: EventHandlerBlock[] | void = store.get(
							event,
							namespace
						);
						if (blocks) {
							try {
								blocks.every(
									(block: EventHandlerBlock): boolean => {
										if (this.isStopped(blocks)) {
											return false;
										}

										this.current.push(event);

										result_value = block.syntheticCallback.apply(
											subject,
											argumentsList
										);

										this.current.pop();

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
				}
			);
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

	destruct() {
		if (!this.isDestructed) {
			return;
		}

		this.isDestructed = true;

		this.off(this);

		this.getStore(this).clear();
		delete (<any>this)[this.__key];
	}
}
