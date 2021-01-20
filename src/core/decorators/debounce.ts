/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IDictionary, IViewBased, IViewComponent } from '../../types';
import { error, isFunction, isNumber, isViewObject } from '../helpers';
import { Component, STATUSES } from '../component';

/**
 * Wrap function in debounce wrapper
 *
 * @param timeout
 * @param firstCallImmediately
 * @param method
 */
export function debounce<V = IViewComponent | IViewBased>(
	timeout?: number | ((ctx: V) => number),
	firstCallImmediately: boolean = false,
	method: 'debounce' | 'throttle' = 'debounce'
) {
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
				: ((component as unknown) as IViewComponent).jodit;

			const realTimeout = isFunction(timeout)
				? timeout(component)
				: timeout;

			(component as any)[propertyKey] = view.async[method](
				(component as any)[propertyKey].bind(component),
				isNumber(realTimeout) ? realTimeout : view.defaultTimeout,
				firstCallImmediately
			);
		});
	};
}

/**
 * Wrap function in throttle wrapper
 *
 * @param timeout
 * @param firstCallImmediately
 * @param method
 */
export function throttle<V = IViewComponent | IViewBased>(
	timeout?: number | ((ctx: V) => number),
	firstCallImmediately: boolean = false
) {
	return debounce<V>(timeout, firstCallImmediately, 'throttle');
}
