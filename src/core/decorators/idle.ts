/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import type {
	DecoratorHandler,
	IDictionary,
	IViewBased,
	IViewComponent
} from '../../types';
import { Component, STATUSES } from '../component';
import { error, isFunction, isViewObject } from '../helpers';

/**
 * Wrap function in requestIdleCallback wrapper*
 */
export function idle<V = IViewComponent | IViewBased>(): DecoratorHandler {
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

			const originalMethod = (component as any)[propertyKey];

			(component as any)[propertyKey] = (...args: unknown[]) =>
				view.async.requestIdleCallback(
					originalMethod.bind(component, ...args)
				);
		});
	};
}
