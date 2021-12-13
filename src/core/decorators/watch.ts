/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type {
	CanUndef,
	DecoratorHandler,
	IComponent,
	IDictionary,
	IViewComponent
} from '../../types';
import {
	error,
	isFunction,
	isPlainObject,
	isViewObject,
	splitArray
} from '../helpers';
import { ObserveObject } from '../event-emitter';
import { STATUSES } from '../component';

/**
 * The decorator allows you to hang handlers on changes to the internal fields of the component,
 * as well as on any events [[EventEmitter]]
 *
 * For example, we will make a reactive component that will change its color when its field changes:
 *
 * ```ts
 * import { component, watch, hook } from 'jodit/src/core/decorators';
 * import { UIElement } from 'jodit/src/ui';
 *
 * @component()
 * class UISomeReactElement extends UIElement {
 * 	state = {
 * 		color: 'red'
 * 	}
 *
 * 	render(): string {
 * 		return `<div>
 * 			This text must be colored
 * 		</div>`
 * 	}
 *
 * 	@hook('ready')
 * 	@watch('state.color')
 * 	onChangeColor(): void {
 * 	  this.container.style.color = this.state.color;
 * 	}
 * }
 *
 * const elm = new UISomeReactElement(jodit);
 * elm.state.color = 'yellow';
 * ```
 *
 * The decorator can also be used to hang event handlers [[EventEmitter]]
 *
 * Then the call signature has its own syntax:
 * - `:{EVENT}`
 * - `{CONTEXT}:{EVENT}`
 * - `{CONTEXT}:{EVENT.NAMESPACE}`
 *
 * For example, this is how you can hang a click handler on the component container:
 *
 * ```ts
 * @component()
 * class UIButtonElement extends UIElement {
 * 	state = {
 * 		counter: 0
 * 	}
 *
 * 	render(): string {
 * 		return `<button>text</button>`
 * 	}
 *
 * 	@watch('container:click') // Same this.j.e(this.container, 'click', this.onClick.bind(this))
 * 	onClick(): void {
 * 		this.state.counter++;
 * 	}
 *
 * 	@watch('state.counter')
 * 	onClick(): void {
 * 		this.container.innerText = `Clicked ` + this.state.counter
 * 	}
 * }
 * ```
 *
 * The context can be specified as a path to an object, and even as the name of a BEM interface element
 *
 * ```ts
 * @component()
 * class UICard extends UIElement {
 * 	state = {
 * 		counter: 0
 * 	}
 *
 * 	render(): string {
 * 		return `<div>
 * 		  Clicked <span class="&__counter"></span>
 * 		  <button class="&__card-button">Click</button>
 * 		</div>`
 * 	}
 *
 * 	@watch('card-button:click') // As this.j.e.on(this.getElm('card-button'), 'click', this.onClick.bind(this))
 * 	onClick(): void {
 * 		this.state.counter++;
 * 	}
 *
 * 	@watch('jodit.editor:focus') // As this.j.e.on(this.j.editor, 'focus', this.onJoditEditorFocus.bind(this))
 * 	onJoditEditorFocus(): void {
 * 		alert('Focused')
 * 	}
 *
 * 	@watch(':afterSetMode') // As this.j.e.on('afterSetMode', this.onAfterSetMode.bind(this))
 * 	onAfterSetMode(): void {
 * 		alert(this.jodit.mode)
 * 	}
 *
 * 	@watch('state.counter')
 * 	onClick(): void {
 * 		this.getElm('counter').innerText = this.state.counter
 * 	}
 * }
 * ```
 *
 * Also, the context can be set differently by setting it as the second parameter,
 * or by setting the function as the second parameter that will return the context
 *
 * ```ts
 * @component()
 * class UICardExt extends UICard {
 * 	@watch(':click', (ctx) => ctx.getElm('card-button')) // As this.j.e.on(this.getElm('card-button'), 'click', this.onClick.bind(this))
 * 	onClick(): void {
 * 		this.state.counter++;
 * 	}
 * }
 * ```
 *
 * The first argument can be an array:
 * ```ts
 * @component()
 * class UICardExt extends UICard {
 * 	@watch(['card-button:click','card-button:mouseup','card-button:mousedown'])
 * 	onMouseEvents(e): void {
 * 		e.preventDefault();
 * 	}
 * }
 * ```
 *
 * @module decorators/watch
 */

export function getPropertyDescriptor(
	obj: unknown,
	prop: string
): CanUndef<PropertyDescriptor> {
	let desc;

	do {
		desc = Object.getOwnPropertyDescriptor(obj, prop);
		obj = Object.getPrototypeOf(obj);
	} while (!desc && obj);

	return desc;
}

/**
 * Watch decorator. Added observer for some change in field value
 */
export function watch(
	observeFields: string[] | string,
	context?: object | ((c: IDictionary) => object)
): DecoratorHandler {
	return <T extends IComponent & IDictionary>(
		target: T,
		propertyKey: string
	) => {
		if (!isFunction(target[propertyKey])) {
			throw error('Handler must be a Function');
		}

		const process = (component: IComponent) => {
			const callback = (key: string, ...args: any[]): void | any => {
				if (!component.isInDestruct) {
					return (component as any)[propertyKey](key, ...args);
				}
			};

			splitArray(observeFields).forEach(field => {
				if (/:/.test(field)) {
					const [objectPath, eventName] = field.split(':');

					const view = isViewObject(component)
						? component
						: (component as unknown as IViewComponent).jodit;

					if (objectPath.length) {
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						context = component.get<CanUndef<object>>(objectPath)!;
					}

					if (isFunction(context)) {
						context = context(component);
					}

					view.events.on(context || component, eventName, callback);

					if (!context) {
						view.events.on(eventName, callback);
					}

					view.hookStatus('beforeDestruct', () => {
						view.events
							.off(context || component, eventName, callback)
							.off(eventName, callback);
					});

					return;
				}

				const parts = field.split('.'),
					[key] = parts as unknown as Array<keyof IComponent>;

				let value: any = component[key];

				if (value instanceof ObserveObject) {
					value.on(`change.${field}`, callback);
				} else if (isPlainObject(value) && parts.length > 1) {
					const observe = ObserveObject.create(value, [key]);
					observe.on(`change.${field}`, callback);
					(component as any)[key] = observe;
				} else {
					const descriptor = getPropertyDescriptor(target, key);

					Object.defineProperty(component, key, {
						configurable: true,
						set(v: any): void {
							const oldValue = value;

							if (oldValue === v) {
								return;
							}

							value = v;
							if (descriptor && descriptor.set) {
								descriptor.set.call(component, v);
							}

							if (isPlainObject(value)) {
								value = ObserveObject.create(value, [key]);
								value.on('change.' + field, callback);
							}

							callback(key, oldValue, value);
						},
						get(): any {
							if (descriptor && descriptor.get) {
								return descriptor.get.call(component);
							}

							return value;
						}
					});
				}
			});
		};

		if (isFunction(target.hookStatus)) {
			target.hookStatus(STATUSES.ready, process);
		} else {
			process(target);
		}
	};
}

export default watch;
