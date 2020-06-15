/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IDictionary, IViewBased, IViewComponent } from '../../types';
import { error, isFunction, isViewObject } from '../helpers';
import { Component, STATUSES } from '../component';

/**
 * Wrap function in debounce wrapper
 * @param timeout
 */
export function debounce(
	timeout?: number | ((ctx: IViewComponent | IViewBased) => number)
) {
	return <T extends Component & IDictionary>(
		target: IDictionary,
		propertyKey: string
	) => {
		if (!isFunction(target[propertyKey])) {
			throw error('Handler must be a Function');
		}

		target.hookStatus(
			STATUSES.ready,
			(component: IViewComponent | IViewBased) => {
				const view = isViewObject(component) ? component : component.j;

				(component as any)[propertyKey] = view.async.debounce(
					(component as any)[propertyKey].bind(component),
					(isFunction(timeout) ? timeout(component) : timeout) ||
						view.defaultTimeout
				);
			}
		);
	};
}
