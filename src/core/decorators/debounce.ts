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
 * @param timeout
 * @param firstCallImmediately
 */
export function debounce(
	timeout?: number | ((ctx: IViewComponent | IViewBased) => number),
	firstCallImmediately: boolean = false
) {
	return <T extends Component & IDictionary>(
		target: IDictionary,
		propertyKey: string
	): void => {
		if (!isFunction(target[propertyKey])) {
			throw error('Handler must be a Function');
		}

		target.hookStatus(
			STATUSES.ready,
			(component: IViewComponent | IViewBased) => {
				const view = isViewObject(component) ? component : component.j;
				const realTimeout = isFunction(timeout)
					? timeout(component)
					: timeout;

				(component as any)[propertyKey] = view.async.debounce(
					(component as any)[propertyKey].bind(component),
					isNumber(realTimeout) ? realTimeout : view.defaultTimeout,
					firstCallImmediately
				);
			}
		);
	};
}
