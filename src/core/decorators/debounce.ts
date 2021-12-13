/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * Wraps a component method in [[Async.debounce]]. This makes it possible to reduce the load on 'heavy' functions.
 * For example:
 *
 * ```typescript
 * import { component, watch, debounce } from 'jodit/src/core/decorators';
 * import { Dom } from 'jodit/src/core/dom';
 *
 * @component()
 * class UIInputSuggestion extends UIElement {
 * 	override render(): string {
 * 		return `<div>
 * 			<input class="&__inputElement" type="text"/>
 * 			<div class="&__suggestions"></div>
 * 		</div>`; // container
 * 	}
 *
 * 	state = {
 * 		suggestions: []
 * 	};
 *
 * // adds a listener for the container to the `input` event
 * 	@watch(':inputElement.input')
 * 	@debounce(100)
 * 	protected onInputQuery(): void {
 * 		fetch('search.php?q=' + encodeURIComponent(this.container.value))
 * 			.then((resp) => {
 * 				this.state.suggestions = resp.json();
 * 			})
 * 	}
 *
 * 	@watch('state.suggestions') // react on change `state.suggestions`
 * 	@debounce(100)
 * 	protected onChangeSuggestions(): void {
 * 		Dom.detach(this.getElm('suggestions')); // clear liist
 *
 * 		this.state.suggestions.forEach((item) => {
 * 			const elm = this.jodit.ci.div();
 * 			elm.innerText = item.title;
 * 			this.getElm('suggestions').appendChild(div);
 * 		});
 * 	}
 * }
 * ```
 * @module decorators/debounce
 */

import type {
	IDictionary,
	IViewBased,
	IViewComponent,
	IAsyncParams,
	DecoratorHandler
} from '../../types';
import {
	error,
	isFunction,
	isNumber,
	isPlainObject,
	isViewObject
} from '../helpers';
import { Component, STATUSES } from '../component';

/**
 * Wrap function in debounce wrapper
 */
export function debounce<V = IViewComponent | IViewBased>(
	timeout?: number | ((ctx: V) => number | IAsyncParams) | IAsyncParams,
	firstCallImmediately: boolean = false,
	method: 'debounce' | 'throttle' = 'debounce'
): DecoratorHandler {
	return <T extends Component & IDictionary>(
		target: IDictionary,
		propertyKey: string
	): void => {
		if (!isFunction(target[propertyKey])) {
			throw error('Handler must be a Function');
		}

		target.hookStatus(STATUSES.ready, (component: V) => {
			const view = isViewObject(component)
				? component
				: (component as unknown as IViewComponent).jodit;

			const realTimeout = isFunction(timeout)
				? timeout(component)
				: timeout;

			(component as any)[propertyKey] = view.async[method](
				(component as any)[propertyKey].bind(component),
				isNumber(realTimeout) || isPlainObject(realTimeout)
					? realTimeout
					: view.defaultTimeout,
				firstCallImmediately
			);
		});
	};
}

/**
 * Wrap function in throttle wrapper
 */
export function throttle<V = IViewComponent | IViewBased>(
	timeout?: number | ((ctx: V) => number | IAsyncParams) | IAsyncParams,
	firstCallImmediately: boolean = false
): DecoratorHandler {
	return debounce<V>(timeout, firstCallImmediately, 'throttle');
}
