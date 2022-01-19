/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:core/decorators/idle/README.md]]
 * @packageDocumentation
 * @module decorators/idle
 */

import type {
	DecoratorHandler,
	IDictionary,
	IViewBased,
	IViewComponent
} from 'jodit/types';
import { Component, STATUSES } from 'jodit/core/component';
import { error, isFunction, isViewObject } from 'jodit/core/helpers';

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
